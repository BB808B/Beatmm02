'use client';

import React, { useEffect, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { MusicVisualizerProps } from '@/types'; // 确保导入 MusicVisualizerProps 接口

const MusicVisualizer: React.FC<MusicVisualizerProps> = ({ isPlaying, size = 'md', color = '#8B5CF6' }) => {
  const [barCount, setBarCount] = useState(10);
  const [barWidth, setBarWidth] = useState(5);
  const [spacing, setSpacing] = useState(3); // 間隔

  useEffect(() => {
    // 根据 size 调整条数和宽度
    switch (size) {
      case 'xs':
        setBarCount(6);
        setBarWidth(3);
        setSpacing(2);
        break;
      case 'sm':
        setBarCount(8);
        setBarWidth(4);
        setSpacing(2.5);
        break;
      case 'md':
        setBarCount(10);
        setBarWidth(5);
        setSpacing(3);
        break;
      case 'lg':
        setBarCount(12);
        setBarWidth(6);
        setSpacing(4);
        break;
      default:
        setBarCount(10);
        setBarWidth(5);
        setSpacing(3);
        break;
    }
  }, [size]);

  // 计算容器总宽度
  const containerWidth = barCount * barWidth + (barCount - 1) * spacing;

  const barVariants: Variants = {
    playing: (i: number) => ({
      height: [
        Math.random() * 80 + 20, // 初始高度
        Math.random() * 100 + 50, // 峰值
        Math.random() * 80 + 20, // 回落
      ],
      transition: {
        duration: Math.random() * 0.5 + 0.3, // 随机持续时间
        repeat: Infinity, // 无限重复
        ease: 'easeInOut', // 平滑动画
        delay: i * 0.1, // 每个条的延迟，形成错落效果
        repeatType: 'loop', // 将 repeatType 明确设置为 "loop"
      },
    }),
    paused: {
      height: 20, // 暂停时高度固定
      transition: {
        duration: 0.3, // 暂停动画持续时间
      },
    },
  };

  return (
    <div
      className="flex items-end justify-center"
      style={{
        height: '100%',
        width: `${containerWidth}px`,
        maxHeight: size === 'xs' ? '20px' : size === 'sm' ? '30px' : size === 'md' ? '40px' : '50px',
      }}
    >
      {Array.from({ length: barCount }).map((_, i) => (
        <motion.div
          key={i}
          className="visualizer-bar rounded-full" // 使用 globals.css 中定义的 visualizer-bar 样式
          style={{ width: `${barWidth}px`, backgroundColor: color, marginRight: i === barCount - 1 ? '0px' : `${spacing}px` }} // 动态设置条宽和颜色，调整右边距
          variants={barVariants} // 应用动画变体
          animate={isPlaying ? 'playing' : 'paused'} // 根据 isPlaying 状态选择动画
          custom={i} // 传递自定义值给动画变体（用于错开动画）
        />
      ))}
    </div>
  );
};

export default MusicVisualizer;
