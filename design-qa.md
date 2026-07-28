# Richfield Admin Design QA

## Comparison target

- Source visual truth:
  - `/Users/skora/.codex/generated_images/019fa2ad-b2cd-7760-8d35-77a7dfa269db/call_75oYym7JGY4w3uTdr2FTV23J.png`
  - `/Users/skora/.codex/generated_images/019fa2ad-b2cd-7760-8d35-77a7dfa269db/call_RZHkjYGtzL8DcUyDXDJYZpOY.png` (right-inspector reference)
- Initial implementation evidence:
  - `/private/tmp/richfield-prod-editor-before.png`
- Target route/state: authenticated Leadership editor, English content locale, dark theme, saved state.
- CSS viewport: `1440 × 1024`.
- Source pixels: `1488 × 1058`; implementation pixels: `1440 × 1024`.
- Density normalization: both artifacts are 1× desktop captures; source is proportionally normalized to the implementation width in the combined comparison.

## Findings

- [P1] The editor is broken into a step wizard instead of a coherent document.
  - Location: authenticated item editor.
  - Evidence: the source presents overview, writing, and media in one scrolling document with a persistent inspector; the initial implementation exposes only one step and requires repeated Next/Back navigation.
  - Impact: editors cannot understand the whole item at a glance and repeatedly lose context.
  - Fix: render all applicable sections in one document, add anchor navigation, and keep publishing, locale, cover, and slug controls in a sticky right inspector.
- [P1] Global preferences consume the entire header.
  - Location: admin top navigation.
  - Evidence: the source groups identity, language, theme, view-site, account, and sign-out in one compact avatar menu; the initial implementation renders each as a separate persistent control.
  - Impact: the chrome competes with primary editing actions and is especially cramped at tablet widths.
  - Fix: use one accessible user dropdown with radio groups for language and theme plus account, view-site, and sign-out actions.
- [P2] Light-mode navigation remains visually disconnected from the editorial workspace.
  - Location: desktop sidebar.
  - Evidence: the supplied implementation screenshot uses a dark navy sidebar beside a cream workspace; the selected direction uses a theme-aware tonal surface with consistent contrast and state tokens.
  - Impact: light mode feels like two products stitched together.
  - Fix: introduce dedicated light/dark sidebar tokens and apply them to background, rules, active, hover, text, and icon states.
- [P1] Uploaded CMS images can save successfully but fail on public pages.
  - Location: public News and other CMS-backed image surfaces.
  - Evidence: public pages render through `next/image`, while the configured Tuturuuu API/storage hosts are absent from the image allowlist; Jobs also discard their mapped entry asset.
  - Impact: customers see missing media after a successful upload.
  - Fix: allowlist the configured Tuturuuu API/storage paths, carry Job assets through the public mapper, expose image editing for all asset-backed collections, and revalidate every affected public route.

## Required fidelity surfaces

- Fonts and typography: editorial display type and compact sans UI hierarchy are retained; final optical comparison pending deployment.
- Spacing and layout rhythm: source document/inspector proportions are implemented; final comparison pending deployment.
- Colors and visual tokens: light/dark semantic sidebar and overlay tokens are implemented; final contrast comparison pending deployment.
- Image quality and asset fidelity: real uploaded assets are preserved and rendered; no placeholder drawings or synthetic image substitutes are used.
- Copy and content: app copy remains localized and task-oriented; final truncation/wrapping comparison pending deployment.

## Comparison history

### Pass 1 — blocked

- Earlier findings: step wizard, oversized global chrome, non-theme-aware light sidebar, and broken remote image delivery.
- Fixes made: one-document editor, sticky right inspector, compact user dropdown, theme-scoped sidebar/overlay tokens, global CMS image allowlist, complete public asset mapping, and expanded route invalidation.
- Post-fix visual evidence: pending authenticated deployment capture at the matching viewport/state.

## Primary interactions to verify

- Open and keyboard-navigate the user dropdown.
- Switch theme and confirm the sidebar, dropdown, skeletons, and editor invert together.
- Switch admin language and confirm the preference survives navigation.
- Navigate editor section anchors without losing the page shell.
- Confirm Preview and Save affordances expose correct disabled/saved states without mutating content.
- Confirm uploaded CMS images resolve through the public image optimizer.
- Check desktop, tablet, and mobile layouts for clipping or hidden actions.
- Check browser console for rendering, hydration, and image optimizer errors.

## Implementation checklist

- Capture the deployed editor and list in light and dark themes.
- Compare a combined source/implementation board at `1440 × 1024`.
- Run focused comparisons for header/user menu, editor toolbar, inspector, and uploaded media.
- Fix any remaining P0/P1/P2 mismatch.
- Record console and responsive checks.

final result: blocked
