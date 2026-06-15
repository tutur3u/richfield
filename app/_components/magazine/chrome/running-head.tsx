"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "motion/react";
import { useFocusTrap } from "@/app/_hooks/use-focus-trap";

import { EASE_OUT_EXPO } from "@/app/_components/magazine/_ease";

type NavLeaf = { label: string; href: string };
type NavParent = { label: string; children: NavLeaf[] };
type NavItem = NavLeaf | NavParent;

// The magazine homepage (/) carries the company story (Home + About + Brands).
// The top nav is the three action destinations; "What We Do" fans out to the
// two operational pages. The logo returns to the homepage.
const NAV: NavItem[] = [
  {
    label: "About Us",
    children: [
      { label: "Our Story", href: "/about/our-story" },
      { label: "Who We Are", href: "/about/who-we-are" },
    ],
  },
  {
    label: "What We Do",
    children: [
      { label: "Logistics & Warehousing", href: "/logistics" },
      { label: "Distribution", href: "/distribution" },
    ],
  },
  {
    label: "Brands",
    children: [
      { label: "Our Brands", href: "/brands" },
      { label: "Portfolio", href: "/brands#shelf" },
    ],
  },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

function isParent(item: NavItem): item is NavParent {
  return "children" in item;
}

// A "route" navigates with the Next router; an anchor (#…, /#…) is a plain
// <a> so hash scrolling works from any page.
function isRoute(href: string): boolean {
  return href.startsWith("/") && !href.includes("#");
}

// The active top-level item is driven by the current route: a leaf matches its
// own path, a parent matches when any of its child pages is active.
function navActive(item: NavItem, pathname: string): boolean {
  const hit = (href: string) =>
    isRoute(href) && (pathname === href || pathname.startsWith(`${href}/`));
  return isParent(item) ? item.children.some((c) => hit(c.href)) : hit(item.href);
}

/**
 * Persistent masthead pinned to the top of every page. Left: the Richfield logo
 * (returns home). Right: the primary nav — a "What We Do" dropdown plus Careers
 * and Contact, with a gold underline marking the active route. Collapses to a
 * burger + drawer below lg. The site is one cream canvas, so the bar does not
 * invert colours.
 */
export function RunningHead() {
  const reduce = useReducedMotion();
  const pathname = usePathname() ?? "/";
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-40 border-b border-ink/10 bg-cream/80 backdrop-blur-md"
        style={{ height: "var(--v2-runhead)" }}
      >
        <div className="mx-auto flex h-full max-w-[1500px] items-center justify-between gap-6 px-6 text-ink sm:px-10 lg:px-12">
          {/* Masthead logo. */}
          <Link href="/" aria-label="Richfield — home" className="shrink-0">
            <Image
              src="/photos/logos/richfield.webp"
              alt="Richfield Group"
              width={120}
              height={110}
              className="h-[clamp(46px,4.4vw,56px)] w-auto object-contain"
            />
          </Link>

          {/* Desktop nav. */}
          <nav
            aria-label="Primary"
            className="hidden items-center gap-[clamp(16px,1.6vw,28px)] lg:flex"
          >
            {NAV.map((item, i) => {
              const active = navActive(item, pathname);
              if (isParent(item)) {
                return (
                  <Dropdown
                    key={item.label}
                    item={item}
                    active={active}
                    open={openMenu === i}
                    onOpen={() => setOpenMenu(i)}
                    onClose={() =>
                      setOpenMenu((cur) => (cur === i ? null : cur))
                    }
                    reduce={!!reduce}
                  />
                );
              }
              return (
                <NavTopLink key={item.label} href={item.href} active={active}>
                  {item.label}
                </NavTopLink>
              );
            })}
          </nav>

          {/* Mobile burger. */}
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="magazine-drawer"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="flex h-10 w-10 items-center justify-center text-ink transition-colors hover:text-gold lg:hidden"
          >
            <BurgerIcon />
          </button>
        </div>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}

// A top-level anchor/route link with the sliding gold active underline.
function NavTopLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  const cls = "v2-mono v2-size-folio relative";
  const inner = (
    <>
      <span className={active ? "opacity-100" : "opacity-60 transition-opacity duration-200 hover:opacity-90"}>
        {children}
      </span>
      {active ? <ActiveUnderline /> : null}
    </>
  );
  return isRoute(href) ? (
    <Link href={href} aria-current={active ? "page" : undefined} className={cls}>
      {inner}
    </Link>
  ) : (
    <a href={href} aria-current={active ? "location" : undefined} className={cls}>
      {inner}
    </a>
  );
}

function ActiveUnderline() {
  return (
    <motion.span
      aria-hidden
      layoutId="runhead-underline"
      className="absolute -bottom-1.5 left-0 right-0 block h-px bg-gold-strong"
      transition={{ type: "spring", stiffness: 480, damping: 42 }}
    />
  );
}

