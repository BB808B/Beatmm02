// src/app/layout.tsx
// 注意：此文件不应有 "use client" 指令，因为 metadata 导出只支持服务器组件

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // 导入全局样式，所有霓虹主题CSS应在此文件中

// 导入动态背景和霓虹边框组件 (这些组件内部可以有 "use client")
import FluidBackground from "@/components/FluidBackground";
import NeonBorders from "@/components/NeonBorders";

const inter = Inter({ subsets: ["latin"] });

// metadata 导出，只在服务器组件中有效
export const metadata: Metadata = {
  title: "Myanmar DJ Platform - 缅甸DJ平台",
  description: "Discover the best Vietnamese drum DJ music in Myanmar",
  keywords: "Myanmar, DJ, Music, Vietnamese drum, Platform",
  authors: [{ name: "Myanmar DJ Platform" }],
  // 添加主题色元标签
  themeColor: "#0f0c29",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <head>
        {/* Google Fonts 链接，放在 <head> 中是正确的 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Rajdhani:wght@300;500;700&display=swap" rel="stylesheet" />
      </head>
      {/* body 上应用全局主题类 */}
      <body className={`${inter.className} cyberpunk-theme`}>
        {/* 动态流体背景和霓虹灯装饰边框作为客户端组件，可以在这里使用 */}
        <FluidBackground />
        <NeonBorders />

        {/* 主要内容区域，通常用于限制宽度和居中 */}
        <div id="root" className="holographic-container">
          {children}
        </div>
      </body>
    </html>
  );
}
