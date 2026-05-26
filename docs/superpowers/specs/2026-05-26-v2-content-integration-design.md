# V2 Content Integration — Design Spec

**Date:** 2026-05-26
**Scope:** `/v2` homepage only (no sub-pages)
**Foundation in place:** cover spread + magazine canvas + Lenis smooth scroll
**Goal:** Fold the full homepage content into the v2 magazine framework, resolve customer content feedback, and make every section read as a distinct editorial chapter.

---

## 1. Background

V2 (`/v2`) is the magazine-direction prototype of the Richfield homepage. It currently has:

- `CoverSpread` — full-bleed photo carousel with masthead, italic standfirst, and a Vertical TOC.
- `MagazineCanvas` — one sticky pinned canvas with 4 spreads that cross-dissolve in place (Lead, Field Note, JV, Colophon).
- Lenis-driven smooth scroll with proximity snap.
- Palette tokens: cream `oklch(0.96 0.018 82)`, ink `oklch(0.22 0.015 158)`, gold `oklch(0.74 0.115 82)`.

The design language (magazine vibe, italic Newsreader display, mono folios, ink↔cream rhythm) is already approved. What's missing is content density: v2 is currently a prototype with placeholder spreads. V1 (`/(site)`) has the real content (about, capabilities, footprint, brands, milestones, JV) but lives in a different visual language and has received content feedback that needs to land in v2.

### Scroll model (clarified)

V2 is **not** an in-place cross-dissolve canvas. Each section is a normally-scrolling chapter that can be any height; the morph transition only happens at the seam between sections (and from the cover into Section 1). Inside a section: regular vertical scroll, no pinning.

This means the existing `MagazineCanvas` (which compresses all spreads into one pinned viewport) and `MagazineMorph` (which pins a single spread to 100svh) are **not the right primitives** for the full-content homepage. A new primitive — `MagazineFlow` — replaces them for the post-cover sections.

---

## 2. What customers said (content-only feedback we incorporate)

The feedback was given against v1's design, but the design-related feedback for v1 is out of scope. Only the **content-related** items get carried into v2:

