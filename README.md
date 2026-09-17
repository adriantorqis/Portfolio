# Portfolio

A static Next.js portfolio. No database, no admin login, no backend to keep
alive — content lives as JSON in `/content` and media lives in
`/public/media`, both committed to this repo. Every push rebuilds and
redeploys the site.

## Editing content

See **[content/README.md](content/README.md)** — adding a project, editing
your profile, or adding a testimonial is editing one file.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

- **Next.js** (App Router, static generation — the whole site prerenders
  at build time, there's no runtime data fetching)
- **Tailwind CSS v4** for styling, design tokens in `src/app/globals.css`
- **[Motion](https://motion.dev)** for the card/hero/scroll animations
- **Fraunces** (display) + **Inter** (body) via `next/font/google`

## Deploying

Push to the connected branch on GitHub — if this repo is linked to a
Vercel project, that's the whole deploy. No environment variables are
required; there's nothing left that reads `process.env`.
