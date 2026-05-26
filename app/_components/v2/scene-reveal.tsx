"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/**
 * Wraps a section so its contents reveal as it enters the viewport — the
 * "magazine page morph" feel without scroll-jacking. Fires once per
 * mount. Honors reduced-motion (becomes a no-op wrapper).
 */
export function SceneReveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  // Trigger when the scene is well into view, not just touching the edge.
  const inView = useInView(ref, { once: true, margin: "0px 0px -18% 0px" });

  if (reduce) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
      animate={
        inView
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: 28, filter: "blur(6px)" }
      }
      transition={{ duration: 1.1, ease: EASE_OUT_EXPO }}
    >
      {children}
    </motion.div>
  );
}
