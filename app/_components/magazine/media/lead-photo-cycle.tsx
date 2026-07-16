import { PhotoCycle, type CyclePhoto } from "@/app/_components/magazine/media/photo-cycle";
import { useTranslations } from "next-intl";
import type { Locale } from "@/lib/locale";

/** All 3:2 source aspect — matches the wrapper's aspect-[3/2] so no crop.
    Alt text lives in the home.leadPhotoCycle messages (same order), so it can localize. */
const PHOTOS: Omit<CyclePhoto, "alt">[] = [
  {
    src: "/photos/people/selected-2026-05-05.webp",
    objectPosition: "center 50%",
  },
  {
    src: "/photos/people/happy-time-2025-11-1280.webp",
    objectPosition: "center 45%",
  },
  {
    src: "/photos/people/workshop-1-1280.webp",
    objectPosition: "center 45%",
  },
  {
    src: "/photos/people/celebration-1280.webp",
    objectPosition: "center 45%",
  },
];

export function LeadPhotoCycle({ locale = "en" }: { locale?: Locale }) {
  const t = useTranslations("home.leadPhotoCycle");
  const photoAlts = t.raw("photoAlts") as string[];
  const photos: CyclePhoto[] = PHOTOS.map((p, i) => ({
    ...p,
    alt: photoAlts[i] ?? "",
  }));
  return (
    <PhotoCycle
      photos={photos}
      sizes="(max-width: 1024px) 100vw, 52vw"
      label={t("label")}
      locale={locale}
    />
  );
}
