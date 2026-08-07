import { describe, expect, test, vi } from "vitest";
import type {
  RichfieldAdminContentItem,
  RichfieldAdminStudioPayload,
} from "./richfield-admin-content-model";
import { parseRichfieldContentFormData } from "./richfield-admin-content-model";
import {
  findReferencedEditorMediaRecords,
  updateRichfieldContentItem,
} from "./richfield-admin-content";

// Revalidation needs a Next request scope; the paths it touches are covered in
// richfield-revalidation.test.ts.
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

const assetUrl = (id: string) =>
  `https://tuturuuu.com/api/v1/workspaces/workspace/external-projects/assets/${id}`;

describe("Richfield admin content media cleanup", () => {
  test("finds only editor media referenced by an article", () => {
    const studio = {
      assets: [
        { entry_id: "inline-entry", id: "inline-asset" },
        { entry_id: "inline-entry", id: "inline-thumbnail" },
        { entryId: "gallery-entry", id: "gallery-asset" },
        { entry_id: "library-entry", id: "library-asset" },
        { entry_id: "unused-entry", id: "unused-asset" },
      ],
      blocks: [],
      collections: [],
      entries: [
        {
          id: "article-entry",
          metadata: {
            richfieldLocalization: {
              locales: {
                vi: {
                  bodyContent: {
                    content: [
                      {
                        attrs: { src: assetUrl("localized-asset") },
                        type: "image",
                      },
                    ],
                    type: "doc",
                  },
                },
              },
            },
          },
        },
        { id: "inline-entry", metadata: { editorMedia: true } },
        { id: "gallery-entry", metadata: { editorMedia: true } },
        { id: "localized-entry", metadata: { editorMedia: true } },
        { id: "unused-entry", metadata: { editorMedia: true } },
        { id: "library-entry", metadata: {} },
      ],
    } satisfies RichfieldAdminStudioPayload;
    studio.assets.push({
      entry_id: "localized-entry",
      id: "localized-asset",
    });
    const item = {
      bodyContent: {
        content: [
          {
            content: [
              {
                attrs: { src: assetUrl("inline-asset") },
                type: "image",
              },
            ],
            type: "paragraph",
          },
          {
            attrs: { src: assetUrl("library-asset") },
            type: "image",
          },
        ],
        type: "doc",
      },
      gallery: [
        {
          alt: "Gallery",
          caption: "",
          id: "gallery",
          url: assetUrl("gallery-asset"),
        },
      ],
      id: "article-entry",
    } satisfies Pick<
      RichfieldAdminContentItem,
      "bodyContent" | "gallery" | "id"
    >;

    expect(findReferencedEditorMediaRecords(studio, item)).toEqual([
      {
        assetIds: ["inline-asset", "inline-thumbnail"],
        entryId: "inline-entry",
      },
      {
        assetIds: ["gallery-asset"],
        entryId: "gallery-entry",
      },
      {
        assetIds: ["localized-asset"],
        entryId: "localized-entry",
      },
    ]);
  });

  test("ignores malformed and unrelated asset URLs", () => {
    const studio = {
      assets: [{ entry_id: "editor-entry", id: "editor-asset" }],
      blocks: [],
      collections: [],
      entries: [
        { id: "editor-entry", metadata: { editorMedia: true } },
      ],
    } satisfies RichfieldAdminStudioPayload;
    const item = {
      bodyContent: {
        content: [
          {
            attrs: { src: "https://example.com/image.png" },
            type: "image",
          },
        ],
        type: "doc",
      },
      gallery: [],
      id: "article-entry",
    } satisfies Pick<
      RichfieldAdminContentItem,
      "bodyContent" | "gallery" | "id"
    >;

    expect(findReferencedEditorMediaRecords(studio, item)).toEqual([]);
  });
});

/**
 * A stand-in for the platform client that actually persists what it is told,
 * so a save can be read back the way the dashboard reads it.
 */
