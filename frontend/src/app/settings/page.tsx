'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCog, FaLanguage, FaBell, FaPalette, FaSave } from 'react-icons/fa';
import NavbarComponent from '@/components/Navbar';
import { Translations } from '@/types'; // 确保 Translations 类型正确导入

export default function SettingsPage() {
  const [currentLang, setCurrentLang] = useState('zh');
  const [translations, setTranslations] = useState<Translations | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true); // 模拟主题设置
  const [emailNotifications, setEmailNotifications] = useState(true); // 模拟通知设置
  const [smsNotifications, setSmsNotifications] = useState(false); // 模拟通知设置
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

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
          settings: {
            title: 'Settings', language: 'Language', theme: 'Theme', notifications: 'Notifications',
            darkMode: 'Dark Mode', emailNotifications: 'Email Notifications', smsNotifications: 'SMS Notifications',
            saveChanges: 'Save Changes', settingsSaved: 'Settings saved!'
          },
          common: {
            search: 'Search', submit: 'Submit', cancel: 'Cancel', confirm: 'Confirm',
            save: 'Save', edit: 'Edit', delete: 'Delete', loading: 'Loading...',
            error: 'Error', success: 'Success', viewDetails: 'View Details',
            on: 'On', off: 'Off'
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

  const handleSaveChanges = async () => {
    setSaveMessage(null);
    setLoading(true);
    try {
      // 模拟保存设置到后端
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveMessage(translations?.settings?.settingsSaved || 'Settings saved!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaveMessage(translations?.common?.error || 'Failed to save settings.');
    } finally {
      setLoading(false);
      setTimeout(() => setSaveMessage(null), 3000); // 3秒后清除消息
    }
  };

  if (loading || !translations) {
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

      <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white pt-24 pb-10">
        <div className="max-w-3xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-extrabold text-center mb-8
                       text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent"
          >
            <FaCog className="inline-block mr-4" />
            {translations.settings.title}
          </motion.h2>

          <div className="space-y-6">
            {/* Language Setting */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="glass-panel neon-border p-6 rounded-xl shadow-lg flex items-center justify-between"
            >
              <div className="flex items-center">
                <FaLanguage className="text-secondary text-3xl mr-4" />
                <span className="text-xl font-semibold">{translations.settings.language}</span>
              </div>
              <select
                className="bg-gray-800 border border-gray-700 text-white rounded-lg p-2 focus:outline-none focus:border-primary transition-all duration-300"
                value={currentLang}
                onChange={(e) => handleLanguageChange(e.target.value)}
              >
                <option value="zh">中文</option>
                <option value="en">English</option>
                {/* 可以添加更多语言选项 */}
              </select>
            </motion.div>

            {/* Theme Setting */}
            {/* 这里的开关只是UI模拟，实际应用中需要与全局主题切换逻辑结合 */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="glass-panel neon-border p-6 rounded-xl shadow-lg flex items-center justify-between"
            >
              <div className="flex items-center">
                <FaPalette className="text-primary text-3xl mr-4" />
                <span className="text-xl font-semibold">{translations.settings.theme}</span>
              </div>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isDarkMode}
                    onChange={() => setIsDarkMode(!isDarkMode)}
                  />
                  <div
                    className={`block w-14 h-8 rounded-full transition-colors duration-300 ${
                      isDarkMode ? 'bg-primary' : 'bg-gray-600'
                    }`}
                  ></div>
                  <div
                    className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ${
                      isDarkMode ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></div>
                </div>
                <div className="ml-3 text-white font-medium">
                  {isDarkMode ? translations.settings.darkMode : translations.common.off}
                </div>
              </label>
            </motion.div>

            {/* Notifications Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="glass-panel neon-border p-6 rounded-xl shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-4 flex items-center text-accent">
                <FaBell className="mr-3" />
                {translations.settings.notifications}
              </h3>
              <div className="space-y-4">
                {/* Email Notifications */}
                <div className="flex items-center justify-between">
                  <span className="text-lg text-gray-200">{translations.settings.emailNotifications}</span>
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={emailNotifications}
                        onChange={() => setEmailNotifications(!emailNotifications)}
                      />
                      <div
                        className={`block w-14 h-8 rounded-full transition-colors duration-300 ${
                          emailNotifications ? 'bg-primary' : 'bg-gray-600'
                        }`}
                      ></div>
                      <div
                        className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ${
                          emailNotifications ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      ></div>
                    </div>
                    <div className="ml-3 text-white font-medium">
                      {emailNotifications ? translations.common.on : translations.common.off}
                    </div>
                  </label>
                </div>

                {/* SMS Notifications */}
                <div className="flex items-center justify-between">
                  <span className="text-lg text-gray-200">{translations.settings.smsNotifications}</span>
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={smsNotifications}
                        onChange={() => setSmsNotifications(!smsNotifications)}
                      />
                      <div
                        className={`block w-14 h-8 rounded-full transition-colors duration-300 ${
                          smsNotifications ? 'bg-primary' : 'bg-gray-600'
                        }`}
                      ></div>
                      <div
                        className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ${
                          smsNotifications ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      ></div>
                    </div>
                    <div className="ml-3 text-white font-medium">
                      {smsNotifications ? translations.common.on : translations.common.off}
                    </div>
                  </label>
                </div>
              </div>
            </motion.div>

            {/* Save Changes Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full neon-button py-3 rounded-lg font-bold text-lg flex items-center justify-center
                         transition-all duration-300 mt-8"
              onClick={handleSaveChanges}
              disabled={loading}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <FaSave className="mr-2" />
              )}
              {loading ? (translations.common.loading || 'Loading...') : (translations.settings.saveChanges || 'Save Changes')}
            </motion.button>

            {saveMessage && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 text-center text-sm ${
                  saveMessage.includes(translations.common.error || 'Failed') ? 'text-red-500' : 'text-green-500'
                }`}
              >
                {saveMessage}
              </motion.p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
