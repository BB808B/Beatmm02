'use client';

import React, { useState, useRef, useEffect, useCallback, ChangeEvent } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle, List, Download } from 'lucide-react'; // 导入 Lucide React 图标
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Track, MusicPlayerProps } from '@/types';
import MusicVisualizer from './MusicVisualizer'; // 导入 MusicVisualizer 组件

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  tracks,
  onShowPlaylist,
  currentTrackIndex,
  setCurrentTrackIndex,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(0.7); // 用于静音前的音量
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [loopMode, setLoopMode] = useState<'off' | 'track' | 'playlist'>('off');
  const [shuffleMode, setShuffleMode] = useState(false);
  const [shuffledIndices, setShuffledIndices] = useState<number[]>(() => {
    if (tracks.length === 0) return [];
    const indices = Array.from({ length: tracks.length }, (_, i) => i);
    // 初始打乱，确保不会因为 useEffect 的依赖而重复执行
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  });
  const historyRef = useRef<number[]>([]); // 播放历史
  const [historyPointer, setHistoryPointer] = useState(-1); // 历史指针

  const currentTrack = tracks[currentTrackIndex];

  // 当 tracks 数组长度变化时，重新打乱播放顺序
  useEffect(() => {
    if (tracks.length > 0) {
      const indices = Array.from({ length: tracks.length }, (_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      setShuffledIndices(indices);
    }
  }, [tracks.length]);

  // 处理当前歌曲变化时的逻辑
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack.audioUrl;
      audioRef.current.load(); // 重新加载音频

      // 更新播放历史
      const newHistory = [...historyRef.current.slice(-99), currentTrackIndex]; // 最多保留99首历史
      historyRef.current = newHistory;
      setHistoryPointer(newHistory.length - 1);

      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Error playing audio:", e, currentTrack));
      } else {
        // 如果当前未播放，在新歌曲加载后保持暂停并重置时间
        audioRef.current.pause();
        setCurrentTime(0);
      }
    } else if (audioRef.current && !currentTrack) {
      // 处理没有歌曲被选中时的状态清理
      audioRef.current.pause();
      audioRef.current.src = ''; // 清除音频源
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [currentTrack, currentTrackIndex]); // isPlaying 已从依赖中移除以避免不必要的重载

  // 独立处理播放/暂停状态（确保播放器在外部控制时也能响应）
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Error playing audio:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // 播放/暂停切换
  const togglePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (!currentTrack) return; // 没有歌曲时禁止播放
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Error playing audio:", e));
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying, currentTrack]);

  // 实时更新播放时间
  const onTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, []);

  // 播放下一首歌曲的逻辑
  const playNextTrack = useCallback(() => {
    if (tracks.length === 0) return;

    let nextIndex;

    if (loopMode === 'track') {
      nextIndex = currentTrackIndex; // 单曲循环：保持当前歌曲索引不变
    } else if (shuffleMode && shuffledIndices.length > 0) {
      const currentShuffledIdx = shuffledIndices.indexOf(currentTrackIndex);
      if (currentShuffledIdx !== -1 && currentShuffledIdx < shuffledIndices.length - 1) {
        nextIndex = shuffledIndices[currentShuffledIdx + 1];
      } else {
        // 随机模式下播放完所有歌曲后，如果不是列表循环，则停止或重新打乱
        if (loopMode === 'playlist') {
          // 列表循环：重新打乱并从头开始
          const newShuffled = Array.from({ length: tracks.length }, (_, i) => i);
          for (let i = newShuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newShuffled[i], newShuffled[j]] = [newShuffled[j], newShuffled[i]];
          }
          setShuffledIndices(newShuffled);
          nextIndex = newShuffled[0]; // 从新打乱的列表第一首开始
        } else {
          // 非列表循环，随机播放完所有歌曲后停止
          setIsPlaying(false);
          setCurrentTime(0);
          setCurrentTrackIndex(0); // 可选：重置回第一首歌
          return;
        }
      }
    } else {
      // 顺序播放下一首
      nextIndex = (currentTrackIndex + 1) % tracks.length;
      // 如果是关闭循环模式且到达列表末尾，则停止播放
      if (nextIndex === 0 && loopMode === 'off') {
        setIsPlaying(false);
        setCurrentTime(0);
        setCurrentTrackIndex(0); // 可选：重置回第一首歌
        return;
      }
    }

    setCurrentTrackIndex(nextIndex);
    setIsPlaying(true); // 确保下一首歌曲开始播放
  }, [currentTrackIndex, tracks.length, setCurrentTrackIndex, shuffleMode, shuffledIndices, loopMode]);

  // 歌曲播放结束时的处理
  const onEnded = useCallback(() => {
    playNextTrack(); // 直接调用播放下一首的逻辑
  }, [playNextTrack]);

  // 歌曲元数据加载完成时的处理
  const onLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      if (isPlaying || audioRef.current.autoplay) { // 如果已经处于播放状态或者设置了自动播放
        audioRef.current.play().catch(e => console.error("Error playing audio after metadata load:", e));
      }
    }
  }, [isPlaying]);

  // 添加和移除音频事件监听器
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('timeupdate', onTimeUpdate);
      audio.addEventListener('ended', onEnded);
      audio.addEventListener('loadedmetadata', onLoadedMetadata);
      return () => {
        audio.removeEventListener('timeupdate', onTimeUpdate);
        audio.removeEventListener('ended', onEnded);
        audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      };
    }
  }, [onTimeUpdate, onEnded, onLoadedMetadata]);

  // 进度条拖动
  const onSeek = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = parseFloat(e.target.value);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  }, []);

  // 音量改变
  const onVolumeChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
      if (newVolume > 0 && isMuted) {
        setIsMuted(false);
      } else if (newVolume === 0 && !isMuted) {
        setIsMuted(true);
      }
    }
  }, [isMuted]);

  // 静音/取消静音切换
  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = previousVolume > 0 ? previousVolume : 0.7; // 恢复到静音前的音量，如果为0则默认为0.7
        setVolume(previousVolume > 0 ? previousVolume : 0.7);
      } else {
        setPreviousVolume(volume); // 记录当前音量
        audioRef.current.volume = 0;
        setVolume(0);
      }
      setIsMuted(!isMuted);
    }
  }, [isMuted, volume, previousVolume]);

  // 播放上一首歌曲的逻辑
  const playPreviousTrack = useCallback(() => {
    if (tracks.length === 0) return;

    if (currentTime > 3) { // 如果当前歌曲已播放超过3秒，则重头播放
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
      setCurrentTime(0);
      setIsPlaying(true);
    } else if (historyPointer > 0) { // 如果有历史记录，则返回上一首
      const prevIndexInHistory = historyRef.current[historyPointer - 1];
      setCurrentTrackIndex(prevIndexInHistory);
      setHistoryPointer(prevHistoryPointer => prevHistoryPointer - 1);
      setIsPlaying(true);
    } else { // 否则，切换到列表中的上一首
      const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
      setCurrentTrackIndex(prevIndex);
      setIsPlaying(true);
    }
  }, [currentTrackIndex, tracks.length, setCurrentTrackIndex, currentTime, historyPointer]);

  // 循环模式切换 (off -> track -> playlist -> off)
  const toggleLoopMode = useCallback(() => {
    setLoopMode((prevMode) => {
      if (prevMode === 'off') return 'track';
      if (prevMode === 'track') return 'playlist';
      return 'off';
    });
  }, []);

  // 随机播放模式切换
  const toggleShuffleMode = useCallback(() => {
    setShuffleMode((prev) => {
      if (!prev) { // 如果开启随机播放
        const newShuffledIndices = Array.from({ length: tracks.length }, (_, i) => i);
        // 确保当前歌曲是打乱列表的第一个元素
        const currentTrackIdxInShuffled = newShuffledIndices.indexOf(currentTrackIndex);
        if (currentTrackIdxInShuffled !== -1) {
          [newShuffledIndices[0], newShuffledIndices[currentTrackIdxInShuffled]] = [newShuffledIndices[currentTrackIdxInShuffled], newShuffledIndices[0]];
        }
        // 打乱列表的其余部分（从第二个元素开始打乱）
        for (let i = newShuffledIndices.length - 1; i > 1; i--) {
          const j = Math.floor(Math.random() * (i - 1 + 1)) + 1; // 随机索引范围从 1 到 i
          [newShuffledIndices[i], newShuffledIndices[j]] = [newShuffledIndices[j], newShuffledIndices[i]];
        }
        setShuffledIndices(newShuffledIndices);
      } // 如果关闭随机播放，则 shuffledIndices 会被忽略，无需改变
      return !prev;
    });
  }, [currentTrackIndex, tracks.length]);

  // 格式化时间函数 (MM:SS)
  const formatTime = (time: number): string => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // 如果没有选中歌曲，显示提示信息
  if (!currentTrack) {
    return (
      <div className="fixed bottom-0 left-0 right-0 player-container text-white p-4 flex items-center justify-center h-20 shadow-2xl z-50 rounded-t-xl">
        <p>No track selected. Please add tracks to the playlist.</p>
      </div>
    );
  }

  // 为防止 null/undefined 导致的问题，提供默认值
  const trackCoverImage = currentTrack.coverImage || '/images/default-album-art.png';
  const trackArtist = currentTrack.artist || 'Unknown Artist';
  const trackTitle = currentTrack.title || 'Unknown Title';

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 player-container z-40" // 使用 globals.css 中定义的 player-container
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <audio ref={audioRef} />

      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between">
        {/* 歌曲信息区域 */}
        <div className="flex items-center w-full sm:w-1/3 mb-2 sm:mb-0">
          {/* 专辑封面动画：使用 AnimatePresence 实现切换歌曲时的平滑过渡 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack.id} // key 改变时触发动画
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="rounded-lg object-cover mr-4 shadow-md overflow-hidden relative" // 添加 relative
            >
              <Image
                src={trackCoverImage}
                alt={trackTitle}
                width={64}
                height={64}
                className="w-full h-full" // 确保图片填充容器
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/default-album-art.png'; // 错误时显示默认封面
                }}
              />
              {isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                  <MusicVisualizer isPlaying={isPlaying} size="sm" />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          <div className="flex-1 min-w-0">
            <Link href={`/tracks/${currentTrack.id}`} className="text-lg font-bold truncate hover:text-purple-400 transition-colors text-white"> {/* 使用 Tailwind 颜色 */}
              {trackTitle}
            </Link>
            <p className="text-sm text-gray-400 truncate"> {/* 使用 Tailwind 颜色 */}
              {trackArtist}
            </p>
          </div>
        </div>

        {/* 播放控制和进度条区域 */}
        <div className="flex flex-col items-center w-full sm:w-1/3 px-4">
          {/* 控制按钮 */}
          <div className="flex items-center space-x-4 mb-2">
            <button
              onClick={toggleLoopMode}
              className={`p-2 rounded-full transition-colors ${
                loopMode !== 'off' ? 'text-purple-400' : 'text-gray-400 hover:text-white' // 使用 Tailwind 颜色
              }`}
              aria-label={`Loop mode: ${loopMode}`}
            >
              {/* 根据 loopMode 显示不同的图标或指示 */}
              {loopMode === 'track' ? (
                <span className="relative">
                  <Repeat size={24} />
                  <span className="absolute -top-1 -right-1 text-xs font-bold text-cyan-400">1</span> {/* 单曲循环标记 */}
                </span>
              ) : loopMode === 'playlist' ? (
                <Repeat size={24} /> // 列表循环，只显示 Repeat 图标
              ) : (
                <Repeat size={24} /> // 关闭循环，只显示 Repeat 图标
              )}
            </button>
            <button
              onClick={playPreviousTrack}
              className="p-2 rounded-full text-gray-400 hover:text-white transition-colors" // 使用 Tailwind 颜色
              aria-label="Previous track"
            >
              <SkipBack size={24} />
            </button>
            <motion.button
              onClick={togglePlayPause}
              className="play-button w-12 h-12" // 使用 globals.css 中定义的 play-button 样式
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </motion.button>
            <button
              onClick={playNextTrack}
              className="p-2 rounded-full text-gray-400 hover:text-white transition-colors" // 使用 Tailwind 颜色
              aria-label="Next track"
            >
              <SkipForward size={24} />
            </button>
            <button
              onClick={toggleShuffleMode}
              className={`p-2 rounded-full transition-colors ${
                shuffleMode ? 'text-purple-400' : 'text-gray-400 hover:text-white' // 使用 Tailwind 颜色
              }`}
              aria-label={shuffleMode ? "Shuffle is on" : "Shuffle is off"}
            >
              <Shuffle size={24} />
            </button>
          </div>

          {/* 进度条 */}
          <div className="flex items-center w-full space-x-2">
            <span className="text-xs text-gray-400">{formatTime(currentTime)}</span> {/* 使用 Tailwind 颜色 */}
            <input
              type="range"
              min="0"
              max={duration.toString()}
              step="0.01"
              value={currentTime}
              onChange={onSeek}
              // 自定义进度条样式，使用 Tailwind 类和 CSS 变量
              className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer
                         [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg
                         [&::-moz-range-thumb]:bg-purple-500 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-lg"
              style={{
                // 填充颜色使用渐变
                background: `linear-gradient(to right, #8B5CF6 ${((currentTime / duration) * 100) || 0}%, #1a1a2e ${((currentTime / duration) * 100) || 0}%)`
              }}
            />
            <span className="text-xs text-gray-400">{formatTime(duration)}</span> {/* 使用 Tailwind 颜色 */}
          </div>
        </div>

        {/* 右侧控制区域（下载、音量、播放列表） */}
        <div className="flex items-center justify-end w-full sm:w-1/3 space-x-4 mt-2 sm:mt-0 relative">
          {currentTrack.audioUrl && ( // 只有当 audioUrl 存在时才显示下载按钮
            <a
              href={currentTrack.audioUrl}
              download={`${trackTitle}.mp3`}
              className="p-2 rounded-full text-gray-400 hover:text-white transition-colors" // 使用 Tailwind 颜色
              aria-label={`Download ${trackTitle}`}
            >
              <Download size={24} />
            </a>
          )}
          <div
            className="relative"
            onMouseEnter={() => setShowVolumeControl(true)}
            onMouseLeave={() => setShowVolumeControl(false)}
          >
            <button
              onClick={toggleMute}
              className="p-2 rounded-full text-gray-400 hover:text-white transition-colors" // 使用 Tailwind 颜色
              aria-label={isMuted || volume === 0 ? "Unmute" : "Mute"}
            >
              {isMuted || volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
            <AnimatePresence>
              {showVolumeControl && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-full mb-2 -translate-x-1/2 left-1/2 p-2 player-container rounded-lg shadow-xl flex items-center justify-center" // 音量控制面板使用 player-container 样式
                >
                  {/* 垂直音量滑块 */}
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={onVolumeChange}
                    // 自定义滑块样式，使用 Tailwind 类和 CSS 变量
                    className="w-2 h-24 bg-gray-700 rounded-lg appearance-none cursor-pointer transform rotate-[-90deg] origin-center
                               [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg
                               [&::-moz-range-thumb]:bg-purple-500 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-lg"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={onShowPlaylist}
            className="p-2 rounded-full text-gray-400 hover:text-white transition-colors" // 使用 Tailwind 颜色
            aria-label="Show playlist"
          >
            <List size={24} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MusicPlayer;
