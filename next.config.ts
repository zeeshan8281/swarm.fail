import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: __dirname },
  // Always revalidate the HTML doc so a fresh deploy shows immediately (hashed
  // assets under /_next/static stay immutable). ponytail: revisit if traffic grows.
  async headers() {
    return [{ source: "/", headers: [{ key: "Cache-Control", value: "no-cache, must-revalidate" }] }];
  },
};

export default nextConfig;
