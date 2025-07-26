// src/app/settings/page.tsx
'use client';
import React, { useState } from 'react'; // <-- 这是修正后的行
import { ChevronDown, Bell, LogOut, Shield, Palette, Trash2, Save } from 'lucide-react';

// 一个自定义的 Switch 开关组件，更符合我们的设计风格
const CustomSwitch = ({ checked, onChange, label }: { checked: boolean, onChange: (checked: boolean) => void, label: string }) => (
  <label className="flex items-center justify-between cursor-pointer">
    <span className="text-text-primary text-base">{label}</span>
    <div className="relative">
      <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <div className={`block w-14 h-8 rounded-full transition-colors ${checked ? 'bg-accent-color-1' : 'bg-background-primary'}`}></div>
      <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${checked ? 'transform translate-x-6' : ''}`}></div>
    </div>
  </label>
);

const SettingsPage = () => {
  const t = (key: string) => key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  // 状态管理
  const [language, setLanguage] = useState('en');
  const [notifications, setNotifications] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);

  const handleSaveSettings = () => {
    alert(t('settings_saved_successfully'));
  };

  return (
    <div className="container mx-auto max-w-3xl py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-text-primary mb-10 text-center animate-fade-in">{t('settings')}</h1>

      <div className="space-y-12">
        {/* 通用设置 */}
        <section className="bg-background-secondary rounded-xl shadow-xl p-6 md:p-8 animate-fade-in-up">
          <h2 className="text-2xl font-bold text-text-primary mb-6">{t('general')}</h2>
          <div className="space-y-6">
            {/* 语言设置 */}
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-text-secondary mb-2">{t('language')}</label>
              <div className="relative">
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-background-primary border border-border-color rounded-md px-4 py-3 text-white appearance-none focus:ring-2 focus:ring-accent-color-1 focus:border-accent-color-1 outline-none transition"
                >
                  <option value="en">{t('english')}</option>
                  <option value="my">{t('myanmar')}</option>
                  <option value="zh">{t('chinese')}</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary pointer-events-none" />
              </div>
            </div>
            
            {/* 主题设置 (暂时禁用，因为我们目前只有暗黑主题) */}
            <div>
               <label htmlFor="theme" className="block text-sm font-medium text-text-secondary mb-2">{t('theme')}</label>
               <div className="relative">
                 <select id="theme" defaultValue="dark" disabled className="w-full bg-background-primary border border-border-color rounded-md px-4 py-3 text-text-secondary appearance-none outline-none transition cursor-not-allowed">
                   <option value="dark">{t('dark_theme')} (Default)</option>
                 </select>
                 <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
               </div>
            </div>

            <hr className="border-border-color" />
            
            {/* 开关设置 */}
            <CustomSwitch checked={notifications} onChange={setNotifications} label={t('enable_push_notifications')} />
            <CustomSwitch checked={autoPlay} onChange={setAutoPlay} label={t('auto_play_next_song')} />
          </div>
        </section>

        {/* 账户设置 */}
        <section className="bg-background-secondary rounded-xl shadow-xl p-6 md:p-8 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
          <h2 className="text-2xl font-bold text-text-primary mb-6">{t('account')}</h2>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 bg-background-primary rounded-lg hover:bg-white/5 transition-colors">
              <span className="flex items-center gap-3"><Shield size={18} /> {t('change_password')}</span>
              <span>→</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 bg-background-primary rounded-lg hover:bg-white/5 transition-colors">
              <span className="flex items-center gap-3"><Palette size={18} /> {t('manage_privacy')}</span>
              <span>→</span>
            </button>
          </div>
        </section>

        {/* 危险区域 */}
        <section className="border-2 border-red-500/30 rounded-xl p-6 md:p-8 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <h2 className="text-2xl font-bold text-red-400 mb-4">{t('danger_zone')}</h2>
          <p className="text-text-secondary mb-6">{t('these_actions_are_irreversible_please_be_certain')}</p>
          <button className="w-full btn-secondary text-red-400 border-red-500/50 hover:bg-red-500/10 hover:border-red-500 hover:text-red-400 flex items-center justify-center gap-3">
             <Trash2 size={18} /> {t('delete_my_account')}
          </button>
        </section>

        {/* 保存按钮 */}
        <div className="flex justify-end animate-fade-in-up" style={{ animationDelay: '450ms' }}>
          <button onClick={handleSaveSettings} className="btn-primary flex items-center gap-2">
            <Save size={18} /> {t('save_changes')}
          </button>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;
