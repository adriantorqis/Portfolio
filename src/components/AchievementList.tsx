"use client";

import { motion, useReducedMotion } from "motion/react";
import { useRef } from "react";
import type { Achievement } from "@/lib/types";

const EASE = [0.16, 1, 0.3, 1] as const;

// Each placement gets its own metal/colour: [highlight, shade]. The rank is
// painted as a gradient between the two, and the same pair tints the row's
// hover glow and hairline.
const TONES = {
  gold: ["#e9b949", "#a8741a"],
  silver: ["#aab4c3", "#6b7686"],
  bronze: ["#d98b55", "#9a4f24"],
  teal: ["#3fb5a0", "#1f6f66"],
  violet: ["#8d7bf0", "#4a3bb3"],
} as const;

function toneFor(a: Achievement): readonly [string, string] {
  if (a.tone) return TONES[a.tone];
  const r = a.rank.trim().toLowerCase();
  if (r.startsWith("1st")) return TONES.gold;
  if (r.startsWith("2nd")) return TONES.silver;
  if (r.startsWith("3rd")) return TONES.bronze;
  if (r.includes("%")) return TONES.teal;
  return TONES.violet;
}

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
      {achievements.map((a, i) => {
        const [hi, lo] = toneFor(a);
        return (
        <motion.li
          key={`${a.organizer}-${a.title}-${i}`}
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

          <div className="relative grid grid-cols-[8rem_1fr] items-center gap-x-6 gap-y-1 py-7 sm:grid-cols-[11rem_1fr_auto] md:grid-cols-[15rem_1fr_auto] md:py-9">
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

            <span className="col-start-2 text-xs tracking-[0.18em] text-muted sm:col-start-auto sm:text-right">
              {a.year ?? ""}
            </span>
          </div>
        </motion.li>
        );
      })}
    </ol>
  );
}
