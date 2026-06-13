import { Spread, Eyebrow } from "@/app/_components/magazine/primitives/spread";
import { CtaLink } from "@/app/_components/magazine/primitives/cta-link";
import { organizations, whoWeAreIntro } from "@/content/en/organizations";

/**
 * "Who We Are" — an asymmetric opener (headline hangs left, standfirst sits in
 * the right column) over the three operating companies as numbered cards, each
 * linking to its detail (distribution, logistics, or the Dory Rich site).
 * `head` clears the fixed running-head when this opens a standalone page.
 */
export function OrganizationsSpread({ head = false }: { head?: boolean }) {
  return (
    <Spread
      id="organizations"
      bg="white"
      head={head}
      className="flex flex-col gap-y-[var(--v2-flow)]"
    >
      <div className="grid grid-cols-12 gap-x-[var(--v2-col-gap)] gap-y-[var(--v2-rhythm)] hyphens-auto" lang="en">
        <div className="col-span-12 flex flex-col gap-y-[var(--v2-rhythm)] lg:col-span-5">
          <Eyebrow>WHO WE ARE</Eyebrow>
          <h1 className="font-display v2-size-standfirst">
            One group, <em className="italic text-gold-strong">three</em>{" "}
            companies.
          </h1>
        </div>
        <p className="col-span-12 self-end text-left v2-size-body opacity-90 sm:text-justify lg:col-span-6 lg:col-start-7">
          {whoWeAreIntro}
        </p>
      </div>

      <ol className="grid grid-cols-1 gap-x-[var(--v2-col-gap)] gap-y-[var(--v2-flow)] lg:grid-cols-3">
        {organizations.map((org, i) => (
          <li key={org.name} className="flex flex-col border-t border-current/20 pt-5">
            <span className="v2-mono v2-size-folio text-gold-strong">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h2 className="font-display mt-3 text-[clamp(1.4rem,1.9vw,1.7rem)] leading-[1.12] tracking-[-0.018em]">
              {org.name}
            </h2>
            <p className="v2-mono v2-size-folio mt-1 opacity-55">
              {org.established.toUpperCase()}
            </p>
            <p className="v2-size-body mt-[var(--v2-rhythm)] opacity-90">{org.body}</p>
            <CtaLink
              href={org.href}
              external={org.external}
              className="mt-[var(--v2-rhythm)]"
            >
              {org.linkLabel}
            </CtaLink>
          </li>
        ))}
      </ol>
    </Spread>
  );
}
