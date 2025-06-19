/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
module.exports = {
  webpack: (config) => {
    config.module.exprContextCritical = false
    return config
  }
}