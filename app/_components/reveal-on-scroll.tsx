"use client";

import { useRevealOnScroll } from "@/app/_hooks/use-reveal-on-scroll";

export function RevealOnScroll({
  children,
  as: Tag = "div",
  className = "",
  delayMs = 0,
}: {
  children: React.ReactNode;
  as?: "div" | "section" | "article" | "li";
  className?: string;
  delayMs?: number;
}) {
  const { ref, visible } = useRevealOnScroll<HTMLDivElement>();
  const style = delayMs ? { transitionDelay: `${delayMs}ms` } : undefined;
  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      style={style}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </Tag>
  );
}
