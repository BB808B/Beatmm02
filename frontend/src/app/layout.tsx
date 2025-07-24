// frontend/src/app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// 使用 Next.js 字体优化，加载所需的字重
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-inter', // 将字体作为 CSS 变量，更灵活
});

export const metadata: Metadata = {
  title: 'BeatMM Pro - 缅甸高质量音乐越南鼓平台',
  description: '缅甸领先的音乐越南鼓流媒体平台，发现无尽的音乐世界，体验专业DJ的魅力。',
  keywords: '缅甸, 越南鼓, DJ, 音乐, 平台, BeatMM Pro, Myanmar, Vietnamese drum, Music, DJ, Platform',
  authors: [{ name: 'BeatMM Pro' }],
  // 我们将在 globals.css 中定义更丰富的颜色主题
  themeColor: '#121212', 
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 默认语言设置为缅甸语 'my'。未来可以根据 i18n 动态修改。
    <html lang="my" className={`${inter.variable}`}>
      {/* 
        移除了手动的 <head> 标签，因为 Next.js 会自动处理 metadata 和字体。
        这更符合 Next.js App Router 的最佳实践，性能也更好。
      */}
      <body className="font-sans bg-background text-foreground antialiased">
        {/* 
          - 使用 'font-sans'，它将由我们在 tailwind.config.js 中定义的 --font-inter 变量驱动。
          - 使用 'bg-background' 和 'text-foreground'，这些是我们将在 globals.css 中定义的语义化颜色。
          - 移除了多余的 <div id="root">，保持结构简洁。
          - 整个 body 将作为 flex 容器，让子页面可以轻松实现复杂布局。
        */}
        {children}
      </body>
    </html>
  );
}
