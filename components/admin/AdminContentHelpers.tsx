"use client";

import type {
  RichfieldAdminCollectionKey,
  RichfieldAdminContentItem,
  RichfieldContentStatus,
} from "@/lib/richfield-admin-content-model";
import { getRichfieldGalleryPlacementLabel } from "@/lib/richfield-gallery";
import { RICHFIELD_ADMIN_COPY } from "./richfield-admin-copy";
import type { RichfieldAdminEditorDraft } from "./richfield-admin-editor-state";
import type { MutationResponse } from "./richfield-admin-save-progress";

/**
 * Shared editor helpers.
 *
 * Used by both the content list and the editor form, so they live apart from
 * either rather than being owned by one and reached into by the other.
 */

type Draft = RichfieldAdminEditorDraft;
export type { Draft };

export const sectionCopy: Record<
  RichfieldAdminCollectionKey,
  {
    empty: string;
    listTitle: string;
    newLabel: string;
    singular: string;
  }
> = {
  articles: {
    empty: RICHFIELD_ADMIN_COPY.empty.articles,
    listTitle: "News and updates",
    newLabel: RICHFIELD_ADMIN_COPY.actions.newArticle,
    singular: "story",
  },
  brands: {
    empty: RICHFIELD_ADMIN_COPY.empty.brands,
    listTitle: "Brands",
    newLabel: RICHFIELD_ADMIN_COPY.actions.newBrand,
    singular: "brand",
  },
  leadership: {
    empty: RICHFIELD_ADMIN_COPY.empty.leadership,
    listTitle: "Leadership",
    newLabel: RICHFIELD_ADMIN_COPY.actions.newLeader,
    singular: "leader",
  },
  milestones: {
    empty: RICHFIELD_ADMIN_COPY.empty.milestones,
    listTitle: "Milestones",
    newLabel: RICHFIELD_ADMIN_COPY.actions.newMilestone,
    singular: "milestone",
  },
  "contact-page": {
    empty: RICHFIELD_ADMIN_COPY.empty.contactPage,
    listTitle: "Contact page",
    newLabel: RICHFIELD_ADMIN_COPY.actions.newContactPage,
    singular: "contact page",
  },
  "contact-form": {
    empty: RICHFIELD_ADMIN_COPY.empty.contactForm,
    listTitle: "Contact form",
    newLabel: RICHFIELD_ADMIN_COPY.actions.newContactForm,
    singular: "form configuration",
  },
  "contact-channels": {
    empty: RICHFIELD_ADMIN_COPY.empty.contactChannels,
    listTitle: "Contact channels",
    newLabel: RICHFIELD_ADMIN_COPY.actions.newContactChannel,
    singular: "contact channel",
  },
  "contact-submissions": {
    empty: RICHFIELD_ADMIN_COPY.empty.contactSubmissions,
    listTitle: "Contact inbox",
    newLabel: RICHFIELD_ADMIN_COPY.actions.newContactSubmission,
    singular: "message",
  },
  jobs: {
    empty: RICHFIELD_ADMIN_COPY.empty.jobs,
    listTitle: "Jobs",
    newLabel: RICHFIELD_ADMIN_COPY.actions.newJob,
    singular: "job",
  },
  "image-library": {
    empty: RICHFIELD_ADMIN_COPY.empty.images,
    listTitle: "Gallery",
    newLabel: RICHFIELD_ADMIN_COPY.actions.newImage,
    singular: "image",
  },
};

export const statusOptions: Array<{ label: string; value: RichfieldContentStatus }> = [
  { label: RICHFIELD_ADMIN_COPY.visibility.draft, value: "draft" },
  { label: RICHFIELD_ADMIN_COPY.visibility.published, value: "published" },
  { label: RICHFIELD_ADMIN_COPY.visibility.archived, value: "archived" },
  { label: RICHFIELD_ADMIN_COPY.visibility.scheduled, value: "scheduled" },
];

export const categoryOptions: Array<{ label: string; value: string }> = [
  { label: "Food", value: "Food" },
  { label: "Beverages", value: "Beverages" },
  { label: "Non-Food", value: "Non-Food" },
];

export const contactKindOptions = [
  { label: "Office", value: "office" },
  { label: "Phone", value: "phone" },
  { label: "Email", value: "email" },
  { label: "Facebook", value: "facebook" },
];
export function statusLabel(status: RichfieldContentStatus) {
  return RICHFIELD_ADMIN_COPY.visibility[status];
}

