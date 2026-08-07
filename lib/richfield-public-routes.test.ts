import { describe, expect, test } from "vitest";
import { richfieldPublicPathsFor } from "./richfield-public-routes";

describe("Richfield public routes", () => {
  test("includes the entry's own page alongside its index", () => {
    expect(richfieldPublicPathsFor("articles", "harvest-season")).toEqual([
      "/news",
      "/news/harvest-season",
    ]);
    expect(richfieldPublicPathsFor("jobs", "logistics-lead")).toEqual([
      "/careers",
      "/careers/logistics-lead",
    ]);
  });

  test("drops the detail page when there is no usable slug", () => {
    // Deletes have no slug to warm, and a slug that is not URL-safe must never
    // reach a fetched URL.
    expect(richfieldPublicPathsFor("articles")).toEqual(["/news"]);
    expect(richfieldPublicPathsFor("articles", "  ")).toEqual(["/news"]);
    expect(richfieldPublicPathsFor("articles", "../../etc/passwd")).toEqual([
      "/news",
    ]);
  });

  test("covers every page a collection actually renders on", () => {
    expect(richfieldPublicPathsFor("brands")).toEqual(["/", "/brands"]);
    expect(richfieldPublicPathsFor("milestones")).toEqual(["/about/our-story"]);
    expect(richfieldPublicPathsFor("contact-channels")).toEqual(["/contact"]);
  });

  test("has nothing public for back-office collections", () => {
    expect(richfieldPublicPathsFor("contact-submissions")).toEqual([]);
  });
});
