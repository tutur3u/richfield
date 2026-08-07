import { revalidatePath, revalidateTag } from "next/cache";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
  RICHFIELD_CONTENT_TAG,
  revalidateRichfieldContent,
  richfieldWarmUrls,
  warmRichfieldContentPaths,
} from "./richfield-revalidation";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("RICHFIELD_APP_URL", "https://richfieldgroup.com.vn");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("Richfield content revalidation", () => {
  test("expires the delivery tag instead of marking it stale", () => {
    // Marking it stale would serve the previous version to whoever arrives
    // first after a publish, which is the delay the client reported.
    revalidateRichfieldContent();

    expect(revalidateTag).toHaveBeenCalledWith(RICHFIELD_CONTENT_TAG, {
      expire: 0,
    });
  });

  test("names the [locale] segment the public routes actually have", () => {
    // The regression this guards: paths like "/news/[slug]" and "/vi/news"
    // match no route in this app — every public page lives under /[locale].
    revalidateRichfieldContent();

    expect(revalidatePath).toHaveBeenCalledWith("/[locale]", "layout");
    expect(revalidatePath).toHaveBeenCalledWith("/sitemap.xml");
    expect(vi.mocked(revalidatePath).mock.calls).not.toContainEqual([
      "/news/[slug]",
      "page",
    ]);
  });
});

describe("Richfield content warming", () => {
  test("warms both locales of every affected path", () => {
    expect(richfieldWarmUrls(["/news", "/news/harvest-season"])).toEqual([
      "https://richfieldgroup.com.vn/news",
      "https://richfieldgroup.com.vn/vi/news",
      "https://richfieldgroup.com.vn/news/harvest-season",
      "https://richfieldgroup.com.vn/vi/news/harvest-season",
    ]);
  });

  test("keeps the home page bare in English and prefixed in Vietnamese", () => {
    expect(richfieldWarmUrls(["/"])).toEqual([
      "https://richfieldgroup.com.vn/",
      "https://richfieldgroup.com.vn/vi",
    ]);
  });

  test("requests each warmed page uncached", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => new Response("ok"));
    vi.stubGlobal("fetch", fetchMock);

    await warmRichfieldContentPaths(["/news"]);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({ cache: "no-store" });
  });

  test("never fails a save because a page could not be warmed", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("upstream down");
      }),
    );

    await expect(
      warmRichfieldContentPaths(["/news"]),
    ).resolves.toBeUndefined();
  });
});
