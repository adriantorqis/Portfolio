import type { Profile, Project, Testimonial } from "./types";

// Shown whenever the real data is empty — either Supabase isn't configured
// yet, or the tables genuinely have nothing in them. Once real rows exist
// (via /admin), they take over automatically; nothing here is persisted.
const now = new Date().toISOString();

export const DEMO_PROJECTS: Project[] = [
  {
    id: "demo-1",
    slug: "northline",
    title: "Northline — Banking App Redesign",
    description:
      "A ground-up redesign of a regional bank's mobile app, focused on cutting the seven-tap transfer flow down to two. Worked directly with the compliance team to keep every simplification defensible, then shipped a design system the internal team still uses for new features.\n\nResult: mobile transfers up 34% quarter over quarter, support tickets about \"where is X\" down by half.",
    tags: ["product design", "fintech", "ios"],
    featured: true,
    link_url: "https://example.com",
    file_path: null,
    cover_image_path: null,
    sort_order: 0,
    created_at: now,
    updated_at: now,
  },
  {
    id: "demo-2",
    slug: "fieldnote",
    title: "Fieldnote — Notes for Researchers",
    description:
      "A note-taking tool built for field researchers who need structure without friction — tag-as-you-type, offline-first sync, and a citation format that doesn't fight you. Designed and built the whole thing solo, from data model to the last pixel.\n\nUsed daily by three university research groups.",
    tags: ["web app", "design system", "react"],
    featured: true,
    link_url: "https://example.com",
    file_path: null,
    cover_image_path: null,
    sort_order: 1,
    created_at: now,
    updated_at: now,
  },
  {
    id: "demo-3",
    slug: "waypoint",
    title: "Waypoint — Wayfinding System",
    description:
      "A signage and wayfinding system for a 400,000 sq ft mixed-use building — icon set, floor-plan typography, and a color-coding logic that holds up whether you're colorblind, in a hurry, or both.\n\nDeployed across 6 floors. Zero reported \"I got lost\" complaints in the first year (someone actually tracked this).",
    tags: ["signage", "brand", "spatial"],
    featured: true,
    link_url: null,
    file_path: null,
    cover_image_path: null,
    sort_order: 2,
    created_at: now,
    updated_at: now,
  },
  {
    id: "demo-4",
    slug: "lumen-coffee",
    title: "Lumen Coffee — Brand & Packaging",
    description:
      "Full identity and packaging system for a small-batch coffee roaster: wordmark, bag design across five roast lines, and a shelf-talker system their baristas actually update themselves.\n\nSold out the first packaging run in 11 days.",
    tags: ["branding", "packaging"],
    featured: false,
    link_url: null,
    file_path: null,
    cover_image_path: null,
    sort_order: 3,
    created_at: now,
    updated_at: now,
  },
  {
    id: "demo-5",
    slug: "aperture",
    title: "Aperture — Photography Portfolio Template",
    description:
      "An open-source portfolio template for photographers, built to load fast on bad connections without flattening every image into mush. Now used by a few dozen photographers I've never met, which is the best kind of compliment.",
    tags: ["template", "open source", "next.js"],
    featured: false,
    link_url: "https://example.com",
    file_path: null,
    cover_image_path: null,
    sort_order: 4,
    created_at: now,
    updated_at: now,
  },
];

export const DEMO_PROFILE: Profile = {
  id: "demo-profile",
  headline: "Product designer who ships.",
  bio: "I'm a product designer and frontend developer who spends most days somewhere between Figma and a terminal. Over the last several years I've worked with startups and small teams to design and build interfaces people actually enjoy using — from onboarding flows to full design systems.\n\nI care about restraint: cutting the thing that doesn't need to be there, and making the thing that stays feel inevitable.",
  story:
    "Before any of this I was going to be a chef. Spent two years on a line, learned more about systems thinking from mise en place than from any design course.\n\nThese days it's still mostly prep work — the unglamorous stuff that makes the visible part look effortless. Outside of work: bad at climbing, good at oversteeping tea, currently rebuilding a turntable I definitely don't need.",
  now_status:
    "Heads-down on a design system for a seed-stage healthtech startup. Reading way too much about typography. Next up: finally shipping the personal-site rebuild you're looking at.",
  hero_image_path: null,
  skills: [
    "Product Design",
    "Design Systems",
    "React",
    "TypeScript",
    "Prototyping",
    "Brand Identity",
    "Motion",
    "Figma",
  ],
  email: "hello@example.com",
  socials: {
    github: "https://github.com/yourname",
    linkedin: "https://linkedin.com/in/yourname",
    twitter: "https://twitter.com/yourname",
  },
  updated_at: now,
};

export const DEMO_TESTIMONIALS: Testimonial[] = [
  {
    id: "demo-t1",
    quote:
      "Handed them a vague problem and a tight deadline. Got back something that made our compliance team relax and our users stop filing tickets. Rare combination.",
    author: "Dana Whitfield",
    role: "VP Product, Northline",
    sort_order: 0,
    created_at: now,
  },
  {
    id: "demo-t2",
    quote:
      "Works like an in-house hire from day one — asks the annoying questions early instead of after the build. The kind of collaborator who makes the whole team faster.",
    author: "Marcus Oyelaran",
    role: "Founder, Fieldnote",
    sort_order: 1,
    created_at: now,
  },
  {
    id: "demo-t3",
    quote:
      "Somehow made a 400,000 sq ft building legible. I still don't know how the color-coding logic works but I've never seen anyone get lost since.",
    author: "Priya Chandrasekaran",
    role: "Facilities Director",
    sort_order: 2,
    created_at: now,
  },
];
