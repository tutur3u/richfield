import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { AdminSectionScreen } from "@/components/admin/AdminSectionScreen";
import {
  DEFAULT_ADMIN_SECTION_SLUG,
  findAdminSection,
} from "@/lib/admin/sections";
import { ADMIN_CONTENT_PAGE_SIZE } from "@/lib/admin/content-queries";
import { ADMIN_LOCALE_COOKIE, toAdminLocale } from "@/lib/admin/locales";
import { getRichfieldAdminSession } from "@/lib/richfield-admin-api";
import { refreshRichfieldAdminContent } from "@/lib/richfield-admin-content";

/**
 * One route per dashboard section.
 *
 * The section is the URL, so a bookmark, a refresh, and the Back button all do
 * what an editor expects — none of which worked while the active surface lived
 * in component state.
 *
 * The existing dashboard renders the body. It owns every editor, and lifting
 * those out first would have meant shipping a prettier dashboard that could no
 * longer save. So the shell supplies navigation, account actions and theming,
 * and the dashboard is told which surface to open with its own chrome
 * suppressed — one dashboard, not a second one beside the old.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}): Promise<Metadata> {
  const { section: slug } = await params;
  const section = findAdminSection(slug);
  const locale = toAdminLocale(
    (await cookies()).get(ADMIN_LOCALE_COOKIE)?.value,
  );
  const t = await getTranslations({ locale, namespace: "admin" });

  return {
    title: section
      ? `${t(`sections.${section.slug}.title` as Parameters<typeof t>[0])} · ${t("metadata.dashboard")}`
      : t("metadata.dashboard"),
  };
}

export default async function AdminSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section: slug } = await params;
  const section = findAdminSection(slug);

  // Redirect rather than notFound(): in this setup notFound() renders the
  // not-found page but still answers 200, so a mistyped URL read as a working
  // page to anything checking status codes. A redirect carries an honest status
  // and puts a signed-in editor somewhere useful instead of a dead end.
  if (!section) {
    redirect(`/admin/${DEFAULT_ADMIN_SECTION_SLUG}`);
  }

  let initialPage;
  const session = section.collectionKey
    ? await getRichfieldAdminSession()
    : null;

  if (session && section.collectionKey) {
    const locale = toAdminLocale(
      (await cookies()).get(ADMIN_LOCALE_COOKIE)?.value,
    );
    const items = await refreshRichfieldAdminContent(
      session.accessToken,
      section.collectionKey,
      locale,
    );
    const firstItems = items.slice(0, ADMIN_CONTENT_PAGE_SIZE);
    initialPage = {
      items: firstItems,
      nextPage:
        firstItems.length < items.length ? 2 : null,
      page: 1,
      total: items.length,
    };
  }

  return <AdminSectionScreen initialPage={initialPage} section={section} />;
}
