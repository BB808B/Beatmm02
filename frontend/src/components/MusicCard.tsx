'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play, Pause, Heart, Share2, MoreHorizontal } from 'lucide-react';

interface MusicCardProps {
  id: string;
  title: string;
  artist: string;
  coverImage: string;
  duration: number;
  isPlaying?: boolean;
  onPlay?: (id: string) => void;
  onPause?: () => void;
  isLiked?: boolean;
  likes?: number;
  onLike?: (id: string) => void;
  onShare?: (id: string) => void;
}

const MusicCard: React.FC<MusicCardProps> = ({
  id,
  title,
  artist,
  coverImage,
  duration,
  isPlaying = false,
  onPlay,
  onPause,
}) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };
  
  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 防止点击播放按钮时触发卡片的其他点击事件
    onPlay?.(id);
  };

  const handlePauseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPause?.();
  };


  return (
    <div className="music-card cursor-pointer group">
      <div className="relative w-full aspect-square rounded-md overflow-hidden mb-4">
        {imageError ? (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-400">
            Image Not Available
          </div>
        ) : (
          <Image
            src={coverImage}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            className="group-hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
          />
        )}
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {isPlaying ? (
             <button
                onClick={handlePauseClick}
                className="w-12 h-12 flex items-center justify-center bg-green-500 text-white rounded-full transition-transform transform hover:scale-110"
                aria-label="Pause"
             >
              <Pause className="w-6 h-6" />
            </button>
          ) : (
            <button
                onClick={handlePlayClick}
                className="w-12 h-12 flex items-center justify-center bg-green-500 text-white rounded-full transition-transform transform hover:scale-110"
                aria-label="Play"
            >
              <Play className="w-6 h-6 fill-white" />
            </button>
          )}
        </div>
      </div>
      <div>
        <h3 className="text-white font-semibold text-base truncate">{title}</h3>
        <p className="text-gray-400 text-sm truncate">{artist}</p>
      </div>
    </div>
  );
};

export default MusicCard;
