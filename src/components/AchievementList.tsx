"use client";

import { motion, useReducedMotion } from "motion/react";
import { useRef } from "react";
import type { Achievement } from "@/lib/types";

const EASE = [0.16, 1, 0.3, 1] as const;

// An editorial ledger rather than a grid of badges: the placement is the
// headline, set huge in the display serif, and everything else is quiet
// supporting text. Each rank slides up out of a mask as its row enters, and
// a soft light follows the pointer across the list (CSS vars --mx/--my,
// consumed by .achievements-glow in globals.css).
export function AchievementList({ achievements }: { achievements: Achievement[] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();

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
      {achievements.map((a, i) => (
        <motion.li
          key={`${a.organizer}-${a.title}-${i}`}
          className="anim group relative border-t border-line"
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
            className="absolute -top-px left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 motion-reduce:transition-none"
          />

          <div className="grid grid-cols-[5.5rem_1fr] items-center gap-x-6 gap-y-1 py-7 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 motion-reduce:transition-none sm:grid-cols-[9rem_1fr_auto] md:grid-cols-[12rem_1fr_auto] md:py-9">
            <span className="block overflow-hidden pb-1">
              <motion.span
                className="display block whitespace-nowrap text-4xl text-ink transition-colors duration-500 group-hover:text-accent sm:text-5xl md:text-6xl"
                variants={{ hidden: { y: "105%" }, shown: { y: "0%" } }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.1 + i * 0.07 }}
              >
                {a.rank}
              </motion.span>
            </span>

            <div className="min-w-0">
              <p className="text-base leading-snug text-ink md:text-lg">{a.title}</p>
              <p className="mt-1 text-sm text-muted">{a.organizer}</p>
            </div>

            <span className="col-start-2 text-xs tracking-[0.18em] text-muted sm:col-start-auto sm:text-right">
              {a.year ?? ""}
            </span>
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
