import { buildSyncManifest } from "@/lib/richfield-admin-api";
import {
  getRichfieldApiBaseUrl,
  getRichfieldAppBaseUrl,
  getRichfieldWorkspaceId,
} from "@/lib/richfield-config";
import { getRichfieldSessionFromCookies } from "@/lib/richfield-session";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function readApiError(response: Response) {
  const fallback = `Tuturuuu sync apply failed with status ${response.status}`;
  const data = (await response.json().catch(() => null)) as { error?: unknown } | null;
  return typeof data?.error === "string" && data.error.trim() ? data.error : fallback;
}

export async function POST(request: Request) {
  const session = await getRichfieldSessionFromCookies();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { force?: unknown } | null;
  const workspaceId = getRichfieldWorkspaceId();
  const apiBaseUrl = getRichfieldApiBaseUrl();
  const appBaseUrl = getRichfieldAppBaseUrl(new URL(request.url).origin);
  const manifest = buildSyncManifest(appBaseUrl);

  const setupResponse = await fetch(
    `${apiBaseUrl.replace(/\/+$/, "")}/workspaces/${encodeURIComponent(
      workspaceId,
    )}/external-projects/setup`,
    {
      body: JSON.stringify({ manifest }),
      cache: "no-store",
      headers: {
        Accept: "application/json",
        Authorization: `${session.tokenType} ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    },
  );

  if (!setupResponse.ok) {
    return NextResponse.json(
      { error: await readApiError(setupResponse) },
      { status: setupResponse.status },
    );
  }

  const response = await fetch(
    `${apiBaseUrl.replace(/\/+$/, "")}/workspaces/${encodeURIComponent(
      workspaceId,
    )}/external-projects/sync/apply`,
    {
      body: JSON.stringify({
        force: body?.force === true,
        manifest,
      }),
      cache: "no-store",
      headers: {
        Accept: "application/json",
        Authorization: `${session.tokenType} ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    },
  );

  if (!response.ok) {
    return NextResponse.json({ error: await readApiError(response) }, { status: response.status });
  }

  revalidatePath("/", "layout");
  return NextResponse.json(await response.json());
}
