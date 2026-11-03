"use client";

import { useState } from "react";
import type { Experience } from "@/lib/types";
import { ExperienceDetail } from "./ExperienceDetail";
import { Reveal } from "./Reveal";

// Grouped by category (in the order they first appear in the JSON), one row
// per role. Each row opens the full story + photos in a side panel, the
// same pattern as projects and achievements.
export function ExperienceList({ experiences }: { experiences: Experience[] }) {
  const [open, setOpen] = useState<Experience | null>(null);
  const groups = [...new Set(experiences.map((e) => e.category))].map((category) => ({
    category,
    items: experiences.filter((e) => e.category === category),
  }));

  return (
    <div className="space-y-16">
      {groups.map(({ category, items }) => (
        <div key={category}>
          <Reveal>
            <p className="eyebrow">{category}</p>
          </Reveal>
          <ol className="mt-5 border-b border-line">
            {items.map((exp, i) => (
              <Reveal as="li" key={exp.slug} delay={i * 50} className="border-t border-line">
                <button
                  type="button"
                  onClick={() => setOpen(exp)}
                  aria-label={`Open details: ${exp.role}${exp.organization ? `, ${exp.organization}` : ""}`}
                  className="group grid w-full cursor-pointer grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 py-6 text-left md:grid-cols-[11rem_1fr_auto] md:py-7"
                >
                  <span className="text-sm italic text-muted md:row-auto">{exp.period}</span>
                  <span className="col-start-1 min-w-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5 motion-reduce:transition-none md:col-start-2 md:row-start-1">
                    <span className="display block text-lg leading-snug md:text-xl">{exp.role}</span>
                    {exp.organization ? (
                      <span className="mt-1 block text-sm text-accent">{exp.organization}</span>
                    ) : null}
                    {exp.summary ? (
                      <span className="mt-1.5 block text-sm text-muted">{exp.summary}</span>
                    ) : null}
                  </span>
                  <span
                    aria-hidden="true"
                    className="col-start-2 row-span-2 row-start-1 flex h-8 w-8 items-center justify-center rounded-full border border-line text-sm transition-all duration-500 group-hover:border-ink group-hover:bg-ink group-hover:text-bg md:col-start-3 md:row-span-1"
                  >
                    <span className="transition-transform duration-500 group-hover:rotate-45">+</span>
                  </span>
                </button>
              </Reveal>
            ))}
          </ol>
        </div>
      ))}

      {open ? <ExperienceDetail experience={open} onClose={() => setOpen(null)} /> : null}
    </div>
  );
}
