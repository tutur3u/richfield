"use client";

import { useState } from "react";
import { toast } from "sonner";
import { adminFetch } from "./richfield-admin-session-client";
import { RICHFIELD_ADMIN_COPY } from "./richfield-admin-copy";

async function readAdminError(response: Response) {
  const data = (await response.json().catch(() => null)) as { error?: unknown } | null;
  return typeof data?.error === "string" && data.error.trim()
    ? data.error
    : `Request failed with status ${response.status}`;
}

async function postAdminJson<T>(url: string, body?: unknown) {
  const response = await adminFetch(url, {
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(await readAdminError(response));
  }

  return (await response.json()) as T;
}

type SyncDiffResponse = {
  hasDestructiveOperations?: boolean;
  operations?: unknown[];
  summary?: {
    archive?: number;
    create?: number;
    delete?: number;
    noop?: number;
    update?: number;
  };
};

export function RichfieldAdminSyncPanel() {
  const [diff, setDiff] = useState<SyncDiffResponse | null>(null);
  const [pendingAction, setPendingAction] = useState<"apply" | "diff" | null>(null);
  const [publicAssetSync, setPublicAssetSync] = useState<{
    skipped?: unknown[];
    uploaded?: unknown[];
  } | null>(null);
  const summary = diff?.summary;
  const totalOperations =
    (summary?.archive ?? 0) +
    (summary?.create ?? 0) +
    (summary?.delete ?? 0) +
    (summary?.update ?? 0);

  const runDiff = async () => {
    setPendingAction("diff");
    setPublicAssetSync(null);
    try {
      setDiff(await postAdminJson<SyncDiffResponse>("/api/admin/sync/diff"));
    } catch (nextError) {
      toast.error(nextError instanceof Error ? nextError.message : "Sync request failed.");
    } finally {
      setPendingAction(null);
    }
  };

  const runApply = async (force: boolean) => {
    setPendingAction("apply");
    setPublicAssetSync(null);
    try {
      const result = await postAdminJson<{
        diff?: SyncDiffResponse;
        publicAssetSync?: {
          skipped?: unknown[];
          uploaded?: unknown[];
        };
      }>("/api/admin/sync/apply", { force });
      setPublicAssetSync(result.publicAssetSync ?? null);
      setDiff(result.diff ?? (await postAdminJson<SyncDiffResponse>("/api/admin/sync/diff")));
      toast.success("The latest website changes were shared.");
    } catch (nextError) {
      toast.error(nextError instanceof Error ? nextError.message : "Sync request failed.");
    } finally {
      setPendingAction(null);
    }
  };

  return (
    <section className="parchment-card grid min-w-0 gap-5 p-4 sm:p-5">
      <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="script-label">{RICHFIELD_ADMIN_COPY.publish.title}</p>
          <h2 className="break-words font-display text-3xl leading-none text-[var(--navy)] sm:text-4xl">
            Share the latest website
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--ink-soft)]">
            {RICHFIELD_ADMIN_COPY.publish.description}
          </p>
        </div>
        <div className="grid gap-3 sm:flex sm:flex-wrap">
          <button
            className="button-secondary min-w-32 w-full disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto"
            disabled={pendingAction !== null}
            onClick={runDiff}
            type="button"
          >
            {pendingAction === "diff" ? "Checking..." : RICHFIELD_ADMIN_COPY.publish.check}
          </button>
          <button
            className="button-primary min-w-32 w-full disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto"
            disabled={pendingAction !== null}
            onClick={() => void runApply(false)}
            type="button"
          >
            {pendingAction === "apply" ? "Sharing..." : RICHFIELD_ADMIN_COPY.publish.push}
          </button>
        </div>
      </div>

      {diff ? (
        <div className="grid gap-2 text-sm sm:grid-cols-4">
          {[
            ["New", summary?.create ?? 0],
            ["Changed", summary?.update ?? 0],
            ["Hidden", summary?.archive ?? 0],
            ["Removed", summary?.delete ?? 0],
          ].map(([label, value]) => (
            <div
              className="border border-[rgba(184,112,81,0.34)] bg-[rgba(255,246,239,0.62)] px-3 py-2"
              key={label}
            >
              <span className="text-[var(--ink-soft)]">{label}</span>
              <span className="float-right font-black text-[var(--navy)]">{value}</span>
            </div>
          ))}
        </div>
      ) : null}

      {diff?.hasDestructiveOperations ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border border-red-300 bg-red-500/12 px-3 py-2 text-sm text-red-800">
          <span>{RICHFIELD_ADMIN_COPY.publish.warning}</span>
          <button
            className="border border-red-300 px-3 py-2 text-xs font-black uppercase tracking-[0.16em]"
            disabled={pendingAction !== null}
            onClick={() => void runApply(true)}
            type="button"
          >
            {RICHFIELD_ADMIN_COPY.publish.force}
          </button>
        </div>
      ) : null}

      {diff && !diff.hasDestructiveOperations ? (
        <p className="text-sm text-[var(--ink-soft)]">
          {totalOperations === 0
            ? RICHFIELD_ADMIN_COPY.publish.done
            : `${totalOperations} ${RICHFIELD_ADMIN_COPY.publish.pending}.`}
        </p>
      ) : null}

      {publicAssetSync ? (
        <p className="text-sm text-[var(--ink-soft)]">
          Prepared {publicAssetSync.uploaded?.length ?? 0} images
          {publicAssetSync.skipped?.length ? `, skipped ${publicAssetSync.skipped.length}` : ""}.
        </p>
      ) : null}

    </section>
  );
}
