// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Myanmar DJ Platform - 缅甸DJ平台",
  description: "Discover the best Vietnamese drum DJ music in Myanmar",
  keywords: "Myanmar, DJ, Music, Vietnamese drum, Platform",
  authors: [{ name: "Myanmar DJ Platform" }],
  // viewport 已移至 _document.tsx
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <head>
        {/* 这些元标签已移至 _document.tsx */}
      </head>
      <body className={inter.className}>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  );
}
