import { DEMO_PROFILE, DEMO_PROJECTS, DEMO_TESTIMONIALS } from "./demo-content";
import { isSupabaseConfigured, supabase } from "./supabase";
import type { Profile, Project, Resume, Testimonial } from "./types";

export async function getProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured) return DEMO_PROJECTS;
  const { data, error } = await supabase
    .from("project")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data && data.length > 0 ? data : DEMO_PROJECTS;
}

export async function getProfile(): Promise<Profile | null> {
  if (!isSupabaseConfigured) return DEMO_PROFILE;
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data ?? DEMO_PROFILE;
}

export async function getLatestResume(): Promise<Resume | null> {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from("resume")
    .select("*")
    .order("uploaded_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!isSupabaseConfigured) return DEMO_TESTIMONIALS;
  const { data, error } = await supabase
    .from("testimonial")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data && data.length > 0 ? data : DEMO_TESTIMONIALS;
}

export function publicStorageUrl(bucket: string, path: string | null): string | null {
  if (!path || !isSupabaseConfigured) return null;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
