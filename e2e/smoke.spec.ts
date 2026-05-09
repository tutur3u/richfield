import { test, expect } from "@playwright/test";

const ROUTES: Array<{ path: string; h1: string | RegExp }> = [
  { path: "/", h1: /nationwide distribution/i },
  { path: "/about", h1: /generations/i },
  { path: "/what-we-do", h1: /move .*brands/i },
  { path: "/distribution", h1: /every shelf/i },
  { path: "/logistics", h1: /south/i },
  { path: "/products", h1: /already/i },
  { path: "/brands", h1: /portfolio/i },
  { path: "/careers", h1: /opportunity/i },
  { path: "/contact", h1: /brand/i },
];

for (const r of ROUTES) {
  test(`route ${r.path} renders shell + h1`, async ({ page }) => {
    const response = await page.goto(r.path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("header").first()).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
    await expect(page.locator("h1")).toContainText(r.h1);
  });
}
