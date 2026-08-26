import {
  getOptionalRichfieldWorkspaceId,
  getRichfieldApiBaseUrl,
  getRichfieldAppId,
  getRichfieldAppSecret,
} from "./richfield-config";
import { fetchWithRichfieldTimeout } from "./richfield-fetch";
import { parseContactRecipients } from "./richfield-contact-recipients";

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
      reason: "forwarding-not-configured";
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
  /** The response this email carries, so the platform audit row points back at it. */
  entityId: string;
  replyTo: string | null;
  subject: string;
  to: string;
};

function readString(source: Record<string, unknown> | null, key: string) {
  const value = source?.[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function isUsableEmail(value: string | null | undefined) {
  return parseContactRecipients(value).length > 0;
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
    entityId: submission.id,
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

async function listByStatus(status: "failed" | "pending", limit: number) {
  const response = await fetchWithRichfieldTimeout(
    `${submissionsEndpoint()}?emailNotificationStatus=${status}&limit=${limit}`,
    { cache: "no-store", headers: appCredentialHeaders() },
  );

  if (!response.ok) {
    throw new Error(
      `Listing ${status} responses failed with status ${response.status}`,
    );
  }

  const payload = (await response.json()) as {
    submissions?: RichfieldPendingSubmission[];
  };

  return payload.submissions ?? [];
}

/**
 * Everything still owed to the inbox: never-attempted responses first, then
 * ones an earlier attempt could not deliver.
 *
 * Retrying `failed` matters because the send that happens at submission time
 * marks a response failed whenever the transport is unavailable — without a
 * retry those responses would sit unread forever, which is precisely the
 * failure this scheduled job exists to prevent.
 */
export async function fetchPendingSubmissions(limit: number) {
  const pending = await listByStatus("pending", limit);

  if (pending.length >= limit) {
    return pending;
  }

  const retryable = await listByStatus("failed", limit - pending.length);

  return [...pending, ...retryable];
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

function emailsEndpoint() {
  const workspaceId = getOptionalRichfieldWorkspaceId();

  if (!workspaceId) {
    throw new Error("Missing Richfield workspace id");
  }

  return `${getRichfieldApiBaseUrl().replace(/\/+$/, "")}/workspaces/${encodeURIComponent(
    workspaceId,
  )}/external-projects/emails`;
}

/**
 * Send through Tuturuuu's own SES-backed mailer rather than a third-party key
 * held by this site. The workspace owns the sending identity, so rate limiting,
 * blacklist checks, and the audit trail all apply centrally, and there is no
 * separate credential here to rotate or leak.
 */
export async function sendRichfieldEmail(input: {
  body: string;
  entityId?: string;
  replyTo: string | null;
  subject: string;
  to: string | string[];
}) {
  const recipients = parseContactRecipients(input.to);
  if (recipients.length === 0) {
    throw new Error("No valid Richfield email recipients configured");
  }

  const response = await fetchWithRichfieldTimeout(emailsEndpoint(), {
    body: JSON.stringify({
      entityId: input.entityId,
      entityType: "contact-submission",
      ...(input.replyTo ? { replyTo: [input.replyTo] } : {}),
      subject: input.subject,
      text: input.body,
      to: recipients,
    }),
    cache: "no-store",
    headers: { ...appCredentialHeaders(), "Content-Type": "application/json" },
    method: "POST",
  });

  if (!response.ok) {
    const detail = await response
      .json()
      .then((payload: { error?: string }) => payload?.error)
      .catch(() => null);

    throw new Error(
      `Tuturuuu mail send failed with status ${response.status}${detail ? `: ${detail}` : ""}`,
    );
  }
}

export function sendForwardedEmail(input: RichfieldForwardEmail) {
  return sendRichfieldEmail(input);
}
