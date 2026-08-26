import { brands, type Brand } from "@/content/en/brands";
import { openPositions, type OpenPosition } from "@/content/en/careers";
import { leaders, type Leader } from "@/content/en/leadership";
import { milestones, type Milestone } from "@/content/en/milestones";
import { peoplePhotos, partnerLogos } from "@/content/en/photography";
import { shelfCategories } from "@/content/en/shelf";
import { site } from "@/content/en/site";
import { RICHFIELD_CONTACT_CHANNELS } from "./richfield-contact-channels";
import { DEFAULT_RICHFIELD_CONTACT_RECIPIENTS } from "./richfield-contact-recipients";

export type RichfieldSyncField = {
  description?: string | null;
  key: string;
  label: string;
  localizable?: boolean;
  options?: string[];
  required?: boolean;
  type:
    | "boolean"
    | "date"
    | "datetime"
    | "json"
    | "markdown"
    | "number"
    | "string"
    | "string-array";
};

export type RichfieldExternalProjectManifest = {
  adapter: "richfield";
  content: {
    entries: Array<{
      assets?: Array<{
        altText?: string | null;
        assetType: string;
        metadata?: Record<string, unknown>;
        sortOrder?: number;
        sourceUrl?: string | null;
        stableSourceId: string;
        storagePath?: string | null;
      }>;
      blocks?: Array<{
        blockType: string;
        content: Record<string, unknown>;
        sortOrder?: number;
        stableSourceId: string;
        title?: string | null;
      }>;
      collectionSlug: string;
      metadata?: Record<string, unknown>;
      profileData?: Record<string, unknown>;
      slug: string;
      stableSourceId: string;
      status?: "draft" | "scheduled" | "published" | "archived";
      subtitle?: string | null;
      summary?: string | null;
      title: string;
    }>;
  };
  localization: {
    assetAltText: boolean;
    blockContent: boolean;
    defaultLocale: "en";
    entryFields: Array<"subtitle" | "summary" | "title">;
    supportedLocales: ["en", "vi"];
  };
  schema: {
    collections: Array<{
      assetTypes?: string[];
      blockTypes?: string[];
      collection_type: string;
      description?: string | null;
      metadataFields?: RichfieldSyncField[];
      profileFields?: RichfieldSyncField[];
      slug: string;
      title: string;
    }>;
    metadataFields?: RichfieldSyncField[];
    profileFields?: RichfieldSyncField[];
  };
  version: 1;
};

const PUBLISHED_STATUS = "published" as const;

