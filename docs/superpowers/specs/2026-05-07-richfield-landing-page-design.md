# Richfield Landing Page · Design Spec

**Status:** Approved through brainstorming. Implementation plan to follow.
**Date:** 2026-05-07
**Target launch:** 2026-05-31 on `richfieldgroup.com.vn`
**Owners:** Design + eng (single team for this engagement)

---

## 1. Context

Richfield Worldwide JSC is one of the largest FMCG distributors in Vietnam, headquartered in HCMC. The Group spans Vietnam, Malaysia (origin, family business), and China (sourcing & brands). Distributed brands include Mars, TCP (Red Bull / Warrior), BiC, AMOS, NewChoice, Wei Long, and Glico (Pocky). A joint venture with TCP Group, Dory Rich JSC, was established in 2024 and brings manufacturing capability under the Richfield umbrella.

The current site (`richfieldvn.com.vn`) is being replaced. The new domain `richfieldgroup.com.vn` launches **2026-05-31**, the same day the old domain expires. The competitive brief (April 2026, prepared for the BOD) sets the strategic direction: lean on the international-Group story, lift Annam Group's structure (hero · footprint · timeline · brand wall · careers), beat local peers (Hương Thủy, Mesa, 3A Logistics) on polish rather than feature breadth, match DKSH on architecture only.

This spec covers a focused engagement: **homepage to production quality, three priority inner pages to production quality (About, Brands, Careers), a What We Do parent-landing page, three scaffold pages (Distribution, Logistics, Products) so every nav item resolves to something respectable, plus a Contact page**. Nine routes total. The full content for `/products` is not yet ready and stays light by design.

### Sources consulted

