import { revalidatePath, revalidateTag } from "next/cache";
import { LOCALES } from "./locale";
import { localizedPath } from "./localized-route";
import { getRichfieldAppBaseUrl } from "./richfield-config";
import { fetchWithRichfieldTimeout } from "./richfield-fetch";

/**
 * Tag carried by the one delivery fetch every public page reads.
 *
 * Tagging the data is what makes publishing locale-proof. The public routes all
 * live under `/[locale]`, so path-based invalidation has to name the dynamic
 * segment exactly right (and next-intl's "as-needed" prefix means the cached
 * pathnames are /en/... and /vi/..., not the bare URLs the browser shows). A
 * tag on the fetch sidesteps the whole question: whatever page read the payload
 * is invalidated with it.
 */
export const RICHFIELD_CONTENT_TAG = "richfield-content";

const WARM_TIMEOUT_MS = 15_000;

/**
 * Invalidate everything the public site renders from Richfield content.
 *
 * `{ expire: 0 }` rather than the "max" profile: an editor who just hit
 * Publish should not have the next visitor served the previous version while a
 * refresh happens in the background — the Next docs point route handlers that
 * need immediate expiry at exactly this form.
 */
export function revalidateRichfieldContent() {
  revalidateTag(RICHFIELD_CONTENT_TAG, { expire: 0 });
  // The root layout of this app is app/[locale]/layout.tsx — there is no
  // app/layout.tsx — so the dynamic segment belongs in the pattern.
  revalidatePath("/[locale]", "layout");
  revalidatePath("/sitemap.xml");
}

/** Absolute URLs, both locales, for a set of bare public paths. */
export function richfieldWarmUrls(paths: readonly string[]) {
  const baseUrl = getRichfieldAppBaseUrl();

  return paths.flatMap((path) =>
    LOCALES.map((locale) =>
      new URL(localizedPath(locale, path), `${baseUrl}/`).toString(),
    ),
  );
}

/**
 * Re-render the affected public pages immediately after invalidating them.
 *
 * Invalidation from a route handler only *marks* a path — Next regenerates it
 * on the next visit, which otherwise means the first real reader pays for the
 * rebuild (and, before that request lands, the CDN keeps serving the old page).
 * Requesting the pages ourselves makes that first visit happen right away, so
 * "published" and "live" line up.
 *
 * Best effort by design: warming failures must never surface as a failed save,
 * so every request is swallowed.
 */
export async function warmRichfieldContentPaths(paths: readonly string[]) {
  await Promise.all(
    richfieldWarmUrls(paths).map(async (url) => {
      try {
        await fetchWithRichfieldTimeout(
          url,
          { cache: "no-store", headers: { "x-richfield-warm": "1" } },
          WARM_TIMEOUT_MS,
        );
      } catch {
        // A cold page that nobody has requested yet is the status quo, not a
        // save failure.
      }
    }),
  );
}

/**
 * Invalidate, then warm. Scheduled through `after()` by the mutation routes so
 * it runs in a request scope Next still owns, without delaying the response.
 */
export async function revalidateAndWarmRichfieldContent(
  paths: readonly string[],
) {
  revalidateRichfieldContent();
  await warmRichfieldContentPaths(paths);
}
