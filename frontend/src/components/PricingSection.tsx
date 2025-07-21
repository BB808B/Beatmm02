// file: frontend/src/components/PricingSection.tsx
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
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`Subscribed to plan: ${planId}`);
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
            {getTranslation('pricing.subtitle', 'Choose the perfect music experience plan for you and enjoy unlimited music world')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div key={plan.id} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
              {plan.popular && (
                <div className="flex justify-center mb-4">
                  <span className="popular-badge">
                    <Star className="w-4 h-4" />
                    {getTranslation('pricing.popular', 'Most Popular')}
                  </span>
                </div>
              )}
              <div className="text-center mb-6">
                <div className={`inline-block p-3 rounded-full mb-4 ${plan.popular ? 'bg-green-500' : 'bg-gray-700'}`}>
                  {plan.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-white">{plan.currency}{plan.price}</span>
                  <span className="text-gray-400 ml-2">/{plan.period}</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={!!isLoading}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  plan.popular
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-white text-black hover:bg-gray-200'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading === plan.id ? getTranslation('common.loading', 'Processing...') : getTranslation('common.subscribe', 'Subscribe Now')}
              </button>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <p className="text-gray-400">
            {getTranslation('pricing.trial', 'New users get 3 days free trial, cancel anytime')}
          </p>
        </div>
      </div>
    </section>
  );
// 这里是关键！之前的代码可能在这里少了一个 `}`
}; 

export default PricingSection;
