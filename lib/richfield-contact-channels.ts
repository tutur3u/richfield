import { site } from "@/content/en/site";
import { DEFAULT_LOCALE, type Locale } from "@/lib/locale";

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

// Display strings per locale; hrefs/values come from site.ts (identical in
// both locales — addresses, phones, and socials are never translated).
const CHANNEL_STRINGS: Record<
  Locale,
  Record<string, { cta: string; label: string; secondary?: string }>
> = {
  en: {
    office: { cta: "Open on Maps", label: "Office" },
    hotline: { cta: "Call hotline", label: "Hotline" },
    email: { cta: "Write us", label: "Email", secondary: "Partnerships team" },
    facebook: { cta: "Visit page", label: "Facebook", secondary: "Daily updates" },
  },
  vi: {
    office: { cta: "Mở trên Maps", label: "Văn phòng" },
    hotline: { cta: "Gọi hotline", label: "Hotline" },
    email: { cta: "Gửi email cho chúng tôi", label: "Email", secondary: "Đội ngũ đối tác" },
    facebook: { cta: "Xem trang", label: "Facebook", secondary: "Cập nhật hằng ngày" },
  },
};

export function getRichfieldContactChannels(
  locale: Locale = DEFAULT_LOCALE,
): RichfieldContactChannelSeed[] {
  const t = CHANNEL_STRINGS[locale];

  return [
    {
      cta: t.office.cta,
      external: true,
      href: `https://www.google.com/maps?q=${encodeURIComponent(site.address.full)}`,
      kind: "office",
      label: t.office.label,
      primary: site.address.line1,
      secondary: site.address.line2,
      slug: "office",
      sortOrder: 10,
    },
    {
      cta: t.hotline.cta,
      external: false,
      href: `tel:${site.phones.hotlineTel}`,
      kind: "phone",
      label: t.hotline.label,
      primary: site.phones.hotline,
      secondary: site.phones.office,
      slug: "hotline",
      sortOrder: 20,
    },
    {
      cta: t.email.cta,
      external: false,
      href: `mailto:${site.email}`,
      kind: "email",
      label: t.email.label,
      primary: site.email,
      secondary: t.email.secondary ?? "",
      slug: "email",
      sortOrder: 30,
    },
    {
      cta: t.facebook.cta,
      external: true,
      href: site.socials.facebook,
      kind: "facebook",
      label: t.facebook.label,
      primary: "RichField Group",
      secondary: t.facebook.secondary ?? "",
      slug: "facebook",
      sortOrder: 40,
    },
  ];
}

export const RICHFIELD_CONTACT_CHANNELS: RichfieldContactChannelSeed[] =
  getRichfieldContactChannels("en");
