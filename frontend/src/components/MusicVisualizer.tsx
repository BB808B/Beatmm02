'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MusicVisualizerProps } from '@/types'; // 确保 '@/types' 路径正确，并且 MusicVisualizerProps 已定义

const MusicVisualizer: React.FC<MusicVisualizerProps> = ({ isPlaying, size = 'md' }) => {
  const barCount = 5; // 可视化条的数量
  // 根据 size prop 调整基础高度、最大高度、条宽和间距
  const baseHeight = {
    xs: 4,
    sm: 6,
    md: 8,
    lg: 12,
  }[size];
  const maxHeight = {
    xs: 12,
    sm: 18,
    md: 24,
    lg: 36,
  }[size];
  const barWidth = {
    xs: 2,
    sm: 3,
    md: 4,
    lg: 5,
  }[size];
  const gap = {
    xs: 1,
    sm: 1.5,
    md: 2,
    lg: 3,
  }[size];

  // 定义动画变体
  const barVariants = {
    playing: (i: number) => ({
      height: [baseHeight, maxHeight, baseHeight], // 动画高度范围
      transition: {
        duration: 0.8, // 动画持续时间
        repeat: Infinity, // 无限重复
        ease: 'easeInOut', // 缓动函数
        delay: i * 0.1, // 错开动画，制造波浪效果
        repeatType: 'reverse', // 反向重复
      },
    }),
    paused: {
      height: baseHeight, // 暂停时保持基础高度
      transition: {
        duration: 0.3, // 暂停过渡时间
      },
    },
  };

  return (
    <div
      className="music-visualizer flex items-end" // 使用 globals.css 中定义的 music-visualizer 样式
      style={{ gap: `${gap}px`, height: `${maxHeight}px` }} // 动态设置间距和总高度
    >
      {Array.from({ length: barCount }).map((_, i) => (
        <motion.div
          key={i}
          className="visualizer-bar" // 使用 globals.css 中定义的 visualizer-bar 样式
          style={{ width: `${barWidth}px` }} // 动态设置条宽
          variants={barVariants} // 应用动画变体
          animate={isPlaying ? 'playing' : 'paused'} // 根据 isPlaying 状态选择动画
          custom={i} // 传递自定义值给动画变体（用于错开动画）
        />
      ))}
    </div>
  );
};

export default MusicVisualizer;
