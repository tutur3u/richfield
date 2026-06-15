"use client";

import Image from "next/image";
import {
  ColumnsPhotoAlbum,
  type RenderImageContext,
  type RenderImageProps,
} from "react-photo-album";
import "react-photo-album/columns.css";

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
const G = "/photos/people/gallery";
const PHOTOS: Photo[] = [
  { src: `${G}/yep-stage.webp`, width: 2000, height: 1331, alt: "A performance at the Richfield year-end party" },
  { src: `${G}/workshop-heart.webp`, width: 2000, height: 1334, alt: "Teammates at a team workshop" },
  { src: `${G}/yep-portrait-1.webp`, width: 1263, height: 1911, alt: "Colleagues at the Richfield year-end party" },
  { src: `${G}/yep-crowd-1.webp`, width: 2000, height: 1125, alt: "The team gathered for the year-end celebration" },
  { src: `${G}/yep-group-1.webp`, width: 2000, height: 1331, alt: "A group of the Richfield team celebrating" },
  { src: `${G}/yep-table-1.webp`, width: 2000, height: 1188, alt: "Teammates together at the year-end party" },
  { src: `${G}/yep-portrait-2.webp`, width: 1334, height: 2000, alt: "A family moment at the company celebration" },
  { src: `${G}/yep-toast.webp`, width: 2000, height: 1185, alt: "A toast at the year-end party" },
  { src: `${G}/womens-day.webp`, width: 2000, height: 1334, alt: "Celebrating International Women's Day 2026" },
  { src: `${G}/yep-group-2.webp`, width: 2000, height: 1148, alt: "The Richfield team at the year-end party" },
  { src: `${G}/workshop-2.webp`, width: 2000, height: 1334, alt: "A team workshop session" },
  { src: `${G}/yep-portrait-3.webp`, width: 1351, height: 2000, alt: "A colleague at the year-end party" },
  { src: `${G}/yep-crowd-2.webp`, width: 2000, height: 1156, alt: "The full team at the year-end celebration" },
  { src: `${G}/grand-opening.webp`, width: 2000, height: 1105, alt: "The 2026 office grand opening" },
  { src: `${G}/yep-group-3.webp`, width: 2000, height: 1364, alt: "Colleagues celebrating together" },
  { src: `${G}/workshop-3.webp`, width: 2000, height: 1334, alt: "A team workshop in progress" },
  { src: `${G}/workshop-4.webp`, width: 2000, height: 1334, alt: "A team workshop session" },
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

export function PeopleMosaic() {
  return (
    <section id="people" className="relative w-full bg-ink">
      <ColumnsPhotoAlbum
        photos={PHOTOS}
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
