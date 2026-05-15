import { DisplayHeading } from "@/app/_components/primitives/display-heading";
import { Eyebrow } from "@/app/_components/primitives/eyebrow";
import { KpiStrip } from "@/app/_components/primitives/kpi-strip";
import { TintedPhoto } from "@/app/_components/primitives/tinted-photo";
import { peoplePhotos } from "@/content/en/photography";
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
      className="relative isolate flex min-h-[88svh] flex-col justify-end overflow-hidden bg-ink text-paper"
    >
      <TintedPhoto
        src={peoplePhotos.groupCompany.src}
        alt={peoplePhotos.groupCompany.alt}
        intensity="medium"
        priority
        fill
        sizes="100vw"
        className="absolute inset-0 -z-10"
        imgClassName="object-[center_30%]"
      />

      {/* Horizontal editorial fade — dense on the left for legibility,
          dissolving across to reveal the photo on the right. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(18,24,21,0.92)_0%,rgba(18,24,21,0.78)_22%,rgba(18,24,21,0.45)_48%,rgba(18,24,21,0.15)_72%,rgba(18,24,21,0)_92%)]"
      />
      {/* Subtle bottom darken so KPIs sit cleanly. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(18,24,21,0)_55%,rgba(18,24,21,0.55)_100%)]"
      />

      <span
        aria-hidden
        className="absolute right-[-12%] top-[14%] -z-10 h-[460px] w-[460px] rounded-full bg-gold/20 blur-3xl motion-safe:animate-[pulse_12s_ease-in-out_infinite]"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1500px] px-6 pb-[clamp(56px,7vw,100px)] pt-[clamp(120px,14vw,160px)] sm:px-10">
        <div className="flex max-w-[64ch] flex-col gap-8">
          <Eyebrow tone="gold">Established {site.founded}</Eyebrow>
          <DisplayHeading level={1} tone="white" className="max-w-[16ch]">
            From market entry to *nationwide distribution*.
          </DisplayHeading>
          <p className="max-w-[52ch] text-[clamp(16px,1.5vw,19px)] leading-[1.55] text-paper/85">
            {site.description}
          </p>
          <div className="mt-4 flex flex-col gap-6 border-t border-paper/20 pt-8">
            <span className="text-[10px] uppercase tracking-[0.32em] text-gold/90">
              {site.countries.join(" · ")}
            </span>
            <KpiStrip items={KPIS} tone="on-green" />
          </div>
        </div>
      </div>
    </section>
  );
}
