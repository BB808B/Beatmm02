// frontend/src/components/AuthContainer.tsx
import React from 'react';
import Link from 'next/link';

interface AuthContainerProps {
  children: React.ReactNode;
  title: string;
}

const AuthContainer = ({ children, title }: AuthContainerProps) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      {/* 磨砂玻璃效果的容器 */}
      <div 
        className="w-full max-w-md bg-background-secondary/50 backdrop-blur-xl border border-border-color rounded-2xl shadow-2xl p-8 animate-fade-in"
      >
        <div className="text-center mb-8">
            <Link href="/" className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-purple-blue mb-2 inline-block">
                BeatMM Pro
            </Link>
            <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthContainer;
