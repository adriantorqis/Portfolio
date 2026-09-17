import type { NextConfig } from "next";

// Content and media are static — everything under /content and /public/media
// is committed to the repo, so next/image needs no remotePatterns (that was
// only ever for optimizing Supabase-hosted URLs) and there are no server
// actions left to size-limit (that was only ever for admin uploads).
const nextConfig: NextConfig = {};

export default nextConfig;
