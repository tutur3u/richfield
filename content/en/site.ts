export const site = {
  name: "Richfield Group",
  legalName: "Richfield Worldwide JSC",
  tagline: "From Market Entry to Nationwide Distribution",
  taglineLong:
    "From Market Entry to Nationwide Distribution. Vietnam · Malaysia · China.",
  description:
    "Vietnam's largest FMCG distribution network. Bringing the world's most loved brands to over 180,000 retail outlets nationwide.",
  domainCanonical: "https://richfieldgroup.com.vn",
  address: {
    line1: "15A1 Nguyễn Hữu Thọ",
    line2: "Phước Kiển, Nhà Bè, HCM",
    full: "Richfield Worldwide JSC · 15A1 Nguyễn Hữu Thọ, Phước Kiển, Nhà Bè, HCM",
    geo: { lat: 10.722, lng: 106.706 },
  },
  phones: {
    office: "(+028) 3784 0237",
    officeTel: "+842837840237",
    hotline: "0917 331 132",
    hotlineTel: "+84917331132",
  },
  email: "cskh@richfieldvn.com.vn",
  socials: {
    facebook: "https://www.facebook.com/RichFieldGroup",
    linkedin: "",
    zalo: "",
  },
  external: {
    doryRich: "https://doryrich.com.vn",
  },
  countries: ["Vietnam", "Malaysia", "China"] as const,
  founded: 1994,
} as const;

export type Site = typeof site;
