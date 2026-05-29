"use client";

import { motion, useReducedMotion } from "motion/react";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

type Office = { readonly country: string; readonly role: string };

/**
 * STORY 03 office roster. Each row reveals on scroll with a quiet
 * staggered fade + rise, so the three Group countries arrive in sequence
 * rather than all at once. Static end-state under prefers-reduced-motion.
 */
export function AtlasRoster({ offices }: { offices: readonly Office[] }) {
  const reduce = useReducedMotion();

  return (
    <dl className="mt-[clamp(18px,1.8vw,28px)]">
      {offices.map((o, i) => (
        <motion.div
          key={o.country}
          initial={reduce ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{
            duration: reduce ? 0 : 0.7,
            ease: EASE_OUT_EXPO,
            delay: reduce ? 0 : i * 0.12,
          }}
          className="flex items-baseline justify-between gap-4 border-b border-current/15 py-[clamp(11px,1.1vw,16px)]"
        >
          <dt className="font-display text-[clamp(1.25rem,1.7vw,1.55rem)] leading-none tracking-[-0.015em]">
            {o.country}
          </dt>
          <dd className="v2-mono text-[clamp(10px,0.85vw,12px)] uppercase tracking-[0.16em] opacity-50">
            {o.role}
          </dd>
        </motion.div>
      ))}
    </dl>
  );
}
