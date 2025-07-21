'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle, List } from 'lucide-react';
import Image from 'next/image';

interface Track {
  id: string;
  title: string;
  artist: string;
  coverImage: string;
  audioUrl?: string;
  duration: number;
}

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
  
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex, isRepeat, isShuffle]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrackIndex]);
  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * tracks.length);
      setCurrentTrackIndex(randomIndex);
    } else {
      const nextIndex = (currentTrackIndex + 1) % tracks.length;
      setCurrentTrackIndex(nextIndex);
    }
    setIsPlaying(true);
  };
  
  const handlePrevious = () => {
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * tracks.length);
      setCurrentTrackIndex(randomIndex);
    } else {
      const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
      setCurrentTrackIndex(prevIndex);
    }
    setIsPlaying(true);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const progressBar = progressRef.current;
    if (!audio || !progressBar) return;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleImageError = () => setImageError(true);
