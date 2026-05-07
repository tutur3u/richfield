import Link from "next/link";
import { site } from "@/content/en/site";
import { Eyebrow } from "./primitives/eyebrow";

const exploreLinks = [
  { label: "About", href: "/about" },
  { label: "Brands", href: "/brands" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

const groupItems = [
  { label: "Vietnam", external: false },
  { label: "Malaysia", external: false },
  { label: "China", external: false },
  { label: "Dory Rich JSC ↗", external: true, href: site.external.doryRich },
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto grid max-w-[1300px] gap-12 px-6 pt-[90px] pb-12 sm:px-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gold font-display italic text-gold"
            >
              R
            </span>
            <span className="font-display text-[14px] tracking-[0.28em] text-paper">
              RICHFIELD GROUP
            </span>
          </div>
          <p className="max-w-[40ch] text-[14px] leading-[1.6] text-paper/70">
            {site.taglineLong}
          </p>
        </div>

        <FooterColumn heading="Explore">
          <ul className="flex flex-col gap-3">
            {exploreLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-[14px] text-paper/80 transition-colors hover:text-gold"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </FooterColumn>

        <FooterColumn heading="Contact">
          <address className="not-italic text-[14px] leading-[1.6] text-paper/80">
            {site.legalName}
            <br />
            {site.address.line1}
            <br />
            {site.address.line2}
            <br />
            <a className="hover:text-gold" href={`tel:${site.phones.officeTel}`}>
              Office {site.phones.office}
            </a>
            <br />
            <a className="hover:text-gold" href={`tel:${site.phones.hotlineTel}`}>
              Hotline {site.phones.hotline}
            </a>
            <br />
            <a className="hover:text-gold" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </address>
        </FooterColumn>

        <FooterColumn heading="Group">
          <ul className="flex flex-col gap-3 text-[14px] text-paper/80">
            {groupItems.map((g) =>
              g.external && g.href ? (
                <li key={g.label}>
                  <a
                    href={g.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-gold"
                  >
                    {g.label}
                  </a>
                </li>
              ) : (
                <li key={g.label}>{g.label}</li>
              ),
            )}
          </ul>
        </FooterColumn>
      </div>

      <div className="mx-auto mt-6 flex max-w-[1300px] flex-col gap-4 border-t border-paper/15 px-6 py-6 text-[12px] text-paper/60 sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <span>© {year} {site.legalName}.</span>
        <SocialIcons />
        <a href={site.domainCanonical} className="hover:text-gold">
          richfieldgroup.com.vn
        </a>
      </div>
    </footer>
  );
}

function FooterColumn({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Eyebrow tone="gold" as="div">
        {heading}
      </Eyebrow>
      {children}
    </div>
  );
}

function SocialIcons() {
  const items = [
    { label: "Facebook", href: site.socials.facebook },
    { label: "LinkedIn", href: site.socials.linkedin },
    { label: "Zalo", href: site.socials.zalo },
  ].filter((i) => i.href);
  return (
    <ul className="flex items-center gap-6">
      {items.map((i) => (
        <li key={i.label}>
          <a
            href={i.href}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold"
          >
            {i.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
