import { describe, expect, test } from "vitest";
import {
  localizedPath,
  publishedLocaleAlternates,
} from "@/lib/localized-route";

describe("localized public routes", () => {
  test("keeps English routes bare and prefixes Vietnamese routes", () => {
    expect(localizedPath("en", "/insights/story")).toBe("/insights/story");
    expect(localizedPath("vi", "/insights/story")).toBe(
      "/vi/insights/story",
    );
    expect(localizedPath("vi", "/")).toBe("/vi");
  });

  test("only advertises published locale variants", () => {
    expect(
      publishedLocaleAlternates({
        availableLocales: ["en"],
        canonicalLocale: "en",
        path: "/insights/story",
      }),
    ).toEqual({
      canonical: "/insights/story",
      languages: {
        en: "/insights/story",
        "x-default": "/insights/story",
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
