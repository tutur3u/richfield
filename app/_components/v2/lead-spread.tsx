import { LeadPhotoCycle } from "@/app/_components/v2/lead-photo-cycle";

type Stat = readonly [figure: string, label: string];

const STATS: readonly Stat[] = [
  ["180,000", "RETAIL OUTLETS"],
  ["300+", "SUB-DISTRIBUTORS"],
  ["800+", "FIELD SALESMEN"],
  ["30+", "YEARS · SINCE 1994"],
];

export function LeadSpread() {
  return (
    <section
      id="lead"
      className="v2-display relative flex w-full flex-col lg:min-h-[100svh]"
    >
      <div className="mx-auto flex w-full max-w-[1500px] flex-1 flex-col gap-y-[var(--v2-flow)] px-6 pb-[clamp(24px,3.5vw,48px)] pt-[calc(var(--v2-runhead)+clamp(8px,1.5vw,20px))] sm:px-10 lg:px-12">
        {/* Body and stats as one compact group, vertically centered on desktop
            (top-aligned below). Flow gap between the two subsections. */}
        <div className="flex flex-1 flex-col justify-start gap-y-[var(--v2-flow)] lg:justify-center">
          {/* Body block — single flow. Photo floats top-right; eyebrow and
            headline sit in the left column with a max-width so the photo's
            edge never cuts the headline mid-word. Body paragraphs wrap
            around the photo. */}
        <div className="hyphens-auto" lang="en">
          {/* Floated photo carousel — top-right of the body flow. */}
          <div className="relative mb-[clamp(18px,2vw,32px)] aspect-[3/2] w-full lg:float-right lg:mb-[clamp(12px,1.2vw,20px)] lg:ml-[clamp(28px,3vw,52px)] lg:w-[50%]">
            <LeadPhotoCycle />
          </div>

          <p className="v2-mono v2-size-eyebrow mb-[var(--v2-rhythm)] flex items-center gap-3 text-gold-strong">
            <span aria-hidden className="inline-block h-px w-8 bg-current opacity-80" />
            ABOUT THE GROUP
          </p>

          <h2 className="font-display v2-headline mb-[var(--v2-rhythm)]">
            From market entry to nationwide distribution.
          </h2>

          <p className="v2-dropcap v2-size-body text-left sm:text-justify opacity-90">
            Richfield JSC Group is proud to be one of the largest FMCG
            distributors in Vietnam. At present, our distribution network is
            the largest distribution system in the country, covering all
            provinces and cities nationwide with more than 200 sub-distributors
            and nearly 600,000 retail outlets nationwide.
          </p>

          <p className="v2-size-body mt-[var(--v2-rhythm)] text-left sm:text-justify opacity-90">
            At Richfield, we go beyond focusing on production and business
            performance, we are equally committed to our people and the
            communities we serve. Through ongoing social and charitable
            initiatives, we strive to make a meaningful impact beyond our
            organization.
          </p>

          <p className="v2-size-body mt-[var(--v2-rhythm)] text-left sm:text-justify opacity-90">
            Driven by a passionate and dynamic team and strengthened by our
            position as a leading brand with strong support from leading
            brands such as Mars, Richfield has experienced steady growth over
            the past 30+ years. We continue to build on this momentum,
            maintaining consistent and sustainable development in the years
            ahead.
          </p>
        </div>

        {/* Stats band — clears the float; eyebrow + figures share one rhythm. */}
        <div className="clear-both flex flex-col gap-y-[var(--v2-rhythm)]">
          <p className="v2-mono v2-size-eyebrow flex items-center gap-3 text-gold-strong">
            <span aria-hidden className="inline-block h-px w-8 bg-current opacity-80" />
            BY THE NUMBERS
          </p>
          <dl className="grid grid-cols-2 gap-x-[clamp(20px,2.4vw,40px)] gap-y-4 sm:grid-cols-4">
            {STATS.map(([figure, label]) => (
              <div key={label} className="flex flex-col gap-1.5">
                <dt className="v2-display text-[clamp(1.7rem,2.2vw,2.1rem)] leading-none tracking-[-0.022em]">
                  {figure}
                </dt>
                <dd className="v2-mono text-[10px] leading-snug tracking-[0.18em] opacity-55">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        </div>
      </div>
    </section>
  );
}
