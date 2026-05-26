import { site } from "@/content/en/site";

export function ColophonSpread() {
  return (
    <div
      id="colophon"
      className="v2-display mx-auto w-full max-w-[1500px] px-6 py-[clamp(96px,13vw,180px)] sm:px-10 lg:px-12"
    >
      <div className="v2-mono v2-size-folio mb-12 flex items-center gap-6 opacity-60">
        <span>RICHFIELD WORLDWIDE JSC · ISSUE 30</span>
        <span aria-hidden className="v2-rule flex-1" />
        <span>PAGE 14 · COLOPHON</span>
      </div>

      <div className="mb-16 flex flex-col gap-2">
        <p className="v2-italic text-[clamp(1.6rem,2.4vw,2.4rem)] leading-none opacity-80">
          Established
        </p>
        <p className="v2-display v2-size-cover">1994.</p>
        <p className="v2-mono v2-size-folio mt-6 opacity-70">
          VIETNAM · MALAYSIA · CHINA · THIRTY YEARS
        </p>
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
  );
}
