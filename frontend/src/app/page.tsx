'use client';

import React, { useState, useEffect } from 'react';
import NavbarComponent from '@/components/Navbar';
import MusicCard from '@/components/MusicCard';
import MusicPlayer from '@/components/MusicPlayer';
import GenreCircles from '@/components/GenreCircles';
import PricingSection from '@/components/PricingSection';
import { Language, TranslationType } from '@/types';

// 模拟音乐数据
const mockTracks = [
  {
    id: '1',
    title: '缅甸的黎明',
    artist: '昂山素季',
    coverImage: '/images/album1.jpg',
    audioUrl: '/music/song1.mp3',
    duration: 235,
  },
  {
    id: '2',
    title: '金色大地',
    artist: '缅甸国家乐队',
    coverImage: '/images/album2.jpg',
    audioUrl: '/music/song2.mp3',
    duration: 210,
  },
  {
    id: '3',
    title: '翡翠之恋',
    artist: '缅甸之声',
    coverImage: '/images/album3.jpg',
    audioUrl: '/music/song3.mp3',
    duration: 180,
  },
  {
    id: '4',
    title: '伊洛瓦底江',
    artist: '江河乐队',
    coverImage: '/images/album4.jpg',
    audioUrl: '/music/song4.mp3',
    duration: 220,
  },
];

export default function Home() {
  const [currentLang, setCurrentLang] = useState<Language>('zh');
  const [translations, setTranslations] = useState<TranslationType | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(true);

  // 加载翻译
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const langModule = await import(`@/locales/${currentLang}.json`);
        setTranslations(langModule.default);
      } catch (error) {
        console.error('加载翻译失败:', error);
        // 提供默认翻译
        setTranslations({
          common: { 
            loading: '加载中...',
            subscribe: '立即订阅',
            freeTrial: '免费试用',
            popular: '最受欢迎'
          },
          navbar: {
            home: '首页',
            music: '音乐',
            radio: '电台',
            charts: '排行榜',
            rules: '规则'
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
          }
        });
      }
    };

    loadTranslations();
  }, [currentLang]);

  // 处理播放/暂停
  const handlePlay = (id: string) => {
    const trackIndex = mockTracks.findIndex(track => track.id === id);
    if (trackIndex !== -1) {
      setCurrentTrackIndex(trackIndex);
      setIsPlaying(true);
      setShowPlayer(true);
    }
  };

  const handlePause = (id: string) => {
    setIsPlaying(false);
  };

  // 显示播放列表（示例函数）
  const handleShowPlaylist = () => {
    console.log('显示播放列表');
  };

  // 切换播放器显示
  const togglePlayer = () => {
    setShowPlayer(!showPlayer);
  };

  // 加载状态
  if (!translations) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        加载中...
      </div>
    );
  }

  // 获取当前语言下的标题和副标题
  const getHeroTitle = () => {
    switch (currentLang) {
      case 'zh': return 'BeatMM Pro';
      case 'my': return 'BeatMM Pro';
      case 'en': return 'BeatMM Pro';
      default: return 'BeatMM Pro';
    }
  };

  const getHeroSubtitle = () => {
    switch (currentLang) {
      case 'zh': return '缅甸领先的音乐流媒体平台，发现无尽音乐世界';
      case 'my': return 'မြန်မာနိုင်ငံ၏ ထိပ်တန်း ဂီတဖြန့်ဖြူးရာဝန်ဆောင်မှု၊ ဂီတကမ္ဘာသစ်ကို ရှာဖွေပါ';
      case 'en': return 'Myanmar\'s leading music streaming service. Discover a new world of music';
      default: return 'Myanmar\'s leading music streaming service';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <NavbarComponent 
        currentLang={currentLang} 
        onLanguageChange={setCurrentLang}
        translations={{
          navbar: translations.navbar
        }} 
      />

      <main>
        {/* 英雄区域 */}
        <section className="hero-section relative overflow-hidden">
          <div className="hero-background absolute inset-0"></div>
          <div className="hero-content relative z-10 text-center py-32 px-4">
            <h1 className="hero-title font-bold">
              <span className="hero-title-gradient">{getHeroTitle()}</span>
            </h1>
            <p className="hero-subtitle max-w-2xl mx-auto">
              {getHeroSubtitle()}
            </p>
            <div className="hero-buttons mt-8 flex justify-center gap-4">
              <button className="btn-primary">
                {translations.common.freeTrial}
              </button>
              <button className="btn-secondary">
                {translations.common.subscribe}
              </button>
            </div>
          </div>
        </section>

        {/* 音乐类型展示 */}
        <GenreCircles currentLang={currentLang} />

        {/* 热门音乐 */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              {currentLang === 'zh' 
                ? '热门音乐' 
                : currentLang === 'my' 
                  ? 'လူကြိုက်အများဆုံးဂီတများ'
                  : 'Popular Music'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {mockTracks.map(track => (
                <MusicCard
                  key={track.id}
                  id={track.id}
                  title={track.title}
                  artist={track.artist}
                  coverImage={track.coverImage}
                  audioUrl={track.audioUrl}
                  duration={track.duration}
                  isPlaying={isPlaying && currentTrackIndex === mockTracks.findIndex(t => t.id === track.id)}
                  onPlay={handlePlay}
                  onPause={handlePause}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 定价区域 */}
        <PricingSection currentLang={currentLang} />
      </main>

      {/* 音乐播放器 - 只在有曲目时显示 */}
      {mockTracks.length > 0 && showPlayer && (
        <MusicPlayer
          tracks={mockTracks}
          onShowPlaylist={handleShowPlaylist}
          currentTrackIndex={currentTrackIndex}
          setCurrentTrackIndex={setCurrentTrackIndex}
        />
      )}

      {/* 底部播放器切换按钮 */}
      <div className="fixed bottom-4 right-4 z-50">
        <button 
          onClick={togglePlayer}
          className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg"
        >
          {showPlayer ? '隐藏播放器' : '显示播放器'}
        </button>
      </div>
    </div>
  );
}
