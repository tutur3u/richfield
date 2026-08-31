import type { MetadataRoute } from "next";
import { site } from "@/content/en/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Private HTML routes remain crawlable so their noindex directives can
        // be observed. Only non-document API endpoints are excluded here.
        disallow: "/api/",
      },
    ],
    host: site.domainCanonical,
    sitemap: `${site.domainCanonical}/sitemap.xml`,
  };
}
