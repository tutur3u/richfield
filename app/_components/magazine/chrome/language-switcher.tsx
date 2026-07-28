"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import type { Locale } from "@/lib/locale";

// EN ⇄ VI toggle. next-intl's Link accepts a `locale` prop to point at the
// equivalent path in the other locale; `usePathname` returns the current path
// already stripped of its locale prefix, so the same href works for both.

export function LanguageSwitcher({
  availability,
  className = "",
  hrefs,
}: {
  locale?: Locale;
  availability?: Partial<Record<Locale, boolean>>;
  className?: string;
  hrefs?: Partial<Record<Locale, string>>;
}) {
  const pathname = usePathname();
  const locale = useLocale();
  const langSwitcher = useTranslations("langSwitcher");

  const linkCls = (active: boolean, available: boolean) =>
    `v2-mono v2-size-folio relative inline-flex min-h-9 min-w-11 items-center justify-center rounded-full px-2.5 transition-[color,background-color,opacity] ${
      active
        ? "bg-gold-strong/12 text-gold-strong"
        : available
          ? "opacity-65 hover:bg-current/[0.06] hover:opacity-100"
          : "opacity-45 hover:bg-current/[0.06] hover:opacity-75"
    }`;

  return (
    <nav
      aria-label={langSwitcher("aria")}
      className={`flex items-center gap-0.5 rounded-full border border-current/15 bg-current/[0.025] p-0.5 ${className}`}
    >
      {(["en", "vi"] as const).map((targetLocale) => {
        const active = locale === targetLocale;
        const available = availability?.[targetLocale] !== false;
        const languageName = langSwitcher(`languages.${targetLocale}`);
        const status = available
          ? langSwitcher("available", { language: languageName })
          : langSwitcher("unavailable", { language: languageName });

        return (
          <Link
            key={targetLocale}
            href={hrefs?.[targetLocale] ?? pathname}
            locale={targetLocale}
            aria-current={active ? "page" : undefined}
            aria-label={status}
            className={linkCls(active, available)}
            title={status}
          >
            {targetLocale.toUpperCase()}
            {!available ? (
              <span
                aria-hidden
                className="absolute right-1.5 top-1.5 h-1 w-1 rounded-full bg-gold-strong"
              />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
