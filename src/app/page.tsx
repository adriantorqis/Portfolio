import { AchievementList } from "@/components/AchievementList";
import { CopyEmail } from "@/components/CopyEmail";
import { Footer } from "@/components/Footer";
import { Highlighted } from "@/components/Highlighted";
import { ParallaxMedia } from "@/components/ParallaxMedia";
import { PhotoCarousel } from "@/components/PhotoCarousel";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { ProjectList } from "@/components/ProjectList";
import { Reveal } from "@/components/Reveal";
import { SplitHeadline } from "@/components/SplitHeadline";
import { getAchievements, getOffTheClockPhotos, getProfile, getProjects, getTestimonials } from "@/lib/content";
import Image from "next/image";

export default async function HomePage() {
  const [projects, profile, testimonials, offTheClockPhotos, achievements] = await Promise.all([
    getProjects(),
    getProfile(),
    getTestimonials(),
    getOffTheClockPhotos(),
    getAchievements(),
  ]);
  const firstPlaces = achievements.filter((a) => a.rank.trim().toLowerCase() === "1st").length;
  const heroPhoto = profile.hero_image_path;
  const resumeUrl = profile.resume?.file_path ?? null;
  const bioParagraphs = profile.bio ? profile.bio.split("\n\n") : [];

  return (
    <>
      <main className="flex-1">
        {/* HERO */}
        <section className="px-6 pb-24 pt-20 md:px-12 md:pb-32 md:pt-28">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-14 md:grid-cols-[1.35fr_1fr] md:items-end md:gap-16">
              {/* Staggered rather than one block, so the hero assembles itself
                  line by line instead of arriving all at once. */}
              <div>
                <Reveal>
                  <p className="eyebrow">Portfolio</p>
                </Reveal>
                <SplitHeadline
                  text={profile?.headline || "Selected work"}
                  className="display mt-6 text-5xl sm:text-6xl lg:text-7xl"
                />
                <Reveal delay={180}>
                  <p className="mt-8 max-w-md text-lg leading-relaxed text-muted">
                    Selected projects, case studies, and the occasional strong opinion.
                  </p>
                </Reveal>
                <Reveal delay={270}>
                  <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm">
                    {[
                      { href: "#work", label: "View work" },
                      ...(achievements.length ? [{ href: "#achievements", label: "Achievements" }] : []),
                      { href: "#about", label: "About" },
                      { href: "#contact", label: "Get in touch" },
                    ].map(({ href, label }) => (
                      <a key={href} href={href} className="group/link link-underline inline-flex items-center gap-1.5">
                        {label}
                        <span
                          aria-hidden="true"
                          className="inline-block transition-transform duration-300 group-hover/link:translate-x-1"
                        >
                          &rarr;
                        </span>
                      </a>
                    ))}
                  </div>
                </Reveal>
              </div>

              <Reveal delay={120}>
                {heroPhoto ? (
                  // No .photo-frame here on purpose — that class paints a
                  // tinted background behind the image and forces
                  // object-fit:cover (crops to fill the box), which is
                  // exactly wrong for a cutout with a transparent
                  // background: object-contain shows the whole PNG/WebP
                  // with nothing painted behind it, so the page's own
                  // background shows through the transparent areas.
                  // (A JPEG can never be transparent — no alpha channel in
                  // the format — so this only works with a PNG/WebP source.)
                  <ParallaxMedia className="aspect-[4/5] w-full">
                    <Image
                      src={heroPhoto}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 40vw, 90vw"
                      priority
                      className="object-contain"
                    />
                  </ParallaxMedia>
                ) : (
                  <PhotoPlaceholder className="aspect-[4/5] w-full" label="Portrait" />
                )}
              </Reveal>
            </div>
          </div>
        </section>

        {/* WORK */}
        <section id="work" className="scroll-mt-16 border-t border-line py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-6 md:px-12">
            <Reveal>
              <p className="eyebrow">Selected work</p>
              <h2 className="display mt-4 text-3xl md:text-4xl">Projects</h2>
            </Reveal>
            <div className="mt-12">
              <ProjectList projects={projects} />
            </div>
          </div>
        </section>

        {/* ACHIEVEMENTS */}
        {achievements.length ? (
          <section id="achievements" className="scroll-mt-16 bg-ink-bg py-20 text-bg md:py-28">
            <div className="mx-auto max-w-5xl px-6 md:px-12">
              <Reveal className="flex flex-wrap items-end justify-between gap-x-12 gap-y-8">
                <div>
                  <p className="eyebrow text-bg/45">Recognition</p>
                  <h2 className="display mt-4 text-3xl md:text-4xl">Achievements</h2>
                </div>
                <dl className="flex gap-10 md:gap-14">
                  {[
                    { value: achievements.length, label: "Honours" },
                    ...(firstPlaces ? [{ value: firstPlaces, label: "First places" }] : []),
                  ].map(({ value, label }) => (
                    <div key={label} className="flex flex-col-reverse">
                      <dt className="eyebrow mt-2 text-bg/45">{label}</dt>
                      <dd className="display text-4xl text-[#c9a27e] md:text-5xl">
                        {String(value).padStart(2, "0")}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
              <div className="mt-14 md:mt-16">
                <AchievementList achievements={achievements} />
              </div>
            </div>
          </section>
        ) : null}

        {/* NOW */}
        <section className="border-t border-line py-20 md:py-24">
          <div className="mx-auto max-w-5xl px-6 md:px-12">
            <Reveal className="grid gap-8 md:grid-cols-[auto_1fr] md:gap-16">
              <div className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <p className="eyebrow">Currently</p>
              </div>
              <p className="display max-w-2xl text-xl leading-snug md:text-2xl">
                {profile?.now_status || "Add a current status to content/profile.json."}
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
                  <Reveal as="article" key={`${t.author}-${i}`} delay={i * 90}>
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
                {bioParagraphs.length ? (
                  bioParagraphs.map((para, i) => (
                    <p
                      key={i}
                      className={
                        i === 0
                          ? "display text-2xl leading-snug md:text-3xl"
                          : "mt-6 leading-relaxed text-muted"
                      }
                    >
                      <Highlighted text={para} />
                    </p>
                  ))
                ) : (
                  <p className="display text-2xl leading-snug md:text-3xl">
                    Bio coming soon.
                  </p>
                )}

                {profile.socials.linkedin ? (
                  <a
                    href={profile.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="link-underline mt-6 inline-block text-sm"
                  >
                    Connect on LinkedIn
                  </a>
                ) : null}

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
            <Reveal className="grid gap-10 md:grid-cols-[auto_1fr] md:gap-16">
              <p className="eyebrow md:pt-2">Academic &amp; Organizational Activities</p>
              {/* No max-w here — the photo strip spans the full content
                  column rather than being squeezed to reading width; only
                  the story paragraph itself (when there is one) gets
                  capped back down for legibility.
                  min-w-0 matters: a grid item's default min-width is auto,
                  which means it refuses to shrink below its content's
                  intrinsic size — since the carousel's row of wide photos
                  has a huge intrinsic width, without this the grid track
                  (and the whole page) would stretch to fit it instead of
                  the carousel's own overflow-x staying contained. */}
              <div className="min-w-0">
                {profile?.story ? (
                  <p className="max-w-2xl leading-relaxed whitespace-pre-line text-muted">
                    {profile.story}
                  </p>
                ) : null}
                <div className={profile?.story ? "mt-10" : undefined}>
                  <PhotoCarousel photos={offTheClockPhotos} />
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

              {profile?.email ? <CopyEmail email={profile.email} /> : null}

              <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-8 text-sm">
                {resumeUrl ? (
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="link-underline"
                  >
                    Access my resume
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
