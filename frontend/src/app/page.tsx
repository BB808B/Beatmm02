// file: frontend/src/app/page.tsx
'use client';

import React from 'react';
import Link from 'next/link'; // 添加这一行
import Navbar from '@/components/Navbar';
import MusicCard from '@/components/MusicCard';
import MusicPlayer from '@/components/MusicPlayer'; // 引入 MusicPlayer
import { Track } from '@/types';
import { useTranslation } from 'react-i18next';

// 模拟音乐数据 (未来将从后端API获取)
const mockTracks: Track[] = [
  { id: '1', title: 'City Lights', artist: 'Myint Myat', coverImage: '/images/album1.jpg', duration: 235 },
  { id: '2', title: 'Tomorrow', artist: 'Sai Sai Kham Leng', coverImage: '/images/album2.jpg', duration: 210 },
  { id: '3', title: 'Solitude', artist: 'Mee No', coverImage: '/images/album3.jpg', duration: 180 },
  { id: '4', title: 'Nebula', artist: 'Video Auto', coverImage: '/images/album4.jpg', duration: 220 },
  { id: '5', title: 'My Desire', artist: 'The Taoinhal', coverImage: '/images/album5.jpg', duration: 190 },
  { id: '6', title: 'Midnight Groove', artist: 'DJ Shadow', coverImage: '/images/album6.jpg', duration: 240 },
  { id: '7', title: 'Feel the Beat', artist: 'DJ Sorlic', coverImage: '/images/album7.jpg', duration: 200 },
  { id: '8', title: 'Rhythm City', artist: 'DJ Tempo', coverImage: '/images/album8.jpg', duration: 215 },
  { id: '9', title: 'Summer Vibes', artist: 'DJ Heat', coverImage: '/images/album9.jpg', duration: 260 },
  { id: '10', title: 'Groove Nights', artist: 'DJ MixMaster', coverImage: '/images/album10.jpg', duration: 230 },
];

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          {/* 顶部主播放器区域 */}
          <section className="mb-12 relative overflow-hidden rounded-lg shadow-xl bg-background-secondary p-6 md:p-10">
            <div className="absolute inset-0 bg-cover bg-center filter blur-xl opacity-30" style={{ backgroundImage: 'url(/images/main_hero_bg.jpg)' }}></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
              <img src="/images/main_hero_album.jpg" alt="Main Album Cover" className="w-48 h-48 md:w-64 md:h-64 rounded-lg shadow-lg object-cover" />
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-4xl md:text-6xl font-extrabold text-text-primary mb-2 leading-tight fade-in">{t('euphoric_beats')}</h2>
                <p className="text-xl md:text-2xl text-text-secondary mb-6 slide-in-left">DJ Sonic</p>
                <MusicPlayer /> {/* 引入音乐播放器组件 */}
              </div>
            </div>
          </section>

          {/* 推荐音乐 */}
          <section className="mb-12">
            <h3 className="text-2xl font-bold text-text-primary mb-6 fade-in">{t('recommended_music')}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {mockTracks.slice(0, 5).map((track) => (
                <MusicCard
                  key={track.id}
                  id={track.id}
                  title={track.title}
                  artist={track.artist}
                  coverImage={track.coverImage}
                  duration={track.duration}
                />
              ))}
            </div>
          </section>

          {/* 热门歌曲 */}
          <section className="mb-12">
            <h3 className="text-2xl font-bold text-text-primary mb-6 fade-in">{t('hot_tracks')}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {mockTracks.slice(5, 10).map((track) => (
                <MusicCard
                  key={track.id}
                  id={track.id}
                  title={track.title}
                  artist={track.artist}
                  coverImage={track.coverImage}
                  duration={track.duration}
                />
              ))}
            </div>
          </section>

          {/* VIP 促销信息卡片 (示例) */}
          <section className="mb-12">
            <div className="card p-6 text-center bg-gradient-to-r from-accent-color-1 to-accent-color-2 text-white shadow-lg pulse-animation">
              <h3 className="text-3xl font-bold mb-4">{t('become_vip')}</h3>
              <p className="text-lg mb-6">{t('vip_benefits_desc')}</p>
              <Link href="/vip" className="btn btn-secondary bg-white text-accent-color-1 hover:bg-gray-100">
                {t('learn_more')}
              </Link>
            </div>
          </section>

        </div>
      </main>

      {/* 全局底部播放器 (待实现) */}
      {/* <div className="fixed bottom-0 left-0 right-0 bg-background-secondary p-4 shadow-lg">
        <MusicPlayer />
      </div> */}
    </div>
  );
};

export default HomePage;


