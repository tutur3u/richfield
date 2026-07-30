import { describe, expect, test } from "vitest";
import {
  localizedPath,
  publishedLocaleAlternates,
} from "@/lib/localized-route";

describe("localized public routes", () => {
  test("keeps English routes bare and prefixes Vietnamese routes", () => {
    expect(localizedPath("en", "/news/story")).toBe("/news/story");
    expect(localizedPath("vi", "/news/story")).toBe(
      "/vi/news/story",
    );
    expect(localizedPath("vi", "/")).toBe("/vi");
  });

  test("only advertises published locale variants", () => {
    expect(
      publishedLocaleAlternates({
        availableLocales: ["en"],
        canonicalLocale: "en",
        path: "/news/story",
      }),
    ).toEqual({
      canonical: "/news/story",
      languages: {
        en: "/news/story",
        "x-default": "/news/story",
      },
    });
  });

  test("canonicalizes an unavailable locale route to its published translation", () => {
    expect(
      publishedLocaleAlternates({
        availableLocales: ["vi"],
        canonicalLocale: "vi",
        path: "/careers/role",
      }),
    ).toEqual({
      canonical: "/vi/careers/role",
      languages: {
        vi: "/vi/careers/role",
      },
    });
  });
});
