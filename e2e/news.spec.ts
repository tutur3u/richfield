import { test, expect } from "@playwright/test";

// The lead story is a two-column grid whose image box carries an aspect-ratio.
// Without a definite inline size, grid stretch makes the height definite and
// the ratio resolves backwards (width = height x 16/9), so a tall text column
// pushes the image past its own track and over the headline. Assert the
// invariant rather than today's copy: a short CMS title passes trivially.
test("lead story image stays inside its grid track", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "The two-column lead grid is lg-only.");

  await page.goto("/news");

  const heading = page.locator("#lead-story-heading");
  test.skip(
    (await heading.count()) === 0,
    "No lead article — CMS content unavailable.",
  );

  // Force the failing condition: a headline long enough to make the text
  // column taller than the image's natural 16:9 box.
  await heading.evaluate((el) => {
    el.textContent =
      "A deliberately long lead headline used to force the text column taller than the image box";
  });

  for (const width of [1024, 1920]) {
    await page.setViewportSize({ width, height: 1000 });

    const box = await heading.evaluate((el) => {
      const link = el.closest("a");
      if (!link) throw new Error("Lead heading is not inside a link.");
      const [image, text] = Array.from(link.children);
      const trackWidth = Number.parseFloat(
        getComputedStyle(link).gridTemplateColumns.split(" ")[0],
      );
      const imageRect = image.getBoundingClientRect();
      return {
        trackWidth,
        imageWidth: imageRect.width,
        imageRight: imageRect.right,
        textLeft: text.getBoundingClientRect().left,
      };
    });

    expect(
      box.imageWidth,
      `image overflows its grid track at ${width}px`,
    ).toBeLessThanOrEqual(box.trackWidth + 1);
    expect(
      box.imageRight,
      `image overlaps the story text at ${width}px`,
    ).toBeLessThanOrEqual(box.textLeft);
  }
});
