import { Analytics } from "@vercel/analytics/next";
import { Geist, Fraunces } from "next/font/google";
import "@/app/globals.css";
import { RouteAnnouncerPatch } from "@/app/_components/route-announcer-patch";
import { RichfieldToaster } from "@/components/RichfieldToaster";

// Shared <html>/<body> chrome for the two root layouts ([locale] for the
// public site, (system) for admin/login). Each root layout must own its own
// <html>/<body>, so the fonts and body furniture are factored here once.

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

export const fontVariables = `${geistSans.variable} ${fraunces.variable}`;

export function BodyChrome({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <body className="min-h-dvh bg-cream text-ink antialiased">
      {children}
      {footer}
      <Analytics />
      <RouteAnnouncerPatch />
      <RichfieldToaster />
    </body>
  );
}
