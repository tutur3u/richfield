"use client";

import Image from "next/image";
import {
  ColumnsPhotoAlbum,
  type RenderImageContext,
  type RenderImageProps,
} from "react-photo-album";
import "react-photo-album/columns.css";
import { useTranslations } from "next-intl";
import type { Locale } from "@/lib/locale";

// ---------------------------------------------------------------------------
// People band — the mid-issue chapter break. A full-bleed column masonry of the
// team (react-photo-album, columns layout): equal-width columns whose tiles
// stack with no vertical gaps, each photo at its native ratio. The band sits on
// the dark ink surface — the only ink showing is the thin gap between photos.
// Photos here are unique to this section (not reused on the cover, lead,
// what-we-do, or colophon). Static (no carousel).
// ---------------------------------------------------------------------------

type Photo = { src: string; width: number; height: number; alt: string };

// Sources live in /photos/people/gallery; width/height are intrinsic pixels
// (drive the column packing). Order interleaves wide group shots with candids.
// Alt text lives in the home.peopleMosaic messages (same order), so it can localize.
const G = "/photos/people/gallery";
const PHOTO_SOURCES: Omit<Photo, "alt">[] = [
  { src: `${G}/yep-stage.webp`, width: 2000, height: 1331 },
  { src: `${G}/workshop-heart.webp`, width: 2000, height: 1334 },
  { src: `${G}/yep-portrait-1.webp`, width: 1263, height: 1911 },
  { src: `${G}/yep-crowd-1.webp`, width: 2000, height: 1125 },
  { src: `${G}/yep-group-1.webp`, width: 2000, height: 1331 },
  { src: `${G}/yep-table-1.webp`, width: 2000, height: 1188 },
  { src: `${G}/yep-portrait-2.webp`, width: 1334, height: 2000 },
  { src: `${G}/yep-toast.webp`, width: 2000, height: 1185 },
  { src: `${G}/womens-day.webp`, width: 2000, height: 1334 },
  { src: `${G}/yep-group-2.webp`, width: 2000, height: 1148 },
  { src: `${G}/workshop-2.webp`, width: 2000, height: 1334 },
  { src: `${G}/yep-portrait-3.webp`, width: 1351, height: 2000 },
  { src: `${G}/yep-crowd-2.webp`, width: 2000, height: 1156 },
  { src: `${G}/grand-opening.webp`, width: 2000, height: 1105 },
  { src: `${G}/yep-group-3.webp`, width: 2000, height: 1364 },
  { src: `${G}/workshop-3.webp`, width: 2000, height: 1334 },
  { src: `${G}/workshop-4.webp`, width: 2000, height: 1334 },
];

// Render each tile through next/image so the gallery gets optimization + lazy
// loading; the wrapper holds the aspect ratio react-photo-album computed.
function renderNextImage(
  { alt = "", title, sizes }: RenderImageProps,
  { photo, width, height }: RenderImageContext,
) {
  return (
    <div
      className="group relative h-full w-full overflow-hidden"
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <Image
        src={photo.src}
        alt={alt}
        title={title}
        fill
        sizes={sizes}
        quality={90}
        className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
      />
    </div>
  );
}

export function PeopleMosaic(_props: { locale?: Locale } = {}) {
  const t = useTranslations("home.peopleMosaic");
  const photoAlts = t.raw("photoAlts") as string[];
  const photos: Photo[] = PHOTO_SOURCES.map((p, i) => ({
    ...p,
    alt: photoAlts[i] ?? "",
  }));
  return (
    <section id="people" className="relative w-full bg-ink">
      <ColumnsPhotoAlbum
        photos={photos}
        render={{ image: renderNextImage }}
        columns={(containerWidth) =>
          containerWidth < 640 ? 1 : containerWidth < 1024 ? 2 : 3
        }
        spacing={4}
        padding={0}
        defaultContainerWidth={1440}
        sizes={{
          size: "33vw",
          sizes: [
            { viewport: "(max-width: 640px)", size: "100vw" },
            { viewport: "(max-width: 1024px)", size: "50vw" },
          ],
        }}
      />
    </section>
  );
}
