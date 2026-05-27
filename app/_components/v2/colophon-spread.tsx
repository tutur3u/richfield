import Image from "next/image";
import { site } from "@/content/en/site";

export function ColophonSpread() {
  return (
    <div id="colophon" className="v2-display">
      <figure className="relative">
        <div className="relative h-[min(60svh,520px)] w-full overflow-hidden">
          <Image
            src="/photos/people/group-company-1920.webp"
            alt="Richfield Worldwide JSC — the full company in 2026."
            fill
            sizes="100vw"
            className="object-cover v2-photo-duotone"
            style={{ objectPosition: "center 35%" }}
            priority={false}
          />
        </div>
        <figcaption className="v2-mono v2-size-folio mx-auto mt-3 flex max-w-[1500px] items-center gap-3 px-6 opacity-65 sm:px-10 lg:px-12">
          <span aria-hidden className="v2-rule-gold inline-block w-6" />
          FIG. 06·01 · THE COMPANY · 2026
        </figcaption>
      </figure>

      <div className="mx-auto w-full max-w-[1500px] px-6 py-[clamp(80px,11vw,140px)] sm:px-10 lg:px-12">
        <div className="v2-mono v2-size-folio mb-12 flex items-center gap-6 opacity-60">
          <span>RICHFIELD WORLDWIDE JSC · ISSUE 30</span>
          <span aria-hidden className="v2-rule flex-1" />
          <span>PAGE 14 · COLOPHON</span>
        </div>

        <div className="mb-16 grid grid-cols-12 gap-10 lg:gap-16">
          <div className="col-span-12 flex flex-col gap-2 lg:col-span-7">
            <p className="v2-italic text-[clamp(1.6rem,2.4vw,2.4rem)] leading-none opacity-80">
              Established
            </p>
            <p className="v2-display v2-size-cover">1994.</p>
            <p className="v2-mono v2-size-folio mt-6 opacity-70">
              VIETNAM · CAMBODIA · MYANMAR · THIRTY YEARS
            </p>
          </div>
          <div className="col-span-12 lg:col-span-5 lg:pt-8">
            <p className="v2-mono v2-size-eyebrow mb-4 flex items-center gap-3 text-gold-strong">
              <span aria-hidden className="inline-block h-px w-6 bg-gold-rule" />
              EDITOR&apos;S NOTE
            </p>
            <p className="v2-size-body max-w-[40ch] opacity-80">
              Thirty years on, the work is the same. A pallet, a route, a
              shelf. The brands change, the country grows, the network keeps
              turning. Issue 30 closes here, the next opens in 2031.
            </p>
          </div>
        </div>

        <dl className="grid grid-cols-1 gap-8 border-t border-current/15 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="v2-mono v2-size-folio opacity-60">OFFICE</dt>
            <dd className="v2-size-body mt-2 max-w-[28ch]">
              {site.address.line1}
              <br />
              {site.address.line2}
            </dd>
          </div>
          <div>
            <dt className="v2-mono v2-size-folio opacity-60">TELEPHONE</dt>
            <dd className="v2-size-body mt-2">
              <a className="hover:opacity-70" href={`tel:${site.phones.officeTel}`}>
                {site.phones.office}
              </a>
              <br />
              <a className="hover:opacity-70" href={`tel:${site.phones.hotlineTel}`}>
                Hotline · {site.phones.hotline}
              </a>
            </dd>
          </div>
          <div>
            <dt className="v2-mono v2-size-folio opacity-60">EMAIL</dt>
            <dd className="v2-size-body mt-2">
              <a className="hover:opacity-70" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="v2-mono v2-size-folio opacity-60">SOCIAL</dt>
            <dd className="v2-size-body mt-2">
              <a
                href={site.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-70"
              >
                Facebook
              </a>
            </dd>
          </div>
        </dl>

        <p className="v2-mono v2-size-folio mt-16 opacity-60">
          <span aria-hidden className="v2-rule-gold mr-3 inline-block w-8 align-middle" />
          COLOPHON · ISSUE 30 — RICHFIELD WORLDWIDE JSC · 1994 — 2026 · NEXT ISSUE · 2031
        </p>
      </div>
    </div>
  );
}
