# V2 Content Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fold the full Richfield homepage content into the `/v2` magazine framework per the approved spec at `docs/superpowers/specs/2026-05-26-v2-content-integration-design.md`. Replace the in-place crossfading `MagazineCanvas` with a new `MagazineFlow` primitive so each section scrolls naturally with morph transitions only at section seams. Resolve every customer content-feedback item listed in the spec.

**Architecture:** Next.js 16.2.6 App Router, RSC where possible, Tailwind v4 with OKLCH tokens, Motion (`motion/react`) for scroll-driven animations, Lenis for smooth scroll (already configured). Six normally-scrolling magazine sections live under `/v2`, wrapped by `MagazineFlow` which paints a fixed background layer that interpolates between section palettes on scroll. All new spreads live at `app/_components/v2/` root alongside the existing `cover-spread.tsx` and `lead-spread.tsx`. Tests use Vitest + React Testing Library for content/structure assertions and Playwright for the end-to-end smoke check.

**Tech Stack:** Next.js 16.2.6 · React 19.2.6 · TypeScript 6 · Tailwind CSS v4 · Motion 12.40 · Lenis 1.3 · Vitest 4 + React Testing Library · Playwright.

---

## Pre-Implementation Reading (mandatory)

Per `AGENTS.md`: this is Next.js 16 with breaking changes versus older training data. Skim these before writing code:

- `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md` — App Router conventions.
- `node_modules/next/dist/docs/01-app/02-guides/testing/vitest.md` — Vitest manual setup.
- `node_modules/next/dist/docs/01-app/02-guides/testing/playwright.md` — Playwright manual setup.

Also read the existing v2 primitives before touching anything:
- `app/_components/v2/cover-spread.tsx`
- `app/_components/v2/lead-spread.tsx`
- `app/_components/v2/magazine-canvas.tsx` (about to be retired — read it so you understand what `MagazineFlow` replaces and why)
- `app/_components/v2/magazine-morph.tsx` (also retired)
- `app/_components/v2/lenis-provider.tsx`
- `app/_components/v2/vertical-toc.tsx`
- `app/globals.css` (look at the `@theme` block and the `@layer components` `.v2-*` utilities)

Local files only — do not fetch online docs.

---

## Working Conventions

- **Branch:** create `feature/v2-content-integration` off `main` before Task 1. All work lands there.
- **Package manager:** `bun`. The repo has `bun.lock`. Use `bun add`, `bun run`. Fall back to `npm` consistently if `bun` isn't installed.
- **Commits:** atomic, one per task. Conventional Commits: `feat:`, `fix:`, `refactor:`, `chore:`, `test:`, `docs:`, `style:`. After each "Commit" step, run `git status` to confirm clean tree before starting the next task.
- **Style:** TypeScript strict, RSC where possible, `'use client'` only where motion hooks or browser APIs require it. No `any`. No comments unless WHY is non-obvious. No em dashes in content strings (project-wide rule from previous plan still holds).
- **Verification per task:** after each task's implementation step, run `bun run lint && bun run typecheck && bun run test:unit` before commit. The build (`bun run build`) is run once at the end (Task 12).

---

## File Structure

```
app/
  globals.css                                       MODIFY — add gold-strong, gold-rule tokens
  v2/
    page.tsx                                        MODIFY — replace MagazineCanvas with MagazineFlow + new spreads
  _components/
    v2/
      magazine-flow.tsx                             NEW — replaces MagazineCanvas/MagazineMorph
      lead-spread.tsx                               MODIFY — numbers + stat strip styling, normal-flow context
      what-we-do-spread.tsx                         NEW — §02
      field-atlas-spread.tsx                        NEW — §03 (ports v1 FootprintMap SVG)
      product-marquee.tsx                           NEW — used by §04
      directory-spread.tsx                          NEW — §04
      joint-venture-spread.tsx                      NEW — §05 (extract from inline JVSpread)
      colophon-spread.tsx                           NEW — §06 (extract from inline CloserColophon)
      vertical-toc.tsx                              MODIFY — labels + active-section tracking
      cover-spread.tsx                              READ ONLY (no change)
      magazine-canvas.tsx                           UNUSED after Task 11 (kept on disk)
      magazine-morph.tsx                            UNUSED after Task 11 (kept on disk)
__tests__/
  sections/
    v2/
      magazine-flow.test.tsx                        NEW
      lead-spread.test.tsx                          NEW
      what-we-do-spread.test.tsx                    NEW
      field-atlas-spread.test.tsx                   NEW
      product-marquee.test.tsx                      NEW
      directory-spread.test.tsx                     NEW
      joint-venture-spread.test.tsx                 NEW
      colophon-spread.test.tsx                      NEW
      vertical-toc.test.tsx                         NEW
e2e/
  v2.spec.ts                                        NEW — Playwright homepage smoke
```

No content files are added or restructured. `content/en/site.ts`, `content/en/brands.ts`, `content/en/capabilities.ts`, `content/en/photography.ts` are read-only sources for the new spreads.

---

## Task 0: Branch & baseline

**Files:** none — git state only.

- [ ] **Step 1: Create feature branch**

```bash
git checkout main
git pull --ff-only
git checkout -b feature/v2-content-integration
```

- [ ] **Step 2: Verify baseline passes**

```bash
bun install
bun run lint
bun run typecheck
bun run test:unit
```

Expected: all clean. If anything fails on `main`, stop and surface to the user — do not start work on a broken baseline.

- [ ] **Step 3: Sanity-check the spec is committed**

```bash
git log --oneline -3 -- docs/superpowers/specs/2026-05-26-v2-content-integration-design.md
```

Expected: shows commit `c9bd0bd` (or later) authored 2026-05-26.

---

## Task 1: Gold-strong and gold-rule tokens

**Why:** The spec adds two new gold tokens for higher-contrast accents on cream surfaces. These need to be defined in the Tailwind `@theme` block so utilities like `text-gold-strong`, `border-gold-rule` work in JSX.

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Add the tokens to `@theme` block**

Open `app/globals.css`. The `@theme` block currently ends around line 19. Edit:

```css
@theme {
  --color-gold: oklch(0.72 0.16 78);
  --color-gold-strong: oklch(0.62 0.14 75);
  --color-gold-rule: oklch(0.58 0.15 75);
  --color-sunrise: oklch(0.84 0.13 88);
  --color-green: oklch(0.51 0.135 148);
  --color-forest: oklch(0.32 0.062 155);
  --color-ink: oklch(0.22 0.015 158);
  --color-paper: oklch(0.985 0.006 70);
  --color-cream: oklch(0.96 0.018 82);
  --color-muted: oklch(0.52 0.018 250);
  --color-line: oklch(0.86 0.018 82);

  --font-display: var(--font-fraunces);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);

  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
}
```

(Insert the two new lines immediately after `--color-gold`.)

- [ ] **Step 2: Verify Tailwind picks them up**

Run a no-op dev start to ensure the CSS compiles:

```bash
bun run dev
```

In a second terminal:

```bash
curl -s http://localhost:3000/v2 -o /dev/null -w '%{http_code}\n'
```

Expected: `200`. Then kill the dev server.

- [ ] **Step 3: Lint and typecheck**

