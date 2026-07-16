// Locale helpers for the /vi-prefixed Vietnamese edition. Routing itself is
// owned by next-intl (i18n/routing.ts + proxy.ts); this module keeps the
// derived types used by getContent() and the SEO metadata helpers.

import { routing } from "@/i18n/routing";

export const LOCALES = routing.locales;

export type Locale = (typeof routing.locales)[number];

export const DEFAULT_LOCALE: Locale = routing.defaultLocale;

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Narrow a route param to a Locale (the [locale] layout already 404s unknowns). */
export function toLocale(value: string): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/** hreflang alternates for a bare-path page route (e.g. "/brands"). */
export function localeAlternates(path: string) {
  return {
    canonical: path,
    languages: {
      en: path,
      vi: path === "/" ? "/vi" : `/vi${path}`,
      "x-default": path,
    },
  };
}

export function openGraphLocale(locale: Locale) {
  return locale === "vi" ? "vi_VN" : "en_US";
}
