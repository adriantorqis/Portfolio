export type Project = {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover_image_path: string | null;
  tags: string[];
  featured: boolean;
  link_url: string | null;
  file_path: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  headline: string;
  bio: string;
  story: string;
  now_status: string;
  hero_image_path: string | null;
  skills: string[];
  email: string | null;
  socials: Record<string, string>;
  updated_at: string;
};

export type Resume = {
  id: string;
  file_path: string;
  original_filename: string | null;
  uploaded_at: string;
};

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  role: string | null;
  sort_order: number;
  created_at: string;
};
