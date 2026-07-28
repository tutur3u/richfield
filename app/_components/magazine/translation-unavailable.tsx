import { CheckCircle2, Languages } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/lib/locale";

type TranslationUnavailableProps = {
  availableHref: string;
  availableLocale: Locale;
  availableLabel: string;
  browseHref: string;
  browseLabel: string;
  description: string;
  eyebrow: string;
  heading: string;
  locale: Locale;
  readLabel: string;
};

export function TranslationUnavailable({
  availableHref,
  availableLocale,
  availableLabel,
  browseHref,
  browseLabel,
  description,
  eyebrow,
  heading,
  locale,
  readLabel,
}: TranslationUnavailableProps) {
  return (
    <main className="v2-bg-morph min-h-screen px-6 pb-[var(--v2-section)] pt-[calc(var(--v2-runhead)+var(--v2-section))] text-ink sm:px-10 lg:px-12">
      <section className="mx-auto grid min-h-[calc(100svh-var(--v2-runhead)-var(--v2-section)*2)] max-w-[1200px] content-center gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-20">
        <div className="max-w-3xl">
          <div className="v2-mono v2-size-eyebrow flex items-center gap-2 text-gold-strong">
            <Languages aria-hidden className="h-4 w-4" strokeWidth={1.8} />
            <span>{eyebrow}</span>
          </div>
          <h1 className="font-display mt-6 text-[clamp(3.2rem,7vw,6.5rem)] leading-[0.94] tracking-[-0.045em] text-balance">
            {heading}
          </h1>
          <p className="v2-size-body mt-7 max-w-2xl text-[clamp(1.08rem,1.6vw,1.35rem)] leading-relaxed opacity-75">
            {description}
          </p>
          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Link
              className="v2-mono v2-size-folio inline-flex min-h-12 items-center justify-center bg-ink px-6 py-3 text-cream transition-colors hover:bg-gold-strong focus-visible:bg-gold-strong"
              href={availableHref}
              locale={availableLocale}
            >
              {readLabel}
              <span aria-hidden className="ml-2">
                →
              </span>
            </Link>
            <Link
              className="v2-mono v2-size-folio inline-flex min-h-12 items-center text-gold-strong underline decoration-current/40 underline-offset-[6px] transition-colors hover:text-ink focus-visible:text-ink"
              href={browseHref}
              locale={locale}
            >
              {browseLabel}
            </Link>
          </div>
        </div>

        <aside className="self-center border-y border-current/15 py-7 lg:border lg:bg-paper/55 lg:p-7">
          <p className="v2-mono v2-size-eyebrow opacity-55">{availableLabel}</p>
          <div className="mt-5 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-strong/10 text-gold-strong">
              <CheckCircle2 aria-hidden className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <p className="font-display text-2xl">
              {availableLocale === "en" ? "English" : "Tiếng Việt"}
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
