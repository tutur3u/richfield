import { buildSyncManifest } from "@/lib/richfield-admin-api";
import {
  getRichfieldApiBaseUrl,
  getRichfieldAppBaseUrl,
  getRichfieldAppId,
  getRichfieldAppSecret,
  getRichfieldWorkspaceId,
} from "@/lib/richfield-config";
import { fetchWithRichfieldTimeout } from "@/lib/richfield-fetch";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Install (or repair) this site's content model in Tuturuuu.
 *
 * The studio schema is defined here, in the sync manifest, but until now it
 * could only be pushed by a signed-in operator clicking Sync — so a freshly
 * bound workspace stayed empty, and every editor screen had nothing behind it,
 * until somebody remembered. This posts the same manifest using the app
 * credentials the site already holds, so the schema can be installed
 * unattended and re-applied whenever it drifts.
 *
 * Guarded by CRON_SECRET rather than left open: it rewrites the content model.
 */
function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;

  if (!secret) return false;

  return request.headers.get("authorization") === `Bearer ${secret}`;
}

async function readError(response: Response) {
  const payload = (await response.json().catch(() => null)) as {
    error?: string;
  } | null;

  return payload?.error ?? `status ${response.status}`;
}

function externalProjectUrl(path: string) {
  return `${getRichfieldApiBaseUrl().replace(/\/+$/, "")}/workspaces/${encodeURIComponent(
    getRichfieldWorkspaceId(),
  )}/external-projects/${path}`;
}

function appHeaders() {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-app-id": getRichfieldAppId(),
    "x-app-secret": getRichfieldAppSecret(),
  };
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const manifest = buildSyncManifest(
      getRichfieldAppBaseUrl(new URL(request.url).origin),
    );

    // Two steps, and both are needed. Setup only ensures the binding and the
    // canonical project; it reports success while the workspace still holds no
    // collections. The sync is what actually writes them, so a setup-only run
    // looks applied and leaves every editor screen empty.
    const setupResponse = await fetchWithRichfieldTimeout(
      externalProjectUrl("setup"),
      {
        body: JSON.stringify({ manifest }),
        cache: "no-store",
        headers: appHeaders(),
        method: "POST",
      },
    );

    if (!setupResponse.ok) {
      return NextResponse.json(
        { error: await readError(setupResponse), status: "setup-failed" },
        { status: setupResponse.status },
      );
    }

    const syncResponse = await fetchWithRichfieldTimeout(
      externalProjectUrl("sync/apply"),
      {
        body: JSON.stringify({ force: true, manifest }),
        cache: "no-store",
        headers: appHeaders(),
        method: "POST",
      },
    );

    if (!syncResponse.ok) {
      return NextResponse.json(
        { error: await readError(syncResponse), status: "sync-failed" },
        { status: syncResponse.status },
      );
    }

    return NextResponse.json({
      expectedCollections: manifest.schema?.collections?.length ?? 0,
      status: "applied",
      sync: (await syncResponse.json()) as Record<string, unknown>,
    });
  } catch (error) {
    console.error("[richfield:setup] content model install failed", error);
    return NextResponse.json(
      { error: "Content model install failed", status: "failed" },
      { status: 500 },
    );
  }
}
