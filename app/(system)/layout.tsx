import type { Metadata } from "next";
import { BodyChrome, fontVariables } from "@/app/_components/root-chrome";

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

export default function SystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fontVariables} data-scroll-behavior="smooth">
      <BodyChrome>{children}</BodyChrome>
    </html>
  );
}
