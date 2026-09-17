"use client";

import { useEffect, useRef } from "react";
import type { Project } from "@/lib/types";
import { ProjectMedia } from "./ProjectMedia";

// The card truncates its description to three lines, which until now was a
// dead end — there was no way to read the rest of a project. This is that
// "rest": full copy, every tag, and the cover at a size worth looking at.
export function ProjectDetail({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Restore focus to whatever opened the panel when it closes — otherwise a
    // keyboard user is dumped back at the top of the document.
    const previouslyFocused = document.activeElement as HTMLElement | null;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      // Keep Tab inside the dialog; a modal that leaks focus to the page
      // behind it is worse than no modal.
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  const cover = project.cover_image_path;
  const poster = project.cover_poster_path;
  const file = project.file_path;
  const headingId = `project-detail-${project.slug}`;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close project details"
        onClick={onClose}
        className="drawer-backdrop absolute inset-0 cursor-default bg-ink/25"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        tabIndex={-1}
        className="drawer-panel relative flex h-full w-full max-w-xl flex-col overflow-y-auto bg-bg outline-none"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-bg/90 px-6 py-4 backdrop-blur md:px-10">
          <p className="eyebrow">Project</p>
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

        <div className="px-6 pb-16 pt-8 md:px-10">
          {cover ? (
            <div className="photo-frame aspect-[4/3] w-full">
              <ProjectMedia
                src={cover}
                posterSrc={poster}
                kind={project.cover_media_kind}
                alt={project.title}
                sizes="(min-width: 768px) 576px, 100vw"
              />
            </div>
          ) : null}

          {project.featured ? <p className="eyebrow mt-8">Featured</p> : null}

          <h2 id={headingId} className="display mt-4 text-3xl md:text-4xl">
            {project.title}
          </h2>

          {project.tags.length ? (
            <ul className="mt-5 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <li
                  key={tag}
                  className="border border-line px-2.5 py-1 text-xs text-muted"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}

          {project.description ? (
            <div className="mt-8 space-y-5 leading-relaxed text-muted">
              {project.description.split("\n\n").map((para, i) => (
                <p key={i} className="whitespace-pre-line">
                  {para}
                </p>
              ))}
            </div>
          ) : null}

          {project.link_url || file ? (
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-8 text-sm">
              {project.link_url ? (
                <a
                  href={project.link_url}
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline"
                >
                  Visit project
                </a>
              ) : null}
              {file ? (
                <a href={file} target="_blank" rel="noreferrer" className="link-underline">
                  Download file
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
