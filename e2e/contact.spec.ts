import { test, expect } from "@playwright/test";

test.describe("Contact form", () => {
  test("renders all fields and the inquiry options", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator("#name")).toBeVisible();
    await expect(page.locator("#company")).toBeVisible();
    await expect(page.locator("#country")).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#inquiryType")).toBeVisible();
    await expect(page.locator("#message")).toBeVisible();
    await expect(page.locator("#name")).toHaveAttribute(
      "placeholder",
      "Your full name",
    );
    await expect(page.locator("#company")).toHaveAttribute(
      "placeholder",
      "Company or organization",
    );
    await expect(page.locator("#message")).toHaveAttribute(
      "placeholder",
      /Share your goals/,
    );
    await expect(page.getByText("Secure verification")).toBeVisible();

    const select = page.locator("#inquiryType");
    await expect(select.locator("option")).toHaveCount(5);
  });

  test("invalid email surfaces field error", async ({ page }) => {
    await page.goto("/contact");
    await page.locator("#name").fill("Asha");
    await page.locator("#company").fill("Acme");
    await page.locator("#email").fill("not-an-email");
    await page.locator("#message").fill("Hello.");
    await page.getByRole("button", { name: /send message/i }).click();
    await expect(page.locator('[role="alert"]')).toContainText(/valid email/i);
  });

  test("valid submission reports delivery failure when services are unavailable", async ({
    page,
  }) => {
    await page.goto("/contact");
    await page.locator("#name").fill("Asha");
    await page.locator("#company").fill("Acme");
    await page.locator("#email").fill("asha@example.com");
    await page.locator("#message").fill("We'd like to discuss distribution.");
    await page.getByRole("button", { name: /send message/i }).click();
    await expect(page.getByRole("alert")).toContainText(/couldn't send your message/i);
  });
});
