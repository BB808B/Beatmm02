// src/components/MusicCard.tsx

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
// 从 lucide-react 导入图标，与 page.tsx 保持一致
import { Play, Pause, Heart, Share2 } from 'lucide-react';
// 从 @/types 导入 MusicCardProps 和 Track
import { MusicCardProps, Track } from '@/types'; 
import { formatTime } from '@/utils/formatTime'; // 导入 formatTime 函数


const MusicCard: React.FC<MusicCardProps> = ({
  id,
  title,
  artist,
  coverImage,
  duration, // MusicCardProps 中的 duration 已经是 string 类型，因为它由 page.tsx 格式化后传入
  isLiked,
  likes,
  isPlaying,
  onPlayPause, // 现在接收一个 Track 对象
  onLikeToggle,
  onShare,
}) => {
  // Fallback for coverImage if not present, and ensure correct property name
  const cardCoverImage = coverImage || '/images/default-album-art.png';
  // Fallback for title and artist if not present, and ensure correct property names
  const cardArtist = artist || 'Unknown Artist';
  const cardTitle = title || 'Unknown Title';

  const handlePlayPauseClick = () => {
    // MusicCard 的职责是告诉父组件哪个 Track 被点击了播放/暂停
    // 注意：在这里传递的 Track 对象中，audioUrl 和 duration 可能只是一个占位符或部分信息，
    // 因为 Home 组件会根据 id 找到 tracks 数组中完整的 Track 对象。
    // 但是为了满足 onPlayPause: (track: Track) => void 的类型签名，我们需要构造一个 Track 对象。
    // 在 page.tsx 中，我们已经确保了 `handlePlayPauseFromCard` 会从 `tracks` 数组中找到完整的 Track。
    onPlayPause({ 
      id, 
      title, 
      artist, 
      coverImage, 
      audioUrl: '', // MusicCard 不直接拥有 audioUrl，所以这里可以是空字符串
      duration: 0,   // MusicCard 也不直接拥有 number 类型的 duration，所以这里可以是 0
      isLiked, 
      likes 
    }); 
  };

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
            onClick={handlePlayPauseClick} // 直接调用处理函数
            className="bg-primary text-white p-4 rounded-full text-2xl shadow-xl hover:bg-primary-dark transition-colors duration-200"
            aria-label={isPlaying ? '暂停' : '播放'}
          >
            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-white mb-1 truncate">{cardTitle}</h3>
        <p className="text-gray-400 text-sm truncate">{cardArtist}</p>
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center text-gray-400 text-sm">
            <span className="mr-2">{duration}</span> {/* duration 现在直接是字符串，无需再次格式化 */}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLikeToggle(id);
              }}
              className={`flex items-center text-lg ${isLiked ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 transition-colors duration-200`}
              aria-label={isLiked ? '取消喜欢' : '喜欢'}
            >
              <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} /> {likes || 0} {/* 确保 likes 有回退值 */}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShare(id);
              }}
              className="text-gray-400 hover:text-primary transition-colors duration-200 text-lg"
              aria-label="分享"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MusicCard;