| # | Feedback | How v2 resolves it |
|---|---|---|
| 1 | "Gold text doesn't stand out — make it pop more." | Add `--gold-strong` and `--gold-rule` tokens for higher-contrast accents; promote gold from decorative to structural (category numerals, eyebrows, hairline rules). |
| 2 | "Established 1994 — bigger; other headings too." | Closer section (§06) treats "Established 1994" as the visual climax (clamp 5rem–11rem). All section headlines use the existing `v2-size-feature`/`v2-size-standfirst` clamp scale (2.4rem–5.2rem) — already significantly larger than v1. |
| 3 | "Emphasize the stats — they're the main highlight." | Lead section (§01) gives the by-the-numbers strip a bordered "card" treatment and the heaviest weight in the section. |
| 4 | "Remove Vietnam–Malaysia–China from the stats — they're Vietnam-only." | Stat strip eyebrow becomes `BY THE NUMBERS · VIETNAM`. The cover's `VIETNAM · MALAYSIA · CHINA · SINCE 1994` masthead stripe stays (that's the group geography, not the stats). |
| 5 | "Add the map and the office headcounts: Malaysia 150, China 50, Vietnam 1,000+ (+ growing)." | Field Atlas section (§03) ports v1's `FootprintMap` SVG with these headcounts. |
| 6 | "Highlight 'three' in 'three countries and three generations.'" | Field Atlas headline renders both "three"s as italic gold. |
| 7 | "Remove the 'Vietnam, Malaysia, and China together form one operating Group' sentence — the map shows it." | Drop the sentence from Field Atlas body. |
| 8 | "Remove Export everywhere — we haven't started it yet." | Audit confirms `pillars` array in `content/en/capabilities.ts` already has 3 pillars only (no Export). §02 enforces 3-card layout; no Export card. |
| 9 | "AMOS → we distribute gummy candies for them." | `brands.ts` story already says this. Confirm AMOS appears in §04 Food category with gummy product photos (note follow-up: current `productPhotos.AMOS` lists crayons — needs gummy product photos from client. See open question #1.) |
| 10 | "Pocky → Glico (Pocky is the product, Glico is the company)." | `brands.ts` and `partnerLogos` already use "Glico". Confirm §04 logo strip and §06 colophon reference Glico, not Pocky. |
| 11 | "No big feature section per brand — just three categories with product photos beneath." | §04 The Directory: three category bands (Food / Beverages / Non-Food), each with a logo strip and a sliding product photo marquee below. No individual brand feature cells. |
| 12 | "Sections need to be visibly separated — looks flat when it's mostly one color." | Surface palette flips every section: ink (cover) → cream → ink → cream → cream+gold → ink → cream. Each section reads as a distinct page. |
| 13 | "Text legibility, eye-catching but legible." | No text-over-gradient. Photos use the existing duotone treatment; text always sits on a solid surface. |
| 14 | "No italicized 'South'." | Audit for any "South" / direction labels in v2 content and ensure they render in plain weight. |

### Feedback explicitly excluded (v1-specific, ignored)

- "Home page nav should be a shade of green" — v2 has no top nav by design; the Vertical TOC + masthead replace it.
- "Photo-band gradients hard to read" — v2 doesn't use the photo-band gradient pattern.
- "Big gap between Modern Trade heading and where-to-find-us" — Distribution sub-page concern; not on the homepage.
- "Brand page detailed structure (where to find us, retailer logos)" — Brand sub-page concern; not on the homepage.

---

## 3. Architecture

### Page structure

```
[ Cover Spread ]                       — existing, unchanged structurally
        ↓ morph seam (ink → cream)
[ §01 The Lead ]                       — about + KPI strip
        ↓ morph seam (cream → ink)
[ §02 What We Do ]                     — three capabilities
        ↓ morph seam (ink → cream)
[ §03 Field Atlas ]                    — map + headcounts
        ↓ morph seam (cream → cream+gold)
[ §04 The Directory ]                  — brands by category
        ↓ morph seam (cream → ink)
[ §05 The Joint Venture ]              — Dory Rich
        ↓ morph seam (ink → cream)
[ §06 Colophon ]                       — Established 1994 closer
```

### Component map

| Component | Role | Status |
|---|---|---|
| `CoverSpread` | Hero carousel | **Keep as-is** (only the masthead eyebrow / TOC entries get updated to match the new section labels) |
| `MagazineCanvas` | In-place crossfading canvas | **Removed from `/v2/page.tsx`** — replaced by `MagazineFlow` |
| `MagazineMorph` | Pinned single-spread morph | **Removed from imports** (kept on disk in case useful later; unused) |
| `MagazineFlow` *(new)* | Fixed bg interpolator + seam dissolves between normally-flowing sections | **Build** |
| `LeadSpread` | §01 content | Update content (numbers, stat-strip eyebrow); restyle for normal-scroll context (no longer needs to fit in 100svh) |
| `WhatWeDoSpread` *(new)* | §02 content | Build — three capability cards on ink surface |
| `FieldAtlasSpread` *(new)* | §03 content | Build — port v1 `FootprintMap` SVG; rebuild type around v2 tokens |
| `DirectorySpread` *(new)* | §04 content | Build — three category bands with logo strips + product marquees |
| `JointVentureSpread` *(new, replaces inline `JVSpread`)* | §05 content | Extract from inline; add Dory Rich logo + outbound link |
| `ColophonSpread` *(new, replaces inline `CloserColophon`)* | §06 content | Extract from inline; promote "Established 1994" to display climax; add footer details |
| `VerticalTOC` | Right-rail wayfinding | Update entries to match the 6 sections; add active-section underline tracking |
| `FolioStrip` | Top masthead | Keep — possibly add a sticky-fadeable variant that persists past the cover (decision deferred to implementation) |

### The `MagazineFlow` primitive

A new component that wraps the post-cover sections and provides the morph-between-sections behavior.

**Behavior:**

1. Renders children inside `<div className="relative">`. Each child is expected to be a `<MagazineFlowSection>` (a thin wrapper supplying `bg` and `textOnDark` props).
2. Renders a fixed background layer (`<div className="fixed inset-0 -z-10">`) whose `background` color is a Motion value driven by scroll position.
3. On scroll, observes which section is currently in view and interpolates the fixed background between that section's `bg` and the next section's `bg` during the **last ~10svh of each section** (the "seam").
4. Each section paints a subtle blur overlay (`::before` pseudo or a `<motion.div>`) at its top edge that fades in over the seam to soften the transition.
5. Section content itself sits on a transparent or section-tinted surface above the fixed bg, so the bg color reads through.
6. Reduced motion: bg interpolation disabled, each section paints its own solid bg, no blur overlay.

**Why fixed bg instead of per-section bg + transition:** lets the bg actually morph continuously across the seam. A per-section bg with a CSS gradient at the seam would jump abruptly when scrolled past — the fixed bg approach gives true interpolation.

**Why this is the right primitive:**

- Replaces both `MagazineCanvas` (wrong because it pins, compressing all spreads into 100svh) and `MagazineMorph` (wrong because it pins a single spread to 100svh, blocking long content).
- Lets each section be any height (100svh for sparse, 200svh for the directory) and scroll naturally.
- Keeps the magazine "page-turn" feel at the seam without confining content.

### Vertical TOC behavior

- Already lists 6 entries; update labels to match (Lead / What We Do / Field Atlas / Directory / Joint Venture / Colophon).
- Add active-section tracking: as the user scrolls, the entry corresponding to the in-view section gets a gold underline that morphs along (similar to the cover pagination dots).
- Hidden below lg breakpoint (existing behavior).
- Desktop only: position becomes `fixed right-8 top-1/2 -translate-y-1/2` after the cover scrolls past, so it travels with the reader. (If implementation friction is high here, accept it staying static on the cover and dropping out — decision deferred.)

---

## 4. Section specifications

### §01 The Lead

- **Surface:** cream, ink type
- **Layout:** 12-col grid. Folio frame top, italic standfirst full-width, two-column body (hero photo left col-7, body + stats right col-5).
- **Eyebrow:** `─── STORY 01 · ABOUT THE GROUP` (gold)
- **Headline:** *From market entry to nationwide distribution.* (italic, `v2-size-feature`)
- **Body P1 (drop-cap R):** "Richfield Worldwide JSC is one of Vietnam's largest FMCG distributors — one network reaching every province and city, carrying brands people love, doing the same thing well for thirty years."
- **Body P2:** "Rooted in a Malaysian family business now in its third generation, Richfield has grown alongside Mars, Red Bull, BiC, Glico, AMOS, and Newchoice."
- **Hero photo:** `candid-1-1280.webp`; caption `FIG. 01 · ANNUAL TOWN HALL · 2026`.
- **By-the-numbers strip** (right col, with `BY THE NUMBERS · VIETNAM` eyebrow):
  - 180,000 retail outlets
  - 300+ sub-distributors
  - 800+ field salesmen
  - 30+ years · since 1994
- **Visual emphasis:** stats get bordered top-rule per cell, display weight `clamp(1.8rem, 2.6vw, 2.4rem)` — heavier than current. Background tint card `bg-cream/60` with `border border-current/15` to read as the section's payoff.
- **Resolves feedback:** #3, #4

### §02 What We Do

- **Surface:** ink, cream type
- **Layout:** Folio frame top, full-width italic standfirst, three-card row beneath. Cards stack on mobile, become three columns on lg.
- **Eyebrow:** `─── STORY 02 · WHAT WE DO` (gold-strong)
- **Headline:** *Three ways we move brands to market.* (italic, `v2-size-feature`, cream)
- **Cards (uses `pillars` from `content/en/capabilities.ts`):**
  - 01 — Warehouse & Logistics — `pillars[0].longBody`
  - 02 — General Trade — `pillars[1].longBody`
  - 03 — Modern Trade — `pillars[2].longBody`
- **Card structure:** large gold-strong italic numeral, name (display, cream), longBody (cream/80, `v2-size-body`), and a single mono signature stat at the bottom (e.g., "180,000 OUTLETS" for GT, "TWO DCS · LONG AN · HANOI" for Logistics, "EVERY CHAIN IN VIETNAM" for MT).
- **No Export card.** Audit to confirm.
- **Resolves feedback:** #1 (gold pop on numerals), #8 (no Export)

### §03 Field Atlas

- **Surface:** cream, ink type
- **Layout:** 12-col grid. Left col (5): eyebrow, headline, body, country list. Right col (7): the SVG map with country nodes.
- **Eyebrow:** `─── STORY 03 · THE FOOTPRINT` (gold-strong)
- **Headline:** *An international group with deep local roots — <span class="gold italic">three</span> countries, <span class="gold italic">three</span> generations.* (both "three"s in gold italic at the same scale)
- **Body (one short paragraph only):** "International scale meets hands-on knowledge of every market we serve."
- **Country list (mirrors map nodes):**
  - **Vietnam** — 1,000+ team · HQ · *and growing*
  - **Malaysia** — 150 team · Origin · 1990s
  - **China** — 50 team · Sourcing & Brands
- **Map:** Reuse v1's `FootprintMap` SVG (dot grid + dashed gold connector arcs + animated pulse dots at country anchors). Replace v1 typography with v2 tokens (italic display for country names, mono for headcount captions).
- **Resolves feedback:** #5, #6, #7

### §04 The Directory

- **Surface:** cream with gold rules, ink type
- **Layout:** Folio frame top, full-width italic standfirst, then three category bands stacked vertically. Each band ≈55svh on lg, all three together ≈180svh of natural scroll.
- **Eyebrow:** `─── STORY 04 · THE DIRECTORY` (gold-strong)
- **Headline:** *The brands we carry.* (italic, `v2-size-feature`)
- **Category band structure** (repeated 3×):
  - Top rule + category marker: `─── FOOD · 01 / 03` (mono small-caps, gold-strong, full-width hairline rule)
  - Category word: huge display, italic, ink (e.g., *Food*, `clamp(3rem, 7vw, 6rem)`)
  - Logo strip: brand logos in monochrome on cream, evenly spaced row. Sized so the strip itself reads as a typographic line, not a logo soup. ~36–48px tall on lg.
  - Product photo marquee: horizontal infinite-scroll ticker beneath, each photo on a soft cream-tinted card with brand caption. Motion-safe; reduced-motion: static grid of 4–5 products visible.
- **Bands:**
  - **Food** — Logos: Mars · Wrigley, Glico, NewChoice, AMOS, Wei Long. Products: Snickers, M&M's, Pocky variants, NewChoice bear jellies + Doraemon jar, AMOS gummies (see open question #1), Wei Long snacks.
  - **Beverages** — Logos: Red Bull, Warrior. Products: Red Bull Classic, Red Bull Blue, Red Bull Extra, Warrior Grape (can + bottle), Warrior Strawberry (can + bottle).
  - **Non-Food** — Logos: BiC, Caretex. Products: BiC lighters (3 variants), BiC shavers (3 variants), Caretex item(s).
- **Data sources:** `brands.ts` (logos, categories, stories), `productPhotos` in `photography.ts`.
- **Resolves feedback:** #1, #9, #10, #11

### §05 The Joint Venture

- **Surface:** ink, cream type
- **Layout:** 12-col grid; left col (7): editorial headline + body, right col (5): Dory Rich logo + outbound link card.
- **Eyebrow:** `─── STORY 05 · THE JOINT VENTURE` (gold-strong)
- **Headline:** *Dory Rich — where distribution becomes manufacturing.* (italic)
- **Body:** "In 2024, Richfield and TCP formed Dory Rich JSC — a joint venture that brings manufacturing under the same umbrella that already carries the brands. One relationship, end-to-end."
- **Right col:** Dory Rich logo (large), then a mono link `→ DORYRICH.COM.VN` underneath with a gold rule above. Link target: `site.external.doryRich`.
- **Optional photo:** if a leadership/town-hall photo fits the visual weight, place it as a small inset below the right col (decision deferred — implementation can call it).
- **Resolves feedback:** #12 (visibly separate section)

### §06 Colophon

- **Surface:** cream, ink type
- **Layout:** Single full-width centered or left-aligned display lockup; folio footer beneath.
- **Display lockup:**
  - Italic eyebrow: *Established*
  - **1994.** in display weight (`clamp(5rem, 12vw, 11rem)`), ink, slight tracking-in, no italic
  - Sub-line, mono: `VIETNAM · MALAYSIA · CHINA · THIRTY YEARS`
- **Footer block (mono, `v2-size-folio`):**
  - Address (from `site.address.full`)
  - Phone office + hotline (from `site.phones`)
  - Email (from `site.email`)
  - Facebook (from `site.socials.facebook`)
  - Bottom rule + colophon line: `COLOPHON · ISSUE 30 — RICHFIELD WORLDWIDE JSC · 1994 — 2026 · NEXT ISSUE · 2031`
- **Resolves feedback:** #2

---

## 5. Cross-cutting commitments

### Typography & emphasis

- Every section headline uses `v2-size-feature` or `v2-size-standfirst` (clamp 2.4rem–5.2rem) — no smaller display headlines anywhere.
- Eyebrows always `v2-mono v2-size-eyebrow` with a hairline rule prefix.
- "Three" / other emphasized words: italic + gold-strong, never just gold (the italic carries semantic weight).
- No italicized direction labels ("South", "North", etc.).

### Gold tokens

Add two siblings to the existing gold token in `app/globals.css`:

```css
--gold:        oklch(0.74 0.115 82);   /* existing — decorative */
--gold-strong: oklch(0.62 0.14 75);    /* NEW — accent text on cream */
--gold-rule:   oklch(0.58 0.15 75);    /* NEW — hairline rules on cream */
```

The Tailwind config gets matching utilities (`text-gold-strong`, `bg-gold-strong`, `border-gold-strong`, `text-gold-rule`).

Where to use which:
- `text-gold` — eyebrows on ink surfaces (current behavior, still works)
- `text-gold-strong` — eyebrows on cream surfaces, category numerals, key word emphasis
- `border-gold-rule` / `bg-gold-rule` — hairline rules above category markers and stat strips

### Surface separation

- Surface palette flips every section (cream ↔ ink, with one cream+gold-rules section in the middle for the directory).
- No two adjacent sections share the same surface.
- Reduced motion: morph seams become hard color cuts (still visibly separated).

### Photography

- Continue using existing `v2-photo-duotone` class for all hero photos.
- Text never overlaps a photo gradient. Captions sit beneath photos.
- All photos sourced from `/public/photos/`, no new image assets required for this iteration (except potentially AMOS gummy photos — see open questions).

---

## 6. Files changed

### New files

- `app/_components/v2/magazine-flow.tsx` — the `MagazineFlow` primitive + `MagazineFlowSection` wrapper
- `app/_components/v2/what-we-do-spread.tsx`
- `app/_components/v2/field-atlas-spread.tsx`
- `app/_components/v2/directory-spread.tsx`
- `app/_components/v2/joint-venture-spread.tsx`
- `app/_components/v2/colophon-spread.tsx`
- `app/_components/v2/product-marquee.tsx` — horizontal motion-safe ticker used by §04

(All new spreads live at the `app/_components/v2/` root, alongside the existing `cover-spread.tsx` and `lead-spread.tsx`.)

### Modified files

- `app/v2/page.tsx` — drop `MagazineCanvas`, compose via `MagazineFlow` with the 6 sections
- `app/_components/v2/lead-spread.tsx` — update numbers (180K/300+/800+), update stat-strip eyebrow to "BY THE NUMBERS · VIETNAM", restyle stats as bordered cards, restyle layout for normal-flow context (drop the 100svh fit constraint)
- `app/_components/v2/vertical-toc.tsx` — update labels, add active-section underline tracking
- `app/_components/v2/cover-spread.tsx` — no structural change; verify eyebrow text is still correct (`VIETNAM · MALAYSIA · CHINA · SINCE 1994` stays — that's group geography, not stats)
- `app/globals.css` — add `--gold-strong` and `--gold-rule` custom properties; matching Tailwind config entries
- `content/en/site.ts` — confirm `tagline` and `taglineLong` (no change needed unless wording shifts)

### Files unused (kept on disk for reference)

- `app/_components/v2/magazine-canvas.tsx`
- `app/_components/v2/magazine-morph.tsx`

These are removed from imports but kept on disk in case a future iteration revisits the in-place crossfade pattern.

### Content files audited (no changes expected)

- `content/en/brands.ts` — already updated for AMOS gummies, Glico (not Pocky)
- `content/en/capabilities.ts` — already 3 pillars (no Export)
- `content/en/photography.ts` — partnerLogos and productPhotos cover everything needed

---

## 7. Out of scope (explicitly deferred)

- Sub-pages (`/v2/brands`, `/v2/distribution`, etc.) — covered in a later cycle.
- Site-wide top navigation for v2 — magazine wayfinding is masthead + Vertical TOC.
- v1 design feedback that doesn't translate to v2 (green nav color, photo-band gradients, modern-trade hierarchy of the distribution page, brand-page retailer logos).
- Performance optimization of the cover carousel beyond what exists.
- Internationalization (the content remains English-only; the directory structure `content/en/` suggests future localization but is not part of this spec).

---

## 8. Open questions

1. **AMOS product photos.** Current `productPhotos.AMOS` array in `photography.ts` lists crayons (`amos-amos.webp`, `amos-bunny.webp`, `amos-hero.webp`). Customer feedback says AMOS is gummy candies. Either (a) AMOS gummy product photos need to be sourced from the client and added to `/public/photos/products/`, or (b) the directory's AMOS row in §04 falls back to logo-only until photos arrive. The implementation plan should call out which we're doing.

2. **Caretex product photos.** Likewise — confirm whether Caretex product photos exist. (`brands.ts` mentions Caretex as personal care; not visible in current `productPhotos`. May need source from client.)

3. **Active-section TOC tracking — keep on cover or only show after.** Implementation question: does the Vertical TOC stay visible on the cover (current behavior) and become fixed after the cover scrolls past, or does it only appear once §01 enters view? Recommend the former (continuous wayfinding) but accept the latter if the fixed-positioning transition is fragile.

---

## 9. Success criteria

A reviewer scrolling /v2 after this work should be able to say:

1. Every customer content-feedback item from the brief is visibly addressed (use the table in §2 to verify).
2. Each of the 6 sections feels like a distinct magazine "page" — surface palette changes, headlines are large enough to read as section dividers, content within is dense but legible.
3. The morph transition between sections feels intentional (a soft color/blur dissolve at the seam, not a hard cut, not a jarring full-viewport pin).
4. The Vertical TOC reflects the section the reader is in.
5. The cover masthead, Lead headline, "Three" emphasis in §03, category dividers in §04, and the **1994** in §06 each register as the gold-touched typographic statements they're meant to be.
6. No Export anywhere. No italicized "South" anywhere. No text overlapping a photo gradient.
7. Reduced-motion users see solid surfaces with hard cuts between sections — still legible, still chaptered.
