-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query)
-- for a freshly created Supabase project.

create extension if not exists "pgcrypto";

create table if not exists profile (
  id uuid primary key default gen_random_uuid(),
  headline text not null default '',
  bio text not null default '',
  story text not null default '', -- the "life before work" narrative
  now_status text not null default '', -- short "what I'm doing right now" blurb
  hero_image_path text,
  skills text[] not null default '{}',
  email text,
  socials jsonb not null default '{}', -- e.g. {"github": "...", "linkedin": "..."}
  updated_at timestamptz not null default now()
);

-- idempotent for anyone who already ran an earlier version of this file
alter table profile add column if not exists story text not null default '';
alter table profile add column if not exists hero_image_path text;
alter table profile add column if not exists now_status text not null default '';

create table if not exists project (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null default '',
  cover_image_path text,
  tags text[] not null default '{}',
  featured boolean not null default false,
  link_url text,
  file_path text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists resume (
  id uuid primary key default gen_random_uuid(),
  file_path text not null,
  original_filename text,
  uploaded_at timestamptz not null default now()
);

create table if not exists testimonial (
  id uuid primary key default gen_random_uuid(),
  quote text not null default '',
  author text not null default '',
  role text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table profile enable row level security;
alter table project enable row level security;
alter table resume enable row level security;
alter table testimonial enable row level security;

-- Public (anon) read access. There are deliberately no insert/update/delete
-- policies: all writes go through the service-role key from the
-- password-gated /admin routes, which bypasses RLS entirely.
create policy "public read profile" on profile for select using (true);
create policy "public read project" on project for select using (true);
create policy "public read resume" on resume for select using (true);
create policy "public read testimonial" on testimonial for select using (true);

insert into profile (headline, bio, skills, email, socials)
select 'Your Headline', 'Write your bio here.', '{}', null, '{}'
where not exists (select 1 from profile);

-- Storage buckets for cover images, project files, and resume PDFs.
insert into storage.buckets (id, name, public)
values ('covers', 'covers', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('files', 'files', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', true)
on conflict (id) do nothing;

create policy "public read covers" on storage.objects for select using (bucket_id = 'covers');
create policy "public read files" on storage.objects for select using (bucket_id = 'files');
create policy "public read resumes" on storage.objects for select using (bucket_id = 'resumes');
