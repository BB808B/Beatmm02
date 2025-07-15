'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';
import NavbarComponent from '@/components/Navbar';
import { Translations } from '@/types'; // 确保 Translations 类型正确导入

export default function LoginPage() {
  const [currentLang, setCurrentLang] = useState('zh');
  const [translations, setTranslations] = useState<Translations | null>(null);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const response = await fetch(`/locales/${currentLang}/common.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error('Failed to load translations:', error);
        // Fallback translations for essential auth fields
        setTranslations({
          title: 'BeatMM Pro',
          nav: {
            home: 'Home', music: 'Music', dj: 'DJ', live: 'Live', ranking: 'Ranking',
            profile: 'Profile', login: 'Login', register: 'Register', logout: 'Logout', rules: 'Rules'
          },
          home: {
            welcome: 'Welcome', subtitle: 'Discover amazing music', featured: 'Featured', trending: 'Trending', newReleases: 'New Releases'
          },
          auth: {
            loginTitle: 'Welcome to Login',
            phone: 'Phone Number',
            password: 'Password',
            loginButton: 'Login',
            forgotPassword: 'Forgot Password?',
            noAccount: 'No account?',
            registerNow: 'Register Now',
            loginSuccess: 'Login successful!',
            loginError: 'Login failed. Please check your phone number or password.',
            phoneRequired: 'Phone number is required',
            passwordRequired: 'Password is required'
          },
          player: {
            play: 'Play', pause: 'Pause', next: 'Next', previous: 'Previous',
            volume: 'Volume', shuffle: 'Shuffle', repeat: 'Repeat'
          },
          profile: {
            myProfile: 'My Profile', myMusic: 'My Music', myWallet: 'My Wallet',
            settings: 'Settings', djApplication: 'DJ Application', balance: 'Balance',
            recharge: 'Recharge', withdraw: 'Withdraw'
          },
          common: {
            search: 'Search', submit: 'Submit', cancel: 'Cancel', confirm: 'Confirm',
            save: 'Save', edit: 'Edit', delete: 'Delete', loading: 'Loading...',
            error: 'Error', success: 'Success'
          },
          // 完整的回退 translations.rulesPage 对象
          rulesPage: {
            title: 'Platform Rules',
            subtitle: 'Read our rules.',
            section1Title: 'Terms',
            section1Item1: 'Item 1', section1Item2: 'Item 2', section1Item3: 'Item 3', section1Item4: 'Item 4',
            section1Item5: 'Item 5', section1Item6: 'Item 6', section1Item7: 'Item 7', section1Item8: 'Item 8',
            section2Title: 'Tipping',
            section2Item1: 'Item 1', section2Item2: 'Item 2', section2Item3: 'Item 3', section2Item4: 'Item 4',
            section2Item5: 'Item 5', section2Item6: 'Item 6', section2Item7: 'Item 7',
            section3Title: 'DJ Cert.',
            section3Item1: 'Item 1', section3Item2: 'Item 2', section3Item3: 'Item 3',
            section3Item4Title: 'Permissions:',
            section3Item4Perm1: 'Perm 1', section3Item4Perm2: 'Perm 2', section3Item4Perm3: 'Perm 3', section3Item4Perm4: 'Perm 4',
            section3Item5: 'Item 5', section3Item6: 'Item 6', section3Item7: 'Item 7',
            importantReminderTitle: 'Important',
            importantReminderText1: 'Text 1', importantReminderText2: 'Text 2', importantReminderText3: 'Text 3'
          }
        });
      }
    };

    loadTranslations();
  }, [currentLang]);

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!phone) {
      setError(translations?.auth?.phoneRequired || 'Phone number is required');
      return;
    }
    if (!password) {
      setError(translations?.auth?.passwordRequired || 'Password is required');
      return;
    }

    setLoading(true);
    try {
      // 模拟 API 调用
      const response = await new Promise(resolve => setTimeout(() => {
        // 这里的逻辑需要替换为实际的后端登录API调用
        if (phone === '123456789' && password === 'password123') { // 示例验证
          resolve({ success: true, message: translations?.auth?.loginSuccess || 'Login successful!' });
        } else {
          resolve({ success: false, message: translations?.auth?.loginError || 'Login failed. Please check your phone number or password.' });
        }
      }, 1500));

      const data = response as { success: boolean; message: string; };

      if (data.success) {
        console.log(data.message);
        // 实际应用中会保存用户token，并重定向到个人中心或首页
        router.push('/profile'); // 假设存在 /profile 页面
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(translations?.common?.error || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (!translations) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        {translations?.common?.loading || 'Loading...'}
      </div>
    );
  }

  return (
    <>
      <NavbarComponent
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        translations={translations}
      />

      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4 pt-24 md:pt-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="glass-panel neon-border p-8 rounded-xl shadow-2xl w-full max-w-md"
        >
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl font-extrabold text-center mb-6
                        text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent"
          >
            <FaSignInAlt className="inline-block mr-3" />
            {translations.auth.loginTitle}
          </motion.h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative"
            >
              <label htmlFor="phone" className="block text-gray-300 text-sm font-bold mb-2">
                {translations.auth.phone}
              </label>
              <div className="flex items-center bg-gray-800 rounded-lg border border-gray-700 focus-within:border-primary transition-all duration-300">
                <FaUser className="text-gray-400 ml-4 mr-2" />
                <input
                  type="tel"
                  id="phone"
                  className="flex-grow p-3 bg-transparent text-white focus:outline-none placeholder-gray-500"
                  placeholder={translations.auth.phone}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="relative"
            >
              <label htmlFor="password" className="block text-gray-300 text-sm font-bold mb-2">
                {translations.auth.password}
              </label>
              <div className="flex items-center bg-gray-800 rounded-lg border border-gray-700 focus-within:border-primary transition-all duration-300">
                <FaLock className="text-gray-400 ml-4 mr-2" />
                <input
                  type="password"
                  id="password"
                  className="flex-grow p-3 bg-transparent text-white focus:outline-none placeholder-gray-500"
                  placeholder={translations.auth.password}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </motion.div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm text-center"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full neon-button py-3 rounded-lg font-bold text-lg flex items-center justify-center
                          transition-all duration-300
                          disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <FaSignInAlt className="mr-2" />
              )}
              {loading ? (translations.common.loading || 'Loading...') : (translations.auth.loginButton || 'Login')}
            </motion.button>
          </form>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-6 text-center text-gray-400 text-sm"
          >
            <a href="#" className="text-primary hover:underline transition-colors duration-200">
              {translations.auth.forgotPassword}
            </a>
            <p className="mt-3">
              {translations.auth.noAccount}{' '}
              <a href="/register" className="text-accent hover:underline transition-colors duration-200">
                {translations.auth.registerNow}
              </a>
            </p>
          </motion.div>
        </motion.div>
      </main>
    </>
  );
}