// Desktop "About Us" dropdown: opens on hover and on focus/click, closes on
// mouse-leave, Escape, or losing focus.
function Dropdown({
  item,
  active,
  open,
  onOpen,
  onClose,
  reduce,
}: {
  item: NavParent;
  active: boolean;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  reduce: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      onBlur={(e) => {
        if (!ref.current?.contains(e.relatedTarget as Node)) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => (open ? onClose() : onOpen())}
        className="v2-mono v2-size-folio relative flex items-center gap-1"
      >
        <span className={active ? "opacity-100" : "opacity-60 transition-opacity duration-200 hover:opacity-90"}>
          {item.label}
        </span>
        <span aria-hidden className="text-[0.8em] opacity-70">▾</span>
        {active ? <ActiveUnderline /> : null}
      </button>

      {/* The panel sits flush at top-full with a transparent pt bridge, so the
          cursor never crosses dead space between the button and the menu (that
          gap was what made the dropdown flicker on the way to an item). */}
      <motion.div
        initial={false}
        animate={{
          opacity: open ? 1 : 0,
          y: open ? 0 : -6,
          pointerEvents: open ? "auto" : "none",
        }}
        transition={{ duration: reduce ? 0 : 0.18, ease: EASE_OUT_EXPO }}
        className="absolute left-0 top-full pt-[10px]"
      >
        <ul className="flex min-w-[180px] flex-col rounded-xl border border-ink/10 bg-cream/95 p-2 shadow-[0_18px_40px_-20px_oklch(0.32_0.062_155/0.45)] backdrop-blur-md">
          {item.children.map((leaf) => (
            <li key={leaf.href}>
              <a
                href={leaf.href}
                onClick={onClose}
                className="v2-mono v2-size-folio block whitespace-nowrap rounded px-3 py-2 text-ink/80 transition-colors hover:bg-ink/5 hover:text-ink"
              >
                {leaf.label}
              </a>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

// Mobile drawer — slides in from the right, traps focus, accordion for the
// "About Us" group. Mirrors the classic SiteHeader drawer pattern.
function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(0);
  const drawerRef = useRef<HTMLDivElement>(null);
  useFocusTrap(drawerRef, open, onClose);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- mount-gate for SSR-safe portal
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-50 lg:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
    >
      <button
        type="button"
        aria-label="Close menu"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
        className={`absolute inset-0 bg-ink/40 backdrop-blur-[2px] transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
      />

      <div
        id="magazine-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className={`absolute right-0 top-0 flex h-[100svh] w-[min(92vw,420px)] flex-col bg-cream shadow-[0_24px_60px_-20px_oklch(0.32_0.062_155/0.4)] transition-transform duration-[350ms] ease-out-expo ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex h-[68px] items-center justify-between border-b border-line px-5 sm:h-[88px] sm:px-7">
          <Link href="/" onClick={onClose} aria-label="Richfield — home" className="flex items-center">
            <Image
              src="/photos/logos/richfield.webp"
              alt="Richfield Group"
              width={64}
              height={60}
              className="h-10 w-auto object-contain sm:h-12"
            />
          </Link>
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center text-ink transition-colors hover:text-gold"
          >
            <CloseIcon />
          </button>
        </div>

        <nav
          aria-label="Primary mobile"
          className="flex flex-1 flex-col gap-0 overflow-y-auto px-5 pt-4 sm:px-7"
        >
          {NAV.map((item, i) =>
            isParent(item) ? (
              <div key={item.label} className="border-b border-line">
                <button
                  type="button"
                  aria-expanded={expanded === i}
                  onClick={() => setExpanded((cur) => (cur === i ? null : i))}
                  className="flex w-full items-baseline justify-between py-5 font-display text-[clamp(28px,6vw,40px)] tracking-[-0.01em] text-ink transition-colors hover:text-gold"
                >
                  <span>{item.label}</span>
                  <span aria-hidden className={`ml-4 text-[14px] transition-transform duration-200 ${expanded === i ? "rotate-180" : ""}`}>▾</span>
                </button>
                {expanded === i ? (
                  <ul className="flex flex-col gap-0 pb-4">
                    {item.children.map((leaf) => (
                      <li key={leaf.href}>
                        <a
                          href={leaf.href}
                          onClick={onClose}
                          className="block py-2.5 pl-1 font-display text-[clamp(18px,4vw,24px)] text-ink/75 transition-colors hover:text-gold"
                        >
                          {leaf.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : (
              <MobileLeaf key={item.label} href={item.href} onClose={onClose}>
                {item.label}
              </MobileLeaf>
            ),
          )}
        </nav>

        <div className="flex flex-col gap-4 border-t border-line bg-paper/60 px-5 py-6 sm:px-7">
          <p className="text-[11px] uppercase tracking-[0.28em] text-muted">
            Vietnam · Malaysia · China
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function MobileLeaf({
  href,
  onClose,
  children,
}: {
  href: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const cls =
    "group flex items-baseline justify-between border-b border-line py-5 font-display text-[clamp(28px,6vw,40px)] tracking-[-0.01em] text-ink transition-colors hover:text-gold";
  const arrow = (
    <span aria-hidden className="ml-4 text-[12px] tracking-[0.24em] text-muted transition-transform duration-200 group-hover:translate-x-1 group-hover:text-gold">
      →
    </span>
  );
  return isRoute(href) ? (
    <Link href={href} onClick={onClose} className={cls}>
      <span>{children}</span>
      {arrow}
    </Link>
  ) : (
    <a href={href} onClick={onClose} className={cls}>
      <span>{children}</span>
      {arrow}
    </a>
  );
}

function BurgerIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="3" y1="7" x2="21" y2="7" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="17" x2="14" y2="17" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}
