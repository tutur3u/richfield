"use client";

import {
  AddressBook,
  ArrowSquareOut,
  Article,
  Briefcase,
  ChatCircleDots,
  ClockCounterClockwise,
  Folder,
  Gear,
  Image,
  List,
  PhoneCall,
  Shapes,
  SignOut,
  SlidersHorizontal,
  UserCircle,
  UsersThree,
  X,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ADMIN_SECTION_GROUPS,
  adminSectionsByGroup,
} from "@/lib/admin/sections";
import { AdminThemeToggle } from "./AdminTheme";

const SECTION_ICONS = {
  account: UserCircle,
  brands: Shapes,
  careers: Briefcase,
  channels: PhoneCall,
  "contact-form": SlidersHorizontal,
  "contact-page": AddressBook,
  files: Folder,
  leadership: UsersThree,
  milestones: ClockCounterClockwise,
  news: Article,
  people: Gear,
  photos: Image,
  responses: ChatCircleDots,
} as const;

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
    <nav aria-label={t("shell.dashboardSections")} className="grid gap-6">
      {ADMIN_SECTION_GROUPS.map((group) => {
        const sections = adminSectionsByGroup(group.id);

        if (sections.length === 0) return null;

        return (
          <div className="grid gap-0.5" key={group.id}>
            <p className="mb-1.5 px-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-admin-gold/75">
              {t(`groups.${group.id}`)}
            </p>
            {sections.map((section) => {
              const href = `/admin/${section.slug}`;
              const active =
                pathname === href || pathname?.startsWith(`${href}/`);
              const SectionIcon =
                SECTION_ICONS[section.slug as keyof typeof SECTION_ICONS];

              return (
                <Link
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-10 items-center gap-2.5 rounded-lg border px-2.5 py-2 text-[13px] font-medium transition-colors ${
                    active
                      ? "border-white/10 bg-[rgb(255_255_255_/_0.08)] text-white"
                      : "border-transparent text-white/62 hover:bg-[rgb(255_255_255_/_0.05)] hover:text-white"
                  }`}
                  href={href}
                  key={section.slug}
                  onClick={onNavigate}
                >
                  <SectionIcon
                    aria-hidden
                    className={active ? "text-admin-gold" : "text-white/45"}
                    size={16}
                  />
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
    <div className="min-h-screen bg-admin-parchment text-admin-ink">
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-3"
        href="#admin-main"
      >
        {t("shell.skipToContent")}
      </a>
      <header className="sticky top-0 z-30 border-b border-admin-rule bg-admin-surface backdrop-blur-xl">
        <div className="grid min-h-16 grid-cols-[minmax(0,1fr)_auto] lg:grid-cols-[15rem_minmax(0,1fr)]">
          <div className="flex min-w-0 items-center gap-3 px-4 sm:px-6 lg:border-r lg:border-admin-rule">
            {/* The sidebar collapses on small screens; without this the only
                way to change section on a phone would be the browser URL. */}
            <button
              aria-controls="admin-sidebar"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? t("common.close") : t("common.menu")}
              className="grid size-10 place-items-center border border-admin-rule text-admin-ink lg:hidden"
              onClick={() => setMenuOpen((open) => !open)}
              type="button"
            >
              {menuOpen ? <X aria-hidden size={18} /> : <List aria-hidden size={18} />}
            </button>
            <Link
              className="flex min-w-0 items-baseline gap-2 text-admin-ink"
              href="/admin"
            >
              <span className="font-display text-xl leading-none">
                {t("shell.richfield")}
              </span>
              <span aria-hidden className="text-admin-rule-strong">
                |
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-admin-ink-soft">
                {t("shell.admin")}
              </span>
            </Link>
          </div>
          <div className="flex min-w-0 items-center justify-end gap-2 px-3 sm:px-6 lg:px-8">
            <form action="/api/admin/locale" method="post">
              <input name="next" type="hidden" value={pathname ?? "/admin"} />
              <label className="sr-only" htmlFor="admin-locale">
                {t("locale.label")}
              </label>
              <select
                className="min-h-9 rounded-full border border-admin-rule bg-admin-surface px-3 text-xs font-semibold text-admin-ink outline-none focus:border-admin-gold"
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
              <div className="hidden min-w-0 items-center gap-2 border-l border-admin-rule pl-3 xl:flex">
                <span
                  aria-hidden
                  className="grid size-8 shrink-0 place-items-center rounded-full bg-admin-navy text-xs font-bold uppercase text-white"
                >
                  {userEmail.slice(0, 1)}
                </span>
                <span className="max-w-44 truncate text-xs text-admin-ink-soft">
                  {userEmail}
                </span>
              </div>
            ) : null}
            <AdminThemeToggle />
            <Link
              className="hidden min-h-9 items-center gap-2 rounded-full border border-admin-rule px-3 text-xs font-semibold text-admin-ink transition hover:border-admin-gold sm:inline-flex"
              href="/"
            >
              <ArrowSquareOut aria-hidden size={15} />
              <span>{t("account.viewSite")}</span>
            </Link>
            <form action="/api/auth/logout" method="post">
              <button
                aria-label={t("account.signOut")}
                className="grid size-9 place-items-center rounded-full border border-admin-rule text-admin-ink-soft transition hover:border-admin-gold hover:text-admin-ink"
                title={t("account.signOut")}
                type="submit"
              >
                <SignOut aria-hidden size={16} />
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-65px)] lg:grid-cols-[15rem_minmax(0,1fr)]">
        <aside
          className={`${menuOpen ? "block" : "hidden"} fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto border-r border-white/8 bg-admin-navy px-3 py-5 lg:sticky lg:inset-auto lg:top-16 lg:block lg:h-[calc(100vh-64px)]`}
          id="admin-sidebar"
        >
          <SidebarNav onNavigate={() => setMenuOpen(false)} />
        </aside>

        <main
          className="min-w-0 px-4 py-7 sm:px-7 lg:px-12 lg:py-10"
          id="admin-main"
        >
          <div className="mx-auto max-w-[1200px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
