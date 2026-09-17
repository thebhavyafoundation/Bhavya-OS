/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  poweredByHeader: false,
  serverExternalPackages: ['@bhavya/auth'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        "@libsql/client": "commonjs @libsql/client",
        "@libsql/win32-x64-msvc": "commonjs @libsql/win32-x64-msvc",
      });
    }
    return config;
  },
};
export default nextConfig;
