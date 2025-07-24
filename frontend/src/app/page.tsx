// frontend/src/app/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Track } from '@/types'; // 假设 @/types 中有 export interface Track { ... }
// import { useTranslation } from 'react-i18next';

// --- 为了让页面能独立运行，我暂时创建了这些组件的简单版本 ---
const Navbar = () => (
  <header className="bg-background-primary/80 backdrop-blur-sm sticky top-0 z-50 border-b border-border-color">
    <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-purple-blue animate-pulse">
        BeatMM Pro
      </Link>
      <div className="hidden md:flex items-center gap-6">
        <Link href="/" className="text-text-secondary hover:text-text-primary transition-colors">Home</Link>
        <Link href="/explore" className="text-text-secondary hover:text-text-primary transition-colors">Explore</Link>
        <Link href="/djs" className="text-text-secondary hover:text-text-primary transition-colors">DJs</Link>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/login" className="btn-secondary">Login</Link>
        <Link href="/signup" className="btn-primary">Sign Up</Link>
      </div>
    </nav>
  </header>
);

const MusicCard = ({ title, artist, coverImage }: Partial<Track>) => (
  <div className="group animate-fade-in">
    <div className="relative mb-3 aspect-square rounded-lg overflow-hidden shadow-lg transition-transform duration-300 group-hover:-translate-y-2">
      <img src={coverImage} alt={title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <div className="w-14 h-14 bg-gradient-pink-purple rounded-full flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M4.52 16.89A.75.75 0 005.47 16l8-6.5a.75.75 0 000-1.18l-8-6.5a.75.75 0 00-1.2 1.06L5.3 9.5 4.07 15.83a.75.75 0 00.45 1.06z"></path></svg>
        </div>
      </div>
    </div>
    <h4 className="font-semibold truncate text-text-primary">{title}</h4>
    <p className="text-sm text-text-secondary truncate">{artist}</p>
  </div>
);

const MusicPlayer = () => (
  <div className="w-full">
    <div className="flex items-center justify-center gap-8 my-4">
        <button className="text-text-secondary hover:text-white transition-colors">Prev Icon</button>
        <button className="w-16 h-16 bg-gradient-pink-purple rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform">Play Icon</button>
        <button className="text-text-secondary hover:text-white transition-colors">Next Icon</button>
    </div>
    <div className="flex items-center gap-4 text-sm text-text-secondary">
        <span>0:00</span>
        <div className="w-full bg-background-secondary h-2 rounded-full cursor-pointer"><div className="bg-gradient-purple-blue h-2 rounded-full" style={{width: '30%'}}></div></div>
        <span>3:45</span>
    </div>
  </div>
);
// --- 临时组件结束 ---

const mockTracks: Track[] = [
  { id: '1', title: 'Euphoric Beats', artist: 'DJ Sonic', coverImage: 'https://images.unsplash.com/photo-1594623930335-94a4b634604c?w=500&auto=format&fit=crop', duration: 235 },
  { id: '2', title: 'City Lights', artist: 'Myint Myat', coverImage: 'https://images.unsplash.com/photo-1519692933481-e14e246e46d4?w=500&auto=format&fit=crop', duration: 210 },
  { id: '3', title: 'Neon Dreams', artist: 'Sai Sai Kham Leng', coverImage: 'https://images.unsplash.com/photo-1574362846830-a3e1b7a2e06a?w=500&auto=format&fit=crop', duration: 180 },
  { id: '4', title: 'Rhythm Sphere', artist: 'Mee No', coverImage: 'https://images.unsplash.com/photo-1557764125-4c5a0a3a7f1a?w=500&auto=format&fit=crop', duration: 220 },
  { id: '5', title: 'Trance Vision', artist: 'Video Auto', coverImage: 'https://images.unsplash.com/photo-1581695293498-e79b8841364a?w=500&auto=format&fit=crop', duration: 190 },
];

const HomePage = () => {
  // const { t } = useTranslation();
  const t = (key: string) => ({...})[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const mainTrack = mockTracks[0];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">

          <section className="mb-16 relative overflow-hidden rounded-2xl bg-background-secondary p-6 md:p-10 shadow-2xl">
            <div className="absolute inset-0 bg-cover bg-center filter blur-3xl opacity-20 scale-110" style={{ backgroundImage: `url(${mainTrack.coverImage})` }}></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 animate-fade-in">
              <img src={mainTrack.coverImage} alt={mainTrack.title} className="w-48 h-48 md:w-64 md:h-64 rounded-xl shadow-2xl object-cover flex-shrink-0" />
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-2 leading-tight animate-slide-in-left">{t('euphoric_beats')}</h2>
                <p className="text-xl md:text-2xl text-text-secondary mb-6 animate-slide-in-left" style={{animationDelay: '0.2s'}}>by {mainTrack.artist}</p>
                <div className="animate-fade-in" style={{animationDelay: '0.4s'}}><MusicPlayer /></div>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h3 className="text-3xl font-bold text-white mb-8 animate-fade-in">{t('recommended_music')}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
              {mockTracks.slice(1).map((track, index) => (
                <div key={track.id} className="animate-fade-in" style={{animationDelay: `${(index + 1) * 0.1}s`}}>
                  <MusicCard {...track} />
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12 animate-fade-in" style={{animationDelay: '0.5s'}}>
            <div className="rounded-2xl p-8 text-center bg-gradient-to-r from-accent-color-1 to-accent-color-2 text-white shadow-2xl transition-transform hover:scale-[1.02] animate-pulse">
              <h3 className="text-3xl font-bold mb-4">Become a VIP Member</h3>
              <p className="text-lg mb-6 max-w-xl mx-auto">Unlock exclusive tracks and enjoy an ad-free experience.</p>
              <Link href="/vip" className="inline-block bg-white text-accent-color-1 font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-colors">
                Learn More
              </Link>
            </div>
          </section>
          
        </div>
      </main>
    </div>
  );
};

export default HomePage;
