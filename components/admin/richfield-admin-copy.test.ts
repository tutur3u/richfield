import { describe, expect, test } from "vitest";
import { RICHFIELD_ADMIN_COPY } from "./richfield-admin-copy";

const bannedWords = [
  "asset",
  "collection",
  "cms",
  "entry",
  "manifest",
  "payload",
  "sync",
  "workspace",
];

function flattenCopy(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(flattenCopy);
  if (value && typeof value === "object") {
    return Object.values(value).flatMap(flattenCopy);
  }
  return [];
}

describe("Richfield admin copy", () => {
  test("keeps visible dashboard labels friendly and non-technical", () => {
    const renderedCopy = flattenCopy(RICHFIELD_ADMIN_COPY).join("\n").toLowerCase();

    for (const word of bannedWords) {
      expect(renderedCopy).not.toContain(word);
    }
  });
});
