// file: frontend/src/components/MusicPlayer.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaVolumeUp, FaVolumeMute, FaRedo, FaRandom, FaList } from 'react-icons/fa';
import Image from 'next/image';
import { Track } from '@/types';

interface MusicPlayerProps {
  currentTrack?: Track; // 当前播放的歌曲，可选
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ currentTrack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [imageError, setImageError] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // 当 currentTrack 变化时，更新音频源并尝试播放
    if (currentTrack) {
      audio.src = currentTrack.audioUrl || ''; // 假设 Track 包含 audioUrl
      audio.load(); // 重新加载音频
      audio.play().then(() => setIsPlaying(true)).catch(e => {
        console.error("Audio play failed:", e);
        setIsPlaying(false);
      });
      setCurrentTime(0);
      setDuration(0);
      setImageError(false);
    } else {
      audio.pause();
      setIsPlaying(false);
    }

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      setIsPlaying(false);
      // 这里可以添加播放下一首的逻辑，如果需要全局播放列表
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [isPlaying]);
  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const progressBar = progressRef.current;
    if (!audio || !progressBar || !duration) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleImageError = () => setImageError(true);
  
  // 如果没有 currentTrack，则不渲染播放器
  if (!currentTrack) {
    return (
      <div className="flex flex-col items-center space-y-1 w-full">
        <div className="flex items-center space-x-2 md:space-x-4">
          <button className="p-2 rounded-full text-gray-600 cursor-not-allowed"><FaRandom size={18} /></button>
          <button className="p-2 rounded-full text-gray-600 cursor-not-allowed"><FaStepBackward size={20} /></button>
          <button className="bg-gray-700 text-gray-500 w-10 h-10 flex items-center justify-center rounded-full cursor-not-allowed">
            <FaPlay size={20} />
          </button>
          <button className="p-2 rounded-full text-gray-600 cursor-not-allowed"><FaStepForward size={20} /></button>
          <button className="p-2 rounded-full text-gray-600 cursor-not-allowed"><FaRedo size={18} /></button>
        </div>
        <div className="flex items-center space-x-2 w-full max-w-xs">
          <span className="text-xs text-gray-600 w-10 text-right">0:00</span>
          <div className="flex-1 h-1 bg-gray-800 rounded-full"></div>
          <span className="text-xs text-gray-600 w-10">0:00</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-1 w-full">
      <audio ref={audioRef} preload="metadata" onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
      
      <div className="flex items-center space-x-2 md:space-x-4">
        <button onClick={() => setIsShuffle(!isShuffle)} className={`p-2 rounded-full transition-colors ${isShuffle ? 'text-accent-color-1' : 'text-text-secondary hover:text-text-primary'}`}><FaRandom size={18} /></button>
        <button onClick={() => { /* handlePrevious */ }} className="p-2 rounded-full text-text-secondary hover:text-text-primary transition-colors"><FaStepBackward size={20} /></button>
        <button onClick={togglePlay} className="play-button w-14 h-14 flex items-center justify-center rounded-full">
          {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} className="ml-1" />}
        </button>
        <button onClick={() => { /* handleNext */ }} className="p-2 rounded-full text-text-secondary hover:text-text-primary transition-colors"><FaStepForward size={20} /></button>
        <button onClick={() => setIsRepeat(!isRepeat)} className={`p-2 rounded-full transition-colors ${isRepeat ? 'text-accent-color-1' : 'text-text-secondary hover:text-text-primary'}`}><FaRedo size={18} /></button>
      </div>
      <div className="flex items-center space-x-2 w-full max-w-xs">
        <span className="text-xs text-text-secondary w-10 text-right">{formatTime(currentTime)}</span>
        <div ref={progressRef} onClick={handleProgressClick} className="progress-bar-container flex-1">
          <div className="progress-bar-fill" style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }} />
        </div>
        <span className="text-xs text-text-secondary w-10">{formatTime(duration)}</span>
      </div>
      <div className="flex items-center space-x-2">
        <button onClick={() => setIsMuted(!isMuted)} className="p-2 text-text-secondary hover:text-text-primary">{isMuted || volume === 0 ? <FaVolumeMute size={18} /> : <FaVolumeUp size={18} />}</button>
        <input 
          type="range" 
          min="0" max="1" step="0.01" 
          value={isMuted ? 0 : volume} 
          onChange={(e) => setVolume(parseFloat(e.target.value))} 
          className="w-20 md:w-24 h-1 bg-background-secondary rounded-lg appearance-none cursor-pointer accent-accent-color-1"
        />
        {/* <button onClick={() => { /* onShowPlaylist */ /*}} className="p-2 rounded-full text-text-secondary hover:text-text-primary transition-colors"><FaList size={18} /></button> */}
      </div>
    </div>
  );
};

export default MusicPlayer;


