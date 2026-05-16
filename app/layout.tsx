import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
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
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable}`}
    >
      <body className="min-h-dvh bg-cream text-ink antialiased">
        {children}
        <Analytics />
        <RouteAnnouncerPatch />
      </body>
    </html>
  );
}
