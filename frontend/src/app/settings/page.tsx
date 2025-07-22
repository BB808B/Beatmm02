// file: frontend/src/app/settings/page.tsx
'use client';
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useTranslation } from 'react-i18next';

const SettingsPage = () => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  const handleSaveSettings = () => {
    // TODO: 保存设置到后端或本地存储
    alert(t('settings_saved'));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-primary">
      <Navbar />
      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold text-text-primary mb-8 animate-fade-in">{t('settings')}</h1>

          <section className="bg-background-secondary rounded-lg shadow-xl p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-text-primary mb-6">{t('general_settings')}</h2>
            
            {/* 语言设置 */}
            <div className="mb-6">
              <label className="block text-text-primary text-lg font-semibold mb-2">{t('language')}</label>
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="input-field"
              >
                <option value="my">{t('myanmar')}</option>
                <option value="zh">{t('chinese')}</option>
                <option value="en">{t('english')}</option>
              </select>
            </div>

            {/* 主题设置 */}
            <div className="mb-6">
              <label className="block text-text-primary text-lg font-semibold mb-2">{t('theme')}</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="input-field"
              >
                <option value="dark">{t('dark_theme')}</option>
                <option value="light">{t('light_theme')}</option>
              </select>
            </div>

            {/* 通知设置 */}
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="mr-3 w-5 h-5 text-accent-color-1 bg-background-secondary border-border-color rounded focus:ring-accent-color-1"
                />
                <span className="text-text-primary text-lg font-semibold">{t('enable_notifications')}</span>
              </label>
            </div>

            {/* 自动播放设置 */}
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={autoPlay}
                  onChange={(e) => setAutoPlay(e.target.checked)}
                  className="mr-3 w-5 h-5 text-accent-color-1 bg-background-secondary border-border-color rounded focus:ring-accent-color-1"
                />
                <span className="text-text-primary text-lg font-semibold">{t('auto_play_next_song')}</span>
              </label>
            </div>

            <button onClick={handleSaveSettings} className="btn btn-primary">
              {t('save_settings')}
            </button>
          </section>

          <section className="bg-background-secondary rounded-lg shadow-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-text-primary mb-6">{t('account_settings')}</h2>
            
            <div className="space-y-4">
              <button className="btn btn-secondary w-full">{t('change_password')}</button>
              <button className="btn btn-secondary w-full">{t('manage_privacy')}</button>
              <button className="btn btn-secondary w-full text-red-500 border-red-500 hover:bg-red-500 hover:text-white">{t('delete_account')}</button>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default SettingsPage;