function localizeFields(
  fields: RichfieldSyncField[],
  keys: readonly string[],
) {
  const localizableKeys = new Set(keys);
  return fields.map((field) => ({
    ...field,
    localizable: localizableKeys.has(field.key),
  }));
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const brandFields = [
  { key: "country", label: "Country", type: "string" },
  { key: "year", label: "Year", type: "number" },
  {
    key: "category",
    label: "Category",
    options: ["Food", "Beverages", "Non-Food"],
    type: "string",
  },
  { key: "accent", label: "Accent", type: "string" },
  { key: "feature", label: "Feature", type: "boolean" },
  { key: "featureCaption", label: "Feature caption", type: "string" },
] satisfies RichfieldSyncField[];

const leadershipFields = [
  { key: "role", label: "Role", type: "string" },
] satisfies RichfieldSyncField[];

const milestoneFields = [
  { key: "year", label: "Year", type: "number" },
  { key: "country", label: "Country", type: "string" },
  { key: "brand", label: "Brand", type: "string" },
  { key: "aboutOnly", label: "About only", type: "boolean" },
] satisfies RichfieldSyncField[];

const contactPageFields = [
  { key: "headline", label: "Headline", type: "string" },
  { key: "intro", label: "Intro", type: "markdown" },
  { key: "mapQuery", label: "Map query", type: "string" },
  { key: "backgroundImageSlug", label: "Background image slug", type: "string" },
] satisfies RichfieldSyncField[];

const contactChannelFields = [
  {
    key: "kind",
    label: "Kind",
    options: ["office", "phone", "email", "facebook"],
    type: "string",
  },
  { key: "href", label: "Link", type: "string" },
  { key: "secondary", label: "Secondary text", type: "string" },
  { key: "cta", label: "Call to action", type: "string" },
  { key: "external", label: "External", type: "boolean" },
  { key: "sortOrder", label: "Sort order", type: "number" },
] satisfies RichfieldSyncField[];

const contactSubmissionFields = [
  { key: "name", label: "Name", type: "string" },
  { key: "company", label: "Company", type: "string" },
  { key: "country", label: "Country", type: "string" },
  { key: "email", label: "Email", type: "string" },
  { key: "inquiryType", label: "Inquiry type", type: "string" },
  { key: "receivedAt", label: "Received at", type: "datetime" },
  {
    key: "submissionStatus",
    label: "Submission status",
    options: ["new", "reviewed", "archived"],
    type: "string",
  },
  {
    key: "emailNotificationStatus",
    label: "Email notification status",
    options: ["pending", "sent", "failed"],
    type: "string",
  },
] satisfies RichfieldSyncField[];

const contactFormFields = [
  { key: "recipientEmail", label: "Recipient email", type: "string" },
  { key: "submitLabel", label: "Submit button label", type: "string" },
  { key: "successMessage", label: "Success message", type: "string" },
  { key: "inquiryTypes", label: "Inquiry types", type: "string-array" },
  { key: "maxMessageLength", label: "Maximum message length", type: "number" },
] satisfies RichfieldSyncField[];

const jobFields = [
  { key: "positions", label: "Positions", type: "number" },
  { key: "department", label: "Department", type: "string" },
  { key: "employmentType", label: "Employment type", type: "string" },
  { key: "workMode", label: "Work mode", type: "string" },
  { key: "location", label: "Location", type: "string" },
  { key: "deadline", label: "Deadline", type: "string" },
  { key: "applyEmail", label: "Application email", type: "string" },
  { key: "href", label: "External link", type: "string" },
  { key: "sortOrder", label: "Sort order", type: "number" },
] satisfies RichfieldSyncField[];

const articleFields = [
  { key: "author", label: "Author", type: "string" },
  { key: "category", label: "Category", type: "string" },
  { key: "publishedAt", label: "Published at", type: "datetime" },
  { key: "feature", label: "Featured", type: "boolean" },
  { key: "sortOrder", label: "Sort order", type: "number" },
] satisfies RichfieldSyncField[];

const imageLibraryFields = [
  {
    key: "pageSection",
    label: "Page section",
    options: [
      "home",
      "about",
      "brands",
      "careers",
      "contact",
      "distribution",
      "logistics",
      "footer-navigation",
      "shared",
    ],
    type: "string",
  },
  { key: "placement", label: "Placement", type: "string" },
  { key: "brand", label: "Brand", type: "string" },
  {
    key: "category",
    label: "Category",
    options: ["Food", "Beverages", "Non-Food"],
    type: "string",
  },
  { key: "productName", label: "Product name", type: "string" },
  { key: "feature", label: "Featured tile", type: "boolean" },
  {
    key: "shelfWeight",
    label: "Shelf banner size",
    options: ["hero", "wide", "feature"],
    type: "string",
  },
  { key: "usageTags", label: "Usage tags", type: "string-array" },
  { key: "objectPosition", label: "Object position", type: "string" },
  { key: "ratio", label: "Ratio", type: "number" },
  { key: "credit", label: "Credit", type: "string" },
  { key: "sortOrder", label: "Sort order", type: "number" },
] satisfies RichfieldSyncField[];

function imageAsset({
  altText,
  collectionSlug,
  image,
  slug,
}: {
  altText: string;
  collectionSlug: string;
  image: string;
  slug: string;
}) {
  return {
    altText,
    assetType: "image",
    metadata: {
      publicPath: image,
    },
    sortOrder: 0,
    sourceUrl: image,
    stableSourceId: `richfield:${collectionSlug}:${slug}:image`,
  };
}

function firstLine(value: string) {
  return value.split("\n")[0]?.trim() ?? value;
}

const MAX_SUMMARY_GRAPHEMES = 250;

function truncateSummary(value: string, maxGraphemes = MAX_SUMMARY_GRAPHEMES) {
  const segments = [...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(value)];
  return segments.length > maxGraphemes
    ? segments.slice(0, maxGraphemes).map((s) => s.segment).join("") + "…"
    : value;
}

function brandEntry(brand: Brand) {
  const slug = slugify(brand.name);

  return {
    assets: brand.logoSrc
      ? [
          imageAsset({
            altText: brand.name,
            collectionSlug: "brands",
            image: brand.logoSrc,
            slug,
          }),
        ]
      : [],
    blocks: [],
    collectionSlug: "brands",
    profileData: {
      accent: brand.accent ?? null,
      category: brand.category ?? null,
      country: brand.country,
      feature: brand.feature ?? false,
      featureCaption: brand.featureCaption ?? null,
      year: brand.year ?? null,
    },
    slug,
    stableSourceId: `richfield:brands:${slug}`,
    status: PUBLISHED_STATUS,
    subtitle: brand.category ?? null,
    summary: brand.story ? truncateSummary(brand.story) : null,
    title: brand.name,
  };
}

function leaderEntry(leader: Leader) {
  const slug = slugify(leader.name);

  const blocks: Array<{
    blockType: string;
    content: Record<string, unknown>;
    sortOrder: number;
    stableSourceId: string;
    title: string;
  }> = [
    {
      blockType: "markdown",
      content: {
        markdown: leader.bio,
      },
      sortOrder: 0,
      stableSourceId: `richfield:leadership:${slug}:bio`,
      title: "Bio",
    },
  ];

  if (leader.quote) {
    blocks.push({
      blockType: "quote",
      content: {
        quote: leader.quote,
      },
      sortOrder: 1,
      stableSourceId: `richfield:leadership:${slug}:quote`,
      title: "Quote",
    });
  }

  return {
    assets: [
      imageAsset({
        altText: leader.name,
        collectionSlug: "leadership",
        image: leader.photo,
        slug,
      }),
    ],
    blocks,
    collectionSlug: "leadership",
    profileData: {
      role: leader.role,
    },
    slug,
    stableSourceId: `richfield:leadership:${slug}`,
    status: PUBLISHED_STATUS,
    subtitle: leader.role,
    summary: truncateSummary(firstLine(leader.bio)),
    title: leader.name,
  };
}

function milestoneEntry(milestone: Milestone) {
  const slug = slugify(`${milestone.year}-${milestone.brand}`);

  return {
    blocks: [],
    collectionSlug: "milestones",
    profileData: {
      aboutOnly: milestone.aboutOnly ?? false,
      brand: milestone.brand,
      country: milestone.country,
      year: milestone.year,
    },
    slug,
    stableSourceId: `richfield:milestones:${slug}`,
    status: PUBLISHED_STATUS,
    subtitle: milestone.country,
    summary: truncateSummary(milestone.body),
    title: milestone.brand,
  };
}

function contactPageEntry() {
  const intro =
    "Brand owner exploring Vietnam, partner considering a joint venture, or journalist on deadline: we'll write back within two business days.";

  return {
    assets: [
      imageAsset({
        altText: "Richfield team spelling the company name on the beach",
        collectionSlug: "contact-page",
        image: "/photos/contact-richfield.webp",
        slug: "main",
      }),
    ],
    blocks: [
      {
        blockType: "markdown",
        content: { markdown: intro },
        sortOrder: 0,
        stableSourceId: "richfield:contact-page:main:intro",
        title: "Intro",
      },
    ],
    collectionSlug: "contact-page",
    profileData: {
      backgroundImageSlug: "contact-richfield",
      headline: "Tell us about your brand.",
      intro,
      mapQuery: site.address.full,
    },
    slug: "main",
    stableSourceId: "richfield:contact-page:main",
    status: PUBLISHED_STATUS,
    subtitle: "Contact",
    summary: intro,
    title: "Contact Page",
  };
}

function contactChannelEntries() {
  return RICHFIELD_CONTACT_CHANNELS.map((channel) => ({
    blocks: [],
    collectionSlug: "contact-channels",
    profileData: {
      cta: channel.cta,
      external: channel.external,
      href: channel.href,
      kind: channel.kind,
      secondary: channel.secondary,
      sortOrder: channel.sortOrder,
    },
    slug: channel.slug,
    stableSourceId: `richfield:contact-channels:${channel.slug}`,
    status: PUBLISHED_STATUS,
    subtitle: channel.secondary,
    summary: channel.primary,
    title: channel.label,
  }));
}

function contactFormEntry() {
  const successMessage =
    "Thanks. We'll write back from our partnerships team within two business days.";

  return {
    blocks: [
      {
        blockType: "markdown",
        content: { markdown: successMessage },
        sortOrder: 0,
        stableSourceId: "richfield:contact-form:main:success",
        title: "Success message",
      },
    ],
    collectionSlug: "contact-form",
    profileData: {
      inquiryTypes: [
        "Brand partnership",
        "Distribution opportunity",
        "Careers",
        "Press",
        "Other",
      ],
      maxMessageLength: 1_200,
      recipientEmail: DEFAULT_RICHFIELD_CONTACT_RECIPIENTS[0],
      submitLabel: "Send message",
      successMessage,
    },
    slug: "main",
    stableSourceId: "richfield:contact-form:main",
    status: PUBLISHED_STATUS,
    subtitle: "External project form",
    summary: "Self-serve configuration for the public contact form.",
    title: "Contact Form",
  };
}

function jobEntry(job: OpenPosition, index: number) {
  const slug = job.slug || slugify(job.title);

  return {
    blocks: job.body
      ? [
          {
            blockType: "markdown",
            content: { markdown: job.body },
            sortOrder: 0,
            stableSourceId: `richfield:jobs:${slug}:body`,
            title: "Position details",
          },
        ]
      : [],
    collectionSlug: "jobs",
    profileData: {
      applyEmail: job.applyEmail ?? null,
      deadline: job.deadline,
      department: job.department ?? null,
      employmentType: job.employmentType ?? null,
      href: job.href ?? null,
      location: job.location,
      positions: job.positions,
      sortOrder: index * 10,
      workMode: job.workMode ?? null,
    },
    slug,
    stableSourceId: `richfield:jobs:${slug}`,
    status: PUBLISHED_STATUS,
    subtitle: job.location,
    summary:
      job.summary ??
      `${job.positions} position${job.positions === 1 ? "" : "s"} · ${job.deadline}`,
    title: job.title,
  };
}

type ImageLibrarySeed = {
  alt: string;
  brand?: string;
  category?: string;
  feature?: boolean;
  pageSection: string;
  placement: string;
  productName?: string;
  ratio?: number;
  shelfWeight?: string;
  slug: string;
  sortOrder: number;
  src: string;
  title: string;
  usageTags: string[];
};

const curatedImageSeeds: ImageLibrarySeed[] = [
  ...Object.entries(peoplePhotos).map(([key, photo], index) => ({
    alt: photo.alt,
    pageSection: key.startsWith("hero") ? "home" : "careers",
    placement: key.startsWith("hero") ? "cover-portrait" : "gallery-image",
    ratio: photo.ratio,
    slug: slugify(`people-${key}`),
    sortOrder: index * 10,
    src: photo.src,
    title: key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()),
    usageTags: key.startsWith("hero") ? ["hero", "people"] : ["gallery", "people"],
  })),
  ...Object.entries(partnerLogos).map(([name, src], index) => ({
    alt: `${name} logo`,
    brand: name,
    pageSection: "brands",
    placement: "brand-logo",
    slug: slugify(`logo-${name}`),
    sortOrder: 1000 + index * 10,
    src,
    title: `${name} logo`,
    usageTags: ["logo", "brand"],
  })),
  ...shelfCategories.flatMap((category, categoryIndex) =>
    [
      ...category.banners.map((banner, index) => ({
        alt: banner.alt,
        brand: banner.brand,
        category: category.label,
        pageSection: "brands",
        placement: "shelf-banner",
        ratio: banner.ratio,
        shelfWeight: banner.weight,
        slug: slugify(`shelf-banner-${category.id}-${banner.brand}-${index}`),
        sortOrder: 2000 + categoryIndex * 1000 + index * 10,
        src: banner.src,
        title: `${banner.brand} banner`,
        usageTags: ["shelf", "banner", category.id, banner.brand],
      })),
      ...category.packshots.map((photo, index) => ({
        alt: photo.alt,
        brand: photo.brand,
        category: category.label,
        feature: photo.feature ?? false,
        pageSection: "brands",
        placement: "shelf-product",
        productName: photo.name,
        slug: slugify(`shelf-product-${category.id}-${photo.brand}-${photo.name}`),
        sortOrder: 2400 + categoryIndex * 1000 + index * 10,
        src: photo.src,
        title: photo.name,
        usageTags: ["shelf", "product", category.id, photo.brand],
      })),
    ],
  ),
  {
    alt: "Richfield team spelling the company name on the beach",
    pageSection: "contact",
    placement: "contact-hero",
    ratio: 16 / 9,
    slug: "contact-richfield",
    sortOrder: 3000,
    src: "/photos/contact-richfield.webp",
    title: "Contact Richfield",
    usageTags: ["background", "contact"],
  },
  {
    alt: "Richfield contact background",
    pageSection: "contact",
    placement: "contact-background",
    ratio: 16 / 9,
    slug: "contact-background",
    sortOrder: 3010,
    src: "/photos/contact-bg.webp",
    title: "Contact Background",
    usageTags: ["background", "contact"],
  },
];

