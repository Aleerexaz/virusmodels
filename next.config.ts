import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["recharts", "d3-shape", "d3-path", "d3-scale", "d3-array"],
};

export default nextConfig;
