import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Fraunces,
  Schibsted_Grotesk,
  Newsreader,
} from "next/font/google";
import "./globals.css";
import { RouteAnnouncerPatch } from "@/app/_components/route-announcer-patch";

const geistSans = Geist({
  subsets: ["latin", "latin-ext"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

// Fraunces: same editorial serif energy as Playfair, but with cleaner,
// less ornamental italic glyphs so emphasized words stay readable.
const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  axes: ["SOFT", "opsz"],
  display: "swap",
});

// v2 — magazine-grade grotesque for display sizing across the cover and
// spread headings. Referenced from globals.css via --font-display-v2.
const schibsted = Schibsted_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display-v2",
  display: "swap",
});

// v2 — italic accent only. Used large for standfirsts and pull-quotes,
// never inline. Referenced from globals.css via --font-italic-v2.
const newsreader = Newsreader({
  subsets: ["latin", "latin-ext"],
  variable: "--font-italic-v2",
  style: ["italic"],
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
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${schibsted.variable} ${newsreader.variable}`}
    >
      <body className="min-h-dvh bg-cream text-ink antialiased">
        {children}
        <Analytics />
        <RouteAnnouncerPatch />
      </body>
    </html>
  );
}
