import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/app/_components/primitives/page-header";
import { Eyebrow } from "@/app/_components/primitives/eyebrow";
import { HairlineRule } from "@/app/_components/primitives/hairline-rule";
import { SoftCta } from "@/app/_components/primitives/soft-cta";
import { SoftCtaCloser } from "@/app/_components/sections/soft-cta-closer";
import { whyRichfield, heritageBlock, openPositions } from "@/content/en/careers";
import { site } from "@/content/en/site";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Careers",
  description: heritageBlock.slice(0, 160),
  alternates: { canonical: "/careers" },
};

export default function CareersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Careers"
        heading="A legacy of growth. A future of *opportunity*."
        tone="green"
      />

      <section className="bg-cream px-6 py-[clamp(96px,11vw,140px)] sm:px-10">
        <div className="mx-auto flex max-w-[1300px] flex-col gap-12">
          <Eyebrow tone="gold">Why Richfield</Eyebrow>
          <ul className="flex flex-col">
            {whyRichfield.map((p) => (
              <li
                key={p.heading}
                className="grid gap-4 border-t border-line py-8 lg:grid-cols-[28ch_1fr] lg:gap-12"
              >
                <h3 className="font-display text-[clamp(24px,2.5vw,32px)] text-ink">
                  {p.heading}
                </h3>
                <p className="max-w-[60ch] text-[17px] leading-[1.55] text-muted">
                  {p.body}
                </p>
              </li>
            ))}
            <HairlineRule />
          </ul>
        </div>
      </section>

      <section className="bg-paper px-6 py-[clamp(96px,11vw,140px)] sm:px-10">
        <div className="mx-auto max-w-[60ch]">
          <p className="text-[clamp(20px,2vw,24px)] leading-[1.55] text-ink">
            {heritageBlock}
          </p>
        </div>
      </section>

      <section className="bg-cream px-6 py-[clamp(96px,11vw,140px)] sm:px-10">
        <div className="mx-auto flex max-w-[1300px] flex-col gap-8">
          <Eyebrow tone="gold">Life at Richfield</Eyebrow>
          <p className="max-w-[60ch] text-[17px] leading-[1.55] text-muted">
            We share moments from across our offices and warehouses on Facebook.
          </p>
          <SoftCta href={site.socials.facebook} external>
            Follow on Facebook
          </SoftCta>
        </div>
      </section>

      <section className="bg-ink px-6 py-[clamp(96px,11vw,140px)] sm:px-10 text-paper">
        <div className="mx-auto flex max-w-[1300px] flex-col gap-8">
          <Eyebrow tone="gold">Open positions</Eyebrow>
          {openPositions.length === 0 ? (
            <div className="flex flex-col gap-4 border-t border-paper/15 py-8">
              <p className="max-w-[60ch] text-[17px] leading-[1.55] text-paper/70">
                We're not actively recruiting right now. Reach out anyway; we'd
                like to hear from people who fit our story.
              </p>
              <Link
                href="/contact"
                className="text-[11px] font-medium uppercase tracking-[0.32em] text-gold underline decoration-gold underline-offset-[6px]"
              >
                Get in touch →
              </Link>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-[0.16em] text-paper/60">
                  <th className="border-b border-paper/15 py-4">Job title</th>
                  <th className="border-b border-paper/15 py-4">Positions</th>
                  <th className="border-b border-paper/15 py-4">Location</th>
                  <th className="border-b border-paper/15 py-4">Deadline</th>
                </tr>
              </thead>
              <tbody>
                {openPositions.map((p) => (
                  <tr key={p.title} className="text-[15px] text-paper/85">
                    <td className="border-b border-paper/10 py-4">
                      {p.href ? (
                        <Link href={p.href} className="hover:text-gold">
                          {p.title}
                        </Link>
                      ) : (
                        p.title
                      )}
                    </td>
                    <td className="border-b border-paper/10 py-4">{p.positions}</td>
                    <td className="border-b border-paper/10 py-4">{p.location}</td>
                    <td className="border-b border-paper/10 py-4">{p.deadline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <SoftCtaCloser />
    </>
  );
}
