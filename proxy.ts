import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// next-intl handles the locale routing: with localePrefix "as-needed" +
// localeDetection off, bare paths rewrite internally to the default locale
// (English URLs stay bare) and /vi passes through prefixed. System routes
// (admin, login, verify-token), API routes, static assets, and Next internals
// are excluded by the matcher.
export default createMiddleware(routing);

export const config = {
  matcher: [
    "/((?!api|admin|login|verify-token|_next|_vercel|photos|media|.*\\..*).*)",
  ],
};
