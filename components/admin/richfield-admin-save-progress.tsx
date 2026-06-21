"use client";

import type { RichfieldAdminContentItem } from "@/lib/richfield-admin-content-model";

export type MutationResponse = {
  error?: string;
  errors?: Record<string, string>;
  item?: RichfieldAdminContentItem | null;
  items?: RichfieldAdminContentItem[];
  label?: string;
  status?: number;
  step?: string;
};

export type SaveProgressState = {
  error?: string;
  label: string;
  percent: number;
  status: "error" | "idle" | "running" | "success";
  statusCode?: number;
  step?: string;
};

type SaveStreamEvent =
  | {
      label: string;
      percent: number;
      step: string;
      type: "progress";
    }
  | ({
      label: string;
      percent: 100;
      step: "done";
      type: "result";
    } & Required<Pick<MutationResponse, "item" | "items">>)
  | ({
      percent: number;
      type: "error";
    } & Pick<MutationResponse, "error" | "label" | "status" | "step">);

export type SaveFlowError = Error & {
  errors?: Record<string, string>;
  label?: string;
  statusCode?: number;
  step?: string;
};

function readPayloadError(payload: MutationResponse, fallback: string) {
  return payload.error ?? Object.values(payload.errors ?? {})[0] ?? fallback;
}

function createSaveFlowError(
  payload: MutationResponse,
  fallback: string,
): SaveFlowError {
  const error = new Error(readPayloadError(payload, fallback)) as SaveFlowError;
  error.errors = payload.errors;
  error.label = payload.label;
  error.statusCode = payload.status;
  error.step = payload.step;
  return error;
}

export function SaveProgressPanel({ state }: { state: SaveProgressState }) {
  if (state.status === "idle") return null;

  const statusText =
    state.status === "error"
      ? state.error || "Save failed."
      : state.status === "success"
        ? "Saved."
        : state.label;

  return (
    <section
      aria-live="polite"
      className="grid gap-3 border border-[rgba(184,112,81,0.34)] bg-white/68 p-4"
      role="status"
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <span className="text-xs font-black uppercase tracking-[0.18em] text-[var(--clay)]">
            {state.status === "error" ? "Save needs attention" : "Save progress"}
          </span>
          <p className="mt-1 break-words text-sm font-semibold text-[var(--ink)]">
            {statusText}
          </p>
        </div>
        <strong className="text-sm text-[var(--clay)]">
          {Math.round(state.percent)}%
        </strong>
      </div>
      <div
        aria-label="Save progress"
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={Math.round(state.percent)}
        className="h-2 overflow-hidden border border-[rgba(184,112,81,0.34)] bg-white"
        role="progressbar"
      >
        <div
          className="h-full bg-[var(--clay)] transition-[width]"
          style={{ width: `${Math.max(0, Math.min(100, state.percent))}%` }}
        />
      </div>
      <div className="flex flex-wrap gap-2 text-xs text-[var(--ink-soft)]">
        {state.step ? <span>Step: {state.step}</span> : null}
        {state.statusCode ? <span>Status: {state.statusCode}</span> : null}
      </div>
    </section>
  );
}

export async function readContentSaveResponse({
  response,
  setSaveProgress,
}: {
  response: Response;
  setSaveProgress: (state: SaveProgressState) => void;
}): Promise<Required<Pick<MutationResponse, "item" | "items">>> {
  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as MutationResponse;
    throw createSaveFlowError(
      { ...payload, status: response.status },
      "We could not save this item.",
    );
  }

  if (
    !response.body ||
    !response.headers
      .get("content-type")
      ?.toLowerCase()
      .includes("application/x-ndjson")
  ) {
    const payload = (await response.json().catch(() => ({}))) as MutationResponse;

    if (!payload.items) {
      throw createSaveFlowError(payload, "We could not save this item.");
    }

    return { item: payload.item ?? null, items: payload.items };
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let result: Required<Pick<MutationResponse, "item" | "items">> | null = null;

  while (true) {
    const { done, value } = await reader.read();
    buffer += decoder.decode(value, { stream: !done });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.trim()) continue;
      const event = JSON.parse(line) as SaveStreamEvent;

      if (event.type === "progress") {
        setSaveProgress({
          label: event.label,
          percent: event.percent,
          status: "running",
          step: event.step,
        });
      } else if (event.type === "result") {
        result = { item: event.item, items: event.items };
        setSaveProgress({
          label: event.label,
          percent: 100,
          status: "success",
          step: event.step,
        });
      } else if (event.type === "error") {
        throw createSaveFlowError(
          {
            error: event.error,
            label: event.label,
            status: event.status,
            step: event.step,
          },
          "We could not save this item.",
        );
      }
    }

    if (done) break;
  }

  if (!result) {
    throw createSaveFlowError(
      {
        error: "Save stream ended before returning an item.",
        label: "Saving item",
        step: "save-stream",
      },
      "We could not save this item.",
    );
  }

  return result;
}
