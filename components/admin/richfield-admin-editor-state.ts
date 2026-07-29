import type {
  RichfieldAdminCollectionKey,
  RichfieldContentStatus,
} from "@/lib/richfield-admin-content-model";
import {
  parseRichfieldJSONContent,
  richfieldContentFromStoredValue,
} from "@/lib/richfield-rich-text";

export type RichfieldAdminEditorDraft = {
  aboutOnly: boolean;
  accent: string;
  applyEmail: string;
  author: string;
  body: string;
  bodyContent: string;
  brand: string;
  category: string;
  country: string;
  credit: string;
  cta: string;
  deadline: string;
  department: string;
  email: string;
  emailNotificationStatus: string;
  employmentType: string;
  feature: boolean;
  featureCaption: string;
  href: string;
  gallery: string;
  imageAlt: string;
  inquiryType: string;
  kind: string;
  location: string;
  mapQuery: string;
  name: string;
  objectPosition: string;
  pageSection: string;
  placement: string;
  positions: string;
  productName: string;
  publishedAt: string;
  ratio: string;
  receivedAt: string;
  removeImage: boolean;
  role: string;
  slug: string;
  sortOrder: string;
  status: RichfieldContentStatus;
  submissionStatus: string;
  subtitle: string;
  summary: string;
  summaryContent: string;
  shelfWeight: string;
  title: string;
  usageTags: string;
  workMode: string;
  year: string;
};

export type RichfieldEditorCloseIntent = "close" | "ignore" | "warn";
export type RichfieldEditorStepId =
  | "basics"
  | "danger"
  | "details"
  | "image"
  | "writing";

const draftKeys: Array<keyof RichfieldAdminEditorDraft> = [
  "aboutOnly",
  "accent",
  "applyEmail",
  "author",
  "body",
  "bodyContent",
  "brand",
  "category",
  "country",
  "credit",
  "cta",
  "deadline",
  "department",
  "email",
  "emailNotificationStatus",
  "employmentType",
  "feature",
  "featureCaption",
  "href",
  "gallery",
  "imageAlt",
  "inquiryType",
  "kind",
  "location",
  "mapQuery",
  "name",
  "objectPosition",
  "pageSection",
  "placement",
  "positions",
  "productName",
  "publishedAt",
  "ratio",
  "receivedAt",
  "removeImage",
  "role",
  "slug",
  "sortOrder",
  "status",
  "submissionStatus",
  "subtitle",
  "summary",
  "summaryContent",
  "shelfWeight",
  "title",
  "usageTags",
  "workMode",
  "year",
];

const derivedRichTextKeys = new Set<keyof RichfieldAdminEditorDraft>([
  "body",
  "bodyContent",
  "summary",
  "summaryContent",
]);

function isEmptyParagraph(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const node = value as { content?: unknown[]; type?: string };
  return node.type === "paragraph" && (!node.content || node.content.length === 0);
}

function canonicalRichTextValue(structured: string, markdown: string) {
  const parsed = parseRichfieldJSONContent(
    richfieldContentFromStoredValue(structured, markdown),
  );

  if (!parsed) return "";

  const content = [...(parsed.content ?? [])];
  while (content.length > 0 && isEmptyParagraph(content.at(-1))) {
    content.pop();
  }

  return JSON.stringify({ ...parsed, content });
}

function hasRichTextChanges(
  draft: RichfieldAdminEditorDraft,
  savedDraft: RichfieldAdminEditorDraft,
) {
  return (
    canonicalRichTextValue(draft.bodyContent, draft.body) !==
      canonicalRichTextValue(savedDraft.bodyContent, savedDraft.body) ||
    canonicalRichTextValue(draft.summaryContent, draft.summary) !==
      canonicalRichTextValue(
        savedDraft.summaryContent,
        savedDraft.summary,
      )
  );
}

