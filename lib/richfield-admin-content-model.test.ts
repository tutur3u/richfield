import { describe, expect, it } from "vitest";
import {
  normalizeRichfieldSlugInput,
  readRichfieldAdminContent,
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

describe("Richfield contact submissions", () => {
  it("uses the full profile message while keeping the bounded summary preview", () => {
    const [item] = readRichfieldAdminContent(
      {
        assets: [],
        blocks: [],
        collections: [
          {
            collection_type: "contact-submissions",
            id: "collection-1",
            slug: "contact-submissions",
          },
        ],
        entries: [
          {
            collection_id: "collection-1",
            id: "entry-1",
            profile_data: {
              company: "Acme",
              message: "The complete enquiry body.",
            },
            slug: "entry-1",
            status: "draft",
            summary: "The bounded preview.",
            title: "Acme - Mai Nguyen",
          },
        ],
      },
      "contact-submissions",
    );

    expect(item?.summary).toBe("The bounded preview.");
    expect(item?.body).toBe("The complete enquiry body.");
    expect(item?.brand).toBe("Acme");
  });
});
