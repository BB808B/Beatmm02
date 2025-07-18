// src/components/MusicCard.tsx

import React from 'react';
import Image from 'next/image';
import { FaPlay, FaPause, FaHeart, FaShareAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Track } from '@/types'; // 导入 Track 类型

// 扩展 Track 类型，并添加 MusicCard 独有的 props
interface MusicCardProps extends Track {
  isPlaying: boolean; // Indicates if this specific track is currently playing
  onPlayPause: (track: Track) => void; // 传递整个 Track 对象以便 MusicPlayer 处理
  onLikeToggle: (trackId: string) => void;
  onShare: (trackId: string) => void;
}

const MusicCard: React.FC<MusicCardProps> = ({
  id,
  title,
  artist,
  coverImage,
  audioUrl, // 将 audioSrc 重命名为 audioUrl，与 Track 类型保持一致
  duration,
  isLiked,
  likes,
  isPlaying,
  onPlayPause,
  onLikeToggle,
  onShare,
}) => {
  // Fallback for coverImage if not present, and ensure correct property name
  const cardCoverImage = coverImage || '/images/default-album-art.png';
  // Fallback for title and artist if not present, and ensure correct property names
  const cardArtist = artist || 'Unknown Artist';
  const cardTitle = title || 'Unknown Title';

  return (
    <motion.div
      className="bg-gray-800 rounded-lg shadow-lg overflow-hidden relative cursor-pointer group neon-border-hover"
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative">
        <Image
          src={cardCoverImage} // 使用处理过的 coverImage
          alt={cardTitle} // 使用处理过的 title
          width={500}
          height={500}
          className="w-full h-auto object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click
              // 传递整个 Track 对象
              onPlayPause({ id, title, artist, coverImage, audioUrl, duration, isLiked, likes });
            }}
            className="bg-primary text-white p-4 rounded-full text-2xl shadow-xl hover:bg-primary-dark transition-colors duration-200"
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-white mb-1 truncate">{cardTitle}</h3>
        <p className="text-gray-400 text-sm truncate">{cardArtist}</p>
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center text-gray-400 text-sm">
            <span className="mr-2">{duration}</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLikeToggle(id);
              }}
              className={`flex items-center text-lg ${isLiked ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 transition-colors duration-200`}
            >
              <FaHeart className="mr-1" /> {likes}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShare(id);
              }}
              className="text-gray-400 hover:text-primary transition-colors duration-200 text-lg"
            >
              <FaShareAlt />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MusicCard;
