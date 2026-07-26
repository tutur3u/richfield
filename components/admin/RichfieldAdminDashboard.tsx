"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
} from "react";
import Link from "next/link";
import { toast } from "sonner";
import type {
  RichfieldAdminCollectionKey,
  RichfieldAdminContentItem,
  RichfieldContentStatus,
} from "@/lib/richfield-admin-content-model";
import type {
  RichfieldAdminMember,
  RichfieldAdminMembersContext,
} from "@/lib/richfield-admin-members";
import { slugifyRichfieldContent } from "@/lib/richfield-admin-content-model";
import type { RichfieldStorageAnalyticsState } from "@/lib/richfield-admin-storage";
import type {
  RichfieldStorageFileItem,
  RichfieldStorageFilesState,
} from "@/lib/richfield-storage-files";
import { getRichfieldGalleryPlacementLabel } from "@/lib/richfield-gallery";
import { RichfieldGalleryPanel } from "./RichfieldGalleryPanel";
import { RichTextEditor } from "./RichTextEditor";
import { RICHFIELD_ADMIN_COPY } from "./richfield-admin-copy";
import {
  adminFetch,
  scheduleRichfieldAdminSessionRefresh,
} from "./richfield-admin-session-client";
import {
  readContentSaveResponse,
  SaveProgressPanel,
  type MutationResponse,
  type SaveFlowError,
  type SaveProgressState,
} from "./richfield-admin-save-progress";
import {
  canSaveRichfieldEditor,
  getRichfieldEditorPreviewHref,
  getRichfieldEditorSteps,
  getRichfieldEditorCloseIntent,
  hasRichfieldEditorDirtyChanges,
  type RichfieldAdminEditorDraft,
  type RichfieldEditorStepId,
} from "./richfield-admin-editor-state";

type AdminTab = RichfieldAdminCollectionKey | "account" | "members" | "storage";

type DashboardContent = Record<
  RichfieldAdminCollectionKey,
  RichfieldAdminContentItem[]
>;
type ReadyStorageAnalytics = Extract<
  RichfieldStorageAnalyticsState,
  { status: "ready" }
>;
type ReadyStorageFiles = Extract<RichfieldStorageFilesState, { status: "ready" }>;

type Draft = RichfieldAdminEditorDraft;

type MembersResponse = {
  context?: RichfieldAdminMembersContext;
  error?: string;
  members?: RichfieldAdminMember[];
};

type EditorTarget = {
  collectionKey: RichfieldAdminCollectionKey;
  initialDraft?: Partial<Draft>;
  itemId: string | null;
};

const contentTabs: RichfieldAdminCollectionKey[] = [
  "articles",
  "jobs",
  "brands",
  "leadership",
  "milestones",
  "contact-page",
  "contact-form",
  "contact-channels",
  "image-library",
  "contact-submissions",
];

// Grouped rather than flat: the thirteen surfaces divide cleanly into what you
// publish, what the public sends back, the asset stores, and workspace admin.
// Order within each group follows how often an editor reaches for it.
const tabGroups: Array<{
  label: string;
  tabs: Array<{ id: AdminTab; label: string }>;
}> = [
  {
    label: RICHFIELD_ADMIN_COPY.tabGroups.content,
    tabs: [
      { id: "articles", label: RICHFIELD_ADMIN_COPY.tabs.articles },
      { id: "jobs", label: RICHFIELD_ADMIN_COPY.tabs.jobs },
      { id: "brands", label: RICHFIELD_ADMIN_COPY.tabs.brands },
      { id: "leadership", label: RICHFIELD_ADMIN_COPY.tabs.leadership },
      { id: "milestones", label: RICHFIELD_ADMIN_COPY.tabs.milestones },
    ],
  },
  {
    label: RICHFIELD_ADMIN_COPY.tabGroups.contact,
    tabs: [
      {
        id: "contact-submissions",
        label: RICHFIELD_ADMIN_COPY.tabs.contactSubmissions,
      },
      { id: "contact-page", label: RICHFIELD_ADMIN_COPY.tabs.contactPage },
      { id: "contact-form", label: RICHFIELD_ADMIN_COPY.tabs.contactForm },
      {
        id: "contact-channels",
        label: RICHFIELD_ADMIN_COPY.tabs.contactChannels,
      },
    ],
  },
  {
    label: RICHFIELD_ADMIN_COPY.tabGroups.media,
    tabs: [
      { id: "image-library", label: RICHFIELD_ADMIN_COPY.tabs.gallery },
      { id: "storage", label: RICHFIELD_ADMIN_COPY.tabs.storage },
    ],
  },
  {
    label: RICHFIELD_ADMIN_COPY.tabGroups.team,
    tabs: [
      { id: "members", label: RICHFIELD_ADMIN_COPY.tabs.members },
      { id: "account", label: RICHFIELD_ADMIN_COPY.tabs.account },
    ],
  },
];

const byteUnits = ["B", "KB", "MB", "GB", "TB"] as const;

const sectionCopy: Record<
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
    listTitle: "Insights and updates",
    newLabel: RICHFIELD_ADMIN_COPY.actions.newArticle,
    singular: "article",
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

const statusOptions: Array<{ label: string; value: RichfieldContentStatus }> = [
  { label: RICHFIELD_ADMIN_COPY.visibility.draft, value: "draft" },
  { label: RICHFIELD_ADMIN_COPY.visibility.published, value: "published" },
  { label: RICHFIELD_ADMIN_COPY.visibility.archived, value: "archived" },
  { label: RICHFIELD_ADMIN_COPY.visibility.scheduled, value: "scheduled" },
];

const categoryOptions: Array<{ label: string; value: string }> = [
  { label: "Food", value: "Food" },
  { label: "Beverages", value: "Beverages" },
  { label: "Non-Food", value: "Non-Food" },
];

const contactKindOptions = [
  { label: "Office", value: "office" },
  { label: "Phone", value: "phone" },
  { label: "Email", value: "email" },
  { label: "Facebook", value: "facebook" },
];

function getInitials(email: string | null) {
  if (!email) return "R";

  const [name] = email.split("@");
  const initials =
    name
      ?.split(/[._-]+/)
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2) ?? "";

  return initials.toUpperCase() || "R";
}

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";

  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    byteUnits.length - 1,
  );
  const value = bytes / 1024 ** exponent;
  const formatted =
    value >= 10 || exponent === 0
      ? Math.round(value).toString()
      : value.toFixed(1);

  return `${formatted} ${byteUnits[exponent]}`;
}

function formatFileDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return RICHFIELD_ADMIN_COPY.storage.unknownDate;
  }

  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date);
}

function StorageMetric({
  detail,
  label,
  value,
}: {
  detail?: string;
  label: string;
  value: string;
}) {
  return (
    <div className="parchment-card min-w-0 p-5 sm:p-6">
      <p className="text-sm font-bold text-[var(--clay)]">{label}</p>
      <strong className="mt-3 block break-words font-display text-3xl leading-none text-[var(--navy)] sm:text-4xl">
        {value}
      </strong>
      {detail ? (
        <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
          {detail}
        </p>
      ) : null}
    </div>
  );
}

function StorageFileHighlight({
  file,
  label,
}: {
  file: ReadyStorageAnalytics["data"]["largestFile"];
  label: string;
}) {
  return (
    <div className="parchment-card min-w-0 p-5 sm:p-6">
      <p className="text-sm font-bold text-[var(--clay)]">{label}</p>
      {file ? (
        <div className="mt-3">
          <strong className="block truncate text-[var(--ink)]">
            {file.name}
          </strong>
          <span className="mt-1 block text-sm text-[var(--ink-soft)]">
            {formatBytes(file.size)} - {formatFileDate(file.createdAt)}
          </span>
        </div>
      ) : (
        <p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">
          {RICHFIELD_ADMIN_COPY.storage.noFiles}
        </p>
      )}
    </div>
  );
}

function storageParentPath(path: string) {
  const segments = path.split("/").filter(Boolean);
  segments.pop();
  return segments.join("/");
}

function isStorageFilesPayload(
  value: unknown,
): value is ReadyStorageFiles["data"] {
  if (!value || typeof value !== "object") return false;

  const payload = value as Record<string, unknown>;
  return (
    Array.isArray(payload.items) &&
    typeof payload.path === "string" &&
    typeof payload.total === "number"
  );
}

