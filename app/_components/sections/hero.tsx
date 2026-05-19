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
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-cream text-ink"
    >
      <TintedPhoto
        src={peoplePhotos.heroAerial.src}
        alt={peoplePhotos.heroAerial.alt}
        intensity="soft"
        priority
        fill
        sizes="100vw"
        className="absolute inset-0 -z-10"
        imgClassName="object-[center_45%]"
      />

      {/* Photo overlay — mobile/tablet: vertical cream wash so content stacks
          legibly; lg+: horizontal split with photo visible on the right. */}
      <div aria-hidden className="photo-overlay-left absolute inset-0 -z-10" />

      <span
        aria-hidden
        className="absolute right-[-12%] top-[14%] -z-10 h-[460px] w-[460px] rounded-full bg-gold/25 blur-3xl motion-safe:animate-[pulse_12s_ease-in-out_infinite]"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1500px] px-6 pb-[clamp(56px,7vw,100px)] pt-[clamp(120px,14vw,160px)] sm:px-10">
        <div className="flex max-w-[64ch] flex-col gap-8">
          <Eyebrow tone="gold">Established {site.founded}</Eyebrow>
          <DisplayHeading level={1} tone="ink" className="max-w-[16ch]">
            From market entry to *nationwide distribution*.
          </DisplayHeading>
          <p className="max-w-[52ch] text-[clamp(16px,1.5vw,19px)] leading-[1.55] text-muted">
            {site.description}
          </p>
          <div className="mt-4 flex flex-col gap-6 border-t border-ink/15 pt-8">
            <span className="text-[10px] uppercase tracking-[0.32em] text-green">
              {site.countries.join(" · ")}
            </span>
            <KpiStrip items={KPIS} tone="on-cream" />
          </div>
        </div>
      </div>
    </section>
  );
}
