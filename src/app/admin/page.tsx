import Link from "next/link";
import { getLatestResume, getProfile, publicStorageUrl } from "@/lib/data";
import { getRealProjects, getRealTestimonials } from "./data";
import { logout } from "./login/actions";
import {
  addTestimonial,
  deleteProject,
  deleteResume,
  deleteTestimonial,
  saveProfile,
  uploadResume,
} from "./actions";

// A dashboard must reflect the database as it is *right now*. Without this
// Next prerenders /admin and serves a build-time snapshot, so any change made
// outside a server action (another device, a direct DB edit) shows up stale.
export const dynamic = "force-dynamic";

const fieldClass =
  "border border-line bg-bg px-3 py-2 text-sm focus:outline-none focus:border-ink";
const labelClass = "eyebrow";
const buttonClass =
  "border border-ink px-4 py-2 text-sm transition-colors hover:bg-ink hover:text-bg cursor-pointer";
const quietButtonClass =
  "text-sm text-muted transition-colors hover:text-ink cursor-pointer";

export default async function AdminPage() {
  const [projects, profile, resume, testimonials] = await Promise.all([
    getRealProjects(),
    getProfile(),
    getLatestResume(),
    getRealTestimonials(),
  ]);

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-14 md:px-12">
      <div className="mb-16 flex items-center justify-between border-b border-line pb-6">
        <h1 className="display text-3xl">Admin</h1>
        <form action={logout}>
          <button className={quietButtonClass}>Log out</button>
        </form>
      </div>

      {/* PROJECTS */}
      <section className="mb-20">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="eyebrow">Projects</h2>
          <Link href="/admin/projects/new" className={buttonClass}>
            New project
          </Link>
        </div>
        <ul className="divide-y divide-line border-y border-line">
          {projects.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-4 py-4">
              <div className="min-w-0">
                <p className="truncate">
                  {p.title}
                  {p.featured ? (
                    <span className="eyebrow ml-3 align-middle">Featured</span>
                  ) : null}
                </p>
                <p className="mt-0.5 text-sm text-muted">/{p.slug}</p>
              </div>
              <div className="flex shrink-0 items-center gap-5">
                <Link href={`/admin/projects/${p.id}`} className="text-sm link-underline">
                  Edit
                </Link>
                <form action={deleteProject}>
                  <input type="hidden" name="id" value={p.id} />
                  <button className={quietButtonClass}>Delete</button>
                </form>
              </div>
            </li>
          ))}
          {projects.length === 0 ? (
            <li className="py-8 text-sm text-muted">No projects yet.</li>
          ) : null}
        </ul>
      </section>

      {/* RESUME */}
      <section className="mb-20">
        <h2 className="eyebrow mb-6">Résumé</h2>
        {resume ? (
          <div className="mb-4 flex items-center justify-between gap-4 border-y border-line py-4">
            <p className="min-w-0 truncate text-sm">
              {resume.original_filename ?? resume.file_path}
            </p>
            <form action={deleteResume} className="shrink-0">
              <input type="hidden" name="id" value={resume.id} />
              <button className={quietButtonClass}>Remove</button>
            </form>
          </div>
        ) : (
          <p className="mb-4 text-sm text-muted">No résumé uploaded.</p>
        )}
        <form action={uploadResume} className="flex flex-wrap items-center gap-3">
          <input type="file" name="file" required className="text-sm" />
          <button className={buttonClass}>Upload</button>
        </form>
        <p className="mt-2 text-sm text-muted">
          Uploading replaces the current résumé and deletes the old file.
        </p>
      </section>

      {/* PROFILE */}
      <section className="mb-20">
        <h2 className="eyebrow mb-6">Profile</h2>
        {profile ? (
          <form action={saveProfile} className="grid max-w-xl gap-5">
            <input type="hidden" name="id" value={profile.id} />
            <label className="grid gap-1.5">
              <span className={labelClass}>Headline</span>
              <input name="headline" defaultValue={profile.headline} className={fieldClass} />
            </label>
            <label className="grid gap-1.5">
              <span className={labelClass}>Bio</span>
              <textarea name="bio" defaultValue={profile.bio} rows={5} className={fieldClass} />
              <span className="text-xs text-muted">
                Leave a blank line between paragraphs — the first one is set larger.
              </span>
            </label>
            <label className="grid gap-1.5">
              <span className={labelClass}>Story (off the clock)</span>
              <textarea
                name="story"
                defaultValue={profile.story}
                rows={4}
                placeholder="Hobbies, the life before this, whatever makes you a person and not a PDF."
                className={fieldClass}
              />
            </label>
            <label className="grid gap-1.5">
              <span className={labelClass}>Currently</span>
              <textarea
                name="now_status"
                defaultValue={profile.now_status}
                rows={3}
                placeholder="What you're heads-down on right now."
                className={fieldClass}
              />
            </label>
            <label className="grid gap-1.5">
              <span className={labelClass}>
                Portrait {profile.hero_image_path ? "(replace)" : ""}
              </span>
              {profile.hero_image_path ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={publicStorageUrl("covers", profile.hero_image_path) ?? ""}
                  alt=""
                  className="mb-1 aspect-[4/5] w-28 border border-line object-cover"
                />
              ) : null}
              <input type="file" name="hero_image" accept="image/*" className="text-sm" />
            </label>
            <label className="grid gap-1.5">
              <span className={labelClass}>Skills (comma separated)</span>
              <input
                name="skills"
                defaultValue={profile.skills.join(", ")}
                className={fieldClass}
              />
            </label>
            <label className="grid gap-1.5">
              <span className={labelClass}>Email</span>
              <input
                name="email"
                type="email"
                defaultValue={profile.email ?? ""}
                className={fieldClass}
              />
            </label>
            <div className="grid gap-5 sm:grid-cols-3">
              <label className="grid gap-1.5">
                <span className={labelClass}>GitHub</span>
                <input
                  name="github"
                  defaultValue={profile.socials.github ?? ""}
                  className={fieldClass}
                />
              </label>
              <label className="grid gap-1.5">
                <span className={labelClass}>LinkedIn</span>
                <input
                  name="linkedin"
                  defaultValue={profile.socials.linkedin ?? ""}
                  className={fieldClass}
                />
              </label>
              <label className="grid gap-1.5">
                <span className={labelClass}>Twitter</span>
                <input
                  name="twitter"
                  defaultValue={profile.socials.twitter ?? ""}
                  className={fieldClass}
                />
              </label>
            </div>
            <button className={`${buttonClass} justify-self-start`}>Save profile</button>
          </form>
        ) : (
          <p className="text-sm text-muted">
            Profile row missing — run supabase/schema.sql, it seeds one automatically.
          </p>
        )}
      </section>

      {/* TESTIMONIALS */}
      <section>
        <h2 className="eyebrow mb-6">Testimonials</h2>
        <ul className="mb-8 divide-y divide-line border-y border-line">
          {testimonials.map((t) => (
            <li key={t.id} className="flex items-start justify-between gap-6 py-4">
              <div className="min-w-0">
                <p className="text-sm">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-1.5 text-sm text-muted">
                  {t.author}
                  {t.role ? ` — ${t.role}` : ""}
                  <span className="ml-2 text-xs">· order {t.sort_order}</span>
                </p>
              </div>
              <form action={deleteTestimonial} className="shrink-0">
                <input type="hidden" name="id" value={t.id} />
                <button className={quietButtonClass}>Delete</button>
              </form>
            </li>
          ))}
          {testimonials.length === 0 ? (
            <li className="py-8 text-sm text-muted">No testimonials yet.</li>
          ) : null}
        </ul>
        <form action={addTestimonial} className="grid max-w-xl gap-5">
          <label className="grid gap-1.5">
            <span className={labelClass}>Quote</span>
            <textarea name="quote" rows={3} required className={fieldClass} />
          </label>
          <div className="grid gap-5 sm:grid-cols-[1fr_1fr_auto]">
            <label className="grid gap-1.5">
              <span className={labelClass}>Author</span>
              <input name="author" required className={fieldClass} />
            </label>
            <label className="grid gap-1.5">
              <span className={labelClass}>Role (optional)</span>
              <input name="role" className={fieldClass} />
            </label>
            <label className="grid gap-1.5">
              <span className={labelClass}>Order</span>
              <input
                name="sort_order"
                type="number"
                defaultValue={testimonials.length}
                className={`${fieldClass} w-20`}
              />
            </label>
          </div>
          <button className={`${buttonClass} justify-self-start`}>Add testimonial</button>
        </form>
      </section>
    </main>
  );
}