function imageLibraryEntry(seed: ImageLibrarySeed) {
  return {
    assets: [
      imageAsset({
        altText: seed.alt,
        collectionSlug: "image-library",
        image: seed.src,
        slug: seed.slug,
      }),
    ],
    blocks: [],
    collectionSlug: "image-library",
    profileData: {
      credit: null,
      brand: seed.brand ?? null,
      category: seed.category ?? null,
      feature: seed.feature ?? false,
      objectPosition: "center",
      pageSection: seed.pageSection,
      placement: seed.placement,
      productName: seed.productName ?? null,
      ratio: seed.ratio ?? null,
      shelfWeight: seed.shelfWeight ?? null,
      sortOrder: seed.sortOrder,
      usageTags: seed.usageTags,
    },
    slug: seed.slug,
    stableSourceId: `richfield:image-library:${seed.slug}`,
    status: PUBLISHED_STATUS,
    subtitle: seed.pageSection,
    summary: seed.alt,
    title: seed.title,
  };
}

export const richfieldExternalProjectManifest = {
  adapter: "richfield",
  content: {
    entries: [
      ...brands.map(brandEntry),
      ...leaders.map(leaderEntry),
      ...milestones.map(milestoneEntry),
      contactPageEntry(),
      ...contactChannelEntries(),
      contactFormEntry(),
      ...openPositions.map(jobEntry),
      ...curatedImageSeeds.map(imageLibraryEntry),
    ],
  },
  localization: {
    assetAltText: true,
    blockContent: true,
    defaultLocale: "en",
    entryFields: ["title", "subtitle", "summary"],
    supportedLocales: ["en", "vi"],
  },
  schema: {
    metadataFields: [
      {
        key: "bodyContent",
        label: "Structured body",
        localizable: true,
        type: "json",
      },
      {
        key: "summaryContent",
        label: "Structured summary",
        localizable: true,
        type: "json",
      },
      {
        key: "gallery",
        label: "Article gallery",
        localizable: true,
        type: "json",
      },
      {
        key: "richTextVersion",
        label: "Rich text version",
        localizable: false,
        type: "number",
      },
    ],
    collections: [
      {
        assetTypes: ["image"],
        collection_type: "brands",
        description:
          "Partner brands in the Richfield portfolio with country, category, and story copy.",
        profileFields: localizeFields(brandFields, ["featureCaption"]),
        slug: "brands",
        title: "Brands",
      },
      {
        assetTypes: ["image"],
        blockTypes: ["markdown", "quote"],
        collection_type: "leadership",
        description: "Richfield leadership profiles, bios, and quotes.",
        profileFields: localizeFields(leadershipFields, ["role"]),
        slug: "leadership",
        title: "Leadership",
      },
      {
        collection_type: "milestones",
        description: "Company timeline milestones from founding to the present day.",
        profileFields: localizeFields(milestoneFields, []),
        slug: "milestones",
        title: "Milestones",
      },
      {
        assetTypes: ["image"],
        blockTypes: ["markdown"],
        collection_type: "contact-page",
        description: "Public contact page hero copy, map details, and imagery.",
        profileFields: localizeFields(contactPageFields, ["headline", "intro"]),
        slug: "contact-page",
        title: "Contact Page",
      },
      {
        collection_type: "contact-channels",
        description: "Public contact methods shown on the contact page.",
        profileFields: localizeFields(contactChannelFields, ["secondary", "cta"]),
        slug: "contact-channels",
        title: "Contact Channels",
      },
      {
        blockTypes: ["markdown"],
        collection_type: "contact-form",
        description:
          "Public form fields, inquiry choices, recipient routing, and success messaging.",
        profileFields: localizeFields(contactFormFields, [
          "submitLabel",
          "successMessage",
          "inquiryTypes",
        ]),
        slug: "contact-form",
        title: "Contact Form",
      },
      {
        blockTypes: ["markdown"],
        collection_type: "contact-submissions",
        description: "Private inbound contact form messages saved for Richfield admins.",
        profileFields: localizeFields(contactSubmissionFields, []),
        slug: "contact-submissions",
        title: "Contact Inbox",
      },
      {
        assetTypes: ["image"],
        blockTypes: ["markdown"],
        collection_type: "articles",
        description:
          "Self-serve Richfield news, stories, and company updates published to the public feed.",
        profileFields: localizeFields(articleFields, ["category"]),
        slug: "articles",
        title: "News",
      },
      {
        assetTypes: ["image"],
        blockTypes: ["markdown"],
        collection_type: "jobs",
        description:
          "Careers vacancies, application details, and rich position descriptions shown on the public site.",
        profileFields: localizeFields(jobFields, [
          "department",
          "employmentType",
          "workMode",
          "location",
        ]),
        slug: "jobs",
        title: "Jobs",
      },
      {
        assetTypes: ["image"],
        collection_type: "image-library",
        description: "Reusable Richfield images grouped by page section.",
        profileFields: localizeFields(imageLibraryFields, [
          "category",
          "productName",
          "credit",
        ]),
        slug: "image-library",
        title: "Images",
      },
    ],
  },
  version: 1,
} satisfies RichfieldExternalProjectManifest;

export function getRichfieldManifestCollectionSchema(
  collectionSlug: string | null | undefined,
) {
  return (
    richfieldExternalProjectManifest.schema.collections.find(
      (collection) => collection.slug === collectionSlug,
    ) ?? null
  );
}
