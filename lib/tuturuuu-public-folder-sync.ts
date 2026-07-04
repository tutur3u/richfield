import { readFile } from "node:fs/promises";
import { basename, extname, resolve, sep } from "node:path";
import { posix } from "node:path";

type PublicAssetMetadata = Record<string, unknown> & {
	localAssetPath?: unknown;
	publicPath?: unknown;
	sourcePublicPath?: unknown;
};

type PublicAsset = {
	assetType: string;
	metadata?: Record<string, unknown>;
	publicPath?: string | null;
	sourceUrl?: string | null;
	stableSourceId?: string | null;
	storagePath?: string | null;
};

type PublicEntry = {
	assets?: PublicAsset[];
	collectionSlug: string;
	slug: string;
};

type PublicManifest = {
	adapter: string;
	content: {
		entries: PublicEntry[];
	};
};

export type PublicFolderAssetUpload = {
	collectionSlug: string;
	entrySlug: string;
	filename: string;
	publicPath: string;
	stableSourceId: string | null;
	storagePath: string;
};

export type PublicFolderSyncResult<Manifest extends PublicManifest> = {
	manifest: Manifest;
	skipped: PublicFolderAssetUpload[];
	uploaded: PublicFolderAssetUpload[];
};

type SyncPublicFolderAssetsInput<Manifest extends PublicManifest> = {
	accessToken: string;
	apiBaseUrl: string;
	appBaseUrl?: string;
	fetch?: typeof fetch;
	manifest: Manifest;
	publicDir?: string;
	tokenType?: string;
	upsert?: boolean;
	workspaceId: string;
};

type UploadExternalProjectAssetFileInput = {
	accessToken: string;
	apiBaseUrl: string;
	collectionType: string;
	entrySlug: string;
	fetch?: typeof fetch;
	file: Blob;
	filename: string;
	tokenType?: string;
	upsert?: boolean;
	workspaceId: string;
};

const CONTENT_TYPES: Record<string, string> = {
	".gif": "image/gif",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".mp3": "audio/mpeg",
	".mp4": "video/mp4",
	".png": "image/png",
	".svg": "image/svg+xml",
	".webp": "image/webp",
};

function cloneManifest<Manifest extends PublicManifest>(manifest: Manifest) {
	return structuredClone(manifest) as Manifest;
}

function normalizePublicPath(value: unknown) {
	if (typeof value !== "string") {
		return null;
	}

	const trimmed = value.trim();
	if (!trimmed || /^https?:\/\//i.test(trimmed) || !trimmed.startsWith("/")) {
		return null;
	}

	const normalized = posix.normalize(trimmed);
	if (normalized === "/" || normalized.startsWith("/../")) {
		return null;
	}

	return normalized;
}

function getAssetPublicPath(asset: PublicAsset) {
	const metadata = (asset.metadata ?? {}) as PublicAssetMetadata;

	return (
		normalizePublicPath(asset.publicPath) ??
		normalizePublicPath(metadata.publicPath) ??
		normalizePublicPath(metadata.localAssetPath) ??
		normalizePublicPath(metadata.sourcePublicPath) ??
		normalizePublicPath(asset.sourceUrl)
	);
}

function contentTypeForPath(publicPath: string) {
	return CONTENT_TYPES[extname(publicPath).toLowerCase()] ?? "application/octet-stream";
}

function resolvePublicFilePath(publicDir: string, publicPath: string) {
	const publicRoot = resolve(/* turbopackIgnore: true */ publicDir);
	const filePath = resolve(/* turbopackIgnore: true */ publicRoot, publicPath.slice(1));
	if (filePath !== publicRoot && !filePath.startsWith(`${publicRoot}${sep}`)) {
		throw new Error(`Refusing to read public asset outside publicDir: ${publicPath}`);
	}

	return filePath;
}

function getPublicAssetUploads(manifest: PublicManifest) {
	const uploads: Array<{
		asset: PublicAsset;
		entry: PublicEntry;
		publicPath: string;
	}> = [];

	for (const entry of manifest.content.entries) {
		for (const asset of entry.assets ?? []) {
			const publicPath = getAssetPublicPath(asset);
			if (publicPath) {
				uploads.push({ asset, entry, publicPath });
			}
		}
	}

	return uploads;
}

function getPublicAssetStoragePath({
	adapter,
	collectionSlug,
	entrySlug,
	publicPath,
}: {
	adapter: string;
	collectionSlug: string;
	entrySlug: string;
	publicPath: string;
}) {
	return posix.join(
		"external-projects",
		adapter,
		collectionSlug,
		entrySlug,
		basename(publicPath),
	);
}

