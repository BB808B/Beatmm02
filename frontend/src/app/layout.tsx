// src/app/layout.tsx
"use client"; // 添加此指令以使用客户端组件和钩子

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import FluidBackground from "@/components/FluidBackground"; // 新增动态背景组件
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Myanmar DJ Platform - 缅甸DJ平台",
  description: "Discover the best Vietnamese drum DJ music in Myanmar",
  keywords: "Myanmar, DJ, Music, Vietnamese drum, Platform",
  authors: [{ name: "Myanmar DJ Platform" }],
};

// 添加霓虹主题CSS变量
const neonTheme = `
  :root {
    --primary: #6a11cb;
    --secondary: #2575fc;
    --accent: #ff2d75;
    --success: #00ff9d;
    --glass-bg: rgba(30, 30, 46, 0.6);
    --text-light: rgba(255, 255, 255, 0.9);
    --neon-glow: 0 0 10px rgba(106, 17, 203, 0.7), 0 0 20px rgba(37, 117, 252, 0.5);
  }
  
  body {
    background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
    color: var(--text-light);
    min-height: 100vh;
    overflow-x: hidden;
  }
  
  .glass-panel {
    background: var(--glass-bg);
    backdrop-filter: blur(12px);
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: var(--neon-glow), 0 10px 30px rgba(0, 0, 0, 0.3);
    padding: 25px;
    margin-bottom: 25px;
    position: relative;
    overflow: hidden;
    transition: transform 0.3s ease;
  }
  
  .glass-panel:hover {
    transform: translateY(-5px);
  }
  
  .section-title {
    font-size: 1.8rem;
    margin-bottom: 20px;
    background: linear-gradient(90deg, var(--primary), var(--accent));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    display: inline-block;
    font-weight: 700;
    text-shadow: 0 0 5px rgba(106, 17, 203, 0.5);
  }
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 动态添加霓虹主题样式
  useEffect(() => {
    if (typeof document !== "undefined") {
      const style = document.createElement("style");
      style.innerHTML = neonTheme;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, []);

  return (
    <html lang="zh">
      <head>
        {/* 添加霓虹主题的元标签 */}
        <meta name="theme-color" content="#0f0c29" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Rajdhani:wght@300;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.className} cyberpunk-theme`}>
        {/* 动态流体背景 */}
        <FluidBackground />
        
        {/* 霓虹灯顶部装饰 */}
        <div className="neon-top-bar"></div>
        
        <div id="root" className="holographic-container">
          {children}
        </div>
        
        {/* 霓虹灯底部装饰 */}
        <div className="neon-bottom-bar"></div>
      </body>
    </html>
  );
}
