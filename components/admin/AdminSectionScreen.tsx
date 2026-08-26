"use client";

import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, use } from "react";
import type { AdminSection } from "@/lib/admin/sections";
import type { RichfieldContentPage } from "@/lib/admin/content-queries";
import { AdminContentList } from "./AdminContentList";
import { AdminCollectionSkeleton } from "./RichfieldAdminSkeleton";
import type { RichfieldStorageAnalyticsState } from "@/lib/richfield-admin-storage";
import type { RichfieldStorageFilesState } from "@/lib/richfield-storage-files";

const AdminAccountPanel = dynamic(() =>
  import("./AdminAccountPanel").then((module) => module.AdminAccountPanel),
);
const MembersPanel = dynamic(() =>
  import("./AdminMembersPanel").then((module) => module.MembersPanel),
);
const StoragePanel = dynamic(() =>
  import("./AdminStoragePanel").then((module) => module.StoragePanel),
);

function AdminCollectionContent({
  emptyHint,
  initialPagePromise,
  section,
  title,
}: {
  emptyHint: string;
  initialPagePromise: Promise<RichfieldContentPage | undefined>;
  section: AdminSection & { collectionKey: NonNullable<AdminSection["collectionKey"]> };
  title: string;
}) {
  const initialPage = use(initialPagePromise);
  const pathname = usePathname();
  const router = useRouter();

  return (
    <AdminContentList
      collectionKey={section.collectionKey}
      emptyHint={emptyHint}
      initialPage={initialPage}
      onOpen={(id) =>
        router.push(`${pathname}/${id === null ? "new" : encodeURIComponent(id)}`)
      }
      title={title}
    />
  );
}

/**
 * The body of one dashboard section.
 *
 * Sections backed by a collection get the searchable, infinitely scrolling
 * list. The few that are not a list (files, people, account) say plainly where
 * that work happens rather than rendering an empty shell — a dead panel reads
 * as broken, a signpost does not.
 */
export function AdminSectionScreen({
  driveHref,
  initialPagePromise,
  section,
  storageAnalytics,
  storageFiles,
  userEmail,
}: {
  driveHref?: string;
  initialPagePromise?: Promise<RichfieldContentPage | undefined>;
  section: AdminSection;
  storageAnalytics?: RichfieldStorageAnalyticsState;
  storageFiles?: RichfieldStorageFilesState;
  userEmail?: string | null;
}) {
  const t = useTranslations("admin");
  const sectionTitleKey =
    `sections.${section.slug}.title` as Parameters<typeof t>[0];
  const sectionDescriptionKey =
    `sections.${section.slug}.description` as Parameters<typeof t>[0];
  const sectionEmptyKey =
    `sections.${section.slug}.empty` as Parameters<typeof t>[0];
  const title = t(sectionTitleKey);
  const description = t(sectionDescriptionKey);
  const emptyHint = t(sectionEmptyKey);

  return (
    <div className="grid min-w-0 gap-7">
      <header className="grid gap-2 border-b border-admin-rule pb-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-admin-clay">
          {t(`groups.${section.group}`)}
        </p>
        <h1 className="font-display text-[clamp(2.35rem,3.5vw,3.35rem)] leading-none tracking-[-0.025em] text-admin-ink">
          {title}
        </h1>
        <p className="max-w-[62ch] text-[15px] leading-6 text-admin-ink-soft">
          {description}
        </p>
      </header>

      {section.collectionKey && initialPagePromise ? (
        <Suspense fallback={<AdminCollectionSkeleton />}>
          <AdminCollectionContent
            emptyHint={emptyHint}
            initialPagePromise={initialPagePromise}
            section={{
              ...section,
              collectionKey: section.collectionKey,
            }}
            title={title}
          />
        </Suspense>
      ) : section.slug === "people" ? (
        <MembersPanel />
      ) : section.slug === "account" ? (
        <AdminAccountPanel userEmail={userEmail ?? null} />
      ) : section.slug === "files" &&
        driveHref &&
        storageAnalytics &&
        storageFiles ? (
        <StoragePanel
          driveHref={driveHref}
          onResourcesChanged={async () => undefined}
          storageAnalytics={storageAnalytics}
          storageFiles={storageFiles}
        />
      ) : (
        <section className="rounded-xl border border-admin-rule bg-admin-panel p-6 text-sm leading-6 text-admin-ink-soft">
          {emptyHint}
        </section>
      )}
    </div>
  );
}
