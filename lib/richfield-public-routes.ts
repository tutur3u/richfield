import type { RichfieldAdminCollectionKey } from "./richfield-admin-content-model";

/**
 * Where each collection actually surfaces on the public site.
 *
 * This is the *blast radius* of a save — every bare (locale-less) route whose
 * rendered output can change when an entry in that collection changes — and it
 * is deliberately separate from `previewRouteByCollection` in the editor, which
 * answers a narrower question ("which single page should the Preview button
 * open?"). Leadership, for instance, renders on /careers but previews from the
 * story page.
 *
 * ":slug" marks the entry's own detail page and is filled in per entry.
 */
export const RICHFIELD_PUBLIC_ROUTES: Record<
  RichfieldAdminCollectionKey,
  readonly string[]
> = {
  // The magazine home renders the brand wall; /brands renders the timeline.
  articles: ["/news", "/news/:slug"],
  brands: ["/", "/brands"],
  "contact-channels": ["/contact"],
  "contact-form": ["/contact"],
  "contact-page": ["/contact"],
  // Back-office only: form submissions never render publicly.
  "contact-submissions": [],
  // Shelf categories are derived from the library; careers uses it for photos.
  "image-library": ["/brands", "/careers"],
  jobs: ["/careers", "/careers/:slug"],
  leadership: ["/careers"],
  milestones: ["/about/our-story"],
};

/** Slugs come from admin input, so keep anything odd out of a fetched URL. */
function isSafeSlug(slug: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

/**
 * The bare public paths a mutation on `collectionKey` can change.
 *
 * Detail routes are dropped when there is no usable slug — on a delete, for
 * example, the entry's own page is gone and only the index needs refreshing.
 */
export function richfieldPublicPathsFor(
  collectionKey: RichfieldAdminCollectionKey,
  slug?: string | null,
): string[] {
  const trimmedSlug = slug?.trim() ?? "";
  const canUseSlug = Boolean(trimmedSlug) && isSafeSlug(trimmedSlug);

  return RICHFIELD_PUBLIC_ROUTES[collectionKey].flatMap((route) => {
    if (!route.includes(":slug")) return [route];
    return canUseSlug ? [route.replace(":slug", trimmedSlug)] : [];
  });
}