async function readPublicAsset({
	appBaseUrl,
	fetchImpl,
	publicDir,
	publicPath,
}: {
	appBaseUrl?: string;
	fetchImpl: typeof fetch;
	publicDir: string;
	publicPath: string;
}) {
	try {
		const file = await readFile(/* turbopackIgnore: true */ resolvePublicFilePath(publicDir, publicPath));

		return {
			contentType: contentTypeForPath(publicPath),
			value: new Uint8Array(file),
		};
	} catch {
		if (!appBaseUrl?.trim()) {
			return null;
		}
	}

	const assetUrl = new URL(publicPath, appBaseUrl).toString();
	const response = await fetchImpl(assetUrl, { cache: "no-store" }).catch(() => null);

	if (!response?.ok) {
		return null;
	}

	const contentType = response.headers.get("content-type")?.split(";")[0]?.trim() || contentTypeForPath(publicPath);

	return {
		contentType,
		value: new Uint8Array(await response.arrayBuffer()),
	};
}

async function readAssetUploadError(response: Response) {
	const data = (await response.json().catch(() => null)) as { error?: unknown } | null;
	return typeof data?.error === "string" && data.error.trim()
		? data.error
		: `Tuturuuu asset upload failed with status ${response.status}`;
}

export function linkPublicFolderAssets<Manifest extends PublicManifest>(manifestInput: Manifest) {
	const manifest = cloneManifest(manifestInput);

	for (const { asset, entry, publicPath } of getPublicAssetUploads(manifest)) {
		asset.metadata = {
			...(asset.metadata ?? {}),
			publicPath,
		};
		asset.sourceUrl = null;
		asset.storagePath = getPublicAssetStoragePath({
			adapter: manifest.adapter,
			collectionSlug: entry.collectionSlug,
			entrySlug: entry.slug,
			publicPath,
		});
	}

	return manifest;
}

export async function uploadExternalProjectAssetFile({
	accessToken,
	apiBaseUrl,
	collectionType,
	entrySlug,
	fetch: fetchImpl = fetch,
	file,
	filename,
	tokenType = "Bearer",
	upsert = true,
	workspaceId,
}: UploadExternalProjectAssetFileInput) {
	// Multipart direct upload: Supabase-backed workspaces reject the signed-URL
	// flow ("Direct upload is required for Supabase-backed external assets").
	const formData = new FormData();
	formData.set("collectionType", collectionType);
	formData.set("contentType", file.type || "application/octet-stream");
	formData.set("entrySlug", entrySlug);
	formData.set("file", file, filename);
	formData.set("upsert", String(upsert));

	const response = await fetchImpl(
		`${apiBaseUrl.replace(/\/+$/, "")}/workspaces/${encodeURIComponent(
			workspaceId,
		)}/external-projects/assets/upload-url`,
		{
			body: formData,
			cache: "no-store",
			headers: {
				Accept: "application/json",
				Authorization: `${tokenType} ${accessToken}`,
			},
			method: "POST",
		},
	);

	if (!response.ok) {
		throw new Error(await readAssetUploadError(response));
	}

	const payload = (await response.json()) as {
		fullPath?: unknown;
		path?: unknown;
	};

	if (typeof payload.path !== "string" || !payload.path.trim()) {
		throw new Error("Missing Tuturuuu asset upload path");
	}

	return {
		fullPath: typeof payload.fullPath === "string" ? payload.fullPath : null,
		path: payload.path,
	};
}

export async function syncPublicFolderAssets<Manifest extends PublicManifest>({
	accessToken,
	apiBaseUrl,
	appBaseUrl,
	fetch: fetchImpl = fetch,
	manifest: manifestInput,
	publicDir = resolve(/* turbopackIgnore: true */ process.cwd(), "public"),
	tokenType = "Bearer",
	upsert = true,
	workspaceId,
}: SyncPublicFolderAssetsInput<Manifest>): Promise<PublicFolderSyncResult<Manifest>> {
	const manifest = linkPublicFolderAssets(manifestInput);
	const uploaded: PublicFolderAssetUpload[] = [];
	const skipped: PublicFolderAssetUpload[] = [];

	for (const { asset, entry, publicPath } of getPublicAssetUploads(manifest)) {
		const upload = {
			collectionSlug: entry.collectionSlug,
			entrySlug: entry.slug,
			filename: basename(publicPath),
			publicPath,
			stableSourceId: asset.stableSourceId ?? null,
			storagePath:
				asset.storagePath ??
				getPublicAssetStoragePath({
					adapter: manifest.adapter,
					collectionSlug: entry.collectionSlug,
					entrySlug: entry.slug,
					publicPath,
				}),
		} satisfies PublicFolderAssetUpload;

		const source = await readPublicAsset({
			appBaseUrl,
			fetchImpl,
			publicDir,
			publicPath,
		});

		if (!source) {
			skipped.push(upload);
			continue;
		}

		const result = await uploadExternalProjectAssetFile({
			accessToken,
			apiBaseUrl,
			collectionType: entry.collectionSlug,
			entrySlug: entry.slug,
			fetch: fetchImpl,
			file: new Blob([source.value], { type: source.contentType }),
			filename: upload.filename,
			tokenType,
			upsert,
			workspaceId,
		});

		asset.storagePath = result.path;
		uploaded.push({ ...upload, storagePath: result.path });
	}

	return { manifest, skipped, uploaded };
}
