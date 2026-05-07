import type { Metadata } from "next";
import { Hero } from "@/app/_components/sections/hero";
import { WhatWeDo } from "@/app/_components/sections/what-we-do";
import { FootprintMap } from "@/app/_components/sections/footprint-map";
import { Timeline } from "@/app/_components/sections/timeline";
import { BrandWall } from "@/app/_components/sections/brand-wall";
import { JvFeature } from "@/app/_components/sections/jv-feature";
import { SoftCtaCloser } from "@/app/_components/sections/soft-cta-closer";
import { homepageMilestones } from "@/content/en/milestones";
import { site } from "@/content/en/site";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Richfield Group: From Market Entry to Nationwide Distribution",
  description: site.description,
  alternates: { canonical: site.domainCanonical },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.legalName,
  alternateName: site.name,
  url: site.domainCanonical,
  logo: `${site.domainCanonical}/og.png`,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.line1,
    addressLocality: "Ho Chi Minh City",
    addressCountry: "VN",
  },
  telephone: site.phones.officeTel,
  sameAs: [
    site.socials.facebook,
    site.socials.linkedin,
    site.socials.zalo,
  ].filter(Boolean),
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(orgJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Hero />
      <WhatWeDo />
      <FootprintMap />
      <Timeline
        milestones={homepageMilestones}
        eyebrow="Our journey"
        heading="A story of *partnerships* over thirty years."
      />
      <BrandWall />
      <JvFeature variant="full" />
      <SoftCtaCloser />
    </>
  );
}
