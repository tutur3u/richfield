# Richfield Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the production landing page and supporting routes for `richfieldgroup.com.vn` per the approved spec at `docs/superpowers/specs/2026-05-07-richfield-landing-page-design.md`, on the `feature/landing-page` branch.

**Architecture:** Next.js 16.2.4 App Router, RSC by default, Tailwind v4 with OKLCH tokens, Geist (UI) + Playfair Display (display serif) via `next/font/google`, Server Action + Zod for the contact form. Content lives in typed TS modules under `content/en/`. No CMS, no DB. Light theme only. Hand-rolled primitives, no shadcn.

**Tech Stack:** Next.js 16.2.4 · React 19.2.5 · TypeScript 6 · Tailwind CSS v4 · Vitest + React Testing Library · Playwright · Zod · Resend (transactional email).

---

## Pre-Implementation Reading (mandatory)

Per `AGENTS.md`: Next.js 16 has breaking changes versus older training data. Before writing any code, the engineer must read:

- `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md` — `params`/`searchParams` are now `Promise`s; `PageProps`/`LayoutProps` are global helpers (no import).
- `node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md` — `next/font/google` API.
- `node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md` — Server Functions / Server Actions.
- `node_modules/next/dist/docs/01-app/02-guides/forms.md` — `useActionState` for form pending/error state.
- `node_modules/next/dist/docs/01-app/02-guides/json-ld.md` — JSON-LD pattern with `<` escape.
- `node_modules/next/dist/docs/01-app/02-guides/testing/vitest.md` — Vitest manual setup.
- `node_modules/next/dist/docs/01-app/02-guides/testing/playwright.md` — Playwright manual setup.

These are local files. Do not fetch online docs.

---

## Working Conventions

- **Branch:** all work happens on `feature/landing-page`. Do not push to `main` until launch.
- **Package manager:** `bun`. The repo has `bun.lock`. Use `bun add`, `bun add -D`, `bun run`. If `bun` isn't installed, fall back to `npm` consistently for the whole engagement.
- **Commits:** atomic. After each task's "Commit" step, run `git status` to confirm a clean working tree before starting the next task. Commit messages follow Conventional Commits: `feat:`, `fix:`, `refactor:`, `chore:`, `test:`, `docs:`, `style:`.
- **Style:** TypeScript strict, RSC by default, `'use client'` only where the spec lists it. No `any`. No comments unless WHY is non-obvious.
- **Copy:** never introduce em dashes (`—` or `--`) in any string written to a content module, JSX text node, or alt text. The spec calls this out specifically.
- **Verification:** after every task, run `bun run lint` and `bun run build`. Both must pass before commit.

---

## File Structure (locked from spec §8)

```
app/
  layout.tsx                                root html, fonts, Analytics (modify existing)
  globals.css                               OKLCH tokens, motion vars, prose rules (replace existing)
  robots.ts                                 NEW
  sitemap.ts                                NEW
  opengraph-image.tsx                       NEW
  (site)/
    layout.tsx                              <SiteHeader/> + <main/> + <SiteFooter/>
    page.tsx                                /
    about/page.tsx
    what-we-do/page.tsx
    distribution/page.tsx
    logistics/page.tsx
    products/page.tsx
    brands/page.tsx
    careers/page.tsx
    contact/
      page.tsx
      actions.ts                            "use server" — Server Action + Zod
  _components/
    site-header.tsx                         client
    site-footer.tsx                         RSC
    skip-to-content.tsx                     RSC
    reveal-on-scroll.tsx                    client wrapper
    primitives/
      eyebrow.tsx
      display-heading.tsx
      hairline-rule.tsx
      kpi-strip.tsx
      pin.tsx
      brand-cell.tsx
      timeline-item.tsx
      section-heading.tsx
      soft-cta.tsx
      capability-block.tsx
      page-header.tsx
    sections/
      hero.tsx
      what-we-do.tsx
      footprint-map.tsx                     client
      timeline.tsx                          client
      brand-wall.tsx
      jv-feature.tsx
      soft-cta-closer.tsx
    forms/
      contact-form.tsx                      client
  _hooks/
    use-reveal-on-scroll.ts
    use-scroll-state.ts
    use-focus-trap.ts
content/
  en/
    site.ts
    milestones.ts
    brands.ts
    capabilities.ts
    careers.ts
    products.ts
public/
  brands/                                   logo files (when client provides)
  photos/
    distribution/GT.png
    distribution/MT.png
    distribution/events-and-activities.png
    distribution/special-display.png
    warehouse/co-packing-facility.png
    warehouse/warehouse-1.png
    warehouse/warehouse-2.png
    history/history.png
__tests__/
  primitives/
    brand-cell.test.tsx
    display-heading.test.tsx
  contact/
    schema.test.ts
e2e/
  smoke.spec.ts
  contact.spec.ts
  mobile-drawer.spec.ts
vitest.config.mts                           NEW
vitest.setup.ts                             NEW
playwright.config.ts                        NEW
MAINTENANCE.md                              NEW (open items + deferred work)
```

---

# Phase 0 — Tooling foundations

Install and configure Vitest, Playwright, and runtime dependencies before touching app code. Each tool has its own task so commits stay atomic.

## Task 0.1 — Install Zod

**Files:**
- Modify: `package.json`
- Modify: `bun.lock`

- [ ] **Step 1: Install Zod**

```bash
bun add zod
```

Expected: zod resolves to v4 or later. `package.json` `dependencies` gains `"zod": "^X.Y.Z"`.

- [ ] **Step 2: Verify install**

```bash
bun pm ls | grep zod
```

Expected: shows zod with a version.

- [ ] **Step 3: Commit**

```bash
git add package.json bun.lock
git commit -m "chore: add zod for server-side form validation"
```

---

## Task 0.2 — Install Vitest stack

**Files:**
- Modify: `package.json`, `bun.lock`

- [ ] **Step 1: Install Vitest dev dependencies**

```bash
bun add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/dom vite-tsconfig-paths
```

Expected: all 7 packages added under `devDependencies`.

- [ ] **Step 2: Add `test:unit` script**

Edit `package.json` `scripts`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "typecheck": "tsc --noEmit",
    "test:unit": "vitest run",
    "test:unit:watch": "vitest"
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add package.json bun.lock
git commit -m "chore: install vitest + react testing library"
```

---

## Task 0.3 — Configure Vitest

**Files:**
- Create: `vitest.config.mts`
- Create: `vitest.setup.ts`

- [ ] **Step 1: Write `vitest.config.mts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    include: ["__tests__/**/*.test.{ts,tsx}"],
  },
});
```

- [ ] **Step 2: Write `vitest.setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 3: Write a sanity test to confirm wiring**

Create `__tests__/sanity.test.ts`:

```ts
import { describe, it, expect } from "vitest";

describe("vitest wiring", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 4: Run the sanity test**

```bash
bun run test:unit
```

Expected: PASS, 1 test passed.

- [ ] **Step 5: Delete the sanity test**

```bash
rm __tests__/sanity.test.ts
```

- [ ] **Step 6: Commit**

```bash
git add vitest.config.mts vitest.setup.ts
git commit -m "chore: configure vitest with jsdom + jest-dom matchers"
```

---

## Task 0.4 — Install + configure Playwright

**Files:**
- Modify: `package.json`, `bun.lock`
- Create: `playwright.config.ts`
- Modify: `.gitignore` (append Playwright artifacts)

- [ ] **Step 1: Install Playwright**

```bash
bun add -D @playwright/test
bunx playwright install --with-deps chromium
```

Expected: Chromium browser binary installs. Skip Firefox/Webkit at launch (we'll add later if cross-browser smoke is required).

- [ ] **Step 2: Write `playwright.config.ts`**

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "chromium-desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "chromium-mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: "bun run build && bun run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
```

- [ ] **Step 3: Add scripts**

Edit `package.json` `scripts`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "typecheck": "tsc --noEmit",
    "test:unit": "vitest run",
    "test:unit:watch": "vitest",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

- [ ] **Step 4: Append to `.gitignore`**

```
# Playwright
/test-results/
/playwright-report/
/blob-report/
/playwright/.cache/
```

- [ ] **Step 5: Smoke-write a placeholder e2e test to verify Playwright runs**

Create `e2e/_smoke.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("playwright wiring", async () => {
  expect(1 + 1).toBe(2);
});
```

- [ ] **Step 6: Run it (without webServer — pure JS check)**

```bash
bunx playwright test --project=chromium-desktop --reporter=list e2e/_smoke.spec.ts
```

Expected: 1 passed. The webServer will start; that's fine. If `bun run start` errors because the build hasn't been run yet, run `bun run build` first.

- [ ] **Step 7: Delete the placeholder**

```bash
rm e2e/_smoke.spec.ts
```

- [ ] **Step 8: Commit**

```bash
git add package.json bun.lock playwright.config.ts .gitignore
git commit -m "chore: configure playwright with desktop + mobile chromium"
```

---

# Phase 1 — Design tokens, fonts, root layout

Replace boilerplate with the OKLCH token system and load Playfair. The homepage page boilerplate stays in place for now (we'll replace it in Phase 4).

## Task 1.1 — Replace `app/globals.css` with OKLCH tokens

**Files:**
- Modify: `app/globals.css`

The current file has a black/white default with a `prefers-color-scheme: dark` media query. Per spec §2, we are light-only. Replace the entire file.

- [ ] **Step 1: Overwrite `app/globals.css`**

```css
@import "tailwindcss";

@theme {
  --color-gold: oklch(0.65 0.115 80);
  --color-ink: oklch(0.16 0.012 165);
  --color-green: oklch(0.30 0.038 158);
  --color-cream: oklch(0.94 0.022 85);
  --color-paper: oklch(0.985 0.005 85);
  --color-muted: oklch(0.52 0.008 90);
  --color-line: oklch(0.84 0.025 90);

  --font-display: var(--font-playfair);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);

  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
}

:root {
  color-scheme: light;
}

html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

body {
  background: var(--color-cream);
  color: var(--color-ink);
  font-family: var(--font-sans);
  font-size: 17px;
  line-height: 1.55;
  font-feature-settings: "ss01", "ss02";
}

::selection {
  background: var(--color-ink);
  color: var(--color-cream);
}

:focus-visible {
  outline: 2px solid var(--color-gold);
  outline-offset: 2px;
  border-radius: 2px;
}

a:focus-visible,
button:focus-visible {
  outline-offset: 4px;
}

/* Reveal-on-scroll baseline.
   .reveal hides until .is-visible toggles — useRevealOnScroll handles the toggle. */
.reveal {
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 600ms var(--ease-out-expo), transform 600ms var(--ease-out-expo);
  will-change: opacity, transform;
}

.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .reveal,
  .reveal.is-visible {
    opacity: 1;
    transform: none;
    transition: none;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 2: Run build to confirm Tailwind v4 resolves the new tokens**

```bash
bun run build
```

Expected: build succeeds. The generated CSS should contain class utilities like `.bg-cream`, `.text-ink`, `.text-gold`, etc. (Tailwind v4 derives utilities from `@theme`.)

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat(theme): replace defaults with OKLCH tokens, light-only theme"
```

---

## Task 1.2 — Add Playfair Display + clean root layout

**Files:**
- Modify: `app/layout.tsx`

The current root layout wires Geist + Geist Mono and uses a `Create Next App` placeholder for metadata. Replace metadata with real values, add Playfair Display, and tighten the body classes. Keep `<Analytics />` inside `<body>` (the current placement above `<body>` is invalid HTML — fix in this task).

- [ ] **Step 1: Overwrite `app/layout.tsx`**

```tsx
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin", "latin-ext"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-playfair",
  weight: ["400", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://richfieldgroup.com.vn"),
  title: {
    default: "Richfield Group — From Market Entry to Nationwide Distribution",
    template: "%s — Richfield Group",
  },
  description:
    "Vietnam's largest FMCG distribution network. Bringing the world's most loved brands to over 180,000 retail outlets nationwide.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://richfieldgroup.com.vn",
    siteName: "Richfield Group",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable}`}
    >
      <body className="min-h-dvh bg-cream text-ink antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Build to confirm Playfair loads**

```bash
bun run build
```

Expected: build passes. The build log should include Playfair Display in optimized fonts.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat(layout): add Playfair Display, real metadata, fix Analytics placement"
```

---

## Task 1.3 — Move boilerplate `app/page.tsx` aside

The default `app/page.tsx` is the Next.js starter. We'll replace it with the real homepage in Phase 4. To keep the build green in the meantime (Tailwind utilities like `bg-zinc-50` and `dark:` modifiers may not all resolve cleanly under v4), replace it with a temporary placeholder.

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Overwrite `app/page.tsx`**

```tsx
export default function HomePagePlaceholder() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-6">
      <p className="font-display text-2xl italic text-ink">
        Richfield landing page — under construction.
      </p>
    </main>
  );
}
```

- [ ] **Step 2: Boot the dev server and verify**

```bash
bun run dev
```

Visit `http://localhost:3000`. Expected: cream background, italic Playfair text. Stop the server with `Ctrl+C`.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "chore: replace next.js boilerplate with placeholder homepage"
```

---

# Phase 2 — Content modules

Typed content modules under `content/en/`. These are the source of truth for every shipped string. Pages and components import directly. No fetch, no DB, no CMS.

## Task 2.1 — Site config

**Files:**
- Create: `content/en/site.ts`

- [ ] **Step 1: Write `content/en/site.ts`**

```ts
export const site = {
  name: "Richfield Group",
  legalName: "Richfield Worldwide JSC",
  tagline: "From Market Entry to Nationwide Distribution",
  taglineLong:
    "From Market Entry to Nationwide Distribution. Vietnam · Malaysia · China.",
  description:
    "Vietnam's largest FMCG distribution network. Bringing the world's most loved brands to over 180,000 retail outlets nationwide.",
  domainCanonical: "https://richfieldgroup.com.vn",
  address: {
    line1: "15A1 Nguyễn Hữu Thọ",
    line2: "Phước Kiển, Nhà Bè, HCM",
    full: "Richfield Worldwide JSC · 15A1 Nguyễn Hữu Thọ, Phước Kiển, Nhà Bè, HCM",
    geo: { lat: 10.722, lng: 106.706 },
  },
  phones: {
    office: "(+028) 3784 0237",
    officeTel: "+842837840237",
    hotline: "0917 331 132",
    hotlineTel: "+84917331132",
  },
  email: "cskh@richfieldvn.com.vn",
  socials: {
    facebook: "https://www.facebook.com/RichFieldGroup",
    linkedin: "",
    zalo: "",
  },
  external: {
    doryRich: "https://doryrich.com.vn",
  },
  countries: ["Vietnam", "Malaysia", "China"] as const,
  founded: 1994,
} as const;

export type Site = typeof site;
```

- [ ] **Step 2: Commit**

```bash
git add content/en/site.ts
git commit -m "feat(content): add site-wide config (tagline, address, contact)"
```

---

## Task 2.2 — Milestones

**Files:**
- Create: `content/en/milestones.ts`

- [ ] **Step 1: Write `content/en/milestones.ts`**

```ts
export type Milestone = {
  year: number;
  brand: string;
  country: string;
  body: string;
  /** When true, milestone shows on /about (extended) but not on the homepage strip. */
  aboutOnly?: boolean;
};

