import type { Achievement } from "./types";

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

export function toneFor(a: Achievement): readonly [string, string] {
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
