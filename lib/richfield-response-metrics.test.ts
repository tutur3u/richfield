import { describe, expect, test } from "vitest";
import { RICHFIELD_EMAIL_UNIT_PRICE_VND } from "./richfield-response-forwarding";
import { formatVnd, summariseForwardingMetrics } from "./richfield-response-metrics";

describe("summariseForwardingMetrics", () => {
  test("counts nothing for an empty inbox", () => {
    expect(summariseForwardingMetrics([])).toEqual({
      costVnd: 0,
      failed: 0,
      pending: 0,
      sent: 0,
      total: 0,
    });
  });

  test("prices only the responses that were actually sent", () => {
    const metrics = summariseForwardingMetrics([
      { emailNotificationStatus: "sent" },
      { emailNotificationStatus: "sent" },
      { emailNotificationStatus: "failed" },
      { emailNotificationStatus: "pending" },
    ]);

    expect(metrics).toEqual({
      costVnd: 2 * RICHFIELD_EMAIL_UNIT_PRICE_VND,
      failed: 1,
      pending: 1,
      sent: 2,
      total: 4,
    });
  });

  test("treats blank and unrecognised statuses as still pending", () => {
    const metrics = summariseForwardingMetrics([
      { emailNotificationStatus: "" },
      { emailNotificationStatus: null },
      {},
      { emailNotificationStatus: "queued" },
    ]);

    expect(metrics.pending).toBe(4);
    expect(metrics.sent).toBe(0);
    expect(metrics.costVnd).toBe(0);
  });

  test("is case and whitespace tolerant about the stored status", () => {
    const metrics = summariseForwardingMetrics([
      { emailNotificationStatus: " Sent " },
      { emailNotificationStatus: "FAILED" },
    ]);

    expect(metrics.sent).toBe(1);
    expect(metrics.failed).toBe(1);
  });

  test("prices a hundred sends at the published unit rate", () => {
    const metrics = summariseForwardingMetrics(
      Array.from({ length: 100 }, () => ({ emailNotificationStatus: "sent" })),
    );

    expect(metrics.costVnd).toBe(2_500);
  });
});

describe("failed responses stay visible", () => {
  test("a response the transport could not deliver is counted, not lost", () => {
    // The send that runs at submission time marks a response failed whenever
    // the transport is down, so "failed" must stay a first-class, countable
    // state that the operator can see and the scheduled job can retry.
    const metrics = summariseForwardingMetrics([
      { emailNotificationStatus: "failed" },
      { emailNotificationStatus: "failed" },
    ]);

    expect(metrics).toMatchObject({ costVnd: 0, failed: 2, sent: 0, total: 2 });
  });
});

describe("formatVnd", () => {
  test("groups thousands the Vietnamese way", () => {
    expect(formatVnd(0)).toBe("0₫");
    expect(formatVnd(25)).toBe("25₫");
    expect(formatVnd(2_500)).toMatch(/2\D?500₫/);
  });
});
