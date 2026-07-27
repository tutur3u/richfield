import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { ADMIN_THEME_BOOTSTRAP } from "@/lib/admin/theme";

const globalsCss = readFileSync(
  join(process.cwd(), "app/globals.css"),
  "utf8",
);

describe("admin theming stays scoped to the system layout", () => {
  test("dark tokens hang off the admin theme attribute, never :root", () => {
    // The public magazine has a fixed cream identity. If a staff member's dark
    // preference could reach <html>, the marketing site would flip with it.
    expect(globalsCss).toContain('[data-admin-theme="dark"]');
    expect(globalsCss).not.toMatch(/:root\[data-admin-theme/);
  });

  test("system follows the OS only through a media query", () => {
    const systemBlock = globalsCss.slice(
      globalsCss.indexOf("@media (prefers-color-scheme: dark)"),
    );

    expect(systemBlock).toContain('[data-admin-theme="system"]');
  });

  test("dark re-points the same tokens the admin utilities already use", () => {
    const darkBlock = globalsCss.slice(
      globalsCss.indexOf('[data-admin-theme="dark"] {'),
    );

    // Re-pointing shared tokens is what lets every admin surface invert with no
    // per-component changes.
    for (const token of [
      "--color-paper",
      "--color-cream",
      "--color-ink",
      "--color-line",
      "--color-muted",
    ]) {
      expect(darkBlock).toContain(token);
    }
  });

  test("color-scheme is declared so native controls match the shell", () => {
    expect(globalsCss).toMatch(/\[data-admin-theme="dark"\][\s\S]{0,200}color-scheme:\s*dark/);
  });
});

describe("theme bootstrap script", () => {
  test("falls back to system for a missing or tampered value", () => {
    expect(ADMIN_THEME_BOOTSTRAP).toContain('t="system"');
    expect(ADMIN_THEME_BOOTSTRAP).toContain('t!=="light"');
    expect(ADMIN_THEME_BOOTSTRAP).toContain('t!=="dark"');
  });

  test("is wrapped in try/catch, since storage can throw in private mode", () => {
    expect(ADMIN_THEME_BOOTSTRAP).toContain("try{");
    expect(ADMIN_THEME_BOOTSTRAP).toContain("catch(e){}");
  });

  test("targets the system layout root before the body paints", () => {
    // The public site uses a different root layout, so setting documentElement
    // here prevents a flash without changing the magazine theme.
    expect(ADMIN_THEME_BOOTSTRAP).toContain("document.documentElement");
  });
});
