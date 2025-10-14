/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Optimize images
  images: {
    unoptimized: true,
  },
  // Exclude mock-server from build
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/mock-server/**']
    };
    return config;
  },
}

module.exports = nextConfig;
