'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPalette, FaLanguage, FaKey, FaTrash } from 'react-icons/fa';
import NavbarComponent from '@/components/Navbar';
import { Language, TranslationType } from '@/types';

export default function SettingsPage() {
  const [currentLang, setCurrentLang] = useState<Language>('zh');
  const [translations, setTranslations] = useState<TranslationType | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark'); // Assuming a default dark theme

  useEffect(() => {
    // Load theme from localStorage if available
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      // Default to dark if no theme is saved
      document.documentElement.classList.add('dark');
    }

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
          settings: {
            title: '设置',
            subtitle: '个性化您的应用体验和管理您的账户。',
            appearance: '外观',
            theme: '主题',
            language: '语言',
            accountManagement: '账户管理',
            changePassword: '更改密码',
            deleteAccount: '删除账户',
            darkMode: '深色模式',
            lightMode: '浅色模式'
          }
        });
      } finally {
        setLoading(false);
      }
    };

    loadTranslations();
  }, [currentLang]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    document.documentElement.classList.toggle('light', newTheme === 'light'); // Ensure light class is also toggled
  };

  if (loading || !translations) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">加载中...</div>
      </div>
    );
  }

  const settingsContent = translations.settings;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white' : 'bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 text-gray-800'}`}>
      <NavbarComponent 
        currentLang={currentLang} 
        onLanguageChange={setCurrentLang}
        translations={translations}
      />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white/50 border-gray-300'} backdrop-blur-lg rounded-2xl p-8 mb-8 border`}
        >
          <h1 className="text-4xl font-bold mb-4">{settingsContent?.title}</h1>
          <p className="text-lg text-gray-300">
            {settingsContent?.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Appearance Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white/50 border-gray-300'} backdrop-blur-lg rounded-2xl p-8 border`}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <FaPalette className="mr-3 text-purple-400" /> {settingsContent?.appearance}
            </h2>
            <div className="space-y-4">
              {/* Theme Toggle */}
              <div>
                <h3 className="text-xl font-semibold mb-3">{settingsContent?.theme}</h3>
                <div className="flex space-x-4">
                  <button
                    onClick={toggleTheme}
                    className={`px-6 py-2 rounded-full transition-all duration-300 ${
                      theme === 'dark' 
                        ? 'bg-purple-600 text-white hover:bg-purple-700' 
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {theme === 'dark' ? settingsContent?.darkMode : settingsContent?.lightMode}
                  </button>
                </div>
              </div>

              {/* Language Selection */}
              <div>
                <h3 className="text-xl font-semibold mb-3">{settingsContent?.language}</h3>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setCurrentLang('zh')}
                    className={`px-4 py-2 rounded-full transition-all duration-200 ${
                      currentLang === 'zh' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-white/10 dark:text-white'
                    }`}
                  >
                    中文
                  </button>
                  <button
                    onClick={() => setCurrentLang('en')}
                    className={`px-4 py-2 rounded-full transition-all duration-200 ${
                      currentLang === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-white/10 dark:text-white'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setCurrentLang('my')}
                    className={`px-4 py-2 rounded-full transition-all duration-200 ${
                      currentLang === 'my' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-white/10 dark:text-white'
                    }`}
                  >
                    မြန်မာ
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Account Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white/50 border-gray-300'} backdrop-blur-lg rounded-2xl p-8 border`}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <FaUser className="mr-3 text-cyan-400" /> {settingsContent?.accountManagement}
            </h2>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <div className="flex items-center space-x-3">
                  <FaKey className="text-green-400" />
                  <span className="text-white">{settingsContent?.changePassword}</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>
              
              <button className="w-full flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <div className="flex items-center space-x-3">
                  <FaTrash className="text-red-400" />
                  <span className="text-white">{settingsContent?.deleteAccount}</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
