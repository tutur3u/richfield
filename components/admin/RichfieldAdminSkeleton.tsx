/**
 * Skeleton primitives for the admin surface.
 *
 * Every skeleton here mirrors the real dashboard's geometry — same card, same
 * grouped tab bar, same list rows — so the switch to loaded content settles in
 * place instead of jumping. Shape is the point: a spinner tells you to wait, a
 * skeleton tells you what is coming.
 */

export function SkeletonLine({
  className = "",
  width = "100%",
}: {
  className?: string;
  width?: string;
}) {
  return (
    <span
      className={`admin-skeleton block h-3 ${className}`}
      style={{ width }}
    />
  );
}

export function SkeletonBlock({ className = "" }: { className?: string }) {
  return <span className={`admin-skeleton block ${className}`} />;
}

/** One row of the content list: title, meta line, and a status chip. */
function SkeletonListRow() {
  return (
    <div className="grid gap-2 border border-admin-rule bg-white/45 p-4">
      <div className="flex items-center justify-between gap-4">
        <SkeletonLine className="h-4" width="42%" />
        <SkeletonBlock className="h-5 w-16" />
      </div>
      <SkeletonLine width="72%" />
    </div>
  );
}

/** The four labelled tab groups the dashboard nav is built from. */
function SkeletonTabGroups() {
  const groups = [5, 4, 2, 2];

  return (
    <div className="flex flex-col gap-4 border-b border-[rgba(184,112,81,0.34)] pb-4 sm:flex-row sm:flex-wrap sm:gap-x-8">
      {groups.map((count, groupIndex) => (
        <div
          className="min-w-0"
          key={`skeleton-group-${
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length placeholder
            groupIndex
          }`}
        >
          <SkeletonLine className="mb-2 h-2.5" width="64px" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: count }, (_, tabIndex) => (
              <SkeletonBlock
                className="h-10 w-[86px]"
                key={`skeleton-tab-${groupIndex}-${tabIndex}`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Full-page dashboard skeleton. Announced politely rather than silently: a
 * screen reader user should be told the page is loading, not left on an empty
 * region wondering.
 */
export function RichfieldAdminSkeleton() {
  return (
    <main className="section-band min-h-screen px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div
        aria-busy="true"
        aria-live="polite"
        className="mx-auto grid min-w-0 max-w-7xl gap-6"
      >
        <span className="sr-only">Loading your dashboard…</span>

        <header className="parchment-card grid gap-4 p-5 sm:p-6">
          <SkeletonLine className="h-2.5" width="120px" />
          <SkeletonBlock className="h-9 w-[min(420px,80%)] sm:h-12" />
          <SkeletonLine width="min(560px, 92%)" />
          <div className="flex flex-wrap gap-2 pt-1">
            <SkeletonBlock className="h-11 w-32" />
            <SkeletonBlock className="h-11 w-28" />
          </div>
        </header>

        <SkeletonTabGroups />

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="grid gap-3">
            {Array.from({ length: 5 }, (_, index) => (
              <SkeletonListRow key={`skeleton-row-${index}`} />
            ))}
          </div>
          <aside className="parchment-card hidden h-fit gap-3 p-5 lg:grid">
            <SkeletonLine className="h-2.5" width="88px" />
            <SkeletonLine className="h-4" width="70%" />
            <SkeletonLine width="100%" />
            <SkeletonLine width="86%" />
            <SkeletonBlock className="mt-2 h-11 w-full" />
          </aside>
        </section>
      </div>
    </main>
  );
}
