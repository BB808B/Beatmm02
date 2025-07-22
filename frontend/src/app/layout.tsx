import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BeatMM Pro - 缅甸高质量音乐越南鼓平台",
  description: "缅甸领先的音乐越南鼓流媒体平台，发现无尽的音乐世界，体验专业DJ的魅力。",
  keywords: "缅甸, 越南鼓, DJ, 音乐, 平台, BeatMM Pro, Myanmar, Vietnamese drum, Music, DJ, Platform",
  authors: [{ name: "BeatMM Pro" }],
  themeColor: "#000000",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no", // 确保移动端适配
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="my"> {/* 将语言设置为缅甸语，或根据用户选择动态设置 */}
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.className} bg-black text-white antialiased`}> {/* 添加 antialiased 字体抗锯齿 */}
        <div id="root" className="min-h-screen flex flex-col"> {/* flex-col 布局 */}
          {children}
        </div>
      </body>
    </html>
  );
}


