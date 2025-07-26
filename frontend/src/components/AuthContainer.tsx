// src/components/AuthContainer.tsx
import React from 'react';
import Link from 'next/link';

interface AuthContainerProps {
  children: React.ReactNode;
  title: string;
  description?: string; // <-- 1. 添加了可选的 description 属性
}

const AuthContainer: React.FC<AuthContainerProps> = ({ children, title, description }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      <div 
        className="w-full max-w-md bg-background-secondary/50 backdrop-blur-xl border border-border-color rounded-2xl shadow-2xl p-8 animate-fade-in"
      >
        <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-4">
                <span className="text-3xl font-bold">
                    <span className="text-accent-color-1">Beat</span>
                    <span className="text-accent-color-2">MM</span>
                    <span className="text-white">Pro</span>
                </span>
            </Link>
            <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
            {/* 2. 如果 description 存在，就渲染它 */}
            {description && (
                <p className="text-text-secondary mt-2 text-sm">{description}</p>
            )}
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthContainer;
