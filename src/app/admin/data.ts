import { supabaseAdmin } from "@/lib/supabase";
import type { Project, Testimonial } from "@/lib/types";

// Admin-only reads: unlike src/lib/data.ts, these never fall back to demo
// content. The dashboard's job is to show the true state of the database —
// showing demo rows here would let someone click "Edit"/"Delete" on a
// project that doesn't actually exist.

export async function getRealProjects(): Promise<Project[]> {
  const admin = supabaseAdmin();
  const { data, error } = await admin
    .from("project")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getRealTestimonials(): Promise<Testimonial[]> {
  const admin = supabaseAdmin();
  const { data, error } = await admin
    .from("testimonial")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}
