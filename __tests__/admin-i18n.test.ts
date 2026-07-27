import { describe, expect, it } from "vitest";
import en from "@/messages/en.json";
import vi from "@/messages/vi.json";

function leafKeys(value: unknown, prefix = ""): string[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return [prefix];
  }

  return Object.entries(value).flatMap(([key, child]) =>
    leafKeys(child, prefix ? `${prefix}.${key}` : key),
  );
}

describe("admin message coverage", () => {
  it("keeps English and Vietnamese namespaces in lockstep", () => {
    expect(leafKeys(vi.admin).sort()).toEqual(leafKeys(en.admin).sort());
  });
});
