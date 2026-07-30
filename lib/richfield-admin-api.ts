import { revalidatePath } from "next/cache";
import { ExternalProjectsClient } from "tuturuuu/external-projects";
import {
  uploadExternalProjectAssetFile,
} from "./tuturuuu-public-folder-sync";
import { getRichfieldApiBaseUrl, getRichfieldAppBaseUrl, getRichfieldWorkspaceId } from "./richfield-config";
import { fetchWithRichfieldTimeout } from "./richfield-fetch";
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
  const response = await fetchWithRichfieldTimeout(
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

/**
 * Load the studio, provisioning the content model only if it is missing.
 *
 * This used to POST the whole sync manifest to /setup and await it before
 * every single read, so opening any dashboard section paid for a serialized
 * write-path round trip that re-declared nine collections and their fields —
 * work that is idempotent and, in practice, already done. That was the bulk of
 * the multi-second wait on each navigation.
 *
 * The guarantee it provided is kept: an unprovisioned workspace comes back
 * with no collections, and that is the case where setup actually needs to run.
 * The cron at /api/cron/ensure-content-model covers the same ground in the
 * background, so the common path is now a single read.
 */
export async function getRichfieldAdminStudio(accessToken: string) {
  const client = createRichfieldExternalProjectsClient(accessToken);
  const workspaceId = getRichfieldWorkspaceId();
  const studio = (await client.getStudio(
    workspaceId,
  )) as RichfieldAdminStudioPayload;

  if (studio.collections.length > 0) {
    return studio;
  }

  await setupRichfieldAdminStudio(accessToken);
  return client.getStudio(workspaceId) as Promise<RichfieldAdminStudioPayload>;
}

/**
 * Read just one collection and the blocks/assets required to render it.
 *
 * The platform keeps the unscoped studio endpoint for compatibility, but list
 * and editor routes must not download unrelated collections.
 */
export async function getRichfieldAdminCollectionStudio(
  accessToken: string,
  collectionSlug: string,
) {
  const client = createRichfieldExternalProjectsClient(accessToken);
  const workspaceId = getRichfieldWorkspaceId();
  const read = () =>
    client.getStudio(workspaceId, {
      collectionSlugs: [collectionSlug],
    }) as Promise<RichfieldAdminStudioPayload>;
  let studio = await read();

  if (studio.collections.length === 0) {
    await setupRichfieldAdminStudio(accessToken);
    studio = await read();
  }

  return studio;
}

export function revalidateRichfieldContent() {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/news");
  revalidatePath("/news/[slug]", "page");
  revalidatePath("/brands");
  revalidatePath("/careers");
  revalidatePath("/careers/[slug]", "page");
  revalidatePath("/contact");
  revalidatePath("/about/our-story");
  revalidatePath("/about/who-we-are");
  revalidatePath("/vi", "layout");
  revalidatePath("/vi/news");
  revalidatePath("/vi/news/[slug]", "page");
  revalidatePath("/vi/brands");
  revalidatePath("/vi/careers");
  revalidatePath("/vi/careers/[slug]", "page");
  revalidatePath("/vi/contact");
}
