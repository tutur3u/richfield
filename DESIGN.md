---
name: Richfield · Issue 30 Worldwide
description: Editorial magazine system for a 30-year FMCG distribution group — warm paper, single gold accent, asymmetric broadsheet storytelling.
register: brand
colors:
  ink: "oklch(0.22 0.015 158)"
  paper: "oklch(0.985 0.006 70)"
  cream: "oklch(0.96 0.018 82)"
  white: "oklch(1 0 0)"
  gold: "oklch(0.72 0.16 78)"
  gold-strong: "oklch(0.62 0.14 75)"
  gold-rule: "oklch(0.58 0.15 75)"
  sunrise: "oklch(0.84 0.13 88)"
  green: "oklch(0.51 0.135 148)"
  forest: "oklch(0.32 0.062 155)"
  muted: "oklch(0.52 0.018 250)"
  line: "oklch(0.86 0.018 82)"
typography:
  display:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(4rem, 12vw, 11rem)"
    fontWeight: 300
    lineHeight: 0.92
    letterSpacing: "-0.035em"
    fontVariation: "'SOFT' 20, 'opsz' 96"
  headline:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(2.6rem, 5vw, 4.5rem)"
    fontWeight: 340
    lineHeight: 0.98
    letterSpacing: "-0.026em"
  standfirst:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(2rem, 5vw, 4.5rem)"
    fontWeight: 340
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.3rem, 1.7vw, 1.55rem)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.018em"
  body:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(16px, 1.1vw, 17px)"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "clamp(12px, 1vw, 14px)"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.22em"
  accent:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(4.4rem, 7.5vw, 6.8rem)"
    fontWeight: 400
    lineHeight: 0.78
    letterSpacing: "-0.02em"
rounded:
  none: "0"
  hairline: "2px"
  pill: "9999px"
spacing:
  rhythm: "clamp(18px, 1.8vw, 28px)"
  flow-gap: "clamp(20px, 2.2vw, 34px)"
  col-gap: "clamp(24px, 3vw, 64px)"
  page-pad-y: "clamp(24px, 3.5vw, 48px)"
  measure: "70ch"
  shell: "1500px"
components:
  eyebrow-label:
    textColor: "{colors.gold-strong}"
    typography: "{typography.label}"
  headline:
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
  drop-cap:
    textColor: "{colors.gold-strong}"
    typography: "{typography.accent}"
  folio:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
  stat-figure:
    textColor: "{colors.ink}"
    typography: "{typography.title}"
  pillar-card:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
---

# Design System: Richfield · Issue 30 Worldwide

## 1. Overview

**Creative North Star: "The Worldwide Field Journal"**

Richfield is a thirty-year FMCG distribution group that carries the world's most-loved brands across Vietnam, Cambodia, and Myanmar. This site refuses the SaaS-distributor template. It is built as a printed magazine, *Issue 30 · Worldwide*, that documents a working network the way a serious field journal documents an expedition: at ground level, with real photographs of real people, paced as a long deliberate scroll where each section is a spread. The warmth comes from paper, not from rounded corners; the authority comes from a disciplined grid and a single restrained accent, not from drop shadows or gradients.

The system is **warm, earnest, and broadsheet-serious**. Cream and paper surfaces read like uncoated stock under a desk lamp. A muted gold is the only chromatic voice, used the way a magazine uses a spot color: on rules, eyebrows, drop caps, and one emphasized word per headline, never on flat fields. The forest and field greens belong to the map and the data, not the chrome. Photography is treated as a citizen of the grid: duotone-tinted, snapped to column edges, sized in column units, full-bleed only when a single image earns the whole eye. Type carries the storytelling — a high-contrast display serif (Fraunces) for headlines and a clean grotesque (Schibsted Grotesk) for the justified body, with a monospaced voice (Geist Mono) for the editorial furniture (folios, eyebrows, captions, stat labels).

This explicitly rejects: the centered icon-title-paragraph hero; identical card grids where three equal modules compete for the eye; glassmorphism, gradient text, and drop-shadow "elevation"; the dark-mode-with-neon dev-tool look; and the symmetric 6/6 column split that makes a layout feel like a slide instead of a spread. The reference shelf is editorial, not corporate: Alexey Brodovitch and Fabien Baron's *Harper's Bazaar* (white space as composition, "astonish me"), Willy Fleckhaus's *Twen* (the grid plus dramatic scale jumps), and the modern crop that pairs storytelling with product, *Monocle*, *Kinfolk*, *Cereal*, *Bloomberg Businessweek* (Tracy Ma era), and *Condé Nast Traveler*.