function createStudioDouble() {
  const entries: Record<string, unknown>[] = [
    {
      collection_id: "collection-1",
      id: "article-entry",
      metadata: {
        richfieldLocalization: {
          defaultLocale: "en",
          locales: {
            en: {
              body: "English body",
              status: "published",
              summary: "English summary",
              title: "Harvest season",
            },
            vi: {
              body: "Nội dung cũ",
              status: "published",
              summary: "Tóm tắt cũ",
              title: "Mùa thu hoạch",
            },
          },
          sourceLocale: "en",
          supportedLocales: ["en", "vi"],
          version: 1,
        },
      },
      profile_data: { author: "Bao Chua" },
      slug: "harvest-season",
      status: "published",
      summary: "English summary",
      title: "Harvest season",
    },
  ];

  return {
    createAsset: vi.fn(),
    createBlock: vi.fn(),
    createCollection: vi.fn(),
    createEntry: vi.fn(),
    deleteAsset: vi.fn(),
    deleteEntry: vi.fn(),
    getStudio: vi.fn(async () => ({
      assets: [],
      blocks: [],
      collections: [{ id: "collection-1", slug: "articles" }],
      entries: entries.map((entry) => ({ ...entry })),
    })),
    updateAsset: vi.fn(),
    updateBlock: vi.fn(),
    updateEntry: vi.fn(
      async (
        _workspaceId: string,
        entryId: string,
        payload: Record<string, unknown>,
      ) => {
        const index = entries.findIndex((entry) => entry.id === entryId);
        entries[index] = { ...entries[index], ...payload };
      },
    ),
    uploadAssetFile: vi.fn(),
  };
}

type MutationClient = Parameters<typeof updateRichfieldContentItem>[0];

function articleInput(fields: Record<string, string>) {
  const formData = new FormData();

  for (const [key, value] of Object.entries(fields)) {
    formData.set(key, value);
  }

  const { input } = parseRichfieldContentFormData("articles", formData);

  if (!input) throw new Error("Test input failed validation");

  return input;
}

describe("Richfield admin content save", () => {
  test("returns the saved entry in the locale it was saved in", async () => {
    // The client reported the editor flipping to English the moment a
    // Vietnamese article was saved: the save was right, the echo was English.
    const client = createStudioDouble();
    const result = await updateRichfieldContentItem(
      client as unknown as MutationClient,
      "workspace",
      "articles",
      "article-entry",
      articleInput({
        body: "Nội dung tiếng Việt mới",
        locale: "vi",
        slug: "harvest-season",
        status: "published",
        summary: "Tóm tắt tiếng Việt mới",
        title: "Mùa thu hoạch mới",
      }),
    );

    expect(result.item?.title).toBe("Mùa thu hoạch mới");
    expect(result.item?.summary).toBe("Tóm tắt tiếng Việt mới");
    expect(result.item?.body).toBe("Nội dung tiếng Việt mới");
    expect(result.item?.locale).toBe("vi");
  });

  test("leaves the English variant alone when Vietnamese is saved", async () => {
    const client = createStudioDouble();
    const result = await updateRichfieldContentItem(
      client as unknown as MutationClient,
      "workspace",
      "articles",
      "article-entry",
      articleInput({
        body: "Nội dung tiếng Việt mới",
        locale: "vi",
        slug: "harvest-season",
        status: "published",
        title: "Mùa thu hoạch mới",
      }),
    );

    // The slug is derived from the English title, so it has to survive a
    // Vietnamese save untouched.
    expect(result.item?.englishTitle).toBe("Harvest season");
    expect(result.item?.localeStatuses).toEqual({
      en: "published",
      vi: "published",
    });
  });

  test("returns the English variant when English is saved", async () => {
    const client = createStudioDouble();
    const result = await updateRichfieldContentItem(
      client as unknown as MutationClient,
      "workspace",
      "articles",
      "article-entry",
      articleInput({
        body: "New English body",
        locale: "en",
        slug: "harvest-season",
        status: "published",
        title: "Harvest season 2026",
      }),
    );

    expect(result.item?.title).toBe("Harvest season 2026");
    expect(result.item?.locale).toBe("en");
  });
});