export const milestones: Milestone[] = [
  {
    year: 1992,
    brand: "Group",
    country: "Cambodia & Vietnam",
    body: "Richfield first ventures across the border, importing Wrigley's into Cambodia and Vietnam ahead of the trade embargo lifting.",
    aboutOnly: true,
  },
  {
    year: 1994,
    brand: "Mars",
    country: "USA",
    body: "Wrigley's becomes our first imported brand the year the US trade embargo lifts.",
  },
  {
    year: 1999,
    brand: "NewChoice",
    country: "Taiwan",
    body: "First Taiwanese partner; the snack category joins the portfolio.",
  },
  {
    year: 2014,
    brand: "TCP",
    country: "Thailand",
    body: "Warrior and Red Bull bring the energy and lifestyle category.",
  },
  {
    year: 2018,
    brand: "BiC",
    country: "France",
    body: "Stationery and lighters expand the everyday-consumer footprint.",
  },
  {
    year: 2022,
    brand: "AMOS",
    country: "China",
    body: "Art supplies and creative materials enter the lineup.",
  },
  {
    year: 2024,
    brand: "Dory Rich JSC",
    country: "Vietnam",
    body: "Joint venture with TCP Group brings manufacturing and distribution under one roof.",
  },
  {
    year: 2026,
    brand: "Glico",
    country: "Japan",
    body: "Pocky and confectionery; the latest international partnership.",
  },
];

export const homepageMilestones = milestones.filter((m) => !m.aboutOnly);
```

- [ ] **Step 2: Commit**

```bash
git add content/en/milestones.ts
git commit -m "feat(content): milestones for timeline (homepage 7 + about prefix)"
```

---

## Task 2.3 — Brands

**Files:**
- Create: `content/en/brands.ts`

- [ ] **Step 1: Write `content/en/brands.ts`**

```ts
export type Brand = {
  name: string;
  country: string;
  year?: number;
  logoSrc?: string;
  category?: "Confectionery" | "Beverages" | "Personal & Lifestyle" | "Stationery & Crafts";
  /** When true, this brand appears on the homepage feature cell (2x1). */
  feature?: boolean;
  /** Caption beneath a feature cell. */
  featureCaption?: string;
};

export const brands: Brand[] = [
  {
    name: "Mars · Wrigley",
    country: "USA",
    year: 1994,
    feature: true,
    featureCaption: "Founding partner · Since 1994",
    category: "Confectionery",
  },
  { name: "TCP", country: "Thailand", year: 2014, category: "Beverages" },
  { name: "BiC", country: "France", year: 2018, category: "Stationery & Crafts" },
  { name: "Red Bull", country: "Austria", category: "Beverages" },
  { name: "Glico (Pocky)", country: "Japan", year: 2026, category: "Confectionery" },
  { name: "AMOS", country: "China", year: 2022, category: "Stationery & Crafts" },
  { name: "NewChoice", country: "Taiwan", year: 1999, category: "Confectionery" },
  { name: "Warrior", country: "Thailand", category: "Beverages" },
  { name: "Wei Long", country: "China", category: "Confectionery" },
];

export const homepageBrands = brands;

export const featuredPartners = [
  { name: "Mars", country: "USA", year: 1994, story: "Our founding partner. Wrigley's was our first imported brand the year the US trade embargo lifted." },
  { name: "TCP", country: "Thailand", year: 2014, story: "Warrior and Red Bull anchor the energy and lifestyle category in Vietnam." },
  { name: "Glico", country: "Japan", year: 2026, story: "Pocky and confectionery; our newest international partnership." },
];
```

- [ ] **Step 2: Commit**

```bash
git add content/en/brands.ts
git commit -m "feat(content): brand portfolio + homepage feature partner"
```

---

## Task 2.4 — Capabilities (4 pillars + import/export)

**Files:**
- Create: `content/en/capabilities.ts`

- [ ] **Step 1: Write `content/en/capabilities.ts`**

```ts
export type Pillar = {
  number: string;
  name: string;
  shortBody: string;
  longBody: string;
  href: string;
};

export const pillars: Pillar[] = [
  {
    number: "01",
    name: "Import / Export",
    shortBody:
      "Customs declaration and full import support for international partners.",
    longBody:
      "Customs declaration and full import support for international partners. From documentation to bonded-warehouse handling, we manage the path from port to distribution centre, on schedules that protect retailer commitments.",
    href: "/distribution#import-export",
  },
  {
    number: "02",
    name: "Warehouse & Logistics",
    shortBody:
      "Two distribution centres in Long An and Hanoi, ambient and cold storage, end-to-end handling.",
    longBody:
      "Two distribution centres in Long An and Hanoi cover the country end to end. Ambient and cold storage (18°C–25°C), co-packing infrastructure, and a network of vehicles serving every province.",
    href: "/logistics",
  },
  {
    number: "03",
    name: "General Trade",
    shortBody:
      "Nationwide coverage with 800+ salesmen across every province and city.",
    longBody:
      "Nationwide coverage with 800+ salesmen across every province and city, supported by 300+ sub-distributors and a network of 180,000 retail outlets. Grocery, wholesaler, HORECA, wet market, independent pharmacy.",
    href: "/distribution#gt",
  },
  {
    number: "04",
    name: "Modern Trade",
    shortBody:
      "Retailer partnerships across every chain, with trade-marketing display and event support.",
    longBody:
      "Retailer partnerships across every chain in Vietnam, with trade-marketing display and event support. Super and Hyper, Convenience, Mini and Foodstore, Health and Beauty, Mom and Baby, Specialty.",
    href: "/distribution#mt",
  },
];

export const importExportBody =
  "Customs declaration and full import support for international partners. From documentation to bonded-warehouse handling, we manage the path from port to distribution centre.";

export const gtFormats = [
  "Grocery",
  "Wholesaler",
  "HORECA",
  "Wet market",
  "Independent pharmacy / CMH",
];

export const mtFormats = [
  "Super & Hyper",
  "Convenience",
  "Mini & Foodstore",
  "Health & Beauty",
  "Mom & Baby",
  "Specialty",
];
```

- [ ] **Step 2: Commit**

```bash
git add content/en/capabilities.ts
git commit -m "feat(content): capability pillars and trade format lists"
```

---

## Task 2.5 — Careers

**Files:**
- Create: `content/en/careers.ts`

- [ ] **Step 1: Write `content/en/careers.ts`**

```ts
export type CareerPillar = {
  heading: string;
  body: string;
};

export const whyRichfield: CareerPillar[] = [
  {
    heading: "People-Centered Philosophy",
    body: "We see our people as long-term partners in a shared journey, built on trust, ambition, and sustainable growth.",
  },
  {
    heading: "Comprehensive Benefits",
    body: "Competitive compensation, healthcare, and structured development across every level of the business.",
  },
  {
    heading: "Professional & Global Environment",
    body: "An international group spanning Vietnam, Malaysia, and China; daily exposure to the world's most loved brands.",
  },
  {
    heading: "A Legacy of Growth, A Future of Opportunity",
    body: "Three generations of family leadership, decades of partnerships, and clear paths for people who fit our story.",
  },
];

export const heritageBlock =
  "Rooted in over 30 years of trust, Richfield Group began as a family business in Malaysia and has grown across three generations. Today, we continue to build not just a company, but a community where people are valued as partners, not just employees. We see our people as long-term partners in a shared journey, built on trust, ambition, and sustainable growth.";

export type OpenPosition = {
  title: string;
  positions: number;
  location: string;
  deadline: string;
  href?: string;
};

export const openPositions: OpenPosition[] = [];
```

- [ ] **Step 2: Commit**

```bash
git add content/en/careers.ts
git commit -m "feat(content): careers pillars, heritage block, open-positions array"
```

---

## Task 2.6 — Products

**Files:**
- Create: `content/en/products.ts`

- [ ] **Step 1: Write `content/en/products.ts`**

```ts
export type FeaturedProduct = {
  name: string;
  brand: string;
  imageSrc?: string;
};

export const featuredProducts: FeaturedProduct[] = [
  { name: "M&M's", brand: "Mars" },
  { name: "Pocky", brand: "Glico" },
  { name: "Red Bull", brand: "TCP" },
  { name: "Warrior", brand: "TCP" },
  { name: "BiC Lighter", brand: "BiC" },
];

export const productsEditorial =
  "We distribute hundreds of SKUs across confectionery, beverages, personal care, and stationery. The full product catalogue is in development.";
```

- [ ] **Step 2: Commit**

```bash
git add content/en/products.ts
git commit -m "feat(content): featured products + editorial line"
```

---

# Phase 3 — Primitives

Reusable UI primitives. RSC by default. Tested where logic branches meaningfully.

## Task 3.1 — `<Eyebrow>`

A small uppercase tracked label. Two color variants: gold (default) and muted.

**Files:**
- Create: `app/_components/primitives/eyebrow.tsx`

- [ ] **Step 1: Write `app/_components/primitives/eyebrow.tsx`**

```tsx
type Tone = "gold" | "muted" | "ink-on-green";

const toneClass: Record<Tone, string> = {
  gold: "text-gold",
  muted: "text-muted",
  "ink-on-green": "text-gold",
};

