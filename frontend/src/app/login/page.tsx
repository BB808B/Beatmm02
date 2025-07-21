// file: frontend/src/app/login/page.tsx
'use client';
import React from 'react';
import Navbar from '@/components/Navbar';

const LoginPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <h1 className="text-4xl font-bold text-white mb-8">Log In to BeatMM Pro</h1>
          {/* 在这里可以添加登录表单 */}
          <p className="text-gray-400">Login form will be here.</p>
        </div>
      </main>
    </div>
  );
};
export default LoginPage;
