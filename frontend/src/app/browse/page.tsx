// file: frontend/src/app/browse/page.tsx
'use client';
import React from 'react';
import Navbar from '@/components/Navbar';
import MusicCard from '@/components/MusicCard';
import { useTranslation } from 'react-i18next';
import { Track } from '@/types';

// 模拟分类数据和音乐数据
const mockCategories = [
  { name: 'Vietnamese Drum', image: '/images/category_viet_drum.jpg' },
  { name: 'Traditional Myanmar', image: '/images/category_myanmar.jpg' },
  { name: 'Electronic Dance', image: '/images/category_edm.jpg' },
  { name: 'Hip Hop', image: '/images/category_hiphop.jpg' },
  { name: 'Pop', image: '/images/category_pop.jpg' },
];

const mockFeaturedTracks: Track[] = [
  { id: 'f1', title: 'Rhythm of Bagan', artist: 'DJ Aung', coverImage: '/images/album11.jpg', duration: 245, audioUrl: '/audio/sample11.mp3' },
  { id: 'f2', title: 'Inle Lake Vibes', artist: 'Maung Maung', coverImage: '/images/album12.jpg', duration: 210, audioUrl: '/audio/sample12.mp3' },
  { id: 'f3', title: 'Yangon Beat', artist: 'Thiri', coverImage: '/images/album13.jpg', duration: 200, audioUrl: '/audio/sample13.mp3' },
  { id: 'f4', title: 'Mandalay Groove', artist: 'Ko Ko', coverImage: '/images/album14.jpg', duration: 230, audioUrl: '/audio/sample14.mp3' },
];

const BrowsePage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-background-primary">
      <Navbar />
      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-text-primary mb-8 animate-fade-in">{t('browse_music')}</h1>

          {/* 音乐分类 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-text-primary mb-6 fade-in">{t('music_categories')}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {mockCategories.map((category, index) => (
                <div key={index} className="relative group rounded-lg overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                  <img src={category.image} alt={category.name} className="w-full h-40 object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <h3 className="text-xl font-bold text-white text-center">{t(category.name.toLowerCase().replace(/ /g, '_'))}</h3>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 精选音乐 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-text-primary mb-6 fade-in">{t('featured_music')}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {mockFeaturedTracks.map((track) => (
                <MusicCard key={track.id} {...track} />
              ))}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default BrowsePage;