- `client-doc/web-redesign/content/content.md` — primary content source
- `client-doc/mockup/content/content.md` — corrections and updates (overrides primary on conflict)
- `client-doc/competitor-deck/deck.md` — strategic direction
- `client-doc/sample/01_landing_A_editorial (1).html` — vibe-approved editorial sample (preferred direction)
- `client-doc/sample/02_landing_B_premium (1).html` — secondary preference
- `client-doc/sample/03_landing_C_bold (1).html` — tertiary preference
- `client-doc/web-redesign/proposed-navigation/image.png` — original IA proposal
- `client-doc/web-redesign/assets/**` — distribution / warehouse / brand / footer / history reference photography
- `client-doc/mockup/assets/**` — rendered crops of sample A (the client's "moments we love" highlight reel)

### Stack (existing — do not replace)

- Next.js **16.2.4** (App Router). Per `AGENTS.md`: this is a new Next.js with breaking changes; the implementation plan must consult `node_modules/next/dist/docs/` before writing code.
- React 19.2.5
- TypeScript 6
- Tailwind CSS v4 (via `@tailwindcss/postcss`)
- Geist + Geist Mono fonts (already wired in `app/layout.tsx`)
- `@vercel/analytics` (already installed)

### Tech-stack additions

- **Playfair Display** via `next/font/google` (display serif)
- **Zod** (Server Action validation)
- **Resend** (or chosen transactional email SDK; pending decision in Open Items)
- *(Conditional)* `@radix-ui/react-dialog` only if mobile-drawer focus management proves too fiddly to own end-to-end.

### Tech-stack additions (dev dependencies)

- **Vitest** + `@vitejs/plugin-react` (primitive component tests)
- **Playwright** + `@playwright/test` (page-level smoke tests across all 9 routes)

### Tech-stack non-additions (deliberate)

- **shadcn/ui** is not used. Rationale: shadcn defaults are product-register (admin/SaaS) and would leak generic vocabulary into a brand-register editorial site that wants its own type, spacing, and radius identity. Hand-rolled primitives ship the editorial polish at lower restyling cost.
- `react-hook-form` (Server Actions + native HTML5 validation are sufficient).
- `framer-motion` (CSS-only motion register satisfies the editorial-restraint budget).
- Any third-party map library (the footprint map is hand-rolled inline SVG).

---

## 2. Decisions (locked through brainstorming)

| Decision | Choice |
|---|---|
| **Engagement scope** | Homepage + About / Brands / Careers / Contact (production) + What We Do landing / Distribution / Logistics / Products (scaffold). |
| **Approach** | Approach 2 — *Editorial+*. Sample A's editorial skeleton plus a "What we do" 4-pillar strip after the hero and a Dory Rich JV feature near the end. |
| **Vibe rank** | editorial > premium > bold |
| **Language at launch** | English only. Routing and content modules are i18n-ready so Vietnamese can drop in without a refactor. |
| **CTA strategy** | Soft CTAs only. No hero button, no form on the homepage. One restrained "Get in touch" cue placed between the brand wall and the footer. Contact link in nav and footer. |
| **Motion budget** | Editorial restraint. Subtle on-scroll fade-up reveals, gold dot pulses on map pins, hairline rules drawing in once, brand-cell hover bg shift. No parallax. No scroll-jack. No video hero. No KPI count-up. No marquee. Honors `prefers-reduced-motion`. |
| **Theme** | Light. Forced by the physical scene: an international FMCG brand owner reviewing the site mid-day on a 16-inch laptop in a Singapore office, deciding whether Richfield is the right partner for Vietnam market entry. Bright daylight, formal evaluation, premium-print associations. Cream + ink, no dark mode. |
| **Brand colors** | Gold + green on cream. Tokens defined in §4. |
| **Domain & launch** | `richfieldgroup.com.vn`, 2026-05-31. |

---

## 3. Information Architecture

### Routes (App Router)

```
app/
  (site)/
    page.tsx                         /                       Homepage (long-scroll)
    about/page.tsx                   /about                  Production
    what-we-do/page.tsx              /what-we-do             Production-light parent landing
    distribution/page.tsx            /distribution           Scaffold (content-rich; near-production)
    logistics/page.tsx               /logistics              Scaffold (content-rich; near-production)
    products/page.tsx                /products               Scaffold (intentionally light)
    brands/page.tsx                  /brands                 Production
    careers/page.tsx                 /careers                Production
    contact/page.tsx                 /contact                Production
    contact/actions.ts                                       Server Action
    layout.tsx                       (shared site shell — header + footer)
  layout.tsx                         root html, fonts, analytics
```

The `(site)` route group lets future siblings (`(legal)`, `(news)`) coexist without coupling. Locales are not in the URL today; content is sourced from typed modules under `content/en/`. A `[locale]` segment can wrap `(site)` later without rewriting pages.

### Top-level nav

```
[R RICHFIELD GROUP]   ABOUT   WHAT WE DO   BRANDS   CAREERS   CONTACT       EN · VI
```

Five flat items + the language switcher. No dropdowns. The logo links home (no separate "Home" item). `EN · VI` renders both labels: EN is current; VI is `aria-disabled` with native `title="Vietnamese coming soon"`. No popover, no JS, no client cost.

### Mobile nav

Hamburger right-edge → full-screen drawer at Display M scale, scroll-locked, focus-trapped. Hand-rolled, with a Radix Dialog escape hatch if focus management proves fiddly.

### Footer columns

| Column | Content |
|---|---|
| **Brand** | "R" mark + RICHFIELD GROUP wordmark + tagline *"From Market Entry to Nationwide Distribution. Vietnam · Malaysia · China."* |
| **Explore** | About · Brands · Careers · Contact |
| **Contact** | Richfield Worldwide JSC · 15A1 Nguyễn Hữu Thọ, Phước Kiển, Nhà Bè, HCM · Office: (+028) 3784 0237 · Hotline: 0917 331 132 · Email: cskh@richfieldvn.com.vn (post-migration target pending; see Open Items) |
| **Group** | Vietnam · Malaysia · China · Dory Rich JSC ↗ (external) |

A bottom hairline row contains: © year, social icons (Facebook · LinkedIn · Zalo), and `richfieldgroup.com.vn`.

---

## 4. Visual System

### Color tokens (OKLCH)

```css
@theme {
  --color-gold:    oklch(0.65  0.115 80);   /* warm gold, accents only */
  --color-ink:     oklch(0.16  0.012 165);  /* deep green-black */
  --color-green:   oklch(0.30  0.038 158);  /* deep forest */
  --color-cream:   oklch(0.94  0.022 85);   /* eggwhite, primary bg */
  --color-paper:   oklch(0.985 0.005 85);   /* tinted near-white, never #fff */
  --color-muted:   oklch(0.52  0.008 90);   /* warm grey */
  --color-line:    oklch(0.84  0.025 90);   /* warm hairline */
}
```

**Color strategy:** Committed register. Gold and green carry 30–60% of the surface, anchored by cream. Not Restrained (one accent ≤10%), not Drenched.

**Contrast audit:**

| Pair | Ratio | Use |
|---|---|---|
| ink on cream | 16.5 : 1 | Primary body text. AAA. |
| ink on paper | ~17 : 1 | Body on hover surfaces. AAA. |
| white on green | 11 : 1 | Hero copy, JV section copy. AAA. |
| white on ink | 17 : 1 | Timeline body, footer body. AAA. |
| gold on ink | 7.1 : 1 | Eyebrow labels, italic accents on dark. AA / AAA. |
| gold on green | 4.05 : 1 | Eyebrow labels, accents on green. AA. |
| gold on cream | 3.42 : 1 | **Decorative use only.** Italic display accents, eyebrow labels at small caps decorative size, pin dots, large numerals. Never body or paragraph text. |

### Typography

| Role | Family | Weights | Source |
|---|---|---|---|
| Display | **Playfair Display** | 400, 400-italic, 600 | Add via `next/font/google` |
| Body / UI | **Geist** | 400, 500, 600 | Already wired in `app/layout.tsx` |
| Mono | Geist Mono | 400 | Already wired; reserved use only |

Inter (in the original sample HTML) is not loaded; Geist replaces it — visually equivalent and already optimized for Next.js. We don't ship two sans fonts.

**Type scale (fluid):**

| Token | Value |
|---|---|
| Display XL (h1) | `clamp(56px, 7vw, 96px)` · line-height 1 · letter-spacing -0.025em |
| Display L (h2) | `clamp(40px, 5vw, 72px)` · line-height 1.05 |
| Display M (h3, year, JV lockup) | `clamp(28px, 3vw, 44px)` |
| Body L | 17px · line-height 1.55 |
| Body M | 15px |
| Body S | 14px |
| Eyebrow | 11px · uppercase · tracking 0.32em · gold |
| Caption | 12px · uppercase · tracking 0.16em · muted |

Body text caps at 65–75ch line length.

### Spacing

Tailwind v4 4px base. Container max-w 1300px, gutter 40px desktop / 24px mobile. Section padding varies for rhythm:

- **Tight sections** (What We Do strip, Soft CTA): `clamp(72px, 8vw, 100px)`
- **Standard sections** (Map, Timeline, Brand Wall): `clamp(96px, 11vw, 140px)`
- **Breath sections** (Quote, JV feature): `clamp(120px, 14vw, 200px)`

Same padding everywhere is monotony; varied padding is rhythm.

### Motion

```css
:root { --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1); }
```

- Scroll-reveals: 12px translateY + opacity 0→1, 600ms ease-out-expo, IntersectionObserver, fires once.
- Map pin pulse: `box-shadow` ring scale, 2s loop, decoration only, paused when off-screen.
- Hero background bloom: opacity 0.85 ↔ 1.0 at 8s ease-in-out, paused on `prefers-reduced-motion`.
- Brand cell hover: bg cream → paper, 200ms ease-out-expo.
- Hairlines draw in once on section enter: `scaleX(0) → 1`, 800ms ease-out-expo, transform-origin left.
- Soft-CTA underline: gold underline always present; gold-shifts on hover, 200ms.
- `prefers-reduced-motion`: a single CSS rule disables all reveals + pulses; replaces with instant render.

No parallax. No scroll-jack. No autoplay video. No KPI count-up. No marquee. Animations stay on transform + opacity (never CSS layout properties).

### Accessibility baseline

- Skip-to-content link as first focusable element on every page.
- Semantic landmarks: `<nav>`, `<main id="main">`, `<footer>`, `<section aria-labelledby>`.
- Heading order: h1 → h2 → h3, no skipping.
- Focus: visible 2px gold outline + 2px offset. `outline:none` is forbidden.
- Tap targets ≥44×44 mobile.
- Decorative SVG (dot patterns, hairlines, hero bloom) marked `aria-hidden="true"`.
- Map: `<title>` per pin SVG; the adjacent caption list is the text fallback.
- Real photos: descriptive `alt`. Logos: `alt="Mars"` etc. Brand cells without logos use semantic text.
- Form: `<label for>` on every field, `aria-describedby` for errors, focus moves to first error on submit failure / heading on success.
- `<html lang="en">` at launch; switches to `lang="vi"` when VI adds.

### Performance baseline

- LCP target ≤2.5s on Vietnamese 4G (median). INP ≤200ms. CLS ≤0.05.
- Hero is text + inline SVG → no LCP image dependency.
- All real photos via `next/image` with `sizes`, AVIF/WebP. Lazy below the fold; eager above the fold on `/distribution` and `/logistics`.
- Fonts: `display: swap`, preconnect to Google Fonts, subset Latin + Latin-Ext (covers VI diacritics later).
- All pages `export const dynamic = 'force-static'` except `/contact` (server action requires dynamic).
- Total client JS budget at launch: <35 kB gzipped across the entire site.

### Reusable primitives

`app/_components/primitives/`:
`<Eyebrow>`, `<DisplayHeading>`, `<HairlineRule>`, `<KpiStrip>`, `<Pin>`, `<BrandCell>`, `<TimelineItem>`, `<SectionHeading>`, `<SoftCta>`, `<CapabilityBlock>`. Each is an RSC unless explicitly client.

### Copy rules

- **No em dashes anywhere.** Sample HTML uses `—` in body copy (e.g., *"…distribution network — bringing the world's…"*). All web copy in this spec replaces `—` with periods, semicolons, colons, or parentheses. Copywriting and content modules must follow.
- Tagline always rendered as: **"From Market Entry to Nationwide Distribution"** (title case, no period).
- Vietnamese diacritics in addresses (Nguyễn Hữu Thọ, Phước Kiển, Nhà Bè) are preserved even in EN locale.

---

## 5. Homepage Anatomy (Approach 2 — Editorial+)

Long-scroll page, 9 stacked sections. All copy below complies with the no-em-dash rule.

### 5.1 — Site Header

`position: absolute` over hero on `/`; `position: sticky` on inner pages with `bg-cream/85 backdrop-blur-sm border-b border-line`. 96px desktop / 72px mobile. Container max-w 1300px. Layout: logo (left) · nav (center) · lang (right).

Logo: circular gold-bordered "R" mark (42px, Playfair italic) + wordmark "RICHFIELD GROUP" (Playfair 14px tracked +0.28em).

Nav items: ABOUT · WHAT WE DO · BRANDS · CAREERS · CONTACT (Geist 11px tracked +0.16em uppercase). Hover gold, 200ms ease-out-expo. Active route: 1px gold underline.

Lang switcher: "EN · VI". EN current (ink/cream). VI is `aria-disabled` with `title="Vietnamese coming soon"`. No popover.

Mobile: hamburger right-edge → full-screen drawer at Display M scale, scroll-locked, focus-trapped.

Edges: scroll past 80px on inner pages tightens to a 64px solid header. On homepage, header stays transparent until past hero (intersection observer).

### 5.2 — Hero (split, 100vh)

`min-h-screen` two-column grid `1.1fr 0.9fr`.

**Left panel:** green bg. Overlaid: gold radial-glow blooms (two, opacity 0.85↔1.0 breathing at 8s, paused on `prefers-reduced-motion`) + thin gold dashed SVG arcs. Bottom-left tag: "VIETNAM · MALAYSIA · CHINA" (gold tracked uppercase 11px).

**Right panel:** green bg, white text, padding 160px / 80px.

Top to bottom:

1. Eyebrow rule + "ESTABLISHED 1994" (gold).
2. **H1** Playfair 400 `clamp(56px, 7vw, 96px)`: *"From market entry to <em>nationwide distribution</em>."* (italic gold on the last two words.)
3. **Lede** 17px white-75%, max-w 440px: *"Vietnam's largest FMCG distribution network. Bringing the world's most loved brands to over 180,000 retail outlets nationwide."*
4. Hairline divider.
5. **KPI strip** (inline 4-cell horizontal, NOT cards, NOT iconified, NOT count-up):

| Label | Value (Playfair 32px) |
|---|---|
| YEARS | 30+ |
| SUB-DISTRIBUTORS | 300+ |
| RETAIL OUTLETS | 180K |
| SALESMEN | 800+ |

Treated as a magazine "by-the-numbers" callout, not the SaaS hero-metric template.

Mobile: stack; left panel becomes a 320px banner above text. H1 floors at 36px.

Motion: static on first paint (LCP-critical). Background bloom is the only motion; honors reduced-motion.

### 5.3 — What We Do (4 pillars)

Cream bg, tight section padding. 4-column grid (collapses 2/1 at md/sm). Pillars NOT in cards; separated by 1px hairline top + bottom.

Eyebrow "WHAT WE DO" + h2 *"Four ways we move <em>brands</em> to market."*

Pillar order matches mockup/content.md correction: Import → Logistics → GT → MT.

| # | Pillar | Body | Link |
|---|---|---|---|
| 01 | Import / Export | Customs declaration and full import support for international partners. | `/distribution#import-export` |
| 02 | Warehouse & Logistics | Two distribution centres in Long An and Hanoi, ambient and cold storage, end-to-end handling. | `/logistics` |
| 03 | General Trade | Nationwide coverage with 800+ salesmen across every province and city. | `/distribution#gt` |
| 04 | Modern Trade | Retailer partnerships across every chain, with trade-marketing display and event support. | `/distribution#mt` |

Each pillar: gold italic Playfair "01" → ink Geist 600 18px name → 14px muted body → "Read more →" gold underlined link.

Motion: 80ms cascading fade-up between pillars on scroll.

### 5.4 — Footprint Map

Cream bg, standard section padding. Two-column grid `1fr 1.4fr`.

**Left:** eyebrow "OUR FOOTPRINT" → h2 *"An <em>international</em> group with deep local roots."* → 3-sentence lede → hairline-divided list:

- **Vietnam** · HQ · HCMC
- **Malaysia** · Origin · 1990s
- **China** · Sourcing & Brands

**Right:** stylized SE-Asia map (SVG aspect 16:11, dot-pattern bg, three green country shapes for VN/MY/CN at 55% opacity, gold dashed arcs connecting them, three pin DOM nodes positioned absolutely with continuous pulse rings).

Map is pure CSS + inline SVG. No map library. No third-party JS. Country shapes carry `<title>` for SR. Pulse paused when off-screen via IntersectionObserver class toggle.

Motion: map fades up 12px on enter; pin pulses run only while visible.

Mobile: stack; map full-width above text.

### 5.5 — Journey / Timeline (7 milestones)

Ink bg full-bleed (white text). Standard section padding. Container inside.

Eyebrow "OUR JOURNEY" (gold) + h2 (white) *"A story of <em>partnerships</em> over thirty years."*

1px white-15% horizontal axis. 7 columns desktop. Each milestone: 14px gold dot on the axis → year (Playfair 42px gold) → brand+country (white 600 15px) → 1-line body (white-70% 14px).

Milestones (no em dashes anywhere):

| Year | Brand · Country | Body |
|---|---|---|
| 1994 | Mars · USA | Wrigley's becomes our first imported brand the year the US trade embargo lifts. |
| 1999 | NewChoice · Taiwan | First Taiwanese partner; the snack category joins the portfolio. |
| 2014 | TCP · Thailand | Warrior and Red Bull bring the energy and lifestyle category. |
| 2018 | BiC · France | Stationery and lighters expand the everyday-consumer footprint. |
| 2022 | AMOS · China | Art supplies and creative materials enter the lineup. |
| 2024 | Dory Rich JSC · Vietnam | Joint venture with TCP Group brings manufacturing and distribution under one roof. |
| 2026 | Glico · Japan | Pocky and confectionery; the latest international partnership. |

Motion: axis line draws in `scaleX(0)→1` once on first enter (800ms ease-out-expo); milestones cascade fade-up 80ms left-to-right.

Responsive: desktop 7-col → tablet 4+3 wrap → mobile horizontal-scroll snap track (touch scroll, scroll-snap-stop on each milestone, thin gold underline on the visible item).

Edges: when milestones grow past 9, switch desktop to 2-row wrap automatically; mobile snap track handles arbitrary count.

### 5.6 — Brand Wall

Cream bg, standard section padding. Eyebrow "OUR BRANDS" + h2 *"Trusted by the world's most <em>loved</em> brands."*

4-column magazine grid with **one feature cell** to break uniform-grid risk. Feature cell is `2×1` (top-left), the rest are `1×1`. 1px line gutters on a `--line`-colored bg gives sample A's hairline-separated look.

| Position | Content |
|---|---|
| Feature 2×1 | **MARS · WRIGLEY** lockup (italic Playfair 36px gold) + caption "Founding partner · Since 1994". Paper bg for emphasis. |
| 1×1 | TCP · Thailand |
| 1×1 | BiC · France |
| 1×1 | Red Bull · Austria |
| 1×1 | Glico (Pocky) · Japan |
| 1×1 | AMOS · China |
| 1×1 | NewChoice · Taiwan |
| 1×1 | Warrior · Thailand |
| 1×1 | Wei Long · China |

Each cell is a `<BrandCell>`. If a logo asset exists in `public/brands/`, it renders via `next/image`; otherwise it falls back to "brand name in Playfair 24px italic + country in tracked uppercase 10px muted." Either path is production-quality.

Hover: bg cream → paper, 200ms ease-out-expo. No transform, no shadow.

### 5.7 — Dory Rich JV feature

Ink bg, full-bleed, with a subtle linear gradient (top: ink, bottom: charcoal). Section padding `clamp(120px, 14vw, 200px)`. Container inside.

Header: eyebrow "JOINT VENTURE" (gold) → h2 (white) "Dory Rich JSC."

Card: 1px gold border, no fill, padding 80px. A "JV" label tab in italic gold Playfair sits notched on the top-left edge over the border. Inside, 2-column row `2fr 1fr`:

- **Left:** badge "ESTABLISHED 2024 · TCP GROUP × RICHFIELD" (gold tracked uppercase 11px) → h3 (Playfair 42px white) *"A successful collaboration between two leading corporations."* → body (white-70%): *"Dory Rich JSC pairs TCP Group's leadership in Thai energy-drink production with Richfield Group's nationwide FMCG distribution capability in Vietnam. Manufacturing, brand-building, and distribution under one roof."*
- **Right (centered):** italic display lockup *"Dory<br/>Rich"* (Playfair 80px gold, line-height 1) → "VISIT DORYRICH.COM.VN →" link (gold tracked uppercase 11px, 1px gold underline, gold arrow). External link, `rel="noopener noreferrer"`.

When the client provides a Dory Rich logo asset, it replaces the typographic lockup at the same position with no other layout change.

Motion: gold card border draws in `scaleX(0)→1` from the left, 800ms ease-out-expo, once on first enter.

### 5.8 — Soft CTA closer

Green bg full-bleed. Section padding `clamp(72px, 8vw, 100px)`. Centered single-column, max-w 720px.

- Italic display: *"Loved brands deserve a deliberate distributor."* (Playfair italic 48px white)
- One blank line below: *"Talk to our partnerships team."* (15px white-70%, not italic)
- 32px below: link "GET IN TOUCH →" (Geist 600 11px tracked uppercase, gold, 1px gold underline, gold arrow). Routes to `/contact`.

Motion: standard fade-up. Underline always present (not on-hover-only); gold-shifts on hover.

### 5.9 — Site Footer

Ink bg. 4-column grid `1.5fr 1fr 1fr 1fr`, container 1300px. Padding 90px top / 30px bottom.

| Column | Content |
|---|---|
| Brand | "R" mark + RICHFIELD GROUP wordmark + tagline *"From Market Entry to Nationwide Distribution. Vietnam · Malaysia · China."* |
| Explore (h4 gold) | About · Brands · Careers · Contact |
| Contact (h4 gold) | Richfield Worldwide JSC · 15A1 Nguyễn Hữu Thọ, Phước Kiển, Nhà Bè, HCM · Office: (+028) 3784 0237 · Hotline: 0917 331 132 · Email: cskh@richfieldvn.com.vn |
| Group (h4 gold) | Vietnam · Malaysia · China · Dory Rich JSC ↗ |

Bottom row (60px top margin, 1px hairline above), `flex justify-between`:

- Left: © 2026 Richfield Worldwide JSC.
- Centre: social icons — Facebook · LinkedIn · Zalo (24px, muted, gold on hover, `target="_blank" rel="noopener"`).
- Right: richfieldgroup.com.vn

---

## 6. Inner Pages (production)

Each page wraps in the shared `<SiteHeader>` (sticky variant) and `<SiteFooter>`, reuses primitives from §4 and sections from §5.

### 6.1 — `/about`

1. **Page header** (cream, 240px tall) — eyebrow "ABOUT" + h1 *"Three countries. Three <em>generations</em>. One promise."* + 2-sentence lede from `content.md`. No hero image.
2. **Who we are** — two-column `1fr 1fr`. Left: 3 paragraphs verbatim from `content.md` (em dashes removed). Right: hairline-divided values list — *people-first · long-term partnerships · sustainable growth · community impact*.
3. **History (timeline expanded)** — same `<Timeline>` component as homepage in **detail mode**: each milestone gets a 60-word body and (where assets exist) a small photo. Includes the 1992 "first ventured into Cambodia & Vietnam" pre-history fact from the milestone slide. 8 entries.
4. **Footprint map** — same `<FootprintMap>` at full container width.
5. **Charitable initiatives** — short editorial section pulling the social-impact line from `content.md` plus a 1-sentence stub. Cream bg, no images. Auto-hides if the content boolean is `false` (server-side check).
6. Soft CTA + footer.

### 6.2 — `/brands`

1. **Page header** — eyebrow "OUR BRANDS" + h1 *"The complete <em>portfolio</em>."*
2. **Featured-partner row** (cream) — 3 horizontal cards: Mars · USA (1994), TCP · Thailand (2014), Glico · Japan (2026). Each: large brand lockup, 1-line story, "Since 19XX" caption.
3. **Brand grid (full)** — 4-column magazine grid with category sub-headers (placeholder grouping until client confirms: *Confectionery / Beverages / Personal & Lifestyle / Stationery & Crafts*). Each cell: logo or Playfair name + country + year.
4. **Joint venture callout** — slim Dory Rich block (single-row variant of §5.7).
5. Soft CTA + footer.

### 6.3 — `/careers`

1. **Page header** (green) — eyebrow "CAREERS" + h1 *"A legacy of growth.<br/>A future of <em>opportunity</em>."*
2. **Why Richfield** — 4-pillar layout (people-centred · comprehensive benefits · professional & global · legacy of growth). Hairline-separated rows. Copy verbatim from `content.md` with em dashes removed.
3. **Heritage block** — 1-column editorial paragraph: *"Rooted in over 30 years of trust, Richfield Group began as a family business in Malaysia and has grown across three generations…"* (lift from `content.md`).
4. **Life at Richfield** — placeholder treatment for launch: a single editorial line + a "FOLLOW ON FACEBOOK →" link to `facebook.com/RichFieldGroup`. The section's content slot accepts either the placeholder link OR a feed array; future feed drops in without redesign.
5. **Open positions** — table (Job Title · Positions · Location · Application Deadline). Empty array → empty-state row: *"We're not actively recruiting right now. Reach out anyway; we'd like to hear from people who fit our story."* + "GET IN TOUCH →" link. Records exist → table renders.
6. Soft CTA + footer.

### 6.4 — `/contact`

1. **Page header** — eyebrow "CONTACT" + h1 *"Tell us about your <em>brand</em>."* + 2-sentence lede.
2. **Two-column** `1fr 1fr`:
   - **Left: contact channels** — 4 hairline-separated blocks: Office (address + phone + Maps link), Hotline (tel:), Email (mailto:), Social (icons + labels).
   - **Right: form** — fields: Name (required) · Company (required) · Country (optional, defaults to Vietnam) · Email (required, type=email) · Inquiry type (select: *Brand partnership / Distribution opportunity / Careers / Press / Other*) · Message (textarea, 600 char). Submit button: gold underline link styled as button.
3. **Map embed** — full-bleed, 480px tall, static map image (no Google Maps JS at launch). Centred on the HCMC office address with a single gold pin overlay. Caption + "OPEN ON GOOGLE MAPS ↗" link.
4. Footer.

**Form mechanics:** `<form action={contactAction}>` Server Action. Native HTML5 + Zod schema parsed inside the action. Honeypot field + 3-second submission delay enforced server-side. Provider: TBD (see Open Items). Success path: form swaps to confirmation message *"Thanks. We'll write back from our partnerships team within two business days."* Failure path: field-level errors inline. Storage at launch: send-only via transactional email; no DB.

---

## 7. Scaffold Pages

### 7.1 — `/what-we-do` (parent landing)

1. Page header — eyebrow "WHAT WE DO" + h1 *"Four ways we move <em>brands</em> to market."*
2. Pillars detailed — same 4 as §5.3 expanded to 50-word bodies + "Read more →" links.
3. Joint venture callout — slim Dory Rich card.
4. Portfolio bridge — *"Curious which brands these capabilities support? See the portfolio →"* (links `/brands`).
5. Soft CTA + footer.

### 7.2 — `/distribution`

Content-rich because the assets support it (`GT.png`, `MT.png`, `events-and-activities.png`, `special-display-and-merchandising.png`).

1. Page header — eyebrow "DISTRIBUTION" + h1 *"From the warehouse floor to <em>every shelf</em>."*
2. Capability strip — 3-cell KPI: 800+ Salesmen · 300+ Sub-distributors · 180K Retail Outlets.
3. **General Trade** (`id="gt"`) — h2 *"General Trade."* + 2-column: text left, `GT.png` right with caption "Outlet types we serve" + caption row *"Grocery · Wholesaler · HORECA · Wet market · Independent pharmacy / CMH"*.
4. **Modern Trade** (`id="mt"`) — h2 *"Modern Trade."* + lede + full-width `MT.png` with caption "Chains we distribute to (selected)" + format-summary row *"Super & Hyper · Convenience · Mini & Foodstore · Health & Beauty · Mom & Baby · Specialty"*.
5. **Trade marketing** subsection — 2-column row with `events-and-activities.png` + `special-display-and-merchandising.png`, each with a 1-line editorial caption.
6. **Import & Export** (`id="import-export"`) — h2 *"Import & Export."* + 2-sentence body + "Detailed capability brief on request → Get in touch" link.
7. Soft CTA + footer.

### 7.3 — `/logistics`

1. Page header — eyebrow "WAREHOUSE & LOGISTICS" + h1 *"End-to-end handling, north and <em>south</em>."*
2. Capability strip — 3-cell: 2 distribution centres · Ambient + cold (18°C–25°C) · Co-packing capable.
3. **Distribution centres** — 2-column: South DC (Long An) + North DC (Hanoi), each with body + thumbnail crop.
4. **Co-packing facility** — 2-column row with `co-packing-facility.png` left, body right.
5. **Dory Rich JV bridge** — slim card; outbound link to `doryrich.com.vn`.
6. **Import & Export** — same content as `/distribution#import-export`. Single source of truth in `content/en/capabilities.ts`, rendered via the same `<CapabilityBlock>` so we don't drift.
7. Soft CTA + footer.

### 7.4 — `/products`

Intentionally light. Honors `content.md` note that products copy and SKU counts aren't ready.

1. Page header — eyebrow "PRODUCTS" + h1 *"Brands you <em>already</em> love."*
2. Featured products — 5-card horizontal strip: M&M's, Pocky, Red Bull, Warrior, BiC. Cells with no asset use a soft brand-color gradient panel + Playfair italic name.
3. Editorial line — *"We distribute hundreds of SKUs across confectionery, beverages, personal care, and stationery. The full product catalogue is in development."*
4. Bridge — "EXPLORE THE BRAND PORTFOLIO →" link.
5. Soft CTA + footer.

When client provides SKU count + photos, the page upgrades from 5 cards to a paginated grid with no redesign — only `content/en/products.ts` grows.

---

## 8. Code Architecture & Content Modeling

### File tree

```
app/
  layout.tsx                         existing — extend with Playfair font registration
  globals.css                         tokens (OKLCH), motion vars, prose rules
  (site)/
    layout.tsx                       <SiteHeader/> + <SiteFooter/> wrap
    page.tsx                         /
    about/page.tsx
    what-we-do/page.tsx
    distribution/page.tsx
    logistics/page.tsx
    products/page.tsx
    brands/page.tsx
    careers/page.tsx
    contact/
      page.tsx                       form
      actions.ts                     "use server" — Server Action + Zod
  _components/
    site-header.tsx                  client (mobile drawer + scroll state)
    site-footer.tsx                  RSC
    primitives/                      RSC unless noted
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
    sections/
      hero.tsx
      what-we-do.tsx
      footprint-map.tsx              client — IntersectionObserver pulse toggle
      timeline.tsx                   client — IntersectionObserver reveal
      brand-wall.tsx
      jv-feature.tsx
      soft-cta-closer.tsx
    forms/
      contact-form.tsx               client
  _hooks/
    use-reveal-on-scroll.ts
    use-scroll-state.ts
content/
  en/
    site.ts                          tagline, address, phones, emails, socials
    milestones.ts                    7 entries (8 in /about expanded)
    brands.ts                        brand records (name, country, year, logoSrc?, category?)
    capabilities.ts                  4 pillars + import/export
    careers.ts                       why-richfield pillars + open positions array
    products.ts                      featured products
public/
  brands/                            logo files (when client provides)
  photos/                            real photography (warehouse, distribution)
  og.png                             single shared OG image at launch
```

### Content modeling

All copy lives in typed TS modules under `content/en/`. Pages import directly. No fetch, no DB, no CMS. When VI is added, mirror the structure under `content/vi/` and add a `[locale]` segment that wraps `(site)`.

### Server vs client components

Default: **RSC** for everything. `"use client"` only on:

- `<SiteHeader>` — mobile drawer state, scroll threshold
- `<FootprintMap>` — pin pulse intersection observer
- `<Timeline>` — cascade reveal
- `<ContactForm>` — controlled fields + error state
- `<RevealOnScroll>` wrapper

Total client JS budget at launch: <35 kB gzipped across the site.

### Forms

Server Action in `app/(site)/contact/actions.ts`. Zod schema validates `{ name, company, country?, email, inquiryType, message }`. Honeypot field validated server-side. On success, the action sends a transactional email (provider TBD; see Open Items) and returns `{ ok: true }`. On failure, returns `{ errors: { field: string } }`.

### Tailwind v4 configuration (`globals.css`)

Replaces the existing `@theme inline` block (which was set up for the default light/dark theme). The current dark-mode media query is removed; we are light-only.

```css
@import "tailwindcss";

@theme {
  --color-gold:    oklch(0.65  0.115 80);
  --color-ink:     oklch(0.16  0.012 165);
  --color-green:   oklch(0.30  0.038 158);
  --color-cream:   oklch(0.94  0.022 85);
  --color-paper:   oklch(0.985 0.005 85);
  --color-muted:   oklch(0.52  0.008 90);
  --color-line:    oklch(0.84  0.025 90);
  --font-display:  var(--font-playfair);
  --font-sans:     var(--font-geist-sans);
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
}

body {
  background: var(--color-cream);
  color: var(--color-ink);
  font-family: var(--font-sans);
}
```

### Pre-implementation reminder

Per `AGENTS.md`: Next.js 16.2.4 is a new version with breaking changes. The implementation plan must consult `node_modules/next/dist/docs/` before writing code. Server Actions, `"use client"` boundaries, fonts, and metadata APIs may differ from training-data Next.js patterns.

---

## 9. Edge Cases, A11y, Performance, SEO, Domain

### Edge cases

| Case | Handling |
|---|---|
| Brand without a logo asset | Typographic fallback (Playfair italic name + tracked country). |
| Empty job listings | Empty-state row + "Get in touch" link. |
| Charitable initiatives content not yet written | Server-side render-skip if content boolean is `false`. |
| `/products` content stays thin | Strip + editorial line; bridges to `/brands`. Upgrade path is `products.ts` array growing. |
| Map JS fails / disabled | Pure SVG + adjacent caption list. Map is informational without JS. |
| Form provider down | Server action returns `{ errors: { _form: "We couldn't send your message. Try email at cskh@…" } }`; rendered above the form with a `mailto:` fallback. |
| Slow VN 4G | LCP target ≤2.5s; hero is text + inline SVG (no LCP image dependency). |
| `prefers-reduced-motion` | Single CSS rule disables all reveals + pulses. |
| Old `richfieldvn.com.vn` deep links | Hosting-level 301 redirects, mapped from old sitemap (Open Item). |

### SEO + metadata

- Per-page `generateMetadata`: title, description, OG image (`public/og.png` — gold "R" + tagline on green).
- Canonical URLs to `https://richfieldgroup.com.vn/<path>`.
- `robots.ts` allows all + sitemap reference.
- `sitemap.ts` enumerates all 9 routes.
- Structured data on `/`: `Organization` JSON-LD with `name`, `url`, `logo`, `address`, `telephone`, `sameAs` (FB / LinkedIn / Zalo).
- Structured data on `/contact`: `LocalBusiness` JSON-LD with `geo`.

### Domain & launch

Target launch: `richfieldgroup.com.vn`, **2026-05-31**. Old domain `richfieldvn.com.vn` expires same day. Default redirect strategy: catch-all 301 from old domain root → new domain root, plus mapped routes for known old paths once we have them.

---

## 10. Testing & Verification

### 10.1 — Build & static checks (every commit, CI)

- `bun run lint` (config exists)
- `bun run build` (Next.js build + type-check)
- Image audit script — walks `content/en/brands.ts` and verifies every `logoSrc` resolves; missing logos log a warning (not a fail).

### 10.2 — Component & page tests

- **Vitest** for primitives — especially `<BrandCell>` logo-vs-text fallback branching.
- **Playwright** for page-level smoke across all 9 routes:
  - 200 status
  - h1 present
  - SiteHeader + SiteFooter render
  - `/contact` form renders all fields
  - `/contact` form submits successfully against a mocked Server Action
  - Mobile viewport: hamburger opens drawer, drawer focus-traps, ESC closes.

### 10.3 — Manual UAT before launch (run twice)

1. Type-render fidelity — every page on Chrome, Safari, Firefox at 1440 / 1024 / 768 / 390.
2. Animation budget — scroll every page top-to-bottom on a throttled 4G profile.
3. `prefers-reduced-motion` — verify all reveals/pulses become static.
4. Keyboard navigation — tab through every page; verify focus order, skip-link, drawer focus-trap.
5. Screen reader pass — VoiceOver on macOS Safari. Sample at minimum: home hero, footprint-map, brand wall, contact form.
6. Lighthouse — target Performance ≥90, Accessibility ≥95, Best Practices ≥95, SEO ≥95 on `/`, `/about`, `/brands`, `/contact`.
7. Form end-to-end — submit a real lead from a non-team email; verify it lands in the chosen inbox.
8. Domain swap rehearsal — point a staging subdomain, hit every route, verify redirects, then promote.

### Acceptance criteria for May 31 launch

- All 9 routes return 200 and render the designed layout.
- Lighthouse thresholds met on the 4 most-trafficked pages.
- Contact form delivers test leads to the confirmed inbox.
- Old-domain catch-all redirect verified live.
- No console errors on any page in production build.
- Open items resolved or documented as deferred in `MAINTENANCE.md`.

---

## 11. Open Items (8 — none are launch-blockers; all have scaffold fallbacks)

1. **AMOS / NewChoice category one-liners.** Confirm category descriptors so milestone bodies are precise. Current placeholder copy used.
2. **Brand-wall composition.** Homepage shows 9 brands. Wei Long isn't in `content.md` but appears in samples and the brand-logo asset; confirm. Other distributed brands visible in `assets/brands/image copy 2.png` (Kino, Yeo's, A1, Vinda, Zaud-yu, Care) get pushed to `/brands`.
3. **Dory Rich logo asset.** Client requested "add the Logo of dory rich" but no asset is in `client-doc/`. Typographic-lockup fallback designed.
4. **Email after domain migration.** Current `cskh@richfieldvn.com.vn` lives on the expiring domain. Confirm post-launch address (`cskh@richfieldgroup.com.vn`?) and whether the old address forwards.
5. **LinkedIn + Zalo URLs.** Facebook URL is in `content.md`; LinkedIn and Zalo URLs are not. Will scaffold with placeholder hrefs that 404 in dev until confirmed.
6. **Soft-CTA copy.** *"Loved brands deserve a deliberate distributor. Talk to our partnerships team."* is original wording. Client to approve / rewrite.
7. **Transactional email provider + recipient inbox.** Resend recommended; client confirms which inbox receives leads.
8. **Old-domain sitemap for redirect mapping.** Default catch-all is in place; mapped routes need the old sitemap.

