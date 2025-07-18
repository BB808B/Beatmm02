import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Language } from '@/types';

interface Plan {
  name: string;
  price: string;
  period: string;
  features: string[];
  isPopular?: boolean;
}

const PricingSection: React.FC<{ currentLang: Language }> = ({ currentLang }) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  
  // 试用状态管理
  const [trialDaysLeft, setTrialDaysLeft] = useState(3);
  const [trialEnded, setTrialEnded] = useState(false);

  // 获取翻译文本
  const getTranslation = (key: string, fallback: string) => {
    try {
      // @ts-ignore
      const translations = require(`@/locales/${currentLang}.json`);
      return key.split('.').reduce((obj, k) => obj?.[k], translations) || fallback;
    } catch {
      return fallback;
    }
  };

  // 套餐定义
  const plans: Plan[] = [
    {
      name: getTranslation('pricing.basic', 'Basic'),
      price: '5,000',
      period: getTranslation('pricing.month', '/month'),
      features: [
        getTranslation('pricing.features.unlimited', 'Unlimited streaming'),
        getTranslation('pricing.features.hq', 'High quality audio'),
        getTranslation('pricing.features.offline', 'Offline listening (3 devices)')
      ]
    },
    {
      name: getTranslation('pricing.premium', 'Premium'),
      price: '8,000',
      period: getTranslation('pricing.month', '/month'),
      features: [
        getTranslation('pricing.features.unlimited', 'Unlimited streaming'),
        getTranslation('pricing.features.hq', 'High quality audio'),
        getTranslation('pricing.features.offline', 'Offline listening (5 devices)'),
        getTranslation('pricing.features.exclusive', 'Exclusive content')
      ],
      isPopular: true
    },
    {
      name: getTranslation('pricing.vip', 'VIP'),
      price: '12,000',
      period: getTranslation('pricing.month', '/month'),
      features: [
        getTranslation('pricing.features.unlimited', 'Unlimited streaming'),
        getTranslation('pricing.features.hq', 'Ultra high quality audio'),
        getTranslation('pricing.features.offline', 'Offline listening (10 devices)'),
        getTranslation('pricing.features.exclusive', 'Exclusive content'),
        getTranslation('pricing.features.early', 'Early access to new releases')
      ]
    }
  ];

  const handleSubscribe = (planName: string) => {
    setSelectedPlan(planName);
    // 这里应该添加支付集成逻辑
    console.log(`用户订阅了: ${planName}`);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-white mb-6">
            {getTranslation('pricing.title', 'Choose Your Plan')}
          </h2>
          
          {trialDaysLeft > 0 && !trialEnded && (
            <p className="text-lg text-purple-400">
              {getTranslation('common.freeTrial', 'Free Trial')}: {trialDaysLeft} {currentLang === 'zh' ? '天剩余' : currentLang === 'my' ? 'ရက်ကျန်' : 'days left'}
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              className={`pricing-card glass-effect relative ${plan.isPopular ? 'popular' : ''}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              {plan.isPopular && (
                <div className="popular-badge absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  {currentLang === 'zh' ? '最受欢迎' : currentLang === 'my' ? 'အကြိုက်ဆုံး' : 'Most Popular'}
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-xl text-gray-400">{plan.period}</span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-purple-500 mr-2">✓</span>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <motion.button
                  className="btn-primary w-full"
                  onClick={() => handleSubscribe(plan.name)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {getTranslation('common.subscribe', 'Subscribe Now')}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
        
        {trialEnded && (
          <div className="mt-12 text-center">
            <p className="text-red-400 mb-4">
              {currentLang === 'zh' 
                ? '您的免费试用已结束，请订阅以继续使用' 
                : currentLang === 'my' 
                  ? 'သင့်အခမဲ့စမ်းသုံးမှု ကာလပြီးဆုံးပါပြီ၊ ဆက်လက်အသုံးပြုရန် စာရင်းသွင်းပါ' 
                  : 'Your free trial has ended. Please subscribe to continue'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PricingSection;
