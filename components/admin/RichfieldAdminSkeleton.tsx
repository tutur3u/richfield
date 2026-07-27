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
 * Collection-only skeleton.
 *
 * The shell and section heading are already useful, stable UI. Only the remote
 * collection suspends, so only the controls and rows that depend on it get
 * placeholders. This keeps navigation interactive and prevents a route change
 * from masquerading as a full-page reload.
 */
export function AdminCollectionSkeleton() {
  return (
    <section aria-busy="true" className="grid min-w-0 gap-5">
      <span className="sr-only">Loading…</span>

      <div className="flex items-center justify-between gap-4">
        <SkeletonLine width="72px" />
        <SkeletonBlock className="h-10 w-24" />
      </div>

      <SkeletonBlock className="h-12 w-full rounded-xl" />

      <div className="grid gap-2">
        {Array.from({ length: 4 }, (_, index) => (
          <SkeletonListRow key={`skeleton-row-${index}`} />
        ))}
      </div>
    </section>
  );
}