---

## 12. Copy Library

A single source of truth for every UI string this design uses. Implementation imports from `content/en/`.

### Site (global)

| Key | Value |
|---|---|
| `tagline` | From Market Entry to Nationwide Distribution |
| `taglineLong` | From Market Entry to Nationwide Distribution. Vietnam · Malaysia · China. |
| `addressFull` | Richfield Worldwide JSC · 15A1 Nguyễn Hữu Thọ, Phước Kiển, Nhà Bè, HCM |
| `phoneOffice` | (+028) 3784 0237 |
| `phoneHotline` | 0917 331 132 |
| `email` | cskh@richfieldvn.com.vn *(pending migration)* |
| `socialFacebook` | https://www.facebook.com/RichFieldGroup |
| `socialLinkedIn` | *pending* |
| `socialZalo` | *pending* |
| `domainCanonical` | https://richfieldgroup.com.vn |
| `dorightichExternal` | https://doryrich.com.vn |

### Hero

- Eyebrow: ESTABLISHED 1994
- H1 line 1: From market entry
- H1 line 2: to *nationwide distribution*.
- Lede: Vietnam's largest FMCG distribution network. Bringing the world's most loved brands to over 180,000 retail outlets nationwide.
- KPI labels: YEARS · SUB-DISTRIBUTORS · RETAIL OUTLETS · SALESMEN
- KPI values: 30+ · 300+ · 180K · 800+
- Tag (left panel bottom): VIETNAM · MALAYSIA · CHINA