const previewRouteByCollection: Partial<Record<RichfieldAdminCollectionKey, string>> =
  {
    articles: "/insights/:slug",
    brands: "/brands",
    "contact-channels": "/contact",
    "contact-form": "/contact",
    "contact-page": "/contact",
    jobs: "/careers/:slug",
    leadership: "/about/our-story",
    milestones: "/about/our-story",
  };

export function getRichfieldEditorPageLinkPrefix(
  collectionKey: RichfieldAdminCollectionKey,
) {
  const route = previewRouteByCollection[collectionKey];

  if (!route?.includes(":slug")) {
    return null;
  }

  return route.slice(0, route.indexOf(":slug"));
}

function formatDatePart(value: number) {
  return String(value).padStart(2, "0");
}

function parseDateParts(value: string) {
  const trimmed = value.trim();

  if (!trimmed) return null;

  const inputMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);

  if (inputMatch) {
    const year = Number(inputMatch[1]);
    const month = Number(inputMatch[2]);
    const day = Number(inputMatch[3]);
    const date = new Date(year, month - 1, day);

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }

    return { day, month, year };
  }

  const date = new Date(trimmed);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return {
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  };
}

export function getRichfieldDateInputValue(displayDate: string) {
  const parts = parseDateParts(displayDate);

  if (!parts) return "";

  return `${parts.year}-${formatDatePart(parts.month)}-${formatDatePart(parts.day)}`;
}

export function getRichfieldDisplayDateFromInput(inputDate: string) {
  const parts = parseDateParts(inputDate);

  if (!parts) return "";

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(parts.year, parts.month - 1, parts.day));
}

export function getRichfieldEditorPreviewHref({
  collectionKey,
  slug,
}: {
  collectionKey: RichfieldAdminCollectionKey;
  slug: string;
}) {
  const basePath = previewRouteByCollection[collectionKey];
  const safeSlug = slug.trim();

  if (!basePath) {
    return null;
  }

  if (!basePath.includes(":slug")) {
    return basePath;
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(safeSlug)) {
    return null;
  }

  return basePath.replace(":slug", safeSlug);
}

export function hasRichfieldEditorDirtyChanges({
  draft,
  hasPendingImageFile,
  sourceModeDirty = false,
  savedDraft,
}: {
  draft: RichfieldAdminEditorDraft;
  hasPendingImageFile: boolean;
  sourceModeDirty?: boolean;
  savedDraft: RichfieldAdminEditorDraft;
}) {
  return (
    hasPendingImageFile ||
    sourceModeDirty ||
    hasRichTextChanges(draft, savedDraft) ||
    draftKeys.some(
      (key) =>
        !derivedRichTextKeys.has(key) && draft[key] !== savedDraft[key],
    )
  );
}

export function canSaveRichfieldEditor({
  isBusy,
  isDirty,
}: {
  isBusy: boolean;
  isDirty: boolean;
}) {
  return isDirty && !isBusy;
}

export function getRichfieldEditorCloseIntent({
  isBusy,
  isDirty,
}: {
  isBusy: boolean;
  isDirty: boolean;
}): RichfieldEditorCloseIntent {
  if (isBusy) return "ignore";
  return isDirty ? "warn" : "close";
}

export function getRichfieldEditorSteps({
  collectionKey,
  hasItem,
}: {
  collectionKey: RichfieldAdminCollectionKey;
  hasItem: boolean;
}): RichfieldEditorStepId[] {
  const steps: RichfieldEditorStepId[] = ["basics", "details"];

  if (
    collectionKey === "leadership" ||
    collectionKey === "contact-page" ||
    collectionKey === "contact-form" ||
    collectionKey === "contact-submissions" ||
    collectionKey === "articles" ||
    collectionKey === "jobs"
  ) {
    steps.push("writing");
  }

  if (
    collectionKey === "image-library" ||
    collectionKey === "articles" ||
    collectionKey === "jobs" ||
    collectionKey === "brands" ||
    collectionKey === "leadership" ||
    collectionKey === "contact-page"
  ) {
    steps.push("image");
  }

  if (hasItem) {
    steps.push("danger");
  }

  return steps;
}
