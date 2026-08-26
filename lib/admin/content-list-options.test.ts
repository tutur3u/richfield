import { describe, expect, test } from "vitest";
import type { RichfieldAdminContentItem } from "@/lib/richfield-admin-content-model";
import {
  applyContentListOptions,
  isDefaultContentListOptions,
  readContentListOptions,
} from "./content-list-options";

function item(
  id: string,
  overrides: Partial<RichfieldAdminContentItem> = {},
): RichfieldAdminContentItem {
  return {
    author: "",
    category: "",
    collectionKey: "articles",
    createdAt: "2026-01-01T00:00:00.000Z",
    feature: false,
    id,
    localeComplete: true,
    publishedAt: "",
    slug: id,
    status: "draft",
    title: id,
    ...overrides,
  } as RichfieldAdminContentItem;
}

describe("admin content list options", () => {
  test("only identifies the server-seeded query as the default", () => {
    const defaults = readContentListOptions(new URLSearchParams(), "articles");

    expect(isDefaultContentListOptions(defaults, "articles")).toBe(true);
    expect(
      isDefaultContentListOptions({ ...defaults, status: "draft" }, "articles"),
    ).toBe(false);
    expect(
      isDefaultContentListOptions({ ...defaults, sort: "title-asc" }, "articles"),
    ).toBe(false);
  });

  test("news defaults to newest creation date", () => {
    const options = readContentListOptions(new URLSearchParams(), "articles");
    const result = applyContentListOptions(
      [
        item("older", { createdAt: "2025-01-01T00:00:00Z" }),
        item("newer", { createdAt: "2026-01-01T00:00:00Z" }),
      ],
      options,
    );

    expect(options.sort).toBe("created-desc");
    expect(result.map(({ id }) => id)).toEqual(["newer", "older"]);
  });

  test("combines search, status, featured, and translation filters", () => {
    const result = applyContentListOptions(
      [
        item("match", {
          author: "Mai",
          feature: true,
          localeComplete: false,
          status: "published",
          title: "Distribution update",
        }),
        item("wrong-status", { author: "Mai", feature: true }),
        item("wrong-feature", { author: "Mai", status: "published" }),
      ],
      {
        completeness: "missing",
        featured: "featured",
        search: "mai",
        sort: "title-asc",
        status: "published",
      },
    );

    expect(result.map(({ id }) => id)).toEqual(["match"]);
  });

  test("falls back safely for unsupported query values", () => {
    const options = readContentListOptions(
      new URLSearchParams("sort=drop-table&status=nope"),
      "articles",
    );

    expect(options.sort).toBe("created-desc");
    expect(options.status).toBe("all");
  });
});
