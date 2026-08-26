"use client";

/**
 * Storage, files and the response-forwarding summary.
 *
 * Lifted out of RichfieldAdminDashboard, which had grown past 3,200 lines — far
 * beyond the point where anyone can hold it in their head. This block was the
 * cleanest seam: only StoragePanel and ResponseForwardingPanel were referenced
 * from the rest of the file, so everything else here is genuinely private to it.
 */
import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { toast } from "sonner";
import type { RichfieldAdminContentItem } from "@/lib/richfield-admin-content-model";
import type { RichfieldStorageAnalyticsState } from "@/lib/richfield-admin-storage";
import type {
  RichfieldStorageFileItem,
  RichfieldStorageFilesState,
} from "@/lib/richfield-storage-files";
import {
  formatVnd,
  summariseForwardingMetrics,
} from "@/lib/richfield-response-metrics";
import { RICHFIELD_ADMIN_COPY } from "./richfield-admin-copy";
import { adminFetch } from "./richfield-admin-session-client";

type ReadyStorageAnalytics = Extract<
  RichfieldStorageAnalyticsState,
  { status: "ready" }
>;
type ReadyStorageFiles = Extract<RichfieldStorageFilesState, { status: "ready" }>;

const byteUnits = ["B", "KB", "MB", "GB", "TB"] as const;

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

/**
 * What the scheduled forwarding job has done with the inbox, and what it cost.
 * Counted from the responses already on screen, so the numbers can never
 * disagree with the list underneath them.
 */
export function ResponseForwardingPanel({
  items,
}: {
  items: RichfieldAdminContentItem[];
}) {
  const metrics = summariseForwardingMetrics(items);

  return (
    <section className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StorageMetric
        detail={RICHFIELD_ADMIN_COPY.forwarding.sentDetail}
        label={RICHFIELD_ADMIN_COPY.forwarding.sent}
        value={String(metrics.sent)}
      />
      <StorageMetric
        detail={RICHFIELD_ADMIN_COPY.forwarding.waitingDetail}
        label={RICHFIELD_ADMIN_COPY.forwarding.waiting}
        value={String(metrics.pending)}
      />
      <StorageMetric
        detail={RICHFIELD_ADMIN_COPY.forwarding.failedDetail}
        label={RICHFIELD_ADMIN_COPY.forwarding.failed}
        value={String(metrics.failed)}
      />
      <StorageMetric
        detail={RICHFIELD_ADMIN_COPY.forwarding.costDetail}
        label={RICHFIELD_ADMIN_COPY.forwarding.cost}
        value={formatVnd(metrics.costVnd)}
      />
    </section>
  );
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
            placeholder={item.name}
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

export function StoragePanel({
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
  const [busy, setBusy] = useState(false);

  const refreshStorage = async (path = currentPath) => {
    setBusy(true);
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

    try {
      const response = await request;
      const payload = (await response.json().catch(() => null)) as {
        data?: { detachedAssets?: number; updatedAssets?: number };
        error?: string;
      } | null;

      if (!response.ok) {
        toast.error(payload?.error ?? "Storage request failed.");
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
      toast.success(successText);
      await onResourcesChanged();
    } catch {
      toast.error("Storage request failed.");
    } finally {
      setBusy(false);
    }
  };

  const uploadSelectedFile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!uploadFile) {
      toast.error(RICHFIELD_ADMIN_COPY.storage.chooseFile);
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

    try {
      const url = new URL("/api/admin/storage", window.location.origin);
      url.searchParams.set("filePath", item.path);
      const response = await adminFetch(url, { cache: "no-store" });
      const payload = (await response.json().catch(() => null)) as {
        data?: { signedUrl?: string };
        error?: string;
      } | null;

      if (!response.ok || !payload?.data?.signedUrl) {
        toast.error(payload?.error ?? "File could not be opened.");
        return;
      }

      window.open(payload.data.signedUrl, "_blank", "noopener,noreferrer");
    } catch {
      toast.error("File could not be opened.");
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
                placeholder={RICHFIELD_ADMIN_COPY.storage.folderName}
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
