import type { Experience } from "@/lib/types";
import { Gallery } from "./Gallery";
import { Reveal } from "./Reveal";

// One block per role: period, role and organisation, what was done, an
// optional titled group (e.g. courses taught), and whatever photos are in
// public/media/experiences/<slug>/ beside it. Without photos the text simply
// takes the full width.
export function ExperienceList({ experiences }: { experiences: Experience[] }) {
  return (
    <ol className="space-y-16 md:space-y-20">
      {experiences.map((exp) => {
        const hasPhotos = exp.photos.length > 0;
        return (
          <Reveal as="li" key={exp.slug}>
            <div
              className={`grid gap-8 md:gap-12 ${hasPhotos ? "md:grid-cols-[1fr_1.1fr]" : ""}`}
            >
              <div className="min-w-0">
                {exp.period ? (
                  <p className="text-sm italic text-muted">{exp.period}</p>
                ) : null}
                <h3 className="display mt-3 text-2xl md:text-3xl">{exp.role}</h3>
                {exp.organization ? (
                  <p className="mt-2 text-lg text-accent">{exp.organization}</p>
                ) : null}
                {exp.bullets.length ? (
                  <ul className="mt-6 space-y-2.5 leading-relaxed text-muted">
                    {exp.bullets.map((b) => (
                      <li key={b} className="flex gap-3">
                        <span aria-hidden="true" className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>

              {hasPhotos ? (
                <div className="min-w-0">
                  <Gallery photos={exp.photos} rowHeight={200} />
                </div>
              ) : null}
            </div>

            {exp.highlights.length ? (
              <div className="mt-10">
                {exp.highlights_title ? <p className="eyebrow">{exp.highlights_title}</p> : null}
                <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {exp.highlights.map((h) => (
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
          </Reveal>
        );
      })}
    </ol>
  );
}
