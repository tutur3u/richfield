import Image from "next/image";
import { Spread, Eyebrow } from "@/app/_components/magazine/primitives/spread";
import { CtaLink } from "@/app/_components/magazine/primitives/cta-link";
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
      {/* Section eyebrow + masthead title */}
      <Eyebrow tone="gold" className="mb-[var(--v2-rhythm)]">
        JOINT VENTURE
      </Eyebrow>

      {/* Framed feature — the "boxed" magazine module. */}
      <div className="relative flex border border-current/20">
          {/* Tab index straddling the top border */}

          <div className="grid w-full grid-cols-12 gap-x-[var(--v2-col-gap)] gap-y-[clamp(28px,3vw,40px)] p-[clamp(22px,2.8vw,52px)]">
            {/* Left — the editorial story */}
            <div className="col-span-12 flex flex-col lg:col-span-7">
              <Eyebrow tone="gold" rule={false} className="mb-[var(--v2-rhythm)]">
                ESTABLISHED 2024
              </Eyebrow>

              <h3 className="font-display text-[clamp(1.8rem,3.4vw,3rem)] leading-[1.05] tracking-[-0.022em]">
                <span className="block">A successful collaboration</span>
                <span className="block">between two leading corporations.</span>
              </h3>

              <p className="v2-size-body mt-[var(--v2-rhythm)] max-w-[52ch] opacity-90">
                Dory Rich JSC pairs TCP Group&apos;s leadership in Thai
                energy-drink production with Richfield Group&apos;s nationwide
                FMCG distribution capability in Vietnam, bringing manufacturing,
                brand-building, and distribution under one roof.
              </p>

              {/* Partner logos — the two corporations, on paper plates */}
              <div className="mt-auto pt-[clamp(28px,3vw,48px)]">
                <p className="v2-mono v2-size-folio mb-[clamp(12px,1.2vw,18px)] opacity-55">
                  IN PARTNERSHIP
                </p>
                <div className="flex items-center gap-[clamp(14px,1.6vw,24px)]">
                  {tcpLogo ? (
                    <span className="inline-flex items-center rounded-[3px] bg-paper px-[clamp(12px,1.2vw,18px)] py-[clamp(8px,0.8vw,12px)]">
                      <Image
                        src={tcpLogo}
                        alt="TCP Group"
                        width={80}
                        height={80}
                        sizes="120px"
                        className="h-[clamp(28px,3vw,40px)] w-auto object-contain"
                      />
                    </span>
                  ) : null}
                  <span aria-hidden className="text-gold text-[clamp(1.1rem,1.4vw,1.4rem)]">
                    &times;
                  </span>
                  <span className="inline-flex items-center rounded-[3px] bg-paper px-[clamp(12px,1.2vw,18px)] py-[clamp(8px,0.8vw,12px)]">
                    <Image
                      src={RICHFIELD_LOGO}
                      alt="Richfield Group"
                      width={120}
                      height={110}
                      sizes="120px"
                      className="h-[clamp(28px,3vw,40px)] w-auto object-contain"
                    />
                  </span>
                </div>
              </div>
            </div>

            {/* Right — the venture mark + link */}
            <div className="col-span-12 flex flex-col items-center justify-center gap-[clamp(20px,2.2vw,32px)] lg:col-span-5 lg:items-end">
              {doryLogo ? (
                <span className="inline-flex items-center rounded-[4px] bg-paper px-[clamp(22px,2.4vw,40px)] py-[clamp(18px,2vw,32px)]">
                  <Image
                    src={doryLogo}
                    alt="Dory Rich"
                    width={240}
                    height={80}
                    sizes="320px"
                    className="h-[clamp(44px,5vw,72px)] w-auto object-contain"
                  />
                </span>
              ) : null}

              <CtaLink href={site.external.doryRich} external arrow="→">
                VISIT DORYRICH.COM.VN
              </CtaLink>
            </div>
          </div>
        </div>
    </Spread>
  );
}
