"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

// Drifts its contents against the page as you scroll. The image is scaled
// slightly larger than the frame so the drift never exposes an edge, and the
// whole thing is inert under reduced motion.
export function ParallaxMedia({
  children,
  distance = 34,
  className = "",
}: {
  children: React.ReactNode;
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Spring the raw progress so the drift lags the scroll slightly instead of
  // tracking it rigidly — that lag is what reads as depth.
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const y = useTransform(smooth, [0, 1], [distance, -distance]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* next/image's `fill` requires its *direct* parent to be positioned —
          the outer div above is, but position:absolute still resolves against
          whichever ancestor is nearest, so being pedantic here rather than
          relying on that two levels up avoids Next's dev-time warning. */}
      <motion.div
        className="relative h-full w-full"
        style={reduced ? undefined : { y, scale: 1.08 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
