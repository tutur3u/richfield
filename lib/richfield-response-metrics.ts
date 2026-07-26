import { RICHFIELD_EMAIL_UNIT_PRICE_VND } from "./richfield-response-forwarding";

export type RichfieldForwardingMetrics = {
  costVnd: number;
  failed: number;
  pending: number;
  sent: number;
  total: number;
};

/**
 * Roll up what the forwarding job has done, straight from the responses the
 * dashboard already holds — no second source to drift out of step with the
 * inbox. Cost is derived from the sent count rather than accumulated per run,
 * so it always reflects the current unit price.
 */
export function summariseForwardingMetrics(
  responses: ReadonlyArray<{ emailNotificationStatus?: string | null }>,
): RichfieldForwardingMetrics {
  let sent = 0;
  let failed = 0;
  let pending = 0;

  for (const response of responses) {
    switch ((response.emailNotificationStatus ?? "").trim().toLowerCase()) {
      case "sent":
        sent += 1;
        break;
      case "failed":
        failed += 1;
        break;
      default:
        // Anything else — "pending", empty, or a value we do not recognise — is
        // still waiting to go out, which is the safe way to count it.
        pending += 1;
    }
  }

  return {
    costVnd: sent * RICHFIELD_EMAIL_UNIT_PRICE_VND,
    failed,
    pending,
    sent,
    total: responses.length,
  };
}

export function formatVnd(amount: number) {
  return `${new Intl.NumberFormat("vi-VN").format(amount)}₫`;
}
