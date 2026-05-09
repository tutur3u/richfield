import { test, expect } from "@playwright/test";

test.describe("Contact form", () => {
  test("renders all fields and the inquiry options", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByLabel("Name")).toBeVisible();
    await expect(page.getByLabel("Company")).toBeVisible();
    await expect(page.getByLabel("Country")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Inquiry type")).toBeVisible();
    await expect(page.getByLabel("Message")).toBeVisible();

    const select = page.getByLabel("Inquiry type");
    await expect(select.locator("option")).toHaveCount(5);
  });

  test("invalid email surfaces field error", async ({ page }) => {
    await page.goto("/contact");
    await page.getByLabel("Name").fill("Asha");
    await page.getByLabel("Company").fill("Acme");
    await page.getByLabel("Email").fill("not-an-email");
    await page.getByLabel("Message").fill("Hello.");
    // Pass the anti-spam guard so we exercise the Zod validation path.
    await page.waitForTimeout(3500);
    await page.getByRole("button", { name: /send message/i }).click();
    await expect(page.locator('[role="alert"]')).toContainText(/valid email/i);
  });

  test("valid submission shows success message (no inbox configured)", async ({ page }) => {
    await page.goto("/contact");
    await page.getByLabel("Name").fill("Asha");
    await page.getByLabel("Company").fill("Acme");
    await page.getByLabel("Email").fill("asha@example.com");
    await page.getByLabel("Message").fill("We'd like to discuss distribution.");
    await page.waitForTimeout(3500);
    await page.getByRole("button", { name: /send message/i }).click();
    await expect(page.getByRole("status")).toContainText(/two business days/i);
  });

  test("submitting too fast trips the anti-spam delay", async ({ page }) => {
    await page.goto("/contact");
    await page.getByLabel("Name").fill("Bot");
    await page.getByLabel("Company").fill("Bot");
    await page.getByLabel("Email").fill("bot@example.com");
    await page.getByLabel("Message").fill(".");
    await page.getByRole("button", { name: /send message/i }).click();
    await expect(page.locator('[role="alert"]')).toContainText(/give us a moment/i);
  });
});
