import type { Locale } from "@/lib/locale";

export function localizedPath(locale: Locale, path: string) {
  if (locale === "en") return path;
  return path === "/" ? "/vi" : `/vi${path}`;
}

export function publishedLocaleAlternates({
  availableLocales,
  canonicalLocale,
  path,
}: {
  availableLocales: Locale[];
  canonicalLocale: Locale;
  path: string;
}) {
  const languages = Object.fromEntries(
    availableLocales.map((locale) => [locale, localizedPath(locale, path)]),
  ) as Partial<Record<Locale | "x-default", string>>;

  if (availableLocales.includes("en")) {
    languages["x-default"] = localizedPath("en", path);
  }

  return {
    canonical: localizedPath(canonicalLocale, path),
    languages,
  };
}
