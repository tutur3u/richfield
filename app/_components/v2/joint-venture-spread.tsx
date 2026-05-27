import Image from "next/image";
import { partnerLogos } from "@/content/en/photography";
import { site } from "@/content/en/site";

export function JointVentureSpread() {
  const logo = partnerLogos["Dory Rich"];
  return (
    <div
      id="jv"
      className="v2-display mx-auto w-full max-w-[1500px] px-6 py-[clamp(80px,11vw,160px)] sm:px-10 lg:px-12"
    >
      <div className="v2-mono v2-size-folio mb-8 flex items-center gap-6 opacity-60">
        <span>RICHFIELD WORLDWIDE JSC · ISSUE 30</span>
        <span aria-hidden className="v2-rule flex-1" />
        <span>PAGES 12—13 · STORY 05</span>
      </div>

      <div className="grid grid-cols-12 gap-10 lg:gap-16">
        <figure className="col-span-12 flex flex-col gap-3 lg:col-span-7">
          <div className="relative aspect-[4/3] w-full overflow-hidden lg:aspect-[5/4]">
            <Image
              src="/photos/people/grand-opening-2026-1280.webp"
              alt="Richfield and TCP leadership at the Dory Rich JSC opening, 2024."
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover v2-photo-duotone"
              style={{ objectPosition: "center 38%" }}
            />
          </div>
          <figcaption className="v2-mono v2-size-folio flex items-center gap-3 opacity-65">
            <span aria-hidden className="v2-rule-gold inline-block w-6" />
            FIG. 05·01 · DORY RICH JSC · OPENING · 2024
          </figcaption>
        </figure>

        <div className="col-span-12 flex flex-col gap-8 lg:col-span-5">
          <div>
            <p className="v2-mono v2-size-eyebrow mb-5 flex items-center gap-3 text-gold">
              <span aria-hidden className="inline-block h-px w-8 bg-gold/70" />
              STORY 05 · THE JOINT VENTURE
            </p>
            <h2 className="v2-italic v2-size-feature mb-8 max-w-[18ch] text-balance">
              Dory Rich. Where distribution becomes manufacturing.
            </h2>
            <p className="v2-size-body max-w-[44ch] opacity-85">
              In 2024, Richfield and TCP formed Dory Rich JSC. A joint venture
              that brings manufacturing under the same umbrella that already
              carries the brands. One relationship, end to end.
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-current/15 pt-6">
            <div>
              <dt className="v2-mono v2-size-folio opacity-55">FORMED</dt>
              <dd className="v2-display mt-1 text-[clamp(1.6rem,2.2vw,2rem)] leading-none">
                2024
              </dd>
            </div>
            <div>
              <dt className="v2-mono v2-size-folio opacity-55">PARTNERS</dt>
              <dd className="v2-display mt-1 text-[clamp(1.1rem,1.4vw,1.3rem)] leading-tight">
                Richfield<span className="opacity-50"> &middot; </span>TCP
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="v2-mono v2-size-folio opacity-55">SCOPE</dt>
              <dd className="v2-size-body mt-1 opacity-80">
                Manufacturing arm under the Richfield umbrella that already
                carries the partner brands.
              </dd>
            </div>
          </dl>

          <div className="border-t border-current/15 pt-6">
            {logo ? (
              <div className="relative mb-5 h-14 w-[clamp(120px,16vw,200px)]">
                <Image
                  src={logo}
                  alt="Dory Rich"
                  fill
                  sizes="200px"
                  className="object-contain object-left"
                />
              </div>
            ) : null}
            <a
              href={site.external.doryRich}
              target="_blank"
              rel="noopener noreferrer"
              className="v2-mono v2-size-folio inline-flex items-center gap-3 text-gold transition-opacity hover:opacity-70"
            >
              <span aria-hidden className="v2-rule-gold inline-block w-6" />
              VISIT DORYRICH.COM.VN
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
