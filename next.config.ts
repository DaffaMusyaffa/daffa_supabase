import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ["img.freepik.com", "cdn.pixabay.com", "images.unsplash.com"],
  },
};

export default nextConfig;
