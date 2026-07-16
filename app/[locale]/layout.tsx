import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BodyChrome, fontVariables } from "@/app/_components/root-chrome";
import { SiteFooter } from "@/app/_components/magazine/chrome/site-footer";
import { routing } from "@/i18n/routing";
import { localeAlternates, openGraphLocale, toLocale } from "@/lib/locale";

// Root layout for the public site. English is served at bare paths (proxy.ts
// rewrites them to /en internally via next-intl); Vietnamese lives under /vi.

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = toLocale((await params).locale);
  const meta = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL("https://richfieldgroup.com.vn"),
    title: {
      default: meta("site.title"),
      template: "%s | Richfield Group",
    },
    description: meta("site.description"),
    alternates: localeAlternates("/"),
    openGraph: {
      type: "website",
      locale: openGraphLocale(locale),
      url: "https://richfieldgroup.com.vn",
      siteName: "Richfield Group",
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  // Opt this locale's tree into static rendering (SSG for both locales).
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={fontVariables}
      data-scroll-behavior="smooth"
    >
      <NextIntlClientProvider>
        <BodyChrome footer={<SiteFooter locale={locale} />}>{children}</BodyChrome>
      </NextIntlClientProvider>
    </html>
  );
}
