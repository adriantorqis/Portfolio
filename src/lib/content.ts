import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";
import type { Achievement, Certificate, Photo, Profile, Project, Testimonial } from "./types";

// Content lives in /content as hand-edited JSON, read at build time — there
// is no database and no runtime fetch, so the site is fully static. Uses
// node:fs directly rather than importing the JSON, since content/projects
// is a directory of files whose names aren't known ahead of time; profile
// and testimonials could be static imports but read the same way here for
// one consistent, one-place-to-fix error-handling path.
//
// Server-only (relies on node:fs) — never import this from a "use client"
// component. Reachable only from Server Components like app/page.tsx.

const CONTENT_DIR = path.join(process.cwd(), "content");
const PUBLIC_DIR = path.join(process.cwd(), "public");

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);

function readJson<T>(relativePath: string): T | null {
  try {
    const raw = readFileSync(path.join(CONTENT_DIR, relativePath), "utf-8");
    return JSON.parse(raw) as T;
  } catch (err) {
    // A hand-edited JSON file is exactly the kind of thing that gets a
    // trailing comma or a typo'd path — fail that one file, not the whole
    // site. Loud in the build log so it doesn't go unnoticed.
    console.error(
      `[content] failed to read ${relativePath}:`,
      err instanceof Error ? err.message : err
    );
    return null;
  }
}

export async function getProfile(): Promise<Profile> {
  const data = readJson<Partial<Profile>>("profile.json") ?? {};
  return {
    headline: data.headline ?? "",
    bio: data.bio ?? "",
    story: data.story ?? "",
    now_status: data.now_status ?? "",
    hero_image_path: data.hero_image_path ?? null,
    skills: data.skills ?? [],
    email: data.email ?? null,
    socials: data.socials ?? {},
    resume: data.resume ?? null,
  };
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const data = readJson<Testimonial[]>("testimonials.json") ?? [];
  return [...data].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
}

export async function getAchievements(): Promise<Achievement[]> {
  const data = readJson<Omit<Achievement, "photos">[]>("achievements.json") ?? [];
  return [...data]
    .filter((a) => {
      if (a.slug && a.rank && a.title) return true;
      console.error("[content] skipping an achievement — needs \"slug\", \"rank\" and \"title\"");
      return false;
    })
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((a) => ({ ...a, story: a.story ?? "", photos: readPhotos(`achievements/${a.slug}`) }));
}

export async function getProjects(): Promise<Project[]> {
  const dir = path.join(CONTENT_DIR, "projects");
  let files: string[];
  try {
    files = readdirSync(dir).filter((f) => f.endsWith(".json"));
  } catch (err) {
    console.error(
      "[content] failed to read content/projects:",
      err instanceof Error ? err.message : err
    );
    return [];
  }

  const projects: Project[] = [];
  for (const file of files) {
    const data = readJson<Partial<Project>>(`projects/${file}`);
    if (!data?.slug || !data.title) {
      console.error(`[content] skipping projects/${file} — needs at least "slug" and "title"`);
      continue;
    }
    projects.push({
      slug: data.slug,
      title: data.title,
      description: data.description ?? "",
      cover_image_path: data.cover_image_path ?? null,
      cover_media_kind: data.cover_media_kind ?? "image",
      cover_poster_path: data.cover_poster_path ?? null,
      tags: data.tags ?? [],
      featured: data.featured ?? false,
      link_url: data.link_url ?? null,
      file_path: data.file_path ?? null,
      sort_order: data.sort_order ?? 0,
    });
  }

  return projects.sort(
    (a, b) => a.sort_order - b.sort_order || a.title.localeCompare(b.title)
  );
}

// Turns a filename into the caption shown on hover — the whole point is
// that renaming the file is the only edit needed, no JSON, no code change:
//   "Visiting SAP China.JPG"    -> "Visiting SAP China"
//   "01-lab-showcase.jpg"       -> "lab showcase"   (ordering prefix dropped)
//   "team_photo_2024.png"       -> "team photo 2024"
function captionFromFilename(filename: string): string {
  const withoutExt = filename.replace(/\.[^.]+$/, "");
  const withoutOrderPrefix = withoutExt.replace(/^\d+[\s._-]+/, "");
  // Camera/phone/screenshot defaults ("Screenshot 2026-10-19 at 12.05.46",
  // "WhatsApp Image …", "IMG_1234") make for meaningless captions — show none
  // until the file is given a real name.
  if (/^(screenshot|screen shot|whatsapp|img[ _-]?\d|dsc[ _-]?\d|photo[ _-]?\d)/i.test(withoutOrderPrefix)) {
    return "";
  }
  return withoutOrderPrefix.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
}

