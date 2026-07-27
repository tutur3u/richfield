export const ADMIN_LOCALES = ["en", "vi"] as const;

export type AdminLocale = (typeof ADMIN_LOCALES)[number];

export const ADMIN_LOCALE_COOKIE = "richfield_admin_locale";
export const DEFAULT_ADMIN_LOCALE: AdminLocale = "en";

export function toAdminLocale(value: string | null | undefined): AdminLocale {
  return value === "vi" ? "vi" : DEFAULT_ADMIN_LOCALE;
}
