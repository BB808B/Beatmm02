// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { dir } from 'i18next'; // 导入 dir 函数，用于根据语言设置 RTL/LTR

// --- 组件导入 ---
import SupabaseProvider from '@/providers/SupabaseProvider';
import UserProvider from '@/providers/UserProvider';
import Navbar from '@/components/Navbar';
import DynamicBackground from '@/components/DynamicBackground'; // 引入动态背景

// 导入获取当前语言的 hook (Next.js 13 App Router 推荐方式)
import { getLocale } from '@/lib/i18n'; // 我们将创建一个新的 i18n 工具文件

// --- 字体配置 (你的代码，非常棒，予以保留) ---
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-inter',
});

// --- 元数据 (你的代码，非常专业，予以保留) ---
export const metadata: Metadata = {
  title: 'BeatMM Pro - 缅甸高质量音乐越南鼓平台',
  description: '缅甸领先的音乐越南鼓流媒体平台，发现无尽的音乐世界，体验专业DJ的魅力。',
  keywords: '缅甸, 越南鼓, DJ, 音乐, 平台, BeatMM Pro, Myanmar, Vietnamese drum, Music, DJ, Platform',
  authors: [{ name: 'BeatMM Pro' }],
  themeColor: '#0A0A0A', // 更新为我们的主背景色
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  // 为PWA添加更多配置
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'BeatMM Pro',
  },
};

// --- 根布局 ---
export default async function RootLayout({
  children,
  params: { lang }, // 从路由参数中获取当前语言
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const locale = getLocale(); // 获取当前请求的语言环境

  return (
    <html lang={locale} dir={dir(locale)} className={`${inter.variable}`}>
      <body className="font-sans bg-background-primary text-text-primary antialiased">
        <DynamicBackground /> {/* 添加动态背景层 */}
        <SupabaseProvider>
          <UserProvider>
            <div className="relative z-10 flex flex-col min-h-screen">
              <Navbar /> {/* 在这里全局应用我们的超级导航栏 */}
              <main className="flex-grow">
                {children}
              </main>
              {/* 在这里为未来的全局播放器预留空间 */}
              {/* <GlobalPlayer /> */}
            </div>
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
