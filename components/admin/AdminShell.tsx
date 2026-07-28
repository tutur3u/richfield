"use client";

import {
  AddressBook,
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
  SlidersHorizontal,
  UserCircle,
  UsersThree,
  X,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ADMIN_SECTION_GROUPS,
  adminSectionsByGroup,
} from "@/lib/admin/sections";
import { AdminUserMenu } from "./AdminUserMenu";
import { cn } from "@/lib/utils";

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
            <p className="mb-1.5 px-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-admin-sidebar-accent">
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
                  className={cn(
                    "flex min-h-10 items-center gap-2.5 rounded-lg border px-2.5 py-2 text-[13px] font-medium transition-colors",
                    active
                      ? "border-admin-sidebar-rule bg-admin-sidebar-active text-admin-sidebar-ink"
                      : "border-transparent text-admin-sidebar-ink-soft hover:bg-admin-sidebar-hover hover:text-admin-sidebar-ink",
                  )}
                  href={href}
                  key={section.slug}
                  onClick={onNavigate}
                >
                  <SectionIcon
                    aria-hidden
                    className={
                      active
                        ? "text-admin-sidebar-accent"
                        : "text-admin-sidebar-ink-soft"
                    }
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
            <Button
              aria-controls="admin-sidebar"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? t("common.close") : t("common.menu")}
              className="border-admin-rule text-admin-ink lg:hidden"
              onClick={() => setMenuOpen((open) => !open)}
              size="icon-lg"
              type="button"
              variant="outline"
            >
              {menuOpen ? <X aria-hidden size={18} /> : <List aria-hidden size={18} />}
            </Button>
            <Link
              className="flex min-w-0 items-center gap-2 text-admin-ink"
              href="/admin"
            >
              <span className="font-display text-xl leading-none">
                {t("shell.richfield")}
              </span>
              <span aria-hidden className="text-admin-rule-strong">
                |
              </span>
              <span className="text-[10px] font-bold uppercase leading-none tracking-[0.18em] text-admin-ink-soft">
                {t("shell.admin")}
              </span>
            </Link>
          </div>
          <div className="flex min-w-0 items-center justify-end px-3 sm:px-6 lg:px-8">
            {userEmail ? (
              <AdminUserMenu
                accountLabel={t("sections.account.title")}
                adminLanguageLabel={t("locale.label")}
                darkLabel={t("theme.dark")}
                englishLabel={t("locale.english")}
                lightLabel={t("theme.light")}
                locale={locale}
                nextPath={pathname ?? "/admin"}
                signOutLabel={t("account.signOut")}
                signedInLabel={t("account.signedIn")}
                systemLabel={t("theme.system")}
                themeLabel={t("theme.label")}
                userEmail={userEmail}
                vietnameseLabel={t("locale.vietnamese")}
                viewSiteLabel={t("account.viewSite")}
              />
            ) : null}
          </div>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-65px)] lg:grid-cols-[15rem_minmax(0,1fr)]">
        <aside
          className={`${menuOpen ? "block" : "hidden"} fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto border-r border-admin-sidebar-rule bg-admin-sidebar px-3 py-5 lg:sticky lg:inset-auto lg:top-16 lg:block lg:h-[calc(100vh-64px)]`}
          id="admin-sidebar"
        >
          <SidebarNav onNavigate={() => setMenuOpen(false)} />
        </aside>

        <main
          className="min-w-0 px-4 py-7 sm:px-7 lg:px-12 lg:py-10"
          id="admin-main"
        >
          <div className="mx-auto max-w-[1320px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
