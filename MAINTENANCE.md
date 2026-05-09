# Richfield Site — Maintenance Log

Open items and deferred work. None block the May 31 launch; each has a scaffold fallback or a non-launch-blocking workaround in place.

## Open items from the launch design spec (§11)

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

## Items uncovered during implementation

| # | Item | Where it shows | Resolution path |
|---|---|---|---|
| 9 | Mobile timeline horizontal-scroll affordance is invisible | `/` and `/about` timeline at < 1024px | Spec called for "thin gold underline on the visible item". Add a short `<span>` cue ("← scroll →") or wire a CSS scroll-snap indicator after launch. |
| 10 | Footer social labels render as text instead of SVG icons | Site footer, every page | Once Open Item #5 ships, replace text labels with Heroicons / Simple Icons inline SVGs at 24px. |
| 11 | Route-announcer monkey-patch | `app/_components/route-announcer-patch.tsx` (mounted in `app/layout.tsx`) | Patch removes the `role="alert"` attribute Next.js adds to its shadow-DOM `<next-route-announcer>` so Playwright's `[role="alert"]` selector doesn't match two elements. Aria-live="assertive" still drives the screen-reader announcement. Revisit when Next ships an alternative; if the announcer's shadow-DOM shape changes the patch becomes a no-op rather than breaking anything. |
| 12 | ESLint 10 + eslint-plugin-react@7.37.5 incompat | `eslint.config.mjs` | Pinned `settings.react.version` short-circuits the plugin's broken `resolveBasedir` helper. Drop the workaround when the plugin ships a v10-compatible release. |
| 13 | `react/no-unescaped-entities` disabled | `eslint.config.mjs` | Editorial copy uses straight apostrophes intentionally. If the typographic style ever shifts to curly quotes (U+2019), re-enable the rule and the codemod can land at the same time. |
| 14 | Workspace-root warning at `bun run build` | Console only | Two `bun.lock` files coexist (`~/bun.lock` and `<repo>/bun.lock`). Set `turbopack.root` in `next.config.ts` or remove the home-directory lockfile to silence. Cosmetic only. |
| 15 | `vite-tsconfig-paths` deprecation notice | Vitest console at startup | Vite resolves tsconfig paths natively now; switch `vitest.config.mts` to `resolve.tsconfigPaths: true` and drop the plugin. Cosmetic only. |
| 16 | `RevealOnScroll` is a no-op wrapper today | `<WhatWeDo>`, `<Timeline>` cells | The on-scroll fade-up was disabled because arming after hydration created a flash of hidden content that broke crawlers, no-JS users, and screenshot tools (Phase 5.5 finding). The hook stays in place so a CSS-only `@starting-style` (or GSAP timeline) can drop in without touching consumers. |

## After-launch follow-ups

- Replace the typographic 3-node `<FootprintMap>` with a designer-cut SVG of Vietnam, Malaysia, and China when an asset is ready. The current diagram works; a cleaner illustrated map would deepen the editorial register.
- Add a Vietnamese locale at `content/vi/` and wrap `(site)` in `[locale]`. EN content modules are already shaped for this.
- Add a `/news` or `/press` route group (`(news)`) when there's content to support it.
- Rotate `RESEND_API_KEY` quarterly in line with the standard secrets policy.
- Capture Lighthouse + analytics baseline on the first weekday after launch and store the JSON under `docs/baseline/`.
