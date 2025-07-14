import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  i18n: {
    locales: ['zh', 'my', 'en'],
    defaultLocale: 'zh',
    localeDetection: false,
  },
  images: {
    domains: ['localhost'],
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
// next.config.js
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ 忽略 ESLint 构建错误
  },
};

module.exports = nextConfig;
