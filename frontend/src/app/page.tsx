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
  const [showPlaylist, setShowPlaylist] = useState(false);

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
        console.error('加载翻译失败:', error);
        // 提供完整的默认翻译
        setTranslations({
          common: { 
            loading: '加载中...',
            subscribe: '立即订阅',
            freeTrial: '免费试用',
            popular: '最受欢迎',
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
            login: '登录'
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

  const handlePlay = (trackId: string) => {
    const index = mockTracks.findIndex(track => track.id === trackId);
    if (index !== -1) {
      setCurrentTrackIndex(index);
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  if (!translations) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <NavbarComponent 
        currentLang={currentLang} 
        onLanguageChange={setCurrentLang}
        translations={translations}
      />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-title-gradient">{translations.hero.title}</span>
          </h1>
          <p className="hero-subtitle">
            {translations.hero.subtitle}
          </p>
          <div className="hero-buttons">
            <button className="btn-primary">
              开始免费试用
            </button>
            <button className="btn-secondary">
              了解更多
            </button>
          </div>
        </div>
      </section>

      {/* Genre Circles */}
      <GenreCircles currentLang={currentLang} />

      {/* Music Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            热门音乐
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockTracks.map((track) => (
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

      {/* Pricing Section */}
      <PricingSection currentLang={currentLang} />

      {/* Music Player */}
      <MusicPlayer
        tracks={mockTracks}
        currentTrackIndex={currentTrackIndex}
        setCurrentTrackIndex={setCurrentTrackIndex}
        onShowPlaylist={() => setShowPlaylist(true)}
      />
    </div>
  );
}
