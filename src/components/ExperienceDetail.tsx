"use client";

import { useRef } from "react";
import type { Experience } from "@/lib/types";
import { useModalDrawer } from "@/lib/useModalDrawer";
import { Gallery } from "./Gallery";
import { RichText } from "./RichText";

export function ExperienceDetail({
  experience,
  onClose,
}: {
  experience: Experience;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  useModalDrawer(panelRef, onClose);
  const headingId = `experience-${experience.slug}`;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close experience details"
        onClick={onClose}
        className="drawer-backdrop absolute inset-0 cursor-default bg-ink/25"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        tabIndex={-1}
        className="drawer-panel relative flex h-full w-full max-w-3xl flex-col overflow-y-auto bg-bg outline-none"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-bg/90 px-6 py-4 backdrop-blur md:px-10">
          <p className="eyebrow">{experience.category}</p>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line transition-colors hover:border-ink"
            aria-label="Close"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="px-6 pb-16 pt-10 md:px-10">
          {experience.period ? (
            <p className="text-sm italic text-muted">{experience.period}</p>
          ) : null}
          <h2 id={headingId} className="display mt-3 text-3xl md:text-4xl">
            {experience.role}
          </h2>
          {experience.organization ? (
            <p className="mt-2 text-lg text-accent md:text-xl">{experience.organization}</p>
          ) : null}

          {experience.story ? <RichText source={experience.story} className="mt-8" /> : null}

          {experience.bullets.length ? (
            <RichText
              className="mt-6"
              source={experience.bullets.map((b) => `- ${b}`).join("\n")}
            />
          ) : null}

          {experience.highlights.length ? (
            <div className="mt-10">
              {experience.highlights_title ? (
                <p className="eyebrow">{experience.highlights_title}</p>
              ) : null}
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {experience.highlights.map((h) => (
                  <li
                    key={h}
                    className="rounded-xl border border-line px-5 py-4 font-medium text-accent"
                  >
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {experience.photos.length ? (
            <div className="mt-12 border-t border-line pt-8">
              <p className="eyebrow">Photos</p>
              <div className="mt-5">
                <Gallery photos={experience.photos} rowHeight={220} />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
