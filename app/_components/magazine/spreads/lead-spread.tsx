import Image from "next/image";
import { LeadPhotoCycle } from "@/app/_components/magazine/media/lead-photo-cycle";
import { Spread, Eyebrow } from "@/app/_components/magazine/primitives/spread";
import { ourStoryIntro } from "@/content/en/story";
import { founder } from "@/content/en/founder";

/**
 * "Our Story" flows straight into "The Founder" as one continuous spread. On
 * desktop it's two independent columns: the left runs the Our Story copy then
 * the founder portrait directly beneath it (same width as the text block); the
 * right runs the team carousel then the founder write-up. The columns flow
 * independently — so the portrait lifts straight up under the copy and there's
 * no gap, no matter how tall the carousel is.
 *
 * On mobile the columns dissolve (display:contents) and `order` reflows the
 * pieces to a single reading-order stack:
 *   Our Story: eyebrow+headline → carousel → paragraph
 *   Founder:   eyebrow+headline+bio → portrait
 */
export function LeadSpread({ head = false }: { head?: boolean }) {
  return (
    <Spread id="story" bg="cream" head={head}>
      <div
        className="flex flex-col gap-[var(--v2-flow)] hyphens-auto lg:flex-row lg:items-start lg:gap-[var(--v2-col-gap)]"
        lang="en"
      >
        {/* Left column: Our Story copy + the founder portrait beneath it. */}
        <div className="max-lg:contents lg:flex lg:w-[47%] lg:flex-col lg:gap-[var(--v2-flow)]">
          {/* Our Story text — one block on desktop, but its heading and
              paragraph split apart on mobile (the carousel slots between). */}
          <div className="max-lg:contents">
            <div className="max-lg:order-1 mb-[var(--v2-rhythm)] max-lg:mb-0">
              <Eyebrow className="mb-[var(--v2-rhythm)]">OUR STORY</Eyebrow>

              <h1 className="font-display v2-size-standfirst max-w-[16ch]">
                From a{" "}
                <em className="italic text-gold-strong">single partnership</em>
              </h1>
            </div>

            <p className="v2-dropcap v2-size-body text-left opacity-90 max-lg:order-3 sm:text-justify">
              {ourStoryIntro}
            </p>
          </div>

          <figure id="founder" className="overflow-hidden max-lg:order-5">
            <div className="relative aspect-[2/3] w-full overflow-hidden">
              <Image
                src={founder.photo}
                alt={`${founder.name}, ${founder.role} of Richfield Group.`}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover v2-photo-duotone"
              />
            </div>
            <figcaption className="v2-mono v2-size-folio mt-3 opacity-65">
              {founder.name.toUpperCase()} · {founder.role.toUpperCase()}
            </figcaption>
          </figure>
        </div>

        {/* Right column: team carousel + the founder write-up. */}
        <div className="max-lg:contents lg:flex lg:min-w-0 lg:flex-1 lg:flex-col lg:gap-[var(--v2-flow)]">
          <figure className="overflow-hidden max-lg:order-2">
            <div className="relative aspect-[3/2] w-full overflow-hidden">
              <LeadPhotoCycle />
            </div>
          </figure>

          <div className="max-lg:order-4">
            <Eyebrow className="mb-[var(--v2-rhythm)]">THE FOUNDER</Eyebrow>

            <h2 className="font-display v2-size-standfirst mb-[var(--v2-rhythm)]">
              {founder.name}
              <span className="text-gold-strong">.</span>
            </h2>

            {founder.bio.map((para, i) => (
              <p
                key={i}
                className={`v2-size-body text-left sm:text-justify opacity-90 ${i === 0 ? "v2-dropcap" : "mt-[var(--v2-rhythm)]"}`}
              >
                {para}
              </p>
            ))}

            <blockquote className="mt-[var(--v2-flow)] border-l-2 border-gold-strong pl-5">
              <p className="v2-italic text-[clamp(1.4rem,2.4vw,2rem)] leading-[1.25] text-gold-strong">
                “{founder.motto}”
              </p>
            </blockquote>
          </div>
        </div>
      </div>
    </Spread>
  );
}
