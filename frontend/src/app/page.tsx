'use client';

import React, { useState, useEffect } from 'react';
import NavbarComponent from '@/components/Navbar';
import MusicPlayer from '@/components/MusicPlayer';
import MusicCard from '@/components/MusicCard';
import { Track, Translations, CarouselSlide } from '@/types';
import { motion } from 'framer-motion';

// 模拟数据
const mockTracks: Track[] = [
  // 保持原数据不变
];

const featuredSlides: CarouselSlide[] = [
  // 保持原数据不变
];

export default function Home() {
  const [currentLang, setCurrentLang] = useState('zh');
  const [translations, setTranslations] = useState<Translations | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tracks, setTracks] = useState(mockTracks);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // 加载翻译文件（保持原逻辑不变）

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
  };

  const handlePlay = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleNext = () => {
    if (currentTrack) {
      const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
      const nextIndex = (currentIndex + 1) % tracks.length;
      setCurrentTrack(tracks[nextIndex]);
    }
  };

  const handlePrevious = () => {
    if (currentTrack) {
      const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
      const prevIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1;
      setCurrentTrack(tracks[prevIndex]);
    }
  };

  const handleLike = (trackId: string) => {
    setTracks(prevTracks =>
      prevTracks.map(track =>
        track.id === trackId
          ? { 
              ...track, 
              isLiked: !track.isLiked,
              likes: track.isLiked ? track.likes - 1 : track.likes + 1
            }
          : track
      )
    );
  };

  // 轮播图自动切换
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prevIndex) => (prevIndex + 1) % featuredSlides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  if (!translations) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="status-dot animate-pulse"></div>
        <span className="ml-3 neon-text">加载中...</span>
      </div>
    );
  }

  return (
    <>
      <NavbarComponent
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        translations={translations}
      />

      <main className="holographic-container pt-20 pb-40">
        {/* 霓虹轮播图 */}
        <div className="relative overflow-hidden rounded-2xl mb-10 h-[400px] glass-panel">
          {featuredSlides.map((slide, index) => (
            <motion.div
              key={slide.id}
              className={`absolute inset-0 flex items-center justify-center bg-cover bg-center ${
                index === carouselIndex ? 'z-10' : 'z-0'
              }`}
              style={{
                backgroundImage: `url(${slide.image})`,
              }}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: index === carouselIndex ? 1 : 0,
              }}
              transition={{ duration: 1 }}
            >
              <div className="text-center p-6 bg-black/30 backdrop-blur-sm rounded-2xl">
                <motion.h1 
                  className="text-4xl md:text-6xl font-bold mb-4 section-title"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {slide.title}
                </motion.h1>
                <motion.p 
                  className="text-xl md:text-2xl mb-6 neon-text"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {slide.subtitle}
                </motion.p>
                <motion.button
                  className="neon-btn px-8 py-3 text-lg"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {slide.buttonText}
                </motion.button>
              </div>
            </motion.div>
          ))}
          
          {/* 轮播图指示器 */}
          <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
            {featuredSlides.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === carouselIndex 
                    ? 'bg-accent scale-125' 
                    : 'bg-white/50'
                }`}
                onClick={() => setCarouselIndex(index)}
                aria-label={`切换到幻灯片 ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* 内容区域 */}
        <div className="max-w-7xl mx-auto px-4">
          {/* 精选音乐 */}
          <section className="mb-16">
            <h2 className="mb-8 section-title">{translations.home.featured}</h2>
            <div className="deployment-grid">
              {tracks.slice(0, 4).map((track) => (
                <MusicCard
                  key={track.id}
                  track={track}
                  isPlaying={isPlaying}
                  isCurrentTrack={currentTrack?.id === track.id}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onLike={handleLike}
                  translations={translations}
                />
              ))}
            </div>
          </section>

          {/* 热门趋势 */}
          <section className="mb-16">
            <h2 className="mb-8 section-title">{translations.home.trending}</h2>
            <div className="deployment-grid">
              {tracks.map((track) => (
                <MusicCard
                  key={track.id}
                  track={track}
                  isPlaying={isPlaying}
                  isCurrentTrack={currentTrack?.id === track.id}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onLike={handleLike}
                  translations={translations}
                />
              ))}
            </div>
          </section>

          {/* 最新发布 */}
          <section className="mb-16">
            <h2 className="mb-8 section-title">{translations.home.newReleases}</h2>
            <div className="deployment-grid">
              {tracks.slice().reverse().map((track) => (
                <MusicCard
                  key={track.id}
                  track={track}
                  isPlaying={isPlaying}
                  isCurrentTrack={currentTrack?.id === track.id}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onLike={handleLike}
                  translations={translations}
                />
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* 音乐播放器 */}
      <MusicPlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onPlay={() => setIsPlaying(true)}
        onPause={handlePause}
        onNext={handleNext}
        onPrevious={handlePrevious}
        translations={translations}
      />
    </>
  );
}
