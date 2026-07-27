import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { RichfieldAdminDashboard } from "@/components/admin/RichfieldAdminDashboard";
import { RichfieldAdminLoginPanel } from "@/components/admin/RichfieldAdminLoginPanel";
import { RichfieldAdminSessionRestorer } from "@/components/admin/RichfieldAdminSessionRestorer";
import { RichfieldAdminSkeleton } from "@/components/admin/RichfieldAdminSkeleton";
import {
  type AdminSection,
  DEFAULT_ADMIN_SECTION_SLUG,
  findAdminSection,
} from "@/lib/admin/sections";
import {
  getRichfieldAdminSessionReadState,
  getRichfieldAdminStudio,
} from "@/lib/richfield-admin-api";
import {
  readRichfieldAdminContent,
  type RichfieldAdminStudioPayload,
} from "@/lib/richfield-admin-content-model";
import {
  buildRichfieldDriveUrl,
  buildRichfieldWorkspaceUrl,
} from "@/lib/richfield-config";
import { getRichfieldCentralizedLoginHref } from "../login-link";

export const dynamic = "force-dynamic";

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
type AuthenticatedSession = Extract<
  Awaited<ReturnType<typeof getRichfieldAdminSessionReadState>>,
  { status: "authenticated" }
>["session"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}): Promise<Metadata> {
  const { section: slug } = await params;
  const section = findAdminSection(slug);

  return { title: section ? `${section.title} · Dashboard` : "Dashboard" };
}

function emptyStudio(): RichfieldAdminStudioPayload {
  return { assets: [], blocks: [], collections: [], entries: [] };
}

async function SectionBody({
  section,
  session,
}: {
  section: AdminSection;
  session: AuthenticatedSession;
}) {
  const studio = await getRichfieldAdminStudio(session.accessToken).catch(
    (error) => {
      console.error("[richfield:admin] failed to load studio", error);
      return emptyStudio();
    },
  );

  return (
    <RichfieldAdminDashboard
      driveHref={buildRichfieldDriveUrl()}
      initialContent={{
        articles: readRichfieldAdminContent(studio, "articles"),
        brands: readRichfieldAdminContent(studio, "brands"),
        "contact-channels": readRichfieldAdminContent(
          studio,
          "contact-channels",
        ),
        "contact-form": readRichfieldAdminContent(studio, "contact-form"),
        "contact-page": readRichfieldAdminContent(studio, "contact-page"),
        "contact-submissions": readRichfieldAdminContent(
          studio,
          "contact-submissions",
        ),
        "image-library": readRichfieldAdminContent(studio, "image-library"),
        jobs: readRichfieldAdminContent(studio, "jobs"),
        leadership: readRichfieldAdminContent(studio, "leadership"),
        milestones: readRichfieldAdminContent(studio, "milestones"),
      }}
      initialTab={section.tab as never}
      membersHref={buildRichfieldWorkspaceUrl({ targetKey: "members" })}
      sessionExpiresAt={session.expiresAt}
      sessionRefreshEarlySeconds={session.refreshEarlySeconds}
      showChrome={false}
      storageAnalytics={{
        message: "Storage details load when you open Files.",
        status: "unavailable",
      }}
      storageFiles={{
        message: "Files load when you open Files.",
        status: "unavailable",
      }}
      userEmail={session.user.email}
    />
  );
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
      <Suspense fallback={<RichfieldAdminSkeleton />}>
        <SectionBody section={section} session={sessionState.session} />
      </Suspense>
    </AdminShell>
  );
}
