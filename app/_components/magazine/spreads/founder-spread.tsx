import Image from "next/image";
import { Spread, Eyebrow } from "@/app/_components/magazine/primitives/spread";
import { founder } from "@/content/en/founder";

/**
 * "Our Story · The Founder" — Chua Eng Siang. Portrait plate on the left, the
 * biography and his motto as a pull-quote on the right. Sits on paper so it
 * reads as its own leaf between the cream Story opener and the white Timeline.
 */
export function FounderSpread() {
  return (
    <Spread id="founder" bg="cream">
      <div className="grid grid-cols-12 gap-x-[var(--v2-col-gap)] gap-y-[var(--v2-flow)]">
        {/* Portrait plate */}
        <figure className="col-span-12 lg:col-span-5">
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            <Image
              src={founder.photo}
              alt={`${founder.name}, ${founder.role} of Richfield Group.`}
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover v2-photo-duotone"
            />
          </div>
          <figcaption className="v2-mono v2-size-folio mt-3 opacity-65">
            {founder.name.toUpperCase()} · {founder.role.toUpperCase()}
          </figcaption>
        </figure>

        {/* Story */}
        <div className="col-span-12 hyphens-auto lg:col-span-7" lang="en">
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
    </Spread>
  );
}
