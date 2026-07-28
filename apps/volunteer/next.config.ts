import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@bhavya/ui", "@bhavya/branding", "@bhavya/icons", "@bhavya/theme", "@bhavya/content-core"]
};

export default nextConfig;
