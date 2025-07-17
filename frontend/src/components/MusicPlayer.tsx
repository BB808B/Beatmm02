// src/components/MusicPlayer.tsx

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaVolumeUp, FaVolumeOff, FaRandom, FaRedo } from 'react-icons/fa';
import { Track } from '@/types'; // 确保 Track 类型被导入

interface MusicPlayerProps {
  currentTrack: Track;
  isPlaying: boolean;
  onPlayPause: () => void; // 只保留 onPlayPause，移除 onPlay 和 onPause
  onNext: () => void;
  onPrevious: () => void;
  progress: number;
  duration: number;
  onSeek: (event: React.ChangeEvent<HTMLInputElement>) => void;
  volume: number;
  onVolumeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLooping: boolean;
  onToggleLoop: () => void;
  shuffleMode: boolean;
  onToggleShuffle: () => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  currentTrack,
  isPlaying,
  onPlayPause, // 修正：只解构 onPlayPause
  onNext,
  onPrevious,
  progress,
  duration,
  onSeek,
  volume,
  onVolumeChange,
  isLooping,
  onToggleLoop,
  shuffleMode,
  onToggleShuffle,
}) => {
  // Helper to format time (e.g., 150 seconds -> 2:30)
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <motion.div
      className="flex items-center justify-between p-4 bg-gray-900 rounded-lg shadow-xl"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      {/* Track Info */}
      <div className="flex items-center space-x-4 flex-grow min-w-0">
        <div className="relative w-16 h-16 flex-shrink-0">
          <Image
            src={currentTrack.coverImage}
            alt={currentTrack.title}
            fill
            sizes="64px"
            style={{ objectFit: 'cover' }}
            className="rounded-md shadow-md"
          />
        </div>
        <div className="flex flex-col truncate">
          <h3 className="text-lg font-semibold text-white truncate">{currentTrack.title}</h3>
          <p className="text-sm text-gray-400 truncate">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-4 mx-4 flex-shrink-0">
        <motion.button
          onClick={onToggleShuffle}
          className={`p-2 rounded-full transition-colors duration-200 ${shuffleMode ? 'text-primary' : 'text-gray-400 hover:text-white'}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Toggle Shuffle"
        >
          <FaRandom className="text-lg" />
        </motion.button>

        <motion.button
          onClick={onPrevious}
          className="p-2 text-white hover:text-primary transition-colors duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Previous Track"
        >
          <FaStepBackward className="text-xl" />
        </motion.button>

        <motion.button
          onClick={onPlayPause}
          className="p-3 rounded-full bg-primary-dark text-white hover:bg-primary transition-colors duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <FaPause className="text-2xl" /> : <FaPlay className="text-2xl" />}
        </motion.button>

        <motion.button
          onClick={onNext}
          className="p-2 text-white hover:text-primary transition-colors duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Next Track"
        >
          <FaStepForward className="text-xl" />
        </motion.button>

        <motion.button
          onClick={onToggleLoop}
          className={`p-2 rounded-full transition-colors duration-200 ${isLooping ? 'text-primary' : 'text-gray-400 hover:text-white'}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Toggle Loop"
        >
          <FaRedo className="text-lg" />
        </motion.button>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center space-x-2 flex-grow mx-4">
        <span className="text-xs text-gray-400">{formatTime(progress)}</span>
        <input
          type="range"
          min="0"
          max={duration}
          value={progress}
          onChange={onSeek}
          className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none"
        />
        <span className="text-xs text-gray-400">{formatTime(duration)}</span>
      </div>

      {/* Volume Control */}
      <div className="flex items-center space-x-2 flex-shrink-0 min-w-[100px]">
        {volume > 0 ? <FaVolumeUp className="text-lg text-gray-400" /> : <FaVolumeOff className="text-lg text-gray-400" />}
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={onVolumeChange}
          className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer range-sm [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none"
        />
      </div>
    </motion.div>
  );
};

export default MusicPlayer;
