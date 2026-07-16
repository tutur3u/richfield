// Vietnamese content — machine-translated first pass. Needs native review before launch.
export const site = {
  name: "Richfield Group",
  legalName: "Richfield Worldwide JSC",
  tagline: "Từ thâm nhập thị trường đến phân phối toàn quốc",
  taglineLong:
    "Từ thâm nhập thị trường đến phân phối toàn quốc. Việt Nam · Malaysia · Trung Quốc.",
  description:
    "Mạng lưới phân phối FMCG lớn nhất Việt Nam. Đưa những thương hiệu được yêu thích nhất thế giới đến hơn 180.000 điểm bán lẻ trên toàn quốc.",
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
  countries: ["Việt Nam", "Malaysia", "Trung Quốc"] as const,
  founded: 1994,
} as const;

export type Site = typeof site;
