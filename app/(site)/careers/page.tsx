import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/app/_components/primitives/page-header";
import { Eyebrow } from "@/app/_components/primitives/eyebrow";
import { HairlineRule } from "@/app/_components/primitives/hairline-rule";
import { TintedPhoto } from "@/app/_components/primitives/tinted-photo";
import { FacebookIcon } from "@/app/_components/primitives/social-icons";
import { RevealOnScroll } from "@/app/_components/reveal-on-scroll";
import { SoftCtaCloser } from "@/app/_components/sections/soft-cta-closer";
import { whyRichfield, heritageBlock, openPositions } from "@/content/en/careers";
import { peoplePhotos } from "@/content/en/photography";
import { site } from "@/content/en/site";

const LIFE_TILES = [
  {
    photo: peoplePhotos.groupCompany,
    caption: "Annual company portrait",
    gridClass: "lg:col-span-2 lg:row-span-2",
  },
  {
    photo: peoplePhotos.workshop1,
    caption: "Sales workshop",
    gridClass: "lg:col-start-3 lg:row-start-1",
  },
  {
    photo: peoplePhotos.celebration,
    caption: "Team celebrations",
    gridClass: "lg:col-start-4 lg:row-start-1",
  },
  {
    photo: peoplePhotos.workshop2,
    caption: "Cross-functional planning",
    gridClass: "lg:col-start-3 lg:col-span-2 lg:row-start-2",
  },
  {
    photo: peoplePhotos.happyTime,
    caption: "Happy hour, November 2025",
    gridClass: "lg:col-start-1 lg:row-start-3",
  },
  {
    photo: peoplePhotos.workshopRoom,
    caption: "Training centre",
    gridClass: "lg:col-start-2 lg:col-span-3 lg:row-start-3",
  },
];

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
            {whyRichfield.map((p, idx) => (
              <RevealOnScroll
                as="li"
                key={p.heading}
                delayMs={idx * 80}
                className="grid gap-4 border-t border-line py-8 lg:grid-cols-[28ch_1fr] lg:gap-12"
              >
                <h3 className="font-display text-[clamp(24px,2.5vw,32px)] text-ink">
                  {p.heading}
                </h3>
                <p className="max-w-[60ch] text-[17px] leading-[1.55] text-muted">
                  {p.body}
                </p>
              </RevealOnScroll>
            ))}
            <HairlineRule />
          </ul>
        </div>
      </section>

      <section className="bg-paper px-6 py-[clamp(96px,11vw,140px)] sm:px-10">
        <div className="mx-auto max-w-[60ch]">
          <RevealOnScroll>
            <p className="text-[clamp(20px,2vw,24px)] leading-[1.55] text-ink">
              {heritageBlock}
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <section
        aria-labelledby="life-at-richfield-heading"
        className="bg-cream pb-[clamp(64px,8vw,120px)] pt-[clamp(72px,9vw,120px)]"
      >
        <RevealOnScroll className="mx-auto mb-[clamp(40px,5vw,72px)] flex max-w-[1500px] flex-col gap-4 px-6 sm:px-10">
          <Eyebrow tone="gold">Life at Richfield</Eyebrow>
          <h2
            id="life-at-richfield-heading"
            className="max-w-[24ch] font-display text-[clamp(32px,4vw,56px)] leading-[1.1] text-ink"
          >
            The people behind the *network*.
          </h2>
          <p className="max-w-[60ch] text-[17px] leading-[1.55] text-muted">
            Workshops, openings, celebrations, congresses. Three decades of
            partnerships, told in the moments that built them.
          </p>
        </RevealOnScroll>

        <div className="px-3 sm:px-6">
          <div className="mx-auto grid w-full max-w-[1500px] auto-rows-[44vw] grid-cols-2 gap-2 sm:auto-rows-[24vw] sm:grid-cols-3 sm:gap-3 lg:auto-rows-[18vw] lg:grid-cols-4">
            {LIFE_TILES.map((tile, idx) => (
              <RevealOnScroll
                as="figure"
                key={tile.caption}
                delayMs={idx * 80}
                className={`group relative overflow-hidden rounded-sm bg-ink ${
                  idx === 0 ? "col-span-2 row-span-2" : ""
                } ${tile.gridClass}`}
              >
                <TintedPhoto
                  src={tile.photo.src}
                  alt={tile.photo.alt}
                  intensity="soft"
                  fill
                  sizes="(min-width: 1024px) 38vw, (min-width: 640px) 33vw, 50vw"
                  className="absolute inset-0 h-full w-full"
                  imgClassName="motion-safe:transition-transform motion-safe:duration-700 group-hover:scale-[1.05]"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                />
                <figcaption className="absolute inset-x-0 bottom-0 px-4 pb-4 text-[10px] uppercase tracking-[0.32em] text-paper sm:px-6 sm:pb-6 sm:text-[11px]">
                  <span className="inline-block translate-y-1 opacity-90 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    {tile.caption}
                  </span>
                </figcaption>
              </RevealOnScroll>
            ))}
          </div>
        </div>

        <RevealOnScroll className="mx-auto mt-[clamp(40px,5vw,72px)] flex max-w-[1500px] flex-col items-start gap-4 px-6 sm:px-10">
          <p className="max-w-[60ch] text-[15px] leading-[1.55] text-muted">
            See more from across our offices, warehouses, and field teams.
          </p>
          <a
            href={site.socials.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 rounded-sm bg-[#1877F2] py-3 pl-3 pr-5 text-[12px] font-medium uppercase tracking-[0.24em] text-white transition-colors duration-200 hover:bg-[#0d65d9] focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-white text-[#1877F2]">
              <FacebookIcon className="h-5 w-5" />
            </span>
            Follow on Facebook
            <span
              aria-hidden
              className="transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </RevealOnScroll>
      </section>

      <section className="bg-ink px-6 py-[clamp(96px,11vw,140px)] sm:px-10 text-paper">
        <RevealOnScroll className="mx-auto flex max-w-[1300px] flex-col gap-8">
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
        </RevealOnScroll>
      </section>

      <SoftCtaCloser />
    </>
  );
}
