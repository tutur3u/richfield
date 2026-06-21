import { revalidatePath } from "next/cache";
import { ExternalProjectsClient } from "tuturuuu/external-projects";
import {
  uploadExternalProjectAssetFile,
} from "./tuturuuu-public-folder-sync";
import { getRichfieldApiBaseUrl, getRichfieldAppBaseUrl, getRichfieldWorkspaceId } from "./richfield-config";
import { richfieldExternalProjectManifest } from "./richfield-external-project-manifest";
import {
  getRichfieldSessionFromCookies,
  getRichfieldSessionReadStateFromCookies,
} from "./richfield-session";
import type { RichfieldAdminStudioPayload } from "./richfield-admin-content-model";

export function buildSyncManifest(appBaseUrl: string) {
  const manifest = structuredClone(richfieldExternalProjectManifest) as typeof richfieldExternalProjectManifest;

  for (const entry of manifest.content.entries) {
    const assets = "assets" in entry ? entry.assets : [];

    for (const asset of assets ?? []) {
      if (typeof asset.sourceUrl === "string" && asset.sourceUrl.startsWith("/")) {
        asset.sourceUrl = new URL(asset.sourceUrl, appBaseUrl).toString();
      }
    }
  }

  return manifest;
}

export function createRichfieldExternalProjectsClient(accessToken: string) {
  const apiBaseUrl = getRichfieldApiBaseUrl();
  const client = new ExternalProjectsClient({
    apiKey: accessToken,
    baseUrl: apiBaseUrl,
  });

  client.uploadAssetFile = (workspaceId, file, options) =>
    uploadExternalProjectAssetFile({
      accessToken,
      apiBaseUrl,
      collectionType: options.collectionType,
      entrySlug: options.entrySlug,
      file,
      filename: file.name,
      upsert: options.upsert,
      workspaceId,
    });

  return client;
}

async function readApiError(response: Response) {
  const fallback = `Richfield setup failed with status ${response.status}`;
  const data = (await response.json().catch(() => null)) as { error?: unknown } | null;
  return typeof data?.error === "string" && data.error.trim() ? data.error : fallback;
}

export async function setupRichfieldAdminStudio(accessToken: string) {
  const workspaceId = getRichfieldWorkspaceId();
  const apiBaseUrl = getRichfieldApiBaseUrl();
  const appBaseUrl = getRichfieldAppBaseUrl();
  const manifest = buildSyncManifest(appBaseUrl);
  const response = await fetch(
    `${apiBaseUrl.replace(/\/+$/, "")}/workspaces/${encodeURIComponent(
      workspaceId,
    )}/external-projects/setup`,
    {
      body: JSON.stringify({ manifest }),
      cache: "no-store",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    },
  );

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }
}

export async function getRichfieldAdminSession() {
  return getRichfieldSessionFromCookies();
}

export async function getRichfieldAdminSessionReadState() {
  return getRichfieldSessionReadStateFromCookies();
}

export async function getRichfieldAdminStudio(accessToken: string) {
  await setupRichfieldAdminStudio(accessToken);
  const client = createRichfieldExternalProjectsClient(accessToken);
  return client.getStudio(getRichfieldWorkspaceId()) as Promise<RichfieldAdminStudioPayload>;
}

export function revalidateRichfieldContent() {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/brands");
  revalidatePath("/careers");
  revalidatePath("/about/our-story");
  revalidatePath("/about/who-we-are");
}
