# Richfield Admin Design QA

## Comparison target

- Source visual truth:
  - `/Users/skora/.codex/generated_images/019fa2ad-b2cd-7760-8d35-77a7dfa269db/call_75oYym7JGY4w3uTdr2FTV23J.png`
  - `/Users/skora/.codex/generated_images/019fa2ad-b2cd-7760-8d35-77a7dfa269db/call_RZHkjYGtzL8DcUyDXDJYZpOY.png` (right-inspector reference)
- Initial implementation evidence:
  - `/private/tmp/richfield-prod-editor-before.png`
- Final implementation evidence:
  - `/private/tmp/richfield-editor-writing-sticky-final.png`
  - `/private/tmp/richfield-editor-light-final.png`
  - `/private/tmp/richfield-editor-dark-menu-final.png`
  - `/private/tmp/richfield-news-upload-final.png`
- Target route/state: authenticated Leadership editor, English content locale, dark theme, saved state.
- CSS viewport: `1440 × 1024`.
- Source pixels: `1487 × 1058`; intended CSS comparison viewport: `1440 × 1024`.
- Browser implementation pixels: `1280 × 720` at 1× density. The in-app browser uses a fixed desktop capture surface; the source was cropped to the equivalent 16:9 top viewport and both artifacts were normalized to `640 × 360` in the combined comparison.

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

### Pass 2 — blocked

- Visual evidence:
  - `/private/tmp/richfield-editor-dark-after.png`
  - `/private/tmp/richfield-editor-menu-dark-after.png`
  - `/private/tmp/richfield-editor-light-after.png`
- Post-fix result: the document editor, inspector, compact account menu, and theme-aware sidebar match the selected direction and behave correctly.
- New P1 finding: section descriptions and a small set of secondary labels resolve through the shadcn `--muted` surface token instead of the admin text token, producing near-background text in both themes.
- Fix made: replace ambiguous `text-muted` utilities across admin/system surfaces with the explicit `text-admin-ink-soft` token, including field help, disabled values, login/session copy, member captions, and item slugs.
- Post-fix visual evidence: pending deployment of the contrast correction.

### Pass 3 — blocked

- Visual evidence:
  - `/private/tmp/richfield-design-qa-full.png`
  - `/private/tmp/richfield-design-qa-menu.png`
  - `/private/tmp/richfield-editor-light-final.png`
  - `/private/tmp/richfield-editor-dark-menu-final.png`
  - `/private/tmp/richfield-editor-writing-final.png`
- Post-fix result: explicit secondary-text tokens now compute to `rgb(111, 101, 87)` in light mode and `rgb(196, 187, 173)` in dark mode. The menu, sidebar, document grid, inspector, image preview, and icon toolbar are visually coherent with the selected source.
- New P2 finding: the selected source keeps a Save action available while editing long-form copy, but the implementation scrolls its primary action out of view.
- Fix made: add a compact theme-aware bottom action bar with saved/unsaved state, Preview, and Save controls while preserving the document and inspector layout.
- Post-fix visual evidence: pending deployment of the persistent action bar.

### Pass 4 — passed

- Visual evidence:
  - `/private/tmp/richfield-design-qa-final.png`
  - `/private/tmp/richfield-editor-writing-sticky-final.png`
  - `/private/tmp/richfield-news-upload-final.png`
- Full-view comparison: the implementation retains the source’s persistent navy navigation, compact identity menu, editorial heading/body pairing, single-document form, icon toolbar, and distinct right inspector. The new bottom action bar preserves Preview and Save while long-form content is in view.
- Focused comparison: `/private/tmp/richfield-design-qa-menu.png` confirms equivalent language/theme/account grouping with real Lucide icons, clear selected states, and a destructive sign-out treatment.
- Fonts and typography: Fraunces remains the display face and Geist the UI/body face; field labels, helper text, toolbar controls, and title wrapping retain clear hierarchy in both themes.
- Spacing and layout rhythm: the desktop document/inspector split, section rules, compact header, and fixed action bar preserve hierarchy without clipping. Tablet (`768 × 1024`) and mobile (`390 × 844`) checks produced no horizontal overflow.
- Colors and visual tokens: light and dark sidebar, panel, border, overlay, focus, and secondary-text tokens invert together. Secondary text computes to `rgb(111, 101, 87)` in light mode and `rgb(196, 187, 173)` in dark mode.
- Image quality and asset fidelity: the real Tuturuuu asset for the published News item completes through the Next image optimizer at `561 × 292` natural pixels; leadership cover previews retain their actual source crop and alt text.
- Copy and content: English and Vietnamese admin catalogs both render across shell, editor sections, publishing inspector, image controls, and save state. The editor toolbar follows the active content locale.
- Icons and interactions: user dropdown, theme radio choices, language radio choices, section anchors, mobile navigation, Preview, disabled Save, and editor tooltip contracts were verified without mutating CMS content.
- Accessibility: semantic menu/menuitemradio roles, toolbar button labels, focus styling, translated labels, image alt text, reduced-motion-safe tooltips, and skip navigation are present.
- Console: no browser console errors were recorded on the final editor or the public News article.
- Residual P3: the implementation uses slightly rounder input/panel corners than the generated reference; this is consistent with the project’s shadcn/Base UI radius token and does not reduce clarity or task efficiency.

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

- [x] Capture the deployed editor and list in light and dark themes.
- [x] Compare normalized source/implementation boards.
- [x] Run focused comparisons for header/user menu, editor toolbar, inspector, and uploaded media.
- [x] Fix every P0/P1/P2 mismatch.
- [x] Record console and responsive checks.

final result: passed
