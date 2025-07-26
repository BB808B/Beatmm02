// src/app/library/page.tsx
'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import MusicCard from '@/components/MusicCard';
import { Track } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

// 模拟数据 (未来将从API获取)
const mockPlaylists = [
  { id: 'p1', name: 'My Favorites', tracks: 50, cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop' },
  { id: 'p2', name: 'Workout Mix', tracks: 30, cover: 'https://images.unsplash.com/photo-1590602846893-57c3a1c172d8?w=800&auto=format&fit=crop' },
  { id: 'p3', name: 'Chill Vibes', tracks: 25, cover: 'https://images.unsplash.com/photo-1518609579133-39d6d37a85d3?w=800&auto=format&fit=crop' },
];

const mockLikedSongs: Partial<Track>[] = [
  { id: 'ls1', title: 'Sunset Melody', artist: 'Artist A', coverImage: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&auto=format&fit=crop' },
  { id: 'ls2', title: 'Rainy Day Beat', artist: 'Artist B', coverImage: 'https://images.unsplash.com/photo-1542037104857-ff80b9f52f66?w=800&auto=format&fit=crop' },
  { id: 'ls3', title: 'Urban Flow', artist: 'Artist C', coverImage: 'https://images.unsplash.com/photo-1483000805330-4eaf0e019f13?w=800&auto=format&fit=crop' },
  { id: 'ls4', title: 'Forest Echoes', artist: 'Artist D', coverImage: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&auto=format&fit=crop' },
];

const LibraryPage = () => {
  const t = (key: string) => key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const [activeTab, setActiveTab] = useState<'playlists' | 'likedSongs'>('playlists');

  const tabContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-text-primary mb-8 animate-fade-in">{t('your_library')}</h1>

      <div className="flex border-b border-border-color mb-8">
        <button
          className={`relative py-3 px-6 text-lg font-semibold transition-colors duration-300 ${activeTab === 'playlists' ? 'text-accent-color-1' : 'text-text-secondary hover:text-text-primary'}`}
          onClick={() => setActiveTab('playlists')}
        >
          {t('playlists')}
          {activeTab === 'playlists' && <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-color-1" />}
        </button>
        <button
          className={`relative py-3 px-6 text-lg font-semibold transition-colors duration-300 ${activeTab === 'likedSongs' ? 'text-accent-color-1' : 'text-text-secondary hover:text-text-primary'}`}
          onClick={() => setActiveTab('likedSongs')}
        >
          {t('liked_songs')}
          {activeTab === 'likedSongs' && <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-color-1" />}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'playlists' && (
          <motion.section
            key="playlists"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {mockPlaylists.length > 0 ? (
              mockPlaylists.map((playlist, index) => (
                <div key={playlist.id} className="bg-background-secondary rounded-lg p-4 flex flex-col items-center text-center group transition-all duration-300 hover:bg-white/5" style={{ animationDelay: `${index * 50}ms` }}>
                  <div className="relative w-full aspect-square mb-4 rounded-md overflow-hidden">
                    <Image src={playlist.cover} alt={playlist.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-1">{playlist.name}</h3>
                  <p className="text-text-secondary text-sm">{playlist.tracks} {t('songs')}</p>
                </div>
              ))
            ) : (
              <p className="text-text-secondary col-span-full text-center py-10">{t('no_playlists_found')}</p>
            )}
          </motion.section>
        )}

        {activeTab === 'likedSongs' && (
          <motion.section
            key="likedSongs"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10"
          >
            {mockLikedSongs.length > 0 ? (
              mockLikedSongs.map((track, index) => (
                <div key={track.id} style={{ animationDelay: `${index * 50}ms` }}>
                  <MusicCard track={track} />
                </div>
              ))
            ) : (
              <p className="text-text-secondary col-span-full text-center py-10">{t('no_liked_songs_found')}</p>
            )}
          </motion.section>
        )}
      </AnimatePresence>

    </div>
  );
};

export default LibraryPage;
