import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const rootLoadingPath = join(
  process.cwd(),
  "app/(system)/admin/loading.tsx",
);
const sectionLoadingPath = join(
  process.cwd(),
  "app/(system)/admin/[section]/loading.tsx",
);
const loginLoadingPath = join(
  process.cwd(),
  "app/(system)/admin/login/loading.tsx",
);
const sectionScreenSource = readFileSync(
  join(process.cwd(), "components/admin/AdminSectionScreen.tsx"),
  "utf8",
);
const shellSource = readFileSync(
  join(process.cwd(), "components/admin/AdminShell.tsx"),
  "utf8",
);
const systemLayoutSource = readFileSync(
  join(process.cwd(), "app/(system)/layout.tsx"),
  "utf8",
);

describe("admin shell loading behavior", () => {
  it("does not replace the entire dashboard with a parent loading page", () => {
    expect(existsSync(rootLoadingPath)).toBe(false);
    expect(existsSync(sectionLoadingPath)).toBe(true);
    expect(existsSync(loginLoadingPath)).toBe(true);
  });

  it("suspends only the collection beneath the real section heading", () => {
    expect(sectionScreenSource).toContain(
      "<Suspense fallback={<AdminCollectionSkeleton />}>",
    );
    expect(sectionScreenSource.indexOf("<header")).toBeLessThan(
      sectionScreenSource.indexOf("<Suspense"),
    );
  });

  it("restores the theme in the head before body chrome can paint", () => {
    expect(systemLayoutSource.indexOf("<head>")).toBeLessThan(
      systemLayoutSource.indexOf("<BodyChrome>"),
    );
    expect(systemLayoutSource).toContain("ADMIN_THEME_BOOTSTRAP");
  });
});

describe("admin brand placement", () => {
  it("renders one Richfield | Admin lockup in the top bar", () => {
    expect(shellSource.match(/t\("shell\.richfield"\)/g)).toHaveLength(1);
    expect(shellSource.match(/t\("shell\.admin"\)/g)).toHaveLength(1);
  });
});
