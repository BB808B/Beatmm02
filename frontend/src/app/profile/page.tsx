'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaMusic, FaHeart, FaCog } from 'react-icons/fa';
import NavbarComponent from '@/components/Navbar';
import Carousel from '@/components/Carousel';
import { TranslationType, Language, CarouselSlide } from '@/types';

export default function ProfilePage() {
  const [currentLang, setCurrentLang] = useState<Language>('zh');
  const [translations, setTranslations] = useState<TranslationType | null>(null);
  const [loading, setLoading] = useState(true);

  // Dummy data for carousel (adjust as needed)
  const dummySlides: CarouselSlide[] = [
    { id: '1', imageUrl: '/images/carousel-1.jpg', altText: 'Promotion 1', link: '#' },
    { id: '2', imageUrl: '/images/carousel-2.jpg', altText: 'Promotion 2', link: '#' },
    { id: '3', imageUrl: '/images/carousel-3.jpg', altText: 'Promotion 3', link: '#' },
  ];

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
            title: "个人资料",
            subtitle: "管理您的音乐偏好和账户设置"
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

  if (loading || !translations) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <NavbarComponent 
        currentLang={currentLang} 
        onLanguageChange={setCurrentLang}
        translations={translations}
      />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20"
        >
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
              <FaUser size={40} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">用户名</h1>
              <p className="text-gray-300">音乐爱好者</p>
              <div className="flex gap-4 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">42</div>
                  <div className="text-sm text-gray-400">收藏歌曲</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">12</div>
                  <div className="text-sm text-gray-400">播放列表</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">156</div>
                  <div className="text-sm text-gray-400">播放时长(小时)</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all cursor-pointer">
            <FaMusic className="text-purple-400 text-2xl mb-4" />
            <h3 className="text-white font-semibold mb-2">我的音乐</h3>
            <p className="text-gray-400 text-sm">查看收藏的歌曲和播放列表</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all cursor-pointer">
            <FaHeart className="text-red-400 text-2xl mb-4" />
            <h3 className="text-white font-semibold mb-2">喜欢的歌曲</h3>
            <p className="text-gray-400 text-sm">管理您最喜爱的音乐</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all cursor-pointer">
            <FaCog className="text-blue-400 text-2xl mb-4" />
            <h3 className="text-white font-semibold mb-2">设置</h3>
            <p className="text-gray-400 text-sm">个性化您的音乐体验</p>
          </div>
        </motion.div>

        {/* Carousel Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">推荐内容</h2>
          <Carousel slides={dummySlides} />
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
        >
          <h2 className="text-2xl font-bold text-white mb-6">最近活动</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <FaMusic className="text-white" />
              </div>
              <div>
                <h4 className="text-white font-medium">播放了《缅甸的黎明》</h4>
                <p className="text-gray-400 text-sm">2小时前</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                <FaHeart className="text-white" />
              </div>
              <div>
                <h4 className="text-white font-medium">收藏了《金色大地》</h4>
                <p className="text-gray-400 text-sm">1天前</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <FaMusic className="text-white" />
              </div>
              <div>
                <h4 className="text-white font-medium">创建了新播放列表</h4>
                <p className="text-gray-400 text-sm">3天前</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
