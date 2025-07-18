'use client';

import React, { useState, useRef, useEffect, useCallback, ChangeEvent } from 'react';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaVolumeUp, FaVolumeMute, FaDownload } from 'react-icons/fa';
import { RiPlayListFill } from 'react-icons/ri';
import { MdOutlineLoop, MdOutlineShuffle } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { formatTime } from '@/utils/formatTime';
import { Track, MusicPlayerProps } from '@/types';

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
  const [previousVolume, setPreviousVolume] = useState(0.7);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [loopMode, setLoopMode] = useState<'off' | 'track' | 'playlist'>('off');
  const [shuffleMode, setShuffleMode] = useState(false);
  const [shuffledIndices, setShuffledIndices] = useState<number[]>(() => {
    if (tracks.length === 0) return [];
    const indices = Array.from({ length: tracks.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  });
  const historyRef = useRef<number[]>([]);
  const [historyPointer, setHistoryPointer] = useState(-1);

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
      audioRef.current.load();

      const newHistory = [...historyRef.current.slice(-99), currentTrackIndex];
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

  // 独立处理播放/暂停状态
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
        // 随机模式下播放完所有歌曲后，重新打乱并从头开始
        const newShuffled = Array.from({ length: tracks.length }, (_, i) => i);
        for (let i = newShuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [newShuffled[i], newShuffled[j]] = [newShuffled[j], newShuffled[i]];
        }
        setShuffledIndices(newShuffled);
        nextIndex = newShuffled[0]; // 从新打乱的列表第一首开始
      }
    } else {
      nextIndex = (currentTrackIndex + 1) % tracks.length; // 顺序播放下一首
    }

    // 如果是关闭循环模式且到达列表末尾（且非随机模式），则停止播放
    if (nextIndex === 0 && loopMode === 'off' && !shuffleMode) {
      setIsPlaying(false);
      setCurrentTime(0);
      setCurrentTrackIndex(0); // 可选：重置回第一首歌
      return;
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
      if (isPlaying || audioRef.current.autoplay) {
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
      audioRef.current.currentTime = parseFloat(e.target.value);
      setCurrentTime(parseFloat(e.target.value));
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
        audioRef.current.volume = previousVolume > 0 ? previousVolume : 0.7;
        setVolume(previousVolume > 0 ? previousVolume : 0.7);
      } else {
        setPreviousVolume(volume);
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

  // 循环模式切换 (关闭 -> 单曲循环 -> 列表循环 -> 关闭)
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
            // 打乱列表的其余部分
            for (let i = newShuffledIndices.length - 1; i > 1; i--) { // 从第二个元素开始打乱
                const j = Math.floor(Math.random() * (i - 1 + 1)) + 1; // 随机索引范围从 1 到 i
                [newShuffledIndices[i], newShuffledIndices[j]] = [newShuffledIndices[j], newShuffledIndices[i]];
            }
            setShuffledIndices(newShuffledIndices);
        } // 如果关闭随机播放，则 shuffledIndices 会被忽略，无需改变
        return !prev;
    });
  }, [currentTrackIndex, tracks.length]);

  // 如果没有选中歌曲，显示提示信息
  if (!currentTrack) {
    return (
      <div className="fixed bottom-0 left-0 right-0 glass-panel text-text p-4 flex items-center justify-center h-20 shadow-2xl z-50 rounded-t-xl">
        <p>No track selected. Please add tracks to the playlist.</p>
      </div>
    );
  }

  // 为防止 null/undefined 导致的问题，提供默认值
  const trackCoverImage = currentTrack.coverImage || '/images/default-album-art.png';
  const trackArtist = currentTrack.artist || 'Unknown Artist';
  const trackTitle = currentTrack.title || 'Unknown Title';

  return (
    <div className="fixed bottom-0 left-0 right-0 glass-panel text-text p-4 flex flex-col sm:flex-row items-center justify-between shadow-2xl z-50 rounded-t-xl">
      <audio ref={audioRef} />

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
            className="rounded-lg object-cover mr-4 shadow-md overflow-hidden"
          >
            <Image
              src={trackCoverImage}
              alt={trackTitle}
              width={64}
              height={64}
              className="w-full h-full" // 确保图片填充容器
            />
          </motion.div>
        </AnimatePresence>
        <div className="flex-1 min-w-0">
          <Link href={`/tracks/${currentTrack.id}`} className="text-lg font-bold truncate hover:text-primary transition-colors text-text">
            {trackTitle}
          </Link>
          <p className="text-sm text-text-secondary truncate">
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
            className={`neon-icon-btn ${
              loopMode !== 'off' ? 'text-primary' : 'text-text-secondary hover:text-text'
            }`}
            aria-label={`Loop mode: ${loopMode}`}
          >
            {loopMode === 'track' ? (
              <span className="relative">
                <MdOutlineLoop size={24} />
                <span className="absolute -top-1 -right-1 text-xs font-bold text-accent">1</span> {/* 单曲循环标记 */}
              </span>
            ) : (
              <MdOutlineLoop size={24} />
            )}
          </button>
          <button
            onClick={playPreviousTrack}
            className="neon-icon-btn text-text-secondary hover:text-text"
            aria-label="Previous track"
          >
            <FaStepBackward size={24} />
          </button>
          <button
            onClick={togglePlayPause}
            className="bg-primary text-white p-3 rounded-full hover:bg-opacity-80 transition-transform transform hover:scale-105 active:scale-95 shadow-[0_0_15px_var(--primary),_0_0_30px_var(--accent)]" // 播放/暂停按钮的霓虹光晕效果
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
          </button>
          <button
            onClick={playNextTrack}
            className="neon-icon-btn text-text-secondary hover:text-text"
            aria-label="Next track"
          >
            <FaStepForward size={24} />
          </button>
          <button
            onClick={toggleShuffleMode}
            className={`neon-icon-btn ${
              shuffleMode ? 'text-primary' : 'text-text-secondary hover:text-text'
            }`}
            aria-label={shuffleMode ? "Shuffle is on" : "Shuffle is off"}
          >
            <MdOutlineShuffle size={24} />
          </button>
        </div>

        {/* 进度条 */}
        <div className="flex items-center w-full space-x-2">
          <span className="text-xs text-text-secondary">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration.toString()}
            step="0.01"
            value={currentTime}
            onChange={onSeek}
            // 使用 CSS 变量和自定义样式实现自定义进度条样式
            className="w-full h-1 bg-[var(--surface-dark)] rounded-lg appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[var(--primary)] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg
                       [&::-moz-range-thumb]:bg-[var(--primary)] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-lg"
            style={{
              // 填充颜色使用 var(--primary)
              background: `linear-gradient(to right, var(--primary) ${((currentTime / duration) * 100) || 0}%, var(--surface-dark) ${((currentTime / duration) * 100) || 0}%)`
            }}
          />
          <span className="text-xs text-text-secondary">{formatTime(duration)}</span>
        </div>
      </div>

      {/* 右侧控制区域（下载、音量、播放列表） */}
      <div className="flex items-center justify-end w-full sm:w-1/3 space-x-4 mt-2 sm:mt-0 relative">
        <a
          href={currentTrack.audioUrl}
          download={`${currentTrack.title}.mp3`}
          className="neon-icon-btn text-text-secondary hover:text-text"
          aria-label={`Download ${trackTitle}`}
        >
          <FaDownload size={24} />
        </a>
        <div
          className="relative"
          onMouseEnter={() => setShowVolumeControl(true)}
          onMouseLeave={() => setShowVolumeControl(false)}
        >
          <button
            onClick={toggleMute}
            className="neon-icon-btn text-text-secondary hover:text-text"
            aria-label={isMuted || volume === 0 ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? <FaVolumeMute size={24} /> : <FaVolumeUp size={24} />}
          </button>
          <AnimatePresence>
            {showVolumeControl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-full mb-2 -translate-x-1/2 left-1/2 p-2 glass-panel rounded-lg shadow-xl flex items-center justify-center" // 音量控制面板也使用玻璃拟态效果
              >
                {/* 垂直音量滑块 */}
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={onVolumeChange}
                  // 使用 CSS 变量和自定义样式实现自定义滑块样式
                  className="w-2 h-24 bg-[var(--surface-dark)] rounded-lg appearance-none cursor-pointer transform rotate-[-90deg] origin-center
                                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[var(--primary)] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg
                                     [&::-moz-range-thumb]:bg-[var(--primary)] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-lg"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={onShowPlaylist}
          className="neon-icon-btn text-text-secondary hover:text-text"
          aria-label="Show playlist"
        >
          <RiPlayListFill size={24} />
        </button>
      </div>
    </div>
  );
};

export default MusicPlayer;
