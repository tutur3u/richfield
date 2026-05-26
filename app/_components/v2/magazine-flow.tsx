"use client";

import { Children, isValidElement, useRef, useState, useEffect, type ReactNode, type ReactElement } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}

const MORPH_FRACTION = 0.10;

export type MagazineFlowSectionProps = {
  bg: string;
  textOnDark?: boolean;
  id?: string;
  children: ReactNode;
};

export function MagazineFlowSection({
  bg,
  textOnDark = false,
  id,
  children,
}: MagazineFlowSectionProps) {
  return (
    <section
      id={id}
      data-bg={bg}
      data-text-on-dark={textOnDark ? "true" : "false"}
      className={`relative ${textOnDark ? "text-cream" : "text-ink"}`}
      style={{ background: bg }}
    >
      {children}
    </section>
  );
}

type SectionMeta = { bg: string; textOnDark: boolean };

type MagazineFlowProps = {
  children: ReactNode;
};

export function MagazineFlow({ children }: MagazineFlowProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const sections: SectionMeta[] = Children.toArray(children)
    .filter(isValidElement)
    .map((child) => {
      const typedChild = child as ReactElement<MagazineFlowSectionProps>;
      const { bg, textOnDark } = typedChild.props;
      return {
        bg: bg ?? "oklch(0.96 0.018 82)",
        textOnDark: textOnDark ?? false,
      };
    });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const bg = useFlowBackground(scrollYProgress, sections);

  if (reduce) {
    return (
      <div ref={ref} className="relative">
        {Children.map(children, (child) => {
          if (!isValidElement(child)) return child;
          const typedChild = child as ReactElement<MagazineFlowSectionProps>;
          const { bg, textOnDark, children: sectionChildren, id } = typedChild.props;
          return (
            <section
              id={id}
              data-bg={bg}
              className={`relative ${textOnDark ? "text-cream" : "text-ink"}`}
              style={{ background: bg }}
            >
              {sectionChildren}
            </section>
          );
        })}
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <motion.div
        data-testid="magazine-flow-bg"
        aria-hidden
        style={{
          background: bg as unknown as MotionValue<string>,
        }}
        className="pointer-events-none fixed inset-0 -z-10"
      />
      {Children.map(children, (child) => {
        if (!isValidElement(child)) return child;
        const typedChild = child as ReactElement<MagazineFlowSectionProps>;
        const { textOnDark, children: sectionChildren, id } = typedChild.props;
        return (
          <section
            id={id}
            className={`relative ${textOnDark ? "text-cream" : "text-ink"}`}
            style={{ background: "transparent" }}
          >
            {sectionChildren}
          </section>
        );
      })}
    </div>
  );
}

function useFlowBackground(
  progress: MotionValue<number>,
  sections: SectionMeta[],
): MotionValue<string> {
  const n = sections.length;
  const points: number[] = [];
  const values: string[] = [];

  if (n === 0) {
    points.push(0, 1);
    values.push("oklch(0.96 0.018 82)", "oklch(0.96 0.018 82)");
  } else if (n === 1) {
    points.push(0, 1);
    values.push(sections[0].bg, sections[0].bg);
  } else {
    for (let i = 0; i < n; i++) {
      const sectionEnd = (i + 1) / n;
      const morphStart = sectionEnd - MORPH_FRACTION / n;

      if (i === 0) {
        points.push(0);
        values.push(sections[0].bg);
      }
      points.push(morphStart);
      values.push(sections[i].bg);
      if (i < n - 1) {
        points.push(sectionEnd);
        values.push(sections[i + 1].bg);
      } else {
        points.push(1);
        values.push(sections[i].bg);
      }
    }
  }

  return useTransform(progress, points, values);
}
