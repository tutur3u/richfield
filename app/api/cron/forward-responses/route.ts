import { getRichfieldContent } from "@/lib/richfield-delivery";
import {
  fetchPendingSubmissions,
  forwardPendingResponses,
  isUsableEmail,
  markSubmissionStatus,
  sendForwardedEmail,
} from "@/lib/richfield-response-forwarding";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * A run forwards up to 100 responses one at a time, so it needs far more than
 * the default ceiling. Being killed midway is safe — each response is marked as
 * it is sent — but the rest would wait four hours for the next run.
 */
export const maxDuration = 300;

/**
 * Vercel cron sends `Authorization: Bearer $CRON_SECRET`. Without a configured
 * secret the endpoint is refused outright rather than left open — it spends
 * money on every call.
 */
function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;

  if (!secret) return false;

  return request.headers.get("authorization") === `Bearer ${secret}`;
}

async function resolveRecipient() {
  try {
    const content = await getRichfieldContent();
    const recipient =
      content.contactForm?.recipientEmails?.join(",") ??
      content.contactForm?.recipientEmail ??
      null;

    return isUsableEmail(recipient) ? recipient : null;
  } catch (error) {
    console.error("[richfield:forwarding] could not read forwarding inbox", error);
    return null;
  }
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Mail goes through Tuturuuu's SES-backed mailer using the app credentials
  // this site already holds, so there is no separate transport key to check —
  // if those are missing the run cancels below when the inbox cannot be read.
  try {
    const outcome = await forwardPendingResponses({
      fetchPending: fetchPendingSubmissions,
      markStatus: markSubmissionStatus,
      resolveRecipient,
      sendEmail: sendForwardedEmail,
    });

    return NextResponse.json(outcome);
  } catch (error) {
    console.error("[richfield:forwarding] run failed", error);
    return NextResponse.json({ error: "Forwarding run failed" }, { status: 500 });
  }
}
