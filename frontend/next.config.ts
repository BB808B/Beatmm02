import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  // 国际化配置 (i18n)
  i18n: {
    locales: ['zh', 'my', 'en'],
    defaultLocale: 'zh',
    localeDetection: false,
  },

  // 图片优化配置 (Images)
  images: {
    domains: ['localhost'],
  },
  
  // ESLint 配置
  eslint: {
    // 在构建期间忽略 ESLint 错误
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
