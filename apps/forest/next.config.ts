import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@bhavya/ui", "@bhavya/maps", "@bhavya/branding", "@bhavya/icons", "@bhavya/theme"]
};

export default nextConfig;
