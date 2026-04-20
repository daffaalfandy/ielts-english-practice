import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: [
    "192.168.18.55",
    "macmini.local",
    "*.local",
  ],
};

export default nextConfig;
