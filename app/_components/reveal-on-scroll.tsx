"use client";

import { useRevealOnScroll } from "@/app/_hooks/use-reveal-on-scroll";

type AllowedTag = "div" | "section" | "article" | "li" | "figure" | "header";

export function RevealOnScroll({
  children,
  as: Tag = "div",
  className = "",
  delayMs = 0,
  id,
  lang,
}: {
  children: React.ReactNode;
  as?: AllowedTag;
  className?: string;
  delayMs?: number;
  /** Forwarded so a wrapped block can keep its scroll-anchor target. */
  id?: string;
  /** Forwarded so hyphenation (`hyphens-auto`) keeps its language. */
  lang?: string;
}) {
  const { ref, armed } = useRevealOnScroll<HTMLElement>();
  const style = delayMs ? { transitionDelay: `${delayMs}ms` } : undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const TagAny = Tag as any;
  return (
    <TagAny
      ref={ref}
      id={id}
      lang={lang}
      style={style}
      className={`reveal ${armed ? "reveal--armed" : ""} ${className}`}
    >
      {children}
    </TagAny>
  );
}
