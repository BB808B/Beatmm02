// src/app/layout.tsx
"use client"; // 添加此指令以使用客户端组件和钩子

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import FluidBackground from "@/components/FluidBackground"; // 新增动态背景组件
import NeonBorders from "@/components/NeonBorders"; // 新增霓虹边框组件
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
    margin: 0;
    padding: 0;
    font-family: 'Rajdhani', 'Segoe UI', sans-serif;
  }
  
  .cyberpunk-theme {
    background: transparent;
    position: relative;
    z-index: 1;
  }
  
  .holographic-container {
    position: relative;
    z-index: 2;
    padding: 20px;
    max-width: 1400px;
    margin: 0 auto;
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
    font-family: 'Orbitron', sans-serif;
  }
  
  /* 霓虹灯文字效果 */
  .neon-text {
    text-shadow: 
      0 0 5px rgba(106, 17, 203, 0.5),
      0 0 10px rgba(37, 117, 252, 0.3),
      0 0 15px rgba(255, 45, 117, 0.2);
  }
  
  /* 按钮霓虹效果 */
  .neon-btn {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 12px 24px;
    color: white;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    box-shadow: 0 0 10px rgba(106, 17, 203, 0.3);
    font-family: 'Rajdhani', sans-serif;
    font-weight: 500;
  }
  
  .neon-btn:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-3px);
    box-shadow: 0 0 20px rgba(37, 117, 252, 0.5);
  }
  
  .neon-btn:active {
    transform: translateY(1px);
  }
  
  /* 状态指示器 */
  .status-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #00ff9d;
    box-shadow: 0 0 10px #00ff9d;
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(0, 255, 157, 0.5); }
    70% { box-shadow: 0 0 0 10px rgba(0, 255, 157, 0); }
    100% { box-shadow: 0 0 0 0 rgba(0, 255, 157, 0); }
  }
  
  /* 响应式调整 */
  @media (max-width: 768px) {
    .glass-panel {
      padding: 15px;
      margin-bottom: 15px;
    }
    
    .section-title {
      font-size: 1.5rem;
    }
    
    .neon-btn {
      padding: 10px 15px;
      font-size: 0.9rem;
    }
    
    .holographic-container {
      padding: 10px;
    }
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
        
        {/* 霓虹灯装饰边框 */}
        <NeonBorders />
        
        <div id="root" className="holographic-container">
          {children}
        </div>
      </body>
    </html>
  );
}
