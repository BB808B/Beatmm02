'use client'

import { useState, useRef, useEffect } from 'react'
import { Track } from '@/lib/supabase'

interface AudioPlayerProps {
  track: Track | null
  onNext?: () => void
  onPrevious?: () => void
}

export default function AudioPlayer({ track, onNext, onPrevious }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', () => {
      setIsPlaying(false)
      onNext?.()
    })

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
    }
  }, [track, onNext])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = parseFloat(e.target.value)
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newVolume = parseFloat(e.target.value)
    audio.volume = newVolume
    setVolume(newVolume)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (!track) {
    return (
      <div className="fixed bottom-20 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4">
        <div className="text-center text-gray-400">
          <p>选择一首歌曲开始播放</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-20 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4 z-40">
      <audio ref={audioRef} src={track.audio_url} />
      
      {/* 歌曲信息 */}
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
          {track.cover_url ? (
            <img src={track.cover_url} alt={track.title} className="w-full h-full object-cover rounded-lg" />
          ) : (
            <span className="text-xl">🎵</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium truncate">{track.title}</h4>
          <p className="text-xs text-gray-400 truncate">{track.artist}</p>
        </div>
        <button className="text-gray-400 hover:text-white">
          ❤️
        </button>
      </div>

      {/* 进度条 */}
      <div className="mb-3">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="progress-bar w-full"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* 控制按钮 */}
      <div className="flex items-center justify-center space-x-6">
        <button
          onClick={onPrevious}
          className="text-gray-400 hover:text-white"
          disabled={!onPrevious}
        >
          ⏮️
        </button>
        <button
          onClick={togglePlay}
          className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700"
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        <button
          onClick={onNext}
          className="text-gray-400 hover:text-white"
          disabled={!onNext}
        >
          ⏭️
        </button>
      </div>

      {/* 音量控制 */}
      <div className="flex items-center space-x-2 mt-3">
        <span className="text-xs text-gray-400">🔊</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          className="progress-bar flex-1"
        />
      </div>
    </div>
  )
}

