"use client";

import { motion, useReducedMotion } from "motion/react";

// The headline rises word by word from behind a mask, which is why each word
// gets its own overflow-hidden wrapper. The whole string is also rendered
// once, visually hidden, so screen readers and copy/paste get one clean
// sentence rather than a pile of fragments.
export function SplitHeadline({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <h1 className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            // pb/-mb pair gives descenders room so the mask never clips a "g"
            className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom"
          >
            <motion.span
              className="anim inline-block"
              initial={reduced ? false : { y: "115%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{
                delay: 0.08 + i * 0.075,
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {word}
            </motion.span>
            {i < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </h1>
  );
}
