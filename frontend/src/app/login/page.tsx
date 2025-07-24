// frontend/src/app/login/page.tsx
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
// import { useTranslation } from 'react-i18next';
import DynamicBackground from '@/components/DynamicBackground'; // 引入动态背景
import AuthContainer from '@/components/AuthContainer'; // 引入UI容器

const LoginPage = () => {
  // const { t } = useTranslation();
  // 临时 t 函数以便于独立运行
  const t = (key: string) => ({
    'login_title': 'Welcome Back',
    'phone_login': 'Phone',
    'username_login': 'Username',
    'phone_number': 'Phone Number',
    'username': 'Username',
    'password': 'Password',
    'logging_in': 'Logging in...',
    'login': 'Login',
    'no_account_yet': "Don't have an account?",
    'sign_up_now': 'Sign up now',
    'forgot_password': 'Forgot Password?',
  }[key] || key);

  // --- 您的核心功能逻辑，100%保留 ---
  const [loginType, setLoginType] = useState<'phone' | 'username'>('phone');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = loginType === 'phone' ? { phone: identifier, password } : { username: identifier, password };
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Login successful:', data);
        // window.location.href = '/';
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error or server is down');
    } finally {
      setLoading(false);
    }
  };
  // --- 逻辑部分结束 ---

  // 输入框基础样式，增加了 focus 时的辉光效果
  const inputClass = "input-field focus:ring-2 focus:ring-accent-color-1 focus:border-transparent transition-all duration-300";

  return (
    <>
      <DynamicBackground />
      <AuthContainer title={t('login_title')}>
        
        {/* 登录方式切换按钮 (新设计) */}
        <div className="flex bg-background-primary p-1 rounded-lg mb-6">
          <button
            className={`w-1/2 py-2 rounded-md text-sm font-semibold transition-colors duration-300 ${loginType === 'phone' ? 'bg-accent-color-1 text-white' : 'text-text-secondary hover:bg-background-secondary'}`}
            onClick={() => setLoginType('phone')}
          >
            {t('phone_login')}
          </button>
          <button
            className={`w-1/2 py-2 rounded-md text-sm font-semibold transition-colors duration-300 ${loginType === 'username' ? 'bg-accent-color-1 text-white' : 'text-text-secondary hover:bg-background-secondary'}`}
            onClick={() => setLoginType('username')}
          >
            {t('username_login')}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder={loginType === 'phone' ? t('phone_number') : t('username')}
              className={inputClass}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder={t('password')}
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-400 text-sm text-center animate-pulse">{error}</p>}
          <button type="submit" className="btn-primary w-full !py-3" disabled={loading}>
            {loading ? t('logging_in') : t('login')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-text-secondary">
            {t('no_account_yet')}{' '}
            <Link href="/signup" className="font-semibold text-accent-color-1 hover:text-accent-color-2 transition-colors">
              {t('sign_up_now')}
            </Link>
          </p>
          <p className="mt-2 text-text-secondary">
            <Link href="/forgot-password" className="font-semibold text-accent-color-1 hover:text-accent-color-2 transition-colors">
              {t('forgot_password')}
            </Link>
          </p>
        </div>
      </AuthContainer>
    </>
  );
};

export default LoginPage;
