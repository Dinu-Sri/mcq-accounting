import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["pg"],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
