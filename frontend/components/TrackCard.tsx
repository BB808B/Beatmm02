'use client'

import { Track } from '@/lib/supabase'

interface TrackCardProps {
  track: Track
  onPlay: (track: Track) => void
  onLike?: (trackId: string) => void
  isLiked?: boolean
  showArtist?: boolean
}

export default function TrackCard({ 
  track, 
  onPlay, 
  onLike, 
  isLiked = false, 
  showArtist = true 
}: TrackCardProps) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatPlays = (plays: number) => {
    if (plays >= 1000000) {
      return `${(plays / 1000000).toFixed(1)}M`
    } else if (plays >= 1000) {
      return `${(plays / 1000).toFixed(1)}K`
    }
    return plays.toString()
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 card-hover">
      {/* 封面和播放按钮 */}
      <div className="relative mb-3">
        <div className="w-full aspect-square bg-gray-700 rounded-lg overflow-hidden">
          {track.cover_url ? (
            <img 
              src={track.cover_url} 
              alt={track.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">
              🎵
            </div>
          )}
        </div>
        <button
          onClick={() => onPlay(track)}
          className="absolute bottom-2 right-2 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
        >
          ▶️
        </button>
        {track.is_vip_only && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
            VIP
          </div>
        )}
      </div>

      {/* 歌曲信息 */}
      <div className="space-y-1">
        <h3 className="font-medium text-white truncate">{track.title}</h3>
        {showArtist && (
          <p className="text-sm text-gray-400 truncate">{track.artist}</p>
        )}
        
        {/* 标签 */}
        {track.tags && track.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {track.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 统计信息 */}
        <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <span>▶️</span>
              <span>{formatPlays(track.plays_count)}</span>
            </span>
            <span className="flex items-center space-x-1">
              <span>❤️</span>
              <span>{track.likes_count}</span>
            </span>
          </div>
          <span>{formatDuration(track.duration)}</span>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-2">
            {onLike && (
              <button
                onClick={() => onLike(track.id)}
                className={`text-sm ${
                  isLiked ? 'text-red-400' : 'text-gray-400'
                } hover:text-red-400 transition-colors`}
              >
                {isLiked ? '❤️' : '🤍'}
              </button>
            )}
            <button className="text-gray-400 hover:text-white text-sm">
              💬
            </button>
            <button className="text-gray-400 hover:text-white text-sm">
              📤
            </button>
          </div>
          <button className="text-gray-400 hover:text-white text-sm">
            ⋯
          </button>
        </div>
      </div>
    </div>
  )
}

