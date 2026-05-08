import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 } });

test("hamburger opens drawer, ESC closes it", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: /open menu/i });
  await trigger.click();
  const drawer = page.getByRole("dialog", { name: /site navigation/i });
  await expect(drawer).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(drawer).toBeHidden();
});

test("drawer focus is trapped", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /open menu/i }).click();
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press("Tab");
  }
  const focusInsideDialog = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]');
    return dialog?.contains(document.activeElement) ?? false;
  });
  expect(focusInsideDialog).toBe(true);
});
