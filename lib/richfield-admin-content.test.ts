import { describe, expect, test } from "vitest";
import type {
  RichfieldAdminContentItem,
  RichfieldAdminStudioPayload,
} from "./richfield-admin-content-model";
import { findReferencedEditorMediaRecords } from "./richfield-admin-content";

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
