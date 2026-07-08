import type {
  RichfieldAdminCollectionKey,
  RichfieldContentStatus,
} from "@/lib/richfield-admin-content-model";

export type RichfieldAdminEditorDraft = {
  aboutOnly: boolean;
  accent: string;
  body: string;
  brand: string;
  category: string;
  country: string;
  credit: string;
  cta: string;
  deadline: string;
  email: string;
  emailNotificationStatus: string;
  feature: boolean;
  featureCaption: string;
  href: string;
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
  shelfWeight: string;
  title: string;
  usageTags: string;
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
  "body",
  "brand",
  "category",
  "country",
  "credit",
  "cta",
  "deadline",
  "email",
  "emailNotificationStatus",
  "feature",
  "featureCaption",
  "href",
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
  "shelfWeight",
  "title",
  "usageTags",
  "year",
];

const previewRouteByCollection: Partial<Record<RichfieldAdminCollectionKey, string>> =
  {
    brands: "/brands",
    "contact-channels": "/contact",
    "contact-page": "/contact",
    jobs: "/careers",
    leadership: "/about/our-story",
    milestones: "/about/our-story",
  };

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
  savedDraft,
}: {
  draft: RichfieldAdminEditorDraft;
  hasPendingImageFile: boolean;
  savedDraft: RichfieldAdminEditorDraft;
}) {
  return (
    hasPendingImageFile ||
    draftKeys.some((key) => draft[key] !== savedDraft[key])
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
    collectionKey === "contact-submissions"
  ) {
    steps.push("writing");
  }

  if (
    collectionKey === "image-library"
  ) {
    steps.push("image");
  }

  if (hasItem) {
    steps.push("danger");
  }

  return steps;
}
