'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Heart, Share2, Download } from 'lucide-react'; // 确保 lucide-react 已安装
import { MusicCardProps } from '@/types'; // 导入 MusicCardProps
import MusicVisualizer from './MusicVisualizer'; // 导入 MusicVisualizer 组件

const MusicCard: React.FC<MusicCardProps> = ({
  id,
  title,
  artist,
  coverImage,
  duration, // 根据 types/index.ts，这里现在是 number 类型
  isLiked,
  likes,
  isPlaying,
  onPlay, // 修改为 onPlay
  onPause, // 修改为 onPause
  onLike, // 修改为 onLike
  onShare, // 修改为 onShare
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  // 处理播放/暂停点击事件
  const handlePlayPauseClick = () => {
    // MusicCard 的职责是通知父组件哪个 Track 被点击了播放/暂停
    if (isPlaying) {
      onPause?.(id); // 调用 onPause prop，传递 trackId
    } else {
      onPlay?.(id); // 调用 onPlay prop，传递 trackId
    }
  };

  // 处理图片加载错误，显示默认封面
  const handleImageError = () => {
    setImageError(true);
  };

  // 格式化时长函数，将秒数转换为 MM:SS 格式
  const formatDuration = (timeInSeconds: number): string => {
    if (isNaN(timeInSeconds) || timeInSeconds < 0) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // 使用默认值，防止 undefined 导致渲染问题
  const cardCoverImage = imageError ? '/images/default-album-art.png' : coverImage;
  const cardArtist = artist || 'Unknown Artist';
  const cardTitle = title || 'Unknown Title';

  return (
    <motion.div
      // 应用 music-card 类以实现玻璃拟态效果和报告中定义的悬停动画
      className="music-card relative cursor-pointer group" // 使用 globals.css 中定义的 music-card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }} // 保持与 globals.css 中的 translateY(-4px) 效果一致
    >
      <div className="relative overflow-hidden rounded-t-lg"> {/* 确保图片区域圆角和裁剪 */}
        <Image
          src={cardCoverImage}
          alt={cardTitle}
          width={500}
          height={500}
          className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
          onError={handleImageError}
        />
        {/* 渐变遮罩：在图片底部添加一个从透明到背景色的渐变，以增强视觉深度 */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-gray-900 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* 播放/暂停按钮覆盖层 */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handlePlayPauseClick}
            // 使用 globals.css 中定义的 play-button 样式
            className="play-button w-12 h-12" // 使用 play-button 类，其样式在 globals.css 中定义
            aria-label={isPlaying ? '暂停' : '播放'}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />} {/* 保持图标大小与 globals.css 中的 play-button 一致 */}
          </button>
        </div>

        {/* 音乐可视化器 */}
        {isPlaying && (
          <div className="absolute bottom-3 left-3">
            <MusicVisualizer isPlaying={isPlaying} size="sm" />
          </div>
        )}

        {/* 时长徽章 */}
        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
          {formatDuration(duration)} {/* 使用格式化函数 */}
        </div>
      </div>

      <div className="p-4">
        {/* 歌曲标题 */}
        <h3 className="text-xl font-semibold text-white mb-1 truncate">{cardTitle}</h3> {/* 直接使用 Tailwind 颜色 */}
        {/* 艺术家名称 */}
        <p className="text-gray-400 text-sm truncate">{cardArtist}</p> {/* 直接使用 Tailwind 颜色 */}
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center space-x-3">
            {/* 喜欢按钮 */}
            <motion.button
              onClick={(e) => {
                e.stopPropagation(); // 阻止事件冒泡到卡片本身
                onLike?.(id); // 调用 onLike prop
              }}
              className={`p-2 rounded-full transition-colors ${
                isLiked
                  ? 'text-red-500 hover:text-red-400' // 使用 Tailwind 红色
                  : 'text-gray-400 hover:text-white' // 使用 Tailwind 灰色
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
            </motion.button>
            {/* 分享按钮 */}
            <motion.button
              onClick={(e) => {
                e.stopPropagation(); // 阻止事件冒泡到卡片本身
                onShare?.(id); // 调用 onShare prop
              }}
              className="p-2 rounded-full text-gray-400 hover:text-white transition-colors" // 使用 Tailwind 颜色
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Share2 size={16} />
            </motion.button>
          </div>

          <motion.button
            className="p-2 rounded-full text-gray-400 hover:text-white transition-colors" // 使用 Tailwind 颜色
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Download size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default MusicCard;
