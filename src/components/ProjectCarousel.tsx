"use client";

import { useEffect, useRef, useState } from "react";
import { publicStorageUrl } from "@/lib/data";
import type { Project } from "@/lib/types";

export function ProjectCarousel({ projects }: { projects: Project[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const dragState = useRef<{ startX: number; startScrollLeft: number } | null>(null);

  function stepSize(track: HTMLDivElement): number {
    const first = track.children[0] as HTMLElement | undefined;
    const second = track.children[1] as HTMLElement | undefined;
    if (!first) return 0;
    return second ? second.offsetLeft - first.offsetLeft : first.offsetWidth;
  }

  // One place that answers "where am I" — covers native touch swipe, trackpad
  // scroll, and the pointer drag below, so the dots/arrows never drift out of
  // sync with the actual scroll position.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let raf = 0;
    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const track = trackRef.current;
        if (!track) return;
        const step = stepSize(track);
        setIndex(Math.round(track.scrollLeft / (step || 1)));
        setAtStart(track.scrollLeft <= 1);
        setAtEnd(track.scrollLeft >= track.scrollWidth - track.clientWidth - 1);
      });
    }

    onScroll();
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [projects.length]);

  function goTo(i: number) {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(projects.length - 1, i));
    track.scrollTo({ left: clamped * stepSize(track), behavior: "smooth" });
  }

  // Touch devices already get real swipe + momentum from native overflow
  // scrolling. This is just the desktop-mouse equivalent: direct scrollLeft,
  // no animation library, nothing to race with a programmatic scroll.
  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "touch") return;
    const track = trackRef.current;
    if (!track) return;
    dragState.current = { startX: e.clientX, startScrollLeft: track.scrollLeft };
    track.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const drag = dragState.current;
    const track = trackRef.current;
    if (!drag || !track) return;
    track.scrollLeft = drag.startScrollLeft - (e.clientX - drag.startX);
  }

  function onPointerUp() {
    dragState.current = null;
  }

  const arrowClass =
    "flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-ink disabled:pointer-events-none disabled:opacity-25";

  return (
    <div>
      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="flex gap-6 overflow-x-auto px-6 pb-4 md:px-12 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {projects.map((project, i) => {
          const cover = publicStorageUrl("covers", project.cover_image_path);
          const file = publicStorageUrl("files", project.file_path);
          return (
            <article
              key={project.id}
              className="flex w-[78vw] shrink-0 select-none flex-col sm:w-[340px]"
              style={{ scrollSnapAlign: "start" }}
            >
              {cover ? (
                <div className="photo-frame aspect-[4/3] w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cover} alt="" draggable={false} />
                </div>
              ) : (
                <PhotoSlot />
              )}

              <div className="mt-5 flex flex-1 flex-col">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="eyebrow">{String(i + 1).padStart(2, "0")}</span>
                  {project.featured ? <span className="eyebrow">Featured</span> : null}
                </div>

                <h3 className="display mt-3 text-2xl">{project.title}</h3>

                {project.tags.length ? (
                  <p className="mt-2 text-sm text-muted">{project.tags.join(" · ")}</p>
                ) : null}

                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
                  {project.description}
                </p>

                {project.link_url || file ? (
                  <div className="mt-5 flex gap-5 text-sm">
                    {project.link_url ? (
                      <a
                        href={project.link_url}
                        target="_blank"
                        rel="noreferrer"
                        onPointerDown={(e) => e.stopPropagation()}
                        className="link-underline"
                      >
                        Visit
                      </a>
                    ) : null}
                    {file ? (
                      <a
                        href={file}
                        target="_blank"
                        rel="noreferrer"
                        onPointerDown={(e) => e.stopPropagation()}
                        className="link-underline"
                      >
                        Download
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-2">
          {projects.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to project ${i + 1}`}
              aria-current={i === index}
              className={`h-px transition-all duration-500 ${
                i === index ? "w-8 bg-ink" : "w-4 bg-line hover:bg-muted"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            disabled={atStart}
            aria-label="Previous project"
            className={arrowClass}
          >
            <Arrow direction="left" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            disabled={atEnd}
            aria-label="Next project"
            className={arrowClass}
          >
            <Arrow direction="right" />
          </button>
        </div>
      </div>
    </div>
  );
}

function PhotoSlot() {
  return (
    <div className="placeholder-fill flex aspect-[4/3] w-full items-center justify-center border border-line">
      <span className="eyebrow">Cover image</span>
    </div>
  );
}

function Arrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="15"
      height="15"
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
