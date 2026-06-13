import { test, expect } from "@playwright/test";

// The magazine is now the whole site. Every route shares the RunningHead
// masthead and the global SiteFooter (the Richfield promise + minimal footer).
const ROUTES = [
  "/",
  "/about/our-story",
  "/about/who-we-are",
  "/brands",
  "/logistics",
  "/distribution",
  "/careers",
  "/contact",
];

for (const path of ROUTES) {
  test(`route ${path} renders shell + h1`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("header").first()).toBeVisible();
    await expect(page.locator("h1").first()).toBeVisible();
  });
}