```bash
bun run lint && bun run typecheck
```

Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css
git commit -m "feat(v2): add gold-strong and gold-rule tokens"
```

---

## Task 2: MagazineFlow primitive

**Why:** Replaces `MagazineCanvas` (which pins all spreads into one viewport — wrong) with a primitive that wraps normally-scrolling sections and paints a fixed background layer interpolating between section palettes at section seams. This is the heart of the new scroll model.

**Files:**
- Create: `app/_components/v2/magazine-flow.tsx`
- Create: `__tests__/sections/v2/magazine-flow.test.tsx`

### TDD cycle

- [ ] **Step 1: Write the failing test**

Create `__tests__/sections/v2/magazine-flow.test.tsx`:

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MagazineFlow, MagazineFlowSection } from "@/app/_components/v2/magazine-flow";

// motion/react reads matchMedia for prefers-reduced-motion. Default jsdom
// matchMedia returns false (no matches), which means motion is enabled.
// We override per-test where we want the reduced-motion fallback path.
function mockReducedMotion(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((q: string) => ({
      matches: q.includes("prefers-reduced-motion") ? matches : false,
      media: q,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe("<MagazineFlow>", () => {
  it("renders each section's children", () => {
    mockReducedMotion(false);
    render(
      <MagazineFlow>
        <MagazineFlowSection bg="oklch(0.96 0.018 82)">
          <p>Section A content</p>
        </MagazineFlowSection>
        <MagazineFlowSection bg="oklch(0.22 0.015 158)" textOnDark>
          <p>Section B content</p>
        </MagazineFlowSection>
      </MagazineFlow>,
    );
    expect(screen.getByText("Section A content")).toBeInTheDocument();
    expect(screen.getByText("Section B content")).toBeInTheDocument();
  });

  it("paints a fixed background layer when motion is enabled", () => {
    mockReducedMotion(false);
    const { container } = render(
      <MagazineFlow>
        <MagazineFlowSection bg="oklch(0.96 0.018 82)">
          <p>A</p>
        </MagazineFlowSection>
      </MagazineFlow>,
    );
    const bgLayer = container.querySelector('[data-testid="magazine-flow-bg"]');
    expect(bgLayer).not.toBeNull();
  });

  it("under reduced motion, each section paints its own solid bg (no fixed layer)", () => {
    mockReducedMotion(true);
    const { container } = render(
      <MagazineFlow>
        <MagazineFlowSection bg="oklch(0.96 0.018 82)">
          <p>A</p>
        </MagazineFlowSection>
        <MagazineFlowSection bg="oklch(0.22 0.015 158)" textOnDark>
          <p>B</p>
        </MagazineFlowSection>
      </MagazineFlow>,
    );
    expect(container.querySelector('[data-testid="magazine-flow-bg"]')).toBeNull();
    const sections = container.querySelectorAll("section");
    expect(sections).toHaveLength(2);
    expect(sections[0]).toHaveStyle({ background: "oklch(0.96 0.018 82)" });
    expect(sections[1]).toHaveStyle({ background: "oklch(0.22 0.015 158)" });
  });

  it("applies cream type by default and ink type when textOnDark is set", () => {
    mockReducedMotion(true);
    const { container } = render(
      <MagazineFlow>
        <MagazineFlowSection bg="oklch(0.96 0.018 82)">
          <p>cream-bg</p>
        </MagazineFlowSection>
        <MagazineFlowSection bg="oklch(0.22 0.015 158)" textOnDark>
          <p>ink-bg</p>
        </MagazineFlowSection>
      </MagazineFlow>,
    );
    const sections = container.querySelectorAll("section");
    expect(sections[0].className).toContain("text-ink");
    expect(sections[1].className).toContain("text-cream");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
bun run test:unit -- __tests__/sections/v2/magazine-flow.test.tsx
```

Expected: 4 failures, all caused by `Cannot find module '@/app/_components/v2/magazine-flow'`.

- [ ] **Step 3: Implement `MagazineFlow`**

Create `app/_components/v2/magazine-flow.tsx`:

```tsx
"use client";

import { Children, isValidElement, useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

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
      const props = (child as { props: Partial<MagazineFlowSectionProps> }).props;
      return {
        bg: props.bg ?? "oklch(0.96 0.018 82)",
        textOnDark: props.textOnDark ?? false,
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
          const props = (child as { props: { bg?: string } }).props;
          return (
            <section
              data-bg={props.bg}
              className={`relative ${(child as { props: { textOnDark?: boolean } }).props.textOnDark ? "text-cream" : "text-ink"}`}
              style={{ background: props.bg }}
            >
              {(child as { props: { children?: ReactNode } }).props.children}
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
        const childProps = (child as { props: { textOnDark?: boolean; children?: ReactNode } }).props;
        return (
          <section
            className={`relative ${childProps.textOnDark ? "text-cream" : "text-ink"}`}
            style={{ background: "transparent" }}
          >
            {childProps.children}
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
      const sectionStart = i / n;
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
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
bun run test:unit -- __tests__/sections/v2/magazine-flow.test.tsx
```

Expected: all 4 tests pass.

- [ ] **Step 5: Lint + typecheck**

```bash
bun run lint && bun run typecheck
```

Expected: clean.

- [ ] **Step 6: Commit**

```bash
git add app/_components/v2/magazine-flow.tsx __tests__/sections/v2/magazine-flow.test.tsx
git commit -m "feat(v2): add MagazineFlow primitive for section-seam morphs"
```

---

## Task 3: Lead spread content + style updates

**Why:** §01 already exists at `app/_components/v2/lead-spread.tsx` but the stats are outdated (600,000 outlets, 200+ sub-distributors, 1,000+ field salesmen), the stat-strip eyebrow needs to drop the "Vietnam · Malaysia · China" qualifier, and the strip needs a bordered-card treatment so it pops as the section's payoff. Also drop the 100svh-fit constraint since the section now scrolls naturally.

**Files:**
- Modify: `app/_components/v2/lead-spread.tsx`
- Create: `__tests__/sections/v2/lead-spread.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `__tests__/sections/v2/lead-spread.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LeadSpread } from "@/app/_components/v2/lead-spread";

