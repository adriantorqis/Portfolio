"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { Photo } from "@/lib/types";

// A justified gallery: every image keeps its real shape, images in a row
// share one height, and each row spans the full width — whatever mix of
// wide composites, phone screenshots and photos is in the folder.
//
// Pure CSS, no measuring: each item's flex-grow AND flex-basis are
// proportional to its aspect ratio, so when a row stretches to fill the
// width every item grows by the same factor and the heights stay equal.
// The trailing filler soaks up the leftover space on the last row so a
// lone final image isn't blown up to full width.
//
// Clicking an image opens it full-screen (← / → to step through, Esc to
// close).
export function Gallery({
  photos,
  rowHeight = 240,
}: {
  photos: Photo[];
  // Target height of a row before it stretches to fill the width.
  rowHeight?: number;
}) {
  const [open, setOpen] = useState<number | null>(null);
  if (photos.length === 0) return null;

  return (
    <>
      <div
        className="gallery flex flex-wrap gap-2.5"
        style={{ "--row-h-desktop": `${rowHeight}px` } as React.CSSProperties}
      >
        {photos.map((photo, i) => {
          const ratio = photo.width / photo.height;
          return (
            <button
              key={photo.src}
              type="button"
              onClick={() => setOpen(i)}
              aria-label={photo.caption ? `View ${photo.caption}` : `View image ${i + 1}`}
              className="group/photo photo-frame relative min-w-0 max-w-full cursor-zoom-in rounded-lg"
              style={{
                flexGrow: ratio,
                flexBasis: `calc(var(--row-h) * ${ratio})`,
                aspectRatio: `${photo.width} / ${photo.height}`,
              }}
            >
              <Image
                src={photo.src}
                alt={photo.caption}
                fill
                sizes="(min-width: 1024px) 900px, 100vw"
                draggable={false}
              />
              {photo.caption ? (
                <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/75 via-ink/25 to-transparent px-3 pb-2 pt-8 text-center text-xs text-bg opacity-0 transition-opacity duration-300 group-hover/photo:opacity-100 group-focus-visible/photo:opacity-100">
                  {photo.caption}
                </span>
              ) : null}
            </button>
          );
        })}
        <span aria-hidden="true" className="h-0" style={{ flexGrow: 1000 }} />
      </div>

      {open !== null ? (
        <Lightbox photos={photos} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
      ) : null}
    </>
  );
}

function Lightbox({
  photos,
  index,
  onIndex,
  onClose,
}: {
  photos: Photo[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const photo = photos[index];
  const step = useCallback(
    (dir: 1 | -1) => onIndex((index + dir + photos.length) % photos.length),
    [index, onIndex, photos.length]
  );

  useEffect(() => {
    // Capture phase on window runs before the drawer's own document-level
    // Escape handler; stopping it here means Esc closes only the lightbox,
    // not the panel underneath.
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
      else return;
      e.preventDefault();
      e.stopPropagation();
    }
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onClose, step]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photo.caption || "Image viewer"}
      className="drawer-backdrop fixed inset-0 z-[70] flex flex-col bg-ink/90 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between px-5 py-4 text-sm text-bg/70">
        <span>
          {index + 1} / {photos.length}
          {photo.caption ? <span className="ml-3 text-bg">{photo.caption}</span> : null}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close image"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-bg/25 text-bg transition-colors hover:border-bg"
        >
          ✕
        </button>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close image"
        className="relative mx-4 mb-4 flex-1 cursor-zoom-out md:mx-20"
      >
        <Image
          src={photo.src}
          alt={photo.caption}
          fill
          sizes="100vw"
          className="object-contain"
          draggable={false}
        />
      </button>

      {photos.length > 1 ? (
        <>
          <NavButton side="left" onClick={() => step(-1)} />
          <NavButton side="right" onClick={() => step(1)} />
        </>
      ) : null}
    </div>
  );
}

function NavButton({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous image" : "Next image"}
      className={`absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-bg/90 text-ink transition-transform hover:scale-105 ${
        side === "left" ? "left-4" : "right-4"
      }`}
    >
      {side === "left" ? "←" : "→"}
    </button>
  );
}
