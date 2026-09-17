"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { CoverMediaKind } from "@/lib/types";

function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function getReducedMotionServerSnapshot() {
  return false;
}

// Renders inside a `.photo-frame` wrapper (position:relative, overflow:hidden
// — see globals.css), same as every other cover. Images/GIFs are simple —
// hovering them is just the existing .tile zoom, nothing video-specific
// happens, so "if not [a video], it stays as usual" is true by construction.
// Video is the interesting case, and how it starts playing depends on where
// it's shown:
//
// - "hover" (the project grid): plays only while the pointer is over the
//   card, pauses the moment it leaves. A grid can have many video covers on
//   screen at once — autoplaying all of them just because they're visible
//   would be noisy and heavy, so playback here is a deliberate hover
//   gesture rather than ambient.
// - "inView" (the default — used by the project detail drawer, where it's
//   the one thing on screen): reuses the IntersectionObserver pattern from
//   components/Reveal.tsx and plays once scrolled into view.
// - Never autoplays under prefers-reduced-motion, regardless of trigger.
//   Instead it shows the poster with an explicit play control — a real
//   click is exempt from "don't auto-start motion" by definition.
export function ProjectMedia({
  src,
  posterSrc,
  kind,
  alt = "",
  sizes = "(min-width: 640px) 340px, 78vw",
  priority = false,
  playTrigger = "inView",
}: {
  src: string;
  posterSrc: string | null;
  kind: CoverMediaKind;
  alt?: string;
  sizes?: string;
  // For whichever cover is the page's actual LCP candidate — the first
  // project in the grid, typically. Preloads and skips lazy-loading;
  // wrong on more than one image per page, so this stays opt-in per call
  // site rather than defaulted on.
  priority?: boolean;
  playTrigger?: "inView" | "hover";
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getReducedMotionServerSnapshot
  );
  const [inView, setInView] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [manualPlay, setManualPlay] = useState(false);

  useEffect(() => {
    if (kind !== "video" || playTrigger !== "inView") return;
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.5 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [kind, playTrigger]);

  const activelyVisible = playTrigger === "hover" ? hovering : inView;
  const shouldPlay = kind === "video" && activelyVisible && (manualPlay || !reducedMotion);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (shouldPlay) {
      // Autoplay can still be rejected in some embedding contexts even when
      // muted+playsInline; silently keep showing the poster rather than
      // surface a rejected-promise console error the visitor can't act on.
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [shouldPlay]);

  if (kind !== "video") {
    // next/image's optimizer flattens an animated GIF to a single still
    // frame, which would silently kill the exact thing a GIF was uploaded
    // for — opt it out of optimization instead.
    return (
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized={kind === "gif"}
        sizes={sizes}
        draggable={false}
        priority={priority}
      />
    );
  }

  return (
    <>
      <video
        ref={videoRef}
        src={src}
        poster={posterSrc ?? undefined}
        muted
        loop
        playsInline
        preload="metadata"
        draggable={false}
        aria-label={alt || undefined}
        // The video already fills the card edge-to-edge (object-fit:cover
        // at 100% width/height), so hovering it *is* hovering the card —
        // no separate wrapper needed. No-ops when playTrigger is "inView".
        onMouseEnter={playTrigger === "hover" ? () => setHovering(true) : undefined}
        onMouseLeave={playTrigger === "hover" ? () => setHovering(false) : undefined}
      />
      {reducedMotion && !manualPlay ? (
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            setManualPlay(true);
          }}
          aria-label="Play preview"
          className="absolute inset-0 flex items-center justify-center bg-ink/10 transition-colors hover:bg-ink/20"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-bg/90 text-ink">
            <PlayIcon />
          </span>
        </button>
      ) : null}
    </>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
