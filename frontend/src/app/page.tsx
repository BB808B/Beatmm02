// src/app/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// --- 组件导入 ---
// 从 components 文件夹导入我们升级好的、可复用的组件
import MusicCard from '@/components/MusicCard';
import HeroMusicPlayer from '@/components/HeroMusicPlayer';

// --- 类型导入 ---
import { Track } from '@/types';

// 我们仍然使用模拟数据，未来将从后端API获取
const mockTracks: Track[] = [
  { id: '1', title: 'Cybernetic Dreams', artist: 'Synthwave Rider', coverImage: 'https://images.unsplash.com/photo-1594623930335-94a4b634604c?w=800&auto=format&fit=crop', duration: 235 },
  { id: '2', title: 'Neon Pulse', artist: 'DJ Vector', coverImage: 'https://images.unsplash.com/photo-1519692933481-e14e246e46d4?w=800&auto=format=fit', duration: 210 },
  { id: '3', title: 'Midnight Drive', artist: 'Chrome Driver', coverImage: 'https://images.unsplash.com/photo-1574362846830-a3e1b7a2e06a?w=800&auto=format&fit=crop', duration: 180 },
  { id: '4', title: 'Metropolis Groove', artist: 'Android Funk', coverImage: 'https://images.unsplash.com/photo-1557764125-4c5a0a3a7f1a?w=800&auto=format&fit=crop', duration: 220 },
  { id: '5', title: 'Data Stream', artist: 'Binary Beats', coverImage: 'https://images.unsplash.com/photo-1581695293498-e79b8841364a?w=800&auto=format&fit=crop', duration: 190 },
];


// --- 主页面组件 ---
const HomePage = () => {
  const t = (key: string) => key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const mainTrack = mockTracks[0];

  return (
    // <main> 标签现在由 layout.tsx 提供，所以我们只需要返回内部内容
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">

      {/* --- 英雄区 --- */}
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
              {t(mainTrack.title)}
            </h2>
            <p className="text-xl md:text-2xl text-text-secondary mb-6 animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
              by {mainTrack.artist}
            </p>
            {/* 使用从 components 导入的 HeroMusicPlayer */}
            <HeroMusicPlayer />
          </div>
        </div>
      </section>

      {/* --- 推荐音乐列表 --- */}
      <section className="mb-16">
        <h3 className="text-3xl font-bold text-white mb-8 animate-fade-in">
          {t('Recommended Music')}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
          {mockTracks.slice(1).map((track, index) => (
            <div key={track.id} style={{ animationDelay: `${(index + 1) * 0.1}s` }}>
              {/* 使用从 components 导入的 MusicCard */}
              <MusicCard track={track} />
            </div>
          ))}
        </div>
      </section>

      {/* --- VIP 会员卡片 --- */}
      <section className="mb-12 animate-fade-in" style={{ animationDelay: '0.5s' }}>
        <div className="group relative rounded-2xl p-8 text-center bg-gradient-to-r from-accent-color-1 to-accent-color-2 text-white shadow-2xl overflow-hidden">
           <div className="absolute -inset-2 bg-gradient-to-r from-accent-color-1 to-accent-color-2 rounded-2xl opacity-50 blur-xl group-hover:opacity-75 transition-opacity duration-500 animate-pulse"/>
           <div className="relative">
              <h3 className="text-3xl font-bold mb-4">{t('Become a VIP Member')}</h3>
              <p className="text-lg mb-6 max-w-xl mx-auto">{t('Unlock exclusive tracks and enjoy an ad-free experience.')}</p>
              <Link 
                href="/membership" 
                className="inline-block bg-white text-accent-color-1 font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-all duration-300 transform group-hover:scale-105"
              >
                {t('Learn More')}
              </Link>
           </div>
        </div>
      </section>
      
    </div>
  );
};

export default HomePage;