**Key Characteristics:**
- Paper-warm light surfaces (cream / paper / ink), never pure `#fff` or `#000`.
- One gold accent, spot-color discipline; greens reserved for map and data.
- Display serif headlines + grotesque justified body + monospace furniture.
- Asymmetric, baseline-locked spreads with one dominant element each.
- Flat by doctrine: depth from value, photography, and motion, not shadows.
- Full-bleed duotone photography that interlocks with the text column.

## 2. Colors: The Worldwide Spot-Color Palette

A near-monochrome paper-and-ink foundation carrying a single warm gold accent, with field greens held in reserve for cartography and data. Tokens are authored in **OKLCH** (the project's canonical format, defined in `app/globals.css` under Tailwind v4 `@theme`); the frontmatter mirrors them in OKLCH and accepts the Stitch hex-only linter warning rather than splitting the source of truth.

### Primary
- **Muted Field Gold** (`oklch(0.72 0.16 78)`): the only chromatic voice on the chrome. Hairline rules, eyebrow labels, the emphasized word in a headline, pagination markers, drop caps. A spot color, not a fill.
- **Burnt Gold** (`oklch(0.62 0.14 75)` / `gold-strong`): the readable, higher-contrast gold for text on light paper — eyebrows, drop caps, the single italic emphasis word. Use this, not `gold`, whenever gold becomes type on cream.

### Secondary
- **Distribution Green** (`oklch(0.51 0.135 148)` / `green`): the map's living territory and the selection highlight (`::selection`). Reserved for cartography, data, and territory, never decorative panels.
- **Deep Forest** (`oklch(0.32 0.062 155)` / `forest`): the darker green for map landmass and dense data marks. Grounds the green family.

### Tertiary
- **Sunrise** (`oklch(0.84 0.13 88)` / `sunrise`): a warm pale highlight, used sparingly for soft emphasis and gradient transitions toward gold.

### Neutral
- **Ink** (`oklch(0.22 0.015 158)`): the near-black text and the "feature" surface (dark spreads). Tinted faintly green-neutral, never `#000`.
- **Cream** (`oklch(0.96 0.018 82)`): the primary page surface. Warm uncoated-stock base for most spreads.
- **Paper** (`oklch(0.985 0.006 70)`): the lighter, slightly cooler surface used to mark a seam between spreads (the morph at section boundaries).
- **White** (`oklch(1 0 0)`): reserved for the one bright plate (the map spread), where the cartography needs maximum contrast.
- **Muted** (`oklch(0.52 0.018 250)`): cool grey for de-emphasized metadata.
- **Hairline** (`oklch(0.86 0.018 82)` / `line`): the warm divider tint for 1px rules on light surfaces.

### Named Rules
**The One Voice Rule.** Gold appears on no more than ~10% of any spread, and never as a filled field. It is a spot color: rules, eyebrows, one drop cap, one emphasized word. The moment a gold panel or gold button appears, the spell breaks.

**The Reserved Green Rule.** Greens belong to territory and data — the map, the selection highlight, charts. Green is forbidden on navigation, headings, and editorial chrome. If green is decorating a UI element, it is misused.

**The No-Pure-Black/White Rule.** Every neutral is tinted toward the paper hue. `#000` and `#fff` are banned; ink is `oklch(0.22 0.015 158)`, the brightest surface is the `white` token used only on the map plate.

## 3. Typography

**Display / Headline Font:** Fraunces (with Georgia, serif fallback) — applied via the Tailwind `font-display` utility.
**Grotesque / Body Font:** Schibsted Grotesk (with system-ui fallback) — applied via the `.v2-display` class, which also sets the inherited body face inside every v2 spread.
**Italic Accent Font:** Newsreader italic (with Georgia, serif fallback) — applied via `.v2-dropcap` and large pull-quotes only, never inline.
**Furniture / Mono Font:** Geist Mono (with ui-monospace fallback) — applied via `.v2-mono`.

**Character:** A high-contrast literary serif against a quiet contemporary grotesque, refereed by a precise monospace. Fraunces runs with `SOFT` dialed to 20 and `opsz` at 96 so display glyphs read sharp and decisive rather than soft; its italic is the magazine's emotional register. Schibsted keeps the body neutral and modern so the serif headlines and gold accents do the talking. Geist Mono is the masthead's voice: folios, datelines, captions, stat labels — the printed-page furniture.

> Naming caution for implementers: this codebase has two distinct "display" concepts. The Tailwind utility `font-display` resolves to **Fraunces** (the serif). The CSS class `.v2-display` resolves to **Schibsted Grotesk** (the grotesque) and is set on the `<section>`, so unstyled text inside a spread inherits Schibsted. Headings opt into the serif with `font-display`. Do not conflate them.

### Hierarchy
- **Display** (Fraunces, 300, `clamp(4rem, 12vw, 11rem)`, lh 0.92, tracking -0.035em): cover wordmark scale only. One per page.
- **Standfirst** (Fraunces italic, `clamp(2rem, 5vw, 4.5rem)`, lh 1.05): the cover's italic opening lines and large pull-quotes. The italic is reserved for this emotional register.
- **Headline / Feature** (Fraunces, ~340, `clamp(2.6rem, 5vw, 4.5rem)`, lh 0.98, tracking -0.026em): the section H2 that opens every spread. One shared scale across §01–§05 (set first on the Lead spread); negative leading so multi-line headlines read as one tight mass. Authored as an inline `text-[clamp(…)]` on each `<h2>`, not via a `.v2-size-*` token — the unused `.v2-size-feature` / `.v2-size-section` classes in `globals.css` are legacy and a future consolidation target.
- **Title** (Schibsted Grotesk, 500, `clamp(1.3rem, 1.7vw, 1.55rem)`, lh 1.1): pillar/sub headings and stat figures.
- **Body** (Schibsted Grotesk, 400, `clamp(16px, 1.1vw, 17px)`, lh 1.6): justified editorial columns, `hyphens: auto`, capped at ~70ch.
- **Label / Eyebrow / Folio** (Geist Mono, `clamp(12px, 1vw, 14px)`, tracking 0.22em eyebrow / 0.18em folio, uppercase): all editorial furniture.

### Named Rules
**The Justified Column Rule.** Body copy is justified with `hyphens: auto` and `lang="en"` set, always within a ~70ch measure. Justification without hyphenation opens rivers; both must travel together, and the measure must never exceed ~75ch.

**The Italic-Is-Sacred Rule.** Newsreader italic and Fraunces italic carry emotion: the cover standfirst, one emphasized word in a headline, the drop cap, a pull-quote. Italic is never used for running body text or for whole paragraphs.

**The One Emphasis Rule.** A headline emphasizes at most one word, set in gold italic. Two emphasized words in one headline is a dilution, not a crescendo.

## 4. Elevation

The system is **flat by doctrine**. There are no `box-shadow` tokens anywhere in the stylesheet. This is an uncoated-paper aesthetic: surfaces sit in the same plane, and depth is created three other ways. First, **tonal layering** — the scroll alternates between `cream`, `ink`, `white`, and `paper` section backgrounds, and the small value shift at each boundary (the "morph" seam, cream → paper) reads as a turned page rather than a raised card. Second, **photography** — full-bleed duotone images and directional overlay gradients (`.photo-overlay-left/-right`) carry foreground/background separation that a shadow would otherwise fake. Third, **motion** — the only "lift" in the system is kinetic: a pillar card rises 10px on hover while its siblings recede in opacity and saturation. Nothing is elevated at rest.

### Shadow Vocabulary
None. The project ships zero drop shadows. Depth = value contrast + image + motion.

### Named Rules
**The Flat-Paper Rule.** Surfaces are flat at rest, always. If a layout needs a card to "pop," the answer is a value shift in the background, a hairline rule, a full-bleed photo, or a hover lift — never a drop shadow. A box-shadow on any surface is a regression.

**The Turned-Page Seam Rule.** Section boundaries are marked by a deliberate small value step between surface tokens (cream ↔ paper ↔ ink ↔ white), not by borders or shadows. The seam is the page turn.

## 5. Components

Each component leads with a character line, then shape, color assignment, and behavior. Examples are drawn from the cover and Stories 01–03 (Lead, What We Do, Field Atlas).

### Editorial Furniture (Folio, Eyebrow, Caption)
- **Character:** the printed-page masthead voice — quiet, mono, all-caps, wide-tracked.
- **Folio / running head:** Geist Mono, `v2-size-folio` (uppercase, tracking 0.18em), `opacity: 0.55`, single left-aligned running head (`RICHFIELD WORLDWIDE JSC`) followed by a 1px `currentColor` hairline (`.v2-rule`) that fills the remaining width. Opens every spread. **Minimal everywhere** — no two-sided issue/page/story stamp on the spreads (the cover is the one exception: it carries the `FolioStrip` masthead with a gold rule and an `ISSUE 30` stamp).
- **Eyebrow:** Geist Mono, `v2-size-eyebrow` (tracking 0.22em), set as `flex items-center gap-3` and led by a 32px `bg-current` hairline tick (`h-px w-8`, `opacity: 0.8`) that inherits the eyebrow's own gold. Sits directly above each headline (and on any secondary label, e.g. `BY THE NUMBERS`, `OUR JOURNEY`). **Surface-dependent color:** `gold-strong` on light surfaces (cream / paper / white), `gold` on dark (ink) surfaces — the lighter `gold` reads better on ink, the darker `gold-strong` holds contrast on paper.
- **Caption:** Geist Mono, `v2-size-folio`, `opacity: 0.8`, preceded by a 10–40px gold rule (`.v2-rule-gold`). On the cover it lives in an `aria-live` region and crossfades with the photo. (The caption/figcaption tick stays `.v2-rule-gold`; only the *eyebrow* tick uses `bg-current`.)

### Editorial Headline
- **Shape:** Fraunces via `font-display`, `text-[clamp(2.6rem,5vw,4.5rem)]`, tracking -0.026em, line-height 0.98, no radius. One shared scale across all spreads (see §3 Hierarchy).
- **Color:** `ink` on light surfaces, `cream` on ink surfaces; one emphasized word in `gold-strong` italic.
- **Behavior:** static; the only animation is the page-level reveal (opacity + 28px rise).

### Drop Cap
- **Style:** `.v2-dropcap::first-letter` — Newsreader italic, `gold-strong`, floated left at `clamp(4.4rem, 7.5vw, 6.8rem)`, line-height 0.78, tightened against the body baseline. Anchors the first body paragraph of a story.
- **Rule:** one drop cap per spread, on the lead paragraph only.

### Body Column
- **Style:** Schibsted Grotesk, `v2-size-body`, `text-justify`, `hyphens-auto`, `lang="en"`, ~70ch measure.
- **Rhythm:** paragraphs separated by the `rhythm` unit (`clamp(18px, 1.8vw, 28px)`).
- **Note:** the current spreads step body opacity down per paragraph (0.90 → 0.85 → 0.80). Treat this as legacy; see Do's & Don'ts — body should hold one ink value, with emphasis carried by drop cap and pull-quote, not by fading.

### Stats Band
- **Character:** a quiet data shelf that clears the floated photo and anchors the bottom of a spread.
- **Style:** a `<dl>` on a 2-up (mobile) / 4-up (sm+) grid. Figures in Schibsted Grotesk `title` scale, line-height 1; labels in Geist Mono ~10px, tracking 0.18em, `opacity: 0.55`.

### Pillar / Focus-Row Card
- **Character:** image-led editorial module — photo, then sub-head, justified blurb, mono stat line.
- **Shape:** no card chrome; square (no radius), no border, no shadow. The photo (16:10, `overflow-hidden`) is the visual anchor.
- **Behavior (`.v2-pillar-row`):** on hover, the hovered `article` lifts `translateY(-10px)` while siblings drop to `opacity: 0.42` and `saturate(0.4)`, over 700ms `--ease-out-expo`. Reduced-motion disables both.
- **Caution:** as currently built (three equal columns) this trips the identical-card-grid anti-pattern. See Do's & Don'ts for the asymmetric remedy.

### Rules / Dividers
- **Hairline (`.v2-rule`):** 1px, `currentColor`, `opacity: 0.18`. The default divider.
- **Gold rule (`.v2-rule-gold`):** 1px, `gold`, `opacity: 0.7`. Used short (10–40px) as a caption tick or accent, never as a long structural divider.

### Photography Treatments
- **Duotone (`.v2-photo-duotone`):** `saturate(0.92) contrast(1.04) sepia(0.06)` — the cover and feature imagery, unifying disparate photos into one warm register.
- **Tint (`.v2-photo-tint`):** `saturate(0.96) contrast(1.02)` — lighter touch for body imagery.
- **Overlay gradients (`.photo-overlay-left/-right`):** cream-to-transparent washes; vertical on mobile (legibility across the full width), horizontal split at `lg+` so the photo breathes on the empty rail.
- **Edge bleed (`.v2-bleed-x`):** extends a child to the full `100vw` out of the centered `1500px` shell. Reserved for the one hero image that earns the whole eye.

### Cover Furniture
- **Vertical TOC:** desktop-only contents list, right rail, mono, with an active-section state.
- **Pagination dots:** mono numerals (`01`, `02`…) with an animated underline (4px → 10px, cream → gold) marking the active cover photo. Click to advance; hover/focus pauses the 7s auto-advance.

## 6. Do's and Don'ts

### Do:
- **Do** build every spread as an **asymmetric composition**: split the 12-col grid `7/5`, `8/4`, or `5/7`, and let one element (a headline, a full-bleed photo, the map) dominate while everything else is subordinate. This is the Brodovitch/Fleckhaus move and the fix for the flat, slide-like feel of Stories 01–02.
- **Do** lock all vertical gaps to **one rhythm unit** (`spacing.rhythm`, `clamp(18px, 1.8vw, 28px)`): the gap between paragraph and paragraph must equal the gap between paragraph and image. Uniform vertical color is what makes a page read as a magazine spread rather than stacked sections.
- **Do** treat **images as citizens of the grid**: snap every photo to a column edge and align its top/bottom to the body baseline so text and image share edges and "back each other." Size photos in column units (2-col, 3-col, full-bleed), never arbitrary widths.
- **Do** use **active white space** — bank the empty space deliberately to one side (an empty rail, a hanging margin) to create tension and direct the eye. Asymmetric margins, not centered padding.
- **Do** justify body copy with `hyphens: auto` and `lang` set, within ~70ch (`The Justified Column Rule`).
- **Do** keep gold to ≤10% of a spread, as a spot color only (`The One Voice Rule`).
- **Do** alternate **full-bleed and inset** modules down the scroll to create a breathing pulse, and stagger the top baselines of adjacent columns so the spread has the asymmetric "shelf" feel of *Monocle* and *Bloomberg Businessweek*.
- **Do** convey depth through tonal surface shifts, photography, and the hover lift (`The Flat-Paper Rule`).

### Don't:
- **Don't** split a spread `6/6` or center a single stack. A symmetric, centered layout reads as a slide, not a spread. Break the grid intentionally instead.
- **Don't** ship **identical card grids** — three or more equal-sized modules with photo + heading + blurb repeated in a row (the current What We Do pillar row). Vary module size and weight, or stagger their baselines, so one leads.
- **Don't** use the **centered icon-title-paragraph hero** or large rounded-corner icons above headings. These scream template.
- **Don't** add **drop shadows** to any surface; there are none in the system and there should be none (`The Flat-Paper Rule`). No glassmorphism, no decorative blur.
- **Don't** use **gradient text** (`background-clip: text`) or `border-left`/`border-right` color stripes as accents. Emphasis is weight, scale, italic, or the gold spot — never a side stripe or a gradient fill.
- **Don't** let **gold become a filled field or a button**, and don't use **green** on chrome or headings (`The One Voice Rule`, `The Reserved Green Rule`).
- **Don't** use `#000` or `#fff`; every neutral is tinted toward the paper hue (`The No-Pure-Black/White Rule`).
- **Don't** set running body copy in italic or fade it paragraph-by-paragraph; hold one ink value and carry emphasis through the drop cap and pull-quote (`The Italic-Is-Sacred Rule`).
- **Don't** exceed a ~75ch measure or justify without hyphenation — rivers and overlong lines break the editorial color.
- **Don't** add em dashes or `--` in copy; use commas, colons, semicolons, periods, or parentheses.

## 7. Section-by-Section Spec (extracted from the spreads)

A per-spread record of the *actual* type and structure in the homepage flow (`app/v2/page.tsx`), captured after the consistency pass below. Reading order: Cover → §01 Lead → §02 What We Do → §03 Field Atlas → §04 Directory (intro + shelf) → §05 Joint Venture → §06 Colophon.

### Shared anatomy

Every spread (`app/_components/v2/*-spread.tsx`) is a `<section className="v2-display …">` (Schibsted base face) at `min-h-[100svh]`, centred in a `max-w-[1500px]` shell with `px-6 sm:px-10 lg:px-12` and `py-[clamp(24px,3.5vw,48px)]`. Each opens with the minimal folio, then its content. The recurring type roles resolve to:

| Role | Font | Size | lh | tracking | Color |
|---|---|---|---|---|---|
| Folio | Geist Mono | `clamp(11px,0.9vw,13px)` | — | 0.18em, uppercase | currentColor @ 0.55 |
| Eyebrow | Geist Mono | `clamp(12px,1vw,14px)` | — | 0.22em, uppercase | `gold-strong` (light) / `gold` (dark) + `bg-current` tick |
| Headline (H2) | Fraunces | `clamp(2.6rem,5vw,4.5rem)` | 0.98 | -0.026em | `ink` (light) / `cream` (dark), 1 gold-strong italic word |
| Body | Schibsted | `clamp(16px,1.1vw,17px)` | 1.6 | — | ink/cream, justified, `hyphens-auto` |
| Drop cap | Newsreader italic | `clamp(4.4rem,7.5vw,6.8rem)` | 0.78 | — | `gold-strong` |

### §00 — Cover (surface: `ink`)
- **Structure:** full-bleed duotone photo carousel (7s auto-advance, crossfade) under a letterbox + right-veil gradient. Top: `FolioStrip` masthead (legal name left, `ISSUE 30` stamp right, gold rule between) — the one folio exception. Bottom: 12-col grid → `col-9` standfirst stack ‖ `col-3` Vertical TOC (lg only). Pagination dots beneath.
- **Type:** eyebrow `gold` + tick (`VIETNAM · CAMBODIA · MYANMAR · SINCE 1994`); `<h1>` standfirst Fraunces `.v2-size-standfirst` `clamp(2rem,5vw,4.5rem)`/1.05, three staggered italic-register lines, `max-w-[22ch]`; caption Geist Mono folio size, `aria-live`, crossfades with the photo.
- **Dominant element:** the photograph.

### §01 — Lead (surface: `cream`)
- **Structure:** single body flow (not a grid). Photo cycle floats top-right at `lg:w-[50%]`, aspect 3/2; eyebrow + H2 hang in the left column; three body paragraphs wrap the float; drop cap on ¶1. A stats band clears the float and is pinned to the bottom by `justify-between` — a 2-up (mobile) / 4-up (sm+) `<dl>`.
- **Type:** eyebrow `ABOUT THE GROUP` gold-strong + tick; H2 `From market entry to nationwide distribution.`; stat figures Schibsted `clamp(1.7rem,2.2vw,2.1rem)`/1, labels Geist Mono 10px/0.18em @ 0.55; second eyebrow `BY THE NUMBERS` + tick.
- **Dominant element:** headline + floated photo.
- **Note:** body paragraphs still ladder opacity `0.90 → 0.85 → 0.80` — flagged legacy (§5 Body Column, §6).

### §02 — What We Do (surface: `ink`)
- **Structure:** full-width headline block (eyebrow + H2 + one intro ¶), then a 3-up pillar row (`.v2-pillar-row`, `lg:grid-cols-3`). Each `<article>`: 16:10 photo → h3 sub-head → justified blurb → mono stat line. Hover lifts the hovered card `-10px` while siblings drop to `opacity 0.42` / `saturate(0.4)`.
- **Type:** eyebrow `WHAT WE DO` **gold** (dark surface) + tick; H2 `lg:whitespace-nowrap`, emphasis word `markets` in gold-strong italic; h3 Schibsted `clamp(1.3rem,1.7vw,1.55rem)`; stat line Geist Mono folio.
- **Dominant element:** the headline, then the pillar row.
- **Note:** three equal pillars trip the identical-card-grid anti-pattern (§6) — asymmetry is the open remedy.

### §03 — Field Atlas (surface: `white`)
- **Structure:** 12-col grid, vertically centred (`items-center`): `col-5` text (eyebrow + H2 + body + office roster `<dl>`) ‖ `col-7` map plate (`AtlasMap`, native ratio — the one `white` plate in the flow). Roster rows reveal on scroll, staggered.
- **Type:** eyebrow `FOOTPRINT` gold-strong + tick; H2 three `<span class="block">` lines (`Three countries. / Three generations. / One promise.`), emphasis `generations`; roster `dt` Fraunces `clamp(1.25rem,1.7vw,1.55rem)`, `dd` Geist Mono `clamp(10px,0.85vw,12px)`/0.16em @ 0.5.
- **Dominant element:** the map (`col-7`).

### §04 — Directory (two spreads)
**§04a Intro (surface: `paper`)**
- **Structure:** content centred as one group (`justify-center`). Headline block (eyebrow `DIRECTORY` + H2, emphasis `recognized`, + body), then eyebrow `OUR JOURNEY` (now gold-strong + tick) over `JourneyTimeline` — `lg:grid-cols-6` / scroll-snap rail on mobile. Each milestone: gold dot on a hairline, Fraunces **gold** year `clamp(1.9rem,2.6vw,2.6rem)`, brand logo or name, country (mono folio), short note `clamp(13px,0.95vw,15px)`/1.5 @ 0.6.

**§04b Shelf (surface: `cream`)**
- **Structure:** `ShelfExplorer`. Masthead row shares one baseline: eyebrow `THE PORTFOLIO` + H2 `The full shelf.` (left) ‖ category tablist (right). Active tabpanel: descriptor + brand-logo roster, then a product mosaic that preserves each image's native aspect ratio.
- **Type:** category tabs Fraunces `clamp(1.2rem,1.8vw,1.7rem)` with an animated gold underline on the active tab; count Geist Mono 10–12px.
- **Dominant element:** §04a headline + timeline; §04b the product mosaic.

### §05 — Joint Venture (surface: `ink`)
- **Structure:** 12-col grid: `col-5` photo (4:3 duotone) + Dory Rich logo + `VISIT DORYRICH.COM.VN` link (gold, gold-rule tick) ‖ `col-7` text — eyebrow `STORY 05 — THE JOINT VENTURE` gold + tick → H2 `Dory Rich.` (`max-w-[14ch]`, `text-balance`) → deck line → drop-cap body → pull-quote → data `<dl>`.
- **Type:** the richest spread — the only one with a **deck** (Schibsted `clamp(1.1rem,1.5vw,1.4rem)`/1.18) *and* a **pull-quote** (Newsreader italic `clamp(1.15rem,1.7vw,1.55rem)`, bordered top/bottom) *and* a data list (FORMED / PARTNERS / SCOPE).
- **Dominant element:** the headline + pull-quote pairing.

### §06 — Colophon (surface: `paper`, back matter)
- **Structure:** 12-col grid: `col-7` an oversized `1994 — 2026.` date lockup + countries line + group photo (3:2) ‖ `col-5` `EDITOR'S NOTE` + note, a contact `<dl>` (office / telephone / email / social), and a `NEXT ISSUE — 2031` footer with a gold rule.
- **Type:** two eyebrows gold-strong + tick; the date lockup is its own display role — Fraunces `clamp(4rem,9.5vw,8rem)`/0.86, tracking -0.03em, gold-strong em dash — **not** the H2 headline scale.
- **Dominant element:** the date lockup.

### Consistency rules applied (this pass)
Four cross-section drifts were reconciled; the rules above now hold across every spread:

1. **One headline scale.** All §01–§05 H2 openers use the Lead scale `clamp(2.6rem,5vw,4.5rem)` / 0.98 / -0.026em (previously each spread had its own inline clamp: §03 `2.4–3.8rem`, §04a `1.9–3.7rem`, §04b `2.1–3.4rem`, §05 `2.6–5rem`). The Colophon date lockup is a separate display role and stays oversized.
2. **Minimal folio everywhere.** The two-sided issue/page/story folio on §05 and §06 was stripped to the single running head + hairline used by §01–§04. The cover keeps its distinct `FolioStrip` masthead.
3. **Surface-driven eyebrow color.** `gold-strong` on light, `gold` on dark. Fixed §02 (was gold-strong on ink) and §04a `OUR JOURNEY` (was gold on paper).
4. **Universal eyebrow tick.** Every eyebrow now leads with a 32px `bg-current` hairline tick (`h-px w-8` @ 0.8) that inherits the eyebrow's gold — previously only the Cover, §05, and §06 had a tick, in three different colors (`gold/80`, `gold/70`, `gold-rule`).
