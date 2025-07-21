// file: frontend/src/components/PricingSection.tsx (美学优化最终版)
'use client';

import React, { useState } from 'react';
import { Check, Star, Zap, Crown } from 'lucide-react';
import { Language } from '@/types';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
}

interface PricingSectionProps {
  currentLang: Language;
}

const PricingSection: React.FC<PricingSectionProps> = ({ currentLang }) => {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const getTranslation = (key: string, fallback: string) => {
    const translations: Record<Language, any> = {
      zh: {
        'pricing.title': '选择您的套餐',
        'pricing.subtitle': '选择最适合您的音乐体验套餐,享受无限音乐世界',
        'pricing.basic': '基础套餐',
        'pricing.premium': '高级套餐',
        'pricing.vip': 'VIP套餐',
        'pricing.month': '月',
        'pricing.popular': '最受欢迎',
        'pricing.features.unlimited': '无限音乐流',
        'pricing.features.hq': '高品质音质',
        'pricing.features.offline': '离线收听',
        'pricing.features.exclusive': '独家内容',
        'pricing.features.early': '抢先体验新歌',
        'pricing.features.ads': '无广告体验',
        'pricing.features.support': '优先客服支持',
        'pricing.features.devices': '多设备同步',
        'common.subscribe': '立即订阅',
        'common.loading': '处理中...',
        'pricing.trial': '新用户享受3天免费试用,随时可以取消订阅',
      },
      en: { /* ... 英文翻译 ... */ },
      my: { /* ... 缅甸语翻译 ... */ },
    };
    return translations[currentLang]?.[key] || fallback;
  };

  const plans: PricingPlan[] = [
    {
      id: 'basic',
      name: getTranslation('pricing.basic', 'Basic Plan'),
      price: 900, currency: 'K', period: getTranslation('pricing.month', 'month'),
      icon: <Zap className="w-6 h-6" />,
      features: [
        getTranslation('pricing.features.unlimited', 'Unlimited Music Streaming'),
        getTranslation('pricing.features.hq', 'High Quality Audio'),
        getTranslation('pricing.features.ads', 'Ad-Free Experience'),
      ],
    },
    {
      id: 'premium',
      name: getTranslation('pricing.premium', 'Premium Plan'),
      price: 1800, currency: 'K', period: getTranslation('pricing.month', 'month'),
      icon: <Star className="w-6 h-6" />,
      popular: true,
      features: [
        getTranslation('pricing.features.unlimited', 'Unlimited Music Streaming'),
        getTranslation('pricing.features.hq', 'High Quality Audio'),
        getTranslation('pricing.features.offline', 'Offline Listening'),
        getTranslation('pricing.features.early', 'Early Access to New Songs'),
        getTranslation('pricing.features.support', 'Priority Customer Support'),
      ],
    },
    {
      id: 'vip',
      name: getTranslation('pricing.vip', 'VIP Plan'),
      price: 3000, currency: 'K', period: getTranslation('pricing.month', 'month'),
      icon: <Crown className="w-6 h-6" />,
      features: [
        getTranslation('pricing.features.unlimited', 'Unlimited Music Streaming'),
        getTranslation('pricing.features.hq', 'High Quality Audio'),
        getTranslation('pricing.features.offline', 'Offline Listening'),
        getTranslation('pricing.features.exclusive', 'Exclusive Content'),
        getTranslation('pricing.features.early', 'Early Access to New Songs'),
        getTranslation('pricing.features.devices', 'Multi-Device Sync'),
      ],
    },
  ];

  const handleSubscribe = async (planId: string) => {
    setIsLoading(planId);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(null);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            {getTranslation('pricing.title', 'Choose Your Plan')}
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {getTranslation('pricing.subtitle', '...')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div key={plan.id} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
               {/* ... 卡片内部结构 ... */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
