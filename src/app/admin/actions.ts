"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// `slug` is UNIQUE, so two projects sharing a title would otherwise collide
// and surface as a raw 500 (postgres 23505). Find a free variant instead —
// "my-project", "my-project-2", "my-project-3", …
async function uniqueSlug(base: string, currentId: string | null): Promise<string> {
  const admin = supabaseAdmin();
  const root = base || "project";
  let candidate = root;

  for (let n = 2; n < 1000; n++) {
    let query = admin.from("project").select("id").eq("slug", candidate);
    if (currentId) query = query.neq("id", currentId);
    const { data, error } = await query.limit(1);
    if (error) throw error;
    if (!data || data.length === 0) return candidate;
    candidate = `${root}-${n}`;
  }
  // absurdly unlikely; keep it collision-proof rather than looping forever
  return `${root}-${Date.now()}`;
}

async function uploadFile(bucket: string, file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${randomUUID()}${ext ? `.${ext}` : ""}`;
  const admin = supabaseAdmin();
  const { error } = await admin.storage.from(bucket).upload(path, file, {
    contentType: file.type || undefined,
    upsert: false,
  });
  if (error) throw error;
  return path;
}

async function removeFile(bucket: string, path: string | null | undefined) {
  if (!path) return;
  const admin = supabaseAdmin();
  await admin.storage.from(bucket).remove([path]);
}

export async function saveProject(formData: FormData) {
  const admin = supabaseAdmin();

  const id = formData.get("id") as string | null;
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const featured = formData.get("featured") === "on";
  const linkUrl = String(formData.get("link_url") ?? "").trim() || null;
  const sortOrder = Number(formData.get("sort_order") ?? 0) || 0;
  const slugInput = String(formData.get("slug") ?? "").trim();
  const slug = await uniqueSlug(slugify(slugInput || title), id);

  const coverFile = formData.get("cover_image") as File | null;
  const attachedFile = formData.get("file") as File | null;
  const replacingCover = Boolean(coverFile && coverFile.size > 0);
  const replacingFile = Boolean(attachedFile && attachedFile.size > 0);

  // fetch the row being replaced *before* overwriting it, so the old
  // storage objects can be cleaned up instead of left as orphans
  let existing: { cover_image_path: string | null; file_path: string | null } | null = null;
  if (id && (replacingCover || replacingFile)) {
    const { data } = await admin
      .from("project")
      .select("cover_image_path, file_path")
      .eq("id", id)
      .maybeSingle();
    existing = data;
  }

  const values: Record<string, unknown> = {
    title,
    description,
    tags,
    featured,
    link_url: linkUrl,
    sort_order: sortOrder,
    slug,
    updated_at: new Date().toISOString(),
  };

  if (replacingCover) {
    values.cover_image_path = await uploadFile("covers", coverFile as File);
  }
  if (replacingFile) {
    values.file_path = await uploadFile("files", attachedFile as File);
  }

  if (id) {
    const { error } = await admin.from("project").update(values).eq("id", id);
    if (error) throw error;
  } else {
    const { error } = await admin.from("project").insert(values);
    if (error) throw error;
  }

  if (replacingCover) await removeFile("covers", existing?.cover_image_path);
  if (replacingFile) await removeFile("files", existing?.file_path);

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

export async function deleteProject(formData: FormData) {
  const id = String(formData.get("id"));
  const admin = supabaseAdmin();

  const { data: existing } = await admin
    .from("project")
    .select("cover_image_path, file_path")
    .eq("id", id)
    .maybeSingle();

  const { error } = await admin.from("project").delete().eq("id", id);
  if (error) throw error;

  await Promise.all([
    removeFile("covers", existing?.cover_image_path),
    removeFile("files", existing?.file_path),
  ]);

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function saveProfile(formData: FormData) {
  const admin = supabaseAdmin();
  const id = String(formData.get("id"));
  const headline = String(formData.get("headline") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const story = String(formData.get("story") ?? "").trim();
  const nowStatus = String(formData.get("now_status") ?? "").trim();
  const skills = String(formData.get("skills") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const email = String(formData.get("email") ?? "").trim() || null;
  const github = String(formData.get("github") ?? "").trim();
  const linkedin = String(formData.get("linkedin") ?? "").trim();
  const twitter = String(formData.get("twitter") ?? "").trim();

  const socials: Record<string, string> = {};
  if (github) socials.github = github;
  if (linkedin) socials.linkedin = linkedin;
  if (twitter) socials.twitter = twitter;

  const values: Record<string, unknown> = {
    headline,
    bio,
    story,
    now_status: nowStatus,
    skills,
    email,
    socials,
    updated_at: new Date().toISOString(),
  };

  const heroImage = formData.get("hero_image") as File | null;
  const replacingHero = Boolean(heroImage && heroImage.size > 0);
  let oldHeroPath: string | null = null;
  if (replacingHero) {
    const { data: existing } = await admin
      .from("profile")
      .select("hero_image_path")
      .eq("id", id)
      .maybeSingle();
    oldHeroPath = existing?.hero_image_path ?? null;
    values.hero_image_path = await uploadFile("covers", heroImage as File);
  }

  const { error } = await admin.from("profile").update(values).eq("id", id);
  if (error) throw error;

  if (replacingHero) await removeFile("covers", oldHeroPath);

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

export async function uploadResume(formData: FormData) {
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) redirect("/admin");

  const admin = supabaseAdmin();

  // Only ever one resume: the site shows "the latest" anyway, so keeping the
  // superseded rows would leave stale PDFs sitting in public storage forever.
  const { data: previous } = await admin.from("resume").select("id, file_path");

  const path = await uploadFile("resumes", file);
  const { error } = await admin.from("resume").insert({
    file_path: path,
    original_filename: file.name,
  });
  if (error) throw error;

  if (previous?.length) {
    await admin
      .from("resume")
      .delete()
      .in("id", previous.map((r) => r.id));
    await admin
      .storage
      .from("resumes")
      .remove(previous.map((r) => r.file_path).filter(Boolean));
  }

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

export async function deleteResume(formData: FormData) {
  const id = String(formData.get("id"));
  const admin = supabaseAdmin();

  const { data: existing } = await admin
    .from("resume")
    .select("file_path")
    .eq("id", id)
    .maybeSingle();

  const { error } = await admin.from("resume").delete().eq("id", id);
  if (error) throw error;

  await removeFile("resumes", existing?.file_path);

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function addTestimonial(formData: FormData) {
  const quote = String(formData.get("quote") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim() || null;
  const sortOrder = Number(formData.get("sort_order") ?? 0) || 0;
  if (!quote || !author) redirect("/admin");

  const admin = supabaseAdmin();
  const { error } = await admin.from("testimonial").insert({
    quote,
    author,
    role,
    sort_order: sortOrder,
  });
  if (error) throw error;

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

export async function deleteTestimonial(formData: FormData) {
  const id = String(formData.get("id"));
  const admin = supabaseAdmin();
  const { error } = await admin.from("testimonial").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/admin");
  revalidatePath("/");
}