### What We Do (homepage strip + parent page)

- Eyebrow: WHAT WE DO
- Heading: Four ways we move *brands* to market.
- Pillars: see §5.3 table.

### Footprint Map

- Eyebrow: OUR FOOTPRINT
- Heading: An *international* group with deep local roots.
- Lede (3 sentences): The Richfield Group spans three countries and three generations of family leadership. International scale meets hands-on knowledge of every market we serve. Vietnam, Malaysia, and China together form one operating Group, not a holding shell.

### Timeline

- Eyebrow: OUR JOURNEY
- Heading: A story of *partnerships* over thirty years.
- Milestones (homepage, 7 entries): see §5.5 table.
- About-page extends with one prefix entry: **1992 — Group · Cambodia & Vietnam** — *"Richfield first ventures across the border, importing Wrigley's into Cambodia and Vietnam ahead of the trade embargo lifting."* (Source: `client-doc/web-redesign/assets/history-and-milestones.png`.)

### Brand Wall

- Eyebrow: OUR BRANDS
- Heading: Trusted by the world's most *loved* brands.
- Feature caption: Founding partner · Since 1994

### Dory Rich JV

- Eyebrow: JOINT VENTURE
- Heading: Dory Rich JSC.
- Badge: ESTABLISHED 2024 · TCP GROUP × RICHFIELD
- H3: A successful collaboration between two leading corporations.
- Body: Dory Rich JSC pairs TCP Group's leadership in Thai energy-drink production with Richfield Group's nationwide FMCG distribution capability in Vietnam. Manufacturing, brand-building, and distribution under one roof.
- Outbound link: VISIT DORYRICH.COM.VN →

