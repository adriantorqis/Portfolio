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
