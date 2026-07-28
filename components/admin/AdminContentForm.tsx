"use client";

import {
  ArrowClockwise,
  Eye,
  FloppyDisk,
  LinkSimple,
  Trash,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
} from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type {
  RichfieldAdminCollectionKey,
  RichfieldAdminContentItem,
} from "@/lib/richfield-admin-content-model";
import {
  normalizeRichfieldSlugInput,
  slugifyRichfieldContent,
} from "@/lib/richfield-admin-content-model";
import {
  CheckboxField,
  EditorStepHeader,
  NumberField,
  SelectField,
  TextAreaField,
  TextField,
} from "./AdminFormFields";
import {
  categoryOptions,
  convertImageToWebp,
  MAX_ADMIN_IMAGE_UPLOAD_BYTES,
  collectionSupportsImage,
  contactKindOptions,
  draftFromItem,
  draftWithPreset,
  EditorCoverSummary,
  readFriendlyError,
  statusOptions,
  type Draft,
} from "./AdminContentHelpers";
import { RichTextEditor } from "./RichTextEditor";
import { ArticleGalleryEditor } from "./ArticleGalleryEditor";
import { adminFetch } from "./richfield-admin-session-client";
import {
  canSaveRichfieldEditor,
  getRichfieldEditorPreviewHref,
  getRichfieldEditorSteps,
  hasRichfieldEditorDirtyChanges,
} from "./richfield-admin-editor-state";
import {
  readContentSaveResponse,
  SaveProgressPanel,
  type MutationResponse,
  type SaveFlowError,
  type SaveProgressState,
} from "./richfield-admin-save-progress";

/**
 * The content editor.
 *
 * The single largest thing the dashboard did, and the reason the file stayed
 * far past any readable size: every section renders its editor through here.
 */