### Soft CTA closer

- Italic line: Loved brands deserve a deliberate distributor.
- Subline: Talk to our partnerships team.
- Link: GET IN TOUCH →

### About page additions

- H1: Three countries. Three *generations*. One promise.
- Heritage paragraph (verbatim from `content.md`, em dashes removed): *Richfield JSC Group is proud to be one of the largest FMCG distributors in Vietnam. At present, our distribution network is the largest distribution system in the country, covering all provinces and cities nationwide with more than 300 sub-distributors and nearly 180,000 retail outlets nationwide.*
- Values list: people-first · long-term partnerships · sustainable growth · community impact

### Brands page

- H1: The complete *portfolio*.
- Lede: Across confectionery, beverages, personal care, and stationery, Richfield distributes the brands shoppers in Vietnam already know. Each partnership is a long-term relationship; many have run for decades.

### Careers page

- H1: A legacy of growth. A future of *opportunity*.
- Heritage block (verbatim from `content.md`, em dashes removed): *Rooted in over 30 years of trust, Richfield Group began as a family business in Malaysia and has grown across three generations. Today, we continue to build not just a company, but a community where people are valued as partners, not just employees. We see our people as long-term partners in a shared journey, built on trust, ambition, and sustainable growth.*
- Pillar headings (verbatim from `content.md`): People-Centered Philosophy · Comprehensive Benefits · Professional & Global Environment · A Legacy of Growth, A Future of Opportunity
- Empty-state row: We're not actively recruiting right now. Reach out anyway; we'd like to hear from people who fit our story.

