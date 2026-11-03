"use client";

import { useRef } from "react";
import type { Project, Tool } from "@/lib/types";
import { useModalDrawer } from "@/lib/useModalDrawer";
import { Gallery } from "./Gallery";
import { ProjectMedia } from "./ProjectMedia";
import { ToolChip } from "./ToolBadge";

// The card truncates its description to three lines, which until now was a
// dead end — there was no way to read the rest of a project. This is that
// "rest": full copy, every tag, and the cover at a size worth looking at.
export function ProjectDetail({
  project,
  tools,
  onClose,
}: {
  project: Project;
  // Every known tool, so a project's tool names can pick up their icons.
  tools: Tool[];
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useModalDrawer(panelRef, onClose);

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
        className="drawer-panel relative flex h-full w-full max-w-4xl flex-col overflow-y-auto bg-bg outline-none"
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
                sizes="(min-width: 896px) 816px, 100vw"
              />
            </div>
          ) : null}

          {project.featured ? <p className="eyebrow mt-8">Featured</p> : null}

          <h2 id={headingId} className="display mt-4 text-3xl md:text-5xl">
            {project.title}
          </h2>

          {project.award ? (
            <p className="mt-3 text-lg text-accent md:text-xl">{project.award}</p>
          ) : null}

          {project.tags.length ? (
            <ul className="mt-5 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <li key={tag} className="border border-line px-2.5 py-1 text-xs text-muted">
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-10 grid gap-10 md:grid-cols-[1fr_15rem]">
            {project.description ? (
              <div className="space-y-5 leading-relaxed text-muted">
                {project.description.split("\n\n").map((para, i) => (
                  <p key={i} className="whitespace-pre-line">
                    {para}
                  </p>
                ))}
              </div>
            ) : (
              <div />
            )}

            <dl className="space-y-7 text-sm">
              {project.role.length ? (
                <div>
                  <dt className="eyebrow">Role</dt>
                  {project.role.map((r) => (
                    <dd key={r} className="mt-2 text-ink">
                      {r}
                    </dd>
                  ))}
                </div>
              ) : null}

              {project.tools.length ? (
                <div>
                  <dt className="eyebrow">Tools</dt>
                  <dd className="mt-3 flex flex-wrap gap-2">
                    {project.tools.map((name) => (
                      <ToolChip
                        key={name}
                        tool={
                          tools.find((t) => t.name.toLowerCase() === name.toLowerCase()) ?? {
                            name,
                            icon: null,
                          }
                        }
                      />
                    ))}
                  </dd>
                </div>
              ) : null}

              {project.link_url || file || project.links.length ? (
                <div>
                  <dt className="eyebrow">Links</dt>
                  <dd className="mt-2 flex flex-col items-start gap-2">
                    {project.link_url ? (
                      <a
                        href={project.link_url}
                        target="_blank"
                        rel="noreferrer"
                        className="link-underline"
                      >
                        Figma prototype ↗
                      </a>
                    ) : null}
                    {project.links.map((l) => (
                      <a
                        key={l.url}
                        href={l.url}
                        target="_blank"
                        rel="noreferrer"
                        className="link-underline"
                      >
                        {l.label} ↗
                      </a>
                    ))}
                    {file ? (
                      <a href={file} target="_blank" rel="noreferrer" className="link-underline">
                        Download file ↓
                      </a>
                    ) : null}
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>

          {project.gallery.length ? (
            <div className="mt-14 border-t border-line pt-8">
              <p className="eyebrow">Inside the project</p>
              <div className="mt-5">
                <Gallery photos={project.gallery} rowHeight={220} />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
