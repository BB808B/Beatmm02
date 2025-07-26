/** @type {import('next').NextConfig} */
const nextConfig = {
  // 图片优化配置 (Images)
  // 我为你添加了 Unsplash 的域名，因为你的 mockTracks 中使用了它。
  // 未来如果你的封面图来自 Supabase，也需要在这里添加 Supabase 的域名。
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // 预留给 Supabase 的配置
      // {
      //   protocol: 'https',
      //   hostname: 'YOUR_SUPABASE_PROJECT_ID.supabase.co',
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