describe("<LeadSpread>", () => {
  it("renders the about-the-group headline", () => {
    render(<LeadSpread />);
    expect(
      screen.getByText(/from market entry to nationwide distribution/i),
    ).toBeInTheDocument();
  });

  it("renders the updated by-the-numbers stats", () => {
    render(<LeadSpread />);
    expect(screen.getByText("180,000")).toBeInTheDocument();
    expect(screen.getByText("300+")).toBeInTheDocument();
    expect(screen.getByText("800+")).toBeInTheDocument();
    expect(screen.getByText("30+")).toBeInTheDocument();
  });

  it("does not render the outdated stats", () => {
    render(<LeadSpread />);
    expect(screen.queryByText("600,000")).toBeNull();
    expect(screen.queryByText("200+")).toBeNull();
    expect(screen.queryByText("1,000+")).toBeNull();
  });

  it("stat strip eyebrow says 'BY THE NUMBERS · VIETNAM' (Vietnam-only)", () => {
    render(<LeadSpread />);
    expect(
      screen.getByText(/by the numbers · vietnam/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/by the numbers · vietnam · malaysia/i),
    ).toBeNull();
  });

  it("renders the second paragraph with brand partner names", () => {
    render(<LeadSpread />);
    expect(
      screen.getByText(/mars, red bull, bic, glico, amos, and newchoice/i),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
bun run test:unit -- __tests__/sections/v2/lead-spread.test.tsx
```

Expected: at minimum the "180,000" / "300+" / "800+" / "BY THE NUMBERS · VIETNAM" assertions fail.

- [ ] **Step 3: Rewrite `lead-spread.tsx`**

Replace `app/_components/v2/lead-spread.tsx` with:

```tsx
import Image from "next/image";

type Stat = readonly [figure: string, label: string];

const STATS: readonly Stat[] = [
  ["180,000", "RETAIL OUTLETS"],
  ["300+", "SUB-DISTRIBUTORS"],
  ["800+", "FIELD SALESMEN"],
  ["30+", "YEARS · SINCE 1994"],
];

export function LeadSpread() {
  return (
    <div id="lead" className="v2-display mx-auto w-full max-w-[1500px] px-6 py-[clamp(64px,9vw,120px)] sm:px-10 lg:px-12">
      <div className="v2-mono v2-size-folio mb-8 flex items-center gap-6 opacity-60">
        <span>RICHFIELD WORLDWIDE JSC · ISSUE 30</span>
        <span aria-hidden className="v2-rule flex-1" />
        <span>PAGES 02—03 · STORY 01</span>
      </div>

      <p className="v2-mono v2-size-eyebrow mb-5 flex items-center gap-3 text-gold-strong">
        <span aria-hidden className="inline-block h-px w-8 bg-gold-rule" />
        STORY 01 · ABOUT THE GROUP
      </p>
      <h2 className="v2-italic v2-size-feature mb-12 max-w-[22ch] text-balance">
        From market entry to nationwide distribution.
      </h2>

      <div className="grid grid-cols-12 gap-8 sm:gap-10 lg:gap-14">
        <figure className="col-span-12 lg:col-span-7">
          <div className="relative aspect-video w-full overflow-hidden lg:aspect-auto lg:h-[52svh]">
            <Image
              src="/photos/people/candid-1-1280.webp"
              alt="Richfield Worldwide annual Town Hall. The whole company gathered on stage."
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover v2-photo-duotone"
              style={{ objectPosition: "center 38%" }}
            />
          </div>
          <figcaption className="v2-mono v2-size-folio mt-4 flex items-center gap-3 opacity-60">
            <span aria-hidden className="v2-rule-gold inline-block w-8" />
            FIG. 01 · ANNUAL TOWN HALL · 2026
          </figcaption>
        </figure>

        <div className="col-span-12 lg:col-span-5 lg:pt-1">
          <p className="v2-size-body max-w-[58ch] opacity-85">
            <span
              aria-hidden
              className="v2-display float-left mr-3 mt-1 text-[5rem] font-light leading-[0.82] tracking-[-0.04em]"
            >
              R
            </span>
            ichfield Worldwide JSC is one of Vietnam&apos;s largest FMCG distributors. One network reaching every province and city, carrying brands people love, doing the same thing well for thirty years.
          </p>
          <p className="v2-size-body mt-5 max-w-[58ch] opacity-70">
            Rooted in a Malaysian family business now in its third generation, Richfield has grown alongside Mars, Red Bull, BiC, Glico, AMOS, and Newchoice. Partners who chose us because the brands they make needed distribution that behaved like the brand itself.
          </p>

          <div className="mt-10 rounded-sm border border-current/15 bg-current/[0.02] p-5">
            <p className="v2-mono v2-size-eyebrow mb-5 flex items-center gap-3 text-gold-strong">
              <span aria-hidden className="inline-block h-px w-6 bg-gold-rule" />
              BY THE NUMBERS · VIETNAM
            </p>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4 sm:gap-x-4">
              {STATS.map(([figure, label]) => (
                <div key={label} className="border-t border-current/15 pt-3">
                  <dt className="v2-display text-[clamp(1.8rem,2.6vw,2.4rem)] leading-none tracking-[-0.022em]">
                    {figure}
                  </dt>
                  <dd className="v2-mono v2-size-folio mt-2 opacity-60">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <p className="v2-mono v2-size-folio mt-9 opacity-55">
            <span aria-hidden className="v2-rule-gold mr-3 inline-block w-6 align-middle" />
            BY THE EDITORS · ISSUE 30 · MAY 2026
          </p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
bun run test:unit -- __tests__/sections/v2/lead-spread.test.tsx
```

Expected: all 5 tests pass.

- [ ] **Step 5: Lint + typecheck**

```bash
bun run lint && bun run typecheck
```

Expected: clean.

- [ ] **Step 6: Commit**

```bash
git add app/_components/v2/lead-spread.tsx __tests__/sections/v2/lead-spread.test.tsx
git commit -m "feat(v2): update lead spread numbers and stat-strip treatment"
```

---

## Task 4: What We Do spread

**Why:** §02 capabilities section. Three cards (Warehouse & Logistics, General Trade, Modern Trade) on an ink surface. No Export.

**Files:**
- Create: `app/_components/v2/what-we-do-spread.tsx`
- Create: `__tests__/sections/v2/what-we-do-spread.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `__tests__/sections/v2/what-we-do-spread.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { WhatWeDoSpread } from "@/app/_components/v2/what-we-do-spread";

describe("<WhatWeDoSpread>", () => {
  it("renders the section eyebrow and italic headline", () => {
    render(<WhatWeDoSpread />);
    expect(screen.getByText(/story 02 · what we do/i)).toBeInTheDocument();
    expect(
      screen.getByText(/three ways we move brands to market/i),
    ).toBeInTheDocument();
  });

  it("renders all three capability cards (no Export)", () => {
    render(<WhatWeDoSpread />);
    expect(screen.getByText("Warehouse & Logistics")).toBeInTheDocument();
    expect(screen.getByText("General Trade")).toBeInTheDocument();
    expect(screen.getByText("Modern Trade")).toBeInTheDocument();
    expect(screen.queryByText(/^export$/i)).toBeNull();
    expect(screen.queryByText(/import & export/i)).toBeNull();
  });

  it("renders 01 / 02 / 03 numerals", () => {
    render(<WhatWeDoSpread />);
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("03")).toBeInTheDocument();
  });

  it("renders the GT signature stat including 180,000 outlets", () => {
    render(<WhatWeDoSpread />);
    expect(screen.getByText(/180,000 outlets/i)).toBeInTheDocument();
  });

  it("renders the Logistics signature stat naming both DCs", () => {
    render(<WhatWeDoSpread />);
    expect(screen.getByText(/long an/i)).toBeInTheDocument();
    expect(screen.getByText(/hanoi/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
bun run test:unit -- __tests__/sections/v2/what-we-do-spread.test.tsx
```

Expected: failures all caused by missing module.

- [ ] **Step 3: Implement `WhatWeDoSpread`**

Create `app/_components/v2/what-we-do-spread.tsx`:

```tsx
import { pillars } from "@/content/en/capabilities";

const SIGNATURE_STATS: Record<string, string> = {
  "Warehouse & Logistics": "TWO DCS · LONG AN · HANOI",
  "General Trade": "180,000 OUTLETS · 800+ SALESMEN",
  "Modern Trade": "EVERY CHAIN IN VIETNAM",
};

export function WhatWeDoSpread() {
  return (
    <div
      id="what"
      className="v2-display mx-auto w-full max-w-[1500px] px-6 py-[clamp(80px,11vw,160px)] sm:px-10 lg:px-12"
    >
      <div className="v2-mono v2-size-folio mb-8 flex items-center gap-6 opacity-60">
        <span>RICHFIELD WORLDWIDE JSC · ISSUE 30</span>
        <span aria-hidden className="v2-rule flex-1" />
        <span>PAGES 04—05 · STORY 02</span>
      </div>

      <p className="v2-mono v2-size-eyebrow mb-5 flex items-center gap-3 text-gold">
        <span aria-hidden className="inline-block h-px w-8 bg-gold/70" />
        STORY 02 · WHAT WE DO
      </p>
      <h2 className="v2-italic v2-size-feature mb-16 max-w-[22ch] text-balance">
        Three ways we move brands to market.
      </h2>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
        {pillars.map((p) => (
          <article key={p.number} className="flex flex-col gap-5 border-t border-current/15 pt-6">
            <span className="v2-italic text-[clamp(2.2rem,3.4vw,3rem)] leading-none text-gold">
              {p.number}
            </span>
            <h3 className="v2-display text-[clamp(1.4rem,2vw,1.9rem)] leading-tight tracking-[-0.02em]">
              {p.name}
            </h3>
            <p className="v2-size-body max-w-[42ch] opacity-80">{p.longBody}</p>
            <p className="v2-mono v2-size-folio mt-auto pt-4 opacity-70">
              <span aria-hidden className="v2-rule-gold mr-3 inline-block w-6 align-middle" />
              {SIGNATURE_STATS[p.name]}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
bun run test:unit -- __tests__/sections/v2/what-we-do-spread.test.tsx
```

Expected: all 5 tests pass.

- [ ] **Step 5: Lint + typecheck**

```bash
bun run lint && bun run typecheck
```

Expected: clean.

- [ ] **Step 6: Commit**

```bash
git add app/_components/v2/what-we-do-spread.tsx __tests__/sections/v2/what-we-do-spread.test.tsx
git commit -m "feat(v2): add What We Do spread for §02"
```

---

## Task 5: Field Atlas spread

**Why:** §03 with the map and the three offices (Vietnam 1,000+, Malaysia 150, China 50). Highlight "three" twice. Drop the v1 last sentence.

**Files:**
- Create: `app/_components/v2/field-atlas-spread.tsx`
- Create: `__tests__/sections/v2/field-atlas-spread.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `__tests__/sections/v2/field-atlas-spread.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FieldAtlasSpread } from "@/app/_components/v2/field-atlas-spread";

describe("<FieldAtlasSpread>", () => {
  it("renders the eyebrow and headline", () => {
    render(<FieldAtlasSpread />);
    expect(screen.getByText(/story 03 · the footprint/i)).toBeInTheDocument();
    expect(screen.getByText(/international group/i)).toBeInTheDocument();
  });

  it("renders the word 'three' twice in the headline as <em> with gold accent class", () => {
    const { container } = render(<FieldAtlasSpread />);
    const ems = Array.from(container.querySelectorAll("em")).filter(
      (e) => e.textContent?.trim().toLowerCase() === "three",
    );
    expect(ems).toHaveLength(2);
    for (const em of ems) {
      expect(em.className).toMatch(/gold/i);
    }
  });

  it("renders the three country labels with their headcounts", () => {
    render(<FieldAtlasSpread />);
    expect(screen.getByText("Vietnam")).toBeInTheDocument();
    expect(screen.getByText("Malaysia")).toBeInTheDocument();
    expect(screen.getByText("China")).toBeInTheDocument();
    expect(screen.getByText("1,000+")).toBeInTheDocument();
    expect(screen.getByText("150")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
  });

  it("notes 'and growing' next to Vietnam", () => {
    render(<FieldAtlasSpread />);
    expect(screen.getByText(/and growing/i)).toBeInTheDocument();
  });

  it("does not render the deprecated 'Vietnam, Malaysia, and China together form one operating Group' sentence", () => {
    render(<FieldAtlasSpread />);
    expect(
      screen.queryByText(
        /vietnam, malaysia, and china together form one operating group/i,
      ),
    ).toBeNull();
  });

  it("renders a map figure with the three pins as <ul>/<li> for accessibility", () => {
    render(<FieldAtlasSpread />);
    const list = screen.getByRole("list", { name: /offices/i });
    expect(list).toBeInTheDocument();
    expect(list.querySelectorAll("li")).toHaveLength(3);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
bun run test:unit -- __tests__/sections/v2/field-atlas-spread.test.tsx
```

Expected: 6 failures, all from missing module.

- [ ] **Step 3: Implement `FieldAtlasSpread`**

Create `app/_components/v2/field-atlas-spread.tsx`:

```tsx
"use client";

type Country = {
  code: string;
  label: string;
  headcount: string;
  note: string;
  anchor: { left: string; top: string };
  align: "left" | "right";
};

const COUNTRIES: Country[] = [
  {
    code: "CN",
    label: "China",
    headcount: "50",
    note: "Sourcing and Brands",
    anchor: { left: "62%", top: "16%" },
    align: "right",
  },
  {
    code: "VN",
    label: "Vietnam",
    headcount: "1,000+",
    note: "HQ and growing",
    anchor: { left: "55%", top: "50%" },
    align: "right",
  },
  {
    code: "MY",
    label: "Malaysia",
    headcount: "150",
    note: "Origin · 1990s",
    anchor: { left: "30%", top: "82%" },
    align: "left",
  },
];

export function FieldAtlasSpread() {
  return (
    <div
      id="atlas"
      className="v2-display mx-auto w-full max-w-[1500px] px-6 py-[clamp(80px,11vw,160px)] sm:px-10 lg:px-12"
    >
      <div className="v2-mono v2-size-folio mb-8 flex items-center gap-6 opacity-60">
        <span>RICHFIELD WORLDWIDE JSC · ISSUE 30</span>
        <span aria-hidden className="v2-rule flex-1" />
        <span>PAGES 06—07 · STORY 03</span>
      </div>

      <div className="grid grid-cols-12 gap-10 lg:gap-16">
        <div className="col-span-12 lg:col-span-5">
          <p className="v2-mono v2-size-eyebrow mb-5 flex items-center gap-3 text-gold-strong">
            <span aria-hidden className="inline-block h-px w-8 bg-gold-rule" />
            STORY 03 · THE FOOTPRINT
          </p>
          <h2 className="v2-italic v2-size-feature mb-8 max-w-[20ch] text-balance">
            An international group with deep local roots.{" "}
            <em className="text-gold-strong">three</em> countries,{" "}
            <em className="text-gold-strong">three</em> generations.
          </h2>
          <p className="v2-size-body max-w-[48ch] opacity-80">
            International scale meets hands-on knowledge of every market we serve.
          </p>

          <ul
            aria-label="Offices and headcounts"
            className="mt-10 flex flex-col"
          >
            {COUNTRIES.map((c) => (
              <li key={c.code} className="border-t border-current/15 py-5">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="v2-italic text-[clamp(1.6rem,2.2vw,2rem)] leading-none">
                    {c.label}
                  </span>
                  <span className="flex items-baseline gap-2">
                    <span className="v2-display text-[clamp(1.4rem,1.9vw,1.8rem)] leading-none">
                      {c.headcount}
                    </span>
                    <span className="v2-mono v2-size-folio opacity-60">team</span>
                  </span>
                </div>
                <p className="v2-mono v2-size-folio mt-2 opacity-60">{c.note}</p>
              </li>
            ))}
          </ul>
        </div>

        <figure
          aria-label="Diagram of Richfield's three operating countries: China, Vietnam, Malaysia"
          className="col-span-12 lg:col-span-7"
        >
          <div className="relative aspect-[16/11] w-full overflow-hidden rounded-sm border border-current/10">
            <svg
              aria-hidden
              viewBox="0 0 1600 1100"
              className="absolute inset-0 h-full w-full"
            >
              <defs>
                <pattern
                  id="v2-atlas-dots"
                  x="0"
                  y="0"
                  width="28"
                  height="28"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="2" cy="2" r="1.2" fill="currentColor" className="text-current opacity-20" />
                </pattern>
              </defs>
              <rect width="1600" height="1100" fill="url(#v2-atlas-dots)" />
              <path
                d="M 990 220 Q 720 350 870 540"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="3 8"
                className="text-gold-strong"
              />
              <path
                d="M 870 540 Q 600 740 480 900"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="3 8"
                className="text-gold-strong"
              />
            </svg>
            {COUNTRIES.map((c) => (
              <FieldAtlasPin key={c.code} country={c} />
            ))}
          </div>
        </figure>
      </div>
    </div>
  );
}

function FieldAtlasPin({ country }: { country: Country }) {
  const isRight = country.align === "right";
  return (
    <div
      style={{
        left: country.anchor.left,
        top: country.anchor.top,
        transform: "translate(-50%, -50%)",
      }}
      className="absolute flex items-center gap-3"
    >
      <span className="relative inline-flex h-3 w-3">
        <span aria-hidden className="absolute inset-0 rounded-full bg-gold/50 motion-safe:animate-ping" />
        <span aria-hidden className="relative inline-flex h-full w-full rounded-full bg-gold ring-2 ring-current/10" />
      </span>
      <div className={`flex flex-col gap-1 ${isRight ? "items-start" : "items-end"}`}>
        <span className="v2-italic text-[clamp(1.4rem,1.9vw,1.8rem)] leading-none">
          {country.label}
        </span>
        <span className="v2-mono v2-size-folio opacity-70">
          {country.headcount} TEAM
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
bun run test:unit -- __tests__/sections/v2/field-atlas-spread.test.tsx
```

Expected: all 6 tests pass.

- [ ] **Step 5: Lint + typecheck**

```bash
bun run lint && bun run typecheck
```

Expected: clean.

- [ ] **Step 6: Commit**

```bash
git add app/_components/v2/field-atlas-spread.tsx __tests__/sections/v2/field-atlas-spread.test.tsx
git commit -m "feat(v2): add Field Atlas spread for §03"
```

---

## Task 6: ProductMarquee primitive

**Why:** Each Directory category needs a horizontal motion-safe ticker of product photos beneath the logo strip. Reused 3 times in Task 7. Build it standalone first so it has its own focused tests.

**Files:**
- Create: `app/_components/v2/product-marquee.tsx`
- Create: `__tests__/sections/v2/product-marquee.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `__tests__/sections/v2/product-marquee.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductMarquee } from "@/app/_components/v2/product-marquee";

const SAMPLE = [
  { src: "/photos/products/a.webp", name: "Item A", alt: "Item A photo" },
  { src: "/photos/products/b.webp", name: "Item B", alt: "Item B photo" },
  { src: "/photos/products/c.webp", name: "Item C", alt: "Item C photo" },
];

describe("<ProductMarquee>", () => {
  it("renders an image for each item provided, with the alt as accessible name", () => {
    render(<ProductMarquee items={SAMPLE} ariaLabel="Sample marquee" />);
    expect(screen.getByRole("img", { name: "Item A photo" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Item B photo" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Item C photo" })).toBeInTheDocument();
  });

  it("renders item names as captions", () => {
    render(<ProductMarquee items={SAMPLE} ariaLabel="Sample marquee" />);
    expect(screen.getByText("Item A")).toBeInTheDocument();
    expect(screen.getByText("Item B")).toBeInTheDocument();
    expect(screen.getByText("Item C")).toBeInTheDocument();
  });

  it("applies the marquee animation class to the track", () => {
    const { container } = render(
      <ProductMarquee items={SAMPLE} ariaLabel="Sample marquee" />,
    );
    const track = container.querySelector('[data-testid="marquee-track"]');
    expect(track).not.toBeNull();
    expect(track?.className).toContain("marquee-track");
  });

  it("duplicates the item list inside the track so the loop is seamless", () => {
    const { container } = render(
      <ProductMarquee items={SAMPLE} ariaLabel="Sample marquee" />,
    );
    expect(container.querySelectorAll("img")).toHaveLength(SAMPLE.length * 2);
  });

  it("exposes the marquee as a labelled region", () => {
    render(<ProductMarquee items={SAMPLE} ariaLabel="Food products" />);
    expect(
      screen.getByRole("region", { name: /food products/i }),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
bun run test:unit -- __tests__/sections/v2/product-marquee.test.tsx
```

Expected: 5 failures from missing module.

- [ ] **Step 3: Implement `ProductMarquee`**

Create `app/_components/v2/product-marquee.tsx`:

```tsx
import Image from "next/image";

export type MarqueeItem = {
  src: string;
  name: string;
  alt: string;
};

type Props = {
  items: MarqueeItem[];
  ariaLabel: string;
  /** Animation duration in seconds. Defaults to 60s. */
  durationSeconds?: number;
};

export function ProductMarquee({ items, ariaLabel, durationSeconds = 60 }: Props) {
  const doubled = [...items, ...items];
  return (
    <section
      aria-label={ariaLabel}
      className="relative w-full overflow-hidden"
    >
      <div
        data-testid="marquee-track"
        className="marquee-track marquee-track--left flex w-max items-end gap-6 py-2"
        style={{ ["--marquee-duration" as string]: `${durationSeconds}s` }}
      >
        {doubled.map((item, i) => (
          <figure
            key={`${item.src}-${i}`}
            className="flex w-[clamp(160px,18vw,220px)] shrink-0 flex-col gap-2 rounded-sm bg-current/[0.03] p-3"
          >
            <div className="relative aspect-square w-full overflow-hidden">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="220px"
                className="object-contain"
              />
            </div>
            <figcaption className="v2-mono v2-size-folio truncate opacity-70">
              {item.name}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
bun run test:unit -- __tests__/sections/v2/product-marquee.test.tsx
```

Expected: all 5 tests pass.

- [ ] **Step 5: Lint + typecheck**

```bash
bun run lint && bun run typecheck
```

Expected: clean.

- [ ] **Step 6: Commit**

```bash
git add app/_components/v2/product-marquee.tsx __tests__/sections/v2/product-marquee.test.tsx
git commit -m "feat(v2): add ProductMarquee primitive"
```

---

## Task 7: Directory spread

**Why:** §04 — the brands by category. Three category bands (Food / Beverages / Non-Food) with logos and a `ProductMarquee` under each. Per spec open question #1, AMOS gummy photos do not exist yet — for now the AMOS row uses its logo and the existing AMOS art-supply photos as fallback product imagery (still falls under "AMOS" caption). A note in the implementation comments will flag this. Customer can replace the assets later without code change.

**Files:**
- Create: `app/_components/v2/directory-spread.tsx`
- Create: `__tests__/sections/v2/directory-spread.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `__tests__/sections/v2/directory-spread.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DirectorySpread } from "@/app/_components/v2/directory-spread";

describe("<DirectorySpread>", () => {
  it("renders the section eyebrow and headline", () => {
    render(<DirectorySpread />);
    expect(screen.getByText(/story 04 · the directory/i)).toBeInTheDocument();
    expect(screen.getByText(/the brands we carry/i)).toBeInTheDocument();
  });

  it("renders all three category headings", () => {
    render(<DirectorySpread />);
    expect(screen.getByRole("heading", { name: /^food$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^beverages$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^non-food$/i })).toBeInTheDocument();
  });

  it("labels each band as 01 / 03, 02 / 03, 03 / 03", () => {
    render(<DirectorySpread />);
    expect(screen.getByText(/food · 01 \/ 03/i)).toBeInTheDocument();
    expect(screen.getByText(/beverages · 02 \/ 03/i)).toBeInTheDocument();
    expect(screen.getByText(/non-food · 03 \/ 03/i)).toBeInTheDocument();
  });

  it("renders Food category logos: Mars · Wrigley, Glico, NewChoice, AMOS, Wei Long", () => {
    render(<DirectorySpread />);
    const foodRegion = screen.getByRole("region", { name: /food brands/i });
    expect(foodRegion).toBeInTheDocument();
    for (const name of ["Mars · Wrigley", "Glico", "NewChoice", "AMOS", "Wei Long"]) {
      expect(foodRegion.querySelector(`img[alt="${name}"]`)).not.toBeNull();
    }
  });

  it("renders Beverages logos: Red Bull, Warrior", () => {
    render(<DirectorySpread />);
    const region = screen.getByRole("region", { name: /beverage brands/i });
    expect(region.querySelector('img[alt="Red Bull"]')).not.toBeNull();
    expect(region.querySelector('img[alt="Warrior"]')).not.toBeNull();
  });

  it("renders Non-Food logos: BiC, Caretex", () => {
    render(<DirectorySpread />);
    const region = screen.getByRole("region", { name: /non-food brands/i });
    expect(region.querySelector('img[alt="BiC"]')).not.toBeNull();
    expect(region.querySelector('img[alt="Caretex"]')).not.toBeNull();
  });

  it("does NOT render an Export band", () => {
    render(<DirectorySpread />);
    expect(screen.queryByRole("heading", { name: /^export$/i })).toBeNull();
  });

  it("renders a product marquee per category (3 total)", () => {
    render(<DirectorySpread />);
    expect(screen.getByRole("region", { name: /food products/i })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: /beverage products/i })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: /non-food products/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
bun run test:unit -- __tests__/sections/v2/directory-spread.test.tsx
```

Expected: 8 failures from missing module.

- [ ] **Step 3: Implement `DirectorySpread`**

Create `app/_components/v2/directory-spread.tsx`:

```tsx
import Image from "next/image";
import { brands, type BrandCategory } from "@/content/en/brands";
import {
  productPhotos,
  type ProductPhoto,
} from "@/content/en/photography";
import { ProductMarquee, type MarqueeItem } from "@/app/_components/v2/product-marquee";

type Band = {
  category: BrandCategory;
  number: string;
  brandNames: string[];
  brandRegionLabel: string;
  productRegionLabel: string;
};

const BANDS: Band[] = [
  {
    category: "Food",
    number: "01 / 03",
    brandNames: ["Mars · Wrigley", "Glico", "NewChoice", "AMOS", "Wei Long"],
    brandRegionLabel: "Food brands",
    productRegionLabel: "Food products",
  },
  {
    category: "Beverages",
    number: "02 / 03",
    brandNames: ["Red Bull", "Warrior"],
    brandRegionLabel: "Beverage brands",
    productRegionLabel: "Beverage products",
  },
  {
    category: "Non-Food",
    number: "03 / 03",
    brandNames: ["BiC", "Caretex"],
    brandRegionLabel: "Non-Food brands",
    productRegionLabel: "Non-Food products",
  },
];

function productsForBand(brandNames: string[]): MarqueeItem[] {
  const items: MarqueeItem[] = [];
  for (const name of brandNames) {
    const list: ProductPhoto[] = productPhotos[name] ?? [];
    for (const p of list) {
      items.push({ src: p.src, name: `${name} · ${p.name}`, alt: p.alt });
    }
  }
  return items;
}

export function DirectorySpread() {
  return (
    <div
      id="brands"
      className="v2-display mx-auto w-full max-w-[1500px] px-6 py-[clamp(80px,11vw,160px)] sm:px-10 lg:px-12"
    >
      <div className="v2-mono v2-size-folio mb-8 flex items-center gap-6 opacity-60">
        <span>RICHFIELD WORLDWIDE JSC · ISSUE 30</span>
        <span aria-hidden className="v2-rule flex-1" />
        <span>PAGES 08—11 · STORY 04</span>
      </div>

      <p className="v2-mono v2-size-eyebrow mb-5 flex items-center gap-3 text-gold-strong">
        <span aria-hidden className="inline-block h-px w-8 bg-gold-rule" />
        STORY 04 · THE DIRECTORY
      </p>
      <h2 className="v2-italic v2-size-feature mb-16 max-w-[22ch] text-balance">
        The brands we carry.
      </h2>

      <div className="flex flex-col gap-[clamp(48px,7vw,96px)]">
        {BANDS.map((band) => (
          <DirectoryBand key={band.category} band={band} />
        ))}
      </div>
    </div>
  );
}

function DirectoryBand({ band }: { band: Band }) {
  const bandBrands = brands.filter((b) => band.brandNames.includes(b.name));
  const products = productsForBand(band.brandNames);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-baseline gap-4">
        <span aria-hidden className="h-px flex-1 bg-gold-rule/60" />
        <span className="v2-mono v2-size-eyebrow text-gold-strong">
          {band.category.toUpperCase()} · {band.number}
        </span>
      </div>

      <h3 className="v2-italic text-[clamp(3rem,8vw,7rem)] leading-none">
        {band.category}
      </h3>

      <section
        aria-label={band.brandRegionLabel}
        className="flex flex-wrap items-center gap-x-10 gap-y-6 border-t border-current/15 pt-6"
      >
        {bandBrands.map((b) =>
          b.logoSrc ? (
            <div key={b.name} className="relative h-10 w-[clamp(80px,10vw,140px)]">
              <Image
                src={b.logoSrc}
                alt={b.name}
                fill
                sizes="140px"
                className="object-contain"
                style={{ filter: "grayscale(1) contrast(1.1)" }}
              />
            </div>
          ) : (
            <span key={b.name} className="v2-display text-[clamp(1rem,1.4vw,1.2rem)]">
              {b.name}
            </span>
          ),
        )}
      </section>

      {products.length > 0 ? (
        <ProductMarquee items={products} ariaLabel={band.productRegionLabel} />
      ) : (
        <p
          role="region"
          aria-label={band.productRegionLabel}
          className="v2-mono v2-size-folio opacity-60"
        >
          PRODUCT PHOTOGRAPHY · UPDATING
        </p>
      )}
    </section>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
bun run test:unit -- __tests__/sections/v2/directory-spread.test.tsx
```

Expected: all 8 tests pass.

- [ ] **Step 5: Lint + typecheck**

```bash
bun run lint && bun run typecheck
```

Expected: clean.

- [ ] **Step 6: Commit**

```bash
git add app/_components/v2/directory-spread.tsx __tests__/sections/v2/directory-spread.test.tsx
git commit -m "feat(v2): add Directory spread with three category bands for §04"
```

---

## Task 8: Joint Venture spread

**Why:** §05 — extract the inline JVSpread from `app/v2/page.tsx` into its own file, add the Dory Rich logo + outbound link to `site.external.doryRich`.

**Files:**
- Create: `app/_components/v2/joint-venture-spread.tsx`
- Create: `__tests__/sections/v2/joint-venture-spread.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `__tests__/sections/v2/joint-venture-spread.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { JointVentureSpread } from "@/app/_components/v2/joint-venture-spread";

describe("<JointVentureSpread>", () => {
  it("renders the eyebrow and italic headline", () => {
    render(<JointVentureSpread />);
    expect(
      screen.getByText(/story 05 · the joint venture/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/dory rich .{0,4}where distribution becomes manufacturing/i),
    ).toBeInTheDocument();
  });

  it("renders the body that names the 2024 JV with TCP", () => {
    render(<JointVentureSpread />);
    expect(
      screen.getByText(/in 2024, richfield and tcp formed dory rich jsc/i),
    ).toBeInTheDocument();
  });

  it("renders an outbound link to doryrich.com.vn", () => {
    render(<JointVentureSpread />);
    const link = screen.getByRole("link", { name: /doryrich/i });
    expect(link).toHaveAttribute("href", "https://doryrich.com.vn");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringMatching(/noopener/i));
  });

  it("renders the Dory Rich logo", () => {
    render(<JointVentureSpread />);
    expect(
      screen.getByRole("img", { name: /dory rich/i }),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
bun run test:unit -- __tests__/sections/v2/joint-venture-spread.test.tsx
```

Expected: 4 failures from missing module.

- [ ] **Step 3: Implement `JointVentureSpread`**

Create `app/_components/v2/joint-venture-spread.tsx`:

```tsx
import Image from "next/image";
import { partnerLogos } from "@/content/en/photography";
import { site } from "@/content/en/site";

export function JointVentureSpread() {
  const logo = partnerLogos["Dory Rich"];
  return (
    <div
      id="jv"
      className="v2-display mx-auto w-full max-w-[1500px] px-6 py-[clamp(80px,11vw,160px)] sm:px-10 lg:px-12"
    >
      <div className="v2-mono v2-size-folio mb-8 flex items-center gap-6 opacity-60">
        <span>RICHFIELD WORLDWIDE JSC · ISSUE 30</span>
        <span aria-hidden className="v2-rule flex-1" />
        <span>PAGES 12—13 · STORY 05</span>
      </div>

      <div className="grid grid-cols-12 gap-10 lg:gap-16">
        <div className="col-span-12 lg:col-span-7">
          <p className="v2-mono v2-size-eyebrow mb-5 flex items-center gap-3 text-gold">
            <span aria-hidden className="inline-block h-px w-8 bg-gold/70" />
            STORY 05 · THE JOINT VENTURE
          </p>
          <h2 className="v2-italic v2-size-feature mb-8 max-w-[22ch] text-balance">
            Dory Rich. Where distribution becomes manufacturing.
          </h2>
          <p className="v2-size-body max-w-[52ch] opacity-85">
            In 2024, Richfield and TCP formed Dory Rich JSC. A joint venture that brings manufacturing under the same umbrella that already carries the brands. One relationship, end to end.
          </p>
        </div>

        <div className="col-span-12 lg:col-span-5 lg:pt-2">
          <div className="rounded-sm border border-current/15 bg-current/[0.04] p-6">
            {logo ? (
              <div className="relative mb-6 h-16 w-[clamp(120px,16vw,200px)]">
                <Image
                  src={logo}
                  alt="Dory Rich"
                  fill
                  sizes="200px"
                  className="object-contain object-left"
                />
              </div>
            ) : null}
            <a
              href={site.external.doryRich}
              target="_blank"
              rel="noopener noreferrer"
              className="v2-mono v2-size-folio inline-flex items-center gap-3 text-gold transition-opacity hover:opacity-70"
            >
              <span aria-hidden className="v2-rule-gold inline-block w-6" />
              VISIT DORYRICH.COM.VN
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
bun run test:unit -- __tests__/sections/v2/joint-venture-spread.test.tsx
```

Expected: all 4 tests pass.

- [ ] **Step 5: Lint + typecheck**

```bash
bun run lint && bun run typecheck
```

Expected: clean.

- [ ] **Step 6: Commit**

```bash
git add app/_components/v2/joint-venture-spread.tsx __tests__/sections/v2/joint-venture-spread.test.tsx
git commit -m "feat(v2): add Joint Venture spread for §05"
```

---

## Task 9: Colophon spread

**Why:** §06 — the closer. "Established 1994" is the visual climax. Pulls footer details from `site.ts`.

**Files:**
- Create: `app/_components/v2/colophon-spread.tsx`
- Create: `__tests__/sections/v2/colophon-spread.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `__tests__/sections/v2/colophon-spread.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ColophonSpread } from "@/app/_components/v2/colophon-spread";

describe("<ColophonSpread>", () => {
  it("renders 'Established' italic eyebrow and 1994 as the display climax", () => {
    render(<ColophonSpread />);
    expect(screen.getByText(/established/i)).toBeInTheDocument();
    const climax = screen.getByText(/^1994\.?$/);
    expect(climax).toBeInTheDocument();
    expect(climax.className).toMatch(/v2-size-cover/);
  });

  it("renders the three-country sub-line", () => {
    render(<ColophonSpread />);
    expect(
      screen.getByText(/vietnam · malaysia · china · thirty years/i),
    ).toBeInTheDocument();
  });

  it("renders the office address from site.ts", () => {
    render(<ColophonSpread />);
    expect(
      screen.getByText(/15a1 nguyễn hữu thọ/i),
    ).toBeInTheDocument();
  });

  it("renders office phone and hotline", () => {
    render(<ColophonSpread />);
    expect(screen.getByText(/3784 0237/)).toBeInTheDocument();
    expect(screen.getByText(/0917 331 132/)).toBeInTheDocument();
  });

  it("renders email and a Facebook link", () => {
    render(<ColophonSpread />);
    expect(screen.getByText(/cskh@richfieldvn\.com\.vn/i)).toBeInTheDocument();
    const fb = screen.getByRole("link", { name: /facebook/i });
    expect(fb).toHaveAttribute("href", "https://www.facebook.com/RichFieldGroup");
  });

  it("renders the colophon footer rule", () => {
    render(<ColophonSpread />);
    expect(
      screen.getByText(
        /colophon · issue 30 — richfield worldwide jsc · 1994 — 2026 · next issue · 2031/i,
      ),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
bun run test:unit -- __tests__/sections/v2/colophon-spread.test.tsx
```

Expected: 6 failures from missing module.

- [ ] **Step 3: Implement `ColophonSpread`**

Create `app/_components/v2/colophon-spread.tsx`:

```tsx
import { site } from "@/content/en/site";

export function ColophonSpread() {
  return (
    <div
      id="colophon"
      className="v2-display mx-auto w-full max-w-[1500px] px-6 py-[clamp(96px,13vw,180px)] sm:px-10 lg:px-12"
    >
      <div className="v2-mono v2-size-folio mb-12 flex items-center gap-6 opacity-60">
        <span>RICHFIELD WORLDWIDE JSC · ISSUE 30</span>
        <span aria-hidden className="v2-rule flex-1" />
        <span>PAGE 14 · COLOPHON</span>
      </div>

      <div className="mb-16 flex flex-col gap-2">
        <p className="v2-italic text-[clamp(1.6rem,2.4vw,2.4rem)] leading-none opacity-80">
          Established
        </p>
        <p className="v2-display v2-size-cover">1994.</p>
        <p className="v2-mono v2-size-folio mt-6 opacity-70">
          VIETNAM · MALAYSIA · CHINA · THIRTY YEARS
        </p>
      </div>

      <dl className="grid grid-cols-1 gap-8 border-t border-current/15 pt-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="v2-mono v2-size-folio opacity-60">OFFICE</dt>
          <dd className="v2-size-body mt-2 max-w-[28ch]">
            {site.address.line1}
            <br />
            {site.address.line2}
          </dd>
        </div>
        <div>
          <dt className="v2-mono v2-size-folio opacity-60">TELEPHONE</dt>
          <dd className="v2-size-body mt-2">
            <a className="hover:opacity-70" href={`tel:${site.phones.officeTel}`}>
              {site.phones.office}
            </a>
            <br />
            <a className="hover:opacity-70" href={`tel:${site.phones.hotlineTel}`}>
              Hotline · {site.phones.hotline}
            </a>
          </dd>
        </div>
        <div>
          <dt className="v2-mono v2-size-folio opacity-60">EMAIL</dt>
          <dd className="v2-size-body mt-2">
            <a className="hover:opacity-70" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </dd>
        </div>
        <div>
          <dt className="v2-mono v2-size-folio opacity-60">SOCIAL</dt>
          <dd className="v2-size-body mt-2">
            <a
              href={site.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70"
            >
              Facebook
            </a>
          </dd>
        </div>
      </dl>

      <p className="v2-mono v2-size-folio mt-16 opacity-60">
        <span aria-hidden className="v2-rule-gold mr-3 inline-block w-8 align-middle" />
        COLOPHON · ISSUE 30 — RICHFIELD WORLDWIDE JSC · 1994 — 2026 · NEXT ISSUE · 2031
      </p>
    </div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
bun run test:unit -- __tests__/sections/v2/colophon-spread.test.tsx
```

Expected: all 6 tests pass.

- [ ] **Step 5: Lint + typecheck**

```bash
bun run lint && bun run typecheck
```

Expected: clean.

- [ ] **Step 6: Commit**

```bash
git add app/_components/v2/colophon-spread.tsx __tests__/sections/v2/colophon-spread.test.tsx
git commit -m "feat(v2): add Colophon spread for §06"
```

---

## Task 10: VerticalTOC labels + active-section tracking

**Why:** The TOC's 6 default entries need to match the new section IDs and labels. Add an active-section tracker that underlines the in-view entry as the user scrolls. The TOC is desktop-only (existing behavior).

**Files:**
- Modify: `app/_components/v2/vertical-toc.tsx`
- Create: `__tests__/sections/v2/vertical-toc.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `__tests__/sections/v2/vertical-toc.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { VerticalTOC } from "@/app/_components/v2/vertical-toc";

describe("<VerticalTOC>", () => {
  it("renders six entries by default with the new labels", () => {
    render(<VerticalTOC />);
    expect(screen.getByText(/the lead/i)).toBeInTheDocument();
    expect(screen.getByText(/what we do/i)).toBeInTheDocument();
    expect(screen.getByText(/field atlas/i)).toBeInTheDocument();
    expect(screen.getByText(/the directory/i)).toBeInTheDocument();
    expect(screen.getByText(/joint venture/i)).toBeInTheDocument();
    expect(screen.getByText(/colophon/i)).toBeInTheDocument();
  });

  it("uses the section-id anchors matching the new spread IDs", () => {
    render(<VerticalTOC />);
    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs).toEqual([
      "#lead",
      "#what",
      "#atlas",
      "#brands",
      "#jv",
      "#colophon",
    ]);
  });

  it("marks the currently-active entry with aria-current", () => {
    render(<VerticalTOC activeId="atlas" />);
    const active = screen.getByRole("link", { current: "location" });
    expect(active).toHaveAttribute("href", "#atlas");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
bun run test:unit -- __tests__/sections/v2/vertical-toc.test.tsx
```

Expected: failures around the new labels ("The Joint Venture" vs current "Dory Rich") and around `activeId` / `aria-current` being unknown.

- [ ] **Step 3: Update `VerticalTOC`**

Replace `app/_components/v2/vertical-toc.tsx` with:

```tsx
type TocEntry = {
  no: string;
  href: string;
  label: string;
  id: string;
};

const DEFAULT_TOC: TocEntry[] = [
  { no: "01", id: "lead",     href: "#lead",     label: "The Lead" },
  { no: "02", id: "what",     href: "#what",     label: "What We Do" },
  { no: "03", id: "atlas",    href: "#atlas",    label: "Field Atlas" },
  { no: "04", id: "brands",   href: "#brands",   label: "The Directory" },
  { no: "05", id: "jv",       href: "#jv",       label: "Joint Venture" },
  { no: "06", id: "colophon", href: "#colophon", label: "Colophon" },
];

type Props = {
  entries?: TocEntry[];
  className?: string;
  /** ID of the currently in-view section; matches a TocEntry.id. */
  activeId?: string;
};

export function VerticalTOC({
  entries = DEFAULT_TOC,
  className = "",
  activeId,
}: Props) {
  return (
    <nav
      aria-label="Issue contents"
      className={`v2-mono v2-size-folio flex w-full flex-col gap-3 ${className}`}
    >
      <span className="opacity-50">CONTENTS</span>
      <span aria-hidden className="v2-rule" />
      <ol className="flex flex-col gap-2">
        {entries.map((e) => {
          const isActive = activeId === e.id;
          return (
            <li key={e.no} className="flex items-baseline gap-3">
              <span className="opacity-50">{e.no}</span>
              <a
                href={e.href}
                aria-current={isActive ? "location" : undefined}
                className={`transition-opacity duration-200 ${isActive ? "opacity-100" : "opacity-70 hover:opacity-100"}`}
              >
                <span className={isActive ? "border-b-2 border-gold-strong pb-1" : ""}>
                  {e.label}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
bun run test:unit -- __tests__/sections/v2/vertical-toc.test.tsx
```

Expected: all 3 tests pass.

- [ ] **Step 5: Lint + typecheck**

```bash
bun run lint && bun run typecheck
```

Expected: clean.

- [ ] **Step 6: Commit**

```bash
git add app/_components/v2/vertical-toc.tsx __tests__/sections/v2/vertical-toc.test.tsx
git commit -m "feat(v2): update VerticalTOC labels and add active-section state"
```

---

## Task 11: Wire `/v2/page.tsx` together + Playwright smoke

**Why:** Replace `MagazineCanvas` with `MagazineFlow` in `app/v2/page.tsx` and pass it the six new spreads in order. Then add an E2E spec that hits `/v2` and verifies content from each section is present.

**Files:**
- Modify: `app/v2/page.tsx`
- Create: `e2e/v2.spec.ts`

- [ ] **Step 1: Write the failing E2E spec**

Create `e2e/v2.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("/v2 renders cover + all six sections", async ({ page }) => {
  const response = await page.goto("/v2");
  expect(response?.status()).toBe(200);

  // Cover masthead
  await expect(page.getByText(/issue 30/i).first()).toBeVisible();

  // §01 The Lead
  await expect(page.getByText(/story 01 · about the group/i)).toBeVisible();
  await expect(page.getByText("180,000")).toBeVisible();
  await expect(page.getByText("300+")).toBeVisible();
  await expect(page.getByText("800+")).toBeVisible();
  await expect(page.getByText(/by the numbers · vietnam/i)).toBeVisible();

  // §02 What We Do
  await expect(page.getByText(/story 02 · what we do/i)).toBeVisible();
  await expect(page.getByText("Warehouse & Logistics")).toBeVisible();
  await expect(page.getByText("General Trade")).toBeVisible();
  await expect(page.getByText("Modern Trade")).toBeVisible();
  await expect(page.getByText(/^export$/i)).toHaveCount(0);

  // §03 Field Atlas
  await expect(page.getByText(/story 03 · the footprint/i)).toBeVisible();
  await expect(page.getByText("Vietnam").first()).toBeVisible();
  await expect(page.getByText("Malaysia").first()).toBeVisible();
  await expect(page.getByText("China").first()).toBeVisible();
  await expect(page.getByText("1,000+")).toBeVisible();
  await expect(page.getByText("150")).toBeVisible();
  await expect(page.getByText("50")).toBeVisible();

  // §04 The Directory
  await expect(page.getByText(/story 04 · the directory/i)).toBeVisible();
  await expect(page.getByRole("heading", { name: /^food$/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /^beverages$/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /^non-food$/i })).toBeVisible();

  // §05 Joint Venture
  await expect(page.getByText(/story 05 · the joint venture/i)).toBeVisible();
  const doryLink = page.getByRole("link", { name: /doryrich/i });
  await expect(doryLink).toHaveAttribute("href", "https://doryrich.com.vn");

  // §06 Colophon
  await expect(page.getByText(/^1994\.?$/)).toBeVisible();
  await expect(page.getByText(/colophon · issue 30/i)).toBeVisible();
});

test("/v2 has no italicized 'South'", async ({ page }) => {
  await page.goto("/v2");
  const italicSouth = page.locator("em").filter({ hasText: /^south$/i });
  await expect(italicSouth).toHaveCount(0);
});
```

- [ ] **Step 2: Run the E2E spec to verify it fails**

```bash
bun run dev &
DEV_PID=$!
sleep 4
bun run test:e2e -- e2e/v2.spec.ts
RESULT=$?
kill $DEV_PID 2>/dev/null
[ "$RESULT" -ne 0 ] && echo "OK: expected failure"
```

Expected: the spec fails because `/v2` is still the prototype (no §02–§06 content). Confirm failure messages reference the missing section text.

- [ ] **Step 3: Replace `app/v2/page.tsx`**

Replace the file with:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ColophonSpread } from "@/app/_components/v2/colophon-spread";
import { CoverSpread } from "@/app/_components/v2/cover-spread";
import { DirectorySpread } from "@/app/_components/v2/directory-spread";
import { FieldAtlasSpread } from "@/app/_components/v2/field-atlas-spread";
import { JointVentureSpread } from "@/app/_components/v2/joint-venture-spread";
import { LeadSpread } from "@/app/_components/v2/lead-spread";
import { LenisProvider } from "@/app/_components/v2/lenis-provider";
import {
  MagazineFlow,
  MagazineFlowSection,
} from "@/app/_components/v2/magazine-flow";
import { WhatWeDoSpread } from "@/app/_components/v2/what-we-do-spread";

const CREAM = "oklch(0.96 0.018 82)";
const INK = "oklch(0.22 0.015 158)";

export const metadata: Metadata = {
  title: "Richfield · Issue 30 · v2 preview",
  description:
    "Prototype of the Issue 30 · Worldwide editorial direction. Side-by-side comparison with the current homepage at /.",
  robots: { index: false, follow: false },
};

export default function V2HomePage() {
  return (
    <LenisProvider>
      <main className="bg-cream text-ink">
        <Link
          href="/"
          className="v2-mono v2-size-folio fixed left-4 top-4 z-50 rounded-full border border-cream/30 bg-ink/70 px-4 py-2 text-cream backdrop-blur-md transition-colors duration-200 hover:bg-ink/90"
        >
          ← V2 PREVIEW · BACK TO CURRENT
        </Link>

        <CoverSpread />

        <MagazineFlow>
          <MagazineFlowSection bg={CREAM}>
            <LeadSpread />
          </MagazineFlowSection>
          <MagazineFlowSection bg={INK} textOnDark>
            <WhatWeDoSpread />
          </MagazineFlowSection>
          <MagazineFlowSection bg={CREAM}>
            <FieldAtlasSpread />
          </MagazineFlowSection>
          <MagazineFlowSection bg={CREAM}>
            <DirectorySpread />
          </MagazineFlowSection>
          <MagazineFlowSection bg={INK} textOnDark>
            <JointVentureSpread />
          </MagazineFlowSection>
          <MagazineFlowSection bg={CREAM}>
            <ColophonSpread />
          </MagazineFlowSection>
        </MagazineFlow>
      </main>
    </LenisProvider>
  );
}
```

- [ ] **Step 4: Run unit tests to confirm nothing broke**

```bash
bun run test:unit
```

Expected: every Vitest spec passes.

- [ ] **Step 5: Run the E2E spec to verify it now passes**

```bash
bun run dev &
DEV_PID=$!
sleep 4
bun run test:e2e -- e2e/v2.spec.ts
RESULT=$?
kill $DEV_PID 2>/dev/null
exit $RESULT
```

Expected: both E2E tests pass.

- [ ] **Step 6: Lint + typecheck**

```bash
bun run lint && bun run typecheck
```

Expected: clean.

- [ ] **Step 7: Commit**

```bash
git add app/v2/page.tsx e2e/v2.spec.ts
git commit -m "feat(v2): compose homepage via MagazineFlow with six spreads"
```

---

## Task 12: Final audit + production build

**Why:** Confirm the feedback-resolution table from spec §2 is satisfied; do a project-wide check for any italicized "South", any lingering "Export" capability mention in v2, and any reference to the outdated stats. Then run the production build to catch anything the dev server didn't.

**Files:** none (audit + verification only).

- [ ] **Step 1: Search for any italicized 'South' across v2**

```bash
grep -rn '<em>South</em>\|<em>south</em>\|*South*\|*south*' app/_components/v2 app/v2 content/en 2>/dev/null || echo "clean"
```

Expected: prints `clean`. If anything turns up, replace the italic markup with plain text and re-run.

- [ ] **Step 2: Confirm 'Export' is absent from v2-facing code**

```bash
grep -rn 'Export\|export' app/_components/v2 app/v2 2>/dev/null \
  | grep -vE 'export (function|const|default|type|async|interface|\*)' \
  | grep -vE '\.test\.tsx?:' \
  || echo "clean"
```

Expected: prints `clean` (the `grep -v` filters out `export function`/`export const`/etc. — JavaScript exports, not the feature). If a real "Export" capability mention appears, remove it.

- [ ] **Step 3: Confirm outdated stat numbers are gone from v2**

```bash
grep -rn '600,000\|"200+"\|"1,000+"' app/_components/v2 app/v2 2>/dev/null \
  | grep -v 'field-atlas-spread' \
  | grep -v 'colophon-spread' \
  || echo "clean"
```

Expected: prints `clean`. (`1,000+` is allowed in field-atlas/colophon contexts — Vietnam headcount. The filter narrows to other unintended uses.)

- [ ] **Step 4: Run the full unit suite**

```bash
bun run test:unit
```

Expected: all specs pass.

- [ ] **Step 5: Run the E2E suite**

```bash
bun run dev &
DEV_PID=$!
sleep 4
bun run test:e2e
RESULT=$?
kill $DEV_PID 2>/dev/null
exit $RESULT
```

Expected: every Playwright spec — pre-existing v1 routes from `e2e/smoke.spec.ts`, the contact spec, the mobile-drawer spec, and the new `v2.spec.ts` — passes.

- [ ] **Step 6: Production build**

```bash
bun run build
```

Expected: build completes without errors. Warnings about image optimization for any newly-referenced products are acceptable but should be noted in the commit message if present.

- [ ] **Step 7: Manual smoke at `/v2`** (open in a browser)

```bash
bun run dev
```

Walk the page once:
- Cover loads with the carousel
- Scrolling past the cover triggers a soft bg morph into §01 (cream), not a hard cut
- §01 shows the bordered "BY THE NUMBERS · VIETNAM" card with the new numbers
- §02 surface flips to ink; three cards labelled 01/02/03; no Export
- §03 shows the map with three pulsing pins; "three" appears twice in italic gold in the headline
- §04 shows Food / Beverages / Non-Food bands; each has a logo strip and a sliding product marquee
- §05 ink surface, Dory Rich logo + link
- §06 cream surface, **1994** is enormous, footer details from `site.ts`
- The vertical TOC on the right tracks the in-view section (gold underline moves)

If any of the above is wrong, fix in a separate follow-up commit on the same branch — do not rewrite the prior task commits.

- [ ] **Step 8: Final commit if any audit fixes were needed**

If steps 1–3 surfaced any issues that required code changes, commit them:

```bash
git add -p
git commit -m "chore(v2): post-audit cleanup"
```

Otherwise, skip this step.

- [ ] **Step 9: Push the branch**

```bash
git push -u origin feature/v2-content-integration
```

Branch is ready for PR review. Do not merge without human sign-off.

---

## Self-Review (run after writing the plan, before handing off)

**1. Spec coverage:** Every feedback row from spec §2 maps to a task.

| Feedback # | Resolved in |
|---|---|
| 1 (gold pops) | Task 1 (tokens) + Tasks 3, 4, 5, 7 (consumed in spreads) |
| 2 (1994 bigger / headings bigger) | Task 9 (`v2-size-cover` on 1994) + every spread uses `v2-size-feature` |
| 3 (emphasize stats) | Task 3 (bordered stat card) |
| 4 (drop VN-MY-CN from stats) | Task 3 (eyebrow "BY THE NUMBERS · VIETNAM") |
| 5 (add map + headcounts) | Task 5 (`FieldAtlasSpread`) |
| 6 (highlight "three") | Task 5 (em.text-gold-strong, both instances) |
| 7 (drop "Vietnam, Malaysia, and China…" sentence) | Task 5 (test asserts absence) |
| 8 (no Export) | Task 4 (test asserts absence) + Task 12 (audit) |
| 9 (AMOS gummies) | Task 7 (AMOS in Food band — caveat: gummy photos pending, falls back to current AMOS imagery per spec open question #1) |
| 10 (Glico not Pocky) | Task 7 (Glico in Food band logos; brands.ts already correct) |
| 11 (3-cat brand grid, no per-brand feature) | Task 7 (`DirectorySpread` with 3 bands) |
| 12 (visibly separated sections) | Task 2 (`MagazineFlow` with palette flips) |
| 13 (text legibility / no text-on-gradient) | Tasks 3–9 all paint text on solid section surfaces |
| 14 (no italicized "South") | Task 12 audit |

All architecture pieces from spec §3:
- `MagazineFlow` primitive — Task 2 ✓
- LeadSpread updates — Task 3 ✓
- WhatWeDoSpread — Task 4 ✓
- FieldAtlasSpread — Task 5 ✓
- DirectorySpread — Task 7 ✓
- JointVentureSpread — Task 8 ✓
- ColophonSpread — Task 9 ✓
- VerticalTOC updates — Task 10 ✓
- gold-strong/gold-rule tokens — Task 1 ✓
- product-marquee primitive — Task 6 ✓
- v2/page.tsx rewire + E2E — Task 11 ✓
- Final audit — Task 12 ✓

Spec open question #1 (AMOS gummy photos) — explicit in Task 7's "Why" note. Open question #2 (Caretex photos) — Task 7's marquee gracefully handles missing photos (`productPhotos["Caretex"]` is `undefined`, falls back to "PRODUCT PHOTOGRAPHY · UPDATING" label). Open question #3 (TOC tracking variant) — Task 10 implements the `activeId` prop interface; deciding *when* it updates (IntersectionObserver vs scroll math) is left to whoever picks it up downstream — for this iteration the prop exists but `app/v2/page.tsx` doesn't yet pass an `activeId`, so the underline sits inactive. A follow-up plan can add the observer wiring without touching the TOC API.

**2. Placeholder scan:** No `TBD` / `TODO` / `add appropriate X` in the plan. Every code block is complete.

**3. Type consistency:** `MagazineFlow` / `MagazineFlowSection` named identically in Task 2 and Task 11. `LeadSpread` / `WhatWeDoSpread` / `FieldAtlasSpread` / `DirectorySpread` / `JointVentureSpread` / `ColophonSpread` named identically in their definitions and imports in Task 11. `ProductMarquee` props (`items`, `ariaLabel`) consistent between Tasks 6 and 7. `VerticalTOC` `activeId` prop consistent in Task 10 and the type contract.

No gaps found.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-26-v2-content-integration.md`. Two execution options:

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
