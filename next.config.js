/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export → `out/` folder (use `npx serve out`, not `next start`)
  output: 'export',
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
