// src/app/login/page.tsx
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import DynamicBackground from '@/components/DynamicBackground';
import AuthContainer from '@/components/AuthContainer';
import { Phone, User, Lock, LogIn, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LoginPage = () => {
  const t = (key: string) => ({
    'welcome_back': 'Welcome Back!',
    'login_to_continue': 'Login with your Phone or Username.',
    'phone': 'Phone',
    'username': 'Username',
    'phone_number': 'Phone Number',
    'password': 'Password',
    'logging_in': 'Logging in...',
    'login': 'Login',
    'no_account_yet': "Don't have an account?",
    'sign_up_now': 'Sign up now',
    'forgot_password': 'Forgot Password?',
    'mock_error': 'This is a mock error for UI demonstration.',
  }[key] || key);

  // --- 核心逻辑 (纯前端，无后端调用) ---
  const [loginType, setLoginType] = useState<'phone' | 'username'>('phone');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 模拟API调用和延迟
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 模拟一个登录失败的场景来展示错误信息UI
    if (identifier !== 'test' || password !== 'test') {
      setError(t('mock_error'));
    } else {
      // 模拟成功 (在真实场景中会跳转)
      alert('Mock login successful!');
    }
    setLoading(false);
  };

  return (
    <>
      <DynamicBackground />
      <AuthContainer title={t('welcome_back')} description={t('login_to_continue')}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 登录方式切换按钮 (使用 framer-motion 增强) */}
          <div className="flex bg-background-primary p-1 rounded-lg mb-8 relative">
            <button
              className={`w-1/2 py-2.5 rounded-md text-sm font-semibold z-10 transition-colors ${loginType === 'phone' ? 'text-white' : 'text-text-secondary hover:text-white'}`}
              onClick={() => setLoginType('phone')}
            >
              {t('phone')}
            </button>
            <button
              className={`w-1/2 py-2.5 rounded-md text-sm font-semibold z-10 transition-colors ${loginType === 'username' ? 'text-white' : 'text-text-secondary hover:text-white'}`}
              onClick={() => setLoginType('username')}
            >
              {t('username')}
            </button>
            <motion.div
              layoutId="active-login-tab"
              className="absolute top-1 bottom-1 h-auto w-1/2 bg-accent-color-1 rounded-md"
              initial={false}
              animate={{ x: loginType === 'phone' ? 0 : '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={loginType}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                {loginType === 'phone' ? 
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} /> :
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
                }
                <input
                  type={loginType === 'phone' ? 'tel' : 'text'}
                  placeholder={loginType === 'phone' ? t('phone_number') : t('username')}
                  className="input-field pl-12"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </motion.div>
            </AnimatePresence>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
              <input
                type="password"
                placeholder={t('password')}
                className="input-field pl-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="text-right text-sm">
              <Link href="/forgot-password" className="font-semibold text-accent-color-1 hover:text-accent-color-2 transition-colors">
                {t('forgot_password')}
              </Link>
            </div>

            {error && <p className="text-red-400 text-sm text-center animate-pulse">{error}</p>}

            <button type="submit" className="btn-primary w-full !py-3 flex items-center justify-center gap-2" disabled={loading}>
              {loading && <Loader2 className="animate-spin" size={20} />}
              {loading ? t('logging_in') : <><LogIn size={18} /> {t('login')}</>}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <p className="text-text-secondary">
              {t('no_account_yet')}{' '}
              <Link href="/signup" className="font-semibold text-accent-color-1 hover:text-accent-color-2 transition-colors">
                {t('sign_up_now')}
              </Link>
            </p>
          </div>
        </motion.div>
      </AuthContainer>
    </>
  );
};

export default LoginPage;
