import type { Pillar } from "@/content/en/capabilities";
import { SoftCta } from "./soft-cta";

export function CapabilityBlock({ pillar }: { pillar: Pillar }) {
  return (
    <article className="flex flex-col gap-4 border-t border-line pt-8">
      <span className="font-display text-[32px] italic leading-none text-gold">
        {pillar.number}
      </span>
      <h3 className="text-[18px] font-semibold text-ink">{pillar.name}</h3>
      <p className="max-w-[55ch] text-[15px] leading-[1.55] text-muted">
        {pillar.longBody}
      </p>
      <div className="pt-2">
        <SoftCta href={pillar.href}>Read more</SoftCta>
      </div>
    </article>
  );
}
