/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  poweredByHeader: false,
  transpilePackages: ['@bhavya/events', '@bhavya/platform', '@bhavya/platform-ui', '@bhavya/types'],
  serverExternalPackages: ['@bhavya/auth'],
  webpack: (config, { isServer }) => {
    if (!config.resolve.extensions.includes('.ts')) {
      config.resolve.extensions.push('.ts');
    }
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
