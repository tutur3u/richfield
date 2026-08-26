import { afterEach, describe, expect, test, vi } from "vitest";
import { contentKeys, fetchContentPage } from "./content-queries";

afterEach(() => {
  vi.unstubAllGlobals();
});

function stubFetch(response: unknown, ok = true) {
  const fetchMock = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) => ({
    json: async () => response,
    ok,
  }));

  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("contentKeys", () => {
  test("nests so a collection invalidation covers all of its searches", () => {
    expect(contentKeys.all).toEqual(["admin", "content"]);
    expect(contentKeys.collection("articles")).toEqual([
      "admin",
      "content",
      "articles",
    ]);
    // The list key must start with the collection key, or invalidating the
    // collection after a mutation would silently miss the searched lists.
    const listKey = contentKeys.list("articles", "vietnam");
    expect(listKey.slice(0, 3)).toEqual(contentKeys.collection("articles"));
    expect(listKey.at(-1)).toEqual({
      completeness: "all",
      featured: "all",
      locale: "en",
      search: "vietnam",
      sort: "created-desc",
      status: "all",
    });
  });

  test("separates searches so one does not serve another's cache", () => {
    expect(contentKeys.list("jobs", "a")).not.toEqual(
      contentKeys.list("jobs", "b"),
    );
  });
});

describe("fetchContentPage", () => {
  test("requests the asked-for page and omits an empty search", async () => {
    const fetchMock = stubFetch({ items: [], nextPage: null, page: 2, total: 0 });

    await fetchContentPage({ collectionKey: "articles", page: 2, search: "" });

    const url = String(fetchMock.mock.calls[0]?.[0]);
    expect(url).toContain("/api/admin/content/articles");
    expect(url).toContain("page=2");
    expect(url).toContain("sort=created-desc");
    expect(url).toContain("status=all");
    expect(url).not.toContain("search=");
  });

  test("passes a search term through", async () => {
    const fetchMock = stubFetch({ items: [], nextPage: null, page: 1, total: 0 });

    await fetchContentPage({
      collectionKey: "jobs",
      page: 1,
      search: "logistics",
    });

    expect(String(fetchMock.mock.calls[0]?.[0])).toContain("search=logistics");
  });

  test("passes sorting and filters through for server-side pagination", async () => {
    const fetchMock = stubFetch({ items: [], nextPage: null, page: 1, total: 0 });

    await fetchContentPage({
      collectionKey: "articles",
      completeness: "missing",
      featured: "featured",
      page: 1,
      search: "",
      sort: "published-asc",
      status: "scheduled",
    });

    const url = String(fetchMock.mock.calls[0]?.[0]);
    expect(url).toContain("sort=published-asc");
    expect(url).toContain("status=scheduled");
    expect(url).toContain("featured=featured");
    expect(url).toContain("completeness=missing");
  });

  test("fills in a partial payload rather than yielding undefined pages", async () => {
    stubFetch({ items: [{ id: "a" }] });

    await expect(
      fetchContentPage({ collectionKey: "articles", page: 1, search: "" }),
    ).resolves.toEqual({
      items: [{ id: "a" }],
      // A missing nextPage must read as "no more", never as undefined, or the
      // infinite query would keep asking for the same page.
      nextPage: null,
      page: 1,
      total: 1,
    });
  });

  test("surfaces the server's error message", async () => {
    stubFetch({ error: "Unauthorized" }, false);

    await expect(
      fetchContentPage({ collectionKey: "articles", page: 1, search: "" }),
    ).rejects.toThrow("Unauthorized");
  });

  test("falls back to a readable message when the body has none", async () => {
    stubFetch(null, false);

    await expect(
      fetchContentPage({ collectionKey: "brands", page: 1, search: "" }),
    ).rejects.toThrow(/brands/);
  });
});
