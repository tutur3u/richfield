import { describe, expect, it, vi } from "vitest";
import { uploadExternalProjectAssetFile } from "./tuturuuu-public-folder-sync";

describe("uploadExternalProjectAssetFile", () => {
	it("keeps large files out of the Tuturuuu API proxy body", async () => {
		const file = new File([new Uint8Array(700 * 1024)], "gallery.png", {
			type: "image/png",
		});
		const fetchImpl = vi
			.fn<typeof fetch>()
			.mockResolvedValueOnce(
				Response.json({
					contentType: "image/png",
					fullPath:
						"workspace/external-projects/richfield/image-library/editor-media/gallery.png",
					headers: { "Content-Type": "image/png" },
					path: "external-projects/richfield/image-library/editor-media/gallery.png",
					signedUrl: "https://storage.example.com/signed-upload",
					token: "storage-token",
				}),
			)
			.mockResolvedValueOnce(new Response(null, { status: 200 }));

		const result = await uploadExternalProjectAssetFile({
			accessToken: "session-token",
			apiBaseUrl: "https://api.example.com/api/v1",
			collectionType: "image-library",
			entrySlug: "editor-media",
			fetch: fetchImpl,
			file,
			filename: file.name,
			workspaceId: "workspace",
		});

		expect(result.path).toContain("image-library/editor-media/gallery.png");
		expect(fetchImpl).toHaveBeenCalledTimes(2);

		const [payloadUrl, payloadInit] = fetchImpl.mock.calls[0] ?? [];
		expect(payloadUrl).toBe(
			"https://api.example.com/api/v1/workspaces/workspace/external-projects/assets/upload-url",
		);
		expect(payloadInit?.headers).toMatchObject({
			Authorization: "Bearer session-token",
			"Content-Type": "application/json",
		});
		expect(JSON.parse(String(payloadInit?.body))).toEqual({
			collectionType: "image-library",
			contentType: "image/png",
			entrySlug: "editor-media",
			filename: "gallery.png",
			size: 700 * 1024,
			upsert: true,
		});
		expect(String(payloadInit?.body).length).toBeLessThan(512 * 1024);

		const [uploadUrl, uploadInit] = fetchImpl.mock.calls[1] ?? [];
		expect(uploadUrl).toBe("https://storage.example.com/signed-upload");
		expect(uploadInit).toMatchObject({
			body: file,
			cache: "no-store",
			method: "PUT",
		});
		expect(new Headers(uploadInit?.headers).get("Authorization")).toBe(
			"Bearer storage-token",
		);
		expect(new Headers(uploadInit?.headers).get("Content-Type")).toBe(
			"image/png",
		);
	});

	it("retries signed uploads without the content type header", async () => {
		const file = new File(["image"], "gallery.webp", {
			type: "image/webp",
		});
		const fetchImpl = vi
			.fn<typeof fetch>()
			.mockResolvedValueOnce(
				Response.json({
					contentType: "image/webp",
					fullPath: "workspace/gallery.webp",
					headers: { "Content-Type": "image/webp" },
					path: "gallery.webp",
					signedUrl: "https://storage.example.com/signed-upload",
					token: "storage-token",
				}),
			)
			.mockResolvedValueOnce(new Response("signature mismatch", { status: 403 }))
			.mockResolvedValueOnce(new Response(null, { status: 200 }));

		await uploadExternalProjectAssetFile({
			accessToken: "session-token",
			apiBaseUrl: "https://api.example.com/api/v1",
			collectionType: "image-library",
			entrySlug: "editor-media",
			fetch: fetchImpl,
			file,
			filename: file.name,
			workspaceId: "workspace",
		});

		expect(fetchImpl).toHaveBeenCalledTimes(3);
		expect(
			new Headers(fetchImpl.mock.calls[1]?.[1]?.headers).get("Content-Type"),
		).toBe("image/webp");
		expect(
			new Headers(fetchImpl.mock.calls[2]?.[1]?.headers).get("Content-Type"),
		).toBeNull();
	});
});
