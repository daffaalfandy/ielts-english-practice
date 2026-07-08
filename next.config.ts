import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: __dirname,
  },
  allowedDevOrigins: [
    "192.168.18.55",
    "macmini.local",
    "*.local",
  ],
  // The Claude Agent SDK spawns a subprocess at runtime — keep it external
  // and force the whole package into the standalone output.
  serverExternalPackages: ["@anthropic-ai/claude-agent-sdk"],
  // Glob covers the platform-specific native CLI packages too
  // (@anthropic-ai/claude-agent-sdk-linux-arm64-musl etc.)
  outputFileTracingIncludes: {
    "/api/**/*": ["./node_modules/@anthropic-ai/claude-agent-sdk*/**/*"],
  },
};

export default nextConfig;
