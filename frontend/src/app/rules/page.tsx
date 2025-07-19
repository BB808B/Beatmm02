'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import NavbarComponent from '@/components/Navbar';
import { TranslationType, Language } from '@/types';

export default function RulesPage() {
  const [currentLang, setCurrentLang] = useState<Language>('zh');
  const [translations, setTranslations] = useState<TranslationType | null>(null);
  const [loading, setLoading] = useState(true);

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
          rules: { // Ensure this structure matches what's used in the component
            title: '平台使用规则',
            subtitle: '请仔细阅读并遵守以下规则',
            sections: [
              {
                title: '1. 用户行为规范',
                content: [
                  '• 禁止发布违法、违规内容',
                  '• 尊重其他用户，不得恶意攻击',
                  '• 不得传播虚假信息',
                  '• 保护个人隐私和他人隐私'
                ]
              },
              {
                title: '2. 音乐版权规定',
                content: [
                  '• 尊重音乐创作者的版权',
                  '• 不得非法下载或分享受版权保护的音乐',
                  '• 支持正版音乐',
                  '• 举报侵权行为'
                ]
              },
              {
                title: '3. 账户安全',
                content: [
                  '• 保护好您的账户密码',
                  '• 不要与他人共享账户信息',
                  '• 发现异常及时联系客服',
                  '• 定期更新密码'
                ]
              },
              {
                title: '4. 服务条款',
                content: [
                  '• 平台保留修改规则的权利',
                  '• 违规用户将被暂停或封禁账户',
                  '• 平台不承担用户行为产生的法律责任',
                  '• 如有争议，以最新版规则为准'
                ]
              }
            ],
            contactUs: '联系我们',
            contactMessage: '如果您对规则有任何疑问，请联系我们的客服团队。'
          }
        });
      } finally {
        setLoading(false);
      }
    };

    loadTranslations();
  }, [currentLang]);

  if (loading || !translations) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">加载中...</div>
      </div>
    );
  }

  const rulesTranslations = translations.rules;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <NavbarComponent 
        currentLang={currentLang} 
        onLanguageChange={setCurrentLang}
        translations={translations}
      />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            {rulesTranslations?.title}
          </h1>
          <p className="text-gray-300 text-lg">
            {rulesTranslations?.subtitle}
          </p>
        </motion.div>

        {/* Rules Sections */}
        <div className="max-w-4xl mx-auto space-y-8">
          {rulesTranslations?.sections?.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                {section.title}
              </h2>
              <div className="space-y-3">
                {section.content.map((item, itemIndex) => (
                  <p key={itemIndex} className="text-gray-300 text-lg leading-relaxed">
                    {item}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="max-w-4xl mx-auto mt-12 bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center"
        >
          <h3 className="text-xl font-bold text-white mb-4">
            {rulesTranslations?.contactUs}
          </h3>
          <p className="text-gray-300">
            {rulesTranslations?.contactMessage}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
