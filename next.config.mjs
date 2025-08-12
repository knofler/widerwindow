/** @type {import('next').NextConfig} */
import path from 'path';

const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(process.cwd());
    return config;
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' }
    ]
  },
  typescript: {
    // Let the build succeed even if there are type errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Don’t block production builds on lint errors.
    ignoreDuringBuilds: true,
  },
};
export default nextConfig;
