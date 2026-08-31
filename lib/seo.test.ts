import { describe, expect, test } from "vitest";
import { localeAlternates } from "@/lib/locale";
import {
  absoluteUrl,
  articleJsonLd,
  breadcrumbJsonLd,
  localizedUrl,
  organizationJsonLd,
  serializeJsonLd,
  seoDescription,
  seoTitle,
  websiteJsonLd,
} from "@/lib/seo";

describe("SEO helpers", () => {
  test("self-canonicalizes each locale and advertises reciprocal alternates", () => {
    expect(localeAlternates("en", "/brands")).toEqual({
      canonical: "/brands",
      languages: {
        en: "/brands",
        vi: "/vi/brands",
        "x-default": "/brands",
      },
    });
    expect(localeAlternates("vi", "/brands")).toEqual({
      canonical: "/vi/brands",
      languages: {
        en: "/brands",
        vi: "/vi/brands",
        "x-default": "/brands",
      },
    });
  });

  test("builds absolute URLs for local and remote media", () => {
    expect(absoluteUrl("/photos/example.webp")).toBe(
      "https://richfieldgroup.com.vn/photos/example.webp",
    );
    expect(absoluteUrl("https://cdn.example.com/image.jpg")).toBe(
      "https://cdn.example.com/image.jpg",
    );
    expect(localizedUrl("vi", "/brands")).toBe(
      "https://richfieldgroup.com.vn/vi/brands",
    );
  });

  test("describes the organization, localized website, and news articles", () => {
    expect(organizationJsonLd()).toMatchObject({
      "@type": "Organization",
      legalName: "Richfield Worldwide JSC",
      name: "Richfield Group",
      url: "https://richfieldgroup.com.vn",
    });
    expect(websiteJsonLd("vi")).toMatchObject({
      "@type": "WebSite",
      inLanguage: "vi-VN",
      url: "https://richfieldgroup.com.vn/vi",
    });
    expect(
      articleJsonLd({
        author: "Richfield Editorial",
        description: "Market update",
        image: "/news/cover.webp",
        locale: "vi",
        path: "/news/market-update",
        publishedAt: "2026-08-31",
        title: "Market update",
      }),
    ).toMatchObject({
      "@type": "NewsArticle",
      image: ["https://richfieldgroup.com.vn/news/cover.webp"],
      inLanguage: "vi-VN",
      url: "https://richfieldgroup.com.vn/vi/news/market-update",
    });
  });

  test("builds localized breadcrumb trails for detail pages", () => {
    expect(
      breadcrumbJsonLd({
        items: [
          { name: "Richfield Group", path: "/" },
          { name: "News", path: "/news" },
          { name: "Market update", path: "/news/market-update" },
        ],
        locale: "vi",
      }),
    ).toMatchObject({
      "@type": "BreadcrumbList",
      itemListElement: [
        { item: "https://richfieldgroup.com.vn/vi", position: 1 },
        { item: "https://richfieldgroup.com.vn/vi/news", position: 2 },
        {
          item: "https://richfieldgroup.com.vn/vi/news/market-update",
          position: 3,
        },
      ],
    });
  });

  test("escapes user-controlled markup in JSON-LD", () => {
    expect(serializeJsonLd({ title: "</script><script>alert(1)</script>" }))
      .not.toContain("<");
  });

  test("keeps CMS metadata useful when summaries are missing or titles are long", () => {
    expect(
      seoTitle(
        "A very long Richfield headline that would otherwise overflow a search result title",
        "News",
      ).length,
    ).toBeLessThanOrEqual(50);
    expect(
      seoDescription("", "Company news and market updates from Richfield Group across Vietnam."),
    ).toBe("Company news and market updates from Richfield Group across Vietnam.");
    expect(
      seoDescription(`<p>${"Distribution expertise ".repeat(20)}</p>`, "Fallback").length,
    ).toBeLessThanOrEqual(160);
  });
});
