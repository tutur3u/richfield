import { describe, expect, test } from "vitest";
import {
  readContentSaveResponse,
  type SaveProgressState,
} from "./richfield-admin-save-progress";

function streamResponse(lines: unknown[]) {
  return new Response(
    lines.map((line) => `${JSON.stringify(line)}\n`).join(""),
    {
      headers: {
        "Content-Type": "application/x-ndjson; charset=utf-8",
      },
    },
  );
}

describe("Richfield admin save progress", () => {
  test("reads streamed save steps and returns the saved item", async () => {
    const states: SaveProgressState[] = [];
    const result = await readContentSaveResponse({
      response: streamResponse([
        {
          label: "Saving details",
          percent: 24,
          step: "save-details",
          type: "progress",
        },
        {
          item: { id: "entry-1", title: "Saved" },
          items: [{ id: "entry-1", title: "Saved" }],
          label: "Saved",
          percent: 100,
          step: "done",
          type: "result",
        },
      ]),
      setSaveProgress: (state) => {
        states.push(state);
      },
    });

    expect(states).toEqual([
      {
        label: "Saving details",
        percent: 24,
        status: "running",
        step: "save-details",
      },
      {
        label: "Saved",
        percent: 100,
        status: "success",
        step: "done",
      },
    ]);
    expect(result.item?.id).toBe("entry-1");
  });
});
