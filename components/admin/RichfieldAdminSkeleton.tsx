/**
 * Skeleton primitives for the admin surface.
 *
 * A skeleton only helps if it stands where the real content will: the point is
 * to hold the layout still, not to animate. Anything it draws that the page
 * does not actually render reads as a glitch rather than as loading.
 */

export function SkeletonLine({
  className = "",
  width = "100%",
}: {
  className?: string;
  width?: string;
}) {
  return (
    <span className={`admin-skeleton block h-3 rounded-full ${className}`} style={{ width }} />
  );
}

export function SkeletonBlock({ className = "" }: { className?: string }) {
  return <span className={`admin-skeleton block rounded-full ${className}`} />;
}

/** One row of the content list: title, meta line, and a status chip. */
function SkeletonListRow() {
  return (
    <div className="grid gap-2 rounded-xl border border-admin-rule bg-admin-surface p-4">
      <div className="flex items-center justify-between gap-4">
        <SkeletonLine className="h-4" width="42%" />
        <SkeletonBlock className="h-5 w-16" />
      </div>
      <SkeletonLine width="72%" />
    </div>
  );
}

/**
 * Section-body skeleton.
 *
 * Deliberately only the body. The shell already renders the header, sidebar and
 * theme switch, so the earlier version — which also drew a placeholder header
 * and four rows of fake tabs — stacked ghost chrome on top of the real chrome.
 * That is what made it look broken rather than loading.
 */
export function RichfieldAdminSkeleton() {
  return (
    <div aria-busy="true" className="grid min-w-0 gap-8">
      <span className="sr-only">Loading…</span>

      <div className="grid gap-3 border-b border-admin-rule pb-7">
        <SkeletonLine className="h-2" width="72px" />
        <SkeletonBlock className="h-11 w-[min(260px,60%)]" />
        <SkeletonLine width="min(380px, 75%)" />
      </div>

      <div className="grid gap-2">
        {Array.from({ length: 6 }, (_, index) => (
          <SkeletonListRow key={`skeleton-row-${index}`} />
        ))}
      </div>
    </div>
  );
}
