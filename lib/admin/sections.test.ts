import { describe, expect, test } from "vitest";
import {
  ADMIN_SECTION_GROUPS,
  ADMIN_SECTIONS,
  adminSectionsByGroup,
  DEFAULT_ADMIN_SECTION_SLUG,
  findAdminSection,
} from "./sections";

describe("admin sections", () => {
  test("every slug is unique, since each one is a route", () => {
    const slugs = ADMIN_SECTIONS.map((section) => section.slug);

    expect(new Set(slugs).size).toBe(slugs.length);
  });

  test("slugs are URL-safe", () => {
    for (const section of ADMIN_SECTIONS) {
      expect(section.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });

  test("every section belongs to a declared group", () => {
    const groups = new Set(ADMIN_SECTION_GROUPS.map((group) => group.id));

    for (const section of ADMIN_SECTIONS) {
      expect(groups.has(section.group)).toBe(true);
    }
  });

  test("every group has at least one section, so the sidebar shows no empty heading", () => {
    for (const group of ADMIN_SECTION_GROUPS) {
      expect(adminSectionsByGroup(group.id).length).toBeGreaterThan(0);
    }
  });

  test("no collection is edited from two different places", () => {
    const keys = ADMIN_SECTIONS.map((section) => section.collectionKey).filter(
      Boolean,
    );

    expect(new Set(keys).size).toBe(keys.length);
  });

  test("the default section exists", () => {
    expect(findAdminSection(DEFAULT_ADMIN_SECTION_SLUG)).not.toBeNull();
  });

  test("an unknown slug resolves to null so the route can 404", () => {
    expect(findAdminSection("not-a-section")).toBeNull();
  });

  test("list sections carry an empty hint that tells the editor what to do", () => {
    for (const section of ADMIN_SECTIONS) {
      if (!section.collectionKey) continue;

      // An empty list saying only "nothing here" leaves a non-technical user
      // guessing; each one has to say what the next action is.
      expect(section.emptyHint.length).toBeGreaterThan(10);
    }
  });

  test("news and careers are addressable by the names the team uses", () => {
    expect(findAdminSection("news")?.collectionKey).toBe("articles");
    expect(findAdminSection("careers")?.collectionKey).toBe("jobs");
    expect(findAdminSection("responses")?.collectionKey).toBe(
      "contact-submissions",
    );
  });
});
