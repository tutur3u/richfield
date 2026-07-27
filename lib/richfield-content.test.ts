import { describe, expect, test } from "vitest";
import { brands, homepageBrands } from "@/content/en/brands";
import { leaders } from "@/content/en/leadership";
import { homepageMilestones, milestones } from "@/content/en/milestones";
import { buildRichfieldContent, DEFAULT_RICHFIELD_CONTENT } from "./richfield-content";

describe("Richfield public content", () => {
  test("uses published delivery content for brands, leadership, and milestones", () => {
    const content = buildRichfieldContent(
      {
        adapter: "richfield",
        canonicalProjectId: "richfield",
        generatedAt: new Date("2026-06-19").toISOString(),
        loadingData: null,
        profileData: {},
        workspaceId: "workspace-1",
        collections: [
          {
            collection_type: "brands",
            config: null,
            description: null,
            id: "collection-brands",
            slug: "brands",
            title: "Brands",
            entries: [
              {
                assets: [
                  {
                    alt_text: "Published brand logo",
                    assetUrl: "/storage/richfield/brand.webp",
                    asset_type: "image",
                    block_id: null,
                    entry_id: "brand-1",
                    id: "asset-brand-1",
                    metadata: {},
                    sort_order: 0,
                    source_url: null,
                    storage_path: null,
                  },
                ],
                blocks: [],
                id: "brand-1",
                metadata: {},
                profile_data: {
                  accent: "global",
                  category: "Food",
                  country: "Vietnam",
                  feature: true,
                  featureCaption: "Published feature caption",
                  year: 2026,
                },
                published_at: null,
                slug: "published-brand",
                status: "published",
                subtitle: "Food",
                summary: "Published brand story.",
                title: "Published Brand",
              },
            ],
          },
          {
            collection_type: "leadership",
            config: null,
            description: null,
            id: "collection-leadership",
            slug: "leadership",
            title: "Leadership",
            entries: [
              {
                assets: [
                  {
                    alt_text: "Published leader portrait",
                    assetUrl: "/storage/richfield/leader.webp",
                    asset_type: "image",
                    block_id: null,
                    entry_id: "leader-1",
                    id: "asset-leader-1",
                    metadata: {},
                    sort_order: 0,
                    source_url: null,
                    storage_path: null,
                  },
                ],
                blocks: [
                  {
                    block_type: "markdown",
                    content: { markdown: "Published leader biography." },
                    entry_id: "leader-1",
                    id: "block-leader-bio",
                    sort_order: 0,
                    title: "Bio",
                  },
                  {
                    block_type: "quote",
                    content: { quote: "Published leader quote." },
                    entry_id: "leader-1",
                    id: "block-leader-quote",
                    sort_order: 1,
                    title: "Quote",
                  },
                ],
                id: "leader-1",
                metadata: {},
                profile_data: {},
                published_at: null,
                slug: "published-leader",
                status: "published",
                subtitle: "Chief Editor",
                summary: "Published leader summary.",
                title: "Published Leader",
              },
            ],
          },
          {
            collection_type: "milestones",
            config: null,
            description: null,
            id: "collection-milestones",
            slug: "milestones",
            title: "Milestones",
            entries: [
              {
                assets: [],
                blocks: [],
                id: "milestone-1",
                metadata: {},
                profile_data: {
                  aboutOnly: false,
                  brand: "Published Milestone Brand",
                  country: "Vietnam",
                  year: 2027,
                },
                published_at: null,
                slug: "published-milestone",
                status: "published",
                subtitle: "Vietnam",
                summary: "Published milestone body.",
                title: "Published Milestone",
              },
            ],
          },
          {
            collection_type: "contact-page",
            config: null,
            description: null,
            id: "collection-contact-page",
            slug: "contact-page",
            title: "Contact Page",
            entries: [
              {
                assets: [
                  {
                    alt_text: "Published contact background",
                    assetUrl: "/storage/richfield/contact.webp",
                    asset_type: "image",
                    block_id: null,
                    entry_id: "contact-page-1",
                    id: "asset-contact-1",
                    metadata: {},
                    sort_order: 0,
                    source_url: null,
                    storage_path: null,
                  },
                ],
                blocks: [
                  {
                    block_type: "markdown",
                    content: { markdown: "Published contact intro." },
                    entry_id: "contact-page-1",
                    id: "block-contact-intro",
                    sort_order: 0,
                    title: "Intro",
                  },
                ],
                id: "contact-page-1",
                metadata: {},
                profile_data: {
                  headline: "Published contact headline.",
                  mapQuery: "Published map query",
                },
                published_at: null,
                slug: "main",
                status: "published",
                subtitle: "Contact",
                summary: "Published contact summary.",
                title: "Contact Page",
              },
            ],
          },
          {
            collection_type: "contact-channels",
            config: null,
            description: null,
            id: "collection-contact-channels",
            slug: "contact-channels",
            title: "Contact Channels",
            entries: [
              {
                assets: [],
                blocks: [],
                id: "channel-1",
                metadata: {},
                profile_data: {
                  cta: "Published CTA",
                  external: true,
                  href: "https://example.com/contact",
                  kind: "office",
                  secondary: "Published secondary",
                  sortOrder: 5,
                },
                published_at: null,
                slug: "published-channel",
                status: "published",
                subtitle: "Published secondary",
                summary: "Published primary",
                title: "Published Channel",
              },
            ],
          },
          {
            collection_type: "jobs",
            config: null,
            description: null,
            id: "collection-jobs",
            slug: "jobs",
            title: "Jobs",
            entries: [
              {
                assets: [],
                blocks: [],
                id: "job-1",
                metadata: {},
                profile_data: {
                  deadline: "31 Dec 2026",
                  href: "https://example.com/jobs/sales",
                  location: "Ho Chi Minh City",
                  positions: 2,
                  sortOrder: 10,
                },
                published_at: null,
                slug: "sales-executive",
                status: "published",
                subtitle: "Ho Chi Minh City",
                summary: "Published job summary.",
                title: "Sales Executive",
              },
            ],
          },
          {
            collection_type: "image-library",
            config: null,
            description: null,
            id: "collection-image-library",
            slug: "image-library",
            title: "Images",
            entries: [
              {
                assets: [
                  {
                    alt_text: "Published career image",
                    assetUrl: "/storage/richfield/career.webp",
                    asset_type: "image",
                    block_id: null,
                    entry_id: "image-1",
                    id: "asset-image-1",
                    metadata: {},
                    sort_order: 0,
                    source_url: null,
                    storage_path: null,
                  },
                ],
                blocks: [],
                id: "image-1",
                metadata: {},
                profile_data: {
                  objectPosition: "center 40%",
                  pageSection: "careers",
                  ratio: 1.333,
                  sortOrder: 10,
                  usageTags: ["hero", "gallery"],
                },
                published_at: null,
                slug: "career-image",
                status: "published",
                subtitle: "careers",
                summary: "Published career image",
                title: "Career image",
              },
            ],
          },
        ],
      },
      { apiBaseUrl: "https://platform.example.com/api/v1" },
    );

    expect(content.brands[0]).toEqual(
      expect.objectContaining({
        category: "Food",
        country: "Vietnam",
        feature: true,
        featureCaption: "Published feature caption",
        logoSrc: "https://platform.example.com/storage/richfield/brand.webp",
        name: "Published Brand",
        story: "Published brand story.",
        year: 2026,
      }),
    );
    expect(content.homepageBrands[0]?.name).toBe("Published Brand");
    expect(content.leaders[0]).toEqual(
      expect.objectContaining({
        bio: "Published leader biography.",
        name: "Published Leader",
        photo: "https://platform.example.com/storage/richfield/leader.webp",
        quote: "Published leader quote.",
        role: "Chief Editor",
      }),
    );
    expect(content.milestones[0]).toEqual(
      expect.objectContaining({
        aboutOnly: false,
        body: "Published milestone body.",
        brand: "Published Milestone Brand",
        country: "Vietnam",
        year: 2027,
      }),
    );
    expect(content.homepageMilestones[0]?.brand).toBe(
      "Published Milestone Brand",
    );
    expect(content.brandTimeline[0]).toEqual(
      expect.objectContaining({
        brand: "Published Brand",
        year: 2026,
      }),
    );
    expect(content.contactPage).toEqual(
      expect.objectContaining({
        headline: "Published contact headline.",
        intro: "Published contact intro.",
        mapQuery: "Published map query",
      }),
    );
    expect(content.contactChannels[0]).toEqual(
      expect.objectContaining({
        cta: "Published CTA",
        href: "https://example.com/contact",
        label: "Published Channel",
        primary: "Published primary",
      }),
    );
    expect(content.openPositions[0]).toEqual(
      expect.objectContaining({
        deadline: "31 Dec 2026",
        location: "Ho Chi Minh City",
        positions: 2,
        title: "Sales Executive",
      }),
    );
    expect(content.imageLibrary[0]).toEqual(
      expect.objectContaining({
        pageSection: "careers",
        src: "https://platform.example.com/storage/richfield/career.webp",
        title: "Career image",
      }),
    );
  });

  test("falls back to static content when delivery is missing or not Richfield", () => {
    expect(
      buildRichfieldContent(null, {
        apiBaseUrl: "https://platform.example.com/api/v1",
      }),
    ).toBe(DEFAULT_RICHFIELD_CONTENT);
    expect(
      buildRichfieldContent(
        {
          adapter: "yashie",
          canonicalProjectId: "yashie",
          collections: [],
          generatedAt: new Date("2026-06-19").toISOString(),
          loadingData: null,
          profileData: {},
          workspaceId: "workspace-1",
        },
        { apiBaseUrl: "https://platform.example.com/api/v1" },
      ),
    ).toBe(DEFAULT_RICHFIELD_CONTENT);
    expect(DEFAULT_RICHFIELD_CONTENT.brands).toBe(brands);
    expect(DEFAULT_RICHFIELD_CONTENT.homepageBrands).toBe(homepageBrands);
    expect(DEFAULT_RICHFIELD_CONTENT.leaders).toBe(leaders);
    expect(DEFAULT_RICHFIELD_CONTENT.milestones).toBe(milestones);
    expect(DEFAULT_RICHFIELD_CONTENT.homepageMilestones).toBe(homepageMilestones);
  });

  test("builds the brand shelf from Gallery entries by category and placement", () => {
    const content = buildRichfieldContent(
      {
        adapter: "richfield",
        canonicalProjectId: "richfield",
        generatedAt: new Date("2026-06-19").toISOString(),
        loadingData: null,
        profileData: {},
        workspaceId: "workspace-1",
        collections: [
          {
            collection_type: "image-library",
            config: null,
            description: null,
            id: "collection-image-library",
            slug: "image-library",
            title: "Gallery",
            entries: [
              {
                assets: [
                  {
                    alt_text: "Published food banner",
                    assetUrl: "/storage/richfield/food-banner.webp",
                    asset_type: "image",
                    block_id: null,
                    entry_id: "image-banner",
                    id: "asset-image-banner",
                    metadata: {},
                    sort_order: 0,
                    source_url: null,
                    storage_path: null,
                  },
                ],
                blocks: [],
                id: "image-banner",
                metadata: {},
                profile_data: {
                  brand: "Published Food",
                  category: "Food",
                  pageSection: "brands",
                  placement: "shelf-banner",
                  ratio: 2,
                  shelfWeight: "hero",
                  sortOrder: 1,
                },
                published_at: null,
                slug: "published-food-banner",
                status: "published",
                subtitle: "brands",
                summary: "Published food banner",
                title: "Published Food banner",
              },
              {
                assets: [
                  {
                    alt_text: "Published food product",
                    assetUrl: "/storage/richfield/food-product.webp",
                    asset_type: "image",
                    block_id: null,
                    entry_id: "image-product",
                    id: "asset-image-product",
                    metadata: {},
                    sort_order: 0,
                    source_url: null,
                    storage_path: null,
                  },
                ],
                blocks: [],
                id: "image-product",
                metadata: {},
                profile_data: {
                  brand: "Published Food",
                  category: "Food",
                  feature: true,
                  pageSection: "brands",
                  placement: "shelf-product",
                  productName: "Published Snack",
                  sortOrder: 2,
                },
                published_at: null,
                slug: "published-food-product",
                status: "published",
                subtitle: "brands",
                summary: "Published food product",
                title: "Published Snack",
              },
            ],
          },
        ],
      },
      { apiBaseUrl: "https://platform.example.com/api/v1" },
    );

    expect(content.shelfCategories[0]).toEqual(
      expect.objectContaining({
        label: "Food",
        brands: ["Published Food"],
        banners: [
          expect.objectContaining({
            brand: "Published Food",
            src: "https://platform.example.com/storage/richfield/food-banner.webp",
            weight: "hero",
          }),
        ],
        packshots: [
          expect.objectContaining({
            brand: "Published Food",
            feature: true,
            name: "Published Snack",
            src: "https://platform.example.com/storage/richfield/food-product.webp",
          }),
        ],
      }),
    );
    expect(content.shelfCategories[1]?.label).toBe("Beverages");
    expect(content.shelfCategories[1]?.packshots.length).toBeGreaterThan(0);
  });

  test("keeps public Richfield source images as local next/image paths", () => {
    const content = buildRichfieldContent(
      {
        adapter: "richfield",
        canonicalProjectId: "richfield",
        generatedAt: new Date("2026-06-19").toISOString(),
        loadingData: null,
        profileData: {},
        workspaceId: "workspace-1",
        collections: [
          {
            collection_type: "brands",
            config: null,
            description: null,
            id: "collection-brands",
            slug: "brands",
            title: "Brands",
            entries: [
              {
                assets: [
                  {
                    alt_text: "Mars Wrigley logo",
                    assetUrl: "http://localhost:3000/photos/logos/mars-wrigley.webp",
                    asset_type: "image",
                    block_id: null,
                    entry_id: "brand-1",
                    id: "asset-brand-1",
                    metadata: {},
                    sort_order: 0,
                    source_url: null,
                    storage_path: null,
                  },
                ],
                blocks: [],
                id: "brand-1",
                metadata: {},
                profile_data: {
                  category: "Food",
                  country: "Vietnam",
                  year: 2026,
                },
                published_at: null,
                slug: "mars-wrigley",
                status: "published",
                subtitle: "Food",
                summary: "Published brand story.",
                title: "Mars Wrigley",
              },
            ],
          },
        ],
      },
      { apiBaseUrl: "https://platform.example.com/api/v1" },
    );

    expect(content.brands[0]?.logoSrc).toBe("/photos/logos/mars-wrigley.webp");
  });
});

