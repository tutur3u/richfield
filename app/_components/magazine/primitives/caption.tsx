import type { ReactNode } from "react";

// ---------------------------------------------------------------------------
// Caption — an editorial photo/margin caption: a short gold hairline leading
// a small italic Fraunces line. Ties a photo to a place or detail the way a
// magazine credit line does, without the web "alt text in a grey bar" look.
// Render inside the same <figure> as the image, or standalone under it.
// ---------------------------------------------------------------------------

type CaptionProps = {
  children: ReactNode;
  className?: string;
};

export function Caption({ children, className = "" }: CaptionProps) {
  return (
    <figcaption className={`flex items-baseline gap-2 ${className}`}>
      <span
        aria-hidden
        className="v2-rule-gold inline-block h-px w-6 shrink-0 self-center"
      />
      <span className="v2-italic text-[clamp(12px,1vw,14px)] leading-snug opacity-70">
        {children}
      </span>
    </figcaption>
  );
}
