'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle, List } from 'lucide-react';
import Image from 'next/image';

// 定义歌曲的数据结构
interface Track {
  id: string;
  title: string;
  artist: string;
  coverImage: string;
  audioUrl?: string;
  duration: number;
}

// 定义播放器组件需要的属性
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

  // 用来引用 <audio> 元素
  const audioRef = useRef<HTMLAudioElement>(null);
  // 用来引用进度条的 <div> 元素
  const progressRef = useRef<HTMLDivElement>(null);

  const currentTrack = tracks[currentTrackIndex];

  // 当歌曲切换或重复/随机设置改变时，设置音频事件监听
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
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

    // 组件卸载时移除监听，防止内存泄漏
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex, isRepeat]); // isShuffle 在 handleNext/Previous 中处理，不需在此监听

  // 控制播放和暂停
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrackIndex]); // 依赖 currentTrackIndex 确保切歌后能自动播放

  // 控制音量
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // 播放/暂停切换函数
  const togglePlay = () => setIsPlaying(!isPlaying);

  // 下一曲
  const handleNext = () => {
    if (isShuffle) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * tracks.length);
      } while (tracks.length > 1 && randomIndex === currentTrackIndex); // 避免随机到同一首歌
      setCurrentTrackIndex(randomIndex);
    } else {
      setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
    }
    setIsPlaying(true);
  };

  // 上一曲
  const handlePrevious = () => {
    if (isShuffle) {
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * tracks.length);
        } while (tracks.length > 1 && randomIndex === currentTrackIndex);
        setCurrentTrackIndex(randomIndex);
    } else {
        setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + tracks.length) % tracks.length);
    }
    setIsPlaying(true);
  };

  // 点击进度条跳转
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

  // 格式化时间，从秒数变为 "分:秒"
  const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // 处理图片加载失败
  const handleImageError = () => setImageError(true);
  
  // 如果没有歌曲，不显示播放器
  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-white/10 p-4 z-50">
      <audio ref={audioRef} src={currentTrack.audioUrl} preload="metadata" onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
      
      <div className="max-w-7xl mx-auto grid grid-cols-3 items-center gap-4">
        {/* 左侧：歌曲信息 */}
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

        {/* 中间：播放控制器 */}
        <div className="flex flex-col items-center space-y-1">
            <div className="flex items-center space-x-2 md:space-x-4">
                <button onClick={() => setIsShuffle(!isShuffle)} className={`p-2 rounded-full transition-colors ${isShuffle ? 'text-green-500' : 'text-gray-400 hover:text-white'}`}><Shuffle size={18} /></button>
                <button onClick={handlePrevious} className="p-2 rounded-full text-gray-400 hover:text-white transition-colors"><SkipBack size={20} /></button>
                <button onClick={togglePlay} className="bg-white text-black w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors">
                  {/* 这里是修正后的代码 */}
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

        {/* 右侧：音量和列表 */}
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
