import type { Metadata } from "next";
import { Suspense } from "react";
import { RichfieldAdminDashboard } from "@/components/admin/RichfieldAdminDashboard";
import { RichfieldAdminLoadingPanel } from "@/components/admin/RichfieldAdminLoadingPanel";
import { RichfieldAdminLoginPanel } from "@/components/admin/RichfieldAdminLoginPanel";
import { RichfieldAdminSessionRestorer } from "@/components/admin/RichfieldAdminSessionRestorer";
import { getRichfieldCentralizedLoginHref } from "./login-link";
import {
  readRichfieldAdminContent,
  type RichfieldAdminStudioPayload,
} from "@/lib/richfield-admin-content-model";
import {
  buildRichfieldDriveUrl,
  buildRichfieldWorkspaceUrl,
  resolveRichfieldAdminTargetKey,
} from "@/lib/richfield-config";
import {
  getRichfieldAdminSessionReadState,
  getRichfieldAdminStudio,
} from "@/lib/richfield-admin-api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Richfield Dashboard",
  description: "Friendly website dashboard for InkedByRichfield.",
};

type AuthenticatedRichfieldAdminSession = Extract<
  Awaited<ReturnType<typeof getRichfieldAdminSessionReadState>>,
  { status: "authenticated" }
>["session"];

function emptyStudio(): RichfieldAdminStudioPayload {
  return {
    assets: [],
    blocks: [],
    collections: [],
    entries: [],
  };
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: Promise<{ target?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const activeTarget = resolveRichfieldAdminTargetKey(
    resolvedSearchParams?.target,
  );
  const loginHref = await getRichfieldCentralizedLoginHref(activeTarget);
  const sessionState = await getRichfieldAdminSessionReadState();

  if (sessionState.status === "unauthenticated") {
    return <RichfieldAdminLoginPanel loginHref={loginHref} />;
  }

  if (sessionState.status === "refreshable") {
    return <RichfieldAdminSessionRestorer loginHref={loginHref} />;
  }

  const { session } = sessionState;

  return (
    <Suspense fallback={<RichfieldAdminLoadingPanel />}>
      <AuthenticatedAdminDashboard session={session} />
    </Suspense>
  );
}

async function AuthenticatedAdminDashboard({
  session,
}: {
  session: AuthenticatedRichfieldAdminSession;
}) {
  const studio = await getRichfieldAdminStudio(session.accessToken).catch((error) => {
    console.error("[richfield:admin] failed to load studio", error);
    return emptyStudio();
  });

  return (
    <RichfieldAdminDashboard
      initialContent={{
        brands: readRichfieldAdminContent(studio, "brands"),
        "contact-channels": readRichfieldAdminContent(studio, "contact-channels"),
        "contact-page": readRichfieldAdminContent(studio, "contact-page"),
        "contact-submissions": readRichfieldAdminContent(studio, "contact-submissions"),
        "image-library": readRichfieldAdminContent(studio, "image-library"),
        jobs: readRichfieldAdminContent(studio, "jobs"),
        leadership: readRichfieldAdminContent(studio, "leadership"),
        milestones: readRichfieldAdminContent(studio, "milestones"),
      }}
      driveHref={buildRichfieldDriveUrl()}
      membersHref={buildRichfieldWorkspaceUrl({ targetKey: "members" })}
      sessionExpiresAt={session.expiresAt}
      sessionRefreshEarlySeconds={session.refreshEarlySeconds}
      storageAnalytics={{
        message: "Storage details load when you open Storage.",
        status: "unavailable",
      }}
      storageFiles={{
        message: "Files load when you open Storage.",
        status: "unavailable",
      }}
      userEmail={session.user.email}
    />
  );
}