function isStorageAnalyticsState(
  value: unknown,
): value is RichfieldStorageAnalyticsState {
  if (!value || typeof value !== "object") return false;

  const payload = value as Record<string, unknown>;
  return payload.status === "ready" || payload.status === "unavailable";
}

function StorageFileRow({
  busy,
  confirmDeletePath,
  item,
  onDelete,
  onOpen,
  onOpenFolder,
  onRename,
  renamingPath,
  renameValue,
  setConfirmDeletePath,
  setRenamingPath,
  setRenameValue,
}: {
  busy: boolean;
  confirmDeletePath: string | null;
  item: RichfieldStorageFileItem;
  onDelete: (item: RichfieldStorageFileItem) => void;
  onOpen: (item: RichfieldStorageFileItem) => void;
  onOpenFolder: (path: string) => void;
  onRename: (item: RichfieldStorageFileItem) => void;
  renamingPath: string | null;
  renameValue: string;
  setConfirmDeletePath: (path: string | null) => void;
  setRenamingPath: (path: string | null) => void;
  setRenameValue: (name: string) => void;
}) {
  const isRenaming = renamingPath === item.path;
  const isConfirmingDelete = confirmDeletePath === item.path;
  const dateLabel = formatFileDate(item.updatedAt ?? item.createdAt ?? "");

  return (
    <div className="grid gap-4 border border-[rgba(184,112,81,0.34)] bg-white/68 p-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
      <div className="min-w-0">
        {isRenaming ? (
          <input
            className="min-h-11 w-full border border-[rgba(184,112,81,0.42)] bg-white px-3 text-sm font-bold text-[var(--ink)] outline-none focus:border-[var(--gold)]"
            onChange={(event) => setRenameValue(event.currentTarget.value)}
            value={renameValue}
          />
        ) : item.kind === "folder" ? (
          <button
            className="block max-w-full truncate text-left font-bold text-[var(--ink)] underline decoration-[rgba(184,112,81,0.28)] underline-offset-4"
            onClick={() => onOpenFolder(item.path)}
            type="button"
          >
            {item.name}
          </button>
        ) : (
          <strong className="block truncate text-[var(--ink)]">
            {item.name}
          </strong>
        )}
        <span className="mt-1 block text-sm text-[var(--ink-soft)]">
          {item.kind === "folder" ? "Folder" : formatBytes(item.size)} -{" "}
          {dateLabel}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        {item.kind === "file" && !isRenaming && !isConfirmingDelete ? (
          <button
            className="button-secondary min-h-10 px-4 text-xs"
            disabled={busy}
            onClick={() => onOpen(item)}
            type="button"
          >
            {RICHFIELD_ADMIN_COPY.storage.open}
          </button>
        ) : null}
        {isRenaming ? (
          <>
            <button
              className="button-primary min-h-10 px-4 text-xs"
              disabled={busy || !renameValue.trim()}
              onClick={() => onRename(item)}
              type="button"
            >
              {RICHFIELD_ADMIN_COPY.actions.save}
            </button>
            <button
              className="button-secondary min-h-10 px-4 text-xs"
              disabled={busy}
              onClick={() => setRenamingPath(null)}
              type="button"
            >
              {RICHFIELD_ADMIN_COPY.actions.cancel}
            </button>
          </>
        ) : isConfirmingDelete ? (
          <>
            <button
              className="min-h-10 bg-red-800 px-4 text-xs font-bold text-white disabled:opacity-50"
              disabled={busy}
              onClick={() => onDelete(item)}
              type="button"
            >
              {RICHFIELD_ADMIN_COPY.storage.remove}
            </button>
            <button
              className="button-secondary min-h-10 px-4 text-xs"
              disabled={busy}
              onClick={() => setConfirmDeletePath(null)}
              type="button"
            >
              {RICHFIELD_ADMIN_COPY.actions.keep}
            </button>
          </>
        ) : (
          <>
            <button
              className="button-secondary min-h-10 px-4 text-xs"
              disabled={busy}
              onClick={() => {
                setRenameValue(item.name);
                setRenamingPath(item.path);
              }}
              type="button"
            >
              {RICHFIELD_ADMIN_COPY.storage.rename}
            </button>
            <button
              className="min-h-10 border border-red-300 px-4 text-xs font-bold text-red-800 disabled:opacity-50"
              disabled={busy}
              onClick={() => setConfirmDeletePath(item.path)}
              type="button"
            >
              {RICHFIELD_ADMIN_COPY.storage.remove}
            </button>
          </>
        )}
      </div>
      {isConfirmingDelete ? (
        <p className="text-sm leading-6 text-red-800 md:col-span-2">
          {RICHFIELD_ADMIN_COPY.storage.deleteHint}
        </p>
      ) : null}
    </div>
  );
}

