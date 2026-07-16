"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import type { Locale } from "@/lib/locale";

// EN ⇄ VI toggle. next-intl's Link accepts a `locale` prop to point at the
// equivalent path in the other locale; `usePathname` returns the current path
// already stripped of its locale prefix, so the same href works for both.

export function LanguageSwitcher({
  className = "",
}: {
  locale?: Locale;
  className?: string;
}) {
  const pathname = usePathname();
  const locale = useLocale();
  const langSwitcher = useTranslations("langSwitcher");

  const linkCls = (active: boolean) =>
    `v2-mono v2-size-folio transition-opacity ${
      active ? "opacity-100 text-gold-strong" : "opacity-60 hover:opacity-90"
    }`;

  return (
    <nav aria-label={langSwitcher("aria")} className={`flex items-center gap-1.5 ${className}`}>
      <Link
        href={pathname}
        locale="en"
        aria-current={locale === "en" ? "true" : undefined}
        className={linkCls(locale === "en")}
      >
        EN
      </Link>
      <span aria-hidden className="opacity-40">
        /
      </span>
      <Link
        href={pathname}
        locale="vi"
        aria-current={locale === "vi" ? "true" : undefined}
        className={linkCls(locale === "vi")}
      >
        VI
      </Link>
    </nav>
  );
}
