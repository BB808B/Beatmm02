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

  // 简化的翻译函数, 实际项目中应该使用更完整的i18n库
  const getTranslation = (key: string, fallback: string) => {
    const translations: Record<Language, Record<string, string>> = {
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
      en: {
        'pricing.title': 'Choose Your Plan',
        'pricing.subtitle': 'Choose the perfect music experience plan for you and enjoy unlimited music world',
        'pricing.basic': 'Basic Plan',
        'pricing.premium': 'Premium Plan',
        'pricing.vip': 'VIP Plan',
        'pricing.month': 'month',
        'pricing.popular': 'Most Popular',
        'pricing.features.unlimited': 'Unlimited Music Streaming',
        'pricing.features.hq': 'High Quality Audio',
        'pricing.features.offline': 'Offline Listening',
        'pricing.features.exclusive': 'Exclusive Content',
        'pricing.features.early': 'Early Access to New Songs',
        'pricing.features.ads': 'Ad-Free Experience',
        'pricing.features.support': 'Priority Customer Support',
        'pricing.features.devices': 'Multi-Device Sync',
        'common.subscribe': 'Subscribe Now',
        'common.loading': 'Processing...',
        'pricing.trial': 'New users get 3 days free trial, cancel anytime',
      },
      my: {
        'pricing.title': 'သင့်အစီအစဉ်ကို ရွေးချယ်ပါ',
        'pricing.subtitle': 'သင့်အတွက် အကောင်းဆုံးဂီတအတွေ့အကြုံကို ရွေးချယ်ပြီး အဆုံးမဲ့ဂီတလောကကို ခံစားလိုက်ပါ',
        'pricing.basic': 'အခြေခံ အစီအစဉ်',
        'pricing.premium': 'ပရီမီယံ အစီအစဉ်',
        'pricing.vip': 'VIP အစီအစဉ်',
        'pricing.month': 'လ',
        'pricing.popular': 'လူကြိုက်အများဆုံး',
        'pricing.features.unlimited': 'အကန့်အသတ်မဲ့ သီချင်းနားထောင်ခြင်း',
        'pricing.features.hq': 'အရည်အသွေးမြင့် အသံ',
        'pricing.features.offline': 'အော့ဖ်လိုင်း နားထောင်ခြင်း',
        'pricing.features.exclusive': 'သီးသန့် အကြောင်းအရာ',
        'pricing.features.early': 'သီချင်းသစ်များ အရင်ဦးဆုံး ရယူနိုင်ခြင်း',
        'pricing.features.ads': 'ကြော်ငြာမဲ့ အတွေ့အကြုံ',
        'pricing.features.support': 'ဦးစားပေး ဖောက်သည် ဝန်ဆောင်မှု',
        'pricing.features.devices': 'စက်ပစ္စည်းများစွာတွင် အသုံးပြုနိုင်ခြင်း',
        'common.subscribe': 'ယခုပဲ စာရင်းသွင်းပါ',
        'common.loading': 'လုပ်ဆောင်နေသည်...',
        'pricing.trial': 'အသုံးပြုသူအသစ်များအတွက် ၃ ရက် အခမဲ့သုံးနိုင်ပြီး၊ အချိန်မရွေး ပယ်ဖျက်နိုင်ပါသည်',
      },
    };
    return translations[currentLang]?.[key] || fallback;
  };


  const plans: PricingPlan[] = [
    {
      id: 'basic',
      name: getTranslation('pricing.basic', 'Basic Plan'),
      price: 4.99, currency: '$', period: getTranslation('pricing.month', 'month'),
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
      price: 9.99, currency: '$', period: getTranslation('pricing.month', 'month'),
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
      price: 14.99, currency: '$', period: getTranslation('pricing.month', 'month'),
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
    console.log(`Subscribing to ${planId}...`);
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`Subscribed to plan: ${planId}`);
    setIsLoading(null);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            {get
