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
    const recipient = content.contactForm?.recipientEmail ?? null;

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

  // Transport first: with no API key every send would fail and every response
  // would be burned to "failed". Cancelling leaves them pending for a later run.
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({
      reason: "transport-not-configured",
      status: "cancelled",
    });
  }

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
