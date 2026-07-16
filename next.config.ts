import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Pin the workspace root: a stray lockfile in the parent directory makes
  // Next infer the wrong root otherwise.
  turbopack: { root: __dirname },
  images: {
    // Allowlist a higher quality for large, detail-heavy photos (e.g. the
    // people mosaic full-bleed tiles); 75 stays the default everywhere else.
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
    ],
  },
  // The magazine owns /, with About living as sections within it; Brands has
  // its own page (/brands). 308-redirect the retired /v2/* URLs and old
  // top-level pages so existing links and bookmarks still resolve. (About has
  // no dedicated page, so /about resolves to the homepage root.)
  async redirects() {
    return [
      { source: "/v2", destination: "/", permanent: true },
      { source: "/v2/about", destination: "/", permanent: true },
      { source: "/v2/brands", destination: "/brands", permanent: true },
      { source: "/v2/products", destination: "/brands", permanent: true },
      { source: "/v2/what-we-do", destination: "/logistics", permanent: true },
      { source: "/v2/distribution", destination: "/distribution", permanent: true },
      { source: "/v2/logistics", destination: "/logistics", permanent: true },
      { source: "/v2/careers", destination: "/careers", permanent: true },
      { source: "/v2/contact", destination: "/contact", permanent: true },
      { source: "/about", destination: "/", permanent: true },
      { source: "/products", destination: "/brands", permanent: true },
      { source: "/what-we-do", destination: "/logistics", permanent: true },
      { source: "/portfolio", destination: "/brands", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
