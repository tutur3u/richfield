import { site } from "@/content/en/site";

export type RichfieldContactChannelSeed = {
  cta: string;
  external: boolean;
  href: string;
  kind: string;
  label: string;
  primary: string;
  secondary: string;
  slug: string;
  sortOrder: number;
};

export const RICHFIELD_CONTACT_CHANNELS: RichfieldContactChannelSeed[] = [
  {
    cta: "Open on Maps",
    external: true,
    href: `https://www.google.com/maps?q=${encodeURIComponent(site.address.full)}`,
    kind: "office",
    label: "Office",
    primary: site.address.line1,
    secondary: site.address.line2,
    slug: "office",
    sortOrder: 10,
  },
  {
    cta: "Call hotline",
    external: false,
    href: `tel:${site.phones.hotlineTel}`,
    kind: "phone",
    label: "Hotline",
    primary: site.phones.hotline,
    secondary: site.phones.office,
    slug: "hotline",
    sortOrder: 20,
  },
  {
    cta: "Write us",
    external: false,
    href: `mailto:${site.email}`,
    kind: "email",
    label: "Email",
    primary: site.email,
    secondary: "Partnerships team",
    slug: "email",
    sortOrder: 30,
  },
  {
    cta: "Visit page",
    external: true,
    href: site.socials.facebook,
    kind: "facebook",
    label: "Facebook",
    primary: "RichField Group",
    secondary: "Daily updates",
    slug: "facebook",
    sortOrder: 40,
  },
];
