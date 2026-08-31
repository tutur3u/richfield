import { site } from "@/content/en/site";
import type { Metadata } from "next";
import type { Locale } from "@/lib/locale";
import { localizedPath } from "@/lib/localized-route";

export const SITE_URL = site.domainCanonical;
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export function absoluteUrl(pathOrUrl: string) {
  try {
    return new URL(pathOrUrl, SITE_URL).toString();
  } catch {
    return SITE_URL;
  }
}

export function localizedUrl(locale: Locale, path: string) {
  return absoluteUrl(localizedPath(locale, path));
}

export function pageOpenGraph({
  description,
  locale,
  path,
  title,
}: {
  description: string;
  locale: Locale;
  path: string;
  title: string;
}): Metadata["openGraph"] {
  return {
    description,
    images: [
      {
        alt: "Richfield Group — market entry and nationwide distribution",
        height: 630,
        url: absoluteUrl("/opengraph-image.jpg"),
        width: 1200,
      },
    ],
    locale: locale === "vi" ? "vi_VN" : "en_US",
    siteName: site.name,
    title,
    type: "website",
    url: localizedUrl(locale, path),
  };
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function truncateAtWord(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  const shortened = value.slice(0, maxLength - 1);
  const lastSpace = shortened.lastIndexOf(" ");
  return `${(lastSpace > maxLength * 0.6 ? shortened.slice(0, lastSpace) : shortened).trimEnd()}…`;
}

export function seoTitle(value: string, fallback: string) {
  const normalized = value.replace(/\s+/gu, " ").trim() || fallback;
  // The root title template adds " | Richfield Group" (18 characters).
  return truncateAtWord(normalized, 50);
}

export function seoDescription(value: string, fallback: string) {
  const normalized = value
    .replace(/<[^>]*>/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
  const candidate = normalized.length >= 50 ? normalized : fallback;
  return truncateAtWord(candidate, 160);
}

export function breadcrumbJsonLd({
  items,
  locale,
}: {
  items: Array<{ name: string; path: string }>;
  locale: Locale;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      item: localizedUrl(locale, item.path),
      name: item.name,
      position: index + 1,
    })),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@id": ORGANIZATION_ID,
    "@type": "Organization",
    address: {
      "@type": "PostalAddress",
      addressCountry: "VN",
      addressLocality: "Nhà Bè",
      addressRegion: "Ho Chi Minh City",
      streetAddress: site.address.line1,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: site.email,
        telephone: site.phones.officeTel,
      },
    ],
    email: site.email,
    foundingDate: String(site.founded),
    legalName: site.legalName,
    logo: {
      "@type": "ImageObject",
      contentUrl: absoluteUrl("/photos/logos/richfield.webp"),
      height: 667,
      width: 720,
    },
    name: site.name,
    sameAs: Object.values(site.socials).filter(Boolean),
    telephone: site.phones.officeTel,
    url: SITE_URL,
  };
}

export function websiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@id": WEBSITE_ID,
    "@type": "WebSite",
    inLanguage: locale === "vi" ? "vi-VN" : "en",
    name: site.name,
    publisher: { "@id": ORGANIZATION_ID },
    url: absoluteUrl(localizedPath(locale, "/")),
  };
}

export function articleJsonLd({
  author,
  description,
  image,
  locale,
  path,
  publishedAt,
  title,
}: {
  author: string | null;
  description: string;
  image: string | null;
  locale: Locale;
  path: string;
  publishedAt: string | null;
  title: string;
}) {
  const url = absoluteUrl(localizedPath(locale, path));

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    author: author
      ? { "@type": "Person", name: author }
      : { "@id": ORGANIZATION_ID },
    datePublished: publishedAt ?? undefined,
    description,
    headline: title,
    image: image ? [absoluteUrl(image)] : undefined,
    inLanguage: locale === "vi" ? "vi-VN" : "en",
    mainEntityOfPage: { "@id": url, "@type": "WebPage" },
    publisher: { "@id": ORGANIZATION_ID },
    url,
  };
}
