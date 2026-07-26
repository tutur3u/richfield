import { site } from "@/content/en/site";
import {
  getOptionalRichfieldWorkspaceId,
  getRichfieldApiBaseUrl,
  getRichfieldAppId,
  getRichfieldAppSecret,
} from "./richfield-config";
import { fetchWithRichfieldTimeout } from "./richfield-fetch";

/**
 * Every forwarded response costs this much to send. Metrics are derived from
 * it rather than stored alongside each row, so a price change re-prices the
 * whole history consistently instead of leaving a mix of old and new rates.
 */
export const RICHFIELD_EMAIL_UNIT_PRICE_VND = 25;

export type RichfieldPendingSubmission = {
  id: string;
  title: string | null;
  subtitle: string | null;
  summary: string | null;
  profile_data: Record<string, unknown> | null;
};

export type RichfieldForwardOutcome =
  | {
      // The operator has not configured an inbox yet, so there is nothing to
      // forward to. Deliberately not an error: an unconfigured site is a valid
      // state, and a scheduled job should not page anyone for it.
      status: "cancelled";
      reason: "forwarding-not-configured" | "delivery-unavailable" | "transport-not-configured";
    }
  | { status: "idle"; pending: 0 }
  | {
      status: "forwarded";
      attempted: number;
      sent: number;
      failed: number;
      costVnd: number;
    };

export type RichfieldForwardingDeps = {
  fetchPending: (limit: number) => Promise<RichfieldPendingSubmission[]>;
  markStatus: (entryId: string, status: "failed" | "sent") => Promise<void>;
  resolveRecipient: () => Promise<string | null>;
  sendEmail: (input: RichfieldForwardEmail) => Promise<void>;
};

export type RichfieldForwardEmail = {
  body: string;
  replyTo: string | null;
  subject: string;
  to: string;
};

function readString(source: Record<string, unknown> | null, key: string) {
  const value = source?.[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function isUsableEmail(value: string | null | undefined) {
  if (!value) return false;
  const trimmed = value.trim();
  // Deliberately permissive: the CMS field is free text, and the transport is
  // the real validator. This only rejects what can never be an address.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

export function buildForwardEmail(
  submission: RichfieldPendingSubmission,
  recipient: string,
): RichfieldForwardEmail {
  const profile = submission.profile_data ?? {};
  const company = readString(profile, "company") ?? "Unknown company";
  const name = readString(profile, "name") ?? "Unknown sender";
  const inquiryType = readString(profile, "inquiryType") ?? "Enquiry";
  const senderEmail = readString(profile, "email");

  return {
    body: [
      `Name: ${name}`,
      `Company: ${company}`,
      `Country: ${readString(profile, "country") ?? "—"}`,
      `Email: ${senderEmail ?? "—"}`,
      `Inquiry type: ${inquiryType}`,
      `Received: ${readString(profile, "receivedAt") ?? "—"}`,
      "",
      "Message:",
      submission.summary ?? "(no message)",
    ].join("\n"),
    replyTo: senderEmail,
    subject: `[Richfield] ${inquiryType} from ${company}`,
    to: recipient,
  };
}

/**
 * Forward every response that has not yet reached the configured inbox.
 *
 * Ordering matters: the recipient is resolved before anything is fetched, so an
 * unconfigured site cancels without touching the submissions API at all. Each
 * response is marked as it is sent, so a crash mid-run cannot re-send what
 * already went out — at-most-once is the right bias when every send is billed.
 */
export async function forwardPendingResponses(
  deps: RichfieldForwardingDeps,
  { limit = 100 }: { limit?: number } = {},
): Promise<RichfieldForwardOutcome> {
  const recipient = await deps.resolveRecipient();

  if (!isUsableEmail(recipient)) {
    return { reason: "forwarding-not-configured", status: "cancelled" };
  }

  const pending = await deps.fetchPending(limit);

  if (pending.length === 0) {
    return { pending: 0, status: "idle" };
  }

  let sent = 0;
  let failed = 0;

  for (const submission of pending) {
    try {
      await deps.sendEmail(buildForwardEmail(submission, recipient as string));
      await deps.markStatus(submission.id, "sent");
      sent += 1;
    } catch (error) {
      console.error("[richfield:forwarding] failed to forward response", {
        entryId: submission.id,
        error: error instanceof Error ? error.message : String(error),
      });
      // Marked failed rather than left pending so one poisonous row cannot
      // wedge every later run behind it.
      await deps.markStatus(submission.id, "failed").catch(() => undefined);
      failed += 1;
    }
  }

  return {
    attempted: pending.length,
    costVnd: sent * RICHFIELD_EMAIL_UNIT_PRICE_VND,
    failed,
    sent,
    status: "forwarded",
  };
}

function submissionsEndpoint(path = "") {
  const workspaceId = getOptionalRichfieldWorkspaceId();

  if (!workspaceId) {
    throw new Error("Missing Richfield workspace id");
  }

  return `${getRichfieldApiBaseUrl().replace(/\/+$/, "")}/workspaces/${encodeURIComponent(
    workspaceId,
  )}/external-projects/submissions${path}`;
}

function appCredentialHeaders() {
  return {
    Accept: "application/json",
    "x-app-id": getRichfieldAppId(),
    "x-app-secret": getRichfieldAppSecret(),
  };
}

export async function fetchPendingSubmissions(limit: number) {
  const response = await fetchWithRichfieldTimeout(
    `${submissionsEndpoint()}?emailNotificationStatus=pending&limit=${limit}`,
    { cache: "no-store", headers: appCredentialHeaders() },
  );

  if (!response.ok) {
    throw new Error(`Listing pending responses failed with status ${response.status}`);
  }

  const payload = (await response.json()) as {
    submissions?: RichfieldPendingSubmission[];
  };

  return payload.submissions ?? [];
}

export async function markSubmissionStatus(entryId: string, status: "failed" | "sent") {
  await fetchWithRichfieldTimeout(submissionsEndpoint(`/${encodeURIComponent(entryId)}`), {
    body: JSON.stringify({
      appId: getRichfieldAppId(),
      appSecret: getRichfieldAppSecret(),
      emailNotificationStatus: status,
    }),
    cache: "no-store",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    method: "PATCH",
  });
}

export async function sendForwardedEmail(input: RichfieldForwardEmail) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY missing");
  }

  const response = await fetchWithRichfieldTimeout("https://api.resend.com/emails", {
    body: JSON.stringify({
      from: `Richfield Site <noreply@${new URL(site.domainCanonical).hostname}>`,
      ...(input.replyTo ? { reply_to: input.replyTo } : {}),
      subject: input.subject,
      text: input.body,
      to: input.to,
    }),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`Resend API failed with status ${response.status}`);
  }
}
