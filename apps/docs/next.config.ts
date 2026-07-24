import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["@bhavya/mission-runtime"],
};

export default nextConfig;
