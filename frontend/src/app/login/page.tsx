'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';
import NavbarComponent from '@/components/Navbar';
import { TranslationType, Language } from '@/types';

export default function LoginPage() {
  const [currentLang, setCurrentLang] = useState<Language>('zh');
  const [translations, setTranslations] = useState<TranslationType | null>(null);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const response = await fetch(`/locales/${currentLang}.json`);
        if (!response.ok) {
          throw new Error('Failed to load translations');
        }
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error('Failed to load translations:', error);
        // Fallback or default translations if loading fails
        setTranslations({
          common: {
            loading: '加载中...',
            subscribe: '立即订阅',
            freeTrial: '免费试用',
            popular: '热门',
            search: '搜索'
          },
          navbar: {
            home: '首页',
            music: '音乐',
            radio: '电台',
            charts: '排行榜',
            rules: '规则'
          },
          nav: {
            home: '首页',
            music: '音乐',
            radio: '电台',
            charts: '排行榜',
            rules: '规则',
            login: '登录',
            dj: 'DJ',
            live: '直播',
            ranking: '排名',
            profile: '个人资料',
            register: '注册',
            logout: '登出',
            settings: '设置'
          },
          hero: {
            title: 'BeatMM Pro',
            subtitle: '缅甸领先的音乐流媒体平台，发现无尽音乐世界'
          },
          pricing: {
            title: '选择您的套餐',
            basic: '基础套餐',
            premium: '高级套餐',
            vip: 'VIP套餐',
            month: '月',
            features: {
              unlimited: '无限音乐流',
              hq: '高品质音质',
              offline: '离线收听',
              exclusive: '独家内容',
              early: '抢先体验新歌'
            },
            mostPopular: '最受欢迎'
          },
          login: {
            welcome: '欢迎回到缅甸DJ平台',
            phonePlaceholder: '请输入手机号',
            passwordPlaceholder: '请输入密码',
            forgotPassword: '忘记密码?',
            loginButton: '登录',
            orLoginWith: '或使用以下方式登录',
            noAccount: '还没有账号？',
            registerNow: '立即注册',
            phoneOrPasswordError: '手机号或密码错误',
            loginFailed: '登录失败，请重试'
          }
        });
      }
    };

    loadTranslations();
  }, [currentLang]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 模拟登录请求
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (phone === '123456789' && password === 'password') {
        router.push('/');
      } else {
        setError(translations?.login?.phoneOrPasswordError || '手机号或密码错误');
      }
    } catch (err) {
      setError(translations?.login?.loginFailed || '登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (!translations) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">加载中...</div>
      </div>
    );
  }

  const loginTranslations = translations.login;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <NavbarComponent 
        currentLang={currentLang} 
        onLanguageChange={setCurrentLang}
        translations={translations}
      />
      
      <div className="flex items-center justify-center min-h-screen pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md mx-4 border border-white/20"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">{translations.nav.login}</h1>
            <p className="text-gray-300">{loginTranslations?.welcome}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                手机号
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={loginTranslations?.phonePlaceholder}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                密码
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={loginTranslations?.passwordPlaceholder}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <FaSignInAlt />
                  {loginTranslations?.loginButton}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-300">
              {loginTranslations?.noAccount}{' '}
              <a href="/register" className="text-purple-400 hover:text-purple-300 transition-colors">
                {loginTranslations?.registerNow}
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
