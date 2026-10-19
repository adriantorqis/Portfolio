"use client";

import { motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import { toneFor } from "@/lib/achievement-tone";
import type { Achievement } from "@/lib/types";
import { AchievementDetail } from "./AchievementDetail";

const EASE = [0.16, 1, 0.3, 1] as const;

export function AchievementList({ achievements }: { achievements: Achievement[] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const [open, setOpen] = useState<Achievement | null>(null);

  function trackPointer(e: React.PointerEvent<HTMLOListElement>) {
    const list = listRef.current;
    if (!list) return;
    const rect = list.getBoundingClientRect();
    list.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    list.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }

  return (
    <ol
      ref={listRef}
      onPointerMove={reduced ? undefined : trackPointer}
      className="achievements-glow relative border-b border-line"
    >
      {achievements.map((a, i) => {
        const [hi, lo] = toneFor(a);
        return (
        <motion.li
          key={a.slug}
          className="anim group relative border-t border-line"
          style={{ "--tone-hi": hi, "--tone-lo": lo } as React.CSSProperties}
          initial={reduced ? false : "hidden"}
          whileInView="shown"
          variants={{
            hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
            shown: { opacity: 1, y: 0, filter: "blur(0px)" },
          }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.8, ease: EASE, delay: i * 0.07 }}
        >
          {/* Hairline that draws across the top of the row on hover. */}
          <span
            aria-hidden="true"
            className="absolute -top-px left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-[var(--tone-hi)] to-[var(--tone-lo)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 motion-reduce:transition-none"
          />

          {/* Tinted wash that fades in from the left on hover. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none"
            style={{
              background:
                "radial-gradient(600px circle at 0% 50%, color-mix(in srgb, var(--tone-hi) 16%, transparent), transparent 65%)",
            }}
          />

          <button
            type="button"
            onClick={() => setOpen(a)}
            aria-label={`Open the story behind ${a.organizer}: ${a.title}`}
            className="relative grid w-full cursor-pointer grid-cols-[8rem_1fr] items-center gap-x-6 gap-y-1 py-7 text-left sm:grid-cols-[11rem_1fr_auto] md:grid-cols-[15rem_1fr_auto] md:py-9"
          >
            {/* The mask clips the slide-up, so it needs room on every side
                for glyph overhang — otherwise wide ranks ("Top 5%") get cut. */}
            <span className="block overflow-hidden px-1 pb-2 pt-1 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 motion-reduce:transition-none">
              <motion.span
                className="display block whitespace-nowrap bg-gradient-to-br from-[var(--tone-hi)] to-[var(--tone-lo)] bg-clip-text pr-1 text-3xl text-transparent sm:text-5xl md:text-6xl"
                variants={{ hidden: { y: "105%" }, shown: { y: "0%" } }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.1 + i * 0.07 }}
              >
                {a.rank}
              </motion.span>
            </span>

            <div className="min-w-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 motion-reduce:transition-none">
              <p className="text-base leading-snug text-ink md:text-lg">{a.title}</p>
              <p className="mt-1 text-sm text-muted">{a.organizer}</p>
            </div>

            <span className="col-start-2 flex items-center gap-4 text-xs tracking-[0.18em] text-muted sm:col-start-auto sm:justify-end">
              {a.year ?? ""}
              <span
                aria-hidden="true"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-sm tracking-normal text-ink transition-all duration-500 group-hover:border-[var(--tone-lo)] group-hover:bg-[var(--tone-lo)] group-hover:text-bg"
              >
                <span className="transition-transform duration-500 group-hover:rotate-45">+</span>
              </span>
            </span>
          </button>
        </motion.li>
        );
      })}
      {open ? <AchievementDetail achievement={open} onClose={() => setOpen(null)} /> : null}
    </ol>
  );
}
