/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: 'https', hostname: '*.s3.amazonaws.com' }],
  },
  experimental: {
    workerThreads: true,
    webpackBuildWorker: false,
  },
};

module.exports = nextConfig;
