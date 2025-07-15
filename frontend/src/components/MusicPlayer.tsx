'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  FaPlay, 
  FaPause, 
  FaStepForward, 
  FaStepBackward, 
  FaVolumeUp, 
  FaRandom, 
  FaRedo,
  FaHeart,
  FaRegHeart
} from 'react-icons/fa';
import { MusicPlayerProps } from '@/types';
import { motion } from 'framer-motion';

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  currentTrack,
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrevious
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isLiked, setIsLiked] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeated, setIsRepeated] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) {
    return null;
  }

  // 进度百分比
  const progressPercentage = (currentTime / currentTrack.duration) * 100;

  return (
    <motion.div 
      className="glass-panel neon-border fixed bottom-0 left-0 right-0 z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 25 }}
    >
      {/* 隐藏的音频元素 */}
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={onNext}
      />
      
      {/* 迷你播放器模式 */}
      <div className={`transition-all ${isExpanded ? 'hidden' : 'block'}`}>
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div 
                className="w-12 h-12 bg-cover bg-center rounded-lg"
                style={{ backgroundImage: `url(${currentTrack.cover})` }}
              />
              {isPlaying && (
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-success shadow-[0_0_8px_#00ff9d] animate-pulse"></div>
              )}
            </div>
            
            <div className="max-w-[200px]">
              <div className="font-bold truncate neon-text">{currentTrack.title}</div>
              <div className="text-sm text-gray-300 truncate">{currentTrack.artist}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              className="neon-btn text-sm p-2 rounded-full"
              onClick={isPlaying ? onPause : onPlay}
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            
            <button 
              className="neon-btn text-sm p-2 rounded-full"
              onClick={() => setIsExpanded(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* 完整播放器模式 */}
      <div className={`transition-all ${isExpanded ? 'block' : 'hidden'} p-5`}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div 
                className="w-20 h-20 bg-cover bg-center rounded-xl"
                style={{ backgroundImage: `url(${currentTrack.cover})` }}
              />
              <div className="absolute inset-0 rounded-xl shadow-[0_0_30px_rgba(106,17,203,0.7)] z-[-1]"></div>
            </div>
            
            <div>
              <div className="font-bold text-xl neon-text">{currentTrack.title}</div>
              <div className="text-gray-300">{currentTrack.artist}</div>
              
              <div className="flex items-center gap-2 mt-2">
                <button 
                  className="text-gray-300 hover:text-accent transition-colors"
                  onClick={() => setIsLiked(!isLiked)}
                >
                  {isLiked ? <FaHeart className="text-accent" /> : <FaRegHeart />}
                </button>
                <span className="text-sm">|</span>
                <span className="text-sm text-gray-400">
                  {Math.floor(currentTrack.plays / 1000)}K 播放
                </span>
              </div>
            </div>
          </div>
          
          <button 
            className="neon-btn p-2 rounded-full"
            onClick={() => setIsExpanded(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        {/* 进度条 */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(currentTrack.duration)}</span>
          </div>
          
          <div className="relative h-2 rounded-full bg-gray-700 overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-accent"
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.2 }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent border border-white/10"></div>
          </div>
          
          <input
            type="range"
            min="0"
            max={currentTrack.duration}
            value={currentTime}
            onChange={handleSeek}
            className="absolute w-full h-2 opacity-0 cursor-pointer"
            style={{ marginTop: '-8px' }}
          />
        </div>
        
        {/* 控制按钮 */}
        <div className="flex justify-center items-center gap-6 mb-6">
          <motion.button
            className={`neon-control-btn ${isShuffled ? 'text-accent' : 'text-gray-300'}`}
            onClick={() => setIsShuffled(!isShuffled)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaRandom className="text-xl" />
          </motion.button>
          
          <motion.button 
            className="neon-control-btn"
            onClick={onPrevious}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaStepBackward className="text-xl" />
          </motion.button>
          
          <motion.button
            className="neon-control-btn w-16 h-16 text-2xl"
            onClick={isPlaying ? onPause : onPlay}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPlaying ? <FaPause /> : <FaPlay className="ml-1" />}
          </motion.button>
          
          <motion.button 
            className="neon-control-btn"
            onClick={onNext}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaStepForward className="text-xl" />
          </motion.button>
          
          <motion.button
            className={`neon-control-btn ${isRepeated ? 'text-accent' : 'text-gray-300'}`}
            onClick={() => setIsRepeated(!isRepeated)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaRedo className="text-xl" />
          </motion.button>
        </div>
        
        {/* 音量控制 */}
        <div className="flex items-center gap-3">
          <FaVolumeUp className="text-gray-400 text-xl" />
          <div className="relative flex-grow">
            <div className="h-2 rounded-full bg-gray-700">
              <motion.div 
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                animate={{ width: `${volume}%` }}
                transition={{ duration: 0.2 }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent border border-white/10"></div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value))}
              className="absolute w-full h-2 opacity-0 cursor-pointer"
              style={{ top: '-4px' }}
            />
          </div>
          <span className="text-sm text-gray-400 w-10">{volume}%</span>
        </div>
      </div>
    </motion.div>
  );
};

export default MusicPlayer;