// Just drop image files in public/media/off-the-clock/ — no JSON entry, no
// naming convention, nothing to wire up. Whatever's in the folder at build
// time is what shows, in filename order (rename with a "01-", "02-" prefix
// if a specific order matters; otherwise plain alphabetical is predictable
// enough not to need declaring anywhere). The filename doubles as the
// caption shown on hover — see captionFromFilename above.
//
// Real width/height (not a fixed crop) are read from each file so the
// carousel can size every photo by its own natural aspect ratio instead of
// forcing one ratio and cropping to fit it.
export async function getOffTheClockPhotos(): Promise<Photo[]> {
  return readPhotos("off-the-clock");
}

// Every image in public/media/<relDir>, sized by its own real dimensions.
function readPhotos(relDir: string): Photo[] {
  const dir = path.join(PUBLIC_DIR, "media", relDir);
  let files: string[];
  try {
    files = readdirSync(dir);
  } catch {
    // Directory not created yet, or genuinely empty — either way, no
    // photos yet is a normal state, not an error worth logging.
    return [];
  }

  const photos: Photo[] = [];
  for (const file of files.filter((f) => IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()))) {
    try {
      const bytes = readFileSync(path.join(dir, file));
      const { width, height, orientation } = imageSize(bytes);
      // EXIF orientations 5–8 mean the file's own pixel buffer is rotated
      // 90°/270° from how it actually displays (common for phone photos
      // shot in portrait) — swap so the aspect ratio matches what browsers
      // render, not the raw buffer.
      const rotated = orientation !== undefined && orientation >= 5;
      photos.push({
        src: `/media/${relDir}/${file}`,
        width: rotated ? height : width,
        height: rotated ? width : height,
        caption: captionFromFilename(file),
      });
    } catch (err) {
      console.error(
        `[content] couldn't read dimensions for ${relDir}/${file}, skipping:`,
        err instanceof Error ? err.message : err
      );
    }
  }

  return photos.sort((a, b) => a.src.localeCompare(b.src, undefined, { numeric: true }));
}

function metaContent(html: string, property: string): string | null {
  const tag = html.match(new RegExp(`<meta[^>]*property="${property}"[^>]*>`, "i"))?.[0];
  const value = tag?.match(/content="([^"]*)"/i)?.[1];
  return value
    ? value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'")
    : null;
}

// content/certificates.json is just a list of Credly links. The title,
// issuer and badge image come from each page's Open Graph tags, fetched once
// at build time — so the site stays static and a new certificate is one pasted
// link. If Credly is unreachable the build still succeeds and that card
// falls back to a plain link.
export async function getCertificates(): Promise<Certificate[]> {
  const data = readJson<{ url: string; sort_order?: number }[]>("certificates.json") ?? [];
  const sorted = [...data]
    .filter((c) => c.url)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  return Promise.all(
    sorted.map(async ({ url }): Promise<Certificate> => {
      const empty = { url, title: null, issuer: null, description: null, image: null };
      try {
        const res = await fetch(url, {
          headers: { "user-agent": "Mozilla/5.0 (compatible; PortfolioBuild/1.0)" },
          signal: AbortSignal.timeout(15000),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const html = await res.text();
        const ogTitle = metaContent(html, "og:title");
        // "<Badge> was issued by <Issuer> to <Person>."
        const parts = ogTitle?.match(/^(.*) was issued by (.*) to .*?\.?$/);
        return {
          url,
          title: parts?.[1] ?? ogTitle,
          issuer: parts?.[2] ?? null,
          description: metaContent(html, "og:description"),
          image: metaContent(html, "og:image"),
        };
      } catch (err) {
        console.error(
          `[content] couldn't read Credly badge ${url}:`,
          err instanceof Error ? err.message : err
        );
        return empty;
      }
    })
  );
}
