import Image from "next/image";
import { Eyebrow } from "@/app/_components/magazine/primitives/spread";
import { Folio } from "@/app/_components/magazine/primitives/folio";
import { CtaLink } from "@/app/_components/magazine/primitives/cta-link";
import { brands } from "@/content/en/brands";

// ---------------------------------------------------------------------------
// Brands hero — the homepage Brands chapter. An editorial lockup on the left
// (eyebrow, headline, standfirst, CTA) reads over three lanes of brand logos
// drifting in alternating directions. A cream wash fades the lanes out under
// the type so the headline stays legible. The CTA invites brand partners to
// get in touch. Reuses the .marquee-track CSS from globals.css.
// ---------------------------------------------------------------------------

type Lane = { direction: "left" | "right"; duration: string; brands: typeof brands };

// Spread the logo'd brands across three lanes, each with its own rhythm and
// direction so the wall reads as movement rather than a single scroll.
function buildLanes(): Lane[] {
  const withLogo = brands.filter((b) => b.logoSrc);
  const lanes: (typeof brands)[] = [[], [], []];
  withLogo.forEach((b, i) => lanes[i % 3].push(b));
  return [
    { direction: "left", duration: "55s", brands: lanes[0] },
    { direction: "right", duration: "70s", brands: lanes[1] },
    { direction: "left", duration: "85s", brands: lanes[2] },
  ];
}

const LANES = buildLanes();

function MarqueeLane({ lane }: { lane: Lane }) {
  // Render the strip twice so the -50% translate loops seamlessly.
  const items = [...lane.brands, ...lane.brands];
  return (
    <div className="relative overflow-hidden">
      <div
        className={`marquee-track ${
          lane.direction === "left" ? "marquee-track--left" : "marquee-track--right"
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
                className="object-contain"
              />
            </div>
          ) : null,
        )}
      </div>
    </div>
  );
}

export function BrandsHeroSpread() {
  return (
    <section
      id="brands"
      className="v2-display relative isolate flex w-full flex-col overflow-hidden lg:min-h-[78svh]"
    >
      {/* Moving logo lanes — full bleed, vertically centered behind the type. */}
      <div
        aria-hidden
        className="absolute inset-0 flex flex-col justify-center gap-[clamp(20px,3vw,48px)]"
      >
        {LANES.map((lane, i) => (
          <MarqueeLane key={i} lane={lane} />
        ))}
      </div>

      {/* Cream wash over the left so the headline reads; lanes breathe on the right. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-cream)_0%,color-mix(in_oklch,var(--color-cream)_95%,transparent)_28%,color-mix(in_oklch,var(--color-cream)_60%,transparent)_50%,transparent_88%)]"
      />
      {/* Soft top/bottom feather so the lanes don't crash into neighbours. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,var(--color-cream)_0%,transparent_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(0deg,var(--color-cream)_0%,transparent_100%)]"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1500px] flex-1 flex-col justify-center px-6 py-[var(--v2-section)] sm:px-10 lg:px-12">
        <div className="flex max-w-full flex-col gap-y-[var(--v2-rhythm)] lg:max-w-[48%]">
          <Eyebrow>OUR BRANDS</Eyebrow>

          <h2 className="font-display v2-size-standfirst text-balance text-ink">
            Trusted by the world&rsquo;s most{" "}
            <em className="italic text-gold-strong">loved</em> brands.
          </h2>

          <p className="v2-size-body max-w-[46ch] text-justify opacity-90">
            100+ products across confectionery, beverages, personal care, and
            more — Richfield carries the brands shoppers already reach for, in
            partnerships that often run for decades.
          </p>

          <CtaLink href="/brands" className="mt-1">
            EXPLORE OUR BRANDS
          </CtaLink>
        </div>
      </div>
    </section>
  );
}
