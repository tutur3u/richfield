"use client";

import { useRevealOnScroll } from "@/app/_hooks/use-reveal-on-scroll";

type AllowedTag = "div" | "section" | "article" | "li" | "figure" | "header";

export function RevealOnScroll({
  children,
  as: Tag = "div",
  className = "",
  delayMs = 0,
}: {
  children: React.ReactNode;
  as?: AllowedTag;
  className?: string;
  delayMs?: number;
}) {
  const { ref, armed } = useRevealOnScroll<HTMLElement>();
  const style = delayMs ? { transitionDelay: `${delayMs}ms` } : undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const TagAny = Tag as any;
  return (
    <TagAny
      ref={ref}
      style={style}
      className={`reveal ${armed ? "reveal--armed" : ""} ${className}`}
    >
      {children}
    </TagAny>
  );
}
