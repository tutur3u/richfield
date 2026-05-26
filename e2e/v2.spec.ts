import { test, expect } from "@playwright/test";

test("/v2 renders cover + all six sections", async ({ page }) => {
  const response = await page.goto("/v2");
  expect(response?.status()).toBe(200);

  // Cover masthead
  await expect(page.getByText(/issue 30/i).first()).toBeVisible();

  // §01 The Lead
  await expect(page.getByText(/story 01 · about the group/i)).toBeVisible();
  await expect(page.getByText("180,000").first()).toBeVisible();
  await expect(page.getByText("300+").first()).toBeVisible();
  await expect(page.getByText("800+").first()).toBeVisible();
  await expect(page.getByText(/by the numbers · vietnam/i)).toBeVisible();

  // §02 What We Do
  await expect(page.getByText(/story 02 · what we do/i)).toBeVisible();
  await expect(page.getByText("Warehouse & Logistics")).toBeVisible();
  await expect(page.getByText("General Trade")).toBeVisible();
  await expect(page.getByText("Modern Trade")).toBeVisible();
  await expect(page.getByText(/^export$/i)).toHaveCount(0);

  // §03 Field Atlas
  await expect(page.getByText(/story 03 · the footprint/i)).toBeVisible();
  await expect(page.getByText("Vietnam").first()).toBeVisible();
  await expect(page.getByText("Malaysia").first()).toBeVisible();
  await expect(page.getByText("China").first()).toBeVisible();
  await expect(page.getByText("1,000+").first()).toBeVisible();
  await expect(page.getByText("150").first()).toBeVisible();
  await expect(page.getByText("50").first()).toBeVisible();

  // §04 The Directory
  await expect(page.getByText(/story 04 · the directory/i)).toBeVisible();
  await expect(page.getByRole("heading", { name: /^food$/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /^beverages$/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /^non-food$/i })).toBeVisible();

  // §05 Joint Venture
  await expect(page.getByText(/story 05 · the joint venture/i)).toBeVisible();
  const doryLink = page.getByRole("link", { name: /doryrich/i });
  await expect(doryLink).toHaveAttribute("href", "https://doryrich.com.vn");

  // §06 Colophon
  await expect(page.getByText(/^1994\.?$/)).toBeVisible();
  await expect(page.getByText(/colophon · issue 30/i)).toBeVisible();
});

test("/v2 has no italicized 'South'", async ({ page }) => {
  await page.goto("/v2");
  const italicSouth = page.locator("em").filter({ hasText: /^south$/i });
  await expect(italicSouth).toHaveCount(0);
});
