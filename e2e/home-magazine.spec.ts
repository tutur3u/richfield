import { test, expect } from "@playwright/test";

test("/ renders the magazine cover, nav, and key spreads", async ({ page, isMobile }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);

  // Cover headline — a cream masthead beside the portrait carousel.
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    /nationwide/i,
  );

  // Persistent header. Below lg the nav collapses to a burger + drawer.
  if (isMobile) {
    await expect(page.getByRole("button", { name: /open menu/i })).toBeVisible();
  } else {
    await expect(
      page.getByRole("button", { name: /what we do/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /^careers$/i }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /^contact$/i }).first(),
    ).toBeVisible();
  }

  // What We Do spread.
  await expect(page.getByText("Warehouse & Logistics").first()).toBeVisible();
  await expect(page.getByText("General Trade").first()).toBeVisible();
  await expect(page.getByText("Modern Trade").first()).toBeVisible();

  // Joint Venture spread + external link. (Scope the heading to #jv; the
  // Who-We-Are org card with the same name now lives on /about/who-we-are.)
  await expect(
    page.locator("#jv").getByRole("heading", { name: /dory rich jsc/i }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /doryrich/i })).toHaveAttribute(
    "href",
    "https://doryrich.com.vn",
  );

  // Anchor targets on the single page all exist.
  for (const id of ["what", "atlas", "jv", "brands", "colophon"]) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
});

test("What We Do dropdown exposes its child links", async ({ page, isMobile }) => {
  test.skip(isMobile, "Dropdown is desktop-only; mobile uses the drawer.");
  await page.goto("/");
  await page.getByRole("button", { name: /what we do/i }).hover();
  await expect(
    page.getByRole("link", { name: /logistics & warehousing/i }).first(),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /^distribution$/i }).first(),
  ).toBeVisible();
});
