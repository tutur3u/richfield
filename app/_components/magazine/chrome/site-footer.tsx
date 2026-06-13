import Image from "next/image";
import Link from "next/link";
import { Eyebrow } from "@/app/_components/magazine/primitives/spread";
import { site } from "@/content/en/site";

// ---------------------------------------------------------------------------
// SiteFooter — the global close that ends every route. Two stacked dark bands:
//
//   1. The Richfield promise, set large on dark green (#promise).
//   2. A minimal footer (#colophon) — wordmark, a few links, the essentials.
//
// Rendered once in the root layout so it always sits below the page content,
// no matter which route. The promise always reads first; the footer grounds it.
// ---------------------------------------------------------------------------

const FOOTER_LINKS = [
  { label: "Brands", href: "/brands" },
  { label: "Logistics", href: "/logistics" },
  { label: "Distribution", href: "/distribution" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <>
      {/* The promise — large statement on dark green, always before the footer. */}
      <section
        id="promise"
        className="v2-display w-full bg-forest text-cream"
      >
        <div className="mx-auto flex w-full max-w-[1500px] flex-col items-center px-6 py-[clamp(48px,6vw,88px)] text-center sm:px-10 lg:px-12">
          <p className="font-display max-w-[26ch] text-[clamp(1.4rem,2.8vw,2.4rem)] italic leading-[1.3] text-balance">
            &ldquo;We don&rsquo;t just deliver products. We deliver{" "}
            <span className="text-gold">market access</span>.&rdquo;
          </p>
          <Eyebrow tone="gold" className="mt-[var(--v2-flow)] justify-center opacity-80">
            THE RICHFIELD PROMISE
          </Eyebrow>
        </div>
      </section>

      {/* Minimal footer. */}
      <footer id="colophon" className="v2-display w-full bg-ink text-cream/85">
        <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-[var(--v2-flow)] px-6 py-[var(--v2-section)] sm:px-10 lg:px-12">
          <div className="flex flex-col gap-[var(--v2-flow)] sm:flex-row sm:items-start sm:justify-between">
            {/* Logo + tagline */}
            <div className="flex flex-col gap-3">
              <Link href="/" aria-label="Richfield — home" className="w-fit">
                <Image
                  src="/photos/logos/richfield.webp"
                  alt="Richfield Group"
                  width={120}
                  height={110}
                  className="h-[clamp(52px,5vw,68px)] w-auto object-contain"
                />
              </Link>
              <span className="v2-mono v2-size-folio opacity-60">
                {site.tagline}
              </span>
            </div>

            {/* Links + essentials */}
            <div className="flex flex-col gap-[var(--v2-rhythm)] sm:items-end">
              <nav className="flex flex-wrap gap-x-6 gap-y-2 sm:justify-end">
                {FOOTER_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="v2-mono v2-size-folio opacity-75 transition-opacity hover:opacity-100"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
              <div className="flex flex-col gap-1 v2-size-folio sm:items-end">
                <a href={`tel:${site.phones.hotlineTel}`} className="opacity-75 hover:opacity-100">
                  {site.phones.hotline}
                </a>
                <a href={`mailto:${site.email}`} className="opacity-75 hover:opacity-100">
                  {site.email}
                </a>
                <a
                  href={site.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-75 hover:opacity-100"
                >
                  Facebook ↗
                </a>
              </div>
            </div>
          </div>

          {/* Baseline */}
          <div className="flex flex-col gap-2 border-t border-cream/15 pt-[var(--v2-rhythm)] v2-mono v2-size-folio opacity-55 sm:flex-row sm:items-center sm:justify-between">
            <span>
              © {year} {site.legalName}
            </span>
            <span>{site.countries.join(" · ")}</span>
          </div>
        </div>
      </footer>
    </>
  );
}
