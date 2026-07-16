import type { Locale } from "@/lib/locale";
import * as en from "./en";
import * as vi from "./vi";

/**
 * The locale-selected structured-content modules (brands, milestones, site,
 * photography, …). UI strings live in the next-intl catalogs (messages/*.json)
 * — this only covers the typed content data that mirrors across
 * content/en and content/vi. Returned as a union (not a cast) so literal
 * `as const` differences between the two trees stay type-checked.
 */
export function getContent(locale: Locale) {
  return locale === "vi" ? vi : en;
}
