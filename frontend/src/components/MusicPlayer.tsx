// file: frontend/src/components/MusicPlayer.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle, List } from 'lucide-react';
import Image from 'next/image';
import { Track } from '@/types'; // 从 types/index.ts 导入 Track 类型

interface MusicPlayerProps {
  tracks: Track[];
  currentTrackIndex: number;
  setCurrentTrackIndex: (index: number) => void;
  onShowPlaylist?: () => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  tracks,
  currentTrackIndex,
  setCurrentTrackIndex,
  onShowPlaylist,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [imageError, setImageError] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const currentTrack = tracks[currentTrackIndex];
  
  useEffect(() => {
    // 当歌曲切换时，重置图片错误状态
    setImageError(false);
    // 如果当前有歌曲，尝试播放
    if(currentTrack) {
      setIsPlaying(true);
    }
  }, [currentTrackIndex]);


  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleNext();
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex, isRepeat]); 

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack]); 
  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  // --- 这里是关键修改 ---
  const handleNext = () => {
    if (tracks.length === 0) return;
    let nextIndex;
    if (isShuffle) {
      do {
        nextIndex = Math.floor(Math.random() * tracks.length);
      } while (tracks.length > 1 && nextIndex === currentTrackIndex);
    } else {
      nextIndex = (currentTrackIndex + 1) % tracks.length;
    }
    // 直接传入计算好的数字
    setCurrentTrackIndex(nextIndex);
  };

  // --- 这里是关键修改 ---
  const handlePrevious = () => {
    if (tracks.length === 0) return;
    let prevIndex;
    if (isShuffle) {
      do {
        prevIndex = Math.floor(Math.random() * tracks.length);
      } while (tracks.length > 1 && prevIndex === currentTrackIndex);
    } else {
      prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    }
    // 直接传入计算好的数字
    setCurrentTrackIndex(prevIndex);
  };

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
  
  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-white/10 p-4 z-50">
      <audio ref={audioRef} src={currentTrack.audioUrl} preload="metadata" onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
      
      <div className="max-w-7xl mx-auto grid grid-cols-3 items-center gap-4">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="relative w-14 h-14 rounded-md overflow-hidden bg-gray-800 flex-shrink-0">
            {!imageError && currentTrack.coverImage ? (
              <Image src={currentTrack.coverImage} alt={currentTrack.title} fill sizes="56px" style={{ objectFit: 'cover' }} onError={handleImageError} />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-400 text-xs">No Image</div>
            )}
          </div>
          <div className="min-w-0">
            <h4 className="text-white font-medium truncate">{currentTrack.title}</h4>
            <p className="text-gray-400 text-sm truncate">{currentTrack.artist}</p>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-1">
            <div className="flex items-center space-x-2 md:space-x-4">
                <button onClick={() => setIsShuffle(!isShuffle)} className={`p-2 rounded-full transition-colors ${isShuffle ? 'text-green-500' : 'text-gray-400 hover:text-white'}`}><Shuffle size={18} /></button>
                <button onClick={handlePrevious} className="p-2 rounded-full text-gray-400 hover:text-white transition-colors"><SkipBack size={20} /></button>
                <button onClick={togglePlay} className="bg-white text-black w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors">
                  {isPlaying ? <Pause size={20} /> : <Play size={20} className="fill-black" />}
                </button>
                <button onClick={handleNext} className="p-2 rounded-full text-gray-400 hover:text-white transition-colors"><SkipForward size={20} /></button>
                <button onClick={() => setIsRepeat(!isRepeat)} className={`p-2 rounded-full transition-colors ${isRepeat ? 'text-green-500' : 'text-gray-400 hover:text-white'}`}><Repeat size={18} /></button>
            </div>
            <div className="flex items-center space-x-2 w-full max-w-xs">
                <span className="text-xs text-gray-400 w-10 text-right">{formatTime(currentTime)}</span>
                <div ref={progressRef} onClick={handleProgressClick} className="flex-1 h-1 bg-gray-600 rounded-full cursor-pointer group"><div className="h-full bg-white rounded-full group-hover:bg-green-500 transition-all" style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }} /></div>
                <span className="text-xs text-gray-400 w-10">{formatTime(duration)}</span>
            </div>
        </div>

        <div className="flex items-center space-x-2 justify-end">
          <button onClick={() => setIsMuted(!isMuted)} className="p-2 text-gray-400 hover:text-white">{isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}</button>
          <input 
            type="range" 
            min="0" max="1" step="0.01" 
            value={isMuted ? 0 : volume} 
            onChange={(e) => setVolume(parseFloat(e.target.value))} 
            className="w-20 md:w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-white"
          />
          <button onClick={onShowPlaylist} className="p-2 rounded-full text-gray-400 hover:text-white transition-colors"><List size={18} /></button>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
