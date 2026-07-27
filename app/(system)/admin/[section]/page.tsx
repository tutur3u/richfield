import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminSectionScreen } from "@/components/admin/AdminSectionScreen";
import { AdminShell } from "@/components/admin/AdminShell";
import { RichfieldAdminLoginPanel } from "@/components/admin/RichfieldAdminLoginPanel";
import { RichfieldAdminSessionRestorer } from "@/components/admin/RichfieldAdminSessionRestorer";
import { findAdminSection } from "@/lib/admin/sections";
import { getRichfieldAdminSessionReadState } from "@/lib/richfield-admin-api";
import { getRichfieldCentralizedLoginHref } from "../login-link";

export const dynamic = "force-dynamic";

/**
 * One route per dashboard section.
 *
 * Sections are URLs rather than tab state, so an editor can bookmark a list,
 * land back on it after a refresh, and use Back the way they expect. Every
 * section renders the same screen, so this stays a single dynamic route instead
 * of a dozen near-identical files.
 *
 * No generateStaticParams: the page reads the session, so it renders per
 * request regardless, and declaring params it never prerenders left an unknown
 * section answering 200 with not-found content instead of a real 404.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}): Promise<Metadata> {
  const { section: slug } = await params;
  const section = findAdminSection(slug);

  return { title: section ? `${section.title} · Dashboard` : "Dashboard" };
}

export default async function AdminSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section: slug } = await params;
  const section = findAdminSection(slug);

  if (!section) {
    notFound();
  }

  const loginHref = await getRichfieldCentralizedLoginHref("dashboard");
  const sessionState = await getRichfieldAdminSessionReadState();

  if (sessionState.status === "unauthenticated") {
    return <RichfieldAdminLoginPanel loginHref={loginHref} />;
  }

  if (sessionState.status === "refreshable") {
    return <RichfieldAdminSessionRestorer loginHref={loginHref} />;
  }

  return (
    <AdminShell userEmail={sessionState.session.user.email}>
      <AdminSectionScreen section={section} />
    </AdminShell>
  );
}
