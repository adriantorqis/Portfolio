import { Footer } from "@/components/Footer";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { ProjectCarousel } from "@/components/ProjectCarousel";
import { Reveal } from "@/components/Reveal";
import {
  getLatestResume,
  getProfile,
  getProjects,
  getTestimonials,
  publicStorageUrl,
} from "@/lib/data";

export default async function HomePage() {
  const [projects, profile, resume, testimonials] = await Promise.all([
    getProjects(),
    getProfile(),
    getLatestResume(),
    getTestimonials(),
  ]);
  const heroPhoto = publicStorageUrl("covers", profile?.hero_image_path ?? null);
  const resumeUrl = resume ? publicStorageUrl("resumes", resume.file_path) : null;

  return (
    <>
      <main className="flex-1">
        {/* HERO */}
        <section className="px-6 pb-24 pt-20 md:px-12 md:pb-32 md:pt-28">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-14 md:grid-cols-[1.35fr_1fr] md:items-end md:gap-16">
              <Reveal>
                <p className="eyebrow">Portfolio</p>
                <h1 className="display mt-6 text-5xl sm:text-6xl lg:text-7xl">
                  {profile?.headline || "Selected work"}
                </h1>
                <p className="mt-8 max-w-md text-lg leading-relaxed text-muted">
                  Selected projects, case studies, and the occasional strong opinion.
                </p>
                <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm">
                  <a href="#work" className="link-underline">
                    View work
                  </a>
                  <a href="#about" className="link-underline">
                    About
                  </a>
                  <a href="#contact" className="link-underline">
                    Get in touch
                  </a>
                </div>
              </Reveal>

              <Reveal delay={120}>
                {heroPhoto ? (
                  <div className="photo-frame aspect-[4/5] w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={heroPhoto} alt="" />
                  </div>
                ) : (
                  <PhotoPlaceholder className="aspect-[4/5] w-full" label="Portrait" />
                )}
              </Reveal>
            </div>
          </div>
        </section>

        {/* WORK */}
        <section id="work" className="scroll-mt-16 border-t border-line py-20 md:py-28">
          <div className="mx-auto max-w-5xl">
            <Reveal className="flex items-end justify-between gap-6 px-6 md:px-12">
              <div>
                <p className="eyebrow">Selected work</p>
                <h2 className="display mt-4 text-3xl md:text-4xl">Projects</h2>
              </div>
              <p className="hidden text-sm text-muted sm:block">Drag or use the arrows</p>
            </Reveal>
          </div>
          <Reveal delay={100} className="mx-auto mt-12 max-w-5xl">
            <ProjectCarousel projects={projects} />
          </Reveal>
        </section>

        {/* NOW */}
        <section className="border-t border-line py-20 md:py-24">
          <div className="mx-auto max-w-5xl px-6 md:px-12">
            <Reveal className="grid gap-8 md:grid-cols-[auto_1fr] md:gap-16">
              <div className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <p className="eyebrow">Currently</p>
              </div>
              <p className="display max-w-2xl text-xl leading-snug md:text-2xl">
                {profile?.now_status || "Add a current status from /admin."}
              </p>
            </Reveal>
          </div>
        </section>

        {/* TESTIMONIALS */}
        {testimonials.length ? (
          <section className="bg-ink-bg py-20 text-bg md:py-28">
            <div className="mx-auto max-w-5xl px-6 md:px-12">
              <Reveal>
                <p className="eyebrow text-bg/45">Endorsements</p>
              </Reveal>
              <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-10">
                {testimonials.map((t, i) => (
                  <Reveal as="article" key={t.id} delay={i * 90}>
                    <p className="display text-lg leading-snug text-bg/90">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <p className="mt-5 text-sm text-bg/50">
                      {t.author}
                      {t.role ? <span className="block">{t.role}</span> : null}
                    </p>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* ABOUT */}
        <section id="about" className="scroll-mt-16 border-t border-line py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-6 md:px-12">
            <Reveal className="grid gap-12 md:grid-cols-[auto_1fr] md:gap-16">
              <p className="eyebrow md:pt-2">About</p>
              <div className="max-w-2xl">
                <p className="display text-2xl leading-snug md:text-3xl">
                  {profile?.bio?.split("\n\n")[0] || "Bio coming soon."}
                </p>
                {profile?.bio?.split("\n\n").slice(1).map((para, i) => (
                  <p key={i} className="mt-6 leading-relaxed text-muted">
                    {para}
                  </p>
                ))}

                {profile?.skills?.length ? (
                  <ul className="mt-12 grid grid-cols-2 gap-x-8 gap-y-3 border-t border-line pt-8 sm:grid-cols-3">
                    {profile.skills.map((skill) => (
                      <li key={skill} className="text-sm text-muted">
                        {skill}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </Reveal>
          </div>
        </section>

        {/* OFF THE CLOCK */}
        <section className="border-t border-line py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-6 md:px-12">
            <Reveal className="grid gap-12 md:grid-cols-[auto_1fr] md:gap-16">
              <p className="eyebrow md:pt-2">Off the clock</p>
              <div className="grid max-w-2xl gap-10 sm:grid-cols-[1fr_auto] sm:items-start">
                <p className="leading-relaxed whitespace-pre-line text-muted">
                  {profile?.story ||
                    "Add the personal side from /admin — hobbies, the life before this, whatever makes you a person and not a PDF."}
                </p>
                <div className="flex gap-4 sm:flex-col">
                  <PhotoPlaceholder className="aspect-square w-24 sm:w-28" label="Photo" />
                  <PhotoPlaceholder className="aspect-square w-24 sm:w-28" label="Photo" />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="scroll-mt-16 border-t border-line py-24 md:py-32">
          <div className="mx-auto max-w-5xl px-6 md:px-12">
            <Reveal>
              <p className="eyebrow">Get in touch</p>
              <h2 className="display mt-6 text-4xl md:text-6xl">
                Let&rsquo;s work together
              </h2>

              {profile?.email ? (
                <a
                  href={`mailto:${profile.email}`}
                  className="link-underline mt-10 inline-block break-all text-xl md:text-2xl"
                >
                  {profile.email}
                </a>
              ) : null}

              <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-8 text-sm">
                {resumeUrl ? (
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="link-underline"
                  >
                    Résumé
                  </a>
                ) : null}
                {profile?.socials
                  ? Object.entries(profile.socials).map(([key, url]) => (
                      <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="link-underline capitalize"
                      >
                        {key}
                      </a>
                    ))
                  : null}
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
