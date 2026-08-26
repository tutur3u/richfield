import { SkeletonBlock, SkeletonLine } from "./RichfieldAdminSkeleton";

export function RichfieldLoginLoading() {
  return (
    <main className="relative grid min-h-screen overflow-hidden bg-admin-parchment px-4 py-8 text-admin-ink sm:px-6">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,color-mix(in_srgb,var(--color-admin-gold)_18%,transparent),transparent_42%)]" />
      <div className="relative mx-auto flex w-full max-w-md flex-col">
        <div className="flex items-center justify-between py-2">
          <SkeletonLine className="h-7" width="104px" />
          <SkeletonBlock className="h-9 w-28" />
        </div>
        <div className="grid flex-1 place-items-center py-8 sm:py-12">
          <section aria-busy="true" className="w-full rounded-2xl border border-admin-rule bg-admin-panel p-6 sm:p-8">
            <span className="sr-only">Loading sign in…</span>
            <SkeletonBlock className="size-11 rounded-xl" />
            <SkeletonLine className="mt-6" width="72px" />
            <SkeletonLine className="mt-3 h-8" width="68%" />
            <SkeletonLine className="mt-5" width="100%" />
            <SkeletonLine className="mt-2" width="82%" />
            <SkeletonBlock className="mt-7 h-12 w-full rounded-xl" />
            <div className="mt-5 flex justify-between border-t border-admin-rule pt-5">
              <SkeletonLine width="92px" />
              <SkeletonLine width="64px" />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export function RichfieldSectionLoading() {
  return (
    <div aria-busy="true" className="grid gap-7">
      <span className="sr-only">Loading workspace…</span>
      <header className="grid gap-3 border-b border-admin-rule pb-6">
        <SkeletonLine width="84px" />
        <SkeletonLine className="h-9" width="240px" />
        <SkeletonLine width="min(100%, 520px)" />
      </header>
      <div className="grid gap-5">
        <div className="flex items-center justify-between gap-4">
          <SkeletonLine width="72px" />
          <SkeletonBlock className="h-10 w-24" />
        </div>
        <SkeletonBlock className="h-12 w-full rounded-xl" />
        <div className="grid gap-2">
          {Array.from({ length: 4 }, (_, index) => (
            <SkeletonBlock className="h-[76px] w-full rounded-xl" key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
