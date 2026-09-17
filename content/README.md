# Editing this site

Everything here is a plain file. No login, no database, no dashboard —
edit a file, `git push`, and the live site updates in about a minute
(Vercel rebuilds on every push to the connected branch).

## Add a project

Create a new file in `content/projects/`, named after the slug
(e.g. `content/projects/my-new-thing.json`):

```json
{
  "slug": "my-new-thing",
  "title": "My New Thing",
  "description": "One or two sentences. Use \n\n for a paragraph break — the detail panel splits on it.",
  "tags": ["design", "react"],
  "featured": false,
  "link_url": "https://example.com",
  "file_path": "/media/projects/my-new-thing/case-study.pdf",
  "cover_image_path": "/media/projects/my-new-thing/cover.jpg",
  "cover_media_kind": "image",
  "cover_poster_path": null,
  "sort_order": 1
}
```

Only `slug` and `title` are required — everything else can be `null`,
`""`, `[]`, or omitted entirely and the site fills in a sane default.

**`cover_media_kind`** is one of `"image"`, `"gif"`, or `"video"` — it
controls how the cover renders (the video player, muted/looped/autoplay-
in-view, is only used for `"video"`). It does **not** get guessed from the
file extension, so set it to match whatever file `cover_image_path` points
at.

**`cover_poster_path`** is only used for `"video"` covers — a still frame
shown before the video starts playing. Leave it `null` for images and
GIFs. If you have a video but no poster handy, `null` is fine too — it
just falls back to the browser's own first-frame preview.

**Media files** go under `public/media/projects/<slug>/` and are referenced
by their path starting with `/media/...` (root-relative — `public/` itself
is never part of the URL). Any format `next/image` or `<video>` can handle:
JPG/PNG/WebP/AVIF for images, GIF for GIFs, MP4/WebM for video.

**Sort order**: projects are sorted by `sort_order` ascending, then by
title. Lower numbers come first.

To remove a project, delete its file (and its media folder, if you want to
reclaim the space — nothing else references it).

## Edit the profile

`content/profile.json` — headline, bio, the "currently" line, skills,
email, socials, hero portrait, résumé:

```json
{
  "headline": "Adrian",
  "bio": "First paragraph.\n\nSecond paragraph.",
  "story": "The \"off the clock\" section.",
  "now_status": "What you're heads-down on right now.",
  "hero_image_path": "/media/profile/hero.jpg",
  "skills": ["Product Design", "React", "TypeScript"],
  "email": "you@example.com",
  "socials": { "github": "https://github.com/you", "linkedin": "https://linkedin.com/in/you" },
  "resume": { "file_path": "/media/resume.pdf", "original_filename": "Your Name — Resume.pdf" }
}
```

An empty `""` for `bio`/`story`/`now_status` shows a friendly placeholder
on the live site rather than a blank section — you don't need to delete
sections you haven't written yet.

## Add a testimonial

`content/testimonials.json` is a plain array — append an entry:

```json
{ "quote": "Handed them a vague problem...", "author": "Dana Whitfield", "role": "VP Product, Northline", "sort_order": 0 }
```

The whole "Endorsements" section on the site disappears automatically
when this array is empty — it starts empty on purpose rather than shipping
placeholder quotes as if they were real.

## Why JSON and not a CMS

This is deliberately the simplest thing that works: content lives in git
right next to the code, there's nothing to keep paid/awake/patched, and
"add a project" is one new file. If editing raw JSON ever gets annoying,
the natural upgrade is a local script that scaffolds a new project file
from a few prompts — ask for that if you want it.
