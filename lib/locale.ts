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

/** Canonical and hreflang URLs for a localized public route. */
export function localeAlternates(locale: Locale, path: string) {
  const english = path;
  const vietnamese = path === "/" ? "/vi" : `/vi${path}`;

  return {
    canonical: locale === "vi" ? vietnamese : english,
    languages: {
      en: english,
      vi: vietnamese,
      "x-default": english,
    },
  };
}

export function openGraphLocale(locale: Locale) {
  return locale === "vi" ? "vi_VN" : "en_US";
}
