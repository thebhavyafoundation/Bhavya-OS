/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  poweredByHeader: false,
  transpilePackages: ['@bhavya/events', '@bhavya/platform', '@bhavya/platform-ui', '@bhavya/types'],
};

export default nextConfig;