describe("delivery image resolution", () => {
  function buildWithAsset(asset: Record<string, unknown>) {
    return buildRichfieldContent(
      {
        adapter: "richfield",
        canonicalProjectId: "richfield",
        generatedAt: new Date("2026-07-27").toISOString(),
        loadingData: null,
        profileData: {},
        workspaceId: "workspace-1",
        collections: [
          {
            collection_type: "brands",
            config: null,
            description: null,
            id: "collection-brands",
            slug: "brands",
            title: "Brands",
            entries: [
              {
                assets: [
                  {
                    alt_text: "Mars Wrigley logo",
                    assetUrl: null,
                    asset_type: "image",
                    block_id: null,
                    entry_id: "brand-1",
                    id: "asset-brand-1",
                    metadata: {},
                    sort_order: 0,
                    source_url: null,
                    storage_path: null,
                    ...asset,
                  },
                ],
                blocks: [],
                id: "brand-1",
                metadata: {},
                profile_data: { category: "Food", country: "Vietnam", year: 2026 },
                published_at: null,
                slug: "mars-wrigley",
                status: "published",
                subtitle: "Food",
                summary: "Published brand story.",
                title: "Mars Wrigley",
              },
            ],
          },
        ],
      },
      { apiBaseUrl: "https://platform.example.com/api/v1" },
    );
  }

  test("prefers the published public path over the delivery asset endpoint", () => {
    // The endpoint only 307s back to this same path, and next/image rejects a
    // remote host absent from remotePatterns — preferring it broke every brand
    // logo on the live site.
    const content = buildWithAsset({
      assetUrl:
        "https://tuturuuu.com/api/v1/workspaces/ws/external-projects/assets/asset-brand-1",
      metadata: { publicPath: "/photos/logos/mars-wrigley.webp" },
    });

    expect(content.brands[0]?.logoSrc).toBe("/photos/logos/mars-wrigley.webp");
  });

  test("falls back to the asset endpoint when no public path is recorded", () => {
    const content = buildWithAsset({
      assetUrl: "/photos/logos/fallback.webp",
      metadata: {},
    });

    expect(content.brands[0]?.logoSrc).toBe("/photos/logos/fallback.webp");
  });

  test("ignores a blank public path rather than yielding an empty src", () => {
    const content = buildWithAsset({
      assetUrl: "/photos/logos/fallback.webp",
      metadata: { publicPath: "   " },
    });

    expect(content.brands[0]?.logoSrc).toBe("/photos/logos/fallback.webp");
  });

  test("publishes locale variants independently without leaking English", () => {
    const delivery = {
      adapter: "richfield",
      canonicalProjectId: "richfield",
      generatedAt: new Date("2026-07-27").toISOString(),
      loadingData: null,
      profileData: {},
      workspaceId: "workspace-1",
      collections: [
        {
          collection_type: "articles",
          config: null,
          description: null,
          id: "articles",
          slug: "articles",
          title: "News",
          entries: [
            {
              assets: [],
              blocks: [],
              id: "article-1",
              metadata: {
                richfieldLocalization: {
                  defaultLocale: "en",
                  locales: {
                    en: {
                      body: "English body",
                      status: "published",
                      summary: "English summary",
                      title: "English story",
                    },
                    vi: {
                      body: "Nội dung tiếng Việt",
                      status: "draft",
                      summary: "Tóm tắt tiếng Việt",
                      title: "Tin tiếng Việt",
                    },
                  },
                  sourceLocale: "en",
                  supportedLocales: ["en", "vi"],
                  version: 1,
                },
              },
              profile_data: {},
              published_at: null,
              slug: "localized-story",
              status: "published",
              subtitle: null,
              summary: "Legacy summary",
              title: "Legacy title",
            },
          ],
        },
      ],
    };

    const english = buildRichfieldContent(delivery, {
      apiBaseUrl: "https://platform.example.com/api/v1",
      locale: "en",
    });
    const vietnamese = buildRichfieldContent(delivery, {
      apiBaseUrl: "https://platform.example.com/api/v1",
      locale: "vi",
    });

    expect(english.articles[0]).toMatchObject({
      body: "English body",
      title: "English story",
    });
    expect(vietnamese.articles).toEqual([]);
  });
});
