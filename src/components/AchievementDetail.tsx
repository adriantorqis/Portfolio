"use client";

import Image from "next/image";
import { useRef } from "react";
import { toneFor } from "@/lib/achievement-tone";
import type { Achievement, Photo } from "@/lib/types";
import { useModalDrawer } from "@/lib/useModalDrawer";
import { Highlighted } from "./Highlighted";

// How many photos go in each row, for n photos. Few photos get big; many
// photos wrap into rows of up to three. Rows are never lopsided (7 photos is
// 2/2/3, not 3/3/1).
function rowSizes(n: number): number[] {
  if (n <= 2) return n ? [n] : [];
  if (n === 3) return [1, 2];
  const rows = Math.ceil(n / 3);
  const base = Math.floor(n / rows);
  const extra = n % rows;
  // Give the extras to the last rows so the first row stays the smaller,
  // more prominent one.
  return Array.from({ length: rows }, (_, i) => base + (i >= rows - extra ? 1 : 0));
}

export function AchievementDetail({
  achievement,
  onClose,
}: {
  achievement: Achievement;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  useModalDrawer(panelRef, onClose);

  const [hi, lo] = toneFor(achievement);
  const headingId = `achievement-${achievement.slug}`;
  const paragraphs = achievement.story ? achievement.story.split("\n\n") : [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close achievement details"
        onClick={onClose}
        className="drawer-backdrop absolute inset-0 cursor-default bg-ink/25"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        tabIndex={-1}
        className="drawer-panel relative flex h-full w-full max-w-2xl flex-col overflow-y-auto bg-bg outline-none"
        style={{ "--tone-hi": hi, "--tone-lo": lo } as React.CSSProperties}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-bg/90 px-6 py-4 backdrop-blur md:px-10">
          <p className="eyebrow">Achievement</p>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line transition-colors hover:border-ink"
            aria-label="Close"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="px-6 pb-16 pt-10 md:px-10">
          <p className="display bg-gradient-to-br from-[var(--tone-hi)] to-[var(--tone-lo)] bg-clip-text pb-2 text-6xl text-transparent md:text-7xl">
            {achievement.rank}
          </p>

          <h2 id={headingId} className="display mt-3 text-2xl md:text-3xl">
            {achievement.title}
          </h2>
          <p className="mt-2 text-sm text-muted">
            {achievement.organizer}
            {achievement.year ? ` · ${achievement.year}` : ""}
          </p>

          {achievement.context ? (
            <p className="mt-4 inline-block rounded-full border border-[var(--tone-lo)]/30 px-3 py-1 text-xs font-medium text-[var(--tone-lo)]">
              {achievement.rank} {achievement.context}
            </p>
          ) : null}

          {paragraphs.length ? (
            <div className="mt-8 space-y-5 leading-relaxed text-muted">
              {paragraphs.map((para, i) => (
                <p key={i}>
                  <Highlighted text={para} />
                </p>
              ))}
            </div>
          ) : null}

          {achievement.photos.length ? <Gallery photos={achievement.photos} /> : null}
        </div>
      </div>
    </div>
  );
}

// Justified rows: every photo in a row gets flex-grow equal to its own
// aspect ratio, so they all come out the same height and fill the row's
// width exactly — nothing cropped, nothing stretched, any mix of portrait
// and landscape.
function Gallery({ photos }: { photos: Photo[] }) {
  const rows = rowSizes(photos.length).map((count, i, all) =>
    photos.slice(all.slice(0, i).reduce((sum, c) => sum + c, 0), all.slice(0, i + 1).reduce((sum, c) => sum + c, 0))
  );

  return (
    <div className="mt-12 border-t border-line pt-8">
      <p className="eyebrow">Photos</p>
      <div className="mt-5 space-y-2">
        {rows.map((rowPhotos, row) => {
          const count = rowPhotos.length;
          return (
            <div key={row} className="flex gap-2">
              {rowPhotos.map((photo) => {
                const ratio = photo.width / photo.height;
                return (
                  <figure
                    key={photo.src}
                    className="group/photo photo-frame relative min-w-0 rounded-md"
                    style={{ flex: `${ratio} 1 0%`, aspectRatio: `${photo.width} / ${photo.height}` }}
                  >
                    <Image
                      src={photo.src}
                      alt={photo.caption}
                      fill
                      sizes={count === 1 ? "672px" : `${Math.round(672 / count)}px`}
                      draggable={false}
                    />
                    {photo.caption ? (
                      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/75 via-ink/25 to-transparent px-3 pb-2 pt-8 text-center text-xs text-bg opacity-0 transition-opacity duration-300 group-hover/photo:opacity-100">
                        {photo.caption}
                      </figcaption>
                    ) : null}
                  </figure>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
