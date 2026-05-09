"use client";

import { useEffect, useRef, useState } from "react";
import { Eyebrow } from "@/app/_components/primitives/eyebrow";
import { DisplayHeading } from "@/app/_components/primitives/display-heading";
import { HairlineRule } from "@/app/_components/primitives/hairline-rule";

type CountryNode = {
  code: string;
  label: string;
  role: string;
  /** Anchor for the typographic plate, % of container. */
  anchor: { left: string; top: string };
  align: "left" | "right";
};

const COUNTRIES: CountryNode[] = [
  {
    code: "CN",
    label: "China",
    role: "Sourcing & Brands",
    anchor: { left: "62%", top: "16%" },
    align: "right",
  },
  {
    code: "VN",
    label: "Vietnam",
    role: "HQ · Ho Chi Minh City",
    anchor: { left: "55%", top: "50%" },
    align: "right",
  },
  {
    code: "MY",
    label: "Malaysia",
    role: "Origin · 1990s",
    anchor: { left: "30%", top: "82%" },
    align: "left",
  },
];

export function FootprintMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(!!entry?.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      aria-labelledby="footprint-heading"
      className="bg-cream px-6 py-[clamp(96px,11vw,140px)] sm:px-10"
    >
      <div className="mx-auto grid max-w-[1300px] gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div className="flex flex-col gap-8">
          <Eyebrow tone="gold">Our footprint</Eyebrow>
          <div id="footprint-heading">
            <DisplayHeading level={2}>
              An *international* group with deep local roots.
            </DisplayHeading>
          </div>
          <p className="max-w-[55ch] text-[17px] leading-[1.55] text-muted">
            The Richfield Group spans three countries and three generations of
            family leadership. International scale meets hands-on knowledge of
            every market we serve. Vietnam, Malaysia, and China together form
            one operating Group, not a holding shell.
          </p>
          <ul className="flex flex-col">
            {COUNTRIES.map((c) => (
              <li key={c.code} className="border-t border-line py-5">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-display text-[24px] text-ink">
                    {c.label}
                  </span>
                  <span className="text-[12px] uppercase tracking-[0.16em] text-muted">
                    {c.role}
                  </span>
                </div>
              </li>
            ))}
            <HairlineRule />
          </ul>
        </div>

        <figure
          ref={mapRef}
          aria-label="Diagram of Richfield's three operating countries: China, Vietnam, Malaysia"
          role="img"
          className="relative aspect-[16/11] w-full overflow-hidden rounded-sm bg-paper"
        >
          <svg
            aria-hidden
            viewBox="0 0 1600 1100"
            className="absolute inset-0 h-full w-full"
          >
            <defs>
              <pattern
                id="dots"
                x="0"
                y="0"
                width="28"
                height="28"
                patternUnits="userSpaceOnUse"
              >
                <circle
                  cx="2"
                  cy="2"
                  r="1.2"
                  fill="currentColor"
                  className="text-line"
                />
              </pattern>
            </defs>
            <rect width="1600" height="1100" fill="url(#dots)" opacity="0.7" />

            {/* Connector arcs: CN → VN → MY */}
            <path
              d="M 990 220 Q 720 350 870 540"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="3 8"
              className="text-gold"
            />
            <path
              d="M 870 540 Q 600 740 480 900"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="3 8"
              className="text-gold"
            />

            {/* Compass tick (lower-left) */}
            <g className="text-muted" stroke="currentColor" strokeWidth="1">
              <line x1="80" y1="980" x2="80" y2="940" />
              <line x1="68" y1="970" x2="92" y2="970" />
            </g>
            <text
              x="80"
              y="1018"
              textAnchor="middle"
              className="fill-current text-muted"
              style={{ fontSize: 22, letterSpacing: "0.32em" }}
            >
              N
            </text>
          </svg>

          {COUNTRIES.map((c, idx) => (
            <FootprintNode
              key={c.code}
              country={c}
              animate={inView}
              delayMs={idx * 200}
            />
          ))}
        </figure>
      </div>
    </section>
  );
}

function FootprintNode({
  country,
  animate,
  delayMs,
}: {
  country: CountryNode;
  animate: boolean;
  delayMs: number;
}) {
  const isRight = country.align === "right";
  return (
    <div
      style={{
        left: country.anchor.left,
        top: country.anchor.top,
        transform: "translate(-50%, -50%)",
      }}
      className="absolute flex items-center gap-4"
    >
      <span className="relative inline-flex h-3 w-3">
        <span
          aria-hidden
          style={{ animationDelay: `${delayMs}ms` }}
          className={`absolute inset-0 rounded-full bg-gold/50 ${animate ? "motion-safe:animate-ping" : ""}`}
        />
        <span
          aria-hidden
          className="relative inline-flex h-full w-full rounded-full bg-gold ring-2 ring-paper"
        />
      </span>
      <div
        className={`flex flex-col gap-1 ${isRight ? "items-start" : "items-end"}`}
      >
        <span className="font-display text-[clamp(28px,3vw,40px)] italic leading-none text-ink">
          {country.label}
        </span>
        <span className="text-[10px] uppercase tracking-[0.32em] text-muted">
          {country.role}
        </span>
      </div>
    </div>
  );
}
