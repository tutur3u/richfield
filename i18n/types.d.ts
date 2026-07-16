import type en from "../messages/en.json";
import type { routing } from "./routing";

// Type-safe message keys + Locale for useTranslations/getTranslations.
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof en;
  }
}
