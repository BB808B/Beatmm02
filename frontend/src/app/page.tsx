// file: frontend/src/app/page.tsx (极致简约版)
'use client';

import React from 'react';
import Navbar from '@/components/Navbar'; // 引用新的 Navbar
import MusicCard from '@/components/MusicCard'; // MusicCard 我们也需要微调
import { Track } from '@/types';

// 模拟音乐数据
const mockTracks: Track[] = [
  { id: '1', title: 'City Lights', artist: 'Myint Myat', coverImage: '/images/album1.jpg', duration: 235 },
  { id: '2', title: 'Tomorrow', artist: 'Sai Sai Kham Leng', coverImage: '/images/album2.jpg', duration: 210 },
  { id: '3', title: 'Solitude', artist: 'Mee No', coverImage: '/images/album3.jpg', duration: 180 },
  { id: '4', title: 'Nebula', artist: 'Video Auto', coverImage: '/images/album4.jpg', duration: 220 },
  { id: '5', title: 'My Desire', artist: 'The Taoinhal', coverImage: '/images/album5.jpg', duration: 190 },
  // ... 更多音乐
];

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* 主标题 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">BeatMM Pro</h1>
            <p className="mt-4 text-lg text-gray-400">Discover and stream music.</p>
          </div>

          {/* 音乐卡片网格 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {mockTracks.map((track) => (
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

          {/* 可以在这里添加翻页组件 */}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
