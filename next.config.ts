import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Admin uploads (cover images, resumes, project files) go through
      // server actions; the 1MB default is too small for real images/PDFs.
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