function StoragePanel({
  driveHref,
  storageAnalytics,
  storageFiles,
  onResourcesChanged,
}: {
  driveHref: string;
  storageAnalytics: RichfieldStorageAnalyticsState;
  storageFiles: RichfieldStorageFilesState;
  onResourcesChanged: () => Promise<void>;
}) {
  const [analyticsState, setAnalyticsState] = useState(storageAnalytics);
  const [filesState, setFilesState] = useState(storageFiles);
  const [currentPath, setCurrentPath] = useState(
    storageFiles.status === "ready" ? storageFiles.data.path : "",
  );
  const [folderName, setFolderName] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [renamingPath, setRenamingPath] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [confirmDeletePath, setConfirmDeletePath] = useState<string | null>(
    null,
  );
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const refreshStorage = async (path = currentPath) => {
    setBusy(true);
    setMessage(null);
    setCurrentPath(path);

    try {
      const filesUrl = new URL("/api/admin/storage", window.location.origin);
      if (path) {
        filesUrl.searchParams.set("path", path);
      }

      const [filesResponse, analyticsResponse] = await Promise.all([
        adminFetch(filesUrl, { cache: "no-store" }),
        adminFetch("/api/admin/storage/analytics", { cache: "no-store" }),
      ]);
      const filesPayload = (await filesResponse.json().catch(() => null)) as {
        data?: unknown;
        error?: string;
      } | null;
      const analyticsPayload = (await analyticsResponse
        .json()
        .catch(() => null)) as unknown;

      if (filesResponse.ok && isStorageFilesPayload(filesPayload?.data)) {
        setFilesState({ data: filesPayload.data, status: "ready" });
      } else {
        setFilesState({
          message: filesPayload?.error ?? "Files are not available right now.",
          status: "unavailable",
        });
      }

      if (analyticsResponse.ok && isStorageAnalyticsState(analyticsPayload)) {
        setAnalyticsState(analyticsPayload);
      }
    } catch {
      setFilesState({
        message: "Files are not available right now.",
        status: "unavailable",
      });
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (
      analyticsState.status === "unavailable" &&
      filesState.status === "unavailable"
    ) {
      const timeout = window.setTimeout(() => void refreshStorage(""), 0);

      return () => window.clearTimeout(timeout);
    }
    // StoragePanel only mounts when the Storage tab opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runStorageMutation = async (
    request: Promise<Response>,
    successMessage: string,
    refreshPath = currentPath,
  ) => {
    setBusy(true);
    setMessage(null);

    try {
      const response = await request;
      const payload = (await response.json().catch(() => null)) as {
        data?: { detachedAssets?: number; updatedAssets?: number };
        error?: string;
      } | null;

      if (!response.ok) {
        setMessage(payload?.error ?? "Storage request failed.");
        return;
      }

      const changedLinks =
        (payload?.data?.detachedAssets ?? 0) +
        (payload?.data?.updatedAssets ?? 0);
      const successText =
        changedLinks > 0
          ? `${successMessage} ${changedLinks} saved item${changedLinks === 1 ? "" : "s"} updated.`
          : successMessage;
      setConfirmDeletePath(null);
      setRenamingPath(null);
      await refreshStorage(refreshPath);
      setMessage(successText);
      await onResourcesChanged();
    } catch {
      setMessage("Storage request failed.");
    } finally {
      setBusy(false);
    }
  };

  const uploadSelectedFile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!uploadFile) {
      setMessage(RICHFIELD_ADMIN_COPY.storage.chooseFile);
      return;
    }

    const body = new FormData();
    body.set("file", uploadFile);
    body.set("path", currentPath);
    body.set("upsert", "true");

    await runStorageMutation(
      adminFetch("/api/admin/storage", {
        body,
        method: "POST",
      }),
      RICHFIELD_ADMIN_COPY.storage.uploadDone,
    );
    setUploadFile(null);
  };

  const createFolder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = folderName.trim();
    if (!name) return;

    await runStorageMutation(
      adminFetch("/api/admin/storage", {
        body: JSON.stringify({ name, path: currentPath }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      }),
      RICHFIELD_ADMIN_COPY.storage.folderDone,
    );
    setFolderName("");
  };

  const renameItem = (item: RichfieldStorageFileItem) => {
    void runStorageMutation(
      adminFetch("/api/admin/storage", {
        body: JSON.stringify({
          kind: item.kind,
          newName: renameValue.trim(),
          path: item.path,
        }),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      }),
      RICHFIELD_ADMIN_COPY.storage.renameDone,
      storageParentPath(item.path),
    );
  };

  const deleteItem = (item: RichfieldStorageFileItem) => {
    void runStorageMutation(
      adminFetch("/api/admin/storage", {
        body: JSON.stringify({ kind: item.kind, path: item.path }),
        headers: { "Content-Type": "application/json" },
        method: "DELETE",
      }),
      RICHFIELD_ADMIN_COPY.storage.deleteDone,
      storageParentPath(item.path),
    );
  };

  const openFile = async (item: RichfieldStorageFileItem) => {
    setBusy(true);
    setMessage(null);

    try {
      const url = new URL("/api/admin/storage", window.location.origin);
      url.searchParams.set("filePath", item.path);
      const response = await adminFetch(url, { cache: "no-store" });
      const payload = (await response.json().catch(() => null)) as {
        data?: { signedUrl?: string };
        error?: string;
      } | null;

      if (!response.ok || !payload?.data?.signedUrl) {
        setMessage(payload?.error ?? "File could not be opened.");
        return;
      }

      window.open(payload.data.signedUrl, "_blank", "noopener,noreferrer");
    } catch {
      setMessage("File could not be opened.");
    } finally {
      setBusy(false);
    }
  };

  if (
    analyticsState.status === "unavailable" &&
    filesState.status === "unavailable"
  ) {
    return (
      <section className="parchment-card min-w-0 p-5 sm:p-6">
        <p className="script-label">{RICHFIELD_ADMIN_COPY.storage.title}</p>
        <h2 className="break-words font-display text-4xl leading-none text-[var(--navy)] sm:text-5xl">
          {RICHFIELD_ADMIN_COPY.storage.unavailableTitle}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--ink-soft)]">
          {analyticsState.message}
        </p>
        <Link
          className="button-secondary mt-5 inline-flex"
          href={driveHref}
          rel="noreferrer"
          target="_blank"
        >
          {RICHFIELD_ADMIN_COPY.storage.driveLink}
        </Link>
      </section>
    );
  }

  const data = analyticsState.status === "ready" ? analyticsState.data : null;
  const usagePercentage = data
    ? Math.max(0, Math.min(100, data.usagePercentage))
    : 0;
  const files = filesState.status === "ready" ? filesState.data.items : [];
  const pathLabel = currentPath || RICHFIELD_ADMIN_COPY.storage.root;

  return (
    <section className="grid min-w-0 gap-4 lg:grid-cols-3">
      {data ? (
        <div className="parchment-card min-w-0 p-5 sm:p-6 lg:col-span-3">
          <p className="script-label">{RICHFIELD_ADMIN_COPY.storage.title}</p>
          <div className="mt-2 grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="min-w-0">
              <h2 className="break-words font-display text-4xl leading-none text-[var(--navy)] sm:text-5xl">
                {RICHFIELD_ADMIN_COPY.storage.heading}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--ink-soft)]">
                {RICHFIELD_ADMIN_COPY.storage.description}
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--ink-soft)]">
                {RICHFIELD_ADMIN_COPY.storage.driveDescription}
              </p>
            </div>
            <div className="grid gap-3 text-left lg:text-right">
              <strong className="font-display text-4xl leading-none text-[var(--clay)] sm:text-5xl">
                {usagePercentage.toFixed(usagePercentage % 1 === 0 ? 0 : 1)}%
              </strong>
              <Link
                className="button-secondary w-full lg:w-auto"
                href={driveHref}
                rel="noreferrer"
                target="_blank"
              >
                {RICHFIELD_ADMIN_COPY.storage.driveLink}
              </Link>
            </div>
          </div>
          <div className="mt-6 h-3 overflow-hidden border border-[rgba(184,112,81,0.34)] bg-white/72">
            <div
              className="h-full bg-[var(--clay)]"
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
        </div>
      ) : null}

      {data ? (
        <>
          <StorageMetric
            detail={`${formatBytes(data.totalSize)} ${RICHFIELD_ADMIN_COPY.storage.of} ${formatBytes(
              data.storageLimit,
            )}`}
            label={RICHFIELD_ADMIN_COPY.storage.used}
            value={formatBytes(data.totalSize)}
          />
          <StorageMetric
            label={RICHFIELD_ADMIN_COPY.storage.limit}
            value={formatBytes(data.storageLimit)}
          />
          <StorageMetric
            label={RICHFIELD_ADMIN_COPY.storage.files}
            value={String(data.fileCount)}
          />
          <StorageFileHighlight
            file={data.largestFile}
            label={RICHFIELD_ADMIN_COPY.storage.largest}
          />
          <StorageFileHighlight
            file={data.smallestFile}
            label={RICHFIELD_ADMIN_COPY.storage.smallest}
          />
        </>
      ) : null}

      <div className="parchment-card grid min-w-0 gap-5 p-5 sm:p-6 lg:col-span-3">
        <p className="script-label">{RICHFIELD_ADMIN_COPY.storage.title}</p>
        <div className="grid min-w-0 gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div className="min-w-0">
            <h3 className="break-words font-display text-3xl leading-none text-[var(--navy)] sm:text-4xl">
              {pathLabel}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
              {RICHFIELD_ADMIN_COPY.storage.uploadHelp}
            </p>
          </div>
          <div className="grid gap-2 sm:flex sm:flex-wrap">
            {currentPath ? (
              <button
                className="button-secondary min-h-10 px-4 text-xs"
                disabled={busy}
                onClick={() =>
                  void refreshStorage(storageParentPath(currentPath))
                }
                type="button"
              >
                {RICHFIELD_ADMIN_COPY.storage.back}
              </button>
            ) : null}
            <button
              className="button-secondary min-h-10 px-4 text-xs"
              disabled={busy}
              onClick={() => void refreshStorage(currentPath)}
              type="button"
            >
              {RICHFIELD_ADMIN_COPY.storage.refresh}
            </button>
          </div>
        </div>

        {message ? (
          <div className="border border-[rgba(184,112,81,0.34)] bg-white/68 px-4 py-3 text-sm text-[var(--ink-soft)]">
            {message}
          </div>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-2">
          <form
            className="grid min-w-0 gap-3 border border-[rgba(184,112,81,0.34)] bg-white/58 p-4"
            onSubmit={uploadSelectedFile}
          >
            <label className="grid min-w-0 gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--clay)]">
                {RICHFIELD_ADMIN_COPY.storage.chooseFile}
              </span>
              <input
                className="min-h-11 w-full min-w-0 border border-[rgba(184,112,81,0.42)] bg-white/78 px-3 py-2 text-sm text-[var(--ink)]"
                onChange={(event) =>
                  setUploadFile(event.currentTarget.files?.[0] ?? null)
                }
                type="file"
              />
            </label>
            <button
              className="button-primary w-full"
              disabled={busy || !uploadFile}
              type="submit"
            >
              {RICHFIELD_ADMIN_COPY.storage.upload}
            </button>
          </form>

          <form
            className="grid min-w-0 gap-3 border border-[rgba(184,112,81,0.34)] bg-white/58 p-4"
            onSubmit={createFolder}
          >
            <label className="grid min-w-0 gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--clay)]">
                {RICHFIELD_ADMIN_COPY.storage.folderName}
              </span>
              <input
                className="min-h-11 w-full min-w-0 border border-[rgba(184,112,81,0.42)] bg-white/78 px-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--gold)]"
                onChange={(event) => setFolderName(event.currentTarget.value)}
                value={folderName}
              />
            </label>
            <button
              className="button-secondary w-full"
              disabled={busy || !folderName.trim()}
              type="submit"
            >
              {RICHFIELD_ADMIN_COPY.storage.createFolder}
            </button>
          </form>
        </div>

        <div className="grid gap-3">
          {filesState.status === "unavailable" ? (
            <p className="text-sm leading-6 text-[var(--ink-soft)]">
              {filesState.message}
            </p>
          ) : files.length > 0 ? (
            files.map((item) => (
              <StorageFileRow
                busy={busy}
                confirmDeletePath={confirmDeletePath}
                item={item}
                key={item.path}
                onDelete={deleteItem}
                onOpen={(file) => void openFile(file)}
                onOpenFolder={(path) => void refreshStorage(path)}
                onRename={renameItem}
                renameValue={renameValue}
                renamingPath={renamingPath}
                setConfirmDeletePath={setConfirmDeletePath}
                setRenameValue={setRenameValue}
                setRenamingPath={setRenamingPath}
              />
            ))
          ) : (
            <p className="border border-dashed border-[rgba(184,112,81,0.5)] bg-white/58 p-6 text-sm leading-6 text-[var(--ink-soft)]">
              {RICHFIELD_ADMIN_COPY.storage.emptyFiles}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function MembersPanel({ membersHref }: { membersHref: string }) {
  const [members, setMembers] = useState<RichfieldAdminMember[]>([]);
  const [context, setContext] = useState<RichfieldAdminMembersContext | null>(
    null,
  );
  const [status, setStatus] = useState<"error" | "loading" | "ready">(
    "loading",
  );
  const [message, setMessage] = useState<string>(
    RICHFIELD_ADMIN_COPY.members.loading,
  );

  useEffect(() => {
    let active = true;

    const loadMembers = async () => {
      setStatus("loading");
      setMessage(RICHFIELD_ADMIN_COPY.members.loading);

      try {
        const response = await adminFetch("/api/admin/members", {
          cache: "no-store",
        });
        const payload = (await response
          .json()
          .catch(() => ({}))) as MembersResponse;

        if (!active) return;

        if (!response.ok || !payload.members) {
          setStatus("error");
          setMessage(payload.error ?? RICHFIELD_ADMIN_COPY.members.unavailable);
          return;
        }

        setMembers(payload.members);
        setContext(payload.context ?? null);
        setStatus("ready");
      } catch {
        if (!active) return;
        setStatus("error");
        setMessage(RICHFIELD_ADMIN_COPY.members.unavailable);
      }
    };

    void loadMembers();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="parchment-card grid min-w-0 gap-5 p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="script-label">{RICHFIELD_ADMIN_COPY.members.title}</p>
          <h2 className="break-words font-display text-4xl leading-none text-[var(--navy)] sm:text-5xl">
            {context?.boundProjectName ?? "Site team"}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--ink-soft)]">
            {RICHFIELD_ADMIN_COPY.members.description}
          </p>
        </div>
        <Link
          className="button-primary w-full sm:w-auto"
          href={membersHref}
          rel="noreferrer"
          target="_blank"
        >
          {RICHFIELD_ADMIN_COPY.members.manage}
        </Link>
      </div>

      {status === "loading" || status === "error" ? (
        <div className="border border-[rgba(184,112,81,0.34)] bg-white/68 px-4 py-3 text-sm text-[var(--ink-soft)]">
          {message}
        </div>
      ) : null}

      {status === "ready" && members.length === 0 ? (
        <p className="border border-dashed border-[rgba(184,112,81,0.5)] bg-white/58 p-6 text-sm leading-6 text-[var(--ink-soft)]">
          {RICHFIELD_ADMIN_COPY.members.empty}
        </p>
      ) : null}

      {members.length > 0 ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {members.map((member) => (
            <div
              className="grid min-w-0 gap-2 border border-[rgba(184,112,81,0.34)] bg-white/68 p-4"
              key={member.id}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid size-11 shrink-0 place-items-center bg-[var(--navy)] font-display text-xl text-[var(--parchment)]">
                  {member.initials}
                </span>
                <div className="min-w-0">
                  <strong className="block truncate text-[var(--ink)]">
                    {member.name}
                  </strong>
                  {member.email ? (
                    <span className="mt-1 block truncate text-sm text-[var(--ink-soft)]">
                      {member.email}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="border border-[rgba(184,112,81,0.34)] bg-white/72 px-2 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[var(--clay)]">
                  {member.status}
                </span>
                <span className="border border-[rgba(31,107,115,0.22)] bg-[rgba(31,107,115,0.08)] px-2 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[var(--teal)]">
                  {member.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function statusLabel(status: RichfieldContentStatus) {
  return RICHFIELD_ADMIN_COPY.visibility[status];
}

function statusClass(status: RichfieldContentStatus) {
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

function draftFromItem(item: RichfieldAdminContentItem | null): Draft {
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

function draftWithPreset(
  item: RichfieldAdminContentItem | null,
  preset?: Partial<Draft>,
) {
  return { ...draftFromItem(item), ...preset };
}

function readFriendlyError(payload: MutationResponse, fallback: string) {
  return Object.values(payload.errors ?? {})[0] ?? fallback;
}

function contentItemMetaLabel(
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

function collectionSupportsImage(collectionKey: RichfieldAdminCollectionKey) {
  return (
    collectionKey === "image-library" ||
    collectionKey === "articles" ||
    collectionKey === "jobs"
  );
}

function ContentCardCover({ item }: { item: RichfieldAdminContentItem }) {
  return (
    <span
      className={`relative block min-h-28 overflow-hidden border border-[rgba(184,112,81,0.34)] bg-[rgba(239,207,178,0.55)] bg-cover bg-center ${
        item.imageUrl ? "" : "grid place-items-center"
      }`}
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

function toWebpFileName(name: string) {
  const base = name.replace(/\.[^./\\]+$/u, "");
  return `${base || "image"}.webp`;
}

const MAX_ADMIN_IMAGE_UPLOAD_BYTES = 12 * 1024 * 1024;

// Convert an uploaded raster image to WebP in the browser before it is sent to
// the platform, so stored gallery assets stay small. Vector and animated
// formats are left untouched (rasterizing an SVG logo or flattening a GIF would
// lose quality or motion), and we keep the original whenever WebP is not
// actually smaller.
async function convertImageToWebp(file: File): Promise<File> {
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

function EditorCoverSummary({
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
    <aside className="grid min-w-0 gap-2 border border-[rgba(184,112,81,0.38)] bg-white p-3">
      <span
        className={`relative block min-h-36 overflow-hidden border border-[rgba(184,112,81,0.28)] bg-[rgba(239,207,178,0.55)] bg-cover ${
          hasVisibleCover ? "" : "grid place-items-center"
        }`}
        style={
          hasVisibleCover && item?.imageUrl
            ? {
                backgroundImage: `url(${JSON.stringify(item.imageUrl)})`,
                backgroundPosition: draft.objectPosition?.trim() || "center",
              }
            : undefined
        }
      >
        {hasVisibleCover ? (
          <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,31,52,0.02),rgba(12,31,52,0.14))]" />
        ) : (
          <span className="px-3 text-center text-xs font-bold uppercase tracking-[0.14em] text-[var(--ink-soft)]">
            Cover preview
          </span>
        )}
      </span>
      <span className="truncate text-xs font-bold uppercase tracking-[0.14em] text-[var(--clay)]">
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

function EditorStepHeader({ step }: { step: RichfieldEditorStepId }) {
  const copy = RICHFIELD_ADMIN_COPY.editor.steps[step];

  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--clay)]">
        {copy.label}
      </p>
      <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
        {copy.description}
      </p>
    </div>
  );
}

function TextField<TName extends keyof Draft>({
  disabled,
  error,
  label,
  name,
  onChange,
  placeholder,
  required,
  value,
}: {
  disabled?: boolean;
  error?: string;
  label: string;
  name: TName;
  onChange: (name: TName, value: string) => void;
  placeholder?: string;
  required?: boolean;
  value: string;
}) {
  return (
    <label className="grid min-w-0 gap-2">
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--clay)]">
        {label}
      </span>
      <input
        className={`min-h-11 w-full min-w-0 border bg-white px-3 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--gold)] ${
          error ? "border-red-400" : "border-[rgba(184,112,81,0.42)]"
        } disabled:cursor-not-allowed disabled:bg-[var(--parchment)] disabled:text-[var(--ink-soft)]`}
        disabled={disabled}
        name={name}
        onChange={(event) => onChange(name, event.currentTarget.value)}
        placeholder={placeholder}
        required={required}
        value={value}
      />
      {error ? <span className="text-xs text-red-700">{error}</span> : null}
    </label>
  );
}

function NumberField<TName extends keyof Draft>({
  disabled,
  label,
  name,
  onChange,
  placeholder,
  value,
}: {
  disabled?: boolean;
  label: string;
  name: TName;
  onChange: (name: TName, value: string) => void;
  placeholder?: string;
  value: string;
}) {
  return (
    <label className="grid min-w-0 gap-2">
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--clay)]">
        {label}
      </span>
      <input
        className="min-h-11 w-full min-w-0 border border-[rgba(184,112,81,0.48)] bg-white px-3 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--gold)] disabled:cursor-not-allowed disabled:bg-[var(--parchment)] disabled:text-[var(--ink-soft)]"
        disabled={disabled}
        inputMode="numeric"
        name={name}
        onChange={(event) =>
          onChange(name, event.currentTarget.value.replace(/[^\d]/g, ""))
        }
        placeholder={placeholder}
        type="text"
        value={value}
      />
    </label>
  );
}

function SelectField<TName extends keyof Draft>({
  disabled,
  label,
  name,
  onChange,
  options,
  placeholder = "Choose one",
  value,
}: {
  disabled?: boolean;
  label: string;
  name: TName;
  onChange: (name: TName, value: string) => void;
  options: Array<{ label: string; value: string }>;
  placeholder?: string;
  value: string;
}) {
  const hasCurrentValue =
    value.trim() && !options.some((option) => option.value === value);

  return (
    <label className="grid min-w-0 gap-2">
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--clay)]">
        {label}
      </span>
      <select
        className="min-h-11 w-full min-w-0 border border-[rgba(184,112,81,0.48)] bg-white px-3 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--gold)] disabled:cursor-not-allowed disabled:bg-[var(--parchment)] disabled:text-[var(--ink-soft)]"
        disabled={disabled}
        name={name}
        onChange={(event) => onChange(name, event.currentTarget.value)}
        value={value}
      >
        <option value="">{placeholder}</option>
        {hasCurrentValue ? <option value={value}>{value}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextAreaField<TName extends keyof Draft>({
  disabled,
  label,
  name,
  onChange,
  placeholder,
  rows = 4,
  value,
}: {
  disabled?: boolean;
  label: string;
  name: TName;
  onChange: (name: TName, value: string) => void;
  placeholder?: string;
  rows?: number;
  value: string;
}) {
  return (
    <label className="grid min-w-0 gap-2">
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--clay)]">
        {label}
      </span>
      <textarea
        className="min-h-28 w-full min-w-0 resize-y border border-[rgba(184,112,81,0.48)] bg-white px-3 py-3 text-sm leading-6 text-[var(--ink)] outline-none transition focus:border-[var(--gold)] disabled:cursor-not-allowed disabled:bg-[var(--parchment)] disabled:text-[var(--ink-soft)]"
        disabled={disabled}
        name={name}
        onChange={(event) => onChange(name, event.currentTarget.value)}
        placeholder={placeholder}
        rows={rows}
        value={value}
      />
    </label>
  );
}

function CheckboxField<TName extends keyof Draft>({
  description,
  disabled,
  label,
  name,
  onChange,
  value,
}: {
  description: string;
  disabled?: boolean;
  label: string;
  name: TName;
  onChange: (name: TName, value: boolean) => void;
  value: boolean;
}) {
  return (
    <label className="flex items-start gap-3 border border-[rgba(184,112,81,0.32)] bg-white/58 px-3 py-3 text-sm text-[var(--ink)]">
      <input
        checked={value}
        className="mt-0.5 size-4 accent-[var(--clay)]"
        disabled={disabled}
        name={name}
        onChange={(event) => onChange(name, event.currentTarget.checked)}
        type="checkbox"
      />
      <span className="grid gap-1">
        <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--clay)]">
          {label}
        </span>
        <span className="text-xs leading-5 text-[var(--ink-soft)]">
          {description}
        </span>
      </span>
    </label>
  );
}

function ContentList({
  collectionKey,
  items,
  onNew,
  onSelect,
  selectedId,
}: {
  collectionKey: RichfieldAdminCollectionKey;
  items: RichfieldAdminContentItem[];
  onNew: () => void;
  onSelect: (id: string) => void;
  selectedId: string | null;
}) {
  const copy = sectionCopy[collectionKey];

  return (
    <section className="grid min-w-0 content-start gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="script-label">{copy.listTitle}</p>
          <h2 className="font-display text-4xl leading-none text-[var(--navy)] sm:text-5xl">
            Manage {copy.listTitle.toLowerCase()}
          </h2>
        </div>
        <button
          className={`min-h-11 w-full border px-4 text-sm font-bold transition sm:w-auto ${
            selectedId === null
              ? "border-[var(--gold)] bg-[var(--navy)] text-[var(--parchment)]"
              : "border-[rgba(184,112,81,0.48)] bg-white/72 text-[var(--copper-dark)] hover:border-[var(--gold)]"
          }`}
          onClick={onNew}
          type="button"
        >
          {copy.newLabel}
        </button>
      </div>

      {items.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <button
              className={`grid min-w-0 gap-4 border bg-white/72 p-4 text-left transition ${
                selectedId === item.id
                  ? "border-[var(--gold)] shadow-[0_18px_46px_rgba(82,40,37,0.12)]"
                  : "border-[rgba(184,112,81,0.38)] hover:border-[var(--copper)]"
              }`}
              key={item.id}
              onClick={() => onSelect(item.id)}
              type="button"
            >
              <div className="grid min-w-0 gap-4 sm:grid-cols-[112px_minmax(0,1fr)]">
                <ContentCardCover item={item} />
                <div className="grid min-w-0 content-start gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`border px-2 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] ${statusClass(
                        item.status,
                      )}`}
                    >
                      {statusLabel(item.status)}
                    </span>
                    {item.imageUrl ? (
                      <span className="border border-[rgba(31,107,115,0.22)] bg-[rgba(31,107,115,0.08)] px-2 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[var(--teal)]">
                        Image ready
                      </span>
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <strong className="block break-words text-base text-[var(--ink)]">
                      {item.title}
                    </strong>
                    <span className="mt-1 block break-words text-sm text-[var(--ink-soft)]">
                      {contentItemMetaLabel(collectionKey, item)}
                    </span>
                  </div>
                  {item.summary ? (
                    <span className="line-clamp-2 text-xs leading-5 text-[var(--ink-soft)]">
                      {item.summary}
                    </span>
                  ) : null}
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-[rgba(184,112,81,0.5)] bg-white/68 p-6">
          <h3 className="font-display text-3xl leading-none text-[var(--navy)]">
            Nothing here yet.
          </h3>
          <p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">
            {copy.empty}
          </p>
        </div>
      )}
    </section>
  );
}

function ContentForm({
  collectionKey,
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
      setMessage("Choose an image smaller than 12MB.");
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
      label: "Checking content",
      percent: 2,
      status: "running",
      step: "validate",
    });

    const body = new FormData();
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
      toast.success(RICHFIELD_ADMIN_COPY.editor.saved);
    } catch (error) {
      const saveError = error as SaveFlowError;
      const fallback =
        saveError instanceof Error
          ? saveError.message
          : RICHFIELD_ADMIN_COPY.errors.save;
      setFieldErrors(saveError.errors ?? {});
      setSaveProgress((current) => ({
        error: readFriendlyError(
          { error: fallback, errors: saveError.errors },
          RICHFIELD_ADMIN_COPY.errors.save,
        ),
        label: saveError.label ?? current.label ?? "Save failed",
        percent: Math.max(current.percent, 1),
        status: "error",
        statusCode: saveError.statusCode,
        step: saveError.step ?? current.step,
      }));
      toast.error(RICHFIELD_ADMIN_COPY.errors.save);
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
        setMessage(RICHFIELD_ADMIN_COPY.errors.delete);
        return;
      }

      onDeleted(payload.items ?? []);
      onClose();
    } catch {
      setMessage(RICHFIELD_ADMIN_COPY.errors.delete);
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
              {effectiveItem ? "Edit image" : copy.newLabel}
            </p>
            <h2 className="break-words font-display text-3xl leading-none text-[var(--navy)] sm:text-4xl">
              {draft.title || `Untitled ${copy.singular}`}
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
                {RICHFIELD_ADMIN_COPY.editor.openPreview}
              </Link>
            ) : null}
            <button
              className="button-secondary disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isBusy}
              onClick={onCloseRequest}
              type="button"
            >
              Close
            </button>
            <button
              className="button-primary disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!canSave || imageProcessing}
              type="submit"
            >
              {submitting
                ? RICHFIELD_ADMIN_COPY.actions.saving
                : RICHFIELD_ADMIN_COPY.actions.save}
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
          aria-label="Replace image"
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
              alt={draft.imageAlt || effectiveItem?.title || "Image"}
              className="h-full w-full object-cover"
              src={previewImageSrc as string}
              style={{ objectPosition: draft.objectPosition?.trim() || "center" }}
            />
          ) : (
            <div className="grid h-full place-items-center px-4 text-center text-sm text-[var(--ink-soft)]">
              No image yet.
            </div>
          )}
          {imageFile ? (
            <span className="absolute left-3 top-3 border border-[var(--gold)] bg-[var(--navy)] px-2 py-1 text-[0.6rem] font-black uppercase tracking-[0.14em] text-[var(--parchment)]">
              New
            </span>
          ) : null}
          <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 bg-[rgba(12,31,52,0.74)] px-3 py-2 text-xs text-[var(--parchment)]">
            <span className="font-bold">
              {imageProcessing
                ? "Optimizing…"
                : showImagePreview
                  ? "Drag or click to replace"
                  : "Drag or click to add"}
            </span>
            <span className="opacity-80">WebP · up to 12MB</span>
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
              <span>Remove &ldquo;{effectiveItem.title}&rdquo; from the site?</span>
              <div className="flex gap-2">
                <button
                  className="min-h-9 bg-red-800 px-3 text-sm font-bold text-white disabled:opacity-50"
                  disabled={isBusy}
                  onClick={() => void deleteItem()}
                  type="button"
                >
                  {deleting ? "Removing" : RICHFIELD_ADMIN_COPY.actions.delete}
                </button>
                <button
                  className="button-secondary min-h-9"
                  disabled={isBusy}
                  onClick={() => setConfirmDelete(false)}
                  type="button"
                >
                  {RICHFIELD_ADMIN_COPY.actions.keep}
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
              Remove image
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
              {effectiveItem ? `Edit ${copy.singular}` : copy.newLabel}
            </p>
            <h2 className="break-words font-display text-4xl leading-none text-[var(--navy)] sm:text-5xl">
              {draft.title || `Untitled ${copy.singular}`}
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
              {RICHFIELD_ADMIN_COPY.editor.openPreview}
            </Link>
          ) : null}
          <button
            className="button-secondary min-w-28 w-full disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            disabled={isBusy}
            onClick={onCloseRequest}
            type="button"
          >
            Close
          </button>
          <button
            className="button-primary min-w-28 w-full disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            disabled={!canSave || imageProcessing}
            type="submit"
          >
            {submitting
              ? RICHFIELD_ADMIN_COPY.actions.saving
              : RICHFIELD_ADMIN_COPY.actions.save}
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
        aria-label="Editor sections"
        className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5"
      >
        {editorSteps.map((step, index) => {
          const stepCopy = RICHFIELD_ADMIN_COPY.editor.steps[step];
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
                Step {index + 1}
              </span>
              <span className="truncate text-sm font-black">
                {stepCopy.label}
              </span>
              <span className="truncate text-xs opacity-75">
                {stepCopy.description}
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
              label={collectionKey === "milestones" ? "Brand" : "Name"}
              name="title"
              onChange={updateDraft}
              required
              value={draft.title}
            />
            <label className="grid gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--clay)]">
                {RICHFIELD_ADMIN_COPY.editor.visibility}
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
                    {option.label}
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
              label="Website link"
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
                label="Author"
                name="author"
                onChange={updateDraft}
                value={draft.author}
              />
              <TextField
                disabled={isBusy}
                label="Topic"
                name="category"
                onChange={updateDraft}
                value={draft.category}
              />
              <TextField
                disabled={isBusy}
                label="Publish date"
                name="publishedAt"
                onChange={updateDraft}
                placeholder="2026-07-23"
                value={draft.publishedAt}
              />
              <NumberField
                disabled={isBusy}
                label="Sort order"
                name="sortOrder"
                onChange={updateDraft}
                value={draft.sortOrder}
              />
              <CheckboxField
                description="Pin this article to the top of the insights feed."
                disabled={isBusy}
                label="Featured story"
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
                label="Category"
                name="category"
                onChange={updateDraft}
                options={categoryOptions}
                placeholder="Choose a category"
                value={draft.category}
              />
              <TextField
                disabled={isBusy}
                label="Country"
                name="country"
                onChange={updateDraft}
                value={draft.country}
              />
              <NumberField
                disabled={isBusy}
                label="Year"
                name="year"
                onChange={updateDraft}
                value={draft.year}
              />
              <TextField
                disabled={isBusy}
                label="Accent color"
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
              label="Role"
              name="role"
              onChange={updateDraft}
              value={draft.role}
            />
          ) : null}
          {collectionKey === "milestones" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                disabled={isBusy}
                label="Country"
                name="country"
                onChange={updateDraft}
                value={draft.country}
              />
              <NumberField
                disabled={isBusy}
                label="Year"
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
                label="Map query"
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
                label="Recipient email"
                name="email"
                onChange={updateDraft}
                value={draft.email}
              />
              <TextField
                disabled={isBusy}
                label="Submit button label"
                name="cta"
                onChange={updateDraft}
                value={draft.cta}
              />
              <NumberField
                disabled={isBusy}
                label="Maximum message length"
                name="positions"
                onChange={updateDraft}
                value={draft.positions}
              />
              <TextField
                disabled={isBusy}
                label="Inquiry types"
                name="usageTags"
                onChange={updateDraft}
                placeholder="Brand partnership, Careers, Press"
                value={draft.usageTags}
              />
            </div>
          ) : null}
          {collectionKey === "contact-channels" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <SelectField
                disabled={isBusy}
                label="Kind"
                name="kind"
                onChange={updateDraft}
                options={contactKindOptions}
                placeholder="Choose a kind"
                value={draft.kind}
              />
              <TextField
                disabled={isBusy}
                label="Link"
                name="href"
                onChange={updateDraft}
                value={draft.href}
              />
              <TextField
                disabled={isBusy}
                label="Secondary text"
                name="subtitle"
                onChange={updateDraft}
                value={draft.subtitle}
              />
              <TextField
                disabled={isBusy}
                label="CTA"
                name="cta"
                onChange={updateDraft}
                value={draft.cta}
              />
              <NumberField
                disabled={isBusy}
                label="Sort order"
                name="sortOrder"
                onChange={updateDraft}
                value={draft.sortOrder}
              />
              <CheckboxField
                description="Open this contact channel in a new tab."
                disabled={isBusy}
                label="External link"
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
                label="Name"
                name="name"
                onChange={updateDraft}
                value={draft.name}
              />
              <TextField
                disabled={isBusy}
                label="Company"
                name="brand"
                onChange={updateDraft}
                value={draft.brand}
              />
              <TextField
                disabled={isBusy}
                label="Email"
                name="email"
                onChange={updateDraft}
                value={draft.email}
              />
              <TextField
                disabled={isBusy}
                label="Inquiry type"
                name="inquiryType"
                onChange={updateDraft}
                value={draft.inquiryType}
              />
              <TextField
                disabled={isBusy}
                label="Submission status"
                name="submissionStatus"
                onChange={updateDraft}
                value={draft.submissionStatus}
              />
              <TextField
                disabled={isBusy}
                label="Email notification"
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
                label="Department"
                name="department"
                onChange={updateDraft}
                value={draft.department}
              />
              <TextField
                disabled={isBusy}
                label="Employment type"
                name="employmentType"
                onChange={updateDraft}
                placeholder="Full-time"
                value={draft.employmentType}
              />
              <TextField
                disabled={isBusy}
                label="Work mode"
                name="workMode"
                onChange={updateDraft}
                placeholder="On-site, hybrid, or remote"
                value={draft.workMode}
              />
              <NumberField
                disabled={isBusy}
                label="Positions"
                name="positions"
                onChange={updateDraft}
                value={draft.positions}
              />
              <TextField
                disabled={isBusy}
                label="Location"
                name="location"
                onChange={updateDraft}
                value={draft.location}
              />
              <TextField
                disabled={isBusy}
                label="Deadline"
                name="deadline"
                onChange={updateDraft}
                value={draft.deadline}
              />
              <TextField
                disabled={isBusy}
                label="External link"
                name="href"
                onChange={updateDraft}
                value={draft.href}
              />
              <TextField
                disabled={isBusy}
                label="Applications email"
                name="applyEmail"
                onChange={updateDraft}
                value={draft.applyEmail}
              />
              <NumberField
                disabled={isBusy}
                label="Sort order"
                name="sortOrder"
                onChange={updateDraft}
                value={draft.sortOrder}
              />
            </div>
          ) : null}
          <TextAreaField
            disabled={isBusy}
            label={
              collectionKey === "brands"
                ? "Story"
                : collectionKey === "contact-channels"
                  ? "Primary text"
                  : "Summary"
            }
            name="summary"
            onChange={updateDraft}
            value={draft.summary}
          />
          {collectionKey === "brands" ? (
            <div className="grid gap-4">
              <CheckboxField
                description="Highlight this brand on the homepage."
                disabled={isBusy}
                label="Feature this brand"
                name="feature"
                onChange={updateDraft}
                value={draft.feature}
              />
              <TextField
                disabled={isBusy}
                label="Feature caption"
                name="featureCaption"
                onChange={updateDraft}
                value={draft.featureCaption}
              />
            </div>
          ) : null}
          {collectionKey === "milestones" ? (
            <CheckboxField
              description="Show this milestone on the About page only, not the homepage."
              disabled={isBusy}
              label="About page only"
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
              <TextAreaField
                disabled={isBusy}
                label="Bio"
                name="body"
                onChange={updateDraft}
                rows={8}
                value={draft.body}
              />
              <TextAreaField
                disabled={isBusy}
                label="Quote"
                name="subtitle"
                onChange={updateDraft}
                value={draft.subtitle}
              />
            </div>
          ) : null}
          {collectionKey === "contact-page" ? (
            <TextAreaField
              disabled={isBusy}
              label="Intro"
              name="body"
              onChange={updateDraft}
              rows={8}
              value={draft.body || draft.summary}
            />
          ) : null}
          {collectionKey === "contact-form" ? (
            <RichTextEditor
              disabled={isBusy}
              label="Success message"
              onChange={(value) => {
                updateDraft("body", value);
                updateDraft("summary", value);
              }}
              value={draft.body || draft.summary}
            />
          ) : null}
          {collectionKey === "contact-submissions" ? (
            <TextAreaField
              disabled={isBusy}
              label="Message"
              name="body"
              onChange={updateDraft}
              rows={8}
              value={draft.body || draft.summary}
            />
          ) : null}
          {collectionKey === "articles" || collectionKey === "jobs" ? (
            <RichTextEditor
              disabled={isBusy}
              label={collectionKey === "jobs" ? "Position description" : "Article"}
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
            {RICHFIELD_ADMIN_COPY.editor.imageHelp}
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
                    alt={draft.imageAlt || effectiveItem?.title || "Preview"}
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
                aria-label="Upload image"
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
                    : "Drag an image here or click to browse"}
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
                label="Image description"
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
                  {deleting ? "Deleting" : RICHFIELD_ADMIN_COPY.actions.delete}
                </button>
                <button
                  className="button-secondary min-h-10"
                  disabled={isBusy}
                  onClick={() => setConfirmDelete(false)}
                  type="button"
                >
                  {RICHFIELD_ADMIN_COPY.actions.keep}
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

export function RichfieldAdminDashboard({
  driveHref,
  initialContent,
  membersHref,
  sessionExpiresAt,
  sessionRefreshEarlySeconds,
  storageAnalytics,
  storageFiles,
  userEmail,
}: {
  driveHref: string;
  initialContent: DashboardContent;
  membersHref: string;
  sessionExpiresAt: string;
  sessionRefreshEarlySeconds?: number;
  storageAnalytics: RichfieldStorageAnalyticsState;
  storageFiles: RichfieldStorageFilesState;
  userEmail: string | null;
}) {
  const [activeTab, setActiveTab] = useState<AdminTab>("image-library");
  const [content, setContent] = useState(initialContent);
  const [editorTarget, setEditorTarget] = useState<EditorTarget | null>(null);
  const [editorBusy, setEditorBusy] = useState(false);
  const [editorDirty, setEditorDirty] = useState(false);
  const [confirmEditorClose, setConfirmEditorClose] = useState(false);
  const [selectedIds, setSelectedIds] = useState<
    Record<RichfieldAdminCollectionKey, string | null>
  >({
    articles: initialContent.articles[0]?.id ?? null,
    brands: initialContent.brands[0]?.id ?? null,
    "contact-channels": initialContent["contact-channels"][0]?.id ?? null,
    "contact-page": initialContent["contact-page"][0]?.id ?? null,
    "contact-form": initialContent["contact-form"][0]?.id ?? null,
    "contact-submissions": initialContent["contact-submissions"][0]?.id ?? null,
    "image-library": initialContent["image-library"][0]?.id ?? null,
    jobs: initialContent.jobs[0]?.id ?? null,
    leadership: initialContent.leadership[0]?.id ?? null,
    milestones: initialContent.milestones[0]?.id ?? null,
  });

  useEffect(
    () =>
      scheduleRichfieldAdminSessionRefresh({
        expiresAt: sessionExpiresAt,
        refreshEarlySeconds: sessionRefreshEarlySeconds,
      }),
    [sessionExpiresAt, sessionRefreshEarlySeconds],
  );

  useEffect(() => {
    if (!editorTarget) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [editorTarget]);

  const refreshContent = async (
    collectionKeys: RichfieldAdminCollectionKey[] = contentTabs,
  ) => {
    const nextContent = { ...content };

    await Promise.all(
      collectionKeys.map(async (collectionKey) => {
        const response = await adminFetch(`/api/admin/content/${collectionKey}`, {
          cache: "no-store",
        });
        const payload = (await response
          .json()
          .catch(() => ({}))) as MutationResponse;

        if (response.ok && payload.items) {
          nextContent[collectionKey] = payload.items;
        }
      }),
    );

    setContent(nextContent);
    setSelectedIds((current) => {
      const next = { ...current };

      for (const collectionKey of collectionKeys) {
        const selectedId = next[collectionKey];
        if (
          !selectedId ||
          !nextContent[collectionKey].some((item) => item.id === selectedId)
        ) {
          next[collectionKey] = nextContent[collectionKey][0]?.id ?? null;
        }
      }

      return next;
    });
  };

  const openEditor = (target: EditorTarget) => {
    setConfirmEditorClose(false);
    setEditorBusy(false);
    setEditorDirty(false);
    setEditorTarget(target);
  };

  const closeEditor = () => {
    setConfirmEditorClose(false);
    setEditorBusy(false);
    setEditorDirty(false);
    setEditorTarget(null);
  };

  const requestCloseEditor = () => {
    const intent = getRichfieldEditorCloseIntent({
      isBusy: editorBusy,
      isDirty: editorDirty,
    });

    if (intent === "close") {
      closeEditor();
      return;
    }

    if (intent === "warn") {
      setConfirmEditorClose(true);
    }
  };

  const renderContentTab = (collectionKey: RichfieldAdminCollectionKey) => {
    const items = content[collectionKey];
    const selectedId = selectedIds[collectionKey];

    if (collectionKey === "image-library") {
      return (
        <section className="grid min-w-0 gap-6">
          <RichfieldGalleryPanel
            items={items}
            onSelect={(id) => {
              setSelectedIds((current) => ({
                ...current,
                [collectionKey]: id,
              }));
              openEditor({ collectionKey, itemId: id });
            }}
            selectedId={selectedId}
          />
        </section>
      );
    }

    return (
      <section className="grid min-w-0 gap-6">
        <ContentList
          collectionKey={collectionKey}
          items={items}
          onNew={() => {
            setSelectedIds((current) => ({
              ...current,
              [collectionKey]: null,
            }));
            openEditor({ collectionKey, itemId: null });
          }}
          onSelect={(id) => {
            setSelectedIds((current) => ({
              ...current,
              [collectionKey]: id,
            }));
            openEditor({ collectionKey, itemId: id });
          }}
          selectedId={selectedId}
        />
      </section>
    );
  };

  const editorItems = editorTarget
    ? content[editorTarget.collectionKey]
    : [];
  const editorItem =
    editorTarget?.itemId && editorItems.length > 0
      ? (editorItems.find((item) => item.id === editorTarget.itemId) ?? null)
      : null;

  return (
    <main className="section-band min-h-screen px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto grid min-w-0 max-w-7xl gap-6">
        <header className="parchment-card overflow-hidden p-5 sm:p-6">
          <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="min-w-0">
              <p className="script-label">
                {RICHFIELD_ADMIN_COPY.dashboard.eyebrow}
              </p>
              <h1 className="break-words font-display text-4xl leading-none text-[var(--navy)] sm:text-6xl">
                {RICHFIELD_ADMIN_COPY.dashboard.title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--ink-soft)]">
                {RICHFIELD_ADMIN_COPY.dashboard.subtitle}
              </p>
            </div>
            <div className="grid gap-3 sm:flex sm:flex-wrap">
              <Link className="button-secondary w-full sm:w-auto" href="/">
                {RICHFIELD_ADMIN_COPY.account.viewSite}
              </Link>
              <form action="/api/auth/logout" className="min-w-0" method="post">
                <button className="button-primary w-full sm:w-auto" type="submit">
                  {RICHFIELD_ADMIN_COPY.account.signOut}
                </button>
              </form>
            </div>
          </div>
        </header>

        <nav
          aria-label="Dashboard areas"
          className="flex flex-col gap-4 border-b border-[rgba(184,112,81,0.34)] pb-4 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-4"
        >
          {tabGroups.map((group) => (
            <div className="min-w-0" key={group.label}>
              <p className="mb-2 text-[11px] font-black uppercase tracking-[0.22em] text-[var(--ink-soft)]/70">
                {group.label}
              </p>
              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                {group.tabs.map((tab) => (
                  <button
                    aria-current={activeTab === tab.id ? "page" : undefined}
                    className={`min-h-11 border px-3 text-sm font-black transition sm:min-h-10 sm:px-4 ${
                      activeTab === tab.id
                        ? "border-[var(--clay)] bg-[rgba(164,78,67,0.08)] text-[var(--clay)]"
                        : "border-[rgba(184,112,81,0.28)] bg-white/35 text-[var(--ink-soft)] hover:border-[rgba(184,112,81,0.55)] hover:text-[var(--navy)]"
                    }`}
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    type="button"
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {contentTabs.includes(activeTab as RichfieldAdminCollectionKey)
          ? renderContentTab(activeTab as RichfieldAdminCollectionKey)
          : null}

        {editorTarget ? (
          <div
            className="fixed inset-0 z-50 grid overscroll-contain bg-[rgba(12,31,52,0.72)] px-3 py-4 backdrop-blur-sm sm:px-6"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                requestCloseEditor();
              }
            }}
            role="presentation"
          >
            <section
              aria-label={`${editorTarget.itemId ? "Edit" : "Create"} ${sectionCopy[editorTarget.collectionKey].singular}`}
              aria-modal="true"
              className={`mx-auto grid max-h-[calc(100vh-2rem)] w-full min-w-0 overscroll-contain border border-[rgba(184,112,81,0.42)] bg-[var(--parchment)] self-center overflow-y-auto p-4 shadow-[0_28px_90px_rgba(12,31,52,0.44)] sm:p-5 ${
                editorTarget.collectionKey === "image-library"
                  ? "max-w-xl"
                  : "max-w-5xl"
              }`}
              role="dialog"
            >
              <ContentForm
                collectionKey={editorTarget.collectionKey}
                initialDraft={editorTarget.initialDraft}
                item={editorItem}
                key={`${editorTarget.collectionKey}-${editorTarget.itemId ?? "new"}-${editorTarget.initialDraft?.pageSection ?? ""}-${editorTarget.initialDraft?.placement ?? ""}`}
                onBusyChange={setEditorBusy}
                onClose={closeEditor}
                onCloseRequest={requestCloseEditor}
                onDeleted={(items) => {
                  setContent((current) => ({
                    ...current,
                    [editorTarget.collectionKey]: items,
                  }));
                  setSelectedIds((current) => ({
                    ...current,
                    [editorTarget.collectionKey]: items[0]?.id ?? null,
                  }));
                }}
                onDirtyChange={setEditorDirty}
                onSaved={(items, savedItem) => {
                  setContent((current) => ({
                    ...current,
                    [editorTarget.collectionKey]: items,
                  }));
                  setSelectedIds((current) => ({
                    ...current,
                    [editorTarget.collectionKey]:
                      savedItem?.id ?? items[0]?.id ?? null,
                  }));
                }}
              />
            </section>
            {confirmEditorClose ? (
              <div
                className="absolute inset-0 z-10 grid place-items-center bg-[rgba(12,31,52,0.36)] px-4"
                role="presentation"
              >
                <section
                  aria-label={RICHFIELD_ADMIN_COPY.editor.unsavedTitle}
                  aria-modal="true"
                  className="w-full max-w-md border border-[rgba(184,112,81,0.42)] bg-[var(--parchment)] p-5 shadow-[0_24px_80px_rgba(12,31,52,0.42)]"
                  role="alertdialog"
                >
                  <p className="script-label">
                    {RICHFIELD_ADMIN_COPY.editor.unsavedTitle}
                  </p>
                  <h3 className="mt-2 font-display text-4xl leading-none text-[var(--navy)]">
                    {RICHFIELD_ADMIN_COPY.editor.unsavedHeading}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">
                    {RICHFIELD_ADMIN_COPY.editor.unsavedDescription}
                  </p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <button
                      className="button-secondary w-full"
                      onClick={() => setConfirmEditorClose(false)}
                      type="button"
                    >
                      {RICHFIELD_ADMIN_COPY.editor.keepEditing}
                    </button>
                    <button
                      className="button-primary w-full"
                      onClick={closeEditor}
                      type="button"
                    >
                      {RICHFIELD_ADMIN_COPY.editor.discardChanges}
                    </button>
                  </div>
                </section>
              </div>
            ) : null}
          </div>
        ) : null}


        {activeTab === "storage" ? (
          <StoragePanel
            driveHref={driveHref}
            onResourcesChanged={() => refreshContent(["image-library"])}
            storageAnalytics={storageAnalytics}
            storageFiles={storageFiles}
          />
        ) : null}

        {activeTab === "members" ? (
          <MembersPanel membersHref={membersHref} />
        ) : null}

        {activeTab === "account" ? (
          <section className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <div className="parchment-card min-w-0 p-5 sm:p-6">
              <p className="script-label">
                {RICHFIELD_ADMIN_COPY.account.signedIn}
              </p>
              <div className="mt-4 flex items-center gap-4">
                <span className="grid size-14 place-items-center bg-[var(--navy)] font-display text-2xl text-[var(--parchment)]">
                  {getInitials(userEmail)}
                </span>
                <div className="min-w-0">
                  <strong className="block truncate text-[var(--ink)]">
                    {userEmail ?? "Website editor"}
                  </strong>
                  <span className="mt-1 block text-sm text-[var(--ink-soft)]">
                    {RICHFIELD_ADMIN_COPY.account.description}
                  </span>
                </div>
              </div>
            </div>
            <div className="parchment-card grid min-w-0 content-start gap-3 p-5 sm:p-6">
              <Link className="button-primary w-full" href="/">
                {RICHFIELD_ADMIN_COPY.account.viewSite}
              </Link>
              <form action="/api/auth/logout" method="post">
                <button className="button-secondary w-full" type="submit">
                  {RICHFIELD_ADMIN_COPY.account.signOut}
                </button>
              </form>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
