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
        <div className="col-span-12 lg:col-span-7">
          <p className="v2-mono v2-size-eyebrow mb-5 flex items-center gap-3 text-gold">
            <span aria-hidden className="inline-block h-px w-8 bg-gold/70" />
            STORY 05 · THE JOINT VENTURE
          </p>
          <h2 className="v2-italic v2-size-feature mb-8 max-w-[22ch] text-balance">
            Dory Rich. Where distribution becomes manufacturing.
          </h2>
          <p className="v2-size-body max-w-[52ch] opacity-85">
            In 2024, Richfield and TCP formed Dory Rich JSC. A joint venture that brings manufacturing under the same umbrella that already carries the brands. One relationship, end to end.
          </p>
        </div>

        <div className="col-span-12 lg:col-span-5 lg:pt-2">
          <div className="rounded-sm border border-current/15 bg-current/[0.04] p-6">
            {logo ? (
              <div className="relative mb-6 h-16 w-[clamp(120px,16vw,200px)]">
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
