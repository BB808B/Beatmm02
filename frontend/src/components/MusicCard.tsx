'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, Pause, Heart, Share2 } from 'lucide-react'; // 确保 lucide-react 已安装
import { MusicCardProps, Track } from '@/types';
import { formatTime } from '@/utils/formatTime'; // 确保 formatTime 已正确实现并导入

const MusicCard: React.FC<MusicCardProps> = ({
  id,
  title,
  artist,
  coverImage,
  duration,
  isLiked,
  likes,
  isPlaying,
  onPlayPause,
  onLikeToggle,
  onShare,
}) => {
  const cardCoverImage = coverImage || '/images/default-album-art.png';
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
      duration: 0, // MusicCard 也不直接拥有 number 类型的 duration，所以这里可以是 0
      isLiked,
      likes,
    });
  };

  return (
    <motion.div
      // 应用 music-card-glass 类以实现玻璃拟态效果和报告中定义的悬停动画
      className="music-card-glass relative cursor-pointer group"
      // whileHover 的 scale 效果与 music-card-glass 中的 translateY 结合
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative overflow-hidden rounded-t-lg"> {/* 确保图片区域圆角和裁剪 */}
        <Image
          src={cardCoverImage}
          alt={cardTitle}
          width={500}
          height={500}
          className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* 渐变遮罩：在图片底部添加一个从透明到背景色的渐变，以增强视觉深度 */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* 播放/暂停按钮覆盖层 */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handlePlayPauseClick}
            // 使用主题色和阴影，保留原始按钮样式，因为 neon-icon-btn 适用于更小的图标
            className="bg-primary text-white p-4 rounded-full text-2xl shadow-xl hover:bg-primary-dark transition-colors duration-200"
            aria-label={isPlaying ? '暂停' : '播放'}
          >
            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
          </button>
        </div>
      </div>
      <div className="p-4">
        {/* 歌曲标题：使用主题主文本颜色 */}
        <h3 className="text-xl font-semibold text-text mb-1 truncate">{cardTitle}</h3>
        {/* 艺术家名称：使用主题次要文本颜色 */}
        <p className="text-text-secondary text-sm truncate">{cardArtist}</p>
        <div className="flex justify-between items-center mt-3">
          {/* 时长徽章：使用主题次要文本颜色 */}
          <div className="flex items-center text-text-secondary text-sm">
            <span className="mr-2">{duration}</span>
          </div>
          <div className="flex items-center space-x-3">
            {/* 喜欢按钮：根据 isLiked 状态使用强调色或次要文本颜色，悬停时使用强调色 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLikeToggle(id);
              }}
              className={`flex items-center text-lg ${isLiked ? 'text-accent' : 'text-text-secondary'} hover:text-accent transition-colors duration-200`}
              aria-label={isLiked ? '取消喜欢' : '喜欢'}
            >
              <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} /> {likes || 0}
            </button>
            {/* 分享按钮：使用次要文本颜色，悬停时使用主色调 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShare(id);
              }}
              className="text-text-secondary hover:text-primary transition-colors duration-200 text-lg"
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
