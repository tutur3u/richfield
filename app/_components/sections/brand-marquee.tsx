import Image from "next/image";
import { DisplayHeading } from "@/app/_components/primitives/display-heading";
import { Eyebrow } from "@/app/_components/primitives/eyebrow";
import { SoftCta } from "@/app/_components/primitives/soft-cta";
import { RevealOnScroll } from "@/app/_components/reveal-on-scroll";
import { brands } from "@/content/en/brands";

type Lane = {
  direction: "left" | "right";
  duration: string;
  brands: typeof brands;
};

// Spread logos across three lanes so each lane has a distinct rhythm.
function buildLanes(): Lane[] {
  const withLogo = brands.filter((b) => b.logoSrc);
  const lanes: typeof brands[] = [[], [], []];
  withLogo.forEach((b, i) => lanes[i % 3].push(b));
  return [
    { direction: "left", duration: "55s", brands: lanes[0] },
    { direction: "right", duration: "70s", brands: lanes[1] },
    { direction: "left", duration: "85s", brands: lanes[2] },
  ];
}

const LANES = buildLanes();

function MarqueeLane({ lane }: { lane: Lane }) {
  // Render the brand strip twice so the -50% translate animation loops
  // seamlessly with no visible jump.
  const items = [...lane.brands, ...lane.brands];
  return (
    <div className="relative overflow-hidden">
      <div
        className={`marquee-track ${
          lane.direction === "left"
            ? "marquee-track--left"
            : "marquee-track--right"
        } flex w-max items-center gap-[clamp(48px,6vw,96px)] py-6`}
        style={{ ["--marquee-duration" as string]: lane.duration }}
      >
        {items.map((b, idx) =>
          b.logoSrc ? (
            <div
              key={`${b.name}-${idx}`}
              className="relative h-14 w-[clamp(120px,12vw,180px)] shrink-0 sm:h-16"
            >
              <Image
                src={b.logoSrc}
                alt=""
                fill
                sizes="180px"
                className="object-contain opacity-70 [filter:grayscale(0.25)]"
              />
            </div>
          ) : null,
        )}
      </div>
    </div>
  );
}

export function BrandMarquee() {
  return (
    <section
      aria-labelledby="brand-marquee-heading"
      className="relative isolate overflow-hidden bg-cream"
    >
      <div
        aria-hidden
        className="absolute inset-0 flex flex-col justify-center gap-[clamp(20px,3vw,48px)] py-[clamp(64px,9vw,140px)]"
      >
        {LANES.map((lane, i) => (
          <MarqueeLane key={i} lane={lane} />
        ))}
      </div>

      {/* Horizontal editorial fade — cream over the left half so the
          heading reads, fully transparent on the right so the lanes
          breathe through. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-cream)_0%,rgba(244,236,220,0.95)_25%,rgba(244,236,220,0.7)_45%,rgba(244,236,220,0.25)_70%,rgba(244,236,220,0)_92%)]"
      />
      {/* Soft top/bottom feather so the lanes don't crash into neighbors. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,var(--color-cream)_0%,rgba(244,236,220,0)_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(0deg,var(--color-cream)_0%,rgba(244,236,220,0)_100%)]"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1500px] flex-col items-start gap-8 px-6 py-[clamp(96px,12vw,160px)] sm:px-10">
        <RevealOnScroll className="flex max-w-[56ch] flex-col gap-6">
          <Eyebrow tone="gold">Our brands</Eyebrow>
          <DisplayHeading level={2} className="max-w-[18ch]">
            Trusted by the world's most *loved* brands.
          </DisplayHeading>
          <p className="max-w-[52ch] text-[clamp(15px,1.4vw,17px)] leading-[1.55] text-muted">
            From confectionery and beverages to personal care and stationery
            — Richfield carries the brands shoppers already reach for, in
            partnerships that often run for decades.
          </p>
          <div className="mt-2">
            <SoftCta href="/brands">See the full portfolio</SoftCta>
          </div>
        </RevealOnScroll>
      </div>
      {/* sr-only heading still exposes the section to assistive tech */}
      <h2 id="brand-marquee-heading" className="sr-only">
        Brands distributed by Richfield
      </h2>
    </section>
  );
}
