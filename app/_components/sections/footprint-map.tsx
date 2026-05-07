"use client";

import { useEffect, useRef, useState } from "react";
import { Eyebrow } from "@/app/_components/primitives/eyebrow";
import { DisplayHeading } from "@/app/_components/primitives/display-heading";
import { HairlineRule } from "@/app/_components/primitives/hairline-rule";
import { Pin } from "@/app/_components/primitives/pin";

const COUNTRIES = [
  { code: "VN", label: "Vietnam", role: "HQ · HCMC", pin: { left: "70%", top: "55%" } },
  { code: "MY", label: "Malaysia", role: "Origin · 1990s", pin: { left: "55%", top: "75%" } },
  { code: "CN", label: "China", role: "Sourcing & Brands", pin: { left: "65%", top: "18%" } },
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

        <div
          ref={mapRef}
          aria-hidden={false}
          role="img"
          aria-label="Map of Vietnam, Malaysia, and China showing Richfield's footprint"
          className="relative aspect-[16/11] w-full overflow-hidden rounded-sm bg-paper"
        >
          <svg
            aria-hidden
            viewBox="0 0 1600 1100"
            className="absolute inset-0 h-full w-full"
          >
            <defs>
              <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="currentColor" className="text-line" />
              </pattern>
            </defs>
            <rect width="1600" height="1100" fill="url(#dots)" />
            <g className="text-green/55" fill="currentColor">
              <path d="M1100 250 q 80 50 60 130 q -20 60 -100 80 q -80 0 -110 -90 z">
                <title>China</title>
              </path>
              <path d="M1080 540 q 30 80 -10 160 q -30 80 30 140 q 60 60 0 120 q -60 60 -90 -10 q -50 -120 30 -270 q 0 -100 40 -140 z">
                <title>Vietnam</title>
              </path>
              <path d="M820 800 q 40 30 80 0 q 60 30 60 100 q -100 60 -160 -10 q -40 -50 20 -90 z">
                <title>Malaysia</title>
              </path>
            </g>
            <path
              d="M860 850 Q 1000 700 1080 580"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="4 6"
              className="text-gold"
            />
            <path
              d="M1080 580 Q 1130 400 1130 280"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="4 6"
              className="text-gold"
            />
          </svg>
          {COUNTRIES.map((c) => (
            <span
              key={c.code}
              style={{ left: c.pin.left, top: c.pin.top }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 ${inView ? "" : "[&_.animate-ping]:hidden"}`}
            >
              <Pin label={c.label} />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
