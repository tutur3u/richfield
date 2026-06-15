import { PhotoCycle, type CyclePhoto } from "@/app/_components/magazine/media/photo-cycle";

/** All 3:2 source aspect — matches the wrapper's aspect-[3/2] so no crop. */
const PHOTOS: CyclePhoto[] = [
  {
    src: "/photos/people/selected-2026-05-05.webp",
    alt: "The Richfield team in front of the modern campus, 2026.",
    objectPosition: "center 50%",
  },
  {
    src: "/photos/people/happy-time-2025-11-1280.webp",
    alt: "A Richfield team gathering, late 2025.",
    objectPosition: "center 45%",
  },
  {
    src: "/photos/people/workshop-1-1280.webp",
    alt: "A Richfield training workshop in session.",
    objectPosition: "center 45%",
  },
  {
    src: "/photos/people/celebration-1280.webp",
    alt: "A Richfield celebration moment.",
    objectPosition: "center 45%",
  },
];

export function LeadPhotoCycle() {
  return (
    <PhotoCycle
      photos={PHOTOS}
      sizes="(max-width: 1024px) 100vw, 52vw"
      label="Richfield team gallery"
    />
  );
}
