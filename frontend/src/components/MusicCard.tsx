'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, Pause, Heart, Share2, MoreHorizontal } from 'lucide-react'; // 确保这里导入了正确的图标

import { MusicCardProps } from '@/types'; // 导入 MusicCardProps 接口

const MusicCard: React.FC<MusicCardProps> = ({
  id,
  title,
  artist,
  coverImage,
  duration, // 根据 types/index.ts，这里现在是 string | number 类型
  isLiked,
  likes = 0, // 提供默认值，以防 likes 未定义
  isPlaying,
  onPlay, // 修改为 onPlay
  onPause, // 修改为 onPause
  onLike,
  onShare,
}) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white/5 rounded-lg p-3 relative group hover:bg-white/10 transition-all duration-300 overflow-hidden"
    >
      <div className="relative w-full h-40 rounded-md overflow-hidden mb-3">
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
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          {isPlaying ? (
            <button
              onClick={() => onPause?.(id)}
              className="bg-purple-500 text-white p-3 rounded-full hover:bg-purple-600 transition-colors"
            >
              <Pause className="w-6 h-6" />
            </button>
          ) : (
            <button
              onClick={() => onPlay?.(id)}
              className="bg-purple-500 text-white p-3 rounded-full hover:bg-purple-600 transition-colors"
            >
              <Play className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold text-lg truncate">{title}</h3>
          <p className="text-gray-400 text-sm truncate">{artist}</p>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onLike?.(id)}
              className={`p-2 rounded-full transition-colors ${
                isLiked ? 'text-red-500' : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Heart className="w-4 h-4" />
            </button>
            <button
              onClick={() => onShare?.(id)}
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-400">
            {likes > 0 && (
              <span className="flex items-center space-x-1">
                <Heart className="w-3 h-3" />
                <span>{likes}</span>
              </span>
            )}
            <span>{typeof duration === 'number' ? formatDuration(duration) : duration}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MusicCard;
