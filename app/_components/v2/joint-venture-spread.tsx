import Image from "next/image";
import { partnerLogos } from "@/content/en/photography";
import { site } from "@/content/en/site";

const RICHFIELD_LOGO = "/photos/logos/richfield.webp";

export function JointVentureSpread() {
  const doryLogo = partnerLogos["Dory Rich"];
  const tcpLogo = partnerLogos.TCP;
  return (
    <section
      id="jv"
      className="v2-display relative flex min-h-[100svh] w-full flex-col lg:h-[100svh]"
    >
      <div className="mx-auto flex w-full max-w-[1500px] flex-1 flex-col px-6 py-[clamp(24px,3.5vw,48px)] sm:px-10 lg:px-12">
        {/* Top folio — running head, as on every spread */}
        <header className="v2-mono v2-size-folio mb-[clamp(18px,2.4vw,32px)] flex items-center gap-6 opacity-55">
          <span>RICHFIELD WORLDWIDE JSC</span>
          <span aria-hidden className="v2-rule flex-1" />
        </header>

        {/* Section eyebrow + masthead title */}
        <p className="v2-mono v2-size-eyebrow mb-[clamp(14px,1.6vw,22px)] flex items-center gap-3 text-gold">
          <span aria-hidden className="inline-block h-px w-8 bg-current opacity-80" />
          JOINT VENTURE
          <span aria-hidden className="inline-block h-px w-10 bg-current opacity-50" />
        </p>

        <h2 className="font-display text-[clamp(3rem,7vw,6rem)] leading-[0.95] tracking-[-0.03em]">
          Dory Rich JSC<span className="text-gold">.</span>
        </h2>

        {/* Framed feature — the "boxed" magazine module with a tab index. */}
        <div className="relative mt-[clamp(22px,2.6vw,40px)] flex flex-1 border border-current/20">
          {/* Tab index straddling the top border */}
          <span className="v2-italic absolute -top-[clamp(14px,1.5vw,19px)] left-[clamp(20px,2.6vw,44px)] bg-ink px-3 text-[clamp(1.1rem,1.4vw,1.4rem)] leading-none text-gold">
            JV
          </span>

          <div className="grid w-full grid-cols-12 gap-x-[clamp(24px,3vw,64px)] gap-y-[clamp(28px,3vw,40px)] p-[clamp(22px,2.8vw,52px)]">
            {/* Left — the editorial story */}
            <div className="col-span-12 flex flex-col lg:col-span-7">
              <p className="v2-mono v2-size-eyebrow mb-[clamp(16px,1.8vw,26px)] flex items-center gap-3 text-gold">
                <span aria-hidden className="inline-block h-px w-8 bg-current opacity-80" />
                ESTABLISHED 2024
              </p>

              <h3 className="font-display text-[clamp(1.8rem,3.4vw,3rem)] leading-[1.05] tracking-[-0.022em]">
                <span className="block">A successful collaboration</span>
                <span className="block">between two leading corporations.</span>
              </h3>

              <p className="v2-size-body mt-[clamp(18px,1.8vw,28px)] max-w-[52ch] opacity-85">
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

              <a
                href={site.external.doryRich}
                target="_blank"
                rel="noopener noreferrer"
                className="group v2-mono v2-size-folio inline-flex w-fit items-center gap-2 border-b border-gold/40 pb-1 text-gold transition-colors duration-300 ease-out hover:border-gold"
              >
                VISIT DORYRICH.COM.VN
                <span
                  aria-hidden
                  className="transition-transform duration-300 ease-out motion-safe:group-hover:translate-x-1"
                >
                  →
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
