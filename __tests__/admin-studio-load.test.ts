import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

const source = readFileSync(
  join(process.cwd(), "lib/richfield-admin-api.ts"),
  "utf8",
);

const studioLoader = source.slice(
  source.indexOf("export async function getRichfieldAdminStudio"),
);

describe("reading the studio does not provision it first", () => {
  test("setup is not awaited before the read", () => {
    // Every dashboard section calls this. Awaiting the manifest POST up front
    // put a serialized write round trip in front of each navigation, which is
    // what made the sections take seconds to appear.
    const beforeFirstRead = studioLoader.slice(
      0,
      studioLoader.indexOf("client.getStudio"),
    );

    expect(beforeFirstRead).not.toContain("setupRichfieldAdminStudio");
  });

  test("an unprovisioned workspace still gets set up", () => {
    // The guarantee has to survive: no collections means the model is missing,
    // and that is the one case where setup genuinely has to run.
    expect(studioLoader).toContain("studio.collections.length > 0");
    expect(studioLoader).toContain("await setupRichfieldAdminStudio");
  });
});