export function ContentForm({
  collectionKey,
  contentLocale = "en",
  initialDraft,
  item,
  onClose,
  onCloseRequest,
  onBusyChange,
  onDeleted,
  onDirtyChange,
  onSaved,
}: {
  collectionKey: RichfieldAdminCollectionKey;
  contentLocale?: "en" | "vi";
  initialDraft?: Partial<Draft>;
  item: RichfieldAdminContentItem | null;
  onClose: () => void;
  onCloseRequest: () => void;
  onBusyChange: (isBusy: boolean) => void;
  onDeleted: (items: RichfieldAdminContentItem[]) => void;
  onDirtyChange: (isDirty: boolean) => void;
  onSaved: (
    items: RichfieldAdminContentItem[],
    item: RichfieldAdminContentItem | null,
  ) => void;
}) {
  const t = useTranslations("admin.form");
  const itemName = t(`itemNames.${collectionKey}`);
  const [savedItem, setSavedItem] = useState<RichfieldAdminContentItem | null>(
    null,
  );
  const effectiveItem = savedItem ?? item;
  const [draft, setDraft] = useState(() => draftWithPreset(item, initialDraft));
  const [slugIsAutomatic, setSlugIsAutomatic] = useState(() => {
    if (!item) return true;
    const englishTitle =
      item.englishTitle || (contentLocale === "en" ? item.title : "");
    const suggestedSlug = slugifyRichfieldContent(englishTitle, "");
    return Boolean(suggestedSlug && item.slug === suggestedSlug);
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFileLabel, setImageFileLabel] = useState("");
  const [imageDragActive, setImageDragActive] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageProcessing, setImageProcessing] = useState(false);
  const [sourceModeDirty, setSourceModeDirty] = useState(false);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [saveProgress, setSaveProgress] = useState<SaveProgressState>({
    label: "",
    percent: 0,
    status: "idle",
  });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const savedDraft = draftFromItem(effectiveItem);
  const isBusy = submitting || deleting;
  const supportsImage = collectionSupportsImage(collectionKey);
  // Gallery images are managed as fixed slots: admins may only replace the
  // image file or remove the entry. Everything else in the wizard is hidden.
  const imageOnly = collectionKey === "image-library";
  const previewImageSrc =
    imagePreviewUrl ??
    (effectiveItem?.imageUrl && !draft.removeImage
      ? effectiveItem.imageUrl
      : null);
  const showImagePreview = Boolean(previewImageSrc);
  const editorSteps = getRichfieldEditorSteps({
    collectionKey,
    hasItem: Boolean(effectiveItem),
  });
  const editorStepKey = editorSteps.join(",");
  const [activeStep, setActiveStep] = useState(editorSteps[0] ?? "basics");
  const sectionSurfaceClass =
    "grid scroll-mt-52 gap-5 rounded-xl border border-admin-rule bg-admin-panel p-5 shadow-sm sm:p-6";
  const isDirty = hasRichfieldEditorDirtyChanges({
    draft,
    hasPendingImageFile: Boolean(imageFile),
    savedDraft,
    sourceModeDirty,
  });
  const canSave =
    canSaveRichfieldEditor({ isBusy, isDirty }) && !sourceModeDirty;
  const previewHref = effectiveItem
    ? getRichfieldEditorPreviewHref({
        collectionKey,
        slug: effectiveItem.slug,
      })
    : null;
  const englishTitleForSlug =
    contentLocale === "en"
      ? draft.title
      : (effectiveItem?.englishTitle ?? "");
  const suggestedSlug = slugifyRichfieldContent(englishTitleForSlug, "");
  const draftPreviewPath =
    getRichfieldEditorPreviewHref({
      collectionKey,
      slug: draft.slug,
    }) ?? (draft.slug ? `/${draft.slug}` : "/…");
  useEffect(() => {
    onBusyChange(isBusy);
  }, [isBusy, onBusyChange]);

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    const sections = editorSteps
      .map((step) => document.getElementById(`editor-${step}`))
      .filter((section): section is HTMLElement => Boolean(section));

    if (sections.length === 0) return;

    let animationFrame = 0;
    const syncActiveStep = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        const railOffset = window.innerWidth >= 1024 ? 175 : 165;
        const closest = sections
          .map((section) => ({
            distance: Math.abs(
              section.getBoundingClientRect().top - railOffset,
            ),
            step: section.id.replace("editor-", ""),
          }))
          .sort((a, b) => a.distance - b.distance)[0]?.step;

        if (closest && editorSteps.includes(closest as typeof activeStep)) {
          setActiveStep(closest as typeof activeStep);
        }
      });
    };

    syncActiveStep();
    window.addEventListener("resize", syncActiveStep);
    window.addEventListener("scroll", syncActiveStep, { passive: true });
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", syncActiveStep);
      window.removeEventListener("scroll", syncActiveStep);
    };
    // editorStepKey is the stable representation of this route's sections.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorStepKey]);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  const updateDraft = (name: keyof Draft, value: string | boolean) => {
    setDraft((current) => {
      const next = { ...current, [name]: value };

      if (
        name === "title" &&
        typeof value === "string" &&
        contentLocale === "en" &&
        slugIsAutomatic
      ) {
        next.slug = slugifyRichfieldContent(value, "");
      }

      return next;
    });
  };

  const updateRichText = (
    markdownKey: "body" | "summary",
    contentKey: "bodyContent" | "summaryContent",
    markdown: string,
    structuredValue: string,
  ) => {
    setDraft((current) => ({
      ...current,
      [contentKey]: structuredValue,
      [markdownKey]: markdown,
    }));
  };

  const applyImageFile = async (file: File | null) => {
    if (!file) {
      setImageFile(null);
      setImageFileLabel("");
      setSourceModeDirty(false);
      setImagePreviewUrl((previous) => {
        if (previous) URL.revokeObjectURL(previous);
        return null;
      });
      return;
    }

    if (file.size > MAX_ADMIN_IMAGE_UPLOAD_BYTES) {
      setMessage(t("imageTooLarge"));
      return;
    }

    setImageProcessing(true);
    const optimized = await convertImageToWebp(file);
    setImageProcessing(false);

    setImageFile(optimized);
    setImageFileLabel(
      `${optimized.name} (${Math.round(optimized.size / 1024)} KB)`,
    );
    setImagePreviewUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return URL.createObjectURL(optimized);
    });
    setDraft((current) => ({ ...current, removeImage: false }));
  };

  const updateImageFile = (event: ChangeEvent<HTMLInputElement>) => {
    void applyImageFile(event.currentTarget.files?.[0] ?? null);
  };

  const handleImageDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setImageDragActive(false);
    if (isBusy || imageProcessing) return;

    const file = Array.from(event.dataTransfer.files).find((candidate) =>
      candidate.type.startsWith("image/"),
    );
    if (file) {
      void applyImageFile(file);
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSave || imageProcessing || sourceModeDirty) {
      if (sourceModeDirty) toast.error(t("applySourceBeforeSaving"));
      return;
    }

    setSubmitting(true);
    setFieldErrors({});
    setMessage(null);
    setSaveProgress({
      label: t("checkingContent"),
      percent: 2,
      status: "running",
      step: "validate",
    });

    const body = new FormData();
    body.set("locale", contentLocale);
    for (const [key, value] of Object.entries(draft)) {
      body.set(key, typeof value === "boolean" ? String(value) : value);
    }

    if (imageFile) {
      body.set("imageFile", imageFile);
    }

    try {
      const response = await adminFetch(
        effectiveItem
          ? `/api/admin/content/${collectionKey}/${encodeURIComponent(effectiveItem.id)}`
          : `/api/admin/content/${collectionKey}`,
        {
          body,
          method: effectiveItem ? "PATCH" : "POST",
        },
      );
      const payload = await readContentSaveResponse({
        response,
        setSaveProgress,
      });

      onSaved(payload.items ?? [], payload.item ?? null);
      setSavedItem(payload.item ?? effectiveItem ?? null);
      setImageFile(null);
      setImageFileLabel("");
      setConfirmDelete(false);

      if (payload.item) {
        setDraft(draftFromItem(payload.item));
        const savedEnglishTitle =
          payload.item.englishTitle ||
          (contentLocale === "en" ? payload.item.title : "");
        const savedSuggestedSlug = slugifyRichfieldContent(
          savedEnglishTitle,
          "",
        );
        setSlugIsAutomatic(
          Boolean(
            savedSuggestedSlug && payload.item.slug === savedSuggestedSlug,
          ),
        );
      } else {
        setDraft((current) => ({ ...current, removeImage: false }));
      }

      setSaveProgress({
        label: "",
        percent: 0,
        status: "idle",
      });
      toast.success(t("saved"));
    } catch (error) {
      const saveError = error as SaveFlowError;
      const fallback =
        saveError instanceof Error
          ? saveError.message
          : t("saveError");
      setFieldErrors(saveError.errors ?? {});
      setSaveProgress((current) => ({
        error: readFriendlyError(
          { error: fallback, errors: saveError.errors },
          t("saveError"),
        ),
        label: saveError.label ?? current.label ?? t("saveFailed"),
        percent: Math.max(current.percent, 1),
        status: "error",
        statusCode: saveError.statusCode,
        step: saveError.step ?? current.step,
      }));
      toast.error(t("saveError"));
    } finally {
      setSubmitting(false);
    }
  };

  const deleteItem = async () => {
    if (!effectiveItem) return;

    setDeleting(true);
    setMessage(null);

    try {
      const response = await adminFetch(
        `/api/admin/content/${collectionKey}/${encodeURIComponent(effectiveItem.id)}`,
        {
          method: "DELETE",
        },
      );
      const payload = (await response
        .json()
        .catch(() => ({}))) as MutationResponse;

      if (!response.ok) {
        setMessage(t("deleteError"));
        return;
      }

      onDeleted(payload.items ?? []);
      onClose();
    } catch {
      setMessage(t("deleteError"));
    } finally {
      setDeleting(false);
    }
  };

  if (imageOnly) {
    return (
      <form className="grid min-w-0 gap-5" onSubmit={submit}>
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[rgba(184,112,81,0.28)] pb-4">
          <div className="min-w-0">
            <p className="script-label">
              {effectiveItem
                ? t("editImage")
                : t("createItem", { item: itemName })}
            </p>
            <h2 className="break-words font-display text-3xl leading-none text-[var(--navy)] sm:text-4xl">
              {draft.title || t("untitledItem", { item: itemName })}
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {previewHref ? (
              <Link
                className="button-secondary"
                href={previewHref}
                rel="noreferrer"
                target="_blank"
              >
                {t("openPreview")}
              </Link>
            ) : null}
            <button
              className="button-secondary disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isBusy}
              onClick={onCloseRequest}
              type="button"
            >
              {t("close")}
            </button>
            <button
              className="button-primary disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!canSave || imageProcessing}
              type="submit"
            >
              {submitting ? t("saving") : t("save")}
            </button>
          </div>
        </div>

        {saveProgress.status === "running" || saveProgress.status === "error" ? (
          <SaveProgressPanel state={saveProgress} />
        ) : null}

        {message ? (
          <div className="border border-[rgba(184,112,81,0.34)] bg-white/68 px-4 py-3 text-sm text-[var(--ink-soft)]">
            {message}
          </div>
        ) : null}

        <div
          aria-label={t("replaceImage")}
          className={`group relative aspect-[16/10] w-full overflow-hidden border-2 border-dashed transition ${
            imageDragActive
              ? "border-[var(--gold)]"
              : "border-[rgba(184,112,81,0.5)] hover:border-[var(--copper)]"
          } ${
            isBusy || imageProcessing
              ? "cursor-not-allowed opacity-70"
              : "cursor-pointer"
          }`}
          onClick={() => {
            if (!isBusy && !imageProcessing) imageInputRef.current?.click();
          }}
          onDragLeave={() => setImageDragActive(false)}
          onDragOver={(event) => {
            event.preventDefault();
            if (!isBusy && !imageProcessing) setImageDragActive(true);
          }}
          onDrop={handleImageDrop}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              if (!isBusy && !imageProcessing) imageInputRef.current?.click();
            }
          }}
          role="button"
          tabIndex={0}
        >
          {showImagePreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={draft.imageAlt || effectiveItem?.title || t("image")}
              className="h-full w-full object-cover"
              src={previewImageSrc as string}
              style={{ objectPosition: draft.objectPosition?.trim() || "center" }}
            />
          ) : (
            <div className="grid h-full place-items-center px-4 text-center text-sm text-[var(--ink-soft)]">
              {t("noImage")}
            </div>
          )}
          {imageFile ? (
            <span className="absolute left-3 top-3 border border-[var(--gold)] bg-[var(--navy)] px-2 py-1 text-[0.6rem] font-black uppercase tracking-[0.14em] text-[var(--parchment)]">
              {t("new")}
            </span>
          ) : null}
          <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 bg-[rgba(12,31,52,0.74)] px-3 py-2 text-xs text-[var(--parchment)]">
            <span className="font-bold">
              {imageProcessing
                ? t("optimizing")
                : showImagePreview
                  ? t("dragReplace")
                  : t("dragAdd")}
            </span>
            <span className="opacity-80">{t("imageLimit")}</span>
          </div>
        </div>
        <input
          accept="image/*"
          className="hidden"
          disabled={isBusy}
          name="imageFile"
          onChange={updateImageFile}
          ref={imageInputRef}
          type="file"
        />
        {imageFileLabel ? (
          <span className="-mt-2 truncate text-xs font-bold text-[var(--navy)]">
            {imageFileLabel}
          </span>
        ) : null}
        {fieldErrors.imageFile ? (
          <span className="-mt-2 text-xs text-red-700">
            {fieldErrors.imageFile}
          </span>
        ) : null}

        {effectiveItem ? (
          confirmDelete ? (
            <div className="flex flex-wrap items-center gap-3 border border-red-300 bg-red-500/10 px-3 py-2 text-sm text-red-800">
              <span>{t("removeConfirm", { title: effectiveItem.title })}</span>
              <div className="flex gap-2">
                <button
                  className="min-h-9 bg-red-800 px-3 text-sm font-bold text-white disabled:opacity-50"
                  disabled={isBusy}
                  onClick={() => void deleteItem()}
                  type="button"
                >
                  {deleting ? t("removing") : t("delete")}
                </button>
                <button
                  className="button-secondary min-h-9"
                  disabled={isBusy}
                  onClick={() => setConfirmDelete(false)}
                  type="button"
                >
                  {t("keep")}
                </button>
              </div>
            </div>
          ) : (
            <button
              className="justify-self-start text-sm font-bold text-red-800 underline decoration-red-800/25 underline-offset-4 disabled:opacity-50"
              disabled={isBusy}
              onClick={() => setConfirmDelete(true)}
              type="button"
            >
              {t("removeImage")}
            </button>
          )
        ) : null}
      </form>
    );
  }

  return (
    <form className="grid min-w-0 gap-5 pb-24" onSubmit={submit}>
      <div className="flex flex-col gap-4 border-b border-admin-rule pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="script-label">
            {effectiveItem
              ? t("editItem", { item: itemName })
              : t("createItem", { item: itemName })}
          </p>
          <h2 className="mt-2 max-w-4xl break-words font-display text-3xl leading-[1.06] tracking-[-0.025em] text-admin-ink sm:text-4xl lg:text-[2.65rem]">
            {draft.title || t("untitledItem", { item: itemName })}
          </h2>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-admin-ink-soft">
            <Badge variant="outline">{t(`statuses.${draft.status}`)}</Badge>
            <span aria-hidden>·</span>
            <span>{contentLocale === "vi" ? "Tiếng Việt" : "English"}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {previewHref ? (
            <Button
              render={
                <Link
                  href={previewHref}
                  rel="noreferrer"
                  target="_blank"
                />
              }
              size="lg"
              variant="outline"
            >
              <Eye aria-hidden data-icon="inline-start" />
              {t("openPreview")}
            </Button>
          ) : null}
          <Button
            disabled={!canSave || imageProcessing}
            size="lg"
            type="submit"
          >
            <FloppyDisk aria-hidden data-icon="inline-start" />
            {submitting ? t("saving") : t("save")}
          </Button>
        </div>
      </div>

      {saveProgress.status === "running" || saveProgress.status === "error" ? (
        <SaveProgressPanel state={saveProgress} />
      ) : null}

      {message ? (
        <div className="border border-[rgba(184,112,81,0.34)] bg-white/68 px-4 py-3 text-sm text-[var(--ink-soft)]">
          {message}
        </div>
      ) : null}

      <nav
        aria-label={t("editorSections")}
        className="sticky top-[8.15rem] z-10 -mx-1 flex gap-2 overflow-x-auto rounded-xl border border-admin-rule bg-admin-parchment/95 p-2 shadow-sm backdrop-blur-xl"
      >
        {editorSteps.map((step, index) => (
            <a
              aria-current={activeStep === step ? "step" : undefined}
              className={`group flex min-w-max items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                activeStep === step
                  ? "border-admin-navy bg-admin-navy text-white shadow-sm"
                  : "border-transparent text-admin-ink-soft hover:border-admin-rule hover:bg-admin-surface hover:text-admin-ink"
              }`}
              href={`#editor-${step}`}
              key={step}
              onClick={() => setActiveStep(step)}
              title={t(`steps.${step}.description`)}
            >
              <span
                aria-hidden
                className={`grid size-5 place-items-center rounded-full text-[10px] font-black ${
                  activeStep === step
                    ? "bg-white/15 text-white"
                    : "bg-admin-surface text-admin-ink-soft group-hover:bg-admin-panel group-hover:text-admin-ink"
                }`}
              >
                {index + 1}
              </span>
              {t(`steps.${step}.label`)}
            </a>
          ))}
      </nav>

      <div className="grid min-w-0 gap-8 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="grid min-w-0 gap-6">
      {editorSteps.includes("basics") ? (
        <section className={sectionSurfaceClass} id="editor-basics">
          <EditorStepHeader step="basics" />
          <div className="grid gap-4">
            <TextField
              disabled={isBusy}
              error={fieldErrors.title}
              label={collectionKey === "milestones" ? t("fields.brand") : t("fields.name")}
              name="title"
              onChange={updateDraft}
              required
              value={draft.title}
            />
          </div>
        </section>
      ) : null}

      {editorSteps.includes("details") ? (
        <section className={sectionSurfaceClass} id="editor-details">
          <EditorStepHeader step="details" />
          {collectionKey === "articles" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                disabled={isBusy}
                label={t("fields.author")}
                name="author"
                onChange={updateDraft}
                value={draft.author}
              />
              <TextField
                disabled={isBusy}
                label={t("fields.topic")}
                name="category"
                onChange={updateDraft}
                value={draft.category}
              />
              <TextField
                disabled={isBusy}
                label={t("fields.publishDate")}
                name="publishedAt"
                onChange={updateDraft}
                placeholder="2026-07-23"
                value={draft.publishedAt}
              />
              <NumberField
                disabled={isBusy}
                label={t("fields.sortOrder")}
                name="sortOrder"
                onChange={updateDraft}
                value={draft.sortOrder}
              />
              <CheckboxField
                description={t("descriptions.pinStory")}
                disabled={isBusy}
                label={t("fields.featuredStory")}
                name="feature"
                onChange={updateDraft}
                value={draft.feature}
              />
            </div>
          ) : null}
          {collectionKey === "brands" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <SelectField
                disabled={isBusy}
                label={t("fields.category")}
                name="category"
                onChange={updateDraft}
                options={categoryOptions.map((option) => ({
                  label: t(`categories.${option.value}`),
                  value: option.value,
                }))}
                placeholder={t("placeholders.category")}
                value={draft.category}
              />
              <TextField
                disabled={isBusy}
                label={t("fields.country")}
                name="country"
                onChange={updateDraft}
                value={draft.country}
              />
              <NumberField
                disabled={isBusy}
                label={t("fields.year")}
                name="year"
                onChange={updateDraft}
                value={draft.year}
              />
              <TextField
                disabled={isBusy}
                label={t("fields.accentColor")}
                name="accent"
                onChange={updateDraft}
                placeholder="#000000"
                value={draft.accent}
              />
            </div>
          ) : null}
          {collectionKey === "leadership" ? (
            <TextField
              disabled={isBusy}
              label={t("fields.role")}
              name="role"
              onChange={updateDraft}
              value={draft.role}
            />
          ) : null}
          {collectionKey === "milestones" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                disabled={isBusy}
                label={t("fields.country")}
                name="country"
                onChange={updateDraft}
                value={draft.country}
              />
              <NumberField
                disabled={isBusy}
                label={t("fields.year")}
                name="year"
                onChange={updateDraft}
                value={draft.year}
              />
            </div>
          ) : null}
          {collectionKey === "contact-page" ? (
            <div className="grid gap-4">
              <TextField
                disabled={isBusy}
                label={t("fields.mapQuery")}
                name="mapQuery"
                onChange={updateDraft}
                value={draft.mapQuery}
              />
            </div>
          ) : null}
          {collectionKey === "contact-form" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                disabled={isBusy}
                label={t("fields.recipientEmail")}
                name="email"
                onChange={updateDraft}
                value={draft.email}
              />
              <TextField
                disabled={isBusy}
                label={t("fields.submitLabel")}
                name="cta"
                onChange={updateDraft}
                value={draft.cta}
              />
              <NumberField
                disabled={isBusy}
                label={t("fields.maximumMessageLength")}
                name="positions"
                onChange={updateDraft}
                value={draft.positions}
              />
              <TextField
                disabled={isBusy}
                label={t("fields.inquiryTypes")}
                name="usageTags"
                onChange={updateDraft}
                placeholder={t("placeholders.inquiryTypes")}
                value={draft.usageTags}
              />
            </div>
          ) : null}
          {collectionKey === "contact-channels" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <SelectField
                disabled={isBusy}
                label={t("fields.kind")}
                name="kind"
                onChange={updateDraft}
                options={contactKindOptions.map((option) => ({
                  label: t(`contactKinds.${option.value}`),
                  value: option.value,
                }))}
                placeholder={t("placeholders.kind")}
                value={draft.kind}
              />
              <TextField
                disabled={isBusy}
                label={t("fields.link")}
                name="href"
                onChange={updateDraft}
                value={draft.href}
              />
              <TextField
                disabled={isBusy}
                label={t("fields.secondaryText")}
                name="subtitle"
                onChange={updateDraft}
                value={draft.subtitle}
              />
              <TextField
                disabled={isBusy}
                label={t("fields.cta")}
                name="cta"
                onChange={updateDraft}
                value={draft.cta}
              />
              <NumberField
                disabled={isBusy}
                label={t("fields.sortOrder")}
                name="sortOrder"
                onChange={updateDraft}
                value={draft.sortOrder}
              />
              <CheckboxField
                description={t("descriptions.externalChannel")}
                disabled={isBusy}
                label={t("fields.externalLink")}
                name="feature"
                onChange={updateDraft}
                value={draft.feature}
              />
            </div>
          ) : null}
          {collectionKey === "contact-submissions" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                disabled={isBusy}
                label={t("fields.name")}
                name="name"
                onChange={updateDraft}
                value={draft.name}
              />
              <TextField
                disabled={isBusy}
                label={t("fields.company")}
                name="brand"
                onChange={updateDraft}
                value={draft.brand}
              />
              <TextField
                disabled={isBusy}
                label={t("fields.email")}
                name="email"
                onChange={updateDraft}
                value={draft.email}
              />
              <TextField
                disabled={isBusy}
                label={t("fields.inquiryType")}
                name="inquiryType"
                onChange={updateDraft}
                value={draft.inquiryType}
              />
              <TextField
                disabled={isBusy}
                label={t("fields.submissionStatus")}
                name="submissionStatus"
                onChange={updateDraft}
                value={draft.submissionStatus}
              />
              <TextField
                disabled={isBusy}
                label={t("fields.emailNotification")}
                name="emailNotificationStatus"
                onChange={updateDraft}
                value={draft.emailNotificationStatus}
              />
            </div>
          ) : null}
          {collectionKey === "jobs" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                disabled={isBusy}
                label={t("fields.department")}
                name="department"
                onChange={updateDraft}
                value={draft.department}
              />
              <TextField
                disabled={isBusy}
                label={t("fields.employmentType")}
                name="employmentType"
                onChange={updateDraft}
                placeholder={t("placeholders.employmentType")}
                value={draft.employmentType}
              />
              <TextField
                disabled={isBusy}
                label={t("fields.workMode")}
                name="workMode"
                onChange={updateDraft}
                placeholder={t("placeholders.workMode")}
                value={draft.workMode}
              />
              <NumberField
                disabled={isBusy}
                label={t("fields.positions")}
                name="positions"
                onChange={updateDraft}
                value={draft.positions}
              />
              <TextField
                disabled={isBusy}
                label={t("fields.location")}
                name="location"
                onChange={updateDraft}
                value={draft.location}
              />
              <TextField
                disabled={isBusy}
                label={t("fields.deadline")}
                name="deadline"
                onChange={updateDraft}
                value={draft.deadline}
              />
              <TextField
                disabled={isBusy}
                label={t("fields.externalLink")}
                name="href"
                onChange={updateDraft}
                value={draft.href}
              />
              <TextField
                disabled={isBusy}
                label={t("fields.applicationsEmail")}
                name="applyEmail"
                onChange={updateDraft}
                value={draft.applyEmail}
              />
              <NumberField
                disabled={isBusy}
                label={t("fields.sortOrder")}
                name="sortOrder"
                onChange={updateDraft}
                value={draft.sortOrder}
              />
            </div>
          ) : null}
          {collectionKey === "brands" || collectionKey === "milestones" ? (
            <RichTextEditor
              disabled={isBusy}
              enableHTMLSource
              featurePreset="compact"
              label={collectionKey === "brands" ? t("fields.story") : t("fields.milestoneCopy")}
              locale={contentLocale}
              onChange={(markdown, structuredValue) =>
                updateRichText(
                  "summary",
                  "summaryContent",
                  markdown,
                  structuredValue,
                )
              }
              onSourceModeDirtyChange={setSourceModeDirty}
              structuredValue={draft.summaryContent}
              value={draft.summary}
            />
          ) : (
            <TextAreaField
              disabled={isBusy}
              label={
                collectionKey === "contact-channels"
                  ? t("fields.primaryText")
                  : t("fields.summary")
              }
              name="summary"
              onChange={updateDraft}
              value={draft.summary}
            />
          )}
          {collectionKey === "brands" ? (
            <div className="grid gap-4">
              <CheckboxField
                description={t("descriptions.featureBrand")}
                disabled={isBusy}
                label={t("fields.featureBrand")}
                name="feature"
                onChange={updateDraft}
                value={draft.feature}
              />
              <TextField
                disabled={isBusy}
                label={t("fields.featureCaption")}
                name="featureCaption"
                onChange={updateDraft}
                value={draft.featureCaption}
              />
            </div>
          ) : null}
          {collectionKey === "milestones" ? (
            <CheckboxField
              description={t("descriptions.aboutOnly")}
              disabled={isBusy}
              label={t("fields.aboutOnly")}
              name="aboutOnly"
              onChange={updateDraft}
              value={draft.aboutOnly}
            />
          ) : null}
        </section>
      ) : null}

      {editorSteps.includes("writing") ? (
        <section className={sectionSurfaceClass} id="editor-writing">
          <EditorStepHeader step="writing" />
          {collectionKey === "leadership" ? (
            <div className="grid gap-4">
              <RichTextEditor
                disabled={isBusy}
                enableHTMLSource
                featurePreset="compact"
                label={t("fields.bio")}
                locale={contentLocale}
                onChange={(markdown, structuredValue) =>
                  updateRichText(
                    "body",
                    "bodyContent",
                    markdown,
                    structuredValue,
                  )
                }
                onSourceModeDirtyChange={setSourceModeDirty}
                structuredValue={draft.bodyContent}
                value={draft.body}
              />
              <TextAreaField
                disabled={isBusy}
                label={t("fields.quote")}
                name="subtitle"
                onChange={updateDraft}
                value={draft.subtitle}
              />
            </div>
          ) : null}
          {collectionKey === "contact-page" ? (
            <RichTextEditor
              disabled={isBusy}
              enableHTMLSource
              featurePreset="compact"
              label={t("fields.intro")}
              locale={contentLocale}
              onChange={(markdown, structuredValue) => {
                setDraft((current) => ({
                  ...current,
                  body: markdown,
                  bodyContent: structuredValue,
                  summary: markdown,
                  summaryContent: structuredValue,
                }));
              }}
              onSourceModeDirtyChange={setSourceModeDirty}
              structuredValue={draft.bodyContent || draft.summaryContent}
              value={draft.body || draft.summary}
            />
          ) : null}
          {collectionKey === "contact-form" ? (
            <RichTextEditor
              disabled={isBusy}
              enableHTMLSource
              featurePreset="compact"
              label={t("fields.successMessage")}
              locale={contentLocale}
              onChange={(markdown, structuredValue) => {
                setDraft((current) => ({
                  ...current,
                  body: markdown,
                  bodyContent: structuredValue,
                  summary: markdown,
                  summaryContent: structuredValue,
                }));
              }}
              onSourceModeDirtyChange={setSourceModeDirty}
              structuredValue={draft.bodyContent || draft.summaryContent}
              value={draft.body || draft.summary}
            />
          ) : null}
          {collectionKey === "contact-submissions" ? (
            <RichTextEditor
              disabled
              enableHTMLSource={false}
              featurePreset="compact"
              label={t("fields.message")}
              locale={contentLocale}
              onChange={() => undefined}
              readOnly
              structuredValue={draft.bodyContent || draft.summaryContent}
              value={draft.body || draft.summary}
            />
          ) : null}
          {collectionKey === "articles" || collectionKey === "jobs" ? (
            <RichTextEditor
              disabled={isBusy}
              enableHTMLSource
              enableImages={collectionKey === "articles"}
              featurePreset="full"
              label={collectionKey === "jobs" ? t("fields.positionDescription") : t("fields.article")}
              locale={contentLocale}
              onChange={(markdown, structuredValue) =>
                updateRichText(
                  "body",
                  "bodyContent",
                  markdown,
                  structuredValue,
                )
              }
              onSourceModeDirtyChange={setSourceModeDirty}
              structuredValue={draft.bodyContent}
              value={draft.body}
            />
          ) : null}
        </section>
      ) : null}

      {editorSteps.includes("image") && supportsImage ? (
        <section className={sectionSurfaceClass} id="editor-image">
          <EditorStepHeader step="image" />
          <p className="text-sm leading-6 text-[var(--ink-soft)]">
            {t("imageHelp")}
          </p>
          <div className="grid min-w-0 gap-5 lg:grid-cols-2">
            <div className="grid content-start gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--clay)]">
                {t("preview")}
              </span>
              <div className="relative aspect-[4/3] w-full overflow-hidden border border-[rgba(184,112,81,0.42)] bg-[rgba(239,207,178,0.4)]">
                {showImagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    alt={draft.imageAlt || effectiveItem?.title || t("preview")}
                    className="h-full w-full object-cover"
                    src={previewImageSrc as string}
                    style={{
                      objectPosition: draft.objectPosition?.trim() || "center",
                    }}
                  />
                ) : (
                  <div className="grid h-full place-items-center px-4 text-center text-sm text-[var(--ink-soft)]">
                    {t("addImagePrompt")}
                  </div>
                )}
                {imageFile ? (
                  <span className="absolute left-3 top-3 border border-[var(--gold)] bg-[var(--navy)] px-2 py-1 text-[0.62rem] font-black uppercase tracking-[0.14em] text-[var(--parchment)]">
                    {t("newImage")}
                  </span>
                ) : null}
              </div>
            </div>
            <div className="grid min-w-0 content-start gap-4">
              <div
                aria-label={t("uploadImage")}
                className={`grid min-h-44 cursor-pointer place-items-center gap-2 border border-dashed px-4 py-6 text-center transition ${
                  imageDragActive
                    ? "border-[var(--gold)] bg-[rgba(217,167,91,0.14)]"
                    : "border-[rgba(184,112,81,0.5)] bg-[var(--parchment)] hover:border-[var(--copper)]"
                } ${isBusy || imageProcessing ? "cursor-not-allowed opacity-60" : ""}`}
                onClick={() => {
                  if (!isBusy && !imageProcessing) imageInputRef.current?.click();
                }}
                onDragLeave={() => setImageDragActive(false)}
                onDragOver={(event) => {
                  event.preventDefault();
                  if (!isBusy && !imageProcessing) setImageDragActive(true);
                }}
                onDrop={handleImageDrop}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    if (!isBusy && !imageProcessing) {
                      imageInputRef.current?.click();
                    }
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <span className="text-sm font-bold text-[var(--copper-dark)]">
                  {imageProcessing
                    ? t("optimizingImage")
                    : t("dragBrowse")}
                </span>
                <span className="text-xs text-[var(--ink-soft)]">
                  {t("conversionHint")}
                </span>
                {imageFileLabel ? (
                  <span className="mt-1 max-w-full truncate text-xs font-bold text-[var(--navy)]">
                    {imageFileLabel}
                  </span>
                ) : null}
              </div>
              <input
                accept="image/*"
                className="hidden"
                disabled={isBusy}
                name="imageFile"
                onChange={updateImageFile}
                ref={imageInputRef}
                type="file"
              />
              {fieldErrors.imageFile ? (
                <span className="text-xs text-red-700">
                  {fieldErrors.imageFile}
                </span>
              ) : null}
              <TextField
                disabled={isBusy}
                label={t("fields.imageDescription")}
                name="imageAlt"
                onChange={updateDraft}
                value={draft.imageAlt}
              />
              {effectiveItem?.imageAssetId ? (
                <label className="flex items-center gap-3 border border-[rgba(184,112,81,0.38)] bg-white px-3 py-3 text-sm text-[var(--ink)]">
                  <input
                    checked={draft.removeImage}
                    className="size-4 accent-[var(--clay)]"
                    disabled={isBusy}
                    onChange={(event) =>
                      updateDraft("removeImage", event.currentTarget.checked)
                    }
                    type="checkbox"
                  />
                  {t("removeCurrentImage")}
                </label>
              ) : null}
            </div>
          </div>
          {collectionKey === "articles" ? (
            <ArticleGalleryEditor
              disabled={isBusy}
              onChange={(value) => updateDraft("gallery", value)}
              value={draft.gallery}
            />
          ) : null}
        </section>
      ) : null}

      {editorSteps.includes("danger") && effectiveItem ? (
        <section className={sectionSurfaceClass} id="editor-danger">
          <EditorStepHeader step="danger" />
          {confirmDelete ? (
            <div className="grid gap-3 border border-red-300 bg-red-500/10 p-4">
              <p className="text-sm text-red-800">
                {t("removeItemConfirm", { title: effectiveItem.title })}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  className="min-h-10 bg-red-800 px-4 text-sm font-bold text-white disabled:opacity-50"
                  disabled={isBusy}
                  onClick={() => void deleteItem()}
                  type="button"
                >
                  {deleting ? t("deleting") : t("delete")}
                </button>
                <button
                  className="button-secondary min-h-10"
                  disabled={isBusy}
                  onClick={() => setConfirmDelete(false)}
                  type="button"
                >
                  {t("keep")}
                </button>
              </div>
            </div>
          ) : (
            <Button
              disabled={isBusy}
              onClick={() => setConfirmDelete(true)}
              type="button"
              variant="destructive"
            >
              <Trash aria-hidden data-icon="inline-start" />
              {t("removeItem", { item: itemName })}
            </Button>
          )}
        </section>
      ) : null}
        </div>

        <aside className="min-w-0 xl:sticky xl:top-32 xl:h-fit">
          <div className="grid gap-5 rounded-xl border border-admin-rule bg-admin-panel p-4 shadow-sm">
            <div>
              <p className="script-label">{t("inspector.publishing")}</p>
              <div className="mt-3">
                <SelectField
                  disabled={isBusy}
                  error={fieldErrors.status}
                  label={t("fields.visibility")}
                  name="status"
                  onChange={updateDraft}
                  options={statusOptions.map((option) => ({
                    label: t(`statuses.${option.value}`),
                    value: option.value,
                  }))}
                  value={draft.status}
                />
              </div>
            </div>

            <Separator />

            <div>
              <p className="script-label">{t("inspector.translations")}</p>
              <div className="mt-3 grid gap-2 text-sm">
                {(["en", "vi"] as const).map((locale) => {
                  const status =
                    locale === contentLocale
                      ? draft.status
                      : effectiveItem?.localeStatuses[locale] ?? "draft";
                  return (
                    <div
                      className="flex items-center justify-between gap-3"
                      key={locale}
                    >
                      <span className="font-medium text-admin-ink">
                        {locale === "en" ? "English" : "Tiếng Việt"}
                      </span>
                      <Badge variant="outline">{t(`statuses.${status}`)}</Badge>
                    </div>
                  );
                })}
              </div>
            </div>

            {supportsImage ? (
              <>
                <Separator />
                <div>
                  <p className="script-label">{t("inspector.cover")}</p>
                  <div className="mt-3">
                    <EditorCoverSummary
                      draft={draft}
                      imageFileLabel={imageFileLabel}
                      item={effectiveItem}
                    />
                  </div>
                </div>
              </>
            ) : null}

            <Separator />

            <div>
              <p className="script-label">{t("inspector.pageDetails")}</p>
              <div className="mt-3 grid gap-3">
                <TextField
                  disabled={isBusy}
                  label={t("fields.websiteLink")}
                  name="slug"
                  onChange={(name, value) => {
                    setSlugIsAutomatic(false);
                    updateDraft(name, normalizeRichfieldSlugInput(value));
                  }}
                  value={draft.slug}
                />
                <div className="grid gap-2 rounded-lg border border-admin-rule bg-admin-surface p-3">
                  <div className="flex min-w-0 items-start gap-2 text-xs text-admin-ink-soft">
                    <LinkSimple
                      aria-hidden
                      className="mt-0.5 shrink-0 text-admin-accent"
                      size={15}
                    />
                    <span className="min-w-0 break-all font-mono leading-5">
                      {draftPreviewPath}
                    </span>
                  </div>
                  <p className="text-xs leading-5 text-admin-ink-soft">
                    {t("websiteLinkHelp")}
                  </p>
                  <Button
                    className="justify-self-start"
                    disabled={
                      isBusy ||
                      !suggestedSlug ||
                      draft.slug === suggestedSlug
                    }
                    onClick={() => {
                      setSlugIsAutomatic(true);
                      updateDraft("slug", suggestedSlug);
                    }}
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    <ArrowClockwise aria-hidden data-icon="inline-start" />
                    {t("updateWebsiteLink")}
                  </Button>
                </div>
              </div>
              {effectiveItem ? (
                <p className="mt-3 break-all text-xs leading-5 text-admin-ink-soft">
                  ID · {effectiveItem.id}
                </p>
              ) : null}
            </div>
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-admin-rule bg-admin-surface backdrop-blur-xl lg:left-60">
        <div className="mx-auto flex min-h-16 max-w-[1320px] items-center justify-between gap-3 px-4 sm:px-7 lg:px-12">
          <div className="flex min-w-0 items-center gap-2 text-sm text-admin-ink-soft">
            <span
              aria-hidden
              className={`size-2 shrink-0 rounded-full ${
                isDirty ? "bg-amber-500" : "bg-emerald-500"
              }`}
            />
            <span className="truncate">
              {isDirty ? t("unsavedChanges") : t("allChangesSaved")}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {previewHref ? (
              <Button
                render={
                  <Link href={previewHref} rel="noreferrer" target="_blank" />
                }
                size="sm"
                variant="outline"
              >
                <Eye aria-hidden data-icon="inline-start" />
                <span className="hidden sm:inline">{t("openPreview")}</span>
              </Button>
            ) : null}
            <Button
              disabled={!canSave || imageProcessing}
              size="sm"
              type="submit"
            >
              <FloppyDisk aria-hidden data-icon="inline-start" />
              {submitting ? t("saving") : t("save")}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
