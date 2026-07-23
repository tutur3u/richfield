import { describe, expect, test } from "vitest";
import {
  canSaveRichfieldEditor,
  getRichfieldDateInputValue,
  getRichfieldDisplayDateFromInput,
  getRichfieldEditorPreviewHref,
  getRichfieldEditorSteps,
  getRichfieldEditorCloseIntent,
  hasRichfieldEditorDirtyChanges,
  type RichfieldAdminEditorDraft,
} from "./richfield-admin-editor-state";

const baseDraft: RichfieldAdminEditorDraft = {
  aboutOnly: false,
  accent: "bg-[oklch(0.86_0.12_28/0.18)]",
  applyEmail: "",
  author: "",
  body: "",
  brand: "Mars · Wrigley",
  category: "Food",
  country: "USA",
  credit: "",
  cta: "",
  deadline: "",
  department: "",
  email: "",
  emailNotificationStatus: "",
  employmentType: "",
  feature: true,
  featureCaption: "Founding partner · Since 1994",
  href: "",
  imageAlt: "Mars · Wrigley",
  inquiryType: "",
  kind: "",
  location: "",
  mapQuery: "",
  name: "",
  objectPosition: "",
  pageSection: "",
  placement: "",
  positions: "",
  productName: "",
  publishedAt: "",
  ratio: "",
  receivedAt: "",
  removeImage: false,
  role: "",
  slug: "mars-wrigley",
  sortOrder: "",
  status: "published",
  submissionStatus: "",
  subtitle: "Food",
  summary: "Our founding partner.",
  shelfWeight: "",
  title: "Mars · Wrigley",
  usageTags: "",
  workMode: "",
  year: "1994",
};

describe("Richfield admin editor state", () => {
  test("keeps save disabled when nothing changed", () => {
    const isDirty = hasRichfieldEditorDirtyChanges({
      draft: baseDraft,
      hasPendingImageFile: false,
      savedDraft: { ...baseDraft },
    });

    expect(isDirty).toBe(false);
    expect(canSaveRichfieldEditor({ isBusy: false, isDirty })).toBe(false);
  });

  test("marks edited fields and queued image files as dirty", () => {
    expect(
      hasRichfieldEditorDirtyChanges({
        draft: { ...baseDraft, title: "Mars · Wrigley Again" },
        hasPendingImageFile: false,
        savedDraft: baseDraft,
      }),
    ).toBe(true);

    expect(
      hasRichfieldEditorDirtyChanges({
        draft: baseDraft,
        hasPendingImageFile: true,
        savedDraft: baseDraft,
      }),
    ).toBe(true);
  });

  test("only allows save when the editor is dirty and idle", () => {
    expect(canSaveRichfieldEditor({ isBusy: false, isDirty: true })).toBe(true);
    expect(canSaveRichfieldEditor({ isBusy: true, isDirty: true })).toBe(false);
  });

  test("warns before closing dirty idle work and ignores close while busy", () => {
    expect(
      getRichfieldEditorCloseIntent({ isBusy: false, isDirty: false }),
    ).toBe("close");
    expect(getRichfieldEditorCloseIntent({ isBusy: false, isDirty: true })).toBe(
      "warn",
    );
    expect(getRichfieldEditorCloseIntent({ isBusy: true, isDirty: true })).toBe(
      "ignore",
    );
  });

  test("uses focused steps for each content type", () => {
    expect(
      getRichfieldEditorSteps({ collectionKey: "leadership", hasItem: true }),
    ).toEqual(["basics", "details", "writing", "danger"]);
    expect(
      getRichfieldEditorSteps({ collectionKey: "brands", hasItem: true }),
    ).toEqual(["basics", "details", "danger"]);
    expect(
      getRichfieldEditorSteps({ collectionKey: "milestones", hasItem: true }),
    ).toEqual(["basics", "details", "danger"]);
    expect(
      getRichfieldEditorSteps({ collectionKey: "milestones", hasItem: false }),
    ).toEqual(["basics", "details"]);
    expect(
      getRichfieldEditorSteps({ collectionKey: "contact-page", hasItem: true }),
    ).toEqual(["basics", "details", "writing", "danger"]);
    expect(
      getRichfieldEditorSteps({ collectionKey: "contact-submissions", hasItem: true }),
    ).toEqual(["basics", "details", "writing", "danger"]);
    expect(
      getRichfieldEditorSteps({ collectionKey: "jobs", hasItem: true }),
    ).toEqual(["basics", "details", "writing", "image", "danger"]);
    expect(
      getRichfieldEditorSteps({ collectionKey: "articles", hasItem: true }),
    ).toEqual(["basics", "details", "writing", "image", "danger"]);
    expect(
      getRichfieldEditorSteps({ collectionKey: "image-library", hasItem: true }),
    ).toEqual(["basics", "details", "image", "danger"]);
  });

  test("normalizes display dates for the native date picker", () => {
    expect(getRichfieldDateInputValue("Apr 27, 2024")).toBe("2024-04-27");
    expect(getRichfieldDateInputValue("June 13, 2026")).toBe("2026-06-13");
    expect(getRichfieldDateInputValue("not a date")).toBe("");
  });

  test("formats picked dates back to visitor-friendly copy", () => {
    expect(getRichfieldDisplayDateFromInput("2024-05-12")).toBe("May 12, 2024");
    expect(getRichfieldDisplayDateFromInput("2026-06-13")).toBe("Jun 13, 2026");
    expect(getRichfieldDisplayDateFromInput("2026-02-31")).toBe("");
  });

  test("builds preview links for collections with public pages", () => {
    expect(
      getRichfieldEditorPreviewHref({
        collectionKey: "brands",
        slug: "mars-wrigley",
      }),
    ).toBe("/brands");
    expect(
      getRichfieldEditorPreviewHref({
        collectionKey: "leadership",
        slug: "bill-chua",
      }),
    ).toBe("/about/our-story");
    expect(
      getRichfieldEditorPreviewHref({
        collectionKey: "milestones",
        slug: "1994-mars",
      }),
    ).toBe("/about/our-story");
    expect(
      getRichfieldEditorPreviewHref({
        collectionKey: "articles",
        slug: "market-access",
      }),
    ).toBe("/insights/market-access");
    expect(
      getRichfieldEditorPreviewHref({
        collectionKey: "jobs",
        slug: "sales-executive",
      }),
    ).toBe("/careers/sales-executive");
    expect(
      getRichfieldEditorPreviewHref({
        collectionKey: "contact-submissions",
        slug: "Bad Slug",
      }),
    ).toBeNull();
  });
});
