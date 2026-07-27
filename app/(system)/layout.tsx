import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { cookies } from "next/headers";
import { BodyChrome, fontVariables } from "@/app/_components/root-chrome";
import { AdminQueryProvider } from "@/components/admin/admin-query-provider";
import {
  ADMIN_LOCALE_COOKIE,
  toAdminLocale,
} from "@/lib/admin/locales";
import { ADMIN_THEME_BOOTSTRAP } from "@/lib/admin/theme";

// Root layout for the non-localized system surfaces (admin, login,
// verify-token). These routes intentionally omit localized public chrome:
// SiteFooter consumes next-intl context that only exists in [locale]/layout.

export const metadata: Metadata = {
  metadataBase: new URL("https://richfieldgroup.com.vn"),
  title: {
    default: "Richfield Group: From Market Entry to Nationwide Distribution",
    template: "%s | Richfield Group",
  },
  description:
    "Vietnam's largest FMCG distribution network. Bringing the world's most loved brands to over 180,000 retail outlets nationwide.",
  robots: { index: true, follow: true },
};

export default async function SystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = toAdminLocale(
    (await cookies()).get(ADMIN_LOCALE_COOKIE)?.value,
  );
  const messages = (await import(`../../messages/${locale}.json`)).default;

  return (
    <html
      lang={locale}
      className={fontVariables}
      data-admin-theme="system"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: pre-paint theme restore
          dangerouslySetInnerHTML={{ __html: ADMIN_THEME_BOOTSTRAP }}
        />
      </head>
      <BodyChrome>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AdminQueryProvider>{children}</AdminQueryProvider>
        </NextIntlClientProvider>
      </BodyChrome>
    </html>
  );
}
