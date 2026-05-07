"use client";

import { Eyebrow } from "@/app/_components/primitives/eyebrow";
import { DisplayHeading } from "@/app/_components/primitives/display-heading";
import { TimelineItem } from "@/app/_components/primitives/timeline-item";
import { RevealOnScroll } from "@/app/_components/reveal-on-scroll";
import type { Milestone } from "@/content/en/milestones";

export function Timeline({
  milestones,
  variant = "compact",
  heading,
  eyebrow,
}: {
  milestones: Milestone[];
  variant?: "compact" | "detail";
  heading: string;
  eyebrow: string;
}) {
  return (
    <section
      aria-labelledby="timeline-heading"
      className="bg-ink px-6 py-[clamp(96px,11vw,140px)] sm:px-10"
    >
      <div className="mx-auto flex max-w-[1300px] flex-col gap-16">
        <div className="flex flex-col gap-6">
          <Eyebrow tone="gold">{eyebrow}</Eyebrow>
          <div id="timeline-heading">
            <DisplayHeading level={2} tone="white">
              {heading}
            </DisplayHeading>
          </div>
        </div>

        <div className="relative">
          <div
            aria-hidden
            className="absolute left-0 right-0 top-[6px] h-px bg-paper/15"
          />
          <ol
            className={`flex gap-10 overflow-x-auto pb-4 sm:grid sm:overflow-visible ${
              variant === "detail"
                ? "sm:grid-cols-2 lg:grid-cols-4"
                : "sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7"
            }`}
            style={{ scrollSnapType: "x mandatory" }}
          >
            {milestones.map((m, idx) => (
              <RevealOnScroll
                key={`${m.year}-${m.brand}`}
                as="li"
                delayMs={idx * 80}
                className="min-w-[220px] snap-start"
              >
                <TimelineItem milestone={m} variant={variant} />
              </RevealOnScroll>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
