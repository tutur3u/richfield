import { describe, expect, test } from "vitest";
import {
  DEFAULT_RICHFIELD_CONTACT_RECIPIENTS,
  parseContactRecipients,
  resolveContactRecipients,
} from "./richfield-contact-recipients";

describe("contact recipients", () => {
  test("parses, normalizes, deduplicates, and rejects invalid recipients", () => {
    expect(
      parseContactRecipients("Sales@Example.com, ops@example.com\ninvalid; sales@example.com"),
    ).toEqual(["sales@example.com", "ops@example.com"]);
  });

  test("falls back to the requested default inbox", () => {
    expect(resolveContactRecipients("not-an-email", null)).toEqual(
      DEFAULT_RICHFIELD_CONTACT_RECIPIENTS,
    );
  });

  test("prefers the first configured source with usable recipients", () => {
    expect(resolveContactRecipients("env@example.com", "cms@example.com")).toEqual([
      "env@example.com",
    ]);
  });
});
