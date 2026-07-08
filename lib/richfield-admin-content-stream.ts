import type { RichfieldContentMutationProgress } from "./richfield-admin-content";
import type { RichfieldAdminContentItem } from "./richfield-admin-content-model";

type MutationResult = {
  item: RichfieldAdminContentItem | null;
  items: RichfieldAdminContentItem[];
};

type StreamEvent =
  | (RichfieldContentMutationProgress & { type: "progress" })
  | {
      item: RichfieldAdminContentItem | null;
      items: RichfieldAdminContentItem[];
      label: string;
      percent: 100;
      step: "done";
      type: "result";
    }
  | {
      error: string;
      label?: string;
      percent: number;
      status: number;
      step?: string;
      type: "error";
    };

const encoder = new TextEncoder();

function encodeEvent(event: StreamEvent) {
  return encoder.encode(`${JSON.stringify(event)}\n`);
}

function readErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message.trim()
    ? error.message
    : fallback;
}

export function createRichfieldContentMutationStream({
  fallback,
  run,
}: {
  fallback: string;
  run: (
    onProgress: (progress: RichfieldContentMutationProgress) => void,
  ) => Promise<MutationResult>;
}) {
  let latestProgress: RichfieldContentMutationProgress | null = null;

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: StreamEvent) => controller.enqueue(encodeEvent(event));

      try {
        const result = await run((progress) => {
          latestProgress = progress;
          send({ ...progress, type: "progress" });
        });

        send({
          item: result.item,
          items: result.items,
          label: "Saved",
          percent: 100,
          step: "done",
          type: "result",
        });
      } catch (error) {
        send({
          error: readErrorMessage(error, fallback),
          label: latestProgress?.label,
          percent: latestProgress?.percent ?? 100,
          status: 500,
          step: latestProgress?.step,
          type: "error",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/x-ndjson; charset=utf-8",
    },
  });
}
