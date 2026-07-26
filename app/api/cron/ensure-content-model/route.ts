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

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const manifest = buildSyncManifest(
      getRichfieldAppBaseUrl(new URL(request.url).origin),
    );
    const response = await fetchWithRichfieldTimeout(
      `${getRichfieldApiBaseUrl().replace(/\/+$/, "")}/workspaces/${encodeURIComponent(
        getRichfieldWorkspaceId(),
      )}/external-projects/setup`,
      {
        body: JSON.stringify({ manifest }),
        cache: "no-store",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-app-id": getRichfieldAppId(),
          "x-app-secret": getRichfieldAppSecret(),
        },
        method: "POST",
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: await readError(response), status: "failed" },
        { status: response.status },
      );
    }

    const result = (await response.json()) as Record<string, unknown>;

    return NextResponse.json({
      collections: manifest.schema?.collections?.length ?? 0,
      result,
      status: "applied",
    });
  } catch (error) {
    console.error("[richfield:setup] content model install failed", error);
    return NextResponse.json(
      { error: "Content model install failed", status: "failed" },
      { status: 500 },
    );
  }
}
