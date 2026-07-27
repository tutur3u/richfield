import { notFound, redirect } from "next/navigation";
import { AdminEditorScreen } from "@/components/admin/AdminEditorScreen";
import {
  getRichfieldAdminCollectionStudio,
  getRichfieldAdminSession,
} from "@/lib/richfield-admin-api";
import {
  readRichfieldAdminContent,
  RICHFIELD_ADMIN_COLLECTIONS,
} from "@/lib/richfield-admin-content-model";
import { findAdminSection } from "@/lib/admin/sections";

export default async function AdminEntryPage({
  params,
  searchParams,
}: {
  params: Promise<{ entryId: string; section: string }>;
  searchParams: Promise<{ contentLocale?: string }>;
}) {
  const { entryId, section: sectionSlug } = await params;
  const contentLocale =
    (await searchParams).contentLocale === "vi" ? "vi" : "en";
  const section = findAdminSection(sectionSlug);

  if (!section?.collectionKey) notFound();

  const session = await getRichfieldAdminSession();
  if (!session) redirect(`/admin/${sectionSlug}`);

  let item = null;

  if (entryId !== "new") {
    const studio = await getRichfieldAdminCollectionStudio(
      session.accessToken,
      RICHFIELD_ADMIN_COLLECTIONS[section.collectionKey].collectionSlug,
    );
    item =
      readRichfieldAdminContent(
        studio,
        section.collectionKey,
        contentLocale,
      ).find(
        (candidate) => candidate.id === entryId,
      ) ?? null;

    if (!item) notFound();
  }

  return (
    <AdminEditorScreen
      collectionKey={section.collectionKey}
      initialItem={item}
      sectionHref={`/admin/${section.slug}`}
    />
  );
}
