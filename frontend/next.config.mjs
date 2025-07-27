/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用 Next.js 的国际化 (i18n) 配置
  i18n: {
    // 支持的所有语言列表
    locales: ['zh', 'en', 'my'], // 'zh' 代表中文, 'en' 代表英文, 'my' 代表缅文
    // 默认语言，当用户没有明确选择语言时使用
    defaultLocale: 'en', // 假设默认是英文，您可以根据实际需求修改
    // detection: { // 可选：启用语言检测，但为了简洁和手动控制，我们可以暂时不启用
    //   lookupCookie: 'NEXT_LOCALE',
    //   lookupLocalStorage: 'NEXT_LOCALE',
    //   order: ['cookie', 'localStorage', 'navigator'],
    //   caches: ['cookie', 'localStorage'],
    // },
  },

  // 图片优化配置 (Images)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // 预留给 Supabase 的配置
      // {
      //   protocol: 'https',
      //   hostname: 'YOUR_SUPABASE_PROJECT_ID.supabase.co', // 请替换为你的 Supabase 项目 ID
      // },
    ],
  },

  // ESLint 配置
  eslint: {
    // 在构建期间忽略 ESLint 错误 - 保留此项以便于开发
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
