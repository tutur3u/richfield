import Image from "next/image";
import { Spread, Eyebrow } from "@/app/_components/magazine/primitives/spread";
import { CtaLink } from "@/app/_components/magazine/primitives/cta-link";
import { RevealOnScroll } from "@/app/_components/reveal-on-scroll";
import { partnerLogos } from "@/content/en/photography";
import { site } from "@/content/en/site";

const RICHFIELD_LOGO = "/photos/logos/richfield.webp";

export function JointVentureSpread() {
  const doryLogo = partnerLogos["Dory Rich"];
  const tcpLogo = partnerLogos.TCP;
  return (
    <Spread
      id="jv"
      bg="transparent"
      surfaceClass="v2-plate-fade-bottom"
    >
      {/* One centered composition on a single vertical spine, framed as a
          boxed magazine feature: a warm paper plate with a fine gold frame,
          the section label straddling the top border as a tab so the label
          and the box read as one object. Inside, the lockup diagrams the
          venture itself: the two parent marks flow down a hairline into the
          Dory Rich mark and its link. */}
      <RevealOnScroll className="relative w-full border border-gold-strong/30 bg-paper px-[clamp(24px,4vw,64px)] py-[clamp(44px,5.5vw,84px)]">
        {/* Label tab — straddles the top border; its paper fill cuts the
            border line behind the text. */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-paper px-[clamp(14px,1.6vw,24px)]">
          <Eyebrow tone="gold" className="justify-center">
            JOINT VENTURE · ESTABLISHED 2024
          </Eyebrow>
        </div>

        {/* Inner rhythm is unified to the site scale: --v2-flow between the
            story and the lockup, --v2-rhythm between everything else. */}
        <div className="flex flex-col items-center gap-y-[var(--v2-flow)] text-center">
          <div className="flex w-full flex-col items-center gap-y-[var(--v2-rhythm)]">
            <h2 className="font-display v2-size-standfirst w-full text-balance">
              A successful collaboration between two leading corporations.
            </h2>

            <p className="v2-size-body w-full opacity-90">
              Dory Rich JSC pairs TCP Group&apos;s leadership in Thai
              energy-drink production with Richfield Group&apos;s nationwide
              FMCG distribution capability in Vietnam, bringing manufacturing,
              brand-building, and distribution under one roof.
            </p>
          </div>

          {/* The lineage lockup — parents, a descending hairline, the venture. */}
          <RevealOnScroll
            delayMs={120}
            className="flex flex-col items-center gap-y-[var(--v2-rhythm)]"
          >
            <p className="v2-mono v2-size-folio opacity-55">IN PARTNERSHIP</p>

            {/* All three marks share one height so no logo outranks the
                others (the Dory Rich source also softens when enlarged). */}
            <div className="flex items-center gap-[clamp(16px,2vw,28px)]">
              {tcpLogo ? (
                <Image
                  src={tcpLogo}
                  alt="TCP Group"
                  width={80}
                  height={80}
                  sizes="128px"
                  className="h-[clamp(44px,4.8vw,64px)] w-auto object-contain"
                />
              ) : null}
              <span aria-hidden className="text-gold text-[clamp(1.1rem,1.4vw,1.4rem)]">
                &times;
              </span>
              <Image
                src={RICHFIELD_LOGO}
                alt="Richfield Group"
                width={120}
                height={110}
                sizes="128px"
                className="h-[clamp(44px,4.8vw,64px)] w-auto object-contain"
              />
            </div>

            {/* Descending hairline — the two parents converge into the venture. */}
            <span
              aria-hidden
              className="block h-[clamp(28px,3.4vw,48px)] w-px bg-gold-rule/60"
            />

            {doryLogo ? (
              <Image
                src={doryLogo}
                alt="Dory Rich"
                width={240}
                height={80}
                sizes="224px"
                className="h-[clamp(52px,5.6vw,76px)] w-auto object-contain"
              />
            ) : null}

            <CtaLink href={site.external.doryRich} external arrow="→">
              VISIT DORYRICH.COM.VN
            </CtaLink>
          </RevealOnScroll>
        </div>
      </RevealOnScroll>
    </Spread>
  );
}
