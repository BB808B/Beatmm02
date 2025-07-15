'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  FaUserCircle,
  FaMusic,
  FaWallet,
  FaCog,
  FaMicrophoneAlt,
  FaSignOutAlt,
  FaEdit,
  FaMoneyBillWave,
  FaPlus,
  FaMinus
} from 'react-icons/fa';
import NavbarComponent from '@/components/Navbar';
import { Translations } from '@/types'; // 确保 Translations 类型正确导入

export default function ProfilePage() {
  const [currentLang, setCurrentLang] = useState('zh');
  const [translations, setTranslations] = useState<Translations | null>(null);
  const [loading, setLoading] = useState(true);
  // 模拟用户数据，实际中会从后端获取
  const [userData, setUserData] = useState({
    username: 'BeatMM User',
    phone: '1234567890',
    isDj: true,
    balance: 5200.75, // 假设余额
  });
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
        // Fallback translations
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
            loginTitle: 'Login', phone: 'Phone', password: 'Password', loginButton: 'Login',
            forgotPassword: 'Forgot Password?', noAccount: 'No account?', registerNow: 'Register Now',
            registerTitle: 'Register', confirmPassword: 'Confirm Password', registerButton: 'Register',
            hasAccount: 'Has account?', loginNow: 'Login Now',
            loginSuccess: 'Login successful!', loginError: 'Login failed.',
            phoneRequired: 'Phone required', passwordRequired: 'Password required',
            confirmPasswordRequired: 'Confirm password required', passwordMismatch: 'Passwords mismatch',
            registerSuccess: 'Register successful!', registerError: 'Register failed.'
          },
          player: {
            play: 'Play', pause: 'Pause', next: 'Next', previous: 'Previous',
            volume: 'Volume', shuffle: 'Shuffle', repeat: 'Repeat'
          },
          profile: {
            myProfile: 'My Profile', editProfile: 'Edit Profile', myMusic: 'My Music',
            myWallet: 'My Wallet', balance: 'Balance', recharge: 'Recharge', withdraw: 'Withdraw',
            settings: 'Settings', djApplication: 'DJ Application', logout: 'Logout',
            phone: 'Phone Number', username: 'Username',
            greeting: 'Hello, {username}!', djStatus: 'DJ Status:', notDj: 'Not Certified', isDj: 'Certified'
          },
          common: {
            search: 'Search', submit: 'Submit', cancel: 'Cancel', confirm: 'Confirm',
            save: 'Save', edit: 'Edit', delete: 'Delete', loading: 'Loading...',
            error: 'Error', success: 'Success', viewDetails: 'View Details'
          },
          rulesPage: { // Minimal fallback for rulesPage
            title: 'Platform Rules', subtitle: 'Read our rules.', section1Title: 'Terms',
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
      } finally {
        setLoading(false);
      }
    };

    loadTranslations();
  }, [currentLang]);

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
  };

  const handleLogout = () => {
    // 实际的退出登录逻辑：清除 token/session，并重定向到登录页
    console.log('User logged out');
    router.push('/login');
  };

  const menuItems = [
    {
      icon: FaMusic,
      label: translations?.profile?.myMusic || '我的音乐',
      path: '/profile/music', // 假设有对应的子页面
      color: 'text-primary'
    },
    {
      icon: FaWallet,
      label: translations?.profile?.myWallet || '我的钱包',
      path: '/profile/wallet', // 假设有对应的子页面
      color: 'text-secondary'
    },
    {
      icon: FaCog,
      label: translations?.profile?.settings || '设置',
      path: '/settings', // 假设有对应的设置页面
      color: 'text-accent'
    },
    {
      icon: FaMicrophoneAlt,
      label: translations?.profile?.djApplication || 'DJ认证申请',
      path: '/dj-application', // 假设有对应的DJ认证页面
      color: 'text-fuchsia-400' // 可以自定义颜色
    },
  ];

  if (loading || !translations) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        {translations?.common?.loading || 'Loading...'}
      </div>
    );
  }

  // 格式化余额，假定MMK是货币单位
  const formattedBalance = new Intl.NumberFormat(currentLang === 'zh' ? 'my-MM' : 'en-US', {
    style: 'currency',
    currency: 'MMK',
    minimumFractionDigits: 2
  }).format(userData.balance);

  return (
    <>
      <NavbarComponent
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        translations={translations}
      />

      <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white pt-24 pb-10">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header Section - User Info */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-panel neon-border p-6 rounded-xl shadow-lg mb-8 flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6"
          >
            <FaUserCircle className="text-gray-400 w-24 h-24 md:w-32 md:h-32 mb-4 md:mb-0" />
            <div className="flex-grow text-center md:text-left">
              <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-2">
                {translations.profile.greeting.replace('{username}', userData.username)}
              </h2>
              <p className="text-gray-300 text-lg mb-1">
                {translations.profile.phone}: {userData.phone}
              </p>
              <p className="text-gray-300 text-lg">
                {translations.profile.djStatus}{' '}
                <span className={`font-bold ${userData.isDj ? 'text-primary' : 'text-gray-500'}`}>
                  {userData.isDj ? translations.profile.isDj : translations.profile.notDj}
                </span>
              </p>
              {/* <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center text-white font-semibold transition-colors duration-300"
                onClick={() => router.push('/profile/edit')} // 假设有编辑资料页
              >
                <FaEdit className="mr-2" />
                {translations.profile.editProfile}
              </motion.button> */}
            </div>
          </motion.div>

          {/* Wallet Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="glass-panel neon-border p-6 rounded-xl shadow-lg mb-8"
          >
            <h3 className="text-2xl font-bold mb-4 flex items-center text-secondary">
              <FaWallet className="mr-3" />
              {translations.profile.myWallet}
            </h3>
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center">
                <FaMoneyBillWave className="text-amber-400 text-4xl mr-3" />
                <div>
                  <p className="text-gray-300">{translations.profile.balance}</p>
                  <p className="text-4xl font-extrabold text-white text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500">
                    {formattedBalance}
                  </p>
                </div>
              </div>
              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 rounded-lg flex items-center justify-center font-semibold text-white
                             bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700
                             transition-all duration-300"
                  onClick={() => router.push('/wallet/recharge')} // 假设有充值页
                >
                  <FaPlus className="mr-2" />
                  {translations.profile.recharge}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 rounded-lg flex items-center justify-center font-semibold text-white
                             bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700
                             transition-all duration-300"
                  onClick={() => router.push('/wallet/withdraw')} // 假设有提现页
                >
                  <FaMinus className="mr-2" />
                  {translations.profile.withdraw}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Menu Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {menuItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.03, boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)' }}
                className="glass-panel neon-border p-6 rounded-xl shadow-lg flex items-center justify-between cursor-pointer"
                onClick={() => router.push(item.path)}
              >
                <div className="flex items-center">
                  <item.icon className={`${item.color} text-4xl mr-4`} />
                  <span className="text-xl font-semibold text-gray-100">{item.label}</span>
                </div>
                <span className="text-gray-400 text-sm hover:text-primary transition-colors duration-200">
                  {translations.common.viewDetails} &rarr;
                </span>
              </motion.div>
            ))}
          </div>

          {/* Logout Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full neon-button-red py-3 rounded-lg font-bold text-lg flex items-center justify-center
                       transition-all duration-300 mt-8"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="mr-2" />
            {translations.profile.logout}
          </motion.button>
        </div>
      </main>
    </>
  );
}