export function Eyebrow({
  children,
  tone = "gold",
  as: Tag = "span",
  className = "",
}: {
  children: React.ReactNode;
  tone?: Tone;
  as?: "span" | "p" | "div";
  className?: string;
}) {
  return (
    <Tag
      className={`inline-block text-[11px] font-medium uppercase tracking-[0.32em] ${toneClass[tone]} ${className}`}
    >
      {children}
    </Tag>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/_components/primitives/eyebrow.tsx
git commit -m "feat(primitive): Eyebrow"
```

---

## Task 3.2 — `<DisplayHeading>` (with italic-marker parser)

The spec uses a Markdown-ish convention: text wrapped in `*…*` renders italic in Playfair. A small parser turns the input into spans.

**Files:**
- Create: `__tests__/primitives/display-heading.test.tsx`
- Create: `app/_components/primitives/display-heading.tsx`

- [ ] **Step 1: Write the failing test first**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DisplayHeading } from "@/app/_components/primitives/display-heading";

describe("<DisplayHeading>", () => {
  it("renders plain text without italic spans", () => {
    render(<DisplayHeading level={1}>Plain heading</DisplayHeading>);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Plain heading",
    );
    expect(screen.queryByText("Plain heading")?.querySelector("em")).toBeNull();
  });

  it("wraps *segments* in italic <em> tags", () => {
    render(
      <DisplayHeading level={1}>From market entry to *nationwide distribution*.</DisplayHeading>,
    );
    const heading = screen.getByRole("heading", { level: 1 });
    const em = heading.querySelector("em");
    expect(em).not.toBeNull();
    expect(em).toHaveTextContent("nationwide distribution");
  });

  it("supports multiple italic segments", () => {
    render(
      <DisplayHeading level={2}>
        *Trusted* by the world's most *loved* brands.
      </DisplayHeading>,
    );
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.querySelectorAll("em")).toHaveLength(2);
  });
});
```

- [ ] **Step 2: Run the test (expect failure)**

```bash
bun run test:unit __tests__/primitives/display-heading.test.tsx
```

Expected: FAIL — `Cannot find module '@/app/_components/primitives/display-heading'`.

- [ ] **Step 3: Implement `app/_components/primitives/display-heading.tsx`**

```tsx
type Level = 1 | 2 | 3;

const sizeClass: Record<Level, string> = {
  1: "text-[clamp(56px,7vw,96px)] leading-[1] tracking-[-0.025em]",
  2: "text-[clamp(40px,5vw,72px)] leading-[1.05] tracking-[-0.02em]",
  3: "text-[clamp(28px,3vw,44px)] leading-[1.1] tracking-[-0.015em]",
};

function parseItalics(text: string): Array<{ text: string; italic: boolean }> {
  const out: Array<{ text: string; italic: boolean }> = [];
  let i = 0;
  while (i < text.length) {
    const open = text.indexOf("*", i);
    if (open === -1) {
      out.push({ text: text.slice(i), italic: false });
      break;
    }
    if (open > i) out.push({ text: text.slice(i, open), italic: false });
    const close = text.indexOf("*", open + 1);
    if (close === -1) {
      out.push({ text: text.slice(open), italic: false });
      break;
    }
    out.push({ text: text.slice(open + 1, close), italic: true });
    i = close + 1;
  }
  return out;
}

type Props = {
  level: Level;
  children: string;
  tone?: "ink" | "white" | "gold";
  className?: string;
  italicTone?: "gold" | "ink" | "white";
};

const toneClass = { ink: "text-ink", white: "text-paper", gold: "text-gold" };

export function DisplayHeading({
  level,
  children,
  tone = "ink",
  italicTone = "gold",
  className = "",
}: Props) {
  const Tag = (`h${level}` as unknown) as keyof React.JSX.IntrinsicElements;
  const segments = parseItalics(children);
  return (
    <Tag
      className={`font-display font-normal ${sizeClass[level]} ${toneClass[tone]} ${className}`}
    >
      {segments.map((s, idx) =>
        s.italic ? (
          <em key={idx} className={`italic ${toneClass[italicTone]}`}>
            {s.text}
          </em>
        ) : (
          <span key={idx}>{s.text}</span>
        ),
      )}
    </Tag>
  );
}
```

- [ ] **Step 4: Run the test again — expect pass**

```bash
bun run test:unit __tests__/primitives/display-heading.test.tsx
```

Expected: PASS, 3 tests.

- [ ] **Step 5: Commit**

```bash
git add app/_components/primitives/display-heading.tsx __tests__/primitives/display-heading.test.tsx
git commit -m "feat(primitive): DisplayHeading with *italic* segment parser"
```

---

## Task 3.3 — `<HairlineRule>`

A 1px horizontal rule that animates from `scaleX(0)` to `scaleX(1)` once when revealed.

**Files:**
- Create: `app/_components/primitives/hairline-rule.tsx`

- [ ] **Step 1: Write `app/_components/primitives/hairline-rule.tsx`**

```tsx
type Tone = "line" | "white-15" | "gold";

const toneClass: Record<Tone, string> = {
  line: "bg-line",
  "white-15": "bg-paper/15",
  gold: "bg-gold",
};

export function HairlineRule({
  tone = "line",
  className = "",
}: {
  tone?: Tone;
  className?: string;
}) {
  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={`h-px w-full origin-left ${toneClass[tone]} ${className}`}
    />
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/_components/primitives/hairline-rule.tsx
git commit -m "feat(primitive): HairlineRule"
```

---

## Task 3.4 — `<KpiStrip>`

A horizontal magazine-style by-the-numbers strip. Not iconified, not cards, not count-up.

**Files:**
- Create: `app/_components/primitives/kpi-strip.tsx`

- [ ] **Step 1: Write `app/_components/primitives/kpi-strip.tsx`**

```tsx
export type Kpi = {
  label: string;
  value: string;
};

export function KpiStrip({
  items,
  tone = "on-green",
}: {
  items: Kpi[];
  tone?: "on-green" | "on-cream";
}) {
  const labelClass = tone === "on-green" ? "text-paper/60" : "text-muted";
  const valueClass = tone === "on-green" ? "text-paper" : "text-ink";
  return (
    <dl
      className={`grid grid-cols-2 gap-y-8 sm:grid-cols-4 sm:gap-y-0 sm:gap-x-8 ${tone === "on-green" ? "text-paper" : "text-ink"}`}
    >
      {items.map((kpi) => (
        <div key={kpi.label} className="flex flex-col gap-2">
          <dt
            className={`text-[11px] uppercase tracking-[0.32em] ${labelClass}`}
          >
            {kpi.label}
          </dt>
          <dd
            className={`font-display text-[32px] leading-none ${valueClass}`}
          >
            {kpi.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/_components/primitives/kpi-strip.tsx
git commit -m "feat(primitive): KpiStrip"
```

---

## Task 3.5 — `<Pin>`

An SVG pin with a gold dot and a pulsing ring. CSS animation on the ring; reduced-motion disables.

**Files:**
- Create: `app/_components/primitives/pin.tsx`

- [ ] **Step 1: Write `app/_components/primitives/pin.tsx`**

```tsx
export function Pin({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label={label}
      className={`relative inline-flex h-3 w-3 ${className}`}
    >
      <span
        aria-hidden
        className="absolute inset-0 animate-ping rounded-full bg-gold/50"
      />
      <span
        aria-hidden
        className="relative inline-flex h-full w-full rounded-full bg-gold ring-2 ring-cream"
      />
    </span>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/_components/primitives/pin.tsx
git commit -m "feat(primitive): Pin (with reduced-motion-safe pulse)"
```

---

## Task 3.6 — `<BrandCell>` (logo-vs-text fallback) — TDD

The most logic-heavy primitive. Test the branching first.

**Files:**
- Create: `__tests__/primitives/brand-cell.test.tsx`
- Create: `app/_components/primitives/brand-cell.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrandCell } from "@/app/_components/primitives/brand-cell";

describe("<BrandCell>", () => {
  it("renders typographic fallback when no logoSrc is provided", () => {
    render(<BrandCell name="Wei Long" country="China" />);
    expect(screen.getByText("Wei Long")).toBeInTheDocument();
    expect(screen.getByText("China")).toBeInTheDocument();
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("renders <img> when logoSrc is provided", () => {
    render(
      <BrandCell name="Mars" country="USA" logoSrc="/brands/mars.png" />,
    );
    const img = screen.getByRole("img", { name: "Mars" });
    expect(img).toBeInTheDocument();
  });

  it("renders the feature variant 2x1 with caption when feature is true", () => {
    render(
      <BrandCell
        name="Mars · Wrigley"
        country="USA"
        feature
        featureCaption="Founding partner · Since 1994"
      />,
    );
    expect(screen.getByText("Mars · Wrigley")).toBeInTheDocument();
    expect(
      screen.getByText("Founding partner · Since 1994"),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test — expect failure**

```bash
bun run test:unit __tests__/primitives/brand-cell.test.tsx
```

Expected: FAIL.

- [ ] **Step 3: Implement `app/_components/primitives/brand-cell.tsx`**

```tsx
import Image from "next/image";

type Props = {
  name: string;
  country: string;
  logoSrc?: string;
  feature?: boolean;
  featureCaption?: string;
};

export function BrandCell({
  name,
  country,
  logoSrc,
  feature = false,
  featureCaption,
}: Props) {
  const wrapperBase =
    "group flex flex-col items-center justify-center gap-3 bg-cream px-6 py-12 transition-colors duration-200 hover:bg-paper";
  const span = feature ? "sm:col-span-2" : "";

  if (feature) {
    return (
      <div className={`${wrapperBase} ${span} bg-paper`}>
        <span className="font-display text-[clamp(28px,3vw,36px)] italic text-gold">
          {name}
        </span>
        {featureCaption ? (
          <span className="text-[10px] uppercase tracking-[0.32em] text-muted">
            {featureCaption}
          </span>
        ) : null}
      </div>
    );
  }

  if (logoSrc) {
    return (
      <div className={wrapperBase}>
        <Image
          src={logoSrc}
          alt={name}
          width={140}
          height={48}
          className="h-12 w-auto object-contain"
        />
        <span className="text-[10px] uppercase tracking-[0.32em] text-muted">
          {country}
        </span>
      </div>
    );
  }

  return (
    <div className={wrapperBase}>
      <span className="font-display text-[24px] italic text-ink">{name}</span>
      <span className="text-[10px] uppercase tracking-[0.32em] text-muted">
        {country}
      </span>
    </div>
  );
}
```

- [ ] **Step 4: Run the test — expect pass**

```bash
bun run test:unit __tests__/primitives/brand-cell.test.tsx
```

Expected: PASS, 3 tests.

- [ ] **Step 5: Commit**

```bash
git add app/_components/primitives/brand-cell.tsx __tests__/primitives/brand-cell.test.tsx
git commit -m "feat(primitive): BrandCell with logo-or-text fallback"
```

---

## Task 3.7 — `<TimelineItem>`

A single milestone cell. Used inside `<Timeline>` (built later).

**Files:**
- Create: `app/_components/primitives/timeline-item.tsx`

- [ ] **Step 1: Write `app/_components/primitives/timeline-item.tsx`**

```tsx
import type { Milestone } from "@/content/en/milestones";

type Variant = "compact" | "detail";

export function TimelineItem({
  milestone,
  variant = "compact",
}: {
  milestone: Milestone;
  variant?: Variant;
}) {
  return (
    <article className="flex flex-col gap-3 px-4">
      <span
        aria-hidden="true"
        className="block h-3 w-3 rounded-full bg-gold ring-2 ring-ink"
      />
      <div className="font-display text-[42px] leading-none text-gold">
        {milestone.year}
      </div>
      <div className="font-medium text-paper">
        {milestone.brand} <span className="text-paper/60">·</span>{" "}
        <span className="text-paper/80">{milestone.country}</span>
      </div>
      <p
        className={
          variant === "detail"
            ? "max-w-[28ch] text-[15px] leading-[1.55] text-paper/70"
            : "max-w-[24ch] text-[14px] leading-[1.5] text-paper/70"
        }
      >
        {milestone.body}
      </p>
    </article>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/_components/primitives/timeline-item.tsx
git commit -m "feat(primitive): TimelineItem (compact + detail variants)"
```

---

## Task 3.8 — `<SectionHeading>`

The "eyebrow + display heading + lede" cluster used at the top of every section.

**Files:**
- Create: `app/_components/primitives/section-heading.tsx`

- [ ] **Step 1: Write `app/_components/primitives/section-heading.tsx`**

```tsx
import { Eyebrow } from "./eyebrow";
import { DisplayHeading } from "./display-heading";

type Tone = "on-cream" | "on-ink" | "on-green";

const headingTone: Record<Tone, "ink" | "white"> = {
  "on-cream": "ink",
  "on-ink": "white",
  "on-green": "white",
};

export function SectionHeading({
  eyebrow,
  heading,
  level = 2,
  lede,
  tone = "on-cream",
  align = "left",
}: {
  eyebrow?: string;
  heading: string;
  level?: 1 | 2 | 3;
  lede?: string;
  tone?: Tone;
  align?: "left" | "center";
}) {
  const ledeColor =
    tone === "on-cream" ? "text-muted" : "text-paper/70";
  return (
    <div
      className={`flex flex-col gap-6 ${align === "center" ? "items-center text-center" : ""}`}
    >
      {eyebrow ? <Eyebrow tone="gold">{eyebrow}</Eyebrow> : null}
      <DisplayHeading level={level} tone={headingTone[tone]}>
        {heading}
      </DisplayHeading>
      {lede ? (
        <p className={`max-w-[60ch] text-[17px] leading-[1.55] ${ledeColor}`}>
          {lede}
        </p>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/_components/primitives/section-heading.tsx
git commit -m "feat(primitive): SectionHeading"
```

---

## Task 3.9 — `<SoftCta>`

A gold-underlined, uppercase, tracked link with a chevron arrow. Always-on underline.

**Files:**
- Create: `app/_components/primitives/soft-cta.tsx`

- [ ] **Step 1: Write `app/_components/primitives/soft-cta.tsx`**

```tsx
import Link from "next/link";

export function SoftCta({
  href,
  children,
  external = false,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
}) {
  const cls = `inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.32em] text-gold underline decoration-gold decoration-[1px] underline-offset-[6px] transition-colors duration-200 hover:text-gold/80 ${className}`;
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
      >
        {children} <span aria-hidden>→</span>
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children} <span aria-hidden>→</span>
    </Link>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/_components/primitives/soft-cta.tsx
git commit -m "feat(primitive): SoftCta"
```

---

## Task 3.10 — `<CapabilityBlock>`

Reused on `/distribution`, `/logistics`, `/what-we-do` to render a pillar with a long body and a soft-CTA link. Single source of truth for capability copy.

**Files:**
- Create: `app/_components/primitives/capability-block.tsx`

- [ ] **Step 1: Write `app/_components/primitives/capability-block.tsx`**

```tsx
import type { Pillar } from "@/content/en/capabilities";
import { SoftCta } from "./soft-cta";

export function CapabilityBlock({ pillar }: { pillar: Pillar }) {
  return (
    <article className="flex flex-col gap-4 border-t border-line pt-8">
      <span className="font-display text-[32px] italic leading-none text-gold">
        {pillar.number}
      </span>
      <h3 className="text-[18px] font-semibold text-ink">{pillar.name}</h3>
      <p className="max-w-[55ch] text-[15px] leading-[1.55] text-muted">
        {pillar.longBody}
      </p>
      <div className="pt-2">
        <SoftCta href={pillar.href}>Read more</SoftCta>
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/_components/primitives/capability-block.tsx
git commit -m "feat(primitive): CapabilityBlock"
```

---

## Task 3.11 — `<PageHeader>`

Inner-page header band: eyebrow + h1 + lede. Two tones: cream (default) and green.

**Files:**
- Create: `app/_components/primitives/page-header.tsx`

- [ ] **Step 1: Write `app/_components/primitives/page-header.tsx`**

```tsx
import { SectionHeading } from "./section-heading";

type Tone = "cream" | "green";

const bgClass: Record<Tone, string> = {
  cream: "bg-cream",
  green: "bg-green",
};

export function PageHeader({
  eyebrow,
  heading,
  lede,
  tone = "cream",
}: {
  eyebrow: string;
  heading: string;
  lede?: string;
  tone?: Tone;
}) {
  return (
    <header
      className={`${bgClass[tone]} px-6 pt-[clamp(120px,16vw,200px)] pb-[clamp(72px,9vw,120px)] sm:px-10`}
    >
      <div className="mx-auto max-w-[1300px]">
        <SectionHeading
          eyebrow={eyebrow}
          heading={heading}
          level={1}
          lede={lede}
          tone={tone === "cream" ? "on-cream" : "on-green"}
        />
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/_components/primitives/page-header.tsx
git commit -m "feat(primitive): PageHeader (cream + green tones)"
```

---

# Phase 4 — Site shell (header, footer, route group)

## Task 4.1 — `<SkipToContent>`

**Files:**
- Create: `app/_components/skip-to-content.tsx`

- [ ] **Step 1: Write `app/_components/skip-to-content.tsx`**

```tsx
export function SkipToContent() {
  return (
    <a
      href="#main"
      className="sr-only fixed left-4 top-4 z-50 rounded-sm bg-ink px-4 py-2 text-paper focus:not-sr-only focus:outline-2 focus:outline-gold"
    >
      Skip to content
    </a>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/_components/skip-to-content.tsx
git commit -m "feat(a11y): SkipToContent link"
```

---

## Task 4.2 — `<SiteFooter>`

RSC. 4-column ink-bg footer + bottom hairline row.

**Files:**
- Create: `app/_components/site-footer.tsx`

- [ ] **Step 1: Write `app/_components/site-footer.tsx`**

```tsx
import Link from "next/link";
import { site } from "@/content/en/site";
import { Eyebrow } from "./primitives/eyebrow";

const exploreLinks = [
  { label: "About", href: "/about" },
  { label: "Brands", href: "/brands" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

const groupItems = [
  { label: "Vietnam", external: false },
  { label: "Malaysia", external: false },
  { label: "China", external: false },
  { label: "Dory Rich JSC ↗", external: true, href: site.external.doryRich },
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto grid max-w-[1300px] gap-12 px-6 pt-[90px] pb-12 sm:px-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gold font-display italic text-gold"
            >
              R
            </span>
            <span className="font-display text-[14px] tracking-[0.28em] text-paper">
              RICHFIELD GROUP
            </span>
          </div>
          <p className="max-w-[40ch] text-[14px] leading-[1.6] text-paper/70">
            {site.taglineLong}
          </p>
        </div>

        <FooterColumn heading="Explore">
          <ul className="flex flex-col gap-3">
            {exploreLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-[14px] text-paper/80 transition-colors hover:text-gold"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </FooterColumn>

        <FooterColumn heading="Contact">
          <address className="not-italic text-[14px] leading-[1.6] text-paper/80">
            {site.legalName}
            <br />
            {site.address.line1}
            <br />
            {site.address.line2}
            <br />
            <a className="hover:text-gold" href={`tel:${site.phones.officeTel}`}>
              Office {site.phones.office}
            </a>
            <br />
            <a className="hover:text-gold" href={`tel:${site.phones.hotlineTel}`}>
              Hotline {site.phones.hotline}
            </a>
            <br />
            <a className="hover:text-gold" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </address>
        </FooterColumn>

        <FooterColumn heading="Group">
          <ul className="flex flex-col gap-3 text-[14px] text-paper/80">
            {groupItems.map((g) =>
              g.external && g.href ? (
                <li key={g.label}>
                  <a
                    href={g.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-gold"
                  >
                    {g.label}
                  </a>
                </li>
              ) : (
                <li key={g.label}>{g.label}</li>
              ),
            )}
          </ul>
        </FooterColumn>
      </div>

      <div className="mx-auto mt-6 flex max-w-[1300px] flex-col gap-4 border-t border-paper/15 px-6 py-6 text-[12px] text-paper/60 sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <span>© {year} {site.legalName}.</span>
        <SocialIcons />
        <a href={site.domainCanonical} className="hover:text-gold">
          richfieldgroup.com.vn
        </a>
      </div>
    </footer>
  );
}

function FooterColumn({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Eyebrow tone="gold" as="div">
        {heading}
      </Eyebrow>
      {children}
    </div>
  );
}

function SocialIcons() {
  const items = [
    { label: "Facebook", href: site.socials.facebook },
    { label: "LinkedIn", href: site.socials.linkedin },
    { label: "Zalo", href: site.socials.zalo },
  ].filter((i) => i.href);
  return (
    <ul className="flex items-center gap-6">
      {items.map((i) => (
        <li key={i.label}>
          <a
            href={i.href}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold"
          >
            {i.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/_components/site-footer.tsx
git commit -m "feat(shell): SiteFooter"
```

---

## Task 4.3 — `useScrollState` hook + `<SiteHeader>`

Header is a client component because it tracks scroll-past-hero state and toggles a transparent/solid variant. On inner pages it stays solid.

**Files:**
- Create: `app/_hooks/use-scroll-state.ts`
- Create: `app/_hooks/use-focus-trap.ts`
- Create: `app/_components/site-header.tsx`

- [ ] **Step 1: Write `app/_hooks/use-scroll-state.ts`**

```ts
"use client";

import { useEffect, useState } from "react";

export function useScrollPastThreshold(threshold = 80) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return past;
}
```

- [ ] **Step 2: Write `app/_hooks/use-focus-trap.ts`**

```ts
"use client";

import { useEffect } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useFocusTrap(
  ref: React.RefObject<HTMLElement | null>,
  active: boolean,
  onEscape?: () => void,
) {
  useEffect(() => {
    if (!active || !ref.current) return;
    const root = ref.current;
    const focusables = root.querySelectorAll<HTMLElement>(FOCUSABLE);
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onEscape) {
        e.preventDefault();
        onEscape();
        return;
      }
      if (e.key !== "Tab" || !focusables.length) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active, ref, onEscape]);
}
```

- [ ] **Step 3: Write `app/_components/site-header.tsx`**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useScrollPastThreshold } from "@/app/_hooks/use-scroll-state";
import { useFocusTrap } from "@/app/_hooks/use-focus-trap";

const NAV = [
  { label: "About", href: "/about" },
  { label: "What we do", href: "/what-we-do" },
  { label: "Brands", href: "/brands" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const scrolled = useScrollPastThreshold(80);
  const transparent = isHome && !scrolled;

  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  useFocusTrap(drawerRef, open, () => setOpen(false));

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  const headerCls = transparent
    ? "absolute inset-x-0 top-0 z-30 bg-transparent"
    : "sticky inset-x-0 top-0 z-30 border-b border-line bg-cream/85 backdrop-blur-sm";

  const linkColor = transparent ? "text-paper" : "text-ink";
  const hoverColor = "hover:text-gold";

  return (
    <header className={headerCls}>
      <div className="mx-auto flex h-[72px] max-w-[1300px] items-center justify-between px-6 sm:h-[96px] sm:px-10">
        <Link href="/" className="flex items-center gap-3" aria-label="Richfield Group home">
          <span
            aria-hidden
            className={`flex h-10 w-10 items-center justify-center rounded-full border font-display italic ${
              transparent ? "border-gold text-gold" : "border-gold text-gold"
            }`}
          >
            R
          </span>
          <span className={`hidden font-display text-[14px] tracking-[0.28em] sm:block ${linkColor}`}>
            RICHFIELD GROUP
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-10 lg:flex">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[11px] font-medium uppercase tracking-[0.16em] transition-colors ${linkColor} ${hoverColor} ${
                  active ? "underline decoration-gold decoration-[1px] underline-offset-[6px]" : ""
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <LangSwitcher tone={transparent ? "light" : "dark"} />
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-drawer"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className={`flex h-10 w-10 items-center justify-center lg:hidden ${linkColor}`}
          >
            <span aria-hidden className="font-display text-2xl">
              {open ? "×" : "≡"}
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-drawer"
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="fixed inset-0 z-40 flex flex-col bg-cream"
        >
          <div className="flex h-[72px] items-center justify-between px-6">
            <span className="font-display text-[14px] tracking-[0.28em] text-ink">
              RICHFIELD GROUP
            </span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="flex h-10 w-10 items-center justify-center text-ink"
            >
              <span aria-hidden className="font-display text-3xl">
                ×
              </span>
            </button>
          </div>
          <nav aria-label="Primary mobile" className="flex flex-1 flex-col gap-8 px-6 pt-8">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-display text-[clamp(28px,3vw,44px)] text-ink hover:text-gold"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="px-6 pb-10">
            <LangSwitcher tone="dark" />
          </div>
        </div>
      ) : null}
    </header>
  );
}

function LangSwitcher({ tone }: { tone: "light" | "dark" }) {
  const baseCls = tone === "light" ? "text-paper" : "text-ink";
  return (
    <div className={`flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] ${baseCls}`}>
      <span className="font-medium">EN</span>
      <span aria-hidden className="opacity-40">·</span>
      <span
        aria-disabled="true"
        title="Vietnamese coming soon"
        className="opacity-40"
      >
        VI
      </span>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add app/_hooks/use-scroll-state.ts app/_hooks/use-focus-trap.ts app/_components/site-header.tsx
git commit -m "feat(shell): SiteHeader with mobile drawer + focus trap"
```

---

## Task 4.4 — `<RevealOnScroll>` wrapper

A client component that toggles `is-visible` once the element enters the viewport. Honors `prefers-reduced-motion`.

**Files:**
- Create: `app/_hooks/use-reveal-on-scroll.ts`
- Create: `app/_components/reveal-on-scroll.tsx`

- [ ] **Step 1: Write `app/_hooks/use-reveal-on-scroll.ts`**

```ts
"use client";

import { useEffect, useRef, useState } from "react";

export function useRevealOnScroll<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}
```

- [ ] **Step 2: Write `app/_components/reveal-on-scroll.tsx`**

```tsx
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
```

- [ ] **Step 3: Commit**

```bash
git add app/_hooks/use-reveal-on-scroll.ts app/_components/reveal-on-scroll.tsx
git commit -m "feat(motion): RevealOnScroll wrapper (IntersectionObserver, fires once)"
```

---

## Task 4.5 — `(site)/layout.tsx`

The route-group layout that wraps every public page with the header, main landmark, and footer.

**Files:**
- Create: `app/(site)/layout.tsx`

- [ ] **Step 1: Write `app/(site)/layout.tsx`**

```tsx
import { SiteHeader } from "@/app/_components/site-header";
import { SiteFooter } from "@/app/_components/site-footer";
import { SkipToContent } from "@/app/_components/skip-to-content";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SkipToContent />
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </>
  );
}
```

- [ ] **Step 2: Move the placeholder home page into the route group**

```bash
mkdir -p app/\(site\)
git mv app/page.tsx app/\(site\)/page.tsx
```

The placeholder homepage now renders inside the shell.

- [ ] **Step 3: Boot dev server and verify**

```bash
bun run dev
```

Visit `http://localhost:3000`. Expected: cream background, transparent header over the cream placeholder, ink footer below. Stop the server.

- [ ] **Step 4: Commit**

```bash
git add app/\(site\)/layout.tsx app/\(site\)/page.tsx
git commit -m "feat(shell): (site) route group with header + footer wrap"
```

---

# Phase 5 — Homepage sections

Build each section as its own RSC (or marked client where required). Wire them all in Task 5.8.

## Task 5.1 — `<Hero>` section

**Files:**
- Create: `app/_components/sections/hero.tsx`

- [ ] **Step 1: Write `app/_components/sections/hero.tsx`**

```tsx
import { DisplayHeading } from "@/app/_components/primitives/display-heading";
import { Eyebrow } from "@/app/_components/primitives/eyebrow";
import { HairlineRule } from "@/app/_components/primitives/hairline-rule";
import { KpiStrip } from "@/app/_components/primitives/kpi-strip";
import { site } from "@/content/en/site";

const KPIS = [
  { label: "Years", value: "30+" },
  { label: "Sub-distributors", value: "300+" },
  { label: "Retail outlets", value: "180K" },
  { label: "Salesmen", value: "800+" },
];

export function Hero() {
  return (
    <section
      aria-label="Hero"
      className="relative grid min-h-[100svh] grid-cols-1 bg-green text-paper lg:grid-cols-[1.1fr_0.9fr]"
    >
      <div className="relative hidden overflow-hidden lg:block">
        <span
          aria-hidden
          className="absolute -left-32 top-1/3 h-[480px] w-[480px] rounded-full bg-gold/30 blur-3xl motion-safe:animate-[pulse_8s_ease-in-out_infinite]"
        />
        <span
          aria-hidden
          className="absolute right-10 top-10 h-[260px] w-[260px] rounded-full bg-gold/20 blur-3xl motion-safe:animate-[pulse_10s_ease-in-out_infinite]"
        />
        <svg
          aria-hidden
          viewBox="0 0 600 800"
          className="absolute inset-0 h-full w-full opacity-30"
        >
          <path
            d="M50 700 Q 200 400 550 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2 8"
            className="text-gold"
          />
        </svg>
        <span className="absolute bottom-10 left-10 text-[11px] uppercase tracking-[0.32em] text-gold">
          {site.countries.join(" · ")}
        </span>
      </div>

      <div className="flex flex-col justify-center gap-10 px-6 py-32 sm:px-10 sm:py-40 lg:px-[120px]">
        <Eyebrow tone="gold">Established {site.founded}</Eyebrow>
        <DisplayHeading level={1} tone="white">
          From market entry to *nationwide distribution*.
        </DisplayHeading>
        <p className="max-w-[440px] text-[17px] leading-[1.55] text-paper/75">
          {site.description}
        </p>
        <HairlineRule tone="white-15" />
        <KpiStrip items={KPIS} tone="on-green" />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/_components/sections/hero.tsx
git commit -m "feat(home): Hero section (split, KPI strip, breathing bloom)"
```

---

## Task 5.2 — `<WhatWeDo>` 4-pillar strip

**Files:**
- Create: `app/_components/sections/what-we-do.tsx`

- [ ] **Step 1: Write `app/_components/sections/what-we-do.tsx`**

```tsx
import Link from "next/link";
import { Eyebrow } from "@/app/_components/primitives/eyebrow";
import { DisplayHeading } from "@/app/_components/primitives/display-heading";
import { HairlineRule } from "@/app/_components/primitives/hairline-rule";
import { RevealOnScroll } from "@/app/_components/reveal-on-scroll";
import { pillars } from "@/content/en/capabilities";

export function WhatWeDo() {
  return (
    <section
      aria-labelledby="what-we-do-heading"
      className="bg-cream px-6 py-[clamp(72px,8vw,100px)] sm:px-10"
    >
      <div className="mx-auto flex max-w-[1300px] flex-col gap-12">
        <div className="flex flex-col gap-6">
          <Eyebrow tone="gold">What we do</Eyebrow>
          <DisplayHeading level={2} tone="ink" className="max-w-[18ch]">
            Four ways we move *brands* to market.
          </DisplayHeading>
        </div>

        <HairlineRule />

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, idx) => (
            <RevealOnScroll
              key={p.number}
              as="article"
              delayMs={idx * 80}
              className="flex flex-col gap-4"
            >
              <span className="font-display text-[40px] italic leading-none text-gold">
                {p.number}
              </span>
              <h3 className="text-[18px] font-semibold text-ink">{p.name}</h3>
              <p className="max-w-[28ch] text-[14px] leading-[1.55] text-muted">
                {p.shortBody}
              </p>
              <Link
                href={p.href}
                className="text-[11px] font-medium uppercase tracking-[0.32em] text-gold underline decoration-gold underline-offset-[6px] hover:text-gold/80"
              >
                Read more →
              </Link>
            </RevealOnScroll>
          ))}
        </div>

        <HairlineRule />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/_components/sections/what-we-do.tsx
git commit -m "feat(home): WhatWeDo 4-pillar strip"
```

---

## Task 5.3 — `<FootprintMap>` (client)

**Files:**
- Create: `app/_components/sections/footprint-map.tsx`

- [ ] **Step 1: Write `app/_components/sections/footprint-map.tsx`**

```tsx
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
          <DisplayHeading level={2}>
            An *international* group with deep local roots.
          </DisplayHeading>
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
```

- [ ] **Step 2: Commit**

```bash
git add app/_components/sections/footprint-map.tsx
git commit -m "feat(home): FootprintMap with inline SVG and IO-paused pin pulses"
```

---

## Task 5.4 — `<Timeline>` (client, two variants)

**Files:**
- Create: `app/_components/sections/timeline.tsx`

- [ ] **Step 1: Write `app/_components/sections/timeline.tsx`**

```tsx
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
          <DisplayHeading level={2} tone="white" id="timeline-heading">
            {heading}
          </DisplayHeading>
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
```

- [ ] **Step 2: Commit**

```bash
git add app/_components/sections/timeline.tsx
git commit -m "feat(home): Timeline section with compact + detail variants"
```

---

## Task 5.5 — `<BrandWall>`

**Files:**
- Create: `app/_components/sections/brand-wall.tsx`

- [ ] **Step 1: Write `app/_components/sections/brand-wall.tsx`**

```tsx
import { BrandCell } from "@/app/_components/primitives/brand-cell";
import { Eyebrow } from "@/app/_components/primitives/eyebrow";
import { DisplayHeading } from "@/app/_components/primitives/display-heading";
import { homepageBrands } from "@/content/en/brands";

export function BrandWall() {
  return (
    <section
      aria-labelledby="brand-wall-heading"
      className="bg-cream px-6 py-[clamp(96px,11vw,140px)] sm:px-10"
    >
      <div className="mx-auto flex max-w-[1300px] flex-col gap-14">
        <div className="flex flex-col gap-6">
          <Eyebrow tone="gold">Our brands</Eyebrow>
          <DisplayHeading
            level={2}
            id="brand-wall-heading"
            className="max-w-[24ch]"
          >
            Trusted by the world's most *loved* brands.
          </DisplayHeading>
        </div>

        <div className="grid grid-cols-2 gap-px bg-line sm:grid-cols-4">
          {homepageBrands.map((b) => (
            <BrandCell
              key={b.name}
              name={b.name}
              country={b.country}
              logoSrc={b.logoSrc}
              feature={b.feature}
              featureCaption={b.featureCaption}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/_components/sections/brand-wall.tsx
git commit -m "feat(home): BrandWall with feature cell + 8 brand cells"
```

---

## Task 5.6 — `<JvFeature>` (Dory Rich)

**Files:**
- Create: `app/_components/sections/jv-feature.tsx`

- [ ] **Step 1: Write `app/_components/sections/jv-feature.tsx`**

```tsx
import { Eyebrow } from "@/app/_components/primitives/eyebrow";
import { DisplayHeading } from "@/app/_components/primitives/display-heading";
import { SoftCta } from "@/app/_components/primitives/soft-cta";
import { site } from "@/content/en/site";

type Variant = "full" | "slim";

export function JvFeature({ variant = "full" }: { variant?: Variant }) {
  return (
    <section
      aria-labelledby="jv-heading"
      className={`bg-ink px-6 py-[clamp(120px,14vw,200px)] sm:px-10 ${
        variant === "slim" ? "py-[clamp(72px,8vw,100px)]" : ""
      }`}
    >
      <div className="mx-auto max-w-[1300px]">
        <div className="flex flex-col gap-6">
          <Eyebrow tone="gold">Joint venture</Eyebrow>
          <DisplayHeading level={2} tone="white" id="jv-heading">
            Dory Rich JSC.
          </DisplayHeading>
        </div>

        <div className="relative mt-12 border border-gold p-10 sm:p-16 lg:p-20">
          <span className="absolute -top-3 left-10 bg-ink px-3 font-display italic text-gold">
            JV
          </span>

          <div className="grid gap-12 lg:grid-cols-[2fr_1fr]">
            <div className="flex flex-col gap-6">
              <span className="text-[11px] uppercase tracking-[0.32em] text-gold">
                Established 2024 · TCP Group × Richfield
              </span>
              <h3 className="font-display text-[clamp(32px,4vw,42px)] leading-[1.1] text-paper">
                A successful collaboration between two leading corporations.
              </h3>
              <p className="max-w-[55ch] text-[17px] leading-[1.55] text-paper/70">
                Dory Rich JSC pairs TCP Group's leadership in Thai energy-drink
                production with Richfield Group's nationwide FMCG distribution
                capability in Vietnam. Manufacturing, brand-building, and
                distribution under one roof.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center gap-6 text-center lg:items-start lg:text-left">
              <span className="font-display text-[clamp(56px,6vw,80px)] italic leading-[1] text-gold">
                Dory
                <br />
                Rich
              </span>
              <SoftCta href={site.external.doryRich} external>
                Visit doryrich.com.vn
              </SoftCta>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/_components/sections/jv-feature.tsx
git commit -m "feat(home): JvFeature (Dory Rich) with full + slim variants"
```

---

## Task 5.7 — `<SoftCtaCloser>`

**Files:**
- Create: `app/_components/sections/soft-cta-closer.tsx`

- [ ] **Step 1: Write `app/_components/sections/soft-cta-closer.tsx`**

```tsx
import { SoftCta } from "@/app/_components/primitives/soft-cta";

export function SoftCtaCloser() {
  return (
    <section
      aria-label="Get in touch"
      className="bg-green px-6 py-[clamp(72px,8vw,100px)] sm:px-10"
    >
      <div className="mx-auto flex max-w-[720px] flex-col items-center gap-8 text-center">
        <p className="font-display text-[clamp(32px,4vw,48px)] italic leading-[1.2] text-paper">
          Loved brands deserve a deliberate distributor.
        </p>
        <p className="text-[15px] text-paper/70">
          Talk to our partnerships team.
        </p>
        <SoftCta href="/contact">Get in touch</SoftCta>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/_components/sections/soft-cta-closer.tsx
git commit -m "feat(home): SoftCtaCloser"
```

---

## Task 5.8 — Wire homepage `/`

**Files:**
- Modify: `app/(site)/page.tsx`

- [ ] **Step 1: Overwrite `app/(site)/page.tsx`**

```tsx
import type { Metadata } from "next";
import { Hero } from "@/app/_components/sections/hero";
import { WhatWeDo } from "@/app/_components/sections/what-we-do";
import { FootprintMap } from "@/app/_components/sections/footprint-map";
import { Timeline } from "@/app/_components/sections/timeline";
import { BrandWall } from "@/app/_components/sections/brand-wall";
import { JvFeature } from "@/app/_components/sections/jv-feature";
import { SoftCtaCloser } from "@/app/_components/sections/soft-cta-closer";
import { homepageMilestones } from "@/content/en/milestones";
import { site } from "@/content/en/site";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Richfield Group — From Market Entry to Nationwide Distribution",
  description: site.description,
  alternates: { canonical: site.domainCanonical },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.legalName,
  alternateName: site.name,
  url: site.domainCanonical,
  logo: `${site.domainCanonical}/og.png`,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.line1,
    addressLocality: "Ho Chi Minh City",
    addressCountry: "VN",
  },
  telephone: site.phones.officeTel,
  sameAs: [
    site.socials.facebook,
    site.socials.linkedin,
    site.socials.zalo,
  ].filter(Boolean),
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(orgJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Hero />
      <WhatWeDo />
      <FootprintMap />
      <Timeline
        milestones={homepageMilestones}
        eyebrow="Our journey"
        heading="A story of *partnerships* over thirty years."
      />
      <BrandWall />
      <JvFeature variant="full" />
      <SoftCtaCloser />
    </>
  );
}
```

- [ ] **Step 2: Build to confirm everything compiles**

```bash
bun run build
```

Expected: build succeeds. Visit `/` in dev (`bun run dev`) and scroll through every section. Confirm:
- Hero: green bg, italic gold "nationwide distribution", KPI strip with all 4 cells.
- What We Do: 4 pillars with hairlines top and bottom.
- Footprint Map: 3 country list, SVG map with 3 pins, pulses fire.
- Timeline: ink bg, 7 milestones across, axis line under year dots.
- Brand Wall: 4-col grid, feature cell renders Mars · Wrigley.
- JV Feature: gold border card with `Dory Rich` lockup.
- Soft CTA: green bg, italic line, "Get in touch" link.
- Footer: ink bg, 4 columns, hairline + © row.

- [ ] **Step 3: Commit**

```bash
git add app/\(site\)/page.tsx
git commit -m "feat(home): wire homepage with metadata + Organization JSON-LD"
```

---

# Phase 5.5 — Design review gate

After Phase 5 wires the homepage end to end, run a design review gate **before** any inner-page work begins. This is the moment to fix anything that's wrong about the editorial direction — Phase 6+ replicate homepage conventions, so problems compound if they leak through.

## Task 5.5.1 — Impeccable design audit

Invoke `impeccable critique app/(site)/page.tsx` (or the equivalent skill invocation in the active environment) against the live homepage at `localhost:3000`. The skill will:

- Verify the design laws (color, theme, typography, layout, motion, copy, AI-slop test).
- Score against absolute bans (no side-stripe borders, no gradient text, no glassmorphism by default, no hero-metric template, no identical card grids, no modal-as-first-thought).
- Cross-check that the brand register is editorial throughout (not product-app patterns leaking in).
- Audit color strategy (Committed: gold + green carrying 30-60% of surface).

Apply every Critical and Important finding inline as a `fix(design):` commit. Defer Minor findings to MAINTENANCE.md unless they're trivially resolved on the spot.

## Task 5.5.2 — UI/UX Pro Max review

Invoke the `ui-ux-promax` skill (or equivalent) against the live homepage. Where impeccable focuses on craft/aesthetics, this pass focuses on user-experience integrity:

- Information hierarchy (does the eye land where it should?).
- Section transitions (do tonal shifts read as intentional rhythm or jarring jumps?).
- Reading flow (lede length, body line-cap at 65-75ch, eyebrow-to-h2 spacing).
- Mobile reading experience (390px viewport — is the hero readable, do the KPIs stack legibly, does the timeline horizontal-scroll feel intentional?).
- A11y in practice: VoiceOver pass on the hero + footprint map + brand wall.
- Scroll budget: top-to-bottom on a throttled 4G profile, motion behavior, reveal cascade timing.

Apply findings inline. If a finding requires changes that break a primitive (e.g., spacing token shift), update the primitive and accept the cascade.

## Task 5.5.3 — Approval gate

After both critiques are addressed, **stop and present a summary to the user**:

- What impeccable flagged and how it was resolved.
- What ui-ux-promax flagged and how it was resolved.
- Any remaining Open Items added to MAINTENANCE.md.
- A pointer to the live `/` route at `localhost:3000`.

The user reviews the homepage. If they approve, proceed to Phase 6. If they request changes, treat each as a `fix(design):` commit before unblocking Phase 6.

This is the **last design checkpoint** before inner pages replicate the homepage conventions. Don't skip it.

---

# Phase 6 — Inner pages (production)

Each inner page composes existing primitives and sections, with a `<PageHeader>` band on top and the `<SoftCtaCloser>` at the end. Add per-page `metadata`.

## Task 6.1 — `/about`

**Files:**
- Create: `app/(site)/about/page.tsx`

- [ ] **Step 1: Write `app/(site)/about/page.tsx`**

```tsx
import type { Metadata } from "next";
import { PageHeader } from "@/app/_components/primitives/page-header";
import { SectionHeading } from "@/app/_components/primitives/section-heading";
import { HairlineRule } from "@/app/_components/primitives/hairline-rule";
import { Timeline } from "@/app/_components/sections/timeline";
import { FootprintMap } from "@/app/_components/sections/footprint-map";
import { SoftCtaCloser } from "@/app/_components/sections/soft-cta-closer";
import { milestones } from "@/content/en/milestones";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "About",
  description:
    "Three countries. Three generations. One promise. Richfield Group's story across Vietnam, Malaysia, and China.",
  alternates: { canonical: "/about" },
};

const VALUES = [
  "People-first",
  "Long-term partnerships",
  "Sustainable growth",
  "Community impact",
];

const HERITAGE_PARAGRAPHS = [
  "Richfield JSC Group is proud to be one of the largest FMCG distributors in Vietnam. At present, our distribution network is the largest distribution system in the country, covering all provinces and cities nationwide with more than 300 sub-distributors and nearly 180,000 retail outlets nationwide.",
  "We began as a family business in Malaysia and grew across three generations into the international group we are today. The same trust and craft that started the business still anchors how we work.",
  "Our partnerships are long. Many run for decades. Each new brand we take on becomes part of how we move product across the country, market by market, year by year.",
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        heading="Three countries. Three *generations*. One promise."
        lede="Richfield Group is one of Vietnam's largest FMCG distributors. We've spent more than thirty years building a distribution network that reaches every province, supported by family-business values that started in Malaysia."
      />

      <section className="bg-cream px-6 py-[clamp(96px,11vw,140px)] sm:px-10">
        <div className="mx-auto grid max-w-[1300px] gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            {HERITAGE_PARAGRAPHS.map((p) => (
              <p key={p.slice(0, 24)} className="max-w-[60ch] text-[17px] leading-[1.6] text-ink">
                {p}
              </p>
            ))}
          </div>
          <div className="flex flex-col">
            <SectionHeading heading="Values" eyebrow="What we stand for" level={3} />
            <ul className="mt-8 flex flex-col">
              {VALUES.map((v) => (
                <li
                  key={v}
                  className="border-t border-line py-6 font-display text-[28px] text-ink"
                >
                  {v}
                </li>
              ))}
              <HairlineRule />
            </ul>
          </div>
        </div>
      </section>

      <Timeline
        milestones={milestones}
        variant="detail"
        eyebrow="Our journey"
        heading="A story of *partnerships* over thirty years."
      />

      <FootprintMap />

      <SoftCtaCloser />
    </>
  );
}
```

- [ ] **Step 2: Build, then visit `/about` in dev**

```bash
bun run build
```

Expected: compiles. Page header with green-italic *generations*, heritage paragraphs, values list, full timeline (8 entries), footprint map, soft CTA.

- [ ] **Step 3: Commit**

```bash
git add app/\(site\)/about/page.tsx
git commit -m "feat(page): /about with heritage, values, full timeline"
```

---

## Task 6.2 — `/brands`

**Files:**
- Create: `app/(site)/brands/page.tsx`

- [ ] **Step 1: Write `app/(site)/brands/page.tsx`**

```tsx
import type { Metadata } from "next";
import { PageHeader } from "@/app/_components/primitives/page-header";
import { BrandCell } from "@/app/_components/primitives/brand-cell";
import { JvFeature } from "@/app/_components/sections/jv-feature";
import { SoftCtaCloser } from "@/app/_components/sections/soft-cta-closer";
import { brands, featuredPartners } from "@/content/en/brands";
import { Eyebrow } from "@/app/_components/primitives/eyebrow";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Brands",
  description:
    "Across confectionery, beverages, personal care, and stationery, Richfield distributes the brands shoppers in Vietnam already know.",
  alternates: { canonical: "/brands" },
};

const CATEGORIES: Array<NonNullable<(typeof brands)[number]["category"]>> = [
  "Confectionery",
  "Beverages",
  "Personal & Lifestyle",
  "Stationery & Crafts",
];

export default function BrandsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our brands"
        heading="The complete *portfolio*."
        lede="Across confectionery, beverages, personal care, and stationery, Richfield distributes the brands shoppers in Vietnam already know. Each partnership is a long-term relationship; many have run for decades."
      />

      <section className="bg-cream px-6 py-[clamp(72px,8vw,100px)] sm:px-10">
        <div className="mx-auto grid max-w-[1300px] gap-px bg-line sm:grid-cols-3">
          {featuredPartners.map((p) => (
            <article
              key={p.name}
              className="flex flex-col gap-4 bg-paper p-10"
            >
              <span className="font-display text-[40px] italic text-gold">
                {p.name}
              </span>
              <span className="text-[11px] uppercase tracking-[0.32em] text-muted">
                {p.country} · Since {p.year}
              </span>
              <p className="max-w-[40ch] text-[15px] leading-[1.55] text-muted">
                {p.story}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-cream px-6 py-[clamp(96px,11vw,140px)] sm:px-10">
        <div className="mx-auto flex max-w-[1300px] flex-col gap-16">
          {CATEGORIES.map((category) => {
            const cells = brands.filter((b) => b.category === category);
            if (!cells.length) return null;
            return (
              <div key={category} className="flex flex-col gap-6">
                <Eyebrow tone="gold">{category}</Eyebrow>
                <div className="grid grid-cols-2 gap-px bg-line sm:grid-cols-4">
                  {cells.map((b) => (
                    <BrandCell
                      key={b.name}
                      name={b.name}
                      country={b.country}
                      logoSrc={b.logoSrc}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <JvFeature variant="slim" />
      <SoftCtaCloser />
    </>
  );
}
```

- [ ] **Step 2: Build and visually verify**

```bash
bun run build
```

- [ ] **Step 3: Commit**

```bash
git add app/\(site\)/brands/page.tsx
git commit -m "feat(page): /brands with featured partners + category grids"
```

---

## Task 6.3 — `/careers`

**Files:**
- Create: `app/(site)/careers/page.tsx`

- [ ] **Step 1: Write `app/(site)/careers/page.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/app/_components/primitives/page-header";
import { Eyebrow } from "@/app/_components/primitives/eyebrow";
import { HairlineRule } from "@/app/_components/primitives/hairline-rule";
import { SoftCta } from "@/app/_components/primitives/soft-cta";
import { SoftCtaCloser } from "@/app/_components/sections/soft-cta-closer";
import { whyRichfield, heritageBlock, openPositions } from "@/content/en/careers";
import { site } from "@/content/en/site";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Careers",
  description: heritageBlock.slice(0, 160),
  alternates: { canonical: "/careers" },
};

export default function CareersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Careers"
        heading="A legacy of growth. A future of *opportunity*."
        tone="green"
      />

      <section className="bg-cream px-6 py-[clamp(96px,11vw,140px)] sm:px-10">
        <div className="mx-auto flex max-w-[1300px] flex-col gap-12">
          <Eyebrow tone="gold">Why Richfield</Eyebrow>
          <ul className="flex flex-col">
            {whyRichfield.map((p) => (
              <li
                key={p.heading}
                className="grid gap-4 border-t border-line py-8 lg:grid-cols-[28ch_1fr] lg:gap-12"
              >
                <h3 className="font-display text-[clamp(24px,2.5vw,32px)] text-ink">
                  {p.heading}
                </h3>
                <p className="max-w-[60ch] text-[17px] leading-[1.55] text-muted">
                  {p.body}
                </p>
              </li>
            ))}
            <HairlineRule />
          </ul>
        </div>
      </section>

      <section className="bg-paper px-6 py-[clamp(96px,11vw,140px)] sm:px-10">
        <div className="mx-auto max-w-[60ch]">
          <p className="text-[clamp(20px,2vw,24px)] leading-[1.55] text-ink">
            {heritageBlock}
          </p>
        </div>
      </section>

      <section className="bg-cream px-6 py-[clamp(96px,11vw,140px)] sm:px-10">
        <div className="mx-auto flex max-w-[1300px] flex-col gap-8">
          <Eyebrow tone="gold">Life at Richfield</Eyebrow>
          <p className="max-w-[60ch] text-[17px] leading-[1.55] text-muted">
            We share moments from across our offices and warehouses on Facebook.
          </p>
          <SoftCta href={site.socials.facebook} external>
            Follow on Facebook
          </SoftCta>
        </div>
      </section>

      <section className="bg-ink px-6 py-[clamp(96px,11vw,140px)] sm:px-10 text-paper">
        <div className="mx-auto flex max-w-[1300px] flex-col gap-8">
          <Eyebrow tone="gold">Open positions</Eyebrow>
          {openPositions.length === 0 ? (
            <div className="flex flex-col gap-4 border-t border-paper/15 py-8">
              <p className="max-w-[60ch] text-[17px] leading-[1.55] text-paper/70">
                We're not actively recruiting right now. Reach out anyway; we'd
                like to hear from people who fit our story.
              </p>
              <Link
                href="/contact"
                className="text-[11px] font-medium uppercase tracking-[0.32em] text-gold underline decoration-gold underline-offset-[6px]"
              >
                Get in touch →
              </Link>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-[0.16em] text-paper/60">
                  <th className="border-b border-paper/15 py-4">Job title</th>
                  <th className="border-b border-paper/15 py-4">Positions</th>
                  <th className="border-b border-paper/15 py-4">Location</th>
                  <th className="border-b border-paper/15 py-4">Deadline</th>
                </tr>
              </thead>
              <tbody>
                {openPositions.map((p) => (
                  <tr key={p.title} className="text-[15px] text-paper/85">
                    <td className="border-b border-paper/10 py-4">
                      {p.href ? (
                        <Link href={p.href} className="hover:text-gold">
                          {p.title}
                        </Link>
                      ) : (
                        p.title
                      )}
                    </td>
                    <td className="border-b border-paper/10 py-4">{p.positions}</td>
                    <td className="border-b border-paper/10 py-4">{p.location}</td>
                    <td className="border-b border-paper/10 py-4">{p.deadline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <SoftCtaCloser />
    </>
  );
}
```

- [ ] **Step 2: Build**

```bash
bun run build
```

- [ ] **Step 3: Commit**

```bash
git add app/\(site\)/careers/page.tsx
git commit -m "feat(page): /careers with why-richfield, heritage, life-at, positions"
```

---

## Task 6.4 — Contact: schema, Server Action, page

This task has three sub-tasks because the Server Action has real logic that should be tested.

### 6.4a — Zod schema (TDD)

**Files:**
- Create: `app/(site)/contact/schema.ts`
- Create: `__tests__/contact/schema.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { contactSchema, INQUIRY_TYPES } from "@/app/(site)/contact/schema";

describe("contactSchema", () => {
  it("rejects empty name", () => {
    const r = contactSchema.safeParse({
      name: "",
      company: "Acme",
      email: "x@example.com",
      inquiryType: "Brand partnership",
      message: "Hello",
      website: "",
    });
    expect(r.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const r = contactSchema.safeParse({
      name: "Asha",
      company: "Acme",
      email: "not-an-email",
      inquiryType: "Brand partnership",
      message: "Hello",
      website: "",
    });
    expect(r.success).toBe(false);
  });

  it("rejects unknown inquiry type", () => {
    const r = contactSchema.safeParse({
      name: "Asha",
      company: "Acme",
      email: "asha@example.com",
      inquiryType: "Spam",
      message: "Hello",
      website: "",
    });
    expect(r.success).toBe(false);
  });

  it("rejects when honeypot 'website' field is filled", () => {
    const r = contactSchema.safeParse({
      name: "Asha",
      company: "Acme",
      email: "asha@example.com",
      inquiryType: "Brand partnership",
      message: "Hello",
      website: "http://spam.example",
    });
    expect(r.success).toBe(false);
  });

  it("accepts a valid payload", () => {
    const r = contactSchema.safeParse({
      name: "Asha",
      company: "Acme",
      country: "Vietnam",
      email: "asha@example.com",
      inquiryType: "Brand partnership",
      message: "We'd like to discuss distribution.",
      website: "",
    });
    expect(r.success).toBe(true);
  });

  it("exposes 5 inquiry types", () => {
    expect(INQUIRY_TYPES).toHaveLength(5);
  });
});
```

- [ ] **Step 2: Run the test — expect failure**

```bash
bun run test:unit __tests__/contact/schema.test.ts
```

- [ ] **Step 3: Implement `app/(site)/contact/schema.ts`**

```ts
import { z } from "zod";

export const INQUIRY_TYPES = [
  "Brand partnership",
  "Distribution opportunity",
  "Careers",
  "Press",
  "Other",
] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name."),
  company: z.string().trim().min(1, "Please enter your company."),
  country: z.string().trim().optional().default("Vietnam"),
  email: z.string().trim().email("Please enter a valid email."),
  inquiryType: z.enum(INQUIRY_TYPES),
  message: z
    .string()
    .trim()
    .min(1, "Please add a message.")
    .max(600, "Please keep your message under 600 characters."),
  // Honeypot — must be empty.
  website: z
    .string()
    .max(0, "Detected automated submission.")
    .optional()
    .default(""),
});

export type ContactInput = z.infer<typeof contactSchema>;
```

- [ ] **Step 4: Run the test — expect pass**

```bash
bun run test:unit __tests__/contact/schema.test.ts
```

Expected: 6 tests pass.

- [ ] **Step 5: Commit**

```bash
git add app/\(site\)/contact/schema.ts __tests__/contact/schema.test.ts
git commit -m "feat(contact): zod schema with honeypot and inquiry enum"
```

### 6.4b — Server Action

**Files:**
- Create: `app/(site)/contact/actions.ts`

- [ ] **Step 1: Write `app/(site)/contact/actions.ts`**

```ts
"use server";

import { contactSchema } from "./schema";
import { site } from "@/content/en/site";

export type ContactState =
  | { status: "idle" }
  | { status: "ok" }
  | { status: "error"; errors: Record<string, string[]>; values: Record<string, string> };

const FALLBACK_INBOX = "cskh@richfieldvn.com.vn";

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const raw = Object.fromEntries(formData.entries());

  // Anti-spam: 3-second submission delay (spec §6.4). Reject if the form
  // posts within 3s of mount, which catches automated fillers.
  const submittedAt = Number(raw.submittedAtMs);
  if (!Number.isFinite(submittedAt) || Date.now() - submittedAt < 3000) {
    return {
      status: "error",
      errors: { _form: ["Please give us a moment before submitting."] },
      values: Object.fromEntries(
        Object.entries(raw).filter(
          ([k]) => k !== "website" && k !== "submittedAtMs",
        ),
      ) as Record<string, string>,
    };
  }

  const parsed = contactSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      status: "error",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      values: Object.fromEntries(
        Object.entries(raw).filter(
          ([k]) => k !== "website" && k !== "submittedAtMs",
        ),
      ) as Record<string, string>,
    };
  }

  const { name, company, country, email, inquiryType, message } = parsed.data;
  const inbox = process.env.RICHFIELD_LEAD_INBOX ?? FALLBACK_INBOX;

  try {
    await deliverLead({ name, company, country, email, inquiryType, message, inbox });
  } catch {
    return {
      status: "error",
      errors: {
        _form: [
          `We couldn't send your message. Try email at ${site.email}.`,
        ],
      },
      values: parsed.data as unknown as Record<string, string>,
    };
  }

  return { status: "ok" };
}

async function deliverLead(input: {
  name: string;
  company: string;
  country: string;
  email: string;
  inquiryType: string;
  message: string;
  inbox: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] RESEND_API_KEY missing; lead would be delivered:", input);
      return;
    }
    throw new Error("RESEND_API_KEY missing in production");
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: `Richfield Site <noreply@${new URL(site.domainCanonical).hostname}>`,
      to: input.inbox,
      reply_to: input.email,
      subject: `[Richfield site] ${input.inquiryType} from ${input.company}`,
      text: [
        `Name: ${input.name}`,
        `Company: ${input.company}`,
        `Country: ${input.country}`,
        `Email: ${input.email}`,
        `Inquiry type: ${input.inquiryType}`,
        "",
        "Message:",
        input.message,
      ].join("\n"),
    }),
  });
  if (!res.ok) {
    throw new Error(`Resend API failed with status ${res.status}`);
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/\(site\)/contact/actions.ts
git commit -m "feat(contact): server action with zod validation and resend delivery"
```

### 6.4c — `<ContactForm>` client + page

**Files:**
- Create: `app/_components/forms/contact-form.tsx`
- Create: `app/(site)/contact/page.tsx`

- [ ] **Step 1: Write `app/_components/forms/contact-form.tsx`**

```tsx
"use client";

import { useActionState, useId, useState } from "react";
import { submitContact, type ContactState } from "@/app/(site)/contact/actions";
import { INQUIRY_TYPES } from "@/app/(site)/contact/schema";

const initial: ContactState = { status: "idle" };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initial);
  const formId = useId();
  // Capture mount-time once. Posted as a hidden field; the action rejects
  // submissions faster than 3s as automated.
  const [submittedAtMs] = useState(() => String(Date.now()));

  if (state.status === "ok") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="border-t border-line pt-10"
      >
        <p className="font-display text-[clamp(24px,2.5vw,32px)] text-ink">
          Thanks. We'll write back from our partnerships team within two
          business days.
        </p>
      </div>
    );
  }

  const errors = state.status === "error" ? state.errors : {};
  const values = state.status === "error" ? state.values : {};

  return (
    <form action={formAction} id={formId} className="flex flex-col gap-6" noValidate>
      <input type="hidden" name="submittedAtMs" value={submittedAtMs} />
      {/* Honeypot. Visually hidden but tab-skipped. */}
      <label className="sr-only" aria-hidden="true">
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>

      {errors._form ? (
        <p
          role="alert"
          className="border-l-0 border-t border-gold pt-4 text-[15px] text-ink"
        >
          {errors._form.join(" ")}
        </p>
      ) : null}

      <Field
        label="Name"
        name="name"
        required
        defaultValue={values.name}
        errors={errors.name}
        autoComplete="name"
      />
      <Field
        label="Company"
        name="company"
        required
        defaultValue={values.company}
        errors={errors.company}
        autoComplete="organization"
      />
      <Field
        label="Country"
        name="country"
        defaultValue={values.country ?? "Vietnam"}
        errors={errors.country}
        autoComplete="country-name"
      />
      <Field
        label="Email"
        name="email"
        type="email"
        required
        defaultValue={values.email}
        errors={errors.email}
        autoComplete="email"
      />

      <FieldShell label="Inquiry type" name="inquiryType" errors={errors.inquiryType}>
        <select
          name="inquiryType"
          defaultValue={values.inquiryType ?? INQUIRY_TYPES[0]}
          className="w-full border-b border-line bg-transparent py-3 text-[17px] focus:border-gold focus:outline-none"
        >
          {INQUIRY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </FieldShell>

      <FieldShell label="Message" name="message" errors={errors.message}>
        <textarea
          name="message"
          rows={6}
          maxLength={600}
          required
          defaultValue={values.message ?? ""}
          className="w-full border-b border-line bg-transparent py-3 text-[17px] focus:border-gold focus:outline-none"
        />
      </FieldShell>

      <button
        type="submit"
        disabled={pending}
        className="self-start text-[11px] font-medium uppercase tracking-[0.32em] text-gold underline decoration-gold underline-offset-[6px] disabled:opacity-50"
      >
        {pending ? "Sending…" : "Send message →"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  defaultValue,
  errors,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  errors?: string[];
  autoComplete?: string;
}) {
  return (
    <FieldShell label={label} name={name} errors={errors} required={required}>
      <input
        type={type}
        name={name}
        required={required}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        className="w-full border-b border-line bg-transparent py-3 text-[17px] focus:border-gold focus:outline-none"
      />
    </FieldShell>
  );
}

function FieldShell({
  label,
  name,
  required,
  errors,
  children,
}: {
  label: string;
  name: string;
  required?: boolean;
  errors?: string[];
  children: React.ReactNode;
}) {
  const errorId = `${name}-error`;
  return (
    <label className="flex flex-col gap-2" htmlFor={name}>
      <span className="text-[11px] uppercase tracking-[0.32em] text-muted">
        {label}
        {required ? <span aria-hidden> *</span> : null}
      </span>
      {children}
      {errors?.length ? (
        <span id={errorId} role="alert" className="text-[14px] text-gold">
          {errors.join(" ")}
        </span>
      ) : null}
    </label>
  );
}
```

- [ ] **Step 2: Write `app/(site)/contact/page.tsx`**

```tsx
import type { Metadata } from "next";
import { PageHeader } from "@/app/_components/primitives/page-header";
import { ContactForm } from "@/app/_components/forms/contact-form";
import { Eyebrow } from "@/app/_components/primitives/eyebrow";
import { site } from "@/content/en/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us about your brand. Whether you're a brand owner, partner, or journalist, we'll get back to you.",
  alternates: { canonical: "/contact" },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: site.legalName,
  url: site.domainCanonical,
  telephone: site.phones.officeTel,
  email: site.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.line1,
    addressLocality: "Ho Chi Minh City",
    addressRegion: "Nha Be",
    addressCountry: "VN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: site.address.geo.lat,
    longitude: site.address.geo.lng,
  },
};

const channels = [
  {
    label: "Office",
    primary: site.address.full,
    href: `https://www.google.com/maps?q=${encodeURIComponent(site.address.full)}`,
    cta: "Open on Google Maps ↗",
    external: true,
  },
  {
    label: "Hotline",
    primary: site.phones.hotline,
    href: `tel:${site.phones.hotlineTel}`,
    cta: "Call hotline",
  },
  {
    label: "Email",
    primary: site.email,
    href: `mailto:${site.email}`,
    cta: "Write us",
  },
  {
    label: "Social",
    primary: "Facebook · LinkedIn · Zalo",
    href: site.socials.facebook,
    cta: "Visit Facebook",
    external: true,
  },
];

export default function ContactPage() {
  const mapQuery = encodeURIComponent(site.address.full);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <PageHeader
        eyebrow="Contact"
        heading="Tell us about your *brand*."
        lede="Whether you're an international brand owner exploring Vietnam, a partner considering a joint venture, or a journalist on deadline, we'll get back to you."
      />

      <section className="bg-cream px-6 py-[clamp(72px,8vw,100px)] sm:px-10">
        <div className="mx-auto grid max-w-[1300px] gap-16 lg:grid-cols-2">
          <div className="flex flex-col">
            <Eyebrow tone="gold">Channels</Eyebrow>
            <ul className="mt-8 flex flex-col">
              {channels.map((c) => (
                <li
                  key={c.label}
                  className="grid gap-2 border-t border-line py-6 sm:grid-cols-[14ch_1fr]"
                >
                  <span className="text-[11px] uppercase tracking-[0.32em] text-muted">
                    {c.label}
                  </span>
                  <div className="flex flex-col gap-1">
                    <span className="text-[15px] text-ink">{c.primary}</span>
                    <a
                      href={c.href}
                      target={c.external ? "_blank" : undefined}
                      rel={c.external ? "noopener noreferrer" : undefined}
                      className="text-[11px] uppercase tracking-[0.32em] text-gold underline decoration-gold underline-offset-[6px]"
                    >
                      {c.cta}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Eyebrow tone="gold">Send a message</Eyebrow>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Office location" className="px-0">
        <iframe
          title="Richfield head-office on Google Maps"
          src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block h-[480px] w-full border-0"
        />
      </section>
    </>
  );
}
```

- [ ] **Step 3: Build, then dev-verify**

```bash
bun run build
```

Then `bun run dev`, visit `/contact`, submit the form. With no `RESEND_API_KEY` in env, the action logs the lead and returns `ok` (success message renders).

- [ ] **Step 4: Commit**

```bash
git add app/\(site\)/contact/page.tsx app/_components/forms/contact-form.tsx
git commit -m "feat(page): /contact with form + LocalBusiness JSON-LD + map embed"
```

---

# Phase 7 — Scaffold pages

Lighter than production pages but still respectable.

## Task 7.1 — `/what-we-do`

**Files:**
- Create: `app/(site)/what-we-do/page.tsx`

- [ ] **Step 1: Write `app/(site)/what-we-do/page.tsx`**

```tsx
import type { Metadata } from "next";
import { PageHeader } from "@/app/_components/primitives/page-header";
import { CapabilityBlock } from "@/app/_components/primitives/capability-block";
import { JvFeature } from "@/app/_components/sections/jv-feature";
import { SoftCtaCloser } from "@/app/_components/sections/soft-cta-closer";
import { SoftCta } from "@/app/_components/primitives/soft-cta";
import { pillars } from "@/content/en/capabilities";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "What we do",
  description:
    "Four ways Richfield Group moves brands to market: import / export, warehouse and logistics, general trade, and modern trade.",
  alternates: { canonical: "/what-we-do" },
};

export default function WhatWeDoPage() {
  return (
    <>
      <PageHeader
        eyebrow="What we do"
        heading="Four ways we move *brands* to market."
        lede="From customs to nationwide retail, the work spans four capabilities. Each one stands on its own; together they're how international brands reach Vietnam."
      />

      <section className="bg-cream px-6 py-[clamp(96px,11vw,140px)] sm:px-10">
        <div className="mx-auto grid max-w-[1300px] gap-12 lg:grid-cols-2">
          {pillars.map((p) => (
            <CapabilityBlock key={p.number} pillar={p} />
          ))}
        </div>
      </section>

      <JvFeature variant="slim" />

      <section className="bg-paper px-6 py-[clamp(72px,8vw,100px)] sm:px-10">
        <div className="mx-auto flex max-w-[60ch] flex-col gap-6 text-center">
          <p className="font-display text-[clamp(24px,2.5vw,32px)] italic text-ink">
            Curious which brands these capabilities support?
          </p>
          <div className="self-center">
            <SoftCta href="/brands">See the portfolio</SoftCta>
          </div>
        </div>
      </section>

      <SoftCtaCloser />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/\(site\)/what-we-do/page.tsx
git commit -m "feat(page): /what-we-do parent landing"
```

---

## Task 7.2 — `/distribution` (with sub-anchors)

**Files:**
- Copy assets to `public/photos/distribution/`
- Create: `app/(site)/distribution/page.tsx`

- [ ] **Step 1: Copy distribution images into `public/`**

```bash
mkdir -p public/photos/distribution
cp "client-doc/web-redesign/assets/distribution/GT.png" public/photos/distribution/gt.png
cp "client-doc/web-redesign/assets/distribution/MT.png" public/photos/distribution/mt.png
cp "client-doc/web-redesign/assets/events-and-activities.png" public/photos/distribution/events.png
cp "client-doc/web-redesign/assets/special-display-and-merchandising.png" public/photos/distribution/special-display.png
```

- [ ] **Step 2: Write `app/(site)/distribution/page.tsx`**

```tsx
import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/app/_components/primitives/page-header";
import { Eyebrow } from "@/app/_components/primitives/eyebrow";
import { DisplayHeading } from "@/app/_components/primitives/display-heading";
import { KpiStrip } from "@/app/_components/primitives/kpi-strip";
import { SoftCta } from "@/app/_components/primitives/soft-cta";
import { SoftCtaCloser } from "@/app/_components/sections/soft-cta-closer";
import { gtFormats, mtFormats, importExportBody } from "@/content/en/capabilities";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Distribution",
  description:
    "From the warehouse floor to every shelf. General trade, modern trade, and import / export across Vietnam.",
  alternates: { canonical: "/distribution" },
};

const KPIS = [
  { label: "Salesmen", value: "800+" },
  { label: "Sub-distributors", value: "300+" },
  { label: "Retail outlets", value: "180K" },
];

export default function DistributionPage() {
  return (
    <>
      <PageHeader
        eyebrow="Distribution"
        heading="From the warehouse floor to *every shelf*."
        lede="Nationwide reach through general trade and modern trade, anchored by import and export support that brings international brands into Vietnam."
      />

      <section className="bg-paper px-6 py-[clamp(72px,8vw,100px)] sm:px-10">
        <div className="mx-auto max-w-[1300px]">
          <KpiStrip items={KPIS} tone="on-cream" />
        </div>
      </section>

      <section
        id="gt"
        className="bg-cream px-6 py-[clamp(96px,11vw,140px)] sm:px-10"
      >
        <div className="mx-auto grid max-w-[1300px] gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <Eyebrow tone="gold">General Trade</Eyebrow>
            <DisplayHeading level={2}>General Trade.</DisplayHeading>
            <p className="max-w-[55ch] text-[17px] leading-[1.55] text-muted">
              Nationwide coverage with 800+ salesmen across every province and
              city, supported by 300+ sub-distributors and a network of 180,000
              retail outlets.
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[14px] uppercase tracking-[0.16em] text-muted">
              {gtFormats.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
          <Image
            src="/photos/distribution/gt.png"
            alt="Outlet types we serve in general trade"
            width={1200}
            height={800}
            className="h-auto w-full rounded-sm bg-paper"
          />
        </div>
      </section>

      <section
        id="mt"
        className="bg-cream px-6 py-[clamp(96px,11vw,140px)] sm:px-10"
      >
        <div className="mx-auto flex max-w-[1300px] flex-col gap-10">
          <div className="flex flex-col gap-6">
            <Eyebrow tone="gold">Modern Trade</Eyebrow>
            <DisplayHeading level={2}>Modern Trade.</DisplayHeading>
            <p className="max-w-[60ch] text-[17px] leading-[1.55] text-muted">
              Retailer partnerships across every chain in Vietnam, with
              trade-marketing display and event support.
            </p>
          </div>
          <Image
            src="/photos/distribution/mt.png"
            alt="Modern trade chains we distribute to"
            width={2000}
            height={900}
            className="h-auto w-full rounded-sm bg-paper"
          />
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[14px] uppercase tracking-[0.16em] text-muted">
            {mtFormats.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-paper px-6 py-[clamp(72px,8vw,100px)] sm:px-10">
        <div className="mx-auto grid max-w-[1300px] gap-8 lg:grid-cols-2">
          <figure className="flex flex-col gap-3">
            <Image
              src="/photos/distribution/events.png"
              alt="Trade marketing events and activities"
              width={1200}
              height={800}
              className="h-auto w-full rounded-sm"
            />
            <figcaption className="text-[14px] text-muted">
              Trade marketing events and activations across the country.
            </figcaption>
          </figure>
          <figure className="flex flex-col gap-3">
            <Image
              src="/photos/distribution/special-display.png"
              alt="In-store special displays and merchandising"
              width={1200}
              height={800}
              className="h-auto w-full rounded-sm"
            />
            <figcaption className="text-[14px] text-muted">
              Special displays and merchandising for partner brands.
            </figcaption>
          </figure>
        </div>
      </section>

      <section
        id="import-export"
        className="bg-cream px-6 py-[clamp(96px,11vw,140px)] sm:px-10"
      >
        <div className="mx-auto flex max-w-[1300px] flex-col gap-6">
          <Eyebrow tone="gold">Import & Export</Eyebrow>
          <DisplayHeading level={2}>Import & Export.</DisplayHeading>
          <p className="max-w-[60ch] text-[17px] leading-[1.55] text-muted">
            {importExportBody}
          </p>
          <SoftCta href="/contact">
            Detailed capability brief on request → Get in touch
          </SoftCta>
        </div>
      </section>

      <SoftCtaCloser />
    </>
  );
}
```

- [ ] **Step 3: Build**

```bash
bun run build
```

- [ ] **Step 4: Commit**

```bash
git add public/photos/distribution app/\(site\)/distribution/page.tsx
git commit -m "feat(page): /distribution with GT, MT, trade marketing, import/export anchors"
```

---

## Task 7.3 — `/logistics`

**Files:**
- Copy: `public/photos/warehouse/*`
- Create: `app/(site)/logistics/page.tsx`

- [ ] **Step 1: Copy warehouse photos**

```bash
mkdir -p public/photos/warehouse
cp client-doc/web-redesign/assets/warehouse/co-packing-facility.png public/photos/warehouse/co-packing.png
cp client-doc/web-redesign/assets/warehouse/warehouse.png public/photos/warehouse/warehouse-1.png
cp client-doc/web-redesign/assets/warehouse/warehouse-2.png public/photos/warehouse/warehouse-2.png
```

- [ ] **Step 2: Write `app/(site)/logistics/page.tsx`**

```tsx
import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/app/_components/primitives/page-header";
import { Eyebrow } from "@/app/_components/primitives/eyebrow";
import { DisplayHeading } from "@/app/_components/primitives/display-heading";
import { KpiStrip } from "@/app/_components/primitives/kpi-strip";
import { JvFeature } from "@/app/_components/sections/jv-feature";
import { SoftCtaCloser } from "@/app/_components/sections/soft-cta-closer";
import { importExportBody } from "@/content/en/capabilities";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Warehouse & Logistics",
  description:
    "End-to-end handling, north and south. Two distribution centres, ambient and cold storage, co-packing capability.",
  alternates: { canonical: "/logistics" },
};

const KPIS = [
  { label: "Distribution centres", value: "2" },
  { label: "Storage", value: "Ambient + cold" },
  { label: "Co-packing", value: "Capable" },
];

export default function LogisticsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Warehouse & Logistics"
        heading="End-to-end handling, north and *south*."
        lede="Two distribution centres cover Vietnam end to end. Ambient and cold storage, co-packing infrastructure, and vehicles serving every province."
      />

      <section className="bg-paper px-6 py-[clamp(72px,8vw,100px)] sm:px-10">
        <div className="mx-auto max-w-[1300px]">
          <KpiStrip items={KPIS} tone="on-cream" />
        </div>
      </section>

      <section className="bg-cream px-6 py-[clamp(96px,11vw,140px)] sm:px-10">
        <div className="mx-auto grid max-w-[1300px] gap-12 lg:grid-cols-2">
          <article className="flex flex-col gap-4">
            <Image
              src="/photos/warehouse/warehouse-1.png"
              alt="Long An distribution centre"
              width={1200}
              height={800}
              className="h-auto w-full rounded-sm"
            />
            <Eyebrow tone="gold">South DC</Eyebrow>
            <h3 className="font-display text-[clamp(24px,2.5vw,32px)] text-ink">
              Long An.
            </h3>
            <p className="max-w-[55ch] text-[15px] leading-[1.55] text-muted">
              Our southern hub covers Ho Chi Minh City and the Mekong Delta.
              Ambient and cold storage, dedicated trucking lanes, and direct
              connections to the country's busiest retail corridors.
            </p>
          </article>
          <article className="flex flex-col gap-4">
            <Image
              src="/photos/warehouse/warehouse-2.png"
              alt="Hanoi distribution centre"
              width={1200}
              height={800}
              className="h-auto w-full rounded-sm"
            />
            <Eyebrow tone="gold">North DC</Eyebrow>
            <h3 className="font-display text-[clamp(24px,2.5vw,32px)] text-ink">
              Hanoi.
            </h3>
            <p className="max-w-[55ch] text-[15px] leading-[1.55] text-muted">
              Our northern hub serves Hanoi and the surrounding provinces.
              Same handling standards, same temperature ranges, same SLA.
            </p>
          </article>
        </div>
      </section>

      <section className="bg-paper px-6 py-[clamp(96px,11vw,140px)] sm:px-10">
        <div className="mx-auto grid max-w-[1300px] gap-12 lg:grid-cols-[1fr_1.2fr]">
          <Image
            src="/photos/warehouse/co-packing.png"
            alt="Richfield co-packing facility"
            width={1200}
            height={800}
            className="h-auto w-full rounded-sm"
          />
          <div className="flex flex-col gap-6">
            <Eyebrow tone="gold">Co-packing</Eyebrow>
            <DisplayHeading level={2}>Primary and secondary packing under one roof.</DisplayHeading>
            <p className="max-w-[55ch] text-[17px] leading-[1.55] text-muted">
              Primary and secondary packing lines with hand-washing and
              pest-control infrastructure. Co-packing serves both
              Richfield-distributed brands and joint-venture production through
              Dory Rich.
            </p>
          </div>
        </div>
      </section>

      <JvFeature variant="slim" />

      <section className="bg-cream px-6 py-[clamp(72px,8vw,100px)] sm:px-10">
        <div className="mx-auto flex max-w-[1300px] flex-col gap-6">
          <Eyebrow tone="gold">Import & Export</Eyebrow>
          <p className="max-w-[60ch] text-[17px] leading-[1.55] text-muted">
            {importExportBody}
          </p>
        </div>
      </section>

      <SoftCtaCloser />
    </>
  );
}
```

- [ ] **Step 3: Build**

```bash
bun run build
```

- [ ] **Step 4: Commit**

```bash
git add public/photos/warehouse app/\(site\)/logistics/page.tsx
git commit -m "feat(page): /logistics with DCs, co-packing, JV bridge"
```

---

## Task 7.4 — `/products`

**Files:**
- Create: `app/(site)/products/page.tsx`

- [ ] **Step 1: Write `app/(site)/products/page.tsx`**

```tsx
import type { Metadata } from "next";
import { PageHeader } from "@/app/_components/primitives/page-header";
import { SoftCta } from "@/app/_components/primitives/soft-cta";
import { SoftCtaCloser } from "@/app/_components/sections/soft-cta-closer";
import { featuredProducts, productsEditorial } from "@/content/en/products";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Brands you already love. Hundreds of SKUs across confectionery, beverages, personal care, and stationery.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Products"
        heading="Brands you *already* love."
      />

      <section className="bg-cream px-6 py-[clamp(96px,11vw,140px)] sm:px-10">
        <div className="mx-auto max-w-[1300px]">
          <ul className="flex gap-px overflow-x-auto bg-line">
            {featuredProducts.map((p) => (
              <li
                key={p.name}
                className="flex min-w-[260px] flex-col items-center justify-center gap-4 bg-cream px-10 py-16"
              >
                <span className="font-display text-[28px] italic text-gold">
                  {p.name}
                </span>
                <span className="text-[10px] uppercase tracking-[0.32em] text-muted">
                  {p.brand}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-paper px-6 py-[clamp(72px,8vw,100px)] sm:px-10">
        <div className="mx-auto flex max-w-[60ch] flex-col gap-6">
          <p className="text-[17px] leading-[1.55] text-ink">
            {productsEditorial}
          </p>
          <SoftCta href="/brands">Explore the brand portfolio</SoftCta>
        </div>
      </section>

      <SoftCtaCloser />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/\(site\)/products/page.tsx
git commit -m "feat(page): /products (intentionally light)"
```

---

# Phase 8 — SEO + metadata files

## Task 8.1 — `app/sitemap.ts`

**Files:**
- Create: `app/sitemap.ts`

- [ ] **Step 1: Write `app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";
import { site } from "@/content/en/site";

const ROUTES = [
  "/",
  "/about",
  "/what-we-do",
  "/distribution",
  "/logistics",
  "/products",
  "/brands",
  "/careers",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((path) => ({
    url: `${site.domainCanonical}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1.0 : 0.7,
  }));
}
```

- [ ] **Step 2: Commit**

```bash
git add app/sitemap.ts
git commit -m "feat(seo): sitemap.ts enumerating all 9 routes"
```

---

## Task 8.2 — `app/robots.ts`

**Files:**
- Create: `app/robots.ts`

- [ ] **Step 1: Write `app/robots.ts`**

```ts
import type { MetadataRoute } from "next";
import { site } from "@/content/en/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${site.domainCanonical}/sitemap.xml`,
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add app/robots.ts
git commit -m "feat(seo): robots.ts with sitemap reference"
```

---

## Task 8.3 — `opengraph-image.tsx`

A single shared OG image at the root, generated from text+SVG (no asset dependency).

**Files:**
- Create: `app/opengraph-image.tsx`

- [ ] **Step 1: Write `app/opengraph-image.tsx`**

```tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          backgroundColor: "#1d3b2c",
          color: "#f6e7c1",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 22, letterSpacing: 8 }}>
          <span
            style={{
              width: 48,
              height: 48,
              border: "2px solid #c79a44",
              borderRadius: 999,
              color: "#c79a44",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontStyle: "italic",
            }}
          >
            R
          </span>
          RICHFIELD GROUP
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 22, color: "#c79a44", letterSpacing: 8 }}>
            ESTABLISHED 1994
          </div>
          <div style={{ fontSize: 80, lineHeight: 1, color: "#fff" }}>
            From market entry to{" "}
            <span style={{ fontStyle: "italic", color: "#c79a44" }}>nationwide distribution</span>.
          </div>
        </div>
        <div style={{ fontSize: 18, color: "#c79a44", letterSpacing: 4 }}>
          VIETNAM · MALAYSIA · CHINA
        </div>
      </div>
    ),
    size,
  );
}
```

- [ ] **Step 2: Build to confirm `next/og` runtime resolves**

```bash
bun run build
```

Expected: build succeeds. The generated OG image is served at `/opengraph-image`.

- [ ] **Step 3: Commit**

```bash
git add app/opengraph-image.tsx
git commit -m "feat(seo): edge-rendered Open Graph image"
```

---

# Phase 9 — End-to-end tests

## Task 9.1 — Playwright smoke for all 9 routes

**Files:**
- Create: `e2e/smoke.spec.ts`

- [ ] **Step 1: Write `e2e/smoke.spec.ts`**

```ts
import { test, expect } from "@playwright/test";

const ROUTES: Array<{ path: string; h1: string | RegExp }> = [
  { path: "/", h1: /nationwide distribution/i },
  { path: "/about", h1: /generations/i },
  { path: "/what-we-do", h1: /move .*brands/i },
  { path: "/distribution", h1: /every shelf/i },
  { path: "/logistics", h1: /south/i },
  { path: "/products", h1: /already/i },
  { path: "/brands", h1: /portfolio/i },
  { path: "/careers", h1: /opportunity/i },
  { path: "/contact", h1: /brand/i },
];

for (const r of ROUTES) {
  test(`route ${r.path} renders shell + h1`, async ({ page }) => {
    const response = await page.goto(r.path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("header").first()).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
    await expect(page.locator("h1")).toContainText(r.h1);
  });
}
```

- [ ] **Step 2: Run the smoke**

```bash
bunx playwright test --project=chromium-desktop e2e/smoke.spec.ts
```

Expected: 9 tests pass.

- [ ] **Step 3: Commit**

```bash
git add e2e/smoke.spec.ts
git commit -m "test(e2e): smoke test for all 9 routes"
```

---

## Task 9.2 — Mobile drawer test

**Files:**
- Create: `e2e/mobile-drawer.spec.ts`

- [ ] **Step 1: Write `e2e/mobile-drawer.spec.ts`**

```ts
import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 } });

test("hamburger opens drawer, ESC closes it", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: /open menu/i });
  await trigger.click();
  const drawer = page.getByRole("dialog", { name: /site navigation/i });
  await expect(drawer).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(drawer).toBeHidden();
});

test("drawer focus is trapped", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /open menu/i }).click();
  // Tab through every focusable; the focus should stay inside the dialog.
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press("Tab");
  }
  const focusInsideDialog = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]');
    return dialog?.contains(document.activeElement) ?? false;
  });
  expect(focusInsideDialog).toBe(true);
});
```

- [ ] **Step 2: Run on mobile project**

```bash
bunx playwright test --project=chromium-mobile e2e/mobile-drawer.spec.ts
```

Expected: 2 tests pass.

- [ ] **Step 3: Commit**

```bash
git add e2e/mobile-drawer.spec.ts
git commit -m "test(e2e): mobile drawer open/close + focus trap"
```

---

## Task 9.3 — Contact form submit

**Files:**
- Create: `e2e/contact.spec.ts`

- [ ] **Step 1: Write `e2e/contact.spec.ts`**

```ts
import { test, expect } from "@playwright/test";

test.describe("Contact form", () => {
  test("renders all fields and the inquiry options", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByLabel("Name")).toBeVisible();
    await expect(page.getByLabel("Company")).toBeVisible();
    await expect(page.getByLabel("Country")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Inquiry type")).toBeVisible();
    await expect(page.getByLabel("Message")).toBeVisible();

    const select = page.getByLabel("Inquiry type");
    await expect(select.locator("option")).toHaveCount(5);
  });

  test("invalid email surfaces field error", async ({ page }) => {
    await page.goto("/contact");
    await page.getByLabel("Name").fill("Asha");
    await page.getByLabel("Company").fill("Acme");
    await page.getByLabel("Email").fill("not-an-email");
    await page.getByLabel("Message").fill("Hello.");
    // Pass the anti-spam guard so we exercise the Zod validation path.
    await page.waitForTimeout(3500);
    await page.getByRole("button", { name: /send message/i }).click();
    await expect(page.locator('[role="alert"]')).toContainText(/valid email/i);
  });

  test("valid submission shows success message (no inbox configured)", async ({ page }) => {
    await page.goto("/contact");
    await page.getByLabel("Name").fill("Asha");
    await page.getByLabel("Company").fill("Acme");
    await page.getByLabel("Email").fill("asha@example.com");
    await page.getByLabel("Message").fill("We'd like to discuss distribution.");
    // Anti-spam guard requires >= 3s between mount and submit.
    await page.waitForTimeout(3500);
    await page.getByRole("button", { name: /send message/i }).click();
    await expect(page.getByRole("status")).toContainText(/two business days/i);
  });

  test("submitting too fast trips the anti-spam delay", async ({ page }) => {
    await page.goto("/contact");
    await page.getByLabel("Name").fill("Bot");
    await page.getByLabel("Company").fill("Bot");
    await page.getByLabel("Email").fill("bot@example.com");
    await page.getByLabel("Message").fill(".");
    await page.getByRole("button", { name: /send message/i }).click();
    await expect(page.locator('[role="alert"]')).toContainText(/give us a moment/i);
  });
});
```

- [ ] **Step 2: Run**

```bash
bunx playwright test --project=chromium-desktop e2e/contact.spec.ts
```

Expected: 3 tests pass. (Without `RESEND_API_KEY`, the action logs and returns ok.)

- [ ] **Step 3: Commit**

```bash
git add e2e/contact.spec.ts
git commit -m "test(e2e): contact form fields, validation, success path"
```

---

# Phase 10 — Polish, audits, launch prep

## Task 10.1 — Lighthouse pass on 4 pages

**Files:** none. Manual audit.

- [ ] **Step 1: Build and start production server**

```bash
bun run build
bun run start &
```

- [ ] **Step 2: Run Lighthouse against 4 most-trafficked pages**

```bash
bunx lighthouse http://localhost:3000/ --quiet --chrome-flags="--headless=new" --output=json --output-path=./lh-home.json
bunx lighthouse http://localhost:3000/about --quiet --chrome-flags="--headless=new" --output=json --output-path=./lh-about.json
bunx lighthouse http://localhost:3000/brands --quiet --chrome-flags="--headless=new" --output=json --output-path=./lh-brands.json
bunx lighthouse http://localhost:3000/contact --quiet --chrome-flags="--headless=new" --output=json --output-path=./lh-contact.json
```

Expected (per spec §10.3.6):
- Performance ≥ 90
- Accessibility ≥ 95
- Best Practices ≥ 95
- SEO ≥ 95

- [ ] **Step 3: Stop the server**

```bash
kill %1
```

- [ ] **Step 4: If any score is below threshold**

Investigate and fix. Common causes:
- Missing `width`/`height` on images → CLS regression. Fix at the `<Image>` props.
- Render-blocking JS → confirm primitives stay RSC.
- Missing alt text → fix at the `<Image alt>` site.

After fixes, re-run lighthouse.

- [ ] **Step 5: Discard the JSON report files (do not commit)**

```bash
rm -f lh-*.json
```

- [ ] **Step 6: No commit unless code changed.** If code did change, commit with `fix(perf): …` or `fix(a11y): …`.

---

## Task 10.2 — Reduced-motion verification

- [ ] **Step 1: Open Chrome DevTools → Rendering → "Emulate CSS media feature prefers-reduced-motion: reduce".**

- [ ] **Step 2: Visit `/`, `/about`, `/distribution`. Scroll through each.**

Expected: no fade-up reveals, no pin pulses, no breathing bloom. Every section renders in its final state immediately.

- [ ] **Step 3: If a regression is found, audit `app/globals.css` `@media (prefers-reduced-motion: reduce)` block. Fix and re-verify.**

---

## Task 10.3 — Keyboard pass

- [ ] **Step 1: From `/`, press `Tab`. Verify the first focusable is the skip-to-content link, with a visible gold outline.**

- [ ] **Step 2: Tab through the homepage. Verify focus order matches DOM order: header → nav → mobile menu (off-screen at desktop) → hero KPIs (none focusable) → pillar links → map list → milestones → brand cells (none focusable unless a logo is wrapped in a link) → JV link → soft-CTA → footer.**

- [ ] **Step 3: At mobile width, press `Tab` after the hamburger and confirm the drawer traps focus.**

- [ ] **Step 4: On `/contact`, submit an empty form via keyboard. Confirm focus moves to the first field with an error.**

If keyboard ordering or focus is wrong, fix at the source (e.g., add `autoFocus` on first error field on the contact form, or rearrange JSX).

---

## Task 10.4 — Unit + e2e suite must pass

- [ ] **Step 1: Run full test matrix**

```bash
bun run lint
bun run typecheck
bun run test:unit
bunx playwright test
```

Expected: all green.

- [ ] **Step 2: If anything fails, fix and re-run. No commits unless code changed.**

---

## Task 10.5 — Maintenance log

The spec lists 8 Open Items that aren't launch-blockers. Track them in `MAINTENANCE.md` so they don't get lost after launch.

**Files:**
- Create: `MAINTENANCE.md`

- [ ] **Step 1: Write `MAINTENANCE.md`**

```markdown
# Richfield Site — Maintenance Log

Open items from the launch design spec (§11). None block launch; each has a scaffold fallback in place.

| # | Item | Where it shows | Resolution path |
|---|---|---|---|
| 1 | AMOS / NewChoice category one-liners | Timeline body on `/` and `/about` | Update `content/en/milestones.ts` with confirmed copy. |
| 2 | Brand-wall composition (Wei Long etc.) | `/` `<BrandWall>` and `/brands` | Update `content/en/brands.ts`; the grid auto-rebalances. |
| 3 | Dory Rich logo asset | `/` `<JvFeature>`, `/brands` JV row, `/logistics` JV row | Drop logo into `public/brands/dory-rich.svg`; replace the typographic lockup in `app/_components/sections/jv-feature.tsx`. |
| 4 | Email after domain migration | `content/en/site.ts` `email` field, footer, contact channels | Confirm `cskh@richfieldgroup.com.vn` with client; flip the value once the new mailbox forwards. |
| 5 | LinkedIn + Zalo URLs | `content/en/site.ts` `socials` | Filled-in URLs auto-render in the footer. Empty strings are filtered out. |
| 6 | Soft-CTA copy approval | `<SoftCtaCloser>` on every page | Edit `app/_components/sections/soft-cta-closer.tsx` if the client wants different wording. |
| 7 | Transactional email provider + recipient inbox | Set `RESEND_API_KEY` and `RICHFIELD_LEAD_INBOX` in production env | Without `RESEND_API_KEY`, the dev fallback only logs to the server. Production must have both env vars set. |
| 8 | Old-domain sitemap for redirect mapping | Hosting-level 301 from `richfieldvn.com.vn` | Capture the old sitemap before May 31; map known paths in the hosting config. Catch-all is the default. |

## After-launch follow-ups

- [ ] Replace decorative dot-pattern + hand-drawn country shapes in `<FootprintMap>` with a designer-cut SVG once available.
- [ ] Add a Vietnamese locale at `content/vi/` and wrap `(site)` in `[locale]`. EN content modules are already shaped for this.
- [ ] Add a `/news` or `/press` route group (`(news)`) when there's content to support it.
```

- [ ] **Step 2: Commit**

```bash
git add MAINTENANCE.md
git commit -m "docs: maintenance log tracking 8 open items + post-launch follow-ups"
```

---

## Task 10.6 — Final UAT pass

Run through spec §10.3 once before the launch rehearsal. This is a checklist, not a code change.

- [ ] **Step 1:** Visual fidelity on Chrome, Safari, Firefox at 1440 / 1024 / 768 / 390.
- [ ] **Step 2:** Throttled 4G scroll, every page.
- [ ] **Step 3:** `prefers-reduced-motion`, every page.
- [ ] **Step 4:** Keyboard traversal, every page.
- [ ] **Step 5:** VoiceOver pass on home hero, footprint-map, brand wall, contact form.
- [ ] **Step 6:** Lighthouse re-run on the 4 pages.
- [ ] **Step 7:** Submit a real lead from a non-team email; verify it lands in the chosen inbox (depends on Open Item 7 being resolved).
- [ ] **Step 8:** Domain swap rehearsal on a staging subdomain.

Any defect found here goes back to the relevant phase as a `fix(...)` commit. No changes? Move to launch.

---

# Acceptance criteria (from spec §10)

Before declaring the engagement complete:

- All 9 routes return 200 and render the designed layout.
- Lighthouse thresholds met on `/`, `/about`, `/brands`, `/contact`.
- Contact form delivers test leads to the confirmed inbox.
- Old-domain catch-all redirect verified live.
- No console errors on any page in the production build.
- Open items resolved or documented as deferred in `MAINTENANCE.md`.
- All Vitest + Playwright tests pass.

---

# Plan Coverage Map (spec → tasks)

| Spec section | Plan task(s) |
|---|---|
| §2 Decisions: light theme, gold + green on cream | Task 1.1 |
| §3 Routes (9), top-level nav, footer columns | Tasks 4.5, 4.2, 5.8, 6.x, 7.x |
| §4 OKLCH tokens | Task 1.1 |
| §4 Typography (Playfair + Geist) | Task 1.2 |
| §4 Spacing (varied padding) | Encoded inline in each section task |
| §4 Motion (reveal + pulses) | Task 1.1 (`@media reduced-motion`), 4.4 |
| §4 A11y baseline | Tasks 4.1 (skip), 4.3 (focus trap), 1.1 (focus-visible) |
| §4 Performance baseline | Tasks 1.2, 5.x (`force-static`) |
| §4 Reusable primitives | Phase 3 (10 primitives) |
| §4 Copy rules (no em dash) | Encoded inline in every content module |
| §5 Hero | Task 5.1 |
| §5 What We Do | Task 5.2 |
| §5 Footprint Map | Task 5.3 |
| §5 Timeline | Task 5.4 |
| §5 Brand Wall | Task 5.5 |
| §5 Dory Rich JV | Task 5.6 |
| §5 Soft CTA | Task 5.7 |
| §5 Site header / footer | Tasks 4.2, 4.3 |
| §6.1 /about | Task 6.1 |
| §6.2 /brands | Task 6.2 |
| §6.3 /careers | Task 6.3 |
| §6.4 /contact | Tasks 6.4a, 6.4b, 6.4c |
| §7.1 /what-we-do | Task 7.1 |
| §7.2 /distribution | Task 7.2 |
| §7.3 /logistics | Task 7.3 |
| §7.4 /products | Task 7.4 |
| §8 Code architecture + content modules | Phase 2, 3, 4 |
| §9 Edge cases | Encoded in BrandCell (Task 3.6), open positions (Task 6.3), products (Task 7.4), reduced motion (Task 1.1), action errors (Task 6.4b) |
| §9 SEO + metadata | Tasks 1.2, 5.8, 6.x metadata, 8.1, 8.2, 8.3 |
| §10 Testing | Phase 9, Task 10.1, 10.2, 10.3, 10.4 |
| §11 Open items | Task 10.5 |
| §12 Copy library | Encoded in `content/en/*.ts` (Phase 2) and section JSX (Phase 5) |

---

# Execution notes

- **Atomic commits.** Every task ends with a Commit step. Do not batch commits across tasks.
- **No --no-verify.** If a hook fails, investigate. Fix the underlying issue and create a new commit.
- **No skip ahead.** Phases are ordered by dependency: tooling (0) before tokens (1) before content (2) before primitives (3) before shell (4) before sections (5) before pages (6/7) before SEO (8) before tests (9) before audit (10). Skipping forward will surface as broken builds.
- **Branch hygiene.** Stay on `feature/landing-page`. After Task 10.6 passes, request user review before any merge or domain switch.
- **When stuck on a Next.js API surface,** re-read the relevant file under `node_modules/next/dist/docs/`. The training data is older than the installed version.
