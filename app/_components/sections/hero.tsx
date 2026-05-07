import { DisplayHeading } from "@/app/_components/primitives/display-heading";
import { Eyebrow } from "@/app/_components/primitives/eyebrow";
import { HairlineRule } from "@/app/_components/primitives/hairline-rule";
import { KpiStrip } from "@/app/_components/primitives/kpi-strip";
import { site } from "@/content/en/site";

const KPIS = [
  { label: "Years", value: "30+" },
  { label: "Sub-distributors", value: "300+" },
  { label: "Retail outlets", value: "180K" },
  { label: "Salesmen", value: "800+" },
];

export function Hero() {
  return (
    <section
      aria-label="Hero"
      className="relative grid min-h-[100svh] grid-cols-1 bg-green text-paper lg:grid-cols-[1.1fr_0.9fr]"
    >
      <div className="relative hidden overflow-hidden lg:block">
        <span
          aria-hidden
          className="absolute -left-32 top-1/3 h-[480px] w-[480px] rounded-full bg-gold/30 blur-3xl motion-safe:animate-[pulse_8s_ease-in-out_infinite]"
        />
        <span
          aria-hidden
          className="absolute right-10 top-10 h-[260px] w-[260px] rounded-full bg-gold/20 blur-3xl motion-safe:animate-[pulse_10s_ease-in-out_infinite]"
        />
        <svg
          aria-hidden
          viewBox="0 0 600 800"
          className="absolute inset-0 h-full w-full opacity-30"
        >
          <path
            d="M50 700 Q 200 400 550 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2 8"
            className="text-gold"
          />
        </svg>
        <span className="absolute bottom-10 left-10 text-[11px] uppercase tracking-[0.32em] text-gold">
          {site.countries.join(" · ")}
        </span>
      </div>

      <div className="flex flex-col justify-center gap-10 px-6 py-32 sm:px-10 sm:py-40 lg:px-[120px]">
        <Eyebrow tone="gold">Established {site.founded}</Eyebrow>
        <DisplayHeading level={1} tone="white">
          From market entry to *nationwide distribution*.
        </DisplayHeading>
        <p className="max-w-[440px] text-[17px] leading-[1.55] text-paper/75">
          {site.description}
        </p>
        <HairlineRule tone="white-15" />
        <KpiStrip items={KPIS} tone="on-green" />
      </div>
    </section>
  );
}
