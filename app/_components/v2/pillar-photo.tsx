"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

type Props = {
  src: string;
  alt: string;
  objectPosition?: string;
  /** Stagger delay in seconds — applied to scale and fade. */
  delay?: number;
};

/**
 * Pillar photo with a one-time scroll-triggered reveal:
 * a slow scale-down from 1.04 → 1.0 + opacity 0.7 → 1.
 * Plays once when the pillar enters the viewport. Quiet motion —
 * no loop, no hover effect, no parallax.
 */
export function PillarPhoto({
  src,
  alt,
  objectPosition,
  delay = 0,
}: Props) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { scale: 1.04, opacity: 0.7 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{
        duration: reduce ? 0 : 1.4,
        ease: EASE_OUT_EXPO,
        delay: reduce ? 0 : delay,
      }}
      className="absolute inset-0"
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 1024px) 100vw, 32vw"
        className="object-cover v2-photo-duotone transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.05]"
        style={{ objectPosition }}
      />
    </motion.div>
  );
}
