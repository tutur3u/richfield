"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ADMIN_SECTION_GROUPS,
  adminSectionsByGroup,
} from "@/lib/admin/sections";

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

  return (
    <nav aria-label="Dashboard sections" className="grid gap-6">
      {ADMIN_SECTION_GROUPS.map((group) => {
        const sections = adminSectionsByGroup(group.id);

        if (sections.length === 0) return null;

        return (
          <div className="grid gap-1.5" key={group.id}>
            <p className="px-3 text-[11px] font-black uppercase tracking-[0.22em] text-muted/70">
              {group.label}
            </p>
            {sections.map((section) => {
              const href = `/admin/${section.slug}`;
              const active =
                pathname === href || pathname?.startsWith(`${href}/`);

              return (
                <Link
                  aria-current={active ? "page" : undefined}
                  className={`min-h-11 px-3 py-2 text-sm font-bold transition-colors ${
                    active
                      ? "border-l-2 border-gold-strong bg-gold-strong/10 text-gold-strong"
                      : "border-l-2 border-transparent text-muted hover:bg-paper hover:text-ink"
                  }`}
                  href={href}
                  key={section.slug}
                  onClick={onNavigate}
                >
                  {section.title}
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

  return (
    <div className="section-band min-h-screen">
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
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
              {menuOpen ? "Close" : "Menu"}
            </button>
            <Link
              className="font-display text-lg leading-none text-ink"
              href="/admin"
            >
              Richfield
            </Link>
          </div>
          <div className="flex items-center gap-2">
            {userEmail ? (
              <span className="hidden text-xs text-muted sm:block">
                {userEmail}
              </span>
            ) : null}
            <Link className="button-secondary px-3" href="/">
              View site
            </Link>
            <form action="/api/auth/logout" method="post">
              <button className="button-secondary px-3" type="submit">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1400px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside
          className={`${menuOpen ? "block" : "hidden"} lg:block`}
          id="admin-sidebar"
        >
          <div className="lg:sticky lg:top-6">
            <SidebarNav onNavigate={() => setMenuOpen(false)} />
          </div>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
