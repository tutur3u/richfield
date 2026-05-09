import { Eyebrow } from "@/app/_components/primitives/eyebrow";
import { DisplayHeading } from "@/app/_components/primitives/display-heading";
import { SoftCta } from "@/app/_components/primitives/soft-cta";
import { site } from "@/content/en/site";

type Variant = "full" | "slim";

export function JvFeature({ variant = "full" }: { variant?: Variant }) {
  return (
    <section
      aria-label="Joint venture: Dory Rich"
      className={`bg-ink px-6 sm:px-10 ${
        variant === "slim"
          ? "py-[clamp(72px,8vw,100px)]"
          : "py-[clamp(120px,14vw,200px)]"
      }`}
    >
      <div className="mx-auto max-w-[1300px]">
        <div className="flex flex-col gap-6">
          <Eyebrow tone="gold">Joint venture</Eyebrow>
          <DisplayHeading level={2} tone="white">
            Dory Rich JSC.
          </DisplayHeading>
        </div>

        <div className="relative mt-12 border border-gold p-10 sm:p-16 lg:p-20">
          <span className="absolute -top-3 left-10 bg-ink px-3 font-display italic text-gold">
            JV
          </span>

          <div className="grid gap-12 lg:grid-cols-[2fr_1fr]">
            <div className="flex flex-col gap-6">
              <span className="text-[11px] uppercase tracking-[0.32em] text-gold">
                Established 2024 · TCP Group × Richfield
              </span>
              <h3 className="font-display text-[clamp(32px,4vw,42px)] leading-[1.1] text-paper">
                A successful collaboration between two leading corporations.
              </h3>
              <p className="max-w-[55ch] text-[17px] leading-[1.55] text-paper/70">
                Dory Rich JSC pairs TCP Group's leadership in Thai energy-drink
                production with Richfield Group's nationwide FMCG distribution
                capability in Vietnam. Manufacturing, brand-building, and
                distribution under one roof.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center gap-6 text-center lg:items-start lg:text-left">
              <span className="font-display text-[clamp(56px,6vw,80px)] italic leading-[1] text-gold">
                Dory
                <br />
                Rich
              </span>
              <SoftCta href={site.external.doryRich} external>
                Visit doryrich.com.vn
              </SoftCta>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
