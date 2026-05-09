"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useScrollPastThreshold } from "@/app/_hooks/use-scroll-state";
import { useFocusTrap } from "@/app/_hooks/use-focus-trap";

const NAV = [
  { label: "About", href: "/about" },
  { label: "What we do", href: "/what-we-do" },
  { label: "Brands", href: "/brands" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const scrolled = useScrollPastThreshold(80);
  const transparent = isHome && !scrolled;

  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  useFocusTrap(drawerRef, open, () => setOpen(false));

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close the drawer whenever the route changes. Using the
  // pathname as a render-time signal rather than a synchronous
  // setState in an effect, which keeps cascading-render warnings
  // away.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  const headerCls = transparent
    ? "absolute inset-x-0 top-0 z-30 bg-transparent"
    : "sticky inset-x-0 top-0 z-30 border-b border-line bg-cream/85 backdrop-blur-sm";

  const linkColor = transparent ? "text-paper" : "text-ink";
  const hoverColor = "hover:text-gold";

  return (
    <header className={headerCls}>
      <div className="mx-auto flex h-[72px] max-w-[1300px] items-center justify-between px-6 sm:h-[96px] sm:px-10">
        <Link href="/" className="flex items-center gap-3" aria-label="Richfield Group home">
          <span
            aria-hidden
            className={`flex h-10 w-10 items-center justify-center rounded-full border font-display italic ${
              transparent ? "border-gold text-gold" : "border-gold text-gold"
            }`}
          >
            R
          </span>
          <span className={`hidden font-display text-[14px] tracking-[0.28em] sm:block ${linkColor}`}>
            RICHFIELD GROUP
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-10 lg:flex">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[11px] font-medium uppercase tracking-[0.16em] transition-colors ${linkColor} ${hoverColor} ${
                  active ? "underline decoration-gold decoration-[1px] underline-offset-[6px]" : ""
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <LangSwitcher tone={transparent ? "light" : "dark"} />
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-drawer"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className={`flex h-10 w-10 items-center justify-center lg:hidden ${linkColor}`}
          >
            <span aria-hidden className="font-display text-2xl">
              {open ? "×" : "≡"}
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-drawer"
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="fixed inset-0 z-40 flex flex-col bg-cream"
        >
          <div className="flex h-[72px] items-center justify-between px-6">
            <span className="font-display text-[14px] tracking-[0.28em] text-ink">
              RICHFIELD GROUP
            </span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="flex h-10 w-10 items-center justify-center text-ink"
            >
              <span aria-hidden className="font-display text-3xl">
                ×
              </span>
            </button>
          </div>
          <nav aria-label="Primary mobile" className="flex flex-1 flex-col gap-8 px-6 pt-8">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-display text-[clamp(28px,3vw,44px)] text-ink hover:text-gold"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="px-6 pb-10">
            <LangSwitcher tone="dark" />
          </div>
        </div>
      ) : null}
    </header>
  );
}

function LangSwitcher({ tone }: { tone: "light" | "dark" }) {
  const baseCls = tone === "light" ? "text-paper" : "text-ink";
  return (
    <div className={`flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] ${baseCls}`}>
      <span className="font-medium">EN</span>
      <span aria-hidden className="opacity-40">·</span>
      <span
        aria-disabled="true"
        title="Vietnamese coming soon"
        className="opacity-40"
      >
        VI
      </span>
    </div>
  );
}