export function statusClass(status: RichfieldContentStatus) {
  if (status === "published") {
    return "border-[rgba(31,107,115,0.32)] bg-[rgba(31,107,115,0.1)] text-[var(--teal)]";
  }

  if (status === "archived") {
    return "border-[rgba(89,73,90,0.28)] bg-[rgba(89,73,90,0.08)] text-[var(--ink-soft)]";
  }

  if (status === "scheduled") {
    return "border-[rgba(217,167,91,0.45)] bg-[rgba(217,167,91,0.14)] text-[var(--copper-dark)]";
  }

  return "border-[rgba(184,112,81,0.34)] bg-[rgba(184,112,81,0.1)] text-[var(--clay)]";
}

export function draftFromItem(item: RichfieldAdminContentItem | null): Draft {
  return {
    aboutOnly: item?.aboutOnly ?? false,
    accent: item?.accent ?? "",
    applyEmail: item?.applyEmail ?? "",
    author: item?.author ?? "",
    body: item?.body ?? "",
    brand: item?.brand ?? "",
    category: item?.category ?? "",
    country: item?.country ?? "",
    credit: item?.credit ?? "",
    cta: item?.cta ?? "",
    deadline: item?.deadline ?? "",
    department: item?.department ?? "",
    email: item?.email ?? "",
    emailNotificationStatus: item?.emailNotificationStatus ?? "",
    employmentType: item?.employmentType ?? "",
    feature: item?.feature ?? false,
    featureCaption: item?.featureCaption ?? "",
    href: item?.href ?? "",
    imageAlt: item?.imageAlt ?? "",
    inquiryType: item?.inquiryType ?? "",
    kind: item?.kind ?? "",
    location: item?.location ?? "",
    mapQuery: item?.mapQuery ?? "",
    name: item?.name ?? "",
    objectPosition: item?.objectPosition ?? "",
    pageSection: item?.pageSection ?? "",
    placement: item?.placement ?? "",
    positions: item?.positions ?? "",
    productName: item?.productName ?? "",
    publishedAt: item?.publishedAt ?? "",
    ratio: item?.ratio ?? "",
    receivedAt: item?.receivedAt ?? "",
    removeImage: false,
    role: item?.role ?? "",
    slug: item?.slug ?? "",
    sortOrder: item?.sortOrder ?? "",
    status: item?.status ?? "draft",
    submissionStatus: item?.submissionStatus ?? "",
    subtitle: item?.subtitle ?? "",
    summary: item?.summary ?? "",
    shelfWeight: item?.shelfWeight ?? "",
    title: item?.title ?? "",
    usageTags: item?.usageTags ?? "",
    workMode: item?.workMode ?? "",
    year: item?.year ?? "",
  };
}

export function draftWithPreset(
  item: RichfieldAdminContentItem | null,
  preset?: Partial<Draft>,
) {
  return { ...draftFromItem(item), ...preset };
}

export function readFriendlyError(payload: MutationResponse, fallback: string) {
  return Object.values(payload.errors ?? {})[0] ?? fallback;
}

export function contentItemMetaLabel(
  collectionKey: RichfieldAdminCollectionKey,
  item: RichfieldAdminContentItem,
) {
  if (collectionKey === "brands") return item.category || "Brand";
  if (collectionKey === "articles") return item.category || "Insight";
  if (collectionKey === "leadership") return item.role || "Leader";
  if (collectionKey === "contact-page") return "Contact page";
  if (collectionKey === "contact-channels") return item.kind || "Channel";
  if (collectionKey === "contact-submissions") return item.email || "Message";
  if (collectionKey === "jobs") return item.location || "Job";
  if (collectionKey === "image-library") {
    return `${item.pageSection || "Gallery"} · ${getRichfieldGalleryPlacementLabel(item.placement)}`;
  }
  return item.country || "Milestone";
}

export function collectionSupportsImage(collectionKey: RichfieldAdminCollectionKey) {
  return (
    collectionKey === "image-library" ||
    collectionKey === "articles" ||
    collectionKey === "jobs"
  );
}

