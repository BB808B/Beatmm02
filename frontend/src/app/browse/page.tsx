// src/app/browse/page.tsx
'use client';
import React from 'react';
import Image from 'next/image'; // 推荐使用 Next/Image
import MusicCard from '@/components/MusicCard'; // 导入我们升级后的 MusicCard
import { Track } from '@/types'; // 导入全局类型

// 模拟分类数据和音乐数据 (未来将从API获取)
const mockCategories = [
  { name: 'Vietnamese Drum', image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop' },
  { name: 'Traditional Myanmar', image: 'https://images.unsplash.com/photo-1598070630654-a0b7ac39683c?w=800&auto=format&fit=crop' },
  { name: 'Electronic Dance', image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop' },
  { name: 'Hip Hop', image: 'https://images.unsplash.com/photo-1593113646773-462716a8ca6a?w=800&auto=format&fit=crop' },
  { name: 'Pop', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop' },
];

const mockFeaturedTracks: Partial<Track>[] = [ // 使用 Partial<Track> 更灵活
  { id: 'f1', title: 'Rhythm of Bagan', artist: 'DJ Aung', coverImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop' },
  { id: 'f2', title: 'Inle Lake Vibes', artist: 'Maung Maung', coverImage: 'https://images.unsplash.com/photo-1542359649-31e03cdde435?w=800&auto=format&fit=crop' },
  { id: 'f3', title: 'Yangon Beat', artist: 'Thiri', coverImage: 'https://images.unsplash.com/photo-1584824248839-253c22822a45?w=800&auto=format&fit=crop' },
  { id: 'f4', title: 'Mandalay Groove', artist: 'Ko Ko', coverImage: 'https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=800&auto=format&fit=crop' },
  { id: 'f5', title: 'Golden Land Echo', artist: 'Daw Ni', coverImage: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&auto=format&fit=crop' },
];

const BrowsePage = () => {
  // 临时的多语言占位符
  const t = (key: string) => key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    // <main> 和 <Navbar> 已经由 layout.tsx 全局提供，这里不再需要
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-text-primary mb-8 animate-fade-in">{t('browse_music')}</h1>

      {/* 音乐分类 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-6 animate-fade-in">{t('music_categories')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {mockCategories.map((category, index) => (
            <div key={index} className="relative group rounded-lg overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-xl aspect-video animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
              <Image src={category.image} alt={category.name} fill className="object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2">
                <h3 className="text-xl font-bold text-white text-center">{t(category.name)}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 精选音乐 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-6 animate-fade-in">{t('featured_music')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
          {mockFeaturedTracks.map((track, index) => (
            <div key={track.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
              {/* ========== THIS IS THE FIX ========== */}
              <MusicCard track={track} />
              {/* ==================================== */}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default BrowsePage;
