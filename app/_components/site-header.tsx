"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

  // Green = the brand banner. Always fixed so it follows scroll on every
  // route. On the home hero we ease from a soft green wash → fully opaque on
  // scroll so the aerial photo can still breathe behind it for the first
  // viewport; on inner pages it's solid green from frame one.
  const headerCls = isHome
    ? `fixed inset-x-0 top-0 z-30 transition-colors duration-300 ${
        transparent
          ? "bg-green/60 backdrop-blur-sm"
          : "border-b border-green/40 bg-green/95 backdrop-blur-sm"
      }`
    : "fixed inset-x-0 top-0 z-30 border-b border-green/40 bg-green/95 backdrop-blur-sm";

  const linkColor = "text-paper";
  const hoverColor = "hover:text-gold";

  return (
    <>
      <header className={headerCls}>
        <div className="mx-auto flex h-[68px] max-w-[1300px] items-center justify-between px-4 sm:h-[88px] sm:px-10">
          <Link
            href="/"
            className="flex items-center gap-3"
            aria-label="Richfield Group home"
          >
            <Image
              src="/photos/logos/richfield.webp"
              alt="Richfield Group"
              width={88}
              height={82}
              priority
              className="h-11 w-auto object-contain sm:h-16"
            />
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

          <div className="flex items-center gap-3 sm:gap-4">
            <span className="hidden sm:inline-flex">
              <LangSwitcher tone="light" />
            </span>
            <button
              type="button"
              aria-expanded={open}
              aria-controls="mobile-drawer"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen(true)}
              className={`flex h-10 w-10 items-center justify-center lg:hidden ${linkColor} ${hoverColor} transition-colors`}
            >
              <BurgerIcon />
            </button>
          </div>
        </div>
      </header>

      <MobileDrawer
        open={open}
        onClose={() => setOpen(false)}
        pathname={pathname ?? "/"}
      />
    </>
  );
}

function BurgerIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <line x1="3" y1="7" x2="21" y2="7" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="17" x2="14" y2="17" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}

function MobileDrawer({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  const [mounted, setMounted] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  useFocusTrap(drawerRef, open, onClose);

  // Portal target — body — only available after mount.
  useEffect(() => setMounted(true), []);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-50 lg:hidden ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close menu"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
        className={`absolute inset-0 bg-ink/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Drawer panel — slides in from the right */}
      <div
        id="mobile-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className={`absolute right-0 top-0 flex h-[100svh] w-[min(92vw,420px)] flex-col bg-cream shadow-[0_24px_60px_-20px_oklch(0.32_0.062_155/0.4)] transition-transform duration-[350ms] ease-out-expo ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header — matches the site header rhythm */}
        <div className="flex h-[68px] items-center justify-between border-b border-line px-5 sm:h-[88px] sm:px-7">
          <Link
            href="/"
            onClick={onClose}
            aria-label="Richfield Group home"
            className="flex items-center"
          >
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

        {/* Nav list */}
        <nav
          aria-label="Primary mobile"
          className="flex flex-1 flex-col gap-0 overflow-y-auto px-5 pt-6 sm:px-7"
        >
          {NAV.map((item, idx) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`group flex items-baseline justify-between border-b border-line py-5 font-display text-[clamp(28px,6vw,40px)] tracking-[-0.01em] transition-colors ${
                  active ? "text-gold" : "text-ink hover:text-gold"
                }`}
                style={{ transitionDelay: open ? `${idx * 30}ms` : "0ms" }}
              >
                <span>{item.label}</span>
                <span
                  aria-hidden
                  className={`ml-4 text-[12px] tracking-[0.24em] transition-transform duration-200 ${
                    active ? "text-gold" : "text-muted group-hover:translate-x-1 group-hover:text-gold"
                  }`}
                >
                  →
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer — language + tagline */}
        <div className="flex flex-col gap-4 border-t border-line bg-paper/60 px-5 py-6 sm:px-7">
          <LangSwitcher tone="dark" />
          <p className="text-[11px] uppercase tracking-[0.28em] text-muted">
            Vietnam · Malaysia · China
          </p>
        </div>
      </div>
    </div>,
    document.body,
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