/**
 * Card thumbnail.
 *
 * Logos are contained rather than cropped. `bg-cover` fills the tile by
 * overflowing the shorter axis, which for a wide wordmark in a narrow portrait
 * tile meant a zoomed fragment — Mars \u00b7 Wrigley read as "ARS RIGL" and BiC
 * as a single letter. Photographs still crop, because for them filling the
 * frame is the point.
 *
 * bg-no-repeat matters once the image no longer covers: the CSS default would
 * tile the leftover space.
 */
export function ContentCardCover({
  collectionKey,
  item,
}: {
  collectionKey?: RichfieldAdminCollectionKey;
  item: RichfieldAdminContentItem;
}) {
  const isLogo = collectionKey === "brands";

  return (
    <span
      className={`relative block min-h-28 overflow-hidden border border-[rgba(184,112,81,0.34)] bg-[rgba(239,207,178,0.55)] bg-center bg-no-repeat ${
        isLogo ? "bg-contain" : "bg-cover"
      } ${item.imageUrl ? "" : "grid place-items-center"}`}
      style={
        item.imageUrl
          ? {
              backgroundImage: `url(${JSON.stringify(item.imageUrl)})`,
            }
          : undefined
      }
    >
      {item.imageUrl ? (
        <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,31,52,0.02),rgba(12,31,52,0.12))]" />
      ) : (
        <span className="px-3 text-center text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--ink-soft)]">
          No cover
        </span>
      )}
    </span>
  );
}

export function toWebpFileName(name: string) {
  const base = name.replace(/\.[^./\\]+$/u, "");
  return `${base || "image"}.webp`;
}

export const MAX_ADMIN_IMAGE_UPLOAD_BYTES = 12 * 1024 * 1024;

// Convert an uploaded raster image to WebP in the browser before it is sent to
// the platform, so stored gallery assets stay small. Vector and animated
// formats are left untouched (rasterizing an SVG logo or flattening a GIF would
// lose quality or motion), and we keep the original whenever WebP is not
// actually smaller.
export async function convertImageToWebp(file: File): Promise<File> {
  if (
    file.type === "image/svg+xml" ||
    file.type === "image/gif" ||
    file.type === "image/webp"
  ) {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file, {
      imageOrientation: "from-image",
    });
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const context = canvas.getContext("2d");

    if (!context) {
      bitmap.close();
      return file;
    }

    context.drawImage(bitmap, 0, 0);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((result) => resolve(result), "image/webp", 0.9);
    });

    if (!blob || blob.size >= file.size) {
      return file;
    }

    return new File([blob], toWebpFileName(file.name), { type: "image/webp" });
  } catch {
    return file;
  }
}

export function EditorCoverSummary({
  draft,
  imageFileLabel,
  item,
}: {
  draft: Draft;
  imageFileLabel: string;
  item: RichfieldAdminContentItem | null;
}) {
  const hasVisibleCover = Boolean(item?.imageUrl && !draft.removeImage);
  const status = imageFileLabel
    ? "New cover selected"
    : hasVisibleCover
      ? "Current cover"
      : draft.removeImage
        ? "Cover will be removed"
        : "No cover yet";

  return (
    <aside className="grid min-w-0 gap-2 rounded-xl border border-admin-rule bg-admin-surface p-2.5">
      <span className={`relative block aspect-[16/10] min-h-28 overflow-hidden rounded-lg bg-admin-parchment ${
        hasVisibleCover ? "" : "grid place-items-center border border-dashed border-admin-rule"
      }`}>
        {hasVisibleCover ? (
          <>
            {/* The linked CMS asset is shown directly here instead of a CSS
                background, so failures have image semantics and useful alt
                text while remote/public URLs remain supported. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={draft.imageAlt || item?.title || "Cover preview"}
              className="h-full w-full object-cover"
              src={item?.imageUrl ?? undefined}
              style={{ objectPosition: draft.objectPosition?.trim() || "center" }}
            />
            <span className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(12,31,52,0.12))]" />
          </>
        ) : (
          <span className="px-3 text-center text-xs font-semibold text-admin-ink-soft">
            Cover preview
          </span>
        )}
      </span>
      <span className="truncate px-1 text-xs font-semibold text-admin-ink-soft">
        {status}
      </span>
      {imageFileLabel ? (
        <span className="truncate text-xs text-[var(--ink-soft)]">
          {imageFileLabel}
        </span>
      ) : null}
    </aside>
  );
}
