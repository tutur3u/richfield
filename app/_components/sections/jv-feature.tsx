import Image from "next/image";
import { Eyebrow } from "@/app/_components/primitives/eyebrow";
import { DisplayHeading } from "@/app/_components/primitives/display-heading";
import { SoftCta } from "@/app/_components/primitives/soft-cta";
import { site } from "@/content/en/site";

type Variant = "full" | "slim";

export function JvFeature({ variant = "full" }: { variant?: Variant }) {
  return (
    <section
      aria-label="Joint venture: Dory Rich"
      className={`bg-cream px-6 sm:px-10 ${
        variant === "slim"
          ? "py-[clamp(72px,8vw,100px)]"
          : "py-[clamp(120px,14vw,200px)]"
      }`}
    >
      <div className="mx-auto max-w-[1300px]">
        <div className="flex flex-col gap-6">
          <Eyebrow tone="gold">Joint venture</Eyebrow>
          <DisplayHeading level={2} tone="ink">
            Dory Rich JSC.
          </DisplayHeading>
        </div>

        <div className="relative mt-12 rounded-sm border border-gold/60 bg-paper p-10 sm:p-16 lg:p-20">
          <span className="absolute -top-3 left-10 bg-paper px-3 text-[11px] font-medium uppercase tracking-[0.32em] text-green">
            JV · Est. 2024
          </span>

          <div className="grid gap-12 lg:grid-cols-[2fr_1fr] lg:items-center">
            <div className="flex flex-col gap-6">
              <span className="text-[11px] uppercase tracking-[0.32em] text-muted">
                TCP Group × Richfield
              </span>
              <h3 className="font-display text-[clamp(32px,4vw,42px)] leading-[1.1] text-ink">
                A successful collaboration between two leading corporations.
              </h3>
              <p className="max-w-[55ch] text-[17px] leading-[1.55] text-muted">
                Dory Rich JSC pairs TCP Group&apos;s leadership in Thai
                energy-drink production with Richfield Group&apos;s nationwide
                FMCG distribution capability in Vietnam. Manufacturing,
                brand-building, and distribution under one roof.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center gap-8 lg:items-start">
              <Image
                src="/photos/logos/dory-rich.webp"
                alt="Dory Rich JSC logo"
                width={244}
                height={156}
                sizes="(min-width: 1024px) 240px, 200px"
                className="h-auto w-[clamp(180px,18vw,240px)]"
              />
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
