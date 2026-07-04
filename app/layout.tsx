import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist, Fraunces } from "next/font/google";
import "./globals.css";
import { RouteAnnouncerPatch } from "@/app/_components/route-announcer-patch";
import { SiteFooter } from "@/app/_components/magazine/chrome/site-footer";
import { SiteFooterGate } from "@/app/_components/magazine/chrome/site-footer-gate";
import { RichfieldToaster } from "@/components/RichfieldToaster";

// The whole site runs on two type voices only (Anthropic-style):
//   • Fraunces — the editorial serif, for every heading/title + italic accents.
//   • Geist    — the sans, for all body copy, eyebrows, folios, and UI labels.
const geistSans = Geist({
  subsets: ["latin", "latin-ext"],
  variable: "--font-geist-sans",
  display: "swap",
});

// Fraunces: editorial serif with clean, readable italic glyphs for the
// emphasized words, pull-quotes, and drop caps.
const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  axes: ["SOFT", "opsz"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://richfieldgroup.com.vn"),
  title: {
    default: "Richfield Group: From Market Entry to Nationwide Distribution",
    template: "%s | Richfield Group",
  },
  description:
    "Vietnam's largest FMCG distribution network. Bringing the world's most loved brands to over 180,000 retail outlets nationwide.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://richfieldgroup.com.vn",
    siteName: "Richfield Group",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${fraunces.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-dvh bg-cream text-ink antialiased">
        {children}
        <SiteFooterGate>
          <SiteFooter />
        </SiteFooterGate>
        <Analytics />
        <RouteAnnouncerPatch />
        <RichfieldToaster />
      </body>
    </html>
  );
}