### Contact page

- H1: Tell us about your *brand*.
- Lede: Whether you're an international brand owner exploring Vietnam, a partner considering a joint venture, or a journalist on deadline, we'll get back to you.
- Form fields: Name · Company · Country · Email · Inquiry type · Message
- Inquiry options: Brand partnership · Distribution opportunity · Careers · Press · Other
- Success message: Thanks. We'll write back from our partnerships team within two business days.
- Generic error: We couldn't send your message. Try email at cskh@richfieldvn.com.vn.

### Distribution page

- H1: From the warehouse floor to *every shelf*.
- GT lede: Nationwide coverage with 800+ salesmen across every province and city, supported by 300+ sub-distributors and a network of 180,000 retail outlets.
- GT formats row: Grocery · Wholesaler · HORECA · Wet market · Independent pharmacy / CMH
- MT lede: Retailer partnerships across every chain in Vietnam, with trade-marketing display and event support.
- MT formats row: Super & Hyper · Convenience · Mini & Foodstore · Health & Beauty · Mom & Baby · Specialty
- Import/Export body: Customs declaration and full import support for international partners. From documentation to bonded-warehouse handling, we manage the path from port to distribution centre.

### Logistics page

- H1: End-to-end handling, north and *south*.
- Capability strip: 2 distribution centres · Ambient + cold (18°C–25°C) · Co-packing capable
- Co-packing body: Primary and secondary packing lines with hand-washing and pest-control infrastructure. Co-packing serves both Richfield-distributed brands and joint-venture production through Dory Rich.
- Dory Rich bridge: Through our joint venture with TCP Group, our logistics capability extends into manufacturing.

### Products page

- H1: Brands you *already* love.
- Editorial line: We distribute hundreds of SKUs across confectionery, beverages, personal care, and stationery. The full product catalogue is in development.
- Bridge link: EXPLORE THE BRAND PORTFOLIO →

---

## 13. Implementation handoff

Next step: invoke the **superpowers:writing-plans** skill to produce an implementation plan against this spec. The plan will:

- Read the relevant Next.js 16.2.4 docs from `node_modules/next/dist/docs/` per the `AGENTS.md` directive before generating code.
- Sequence work into atomic commits (tokens → primitives → sections → routes → forms → tests → polish).
- Identify critical-path items (font registration, OKLCH tokens, Server Action) before dependent work begins.
- Track the 8 Open Items as explicit dependencies; provide scaffold-fallback paths for each so build progress isn't blocked.

The spec itself is the source of truth. Any deviation during implementation gets reflected back into this document, not made silently.
