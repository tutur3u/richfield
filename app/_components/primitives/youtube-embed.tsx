"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  videoId: string;
  title: string;
  /** Optional caption overlay shown before playback. */
  caption?: string;
  /** Poster intensity — 'maxres' for hero use, 'hq' as a fallback. */
  posterQuality?: "maxres" | "hq";
  className?: string;
};

function getPosterSrc(videoId: string, quality: NonNullable<Props["posterQuality"]>) {
  return `https://i.ytimg.com/vi/${videoId}/${
    quality === "maxres" ? "maxresdefault" : "hqdefault"
  }.jpg`;
}

/**
 * Lazy YouTube player — shows a poster + play button, swaps in the iframe
 * only after the user clicks. Keeps the page light until intent.
 */
export function YouTubeEmbed({
  videoId,
  title,
  caption,
  posterQuality = "maxres",
  className = "",
}: Props) {
  const [active, setActive] = useState(false);
  const [posterSrc, setPosterSrc] = useState(() =>
    getPosterSrc(videoId, posterQuality),
  );

  useEffect(() => {
    setPosterSrc(getPosterSrc(videoId, posterQuality));
  }, [videoId, posterQuality]);

  return (
    <div
      className={`group relative isolate aspect-video w-full overflow-hidden rounded-sm bg-ink ${className}`}
    >
      {active ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          aria-label={`Play video: ${title}`}
          className="absolute inset-0 block h-full w-full cursor-pointer"
        >
          <Image
            src={posterSrc}
            alt=""
            fill
            sizes="(min-width: 1024px) 80vw, 100vw"
            onError={() => {
              if (posterQuality === "maxres") {
                setPosterSrc(getPosterSrc(videoId, "hq"));
              }
            }}
            className="object-cover [filter:saturate(0.92)_brightness(0.92)]"
          />
          <span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-ink/65 via-ink/15 to-transparent transition-opacity duration-300 group-hover:opacity-80"
          />
          <span
            aria-hidden
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gold/95 shadow-xl transition-transform duration-300 group-hover:scale-110 sm:h-24 sm:w-24">
              <svg
                viewBox="0 0 24 24"
                className="ml-1 h-8 w-8 fill-ink sm:h-10 sm:w-10"
                aria-hidden
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
          {caption ? (
            <span className="absolute inset-x-0 bottom-0 px-6 pb-6 text-left text-[11px] uppercase tracking-[0.32em] text-paper sm:px-8 sm:pb-8 sm:text-[12px]">
              {caption}
            </span>
          ) : null}
        </button>
      )}
    </div>
  );
}
