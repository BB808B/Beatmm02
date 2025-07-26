// src/app/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, SkipBack, SkipForward } from 'lucide-react';

// ===================================================================
// 在你现有卓越的UI基础上，我进行了组件化和设计语言的统一
// ===================================================================

// --- 数据定义 (未来将从后端API获取) ---
interface Track {
  id: string;
  title: string;
  artist: string;
  coverImage: string;
  duration: number;
}

const mockTracks: Track[] = [
  { id: '1', title: 'Cybernetic Dreams', artist: 'Synthwave Rider', coverImage: 'https://images.unsplash.com/photo-1594623930335-94a4b634604c?w=800&auto=format&fit=crop', duration: 235 },
  { id: '2', title: 'Neon Pulse', artist: 'DJ Vector', coverImage: 'https://images.unsplash.com/photo-1519692933481-e14e246e46d4?w=800&auto=format&fit=crop', duration: 210 },
  { id: '3', title: 'Midnight Drive', artist: 'Chrome Driver', coverImage: 'https://images.unsplash.com/photo-1574362846830-a3e1b7a2e06a?w=800&auto=format&fit=crop', duration: 180 },
  { id: '4', title: 'Metropolis Groove', artist: 'Android Funk', coverImage: 'https://images.unsplash.com/photo-1557764125-4c5a0a3a7f1a?w=800&auto=format&fit=crop', duration: 220 },
  { id: '5', title: 'Data Stream', artist: 'Binary Beats', coverImage: 'https://images.unsplash.com/photo-1581695293498-e79b8841364a?w=800&auto=format&fit=crop', duration: 190 },
];

// --- 页面专属子组件 (未来可以提取到 components 文件夹) ---

const MusicCard = ({ title, artist, coverImage }: Partial<Track>) => (
  <div className="group animate-fade-in cursor-pointer">
    <div className="relative mb-3 aspect-square rounded-lg overflow-hidden shadow-lg transition-transform duration-300 group-hover:-translate-y-1">
      {coverImage && (
        <Image src={coverImage} alt={title || 'Track cover'} fill className="object-cover" />
      )}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <div className="w-14 h-14 bg-gradient-to-br from-accent-color-1 to-accent-color-2 rounded-full flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-300">
          <Play className="w-7 h-7 text-white ml-1" />
        </div>
      </div>
    </div>
    <h4 className="font-semibold truncate text-text-primary">{title}</h4>
    <p className="text-sm text-text-secondary truncate">{artist}</p>
  </div>
);

const HeroMusicPlayer = () => (
  <div className="w-full max-w-md mx-auto">
    <div className="flex items-center justify-center gap-8 my-4">
      <button className="text-text-secondary hover:text-white transition-colors">
        <SkipBack size={24} />
      </button>
      <button className="w-16 h-16 bg-gradient-to-br from-accent-color-1 to-accent-color-2 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform">
        <Play size={32} className="ml-1" />
      </button>
      <button className="text-text-secondary hover:text-white transition-colors">
        <SkipForward size={24} />
      </button>
    </div>
    <div className="flex items-center gap-4 text-sm text-text-secondary">
      <span>1:10</span>
      <div className="w-full bg-background-primary h-1.5 rounded-full cursor-pointer group">
        <div className="bg-gradient-to-r from-accent-color-2 to-accent-color-1 h-1.5 rounded-full relative" style={{ width: '30%' }}>
           <div className="absolute right-0 top-1/2 -mt-2 w-4 h-4 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
      </div>
      <span>3:45</span>
    </div>
  </div>
);

// --- 主页面组件 ---

const HomePage = () => {
  // 修复了语法错误，并为未来的多语言功能提供一个安全的占位符
  const t = (key: string) => key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const mainTrack = mockTracks[0];

  return (
    // 使用了 <main> 而不是 <div>，更符合语义化
    <main className="flex-grow">
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">

        {/* --- 英雄区 --- */}
        <section className="mb-16 relative overflow-hidden rounded-2xl bg-background-secondary p-6 md:p-10 shadow-2xl">
          <div 
            className="absolute inset-0 bg-cover bg-center filter blur-3xl opacity-20 scale-110" 
            style={{ backgroundImage: `url(${mainTrack.coverImage})` }}
          ></div>
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
              <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <HeroMusicPlayer />
              </div>
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
                <MusicCard {...track} />
              </div>
            ))}
          </div>
        </section>

        {/* --- VIP 会员卡片 --- */}
        <section className="mb-12 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="group relative rounded-2xl p-8 text-center bg-gradient-to-r from-accent-color-1 to-accent-color-2 text-white shadow-2xl overflow-hidden">
             <div className="absolute -inset-2 bg-gradient-to-r from-accent-color-1 to-accent-color-2 rounded-2xl opacity-50 blur-xl group-hover:opacity-75 transition-opacity duration-500 animate-pulse"></div>
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
    </main>
  );
};

export default HomePage;
