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
          profile: {
            musicLover: '音乐爱好者',
            collectedSongs: '收藏歌曲',
            playlists: '播放列表',
            playTime: '播放时长(小时)',
            myMusic: '我的音乐',
            favoriteSongs: '喜欢的歌曲',
            settings: '设置',
            recommendedContent: '推荐内容',
            recentActivity: '最近活动',
            played: '播放了',
            collected: '收藏了',
            createdNewPlaylist: '创建了新播放列表'
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

  const profileTranslations = translations.profile;

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
              <h1 className="text-3xl font-bold text-white mb-2">{translations.nav.profile}</h1>
              <p className="text-gray-300">{profileTranslations?.musicLover}</p>
              <div className="flex gap-4 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">42</div>
                  <div className="text-sm text-gray-400">{profileTranslations?.collectedSongs}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">12</div>
                  <div className="text-sm text-gray-400">{profileTranslations?.playlists}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">156</div>
                  <div className="text-sm text-gray-400">{profileTranslations?.playTime}</div>
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
            <h3 className="text-white font-semibold mb-2">{profileTranslations?.myMusic}</h3>
            <p className="text-gray-400 text-sm">
              {currentLang === 'zh' ? '查看收藏的歌曲和播放列表' : currentLang === 'my' ? 'စုဆောင်းထားသော သီချင်းများနှင့် ပလေလစ်များကို ကြည့်ရန်' : 'View collected songs and playlists'}
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all cursor-pointer">
            <FaHeart className="text-red-400 text-2xl mb-4" />
            <h3 className="text-white font-semibold mb-2">{profileTranslations?.favoriteSongs}</h3>
            <p className="text-gray-400 text-sm">
              {currentLang === 'zh' ? '管理您最喜爱的音乐' : currentLang === 'my' ? 'သင်အကြိုက်ဆုံး ဂီတများကို စီမံခန့်ခွဲရန်' : 'Manage your favorite music'}
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all cursor-pointer">
            <FaCog className="text-blue-400 text-2xl mb-4" />
            <h3 className="text-white font-semibold mb-2">{profileTranslations?.settings}</h3>
            <p className="text-gray-400 text-sm">
              {currentLang === 'zh' ? '个性化您的音乐体验' : currentLang === 'my' ? 'သင်၏ ဂီတ အတွေ့အကြုံကို စိတ်ကြိုက်ပြင်ဆင်ရန်' : 'Personalize your music experience'}
            </p>
          </div>
        </motion.div>

        {/* Carousel Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">{profileTranslations?.recommendedContent}</h2>
          <Carousel slides={dummySlides} />
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
        >
          <h2 className="text-2xl font-bold text-white mb-6">{profileTranslations?.recentActivity}</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <FaMusic className="text-white" />
              </div>
              <div>
                <h4 className="text-white font-medium">{profileTranslations?.played}《缅甸的黎明》</h4>
                <p className="text-gray-400 text-sm">2小时前</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                <FaHeart className="text-white" />
              </div>
              <div>
                <h4 className="text-white font-medium">{profileTranslations?.collected}《金色大地》</h4>
                <p className="text-gray-400 text-sm">1天前</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <FaMusic className="text-white" />
              </div>
              <div>
                <h4 className="text-white font-medium">{profileTranslations?.createdNewPlaylist}</h4>
                <p className="text-gray-400 text-sm">3天前</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
