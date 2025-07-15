'use client';

import React from 'react';
import { FaPlay, FaPause, FaHeart, FaRegHeart, FaShare } from 'react-icons/fa';
import Image from 'next/image';
import { MusicCardProps } from '@/types';
import { motion } from 'framer-motion';

const MusicCard: React.FC<MusicCardProps> = ({
  track,
  isPlaying,
  isCurrentTrack,
  onPlay,
  onPause,
  onLike,
  translations
}) => {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatPlays = (plays: number) => {
    if (plays >= 1000000) {
      return `${(plays / 1000000).toFixed(1)}M`;
    } else if (plays >= 1000) {
      return `${(plays / 1000).toFixed(1)}K`;
    }
    return plays.toString();
  };

  return (
    <motion.div 
      className="glass-panel h-full flex flex-col overflow-hidden"
      whileHover={{ y: -5, boxShadow: '0 0 25px rgba(106, 17, 203, 0.8)' }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative group">
        <Image
          src={track.cover}
          alt={track.title}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
          style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}
        />
        
        {/* 播放按钮覆盖层 */}
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <motion.button
            className="neon-btn rounded-full w-16 h-16 flex items-center justify-center"
            onClick={() => {
              if (isCurrentTrack && isPlaying) {
                onPause();
              } else {
                onPlay(track);
              }
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isCurrentTrack && isPlaying ? 
              <FaPause className="text-xl" /> : 
              <FaPlay className="text-xl ml-1" />
            }
          </motion.button>
        </div>

        {/* 播放状态指示器 */}
        {isCurrentTrack && (
          <div 
            className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium"
            style={{ 
              background: 'rgba(0, 255, 157, 0.2)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 0 10px rgba(0, 255, 157, 0.5)'
            }}
          >
            <span className="flex items-center gap-1">
              <span className="status-dot"></span>
              {isPlaying ? translations.player.play : translations.player.pause}
            </span>
          </div>
        )}

        {/* 播放次数 */}
        <div className="absolute bottom-3 left-3 px-2 py-1 rounded-full text-xs bg-black/50 backdrop-blur-sm">
          {formatPlays(track.plays)} {translations.common.plays || '播放'}
        </div>

        {/* 时长 */}
        <div className="absolute bottom-3 right-3 px-2 py-1 rounded-full text-xs bg-black/50 backdrop-blur-sm">
          {formatDuration(track.duration)}
        </div>
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <div className="mb-3 flex-grow">
          <h3 className="font-bold text-lg truncate neon-text">
            {track.title}
          </h3>
          <p className="text-gray-300 truncate">
            {track.artist}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <button
              className="text-gray-300 hover:text-accent transition-colors"
              onClick={() => onLike(track.id)}
            >
              <span className="flex items-center gap-1">
                {track.isLiked ? 
                  <FaHeart className="text-accent" /> : 
                  <FaRegHeart />
                }
                <span className="text-sm">{track.likes}</span>
              </span>
            </button>
            
            <button className="text-gray-300 hover:text-accent transition-colors">
              <FaShare />
            </button>
          </div>

          <motion.button
            className="neon-btn text-sm px-3 py-1.5 flex items-center gap-1"
            onClick={() => {
              if (isCurrentTrack && isPlaying) {
                onPause();
              } else {
                onPlay(track);
              }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isCurrentTrack && isPlaying ? 
              <><FaPause /> {translations.player.pause}</> : 
              <><FaPlay className="ml-0.5" /> {translations.player.play}</>
            }
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default MusicCard;
