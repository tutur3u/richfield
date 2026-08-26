import { describe, expect, it } from "vitest";
import { buildRichfieldContactEmail } from "./richfield-contact-email";

describe("buildRichfieldContactEmail", () => {
  it("builds responsive branded html, plain text, and an admin action", () => {
    const email = buildRichfieldContactEmail({
      company: "Acme Foods",
      country: "Vietnam",
      email: "mai@acme.test",
      entryId: "entry-1",
      inquiryType: "Distribution opportunity",
      message: "We would like to stock your range.",
      name: "Mai Nguyen",
      receivedAt: "2026-08-26T07:54:37.129Z",
    });

    expect(email.subject).toBe(
      "[Richfield enquiry] Distribution opportunity · Acme Foods",
    );
    expect(email.text).toContain("Open response:");
    expect(email.html).toContain('name="viewport"');
    expect(email.html).toContain("prefers-color-scheme:dark");
    expect(email.html).toContain("Open response in Richfield");
    expect(email.html).toContain("/admin/responses/entry-1");
    expect(email.html).toContain("mailto:mai@acme.test");
  });

  it("escapes visitor-controlled markup in every html surface", () => {
    const email = buildRichfieldContactEmail({
      company: '<img src=x onerror="alert(1)">',
      country: "Vietnam",
      email: "sender@example.com",
      inquiryType: "<b>Press</b>",
      message: "<script>alert('x')</script> & hello",
      name: "<strong>Visitor</strong>",
    });

    expect(email.html).not.toContain("<script>alert");
    expect(email.html).not.toContain("<img src=x");
    expect(email.html).not.toContain("<strong>Visitor");
    expect(email.html).toContain("&lt;script&gt;");
    expect(email.html).toContain("&amp; hello");
  });

  it("normalizes newlines out of the subject", () => {
    const email = buildRichfieldContactEmail({
      company: "Acme\r\nBcc: attacker@example.com",
      country: "Vietnam",
      email: "sender@example.com",
      inquiryType: "Partnership",
      message: "Hello",
      name: "Mai",
    });

    expect(email.subject).not.toContain("\n");
    expect(email.subject).not.toContain("\r");
  });
});
