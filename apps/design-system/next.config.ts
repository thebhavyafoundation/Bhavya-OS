/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  transpilePackages: ["@bhavya/runtime"],
};

export default nextConfig;
