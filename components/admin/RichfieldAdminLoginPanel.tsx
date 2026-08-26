"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight, LockKey } from "@phosphor-icons/react";
import { AdminThemeToggle } from "./AdminTheme";

/**
 * Sign-in screen for the content dashboard.
 *
 * A deliberately quiet single-action screen. There is exactly one way in —
 * access is centralised in Tuturuuu — so the page gets out of the user's way
 * while retaining Richfield's editorial typography and saved theme preference.
 */
export function RichfieldAdminLoginPanel({ loginHref }: { loginHref: string }) {
  const t = useTranslations("admin.login");

  return (
    <main className="relative grid min-h-screen overflow-hidden bg-admin-parchment px-4 py-8 text-admin-ink sm:px-6">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,color-mix(in_srgb,var(--color-admin-gold)_18%,transparent),transparent_42%)]" />
      <div className="relative mx-auto flex w-full max-w-md flex-col">
        <header className="flex items-center justify-between py-2">
          <Link className="font-display text-2xl tracking-[-0.02em] text-admin-ink" href="/">
            Richfield
          </Link>
          <AdminThemeToggle alwaysVisible />
        </header>

        <div className="grid flex-1 place-items-center py-8 sm:py-12">
          <section className="w-full rounded-2xl border border-admin-rule bg-admin-panel p-6 shadow-[0_24px_70px_rgb(12_31_52_/_0.10)] sm:p-8">
            <span className="grid size-11 place-items-center rounded-xl border border-admin-rule bg-admin-surface text-admin-copper">
              <LockKey aria-hidden size={21} weight="bold" />
            </span>
            <p className="mt-6 text-[10px] font-black uppercase tracking-[0.22em] text-admin-copper">
              {t("eyebrow")}
            </p>
            <h1 className="mt-2 font-display text-[clamp(2rem,8vw,2.7rem)] leading-[1.02] tracking-[-0.025em] text-admin-ink">
              {t("title")}
            </h1>
            <p className="mt-3 text-sm leading-6 text-admin-ink-soft">
              {t("description")}
            </p>

            <a className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-admin-navy px-5 text-sm font-bold text-white transition hover:bg-admin-copper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-gold" href={loginHref}>
              {t("continue")}
              <ArrowRight aria-hidden size={16} weight="bold" />
            </a>

            <div className="mt-5 flex items-center justify-between gap-4 border-t border-admin-rule pt-5">
              <Link className="text-xs font-semibold text-admin-ink-soft transition hover:text-admin-ink" href="/">
                ← {t("back")}
              </Link>
              <form action="/api/admin/locale" className="flex items-center gap-1 text-xs" method="post">
                <input name="next" type="hidden" value="/admin/news" />
                <button className="rounded-md px-2 py-1 font-bold text-admin-ink-soft hover:bg-admin-surface hover:text-admin-ink" name="locale" type="submit" value="en">EN</button>
                <span aria-hidden className="text-admin-rule-strong">/</span>
                <button className="rounded-md px-2 py-1 font-bold text-admin-ink-soft hover:bg-admin-surface hover:text-admin-ink" name="locale" type="submit" value="vi">VI</button>
              </form>
            </div>
          </section>
        </div>

        <p className="pb-3 text-center text-xs leading-5 text-admin-ink-soft">
          {t("help")}
        </p>
      </div>
    </main>
  );
}
