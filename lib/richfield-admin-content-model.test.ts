import { describe, expect, it } from "vitest";
import {
  normalizeRichfieldSlugInput,
  slugifyRichfieldContent,
} from "./richfield-admin-content-model";

describe("Richfield content slugs", () => {
  it("keeps manually entered hyphens while normalizing the field", () => {
    expect(normalizeRichfieldSlugInput("New-product-")).toBe("new-product-");
    expect(normalizeRichfieldSlugInput("New - Product")).toBe("new-product");
  });

  it("turns spaces into hyphens and lowercases characters", () => {
    expect(normalizeRichfieldSlugInput("The New Website Link")).toBe(
      "the-new-website-link",
    );
  });

  it("creates a clean final slug from an English title", () => {
    expect(slugifyRichfieldContent("Food & Beverage — 2026")).toBe(
      "food-and-beverage-2026",
    );
  });
});
