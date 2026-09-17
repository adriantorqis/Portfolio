"use client";

import { useEffect, useRef } from "react";

/**
 * Fades + rises content into view *every* time it enters the viewport, not
 * just the first time — scrolling back up replays the entrance, so each
 * section reads as somewhere you arrive at rather than a page you've already
 * spent.
 *
 * The two thresholds are deliberate hysteresis: it reveals once 15% is on
 * screen, but only resets after it has left completely. A single threshold
 * would flip back and forth while you hover the boundary.
 *
 * The hidden state lives in CSS (.reveal), and the reduced-motion media query
 * neutralises it — so this degrades to "always visible" both for users who
 * ask for less motion and if JS never runs at all.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.visible = "true";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.intersectionRatio >= 0.15) {
            el.dataset.visible = "true";
          } else if (!entry.isIntersecting) {
            el.dataset.visible = "false";
          }
        }
      },
      { threshold: [0, 0.15], rootMargin: "0px 0px -6% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      // @ts-expect-error — ref type varies with the polymorphic tag
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
