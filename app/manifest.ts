import type { MetadataRoute } from "next";
import { site } from "@/content/en/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: "#f6efe1",
    description: site.description,
    display: "standalone",
    icons: [
      {
        src: "/icon.jpg",
        sizes: "192x192",
        type: "image/jpeg",
      },
      {
        src: "/apple-icon.jpg",
        sizes: "180x180",
        type: "image/jpeg",
      },
    ],
    lang: "en",
    name: site.name,
    short_name: "Richfield",
    start_url: "/",
    theme_color: "#241f1a",
  };
}
