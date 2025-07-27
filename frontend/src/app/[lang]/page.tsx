// src/app/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// --- 组件导入 ---
// 从 components 文件夹导入我们升级好的、可复用的组件
import MusicCard from '@/components/MusicCard';
import HeroMusicPlayer from '@/components/HeroMusicPlayer';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

// --- 组件导入 ---
import MusicCard from '@/components/MusicCard';
import HeroMusicPlayer from '@/components/HeroMusicPlayer';

// --- 类型和 API 导入 ---
import { Track } from '@/types';
import { fetchTracks } from '@/lib/api';
import { initTranslations } from '@/lib/i18n';

interface HomePageProps {
  params: {
    lang: string;
  };
}

// --- 主页面组件 ---
const HomePage: React.FC<HomePageProps> = ({ params: { lang } }) => {
  const { t, i18n } = useTranslation();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTracks = async () => {
      setLoading(true);
      const fetchedTracks = await fetchTracks();
      setTracks(fetchedTracks);
      setLoading(false);
    };
    loadTracks();
    initTranslations(lang);
  }, [lang]);

  const mainTrack = tracks[0];

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p>{t('loading')}...</p></div>;
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">

      {/* --- 英雄区 --- */}
      {mainTrack && (
        <section className="mb-16 relative overflow-hidden rounded-2xl bg-background-secondary p-6 md:p-10 shadow-2xl">
          <div
            className="absolute inset-0 bg-cover bg-center filter blur-3xl opacity-20 scale-110"
            style={{ backgroundImage: `url(${mainTrack.coverImage})` }}
          />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 animate-fade-in">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-xl shadow-2xl overflow-hidden flex-shrink-0">
               <Image src={mainTrack.coverImage} alt={mainTrack.title} width={256} height={256} className="object-cover" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-2 leading-tight animate-slide-in-left">
                {mainTrack.title}
              </h2>
              <p className="text-xl md:text-2xl text-text-secondary mb-6 animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
                by {mainTrack.artist}
              </p>
              {/* 使用从 components 导入的 HeroMusicPlayer */}
              <HeroMusicPlayer />
            </div>
          </div>
        </section>
      )}

      {/* --- 推荐音乐列表 --- */}
      <section className="mb-16">
        <h3 className="text-3xl font-bold text-white mb-8 animate-fade-in">
          {t('recommended_music')}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
          {tracks.slice(1).map((track, index) => (
            <div key={track.id} style={{ animationDelay: `${(index + 1) * 0.1}s` }}>
              {/* 使用从 components 导入的 MusicCard */}
              <MusicCard track={track} />
            </div>
          ))}
        </div>
      </section>

      {/* --- VIP 会员卡片 --- */}
      <section className="mb-12 animate-fade-in" style={{ animationDelay: '0.5s' }}>
        <div className="group relative rounded-2xl p-8 text-center bg-gradient-pink-red text-white shadow-2xl overflow-hidden">
           <div className="absolute -inset-2 bg-gradient-pink-red rounded-2xl opacity-50 blur-xl group-hover:opacity-75 transition-opacity duration-500 animate-pulse"/>
           <div className="relative">
              <h3 className="text-3xl font-bold mb-4">{t('become_a_vip_member')}</h3>
              <p className="text-lg mb-6 max-w-xl mx-auto">{t('unlock_exclusive_tracks')}</p>
              <Link
                href="/membership"
                className="inline-block bg-white text-accent-color-1 font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-all duration-300 transform group-hover:scale-105"
              >
                {t('learn_more')}
              </Link>
           </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
