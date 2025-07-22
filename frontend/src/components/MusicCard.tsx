// file: frontend/src/components/MusicCard.tsx
'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Track } from '@/types';
import { FaPlay, FaPause } from 'react-icons/fa'; // 引入播放/暂停图标

interface MusicCardProps extends Track {
  onPlay?: (track: Track) => void; // 添加播放事件回调
}

const MusicCard: React.FC<MusicCardProps> = ({ id, title, artist, coverImage, duration, onPlay }) => {
  const [imageError, setImageError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false); // 模拟播放状态

  const handlePlayClick = () => {
    // 模拟播放逻辑
    setIsPlaying(!isPlaying);
    if (onPlay) {
      onPlay({ id, title, artist, coverImage, duration });
    }
  };

  return (
    <div className="music-card group relative rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <div className="music-card-image-wrapper relative">
        {!imageError && coverImage ? (
          <Image
            src={coverImage}
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-background-secondary flex items-center justify-center text-text-secondary text-sm">
            <span>{title}</span>
          </div>
        )}
        {/* 播放按钮叠加层 */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={handlePlayClick}
        >
          <button className="play-button w-14 h-14 text-2xl">
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
        </div>
      </div>
      <div className="p-3">
        <h3 className="music-card-title truncate text-text-primary text-base font-semibold">{title}</h3>
        <p className="music-card-artist truncate text-text-secondary text-sm">{artist}</p>
      </div>
    </div>
  );
};

export default MusicCard;


