import type { Metadata } from "next";
import { BodyChrome, fontVariables } from "@/app/_components/root-chrome";
import { SiteFooter } from "@/app/_components/magazine/chrome/site-footer";
import { SiteFooterGate } from "@/app/_components/magazine/chrome/site-footer-gate";

// Root layout for the non-localized system surfaces (admin, login,
// verify-token). Always English; the footer stays hidden on /admin via the
// same gate as before.

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
      <BodyChrome
        footer={
          <SiteFooterGate>
            <SiteFooter locale="en" />
          </SiteFooterGate>
        }
      >
        {children}
      </BodyChrome>
    </html>
  );
}
