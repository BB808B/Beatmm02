// file: frontend/src/app/library/page.tsx
'use client';
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import MusicCard from '@/components/MusicCard';
import { useTranslation } from 'react-i18next';
import { Track } from '@/types';

// 模拟数据
const mockPlaylists = [
  { id: 'p1', name: 'My Favorites', tracks: 50, cover: '/images/playlist1.jpg' },
  { id: 'p2', name: 'Workout Mix', tracks: 30, cover: '/images/playlist2.jpg' },
  { id: 'p3', name: 'Chill Vibes', tracks: 25, cover: '/images/playlist3.jpg' },
];

const mockLikedSongs: Track[] = [
  { id: 'ls1', title: 'Sunset Melody', artist: 'Artist A', coverImage: '/images/album1.jpg', duration: 220, audioUrl: '/audio/sample1.mp3' },
  { id: 'ls2', title: 'Rainy Day Beat', artist: 'Artist B', coverImage: '/images/album2.jpg', duration: 180, audioUrl: '/audio/sample2.mp3' },
  { id: 'ls3', title: 'Urban Flow', artist: 'Artist C', coverImage: '/images/album3.jpg', duration: 250, audioUrl: '/audio/sample3.mp3' },
  { id: 'ls4', title: 'Forest Echoes', artist: 'Artist D', coverImage: '/images/album4.jpg', duration: 190, audioUrl: '/audio/sample4.mp3' },
];

const LibraryPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'playlists' | 'likedSongs'>('playlists');

  return (
    <div className="min-h-screen flex flex-col bg-background-primary">
      <Navbar />
      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-text-primary mb-8 animate-fade-in">{t('your_library')}</h1>

          <div className="flex border-b border-border-color mb-8">
            <button
              className={`py-3 px-6 text-lg font-semibold transition-colors ${activeTab === 'playlists' ? 'text-accent-color-1 border-b-2 border-accent-color-1' : 'text-text-secondary hover:text-text-primary'}`}
              onClick={() => setActiveTab('playlists')}
            >
              {t('playlists')}
            </button>
            <button
              className={`py-3 px-6 text-lg font-semibold transition-colors ${activeTab === 'likedSongs' ? 'text-accent-color-1 border-b-2 border-accent-color-1' : 'text-text-secondary hover:text-text-primary'}`}
              onClick={() => setActiveTab('likedSongs')}
            >
              {t('liked_songs')}
            </button>
          </div>

          {activeTab === 'playlists' && (
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {mockPlaylists.length > 0 ? (
                mockPlaylists.map((playlist) => (
                  <div key={playlist.id} className="card p-4 flex flex-col items-center text-center group">
                    <img src={playlist.cover} alt={playlist.name} className="w-full h-40 object-cover rounded-md mb-4 group-hover:scale-105 transition-transform duration-300" />
                    <h3 className="text-xl font-semibold text-text-primary mb-1">{playlist.name}</h3>
                    <p className="text-text-secondary text-sm">{playlist.tracks} {t('songs')}</p>
                  </div>
                ))
              ) : (
                <p className="text-text-secondary col-span-full text-center py-10">{t('no_playlists_found')}</p>
              )}
            </section>
          )}

          {activeTab === 'likedSongs' && (
            <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {mockLikedSongs.length > 0 ? (
                mockLikedSongs.map((track) => (
                  <MusicCard key={track.id} {...track} />
                ))
              ) : (
                <p className="text-text-secondary col-span-full text-center py-10">{t('no_liked_songs_found')}</p>
              )}
            </section>
          )}

        </div>
      </main>
    </div>
  );
};

export default LibraryPage;


