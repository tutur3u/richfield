import { describe, expect, test } from "vitest";
import { richfieldExternalProjectManifest } from "./richfield-external-project-manifest";

describe("Richfield external project manifest", () => {
  test("defines the CMS collections needed for local Richfield editing", () => {
    expect(richfieldExternalProjectManifest.adapter).toBe("richfield");
    expect(
      richfieldExternalProjectManifest.schema.collections.map((collection) => [
        collection.slug,
        collection.profileFields?.map((field) => field.key) ?? [],
        collection.blockTypes ?? [],
        collection.assetTypes ?? [],
      ]),
    ).toEqual([
      [
        "brands",
        ["country", "year", "category", "accent", "feature", "featureCaption"],
        [],
        ["image"],
      ],
      ["leadership", ["role"], ["markdown", "quote"], ["image"]],
      ["milestones", ["year", "country", "brand", "aboutOnly"], [], []],
      [
        "contact-page",
        ["headline", "intro", "mapQuery", "backgroundImageSlug"],
        ["markdown"],
        ["image"],
      ],
      [
        "contact-channels",
        ["kind", "href", "secondary", "cta", "external", "sortOrder"],
        [],
        [],
      ],
      [
        "contact-submissions",
        [
          "name",
          "company",
          "country",
          "email",
          "inquiryType",
          "receivedAt",
          "submissionStatus",
          "emailNotificationStatus",
        ],
        ["markdown"],
        [],
      ],
      ["jobs", ["positions", "location", "deadline", "href", "sortOrder"], [], []],
      [
        "image-library",
        [
          "pageSection",
          "placement",
          "brand",
          "category",
          "productName",
          "feature",
          "shelfWeight",
          "usageTags",
          "objectPosition",
          "ratio",
          "credit",
          "sortOrder",
        ],
        [],
        ["image"],
      ],
    ]);
  });

  test("ships published seed entries for Richfield CMS collections", () => {
    const entries = richfieldExternalProjectManifest.content.entries;

    expect(new Set(entries.map((entry) => entry.collectionSlug))).toEqual(
      new Set([
        "brands",
        "leadership",
        "milestones",
        "contact-page",
        "contact-channels",
        "image-library",
      ]),
    );
    expect(entries.every((entry) => entry.status === "published")).toBe(true);
    expect(entries.some((entry) => entry.collectionSlug === "brands")).toBe(true);
    expect(entries.some((entry) => entry.collectionSlug === "leadership")).toBe(
      true,
    );
    expect(entries.some((entry) => entry.collectionSlug === "milestones")).toBe(
      true,
    );
  });
});
