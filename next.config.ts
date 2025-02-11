import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  rules: {
    "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
  /* config options here */
};

export default nextConfig;
