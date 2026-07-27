import type { RichfieldAdminCollectionKey } from "@/lib/richfield-admin-content-model";

/**
 * The dashboard's information architecture, in one place.
 *
 * Sections are addressable URLs rather than tab state, so an editor can
 * bookmark the news list, land back on it after a refresh, and use the browser
 * Back button the way they expect. A registry rather than a dozen near-identical
 * route files: every section renders the same list, so the only thing that
 * actually varies is this data.
 *
 * Copy is deliberately plain — "News", not "Articles collection" — because the
 * people using this are not the people who built it.
 */
export type AdminSectionGroup = "content" | "contact" | "media" | "team";

export type AdminSection = {
  /** Collection this section edits; absent for pages that are not a list. */
  collectionKey?: RichfieldAdminCollectionKey;
  description: string;
  /** Shown when the list is empty — says what to do, not just that it is empty. */
  emptyHint: string;
  group: AdminSectionGroup;
  slug: string;
  title: string;
};

export const ADMIN_SECTION_GROUPS: Array<{
  id: AdminSectionGroup;
  label: string;
}> = [
  { id: "content", label: "Content" },
  { id: "contact", label: "Enquiries" },
  { id: "media", label: "Media" },
  { id: "team", label: "Workspace" },
];

export const ADMIN_SECTIONS: AdminSection[] = [
  {
    collectionKey: "articles",
    description: "Company news, partnership stories, and updates.",
    emptyHint: "Write your first story and it will appear on the News page.",
    group: "content",
    slug: "news",
    title: "News",
  },
  {
    collectionKey: "jobs",
    description: "Open positions shown on the Careers page.",
    emptyHint:
      "Add a position and it will show on the Careers page straight away.",
    group: "content",
    slug: "careers",
    title: "Careers",
  },
  {
    collectionKey: "brands",
    description: "The brands Richfield distributes.",
    emptyHint: "Add a brand to show it on the Brands page.",
    group: "content",
    slug: "brands",
    title: "Brands",
  },
  {
    collectionKey: "leadership",
    description: "Leadership profiles and quotes.",
    emptyHint: "Add a leader to show them on the site.",
    group: "content",
    slug: "leadership",
    title: "Leadership",
  },
  {
    collectionKey: "milestones",
    description: "The company timeline.",
    emptyHint: "Add a milestone to build out the timeline.",
    group: "content",
    slug: "milestones",
    title: "Milestones",
  },
  {
    collectionKey: "contact-submissions",
    description: "Messages sent through the contact form.",
    emptyHint: "Messages from the website will land here.",
    group: "contact",
    slug: "responses",
    title: "Responses",
  },
  {
    collectionKey: "contact-page",
    description: "Contact page heading, map, and imagery.",
    emptyHint: "Set up the contact page copy here.",
    group: "contact",
    slug: "contact-page",
    title: "Contact page",
  },
  {
    collectionKey: "contact-form",
    description: "Form fields, enquiry types, and where responses are sent.",
    emptyHint: "Configure the contact form here.",
    group: "contact",
    slug: "contact-form",
    title: "Form settings",
  },
  {
    collectionKey: "contact-channels",
    description: "Phone numbers, addresses, and other ways to reach you.",
    emptyHint: "Add a phone number or address for the contact page.",
    group: "contact",
    slug: "channels",
    title: "Channels",
  },
  {
    collectionKey: "image-library",
    description: "Photos used across the website.",
    emptyHint: "Upload a photo to use it on the site.",
    group: "media",
    slug: "photos",
    title: "Photos",
  },
  {
    description: "Files and storage used by the website.",
    emptyHint: "Files you upload will be listed here.",
    group: "media",
    slug: "files",
    title: "Files",
  },
  {
    description: "Who can edit this website.",
    emptyHint: "Invite a colleague from the Tuturuuu workspace.",
    group: "team",
    slug: "people",
    title: "People",
  },
  {
    description: "Your account and sign-in.",
    emptyHint: "",
    group: "team",
    slug: "account",
    title: "Account",
  },
];

export function findAdminSection(slug: string) {
  return ADMIN_SECTIONS.find((section) => section.slug === slug) ?? null;
}

export function adminSectionsByGroup(group: AdminSectionGroup) {
  return ADMIN_SECTIONS.filter((section) => section.group === group);
}

export const DEFAULT_ADMIN_SECTION_SLUG = "news";
