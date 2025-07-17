// src/components/MusicPlayer.tsx

import React, { FC } from 'react';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaVolumeUp, FaVolumeMute, FaRandom, FaRedo } from 'react-icons/fa';
import Image from 'next/image';
import { Track } from '@/types'; // Ensure Track is imported

interface MusicPlayerProps {
  currentTrack: Track;
  isPlaying: boolean;
  onPlayPause: () => void;
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

const formatTime = (seconds: number) => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

const MusicPlayer: FC<MusicPlayerProps> = ({
  currentTrack,
  isPlaying,
  onPlayPause,
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
  return (
    <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg shadow-lg text-white mx-auto max-w-7xl">
      {/* Track Info */}
      <div className="flex items-center flex-grow min-w-0 mr-4">
        <Image
          src={currentTrack.coverImage || '/images/default-album.jpg'}
          alt={currentTrack.title}
          width={64}
          height={64}
          className="rounded-lg shadow-md flex-shrink-0"
        />
        <div className="ml-3 truncate">
          <h3 className="text-lg font-semibold truncate text-primary">{currentTrack.title}</h3>
          <p className="text-gray-400 text-sm truncate">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex flex-col items-center flex-grow-0 mx-4 w-full sm:w-auto">
        <div className="flex items-center space-x-4 mb-2">
          <button onClick={onPrevious} className="text-gray-400 hover:text-white transition-colors duration-200 text-xl">
            <FaStepBackward />
          </button>
          <button onClick={onPlayPause} className="bg-primary text-white p-3 rounded-full hover:bg-primary-dark transition-colors duration-200 text-2xl shadow-lg">
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button onClick={onNext} className="text-gray-400 hover:text-white transition-colors duration-200 text-xl">
            <FaStepForward />
          </button>
        </div>
        {/* Progress Bar */}
        <div className="flex items-center w-full">
          <span className="text-xs text-gray-400 mr-2 min-w-[30px] text-right">{formatTime(progress)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={progress}
            onChange={onSeek}
            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:rounded-full"
          />
          <span className="text-xs text-gray-400 ml-2 min-w-[30px]">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume and Options */}
      <div className="flex items-center space-x-4 ml-4">
        <div className="flex items-center group relative hidden md:flex">
          <button className="text-gray-400 hover:text-white text-xl">
            {volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
          <div className="absolute bottom-full mb-2 p-2 bg-gray-800 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={onVolumeChange}
              orient="vertical"
              className="w-2 h-24 bg-gray-700 rounded-lg appearance-none cursor-pointer volume-vertical [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg"
            />
          </div>
        </div>
        <button onClick={onToggleShuffle} className={`text-xl ${shuffleMode ? 'text-primary' : 'text-gray-400'} hover:text-white transition-colors duration-200`}>
          <FaRandom />
        </button>
        <button onClick={onToggleLoop} className={`text-xl ${isLooping ? 'text-primary' : 'text-gray-400'} hover:text-white transition-colors duration-200`}>
          <FaRedo />
        </button>
      </div>
    </div>
  );
};

export default MusicPlayer;
