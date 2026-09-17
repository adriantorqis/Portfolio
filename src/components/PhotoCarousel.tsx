"use client";

import Image from "next/image";
import { useRef } from "react";
import type { Photo } from "@/lib/types";

// A scattered, physical-photo feel rather than a uniform card row — each
// photo gets a slight rotation and vertical offset (deterministic, cycling
// through a small preset per index rather than random, so server and client
// render identically) that straightens out on hover/focus. See the
// .scrap-card rule in globals.css for the actual transform.
const ROTATIONS = [-3, 2, -1.5, 2.5, -2, 1.5];
const OFFSETS = [0, 26, 8, 32, 2, 18];

// The "designated area": every photo is sized to this height and free to be
// however wide its own aspect ratio makes it — nothing gets cropped to fit
// a fixed box, it just can't grow taller than this, so the strip's overall
// height stays predictable while each photo keeps its real shape.
const AREA_HEIGHT = "h-72 sm:h-80 md:h-96";

export function PhotoCarousel({ photos }: { photos: Photo[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollByCard(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.getBoundingClientRect().width + 40 : track.clientWidth * 0.8;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  // Nothing to show yet — let the section fall back to just the story text
  // above it rather than displaying an empty frame.
  if (photos.length === 0) return null;

  return (
    <div>
      <div
        ref={trackRef}
        className={`flex ${AREA_HEIGHT} items-end gap-10 overflow-x-auto px-1 pb-6 pt-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
        style={{ scrollSnapType: "x proximity" }}
      >
        {photos.map((photo, i) => (
          <div
            key={photo.src}
            data-card
            // tabIndex makes the card itself focusable, so keyboard users
            // can Tab to each photo and get the same caption reveal a mouse
            // hover gives — without it, :focus-within would have nothing
            // inside the card to ever receive focus.
            tabIndex={0}
            className="scrap-card relative h-full shrink-0"
            style={
              {
                scrollSnapAlign: "center",
                aspectRatio: `${photo.width} / ${photo.height}`,
                "--rot": `${ROTATIONS[i % ROTATIONS.length]}deg`,
                "--y": `${OFFSETS[i % OFFSETS.length]}px`,
              } as React.CSSProperties & Record<"--rot" | "--y", string>
            }
          >
            <div className="photo-frame relative h-full w-full rounded-lg border-4 border-bg">
              <Image
                src={photo.src}
                alt={photo.caption}
                fill
                // Width varies per photo (it's height × its own aspect
                // ratio, not a fixed box), so this is a reasonable upper
                // bound rather than an exact value — the area caps at
                // 384px tall, and most casual photos land within ~3:2 to
                // 16:9, so 700px comfortably covers typical cases without
                // requesting a needlessly large source for narrow ones.
                sizes="700px"
                draggable={false}
              />

              {photo.caption ? (
                <div className="caption pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/75 via-ink/25 to-transparent px-3 pb-2 pt-10 text-center">
                  <span className="text-xs text-bg">{photo.caption}</span>
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {photos.length > 1 ? (
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="Previous photo"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-line transition-colors hover:border-ink"
          >
            <Arrow direction="left" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="Next photo"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-line transition-colors hover:border-ink"
          >
            <Arrow direction="right" />
          </button>
        </div>
      ) : null}
    </div>
  );
}

function Arrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={direction === "left" ? { transform: "rotate(180deg)" } : undefined}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
