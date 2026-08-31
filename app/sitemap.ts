import type { MetadataRoute } from "next";
import { site } from "@/content/en/site";
import type { RichfieldArticle } from "@/lib/richfield-content";
import { getRichfieldContent } from "@/lib/richfield-delivery";
import { absoluteUrl } from "@/lib/seo";

const ROUTES = [
  "/",
  "/about/our-story",
  "/about/who-we-are",
  "/brands",
  "/logistics",
  "/distribution",
  "/news",
  "/careers",
  "/contact",
];

function articleDate(article: RichfieldArticle) {
  if (!article.publishedAt) return undefined;
  const date = new Date(article.publishedAt);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

// English is served at bare paths; Vietnamese under /vi. Each entry carries
// hreflang alternates pointing at its counterpart. Published news stories are
// included individually so the new canonical URLs can be discovered directly.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [english, vietnamese] = await Promise.all([
    getRichfieldContent("en"),
    getRichfieldContent("vi"),
  ]);

  const staticEntries = ROUTES.flatMap((path) => {
    const enUrl = `${site.domainCanonical}${path === "/" ? "" : path}`;
    const viUrl = `${site.domainCanonical}${path === "/" ? "/vi" : `/vi${path}`}`;
    const languages = { en: enUrl, vi: viUrl, "x-default": enUrl };

    return [
      {
        url: enUrl,
        changeFrequency: "monthly" as const,
        priority: path === "/" ? 1.0 : 0.7,
        alternates: { languages },
      },
      {
        url: viUrl,
        changeFrequency: "monthly" as const,
        priority: path === "/" ? 0.9 : 0.6,
        alternates: { languages },
      },
    ];
  });

  const articlesBySlug = new Map<
    string,
    { en?: RichfieldArticle; vi?: RichfieldArticle }
  >();

  for (const article of english.articles) {
    articlesBySlug.set(article.slug, {
      ...articlesBySlug.get(article.slug),
      en: article,
    });
  }
  for (const article of vietnamese.articles) {
    articlesBySlug.set(article.slug, {
      ...articlesBySlug.get(article.slug),
      vi: article,
    });
  }

  const articleEntries = [...articlesBySlug.entries()].flatMap(
    ([slug, localized]) => {
      const enUrl = localized.en
        ? `${site.domainCanonical}/news/${slug}`
        : undefined;
      const viUrl = localized.vi
        ? `${site.domainCanonical}/vi/news/${slug}`
        : undefined;
      const languages = {
        ...(enUrl ? { en: enUrl, "x-default": enUrl } : {}),
        ...(viUrl ? { vi: viUrl } : {}),
      };

      return [
        ...(localized.en && enUrl
          ? [
              {
                alternates: { languages },
                changeFrequency: "monthly" as const,
                images: localized.en.imageUrl
                  ? [absoluteUrl(localized.en.imageUrl)]
                  : undefined,
                lastModified: articleDate(localized.en),
                priority: 0.75,
                url: enUrl,
              },
            ]
          : []),
        ...(localized.vi && viUrl
          ? [
              {
                alternates: { languages },
                changeFrequency: "monthly" as const,
                images: localized.vi.imageUrl
                  ? [absoluteUrl(localized.vi.imageUrl)]
                  : undefined,
                lastModified: articleDate(localized.vi),
                priority: 0.7,
                url: viUrl,
              },
            ]
          : []),
      ];
    },
  );

  const positionsBySlug = new Map<
    string,
    {
      en?: (typeof english.openPositions)[number];
      vi?: (typeof vietnamese.openPositions)[number];
    }
  >();

  for (const position of english.openPositions) {
    positionsBySlug.set(position.slug, {
      ...positionsBySlug.get(position.slug),
      en: position,
    });
  }
  for (const position of vietnamese.openPositions) {
    positionsBySlug.set(position.slug, {
      ...positionsBySlug.get(position.slug),
      vi: position,
    });
  }

  const careerEntries = [...positionsBySlug.entries()].flatMap(
    ([slug, localized]) => {
      const enUrl = localized.en
        ? `${site.domainCanonical}/careers/${slug}`
        : undefined;
      const viUrl = localized.vi
        ? `${site.domainCanonical}/vi/careers/${slug}`
        : undefined;
      const languages = {
        ...(enUrl ? { en: enUrl, "x-default": enUrl } : {}),
        ...(viUrl ? { vi: viUrl } : {}),
      };

      return [
        ...(enUrl
          ? [
              {
                alternates: { languages },
                changeFrequency: "weekly" as const,
                priority: 0.8,
                url: enUrl,
              },
            ]
          : []),
        ...(viUrl
          ? [
              {
                alternates: { languages },
                changeFrequency: "weekly" as const,
                priority: 0.75,
                url: viUrl,
              },
            ]
          : []),
      ];
    },
  );

  return [...staticEntries, ...articleEntries, ...careerEntries];
}
