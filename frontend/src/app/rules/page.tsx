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
        // 提供默认翻译
        setTranslations({
          common: {
            loading: "加载中...",
            subscribe: "立即订阅",
            freeTrial: "免费试用",
            popular: "热门",
            search: "搜索"
          },
          navbar: {
            home: "首页",
            music: "音乐",
            radio: "电台",
            charts: "排行榜",
            rules: "规则"
          },
          nav: {
            home: "首页",
            music: "音乐",
            radio: "电台",
            charts: "排行榜",
            rules: "规则",
            login: "登录"
          },
          hero: {
            title: "平台规则",
            subtitle: "请仔细阅读并遵守以下规则"
          },
          pricing: {
            title: "选择您的套餐",
            basic: "基础套餐",
            premium: "高级套餐",
            vip: "VIP套餐",
            month: "月",
            features: {
              unlimited: "无限音乐流",
              hq: "高品质音质",
              offline: "离线收听",
              exclusive: "独家内容",
              early: "抢先体验新歌"
            },
            mostPopular: "最受欢迎"
          }
        });
      } finally {
        setLoading(false);
      }
    };

    loadTranslations();
  }, [currentLang]);

  const getRulesContent = () => {
    switch (currentLang) {
      case 'zh':
        return {
          title: '平台使用规则',
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
          ]
        };
      case 'my':
        return {
          title: 'ပလပ်ဖောင်း အသုံးပြုမှု စည်းမျဉ်းများ',
          sections: [
            {
              title: '1. အသုံးပြုသူ အပြုအမူ စံနှုန်းများ',
              content: [
                '• တရားမဝင်၊ စည်းမျဉ်းဖောက်ဖျက်သော အကြောင်းအရာများ တင်ခြင်းကို တားမြစ်သည်',
                '• အခြားအသုံးပြုသူများကို လေးစားပြီး၊ အဓိက တိုက်ခိုက်ခြင်းမပြုရ',
                '• မမှန်သော သတင်းအချက်အလက်များ ဖြန့်ဝေခြင်းမပြုရ',
                '• ကိုယ်ပိုင်နှင့် အခြားသူများ၏ ကိုယ်ရေးကိုယ်တာကို ကာကွယ်ရမည်'
              ]
            },
            {
              title: '2. ဂီတ မူပိုင်ခွင့် စည်းမျဉ်းများ',
              content: [
                '• ဂီတ ဖန်တီးသူများ၏ မူပိုင်ခွင့်ကို လေးစားရမည်',
                '• မူပိုင်ခွင့် ကာကွယ်ထားသော ဂီတကို တရားမဝင် ဒေါင်းလုဒ် သို့မဟုတ် မျှဝေခြင်းမပြုရ',
                '• မူရင်း ဂီတကို ထောက်ပံ့ရမည်',
                '• မူပိုင်ခွင့် ချိုးဖောက်မှုများကို တိုင်ကြားရမည်'
              ]
            }
          ]
        };
      case 'en':
      default:
        return {
          title: 'Platform Usage Rules',
          sections: [
            {
              title: '1. User Behavior Standards',
              content: [
                '• Prohibited from posting illegal or inappropriate content',
                '• Respect other users, no malicious attacks',
                '• Do not spread false information',
                '• Protect personal and others\' privacy'
              ]
            },
            {
              title: '2. Music Copyright Regulations',
              content: [
                '• Respect music creators\' copyrights',
                '• Do not illegally download or share copyrighted music',
                '• Support original music',
                '• Report copyright infringement'
              ]
            }
          ]
        };
    }
  };

  if (loading || !translations) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">加载中...</div>
      </div>
    );
  }

  const rulesContent = getRulesContent();

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
            {rulesContent.title}
          </h1>
          <p className="text-gray-300 text-lg">
            {translations.hero.subtitle}
          </p>
        </motion.div>

        {/* Rules Sections */}
        <div className="max-w-4xl mx-auto space-y-8">
          {rulesContent.sections.map((section, index) => (
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
            {currentLang === 'zh' ? '联系我们' : currentLang === 'my' ? 'ကျွန်ုပ်တို့ကို ဆက်သွယ်ပါ' : 'Contact Us'}
          </h3>
          <p className="text-gray-300">
            {currentLang === 'zh' 
              ? '如果您对规则有任何疑问，请联系我们的客服团队。' 
              : currentLang === 'my' 
              ? 'စည်းမျဉ်းများနှင့် ပတ်သက်၍ မေးခွန်းများရှိပါက ကျွန်ုပ်တို့၏ ဝန်ဆောင်မှုအဖွဲ့ကို ဆက်သွယ်ပါ။'
              : 'If you have any questions about the rules, please contact our customer service team.'}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
