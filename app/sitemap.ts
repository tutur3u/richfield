import type { MetadataRoute } from "next";
import { site } from "@/content/en/site";

const ROUTES = [
  "/",
  "/about/our-story",
  "/about/who-we-are",
  "/brands",
  "/logistics",
  "/distribution",
  "/careers",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((path) => ({
    url: `${site.domainCanonical}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1.0 : 0.7,
  }));
}
