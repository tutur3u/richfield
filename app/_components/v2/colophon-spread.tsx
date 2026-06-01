import Image from "next/image";
import { site } from "@/content/en/site";

export function ColophonSpread() {
  return (
    <section
      id="colophon"
      className="v2-display relative flex w-full flex-col lg:min-h-[100svh]"
    >
      <div className="mx-auto flex w-full max-w-[1500px] flex-1 flex-col px-6 pb-[clamp(24px,3.5vw,48px)] pt-[calc(var(--v2-runhead)+clamp(8px,1.5vw,20px))] sm:px-10 lg:px-12">
        {/* Body grid: lockup + editor + contact + photo, fills viewport */}
        <div className="grid flex-1 grid-cols-12 gap-x-[var(--v2-col-gap)] gap-y-8">
          {/* Left: huge 1994—2026 lockup */}
          <div className="col-span-12 flex flex-col lg:col-span-7">
            <p className="v2-mono v2-size-eyebrow mb-[var(--v2-rhythm)] flex items-center gap-3 text-gold-strong">
              <span aria-hidden className="inline-block h-px w-8 bg-current opacity-80" />
              ESTABLISHED — THIRTY YEARS ON
            </p>
            <p
              className="font-display text-[clamp(4rem,9.5vw,8rem)] leading-[0.86] tracking-[-0.03em] text-balance"
              aria-label="1994 to 2026"
            >
              1994&nbsp;<span className="text-gold-strong">—</span>&nbsp;2026.
            </p>
            <p className="v2-mono v2-size-folio mt-5 opacity-65">
              VIETNAM · CAMBODIA · MYANMAR — THREE COUNTRIES, ONE GROUP
            </p>

            {/* Photo: kept at 3:2 source aspect, sits at the bottom-left of the lockup column */}
            <div className="mt-auto relative aspect-[3/2] w-full max-w-[640px] overflow-hidden">
              <Image
                src="/photos/people/group-company-1920.webp"
                alt="Richfield Worldwide JSC — the full company in 2026."
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover v2-photo-duotone"
                style={{ objectPosition: "center 50%" }}
                priority={false}
              />
            </div>
          </div>

          {/* Right: editor's note + contact */}
          <div className="col-span-12 flex flex-col gap-6 lg:col-span-5">
            <div>
              <p className="v2-mono v2-size-eyebrow mb-[var(--v2-rhythm)] flex items-center gap-3 text-gold-strong">
                <span aria-hidden className="inline-block h-px w-8 bg-current opacity-80" />
                EDITOR&apos;S NOTE
              </p>
              <p className="v2-size-body max-w-[40ch] opacity-90">
                Thirty years on, the work is the same. A pallet, a route, a
                shelf. The brands change, the country grows, the network keeps
                turning. Issue 30 closes here — the next opens in 2031.
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-x-5 gap-y-4 border-t border-current/20 pt-5">
              <div className="col-span-2">
                <dt className="v2-mono v2-size-folio opacity-55">OFFICE</dt>
                <dd className="v2-size-body mt-1 max-w-[34ch]">
                  {site.address.line1}
                  <br />
                  {site.address.line2}
                </dd>
              </div>
              <div>
                <dt className="v2-mono v2-size-folio opacity-55">TELEPHONE</dt>
                <dd className="v2-size-body mt-1">
                  <a
                    className="hover:opacity-70"
                    href={`tel:${site.phones.officeTel}`}
                  >
                    {site.phones.office}
                  </a>
                  <br />
                  <a
                    className="hover:opacity-70 opacity-75"
                    href={`tel:${site.phones.hotlineTel}`}
                  >
                    Hotline · {site.phones.hotline}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="v2-mono v2-size-folio opacity-55">EMAIL</dt>
                <dd className="v2-size-body mt-1 [overflow-wrap:anywhere]">
                  <a className="hover:opacity-70" href={`mailto:${site.email}`}>
                    {site.email}
                  </a>
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="v2-mono v2-size-folio opacity-55">SOCIAL</dt>
                <dd className="v2-size-body mt-1">
                  <a
                    href={site.socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-70"
                  >
                    Facebook ↗
                  </a>
                </dd>
              </div>
            </dl>

            <p className="v2-mono v2-size-folio mt-auto pt-5 opacity-60">
              <span aria-hidden className="v2-rule-gold mr-3 inline-block w-6 align-middle" />
              NEXT ISSUE — 2031
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
