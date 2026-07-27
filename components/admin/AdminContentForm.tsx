"use client";

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
import type {
  RichfieldAdminCollectionKey,
  RichfieldAdminContentItem,
} from "@/lib/richfield-admin-content-model";
import { slugifyRichfieldContent } from "@/lib/richfield-admin-content-model";
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
  sectionCopy,
  statusOptions,
  type Draft,
} from "./AdminContentHelpers";
import { RichTextEditor } from "./RichTextEditor";
import { adminFetch } from "./richfield-admin-session-client";
import {
  canSaveRichfieldEditor,
  getRichfieldEditorPreviewHref,
  getRichfieldEditorSteps,
  hasRichfieldEditorDirtyChanges,
  type RichfieldEditorStepId,
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
  const copy = sectionCopy[collectionKey];
  const [savedItem, setSavedItem] = useState<RichfieldAdminContentItem | null>(
    null,
  );
  const effectiveItem = savedItem ?? item;
  const [draft, setDraft] = useState(() => draftWithPreset(item, initialDraft));
  const [slugTouched, setSlugTouched] = useState(Boolean(item));
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFileLabel, setImageFileLabel] = useState("");
  const [imageDragActive, setImageDragActive] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageProcessing, setImageProcessing] = useState(false);
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
  const [activeStep, setActiveStep] = useState<RichfieldEditorStepId>("basics");
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
  const visibleStep = editorSteps.includes(activeStep)
    ? activeStep
    : editorSteps[0] ?? "basics";
  const visibleStepIndex = Math.max(editorSteps.indexOf(visibleStep), 0);
  const isFirstStep = visibleStepIndex === 0;
  const isLastStep = visibleStepIndex === editorSteps.length - 1;
  const sectionSurfaceClass =
    "grid gap-4 border border-[rgba(184,112,81,0.42)] bg-white p-4 shadow-[0_12px_34px_rgba(82,40,37,0.08)] sm:p-5";
  const isDirty = hasRichfieldEditorDirtyChanges({
    draft,
    hasPendingImageFile: Boolean(imageFile),
    savedDraft,
  });
  const canSave = canSaveRichfieldEditor({ isBusy, isDirty });
  const previewHref = effectiveItem
    ? getRichfieldEditorPreviewHref({
        collectionKey,
        slug: effectiveItem.slug,
      })
    : null;
  useEffect(() => {
    onBusyChange(isBusy);
  }, [isBusy, onBusyChange]);

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

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
        !slugTouched &&
        !effectiveItem
      ) {
        next.slug = slugifyRichfieldContent(value);
      }

      return next;
    });
  };

  const applyImageFile = async (file: File | null) => {
    if (!file) {
      setImageFile(null);
      setImageFileLabel("");
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
    if (!canSave || imageProcessing) return;

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
        setSlugTouched(true);
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

  const goToStep = (offset: number) => {
    const nextStep = editorSteps[visibleStepIndex + offset];
    if (nextStep) setActiveStep(nextStep);
  };

  if (imageOnly) {
    return (
      <form className="grid min-w-0 gap-5" onSubmit={submit}>
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[rgba(184,112,81,0.28)] pb-4">
          <div className="min-w-0">
            <p className="script-label">
              {effectiveItem ? t("editImage") : copy.newLabel}
            </p>
            <h2 className="break-words font-display text-3xl leading-none text-[var(--navy)] sm:text-4xl">
              {draft.title || t("untitledItem", { item: copy.singular })}
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
    <form className="grid min-w-0 gap-6" onSubmit={submit}>
      <div className="grid gap-4 border-b border-[rgba(184,112,81,0.28)] pb-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div
          className={`grid min-w-0 gap-4 ${
            supportsImage ? "lg:grid-cols-[minmax(0,1fr)_220px]" : ""
          }`}
        >
          <div className="min-w-0">
            <p className="script-label">
              {effectiveItem
                ? t("editItem", { item: copy.singular })
                : copy.newLabel}
            </p>
            <h2 className="break-words font-display text-4xl leading-none text-[var(--navy)] sm:text-5xl">
              {draft.title || t("untitledItem", { item: copy.singular })}
            </h2>
          </div>
          {supportsImage ? (
            <EditorCoverSummary
              draft={draft}
              imageFileLabel={imageFileLabel}
              item={effectiveItem}
            />
          ) : null}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap lg:justify-end">
          {previewHref ? (
            <Link
              className="button-secondary min-w-32 w-full text-center sm:w-auto"
              href={previewHref}
              rel="noreferrer"
              target="_blank"
            >
              {t("openPreview")}
            </Link>
          ) : null}
          <button
            className="button-secondary min-w-28 w-full disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            disabled={isBusy}
            onClick={onCloseRequest}
            type="button"
          >
            {t("close")}
          </button>
          <button
            className="button-primary min-w-28 w-full disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
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

      <nav
        aria-label={t("editorSections")}
        className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5"
      >
        {editorSteps.map((step, index) => {
          const isActive = step === visibleStep;

          return (
            <button
              className={`grid min-h-16 min-w-0 border px-3 py-2 text-left transition disabled:cursor-not-allowed disabled:opacity-55 ${
                isActive
                  ? "border-[var(--gold)] bg-[var(--navy)] text-[var(--parchment)]"
                  : "border-[rgba(184,112,81,0.38)] bg-white text-[var(--ink)] hover:border-[var(--copper)]"
              }`}
              disabled={isBusy}
              key={step}
              onClick={() => setActiveStep(step)}
              type="button"
            >
              <span className="text-[0.65rem] font-black uppercase tracking-[0.16em] opacity-75">
                {t("stepNumber", { number: index + 1 })}
              </span>
              <span className="truncate text-sm font-black">
                {t(`steps.${step}.label`)}
              </span>
              <span className="truncate text-xs opacity-75">
                {t(`steps.${step}.description`)}
              </span>
            </button>
          );
        })}
      </nav>

      {visibleStep === "basics" ? (
        <section className={sectionSurfaceClass}>
          <EditorStepHeader step="basics" />
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <TextField
              disabled={isBusy}
              error={fieldErrors.title}
              label={collectionKey === "milestones" ? t("fields.brand") : t("fields.name")}
              name="title"
              onChange={updateDraft}
              required
              value={draft.title}
            />
            <label className="grid gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--clay)]">
                {t("fields.visibility")}
              </span>
              <select
                className={`min-h-11 w-full min-w-0 border bg-white px-3 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--gold)] ${
                  fieldErrors.status
                    ? "border-red-400"
                    : "border-[rgba(184,112,81,0.42)]"
                } disabled:cursor-not-allowed disabled:bg-[var(--parchment)] disabled:text-[var(--ink-soft)]`}
                disabled={isBusy}
                onChange={(event) =>
                  updateDraft("status", event.currentTarget.value)
                }
                value={draft.status}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(`statuses.${option.value}`)}
                  </option>
                ))}
              </select>
              {fieldErrors.status ? (
                <span className="text-xs text-red-700">
                  {fieldErrors.status}
                </span>
              ) : null}
            </label>
            <TextField
              disabled={isBusy}
              label={t("fields.websiteLink")}
              name="slug"
              onChange={(name, value) => {
                setSlugTouched(true);
                updateDraft(name, slugifyRichfieldContent(value));
              }}
              value={draft.slug}
            />
          </div>
        </section>
      ) : null}

      {visibleStep === "details" ? (
        <section className={sectionSurfaceClass}>
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
                options={categoryOptions}
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
                options={contactKindOptions}
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
              label={collectionKey === "brands" ? t("fields.story") : t("fields.milestoneCopy")}
              locale={contentLocale}
              onChange={(value) => updateDraft("summary", value)}
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

      {visibleStep === "writing" ? (
        <section className={sectionSurfaceClass}>
          <EditorStepHeader step="writing" />
          {collectionKey === "leadership" ? (
            <div className="grid gap-4">
              <RichTextEditor
                disabled={isBusy}
                label={t("fields.bio")}
                locale={contentLocale}
                onChange={(value) => updateDraft("body", value)}
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
              label={t("fields.intro")}
              locale={contentLocale}
              onChange={(value) => {
                updateDraft("body", value);
                updateDraft("summary", value);
              }}
              value={draft.body || draft.summary}
            />
          ) : null}
          {collectionKey === "contact-form" ? (
            <RichTextEditor
              disabled={isBusy}
              label={t("fields.successMessage")}
              locale={contentLocale}
              onChange={(value) => {
                updateDraft("body", value);
                updateDraft("summary", value);
              }}
              value={draft.body || draft.summary}
            />
          ) : null}
          {collectionKey === "contact-submissions" ? (
            <RichTextEditor
              disabled={isBusy}
              label={t("fields.message")}
              locale={contentLocale}
              onChange={(value) => {
                updateDraft("body", value);
                updateDraft("summary", value);
              }}
              value={draft.body || draft.summary}
            />
          ) : null}
          {collectionKey === "articles" || collectionKey === "jobs" ? (
            <RichTextEditor
              disabled={isBusy}
              label={collectionKey === "jobs" ? t("fields.positionDescription") : t("fields.article")}
              locale={contentLocale}
              onChange={(value) => updateDraft("body", value)}
              value={draft.body}
            />
          ) : null}
        </section>
      ) : null}

      {visibleStep === "image" && supportsImage ? (
        <section className={sectionSurfaceClass}>
          <EditorStepHeader step="image" />
          <p className="text-sm leading-6 text-[var(--ink-soft)]">
            {t("imageHelp")}
          </p>
          <div className="grid min-w-0 gap-5 lg:grid-cols-2">
            <div className="grid content-start gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--clay)]">
                Preview
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
                    Add an image to see it here.
                  </div>
                )}
                {imageFile ? (
                  <span className="absolute left-3 top-3 border border-[var(--gold)] bg-[var(--navy)] px-2 py-1 text-[0.62rem] font-black uppercase tracking-[0.14em] text-[var(--parchment)]">
                    New image
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
                    ? "Optimizing image…"
                    : t("dragBrowse")}
                </span>
                <span className="text-xs text-[var(--ink-soft)]">
                  Converted to WebP automatically · up to 12MB
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
                  Remove the current image
                </label>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {visibleStep === "danger" && effectiveItem ? (
        <section className={sectionSurfaceClass}>
          <EditorStepHeader step="danger" />
          {confirmDelete ? (
            <div className="grid gap-3 border border-red-300 bg-red-500/10 p-4">
              <p className="text-sm text-red-800">
                Delete &ldquo;{effectiveItem.title}&rdquo; from this website area?
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
            <button
              className="text-sm font-bold text-red-800 underline decoration-red-800/25 underline-offset-4"
              disabled={isBusy}
              onClick={() => setConfirmDelete(true)}
              type="button"
            >
              Delete this {copy.singular}
            </button>
          )}
        </section>
      ) : null}

      <div className="flex flex-col gap-3 border-t border-[rgba(184,112,81,0.28)] pt-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          className="button-secondary min-w-28 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isBusy || isFirstStep}
          onClick={() => goToStep(-1)}
          type="button"
        >
          Back
        </button>
        <span className="text-center text-xs font-bold uppercase tracking-[0.14em] text-[var(--ink-soft)]">
          Step {visibleStepIndex + 1} of {editorSteps.length}
        </span>
        <button
          className="button-secondary min-w-28 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isBusy || isLastStep}
          onClick={() => goToStep(1)}
          type="button"
        >
          Next
        </button>
      </div>
    </form>
  );
}
