export type CoverMediaKind = "image" | "gif" | "video";

// Every *_path field is a root-relative path under /public (e.g.
// "/media/projects/foo/cover.mp4") or null — no more resolving a storage
// bucket + object key into a URL, the path already *is* the URL.
export type Project = {
  slug: string;
  title: string;
  description: string;
  cover_image_path: string | null;
  cover_media_kind: CoverMediaKind;
  cover_poster_path: string | null;
  tags: string[];
  featured: boolean;
  link_url: string | null;
  file_path: string | null;
  sort_order: number;
};

export type Resume = {
  file_path: string;
  original_filename: string | null;
};

export type Profile = {
  headline: string;
  bio: string;
  story: string;
  now_status: string;
  hero_image_path: string | null;
  skills: string[];
  email: string | null;
  socials: Record<string, string>;
  resume: Resume | null;
};

export type Testimonial = {
  quote: string;
  author: string;
  role: string | null;
  sort_order: number;
};

// A photo whose own file dictates its shape and caption — width/height are
// the source file's real pixel dimensions (read at build time), not a fixed
// crop, and caption is derived from the filename so there's nothing to
// register anywhere: rename the file, the caption changes on next build.
export type Photo = {
  src: string;
  width: number;
  height: number;
  caption: string;
};

// rank is free text on purpose ("1st", "Top 4", "Top 5%") — it's shown
// verbatim as the big numeral, so any placement wording works.
export type Achievement = {
  // Also the folder name: photos live in public/media/achievements/<slug>/
  slug: string;
  rank: string;
  title: string;
  organizer: string;
  year: number | null;
  // Optional colour override; otherwise derived from the rank text.
  tone?: "gold" | "silver" | "bronze" | "teal" | "violet";
  // The story shown when the row is opened; "\n\n" separates paragraphs and
  // **word** highlights, same as the bio.
  story: string;
  // Not in the JSON — filled from the folder at build time.
  photos: Photo[];
  sort_order: number;
};

// Filled at build time from the Credly badge page's own metadata — the JSON
// only holds the link. title/issuer/image fall back to null if Credly can't
// be reached, and the card still renders as a plain link.
export type Certificate = {
  url: string;
  title: string | null;
  issuer: string | null;
  description: string | null;
  image: string | null;
};
