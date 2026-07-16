import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "vi"],
  defaultLocale: "en",
  // English keeps its bare public URLs (/brands, …); Vietnamese lives at /vi.
  localePrefix: "as-needed",
  // Bare paths always serve English — no Accept-Language/cookie negotiation,
  // matching the site's behavior before next-intl.
  localeDetection: false,
});
