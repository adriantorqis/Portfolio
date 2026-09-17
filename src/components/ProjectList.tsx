"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import type { Project } from "@/lib/types";
import { ProjectDetail } from "./ProjectDetail";
import { ProjectMedia } from "./ProjectMedia";

export function ProjectList({ projects }: { projects: Project[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const reduced = useReducedMotion();

  const tags = useMemo(
    () => [...new Set(projects.flatMap((p) => p.tags))].sort((a, b) => a.localeCompare(b)),
    [projects]
  );

  const visible = useMemo(
    () => (activeTag ? projects.filter((p) => p.tags.includes(activeTag)) : projects),
    [projects, activeTag]
  );

  function toggleTag(tag: string | null) {
    setActiveTag((current) => (current === tag ? null : tag));
  }

  return (
    <div>
      {tags.length ? (
        <div className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-line pb-4">
          <FilterTab active={activeTag === null} onClick={() => setActiveTag(null)}>
            All
          </FilterTab>
          {tags.map((tag) => (
            <FilterTab key={tag} active={activeTag === tag} onClick={() => toggleTag(tag)}>
              {tag}
            </FilterTab>
          ))}
        </div>
      ) : null}

      <p className="sr-only" aria-live="polite">
        {activeTag
          ? `${visible.length} project${visible.length === 1 ? "" : "s"} tagged ${activeTag}`
          : `${visible.length} project${visible.length === 1 ? "" : "s"}`}
      </p>

      <ul className="grid grid-cols-1 items-start gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {/* popLayout lets the survivors slide into their new positions while
            the filtered-out cards are still on their way out, instead of the
            grid jumping the moment one is removed. */}
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((project, i) => {
            // Every path is already a root-relative /public URL — no bucket
            // + object key to resolve into one anymore.
            const cover = project.cover_image_path;
            const poster = project.cover_poster_path;
            const file = project.file_path;

            return (
              <motion.li
                key={project.slug}
                layout={!reduced}
                className="anim group"
                initial={reduced ? false : { opacity: 0, y: 26, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={reduced ? undefined : { opacity: 0, y: -14, filter: "blur(6px)" }}
                // once:false — the entrance replays each time the card comes
                // back into view, matching the rest of the page.
                viewport={{ once: false, amount: 0.2, margin: "0px 0px -6% 0px" }}
                transition={{
                  duration: 0.75,
                  ease: [0.16, 1, 0.3, 1],
                  delay: (i % 3) * 0.08,
                  layout: { duration: 0.5, ease: [0.2, 0.7, 0.2, 1] },
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenProject(project)}
                  aria-label={`Open details for ${project.title}`}
                  className="tile block aspect-[4/3] w-full cursor-pointer"
                >
                  {cover ? (
                    <ProjectMedia
                      src={cover}
                      posterSrc={poster}
                      kind={project.cover_media_kind}
                      sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, calc(100vw - 3rem)"
                      priority={i === 0}
                      playTrigger="hover"
                    />
                  ) : (
                    <span className="placeholder-fill flex h-full w-full items-center justify-center">
                      <span className="eyebrow">Cover image</span>
                    </span>
                  )}

                  {project.featured ? (
                    <span className="absolute left-4 top-4 z-[2] rounded-full bg-bg/85 px-3 py-1 text-[0.65rem] uppercase tracking-[0.12em] text-ink backdrop-blur">
                      Featured
                    </span>
                  ) : null}
                </button>

                <div className="mt-5">
                  <div className="flex items-baseline gap-3">
                    <span className="eyebrow">{String(i + 1).padStart(2, "0")}</span>
                    <span className="h-px flex-1 bg-line" />
                  </div>

                  <h3 className="mt-3">
                    <button
                      type="button"
                      onClick={() => setOpenProject(project)}
                      className="display link-underline cursor-pointer text-left text-xl leading-tight"
                    >
                      {project.title}
                    </button>
                  </h3>

                  <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-muted">
                    {project.description}
                  </p>

                  <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                    {project.tags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`cursor-pointer border-b border-transparent pb-px transition-colors hover:border-ink hover:text-ink ${
                          activeTag === tag ? "border-ink text-ink" : "text-muted"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                    <button
                      type="button"
                      onClick={() => setOpenProject(project)}
                      className="link-underline cursor-pointer"
                    >
                      Read more
                    </button>
                    {project.link_url ? (
                      <a
                        href={project.link_url}
                        target="_blank"
                        rel="noreferrer"
                        className="link-underline"
                      >
                        Visit
                      </a>
                    ) : null}
                    {file ? (
                      <a href={file} target="_blank" rel="noreferrer" className="link-underline">
                        Download
                      </a>
                    ) : null}
                  </div>
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>

      {visible.length === 0 ? (
        <p className="py-16 text-sm text-muted">No projects match that tag.</p>
      ) : null}

      {openProject ? (
        <ProjectDetail project={openProject} onClose={() => setOpenProject(null)} />
      ) : null}
    </div>
  );
}

function FilterTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="relative cursor-pointer pb-1 text-sm transition-colors"
    >
      <span className={active ? "text-ink" : "text-muted transition-colors hover:text-ink"}>
        {children}
      </span>
      {/* A single element sliding between tabs, rather than each tab fading
          its own underline in and out. */}
      {active ? (
        <motion.span
          layoutId="filter-underline"
          className="absolute -bottom-[17px] left-0 right-0 h-px bg-ink"
          transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
        />
      ) : null}
    </button>
  );
}
