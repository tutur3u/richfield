"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ADMIN_SECTION_GROUPS,
  adminSectionsByGroup,
} from "@/lib/admin/sections";
import { ADMIN_THEME_BOOTSTRAP, AdminThemeToggle } from "./AdminTheme";

/**
 * Dashboard chrome: a persistent sidebar plus the page body.
 *
 * Replaces the row of thirteen tabs, which forced every section to compete for
 * one line of horizontal space and gave no sense of where you were. A sidebar
 * shows the whole shape of the tool at once, and because sections are real
 * routes the current one is derived from the URL rather than held in state.
 */
function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const t = useTranslations("admin");

  return (
    <nav aria-label={t("shell.dashboardSections")} className="grid gap-7">
      {ADMIN_SECTION_GROUPS.map((group) => {
        const sections = adminSectionsByGroup(group.id);

        if (sections.length === 0) return null;

        return (
          <div className="grid gap-1.5" key={group.id}>
            <p className="px-3 text-[10px] font-black uppercase tracking-[0.24em] text-admin-gold">
              {t(`groups.${group.id}`)}
            </p>
            {sections.map((section) => {
              const href = `/admin/${section.slug}`;
              const active =
                pathname === href || pathname?.startsWith(`${href}/`);

              return (
                <Link
                  aria-current={active ? "page" : undefined}
                  className={`min-h-11 border-l-2 px-3 py-2 text-sm font-bold transition-colors ${
                    active
                      ? "border-admin-gold bg-white/10 text-white"
                      : "border-transparent text-white/72 hover:bg-white/6 hover:text-white"
                  }`}
                  href={href}
                  key={section.slug}
                  onClick={onNavigate}
                >
                  {t(
                    `sections.${section.slug}.title` as Parameters<typeof t>[0],
                  )}
                </Link>
              );
            })}
          </div>
        );
      })}
    </nav>
  );
}

export function AdminShell({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail?: string | null;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("admin");

  return (
    <div
      className="min-h-screen bg-admin-parchment"
      data-admin-theme="system"
    >
      {/* Applies the stored theme before paint, so a dark-mode editor never
          sees a flash of the light shell. */}
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: pre-paint theme restore
        dangerouslySetInnerHTML={{ __html: ADMIN_THEME_BOOTSTRAP }}
      />
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-3"
        href="#admin-main"
      >
        {t("shell.skipToContent")}
      </a>
      <header className="border-b border-admin-rule bg-white/82 backdrop-blur">
        <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:pl-[calc(16.5rem+1.5rem)]">
          <div className="flex items-center gap-3">
            {/* The sidebar collapses on small screens; without this the only
                way to change section on a phone would be the browser URL. */}
            <button
              aria-controls="admin-sidebar"
              aria-expanded={menuOpen}
              className="button-secondary px-3 lg:hidden"
              onClick={() => setMenuOpen((open) => !open)}
              type="button"
            >
              {menuOpen ? t("common.close") : t("common.menu")}
            </button>
            <Link
              className="font-display text-lg leading-none text-admin-navy lg:hidden"
              href="/admin"
            >
              {t("shell.richfield")}
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <form action="/api/admin/locale" method="post">
              <input name="next" type="hidden" value={pathname ?? "/admin"} />
              <label className="sr-only" htmlFor="admin-locale">
                {t("locale.label")}
              </label>
              <select
                className="min-h-10 border border-admin-rule bg-transparent px-2 text-xs font-bold text-admin-ink outline-none focus:border-admin-gold"
                defaultValue={locale}
                id="admin-locale"
                name="locale"
                onChange={(event) => event.currentTarget.form?.requestSubmit()}
              >
                <option value="en">{t("locale.english")}</option>
                <option value="vi">{t("locale.vietnamese")}</option>
              </select>
            </form>
            {userEmail ? (
              <span className="hidden max-w-48 truncate text-xs text-admin-ink-soft xl:block">
                {userEmail}
              </span>
            ) : null}
            <AdminThemeToggle />
            <Link className="button-secondary px-3" href="/">
              {t("account.viewSite")}
            </Link>
            <form action="/api/auth/logout" method="post">
              <button className="button-secondary px-3" type="submit">
                {t("account.signOut")}
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-65px)] lg:grid-cols-[16.5rem_minmax(0,1fr)]">
        <aside
          className={`${menuOpen ? "block" : "hidden"} fixed inset-x-0 bottom-0 top-[65px] z-40 overflow-y-auto bg-admin-navy px-4 py-6 lg:sticky lg:inset-auto lg:top-0 lg:block lg:h-[calc(100vh-65px)]`}
          id="admin-sidebar"
        >
          <div className="grid gap-9">
            <Link
              className="hidden font-display text-3xl text-admin-parchment lg:block"
              href="/admin"
            >
              {t("shell.richfield")}
            </Link>
            <SidebarNav onNavigate={() => setMenuOpen(false)} />
          </div>
        </aside>

        <main
          className="min-w-0 px-4 py-7 sm:px-7 lg:px-10 lg:py-10"
          id="admin-main"
        >
          <div className="mx-auto max-w-[1180px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
