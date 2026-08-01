/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable body size limits for upload speed testing on API routes where possible
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
};

export default nextConfig;
