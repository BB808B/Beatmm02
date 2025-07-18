// src/components/MusicPlayer.tsx

'use client';

import React, { useState, useRef, useEffect, useCallback, ChangeEvent } from 'react';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaVolumeUp, FaVolumeMute, FaDownload } from 'react-icons/fa';
import { RiPlayListFill } from 'react-icons/ri';
import { MdOutlineLoop, MdOutlineShuffle } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { formatTime } from '@/utils/formatTime';
import { Track, MusicPlayerProps } from '@/types'; // 导入 MusicPlayerProps

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
  // Initial shuffle indices when component mounts or tracks change
  const [shuffledIndices, setShuffledIndices] = useState<number[]>(() => {
    if (tracks.length === 0) return [];
    const indices = Array.from({ length: tracks.length }, (_, i) => i);
    // Fisher-Yates shuffle algorithm for initial random order
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  });
  const historyRef = useRef<number[]>([]); // Ref to store playback history
  const [historyPointer, setHistoryPointer] = useState(-1); // Pointer for historyRef

  const currentTrack = tracks[currentTrackIndex];

  // Update shuffled indices if tracks array length changes
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

  // Update audio source when currentTrack changes
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack.audioUrl; // 使用 audioUrl
      audioRef.current.load(); // Load the new track

      // Add current track to history, limit history size
      const newHistory = [...historyRef.current.slice(-99), currentTrackIndex];
      historyRef.current = newHistory;
      setHistoryPointer(newHistory.length - 1); // Update pointer to the end of history

      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Error playing audio:", e));
      } else {
        // If not playing, but a new track is selected, ensure it's ready to play
        // e.g., if a track is clicked from a playlist when player is paused
        setIsPlaying(false); // Ensure UI reflects paused state initially for new track if not auto-playing
      }
    }
  }, [currentTrack, currentTrackIndex]); // isPlaying removed from dependencies to prevent re-triggering load when play/pause toggles

  // Effect to handle play/pause state change from external (e.g., MusicCard)
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Error playing audio:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]); // Only respond to changes in isPlaying state

  // Handle play/pause toggle
  const togglePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Error playing audio:", e));
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  // Handle time updates
  const onTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, []);

  // Handle track ending
  const onEnded = useCallback(() => {
    setIsPlaying(false); // Stop playing first
    if (loopMode === 'track') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      playNextTrack(); // This will handle 'off' and 'playlist' loop modes
    }
  }, [loopMode, playNextTrack]);

  // Handle metadata loaded
  const onLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      if (isPlaying) { // Only attempt to play if it was already in playing state
        audioRef.current.play().catch(e => console.error("Error playing audio after metadata load:", e));
      }
    }
  }, [isPlaying]); // isPlaying is a dependency here because we decide to play based on its value

  // Attach/detach event listeners
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

  // Seek functionality
  const onSeek = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = parseFloat(e.target.value);
      setCurrentTime(parseFloat(e.target.value));
    }
  }, []);

  // Volume control
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

  // Toggle Mute
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

  // Play next track
  const playNextTrack = useCallback(() => {
    if (tracks.length === 0) return;

    let nextIndex;

    if (shuffleMode && shuffledIndices.length > 0) {
      const currentShuffledIdx = shuffledIndices.indexOf(currentTrackIndex);
      if (currentShuffledIdx !== -1 && currentShuffledIdx < shuffledIndices.length - 1) {
        nextIndex = shuffledIndices[currentShuffledIdx + 1];
      } else {
        // Reached end of shuffled list, reshuffle or loop playlist
        if (loopMode === 'playlist' || loopMode === 'off') { // If playlist loop or no loop, reshuffle
          const newShuffled = Array.from({ length: tracks.length }, (_, i) => i);
          for (let i = newShuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newShuffled[i], newShuffled[j]] = [newShuffled[j], newShuffled[i]];
          }
          setShuffledIndices(newShuffled);
          nextIndex = newShuffled[0];
          if (loopMode === 'off' && currentTrackIndex === newShuffled[newShuffled.length - 1]) {
            setIsPlaying(false); // Stop if at end of shuffled list and not looping
            setCurrentTime(0);
            return;
          }
        } else { // Loop mode 'track' handled by onEnded, 'off' handled above
            setIsPlaying(false);
            setCurrentTime(0);
            return;
        }
      }
    } else {
      nextIndex = (currentTrackIndex + 1) % tracks.length;
      if (nextIndex === 0 && loopMode === 'off') {
        setIsPlaying(false);
        setCurrentTime(0);
        return;
      }
    }
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(true);
  }, [currentTrackIndex, tracks.length, setCurrentTrackIndex, shuffleMode, shuffledIndices, loopMode]);


  // Play previous track
  const playPreviousTrack = useCallback(() => {
    if (tracks.length === 0) return;

    if (currentTime > 3) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
      setCurrentTime(0);
    } else if (historyPointer > 0) { // Go back in history
      const prevIndexInHistory = historyRef.current[historyPointer - 1];
      setCurrentTrackIndex(prevIndexInHistory);
      setHistoryPointer(historyPointer - 1); // Move history pointer back
      setIsPlaying(true);
    } else { // Go to previous track in sequence if no history or at start of history
      const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
      setCurrentTrackIndex(prevIndex);
      setIsPlaying(true);
    }
  }, [currentTrackIndex, tracks.length, setCurrentTrackIndex, currentTime, historyPointer]);

  // Toggle loop mode
  const toggleLoopMode = useCallback(() => {
    setLoopMode((prevMode) => {
      if (prevMode === 'off') return 'track';
      if (prevMode === 'track') return 'playlist';
      return 'off';
    });
  }, []);

  // Toggle shuffle mode
  const toggleShuffleMode = useCallback(() => {
    setShuffleMode((prev) => !prev);
    if (!shuffleMode) {
      // Generate initial shuffled indices when enabling shuffle
      const newShuffledIndices = Array.from({ length: tracks.length }, (_, i) => i);
      for (let i = newShuffledIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newShuffledIndices[i], newShuffledIndices[j]] = [newShuffledIndices[j], newShuffledIndices[i]];
      }
      setShuffledIndices(newShuffledIndices);
    }
  }, [shuffleMode, tracks.length]);

  if (!currentTrack) {
    return (
      <div className="bg-gray-800 text-white p-4 flex items-center justify-center h-20 shadow-lg rounded-t-lg">
        <p>No track selected. Please add tracks to the playlist.</p>
      </div>
    );
  }

  // Fallback for thumbnailUrl if not present
  const trackCoverImage = currentTrack.coverImage || '/images/default-album-art.png';
  // Fallback for album and artist if not present
  const trackArtist = currentTrack.artist || 'Unknown Artist';
  const trackTitle = currentTrack.title || 'Unknown Title';


  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 flex flex-col sm:flex-row items-center justify-between shadow-2xl z-50 rounded-t-xl">
      <audio ref={audioRef} />

      {/* Track Info */}
      <div className="flex items-center w-full sm:w-1/3 mb-2 sm:mb-0">
        <Image
          src={trackCoverImage} // 使用处理过的 coverImage
          alt={trackTitle} // 使用处理过的 title
          width={64}
          height={64}
          className="rounded-lg object-cover mr-4 shadow-md"
        />
        <div className="flex-1 min-w-0">
          <Link href={`/tracks/${currentTrack.id}`} className="text-lg font-bold truncate hover:text-primary transition-colors">
            {trackTitle}
          </Link>
          <p className="text-sm text-gray-400 truncate">
            {trackArtist}
          </p>
        </div>
      </div>

      {/* Controls & Progress Bar */}
      <div className="flex flex-col items-center w-full sm:w-1/3 px-4">
        {/* Controls */}
        <div className="flex items-center space-x-4 mb-2">
          <button
            onClick={toggleLoopMode}
            className={`p-2 rounded-full transition-colors duration-200 ${
              loopMode !== 'off' ? 'text-primary bg-gray-700' : 'text-gray-400 hover:text-white'
            }`}
            aria-label={`Loop mode: ${loopMode}`}
          >
            {loopMode === 'track' ? (
              <span className="relative">
                <MdOutlineLoop size={24} />
                <span className="absolute -top-1 -right-1 text-xs font-bold text-red-500">1</span>
              </span>
            ) : (
              <MdOutlineLoop size={24} />
            )}
          </button>
          <button
            onClick={playPreviousTrack}
            className="text-gray-300 hover:text-white transition-colors duration-200"
            aria-label="Previous track"
          >
            <FaStepBackward size={24} />
          </button>
          <button
            onClick={togglePlayPause}
            className="bg-primary text-white p-3 rounded-full hover:bg-opacity-80 transition-transform transform hover:scale-105 active:scale-95 shadow-lg"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
          </button>
          <button
            onClick={playNextTrack}
            className="text-gray-300 hover:text-white transition-colors duration-200"
            aria-label="Next track"
          >
            <FaStepForward size={24} />
          </button>
          <button
            onClick={toggleShuffleMode}
            className={`p-2 rounded-full transition-colors duration-200 ${
              shuffleMode ? 'text-primary bg-gray-700' : 'text-gray-400 hover:text-white'
            }`}
            aria-label={shuffleMode ? "Shuffle is on" : "Shuffle is off"}
          >
            <MdOutlineShuffle size={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center w-full space-x-2">
          <span className="text-xs text-gray-400">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration.toString()}
            step="0.01"
            value={currentTime}
            onChange={onSeek}
            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer progress-bar"
            style={{
              background: `linear-gradient(to right, var(--primary-color) ${((currentTime / duration) * 100) || 0}%, #4B5563 ${((currentTime / duration) * 100) || 0}%)`
            }}
          />
          <span className="text-xs text-gray-400">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center justify-end w-full sm:w-1/3 space-x-4 mt-2 sm:mt-0 relative">
        <a
          href={currentTrack.audioUrl}
          download={`${currentTrack.title}.mp3`} // Ensure a proper filename
          className="text-gray-300 hover:text-white transition-colors duration-200"
          aria-label={`Download ${currentTrack.title}`}
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
            className="text-gray-300 hover:text-white transition-colors duration-200"
            aria-label={isMuted ? "Unmute" : "Mute"}
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
                className="absolute bottom-full mb-2 -translate-x-1/2 left-1/2 p-2 bg-gray-700 rounded-lg shadow-xl flex items-center justify-center"
              >
                {/* Vertical volume slider */}
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={onVolumeChange}
                  className="w-24 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer transform rotate-[-90deg] origin-center
                             [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg
                             [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-lg"
                  style={{ '--primary-color': 'var(--tw-colors-primary)' } as React.CSSProperties} // Pass primary color via CSS var
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={onShowPlaylist}
          className="text-gray-300 hover:text-white transition-colors duration-200"
          aria-label="Show playlist"
        >
          <RiPlayListFill size={24} />
        </button>
      </div>
    </div>
  );
};

export default MusicPlayer;
