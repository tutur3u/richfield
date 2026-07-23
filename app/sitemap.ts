import type { MetadataRoute } from "next";
import { site } from "@/content/en/site";

const ROUTES = [
  "/",
  "/about/our-story",
  "/about/who-we-are",
  "/brands",
  "/logistics",
  "/distribution",
  "/insights",
  "/careers",
  "/contact",
];

// English is served at bare paths; Vietnamese under /vi. Each entry carries
// hreflang alternates pointing at its counterpart.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return ROUTES.flatMap((path) => {
    const enUrl = `${site.domainCanonical}${path === "/" ? "" : path}`;
    const viUrl = `${site.domainCanonical}${path === "/" ? "/vi" : `/vi${path}`}`;
    const languages = { en: enUrl, vi: viUrl, "x-default": enUrl };

    return [
      {
        url: enUrl,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: path === "/" ? 1.0 : 0.7,
        alternates: { languages },
      },
      {
        url: viUrl,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: path === "/" ? 0.9 : 0.6,
        alternates: { languages },
      },
    ];
  });
}
