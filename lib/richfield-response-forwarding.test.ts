import { describe, expect, test, vi } from "vitest";
import {
  buildForwardEmail,
  forwardPendingResponses,
  isUsableEmail,
  RICHFIELD_EMAIL_UNIT_PRICE_VND,
  type RichfieldPendingSubmission,
} from "./richfield-response-forwarding";

function submission(
  overrides: Partial<RichfieldPendingSubmission> = {},
): RichfieldPendingSubmission {
  return {
    id: "entry-1",
    profile_data: {
      company: "Acme Foods",
      country: "Vietnam",
      email: "buyer@acme.test",
      inquiryType: "Distribution",
      name: "Mai Nguyen",
      receivedAt: "2026-07-26T02:00:00.000Z",
    },
    subtitle: "buyer@acme.test",
    summary: "We would like to stock your range.",
    title: "Acme Foods - Mai Nguyen",
    ...overrides,
  };
}

function deps(overrides: Partial<Parameters<typeof forwardPendingResponses>[0]> = {}) {
  return {
    fetchPending: vi.fn(async () => [submission()]),
    markStatus: vi.fn(async () => undefined),
    resolveRecipient: vi.fn(async () => "inbox@richfield.test"),
    sendEmail: vi.fn(async () => undefined),
    ...overrides,
  };
}

describe("isUsableEmail", () => {
  test("accepts an address and rejects blanks and placeholders", () => {
    expect(isUsableEmail("inbox@richfield.test")).toBe(true);
    expect(isUsableEmail(null)).toBe(false);
    expect(isUsableEmail("   ")).toBe(false);
    expect(isUsableEmail("not-an-address")).toBe(false);
  });
});

describe("forwardPendingResponses", () => {
  test("cancels without touching the submissions API when no inbox is configured", async () => {
    const d = deps({ resolveRecipient: vi.fn(async () => null) });

    const result = await forwardPendingResponses(d);

    expect(result).toEqual({
      reason: "forwarding-not-configured",
      status: "cancelled",
    });
    // The point of the fail-fast: an unconfigured site must not pay the cost of
    // listing responses on every scheduled run.
    expect(d.fetchPending).not.toHaveBeenCalled();
    expect(d.sendEmail).not.toHaveBeenCalled();
  });

  test("cancels when the configured inbox is not a usable address", async () => {
    const d = deps({ resolveRecipient: vi.fn(async () => "tbd") });

    await expect(forwardPendingResponses(d)).resolves.toEqual({
      reason: "forwarding-not-configured",
      status: "cancelled",
    });
    expect(d.fetchPending).not.toHaveBeenCalled();
  });

  test("reports idle when the inbox is configured but nothing is pending", async () => {
    const d = deps({ fetchPending: vi.fn(async () => []) });

    await expect(forwardPendingResponses(d)).resolves.toEqual({
      pending: 0,
      status: "idle",
    });
    expect(d.sendEmail).not.toHaveBeenCalled();
  });

  test("forwards each response, marks it sent, and prices the run", async () => {
    const d = deps({
      fetchPending: vi.fn(async () => [
        submission({ id: "a" }),
        submission({ id: "b" }),
        submission({ id: "c" }),
      ]),
    });

    const result = await forwardPendingResponses(d);

    expect(result).toEqual({
      attempted: 3,
      costVnd: 3 * RICHFIELD_EMAIL_UNIT_PRICE_VND,
      failed: 0,
      sent: 3,
      status: "forwarded",
    });
    expect(d.sendEmail).toHaveBeenCalledTimes(3);
    expect(d.markStatus).toHaveBeenNthCalledWith(1, "a", "sent");
    expect(d.markStatus).toHaveBeenNthCalledWith(2, "b", "sent");
    expect(d.markStatus).toHaveBeenNthCalledWith(3, "c", "sent");
  });

  test("bills only what was actually sent when a send fails", async () => {
    const sendEmail = vi
      .fn()
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error("mail transport 500"))
      .mockResolvedValueOnce(undefined);
    const d = deps({
      fetchPending: vi.fn(async () => [
        submission({ id: "a" }),
        submission({ id: "b" }),
        submission({ id: "c" }),
      ]),
      sendEmail,
    });

    const result = await forwardPendingResponses(d);

    expect(result).toEqual({
      attempted: 3,
      costVnd: 2 * RICHFIELD_EMAIL_UNIT_PRICE_VND,
      failed: 1,
      sent: 2,
      status: "forwarded",
    });
    // The failed one is marked, not left pending, so it cannot wedge later runs.
    expect(d.markStatus).toHaveBeenCalledWith("b", "failed");
  });

  test("a failure while marking does not abort the rest of the run", async () => {
    const d = deps({
      fetchPending: vi.fn(async () => [submission({ id: "a" }), submission({ id: "b" })]),
      markStatus: vi.fn(async (_id: string, status: string) => {
        if (status === "failed") throw new Error("patch failed");
      }),
      sendEmail: vi.fn().mockRejectedValueOnce(new Error("boom")).mockResolvedValue(undefined),
    });

    const result = await forwardPendingResponses(d);

    expect(result).toMatchObject({ failed: 1, sent: 1, status: "forwarded" });
  });
});

describe("buildForwardEmail", () => {
  test("carries the sender into reply-to so a reply reaches the enquirer", () => {
    const email = buildForwardEmail(submission(), "inbox@richfield.test");

    expect(email.to).toBe("inbox@richfield.test");
    expect(email.replyTo).toBe("buyer@acme.test");
    // Carried so the platform's audit row points back at the response it sent.
    expect(email.entityId).toBe("entry-1");
    expect(email.subject).toBe(
      "[Richfield enquiry] Distribution · Acme Foods",
    );
    expect(email.html).toContain("Open response in Richfield");
    expect(email.body).toContain("We would like to stock your range.");
    expect(email.body).toContain("Mai Nguyen");
  });

  test("degrades to placeholders rather than throwing on a sparse row", () => {
    const email = buildForwardEmail(
      { id: "x", profile_data: null, subtitle: null, summary: null, title: null },
      "inbox@richfield.test",
    );

    expect(email.replyTo).toBeNull();
    expect(email.subject).toContain("Unknown company");
    expect(email.body).toContain("(no message)");
  });
});
