'use client'

import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import TrackCard from '../../components/TrackCard'
import AudioPlayer from '../../components/AudioPlayer'
import { Track, supabase } from '@/lib/supabase'

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('songs')
  const [tracks, setTracks] = useState<Track[]>([])
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [loading, setLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  const tabs = [
    { id: 'songs', label: '歌曲' },
    { id: 'artists', label: '艺术家' },
    { id: 'genres', label: '分类' },
  ]

  const hotSearches = ['流行音乐', 'DJ 混音', '缅甸歌曲', '电子音乐', '摇滚', '爵士', '古典', '民谣']

  useEffect(() => {
    // 加载最近搜索记录
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch()
    } else {
      setTracks([])
    }
  }, [searchQuery, activeTab])

  const performSearch = async () => {
    setLoading(true)
    try {
      let query = supabase.from('tracks').select('*')

      if (activeTab === 'songs') {
        query = query.or(`title.ilike.%${searchQuery}%,artist.ilike.%${searchQuery}%,tags.cs.{${searchQuery}}`)
      } else if (activeTab === 'artists') {
        query = query.ilike('artist', `%${searchQuery}%`)
      } else if (activeTab === 'genres') {
        query = query.or(`genre.ilike.%${searchQuery}%,tags.cs.{${searchQuery}}`)
      }

      const { data, error } = await query.order('plays_count', { ascending: false }).limit(50)

      if (error) throw error
      setTracks(data || [])
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    
    // 保存到最近搜索
    if (query.trim() && !recentSearches.includes(query)) {
      const newRecentSearches = [query, ...recentSearches.slice(0, 9)]
      setRecentSearches(newRecentSearches)
      localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches))
    }
  }

  const clearRecentSearch = (index: number) => {
    const newRecentSearches = recentSearches.filter((_, i) => i !== index)
    setRecentSearches(newRecentSearches)
    localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches))
  }

  const handlePlayTrack = (track: Track) => {
    setCurrentTrack(track)
    // 增加播放次数
    updatePlayCount(track.id)
  }

  const updatePlayCount = async (trackId: string) => {
    try {
      await supabase.rpc('increment_play_count', { track_id: trackId })
    } catch (error) {
      console.error('Error updating play count:', error)
    }
  }

  return (
    <Layout>
      <div className="p-4">
        {/* 搜索框 */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索歌曲、艺术家、分类..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
              className="w-full bg-gray-800 text-white px-4 py-3 pl-10 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
            />
            <span className="absolute left-3 top-3 text-gray-400">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
              >
                ❌
              </button>
            )}
          </div>
        </div>

        {/* 标签页 */}
        <div className="flex space-x-1 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 搜索结果 */}
        {searchQuery ? (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">搜索结果</h3>
              {tracks.length > 0 && (
                <span className="text-sm text-gray-400">找到 {tracks.length} 个结果</span>
              )}
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="loading-spinner"></div>
              </div>
            ) : tracks.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {tracks.map((track) => (
                  <TrackCard
                    key={track.id}
                    track={track}
                    onPlay={handlePlayTrack}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>没有找到相关内容</p>
                <p className="text-sm mt-2">试试其他关键词</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* 热门搜索 */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-4">热门搜索</h3>
              <div className="flex flex-wrap gap-2">
                {hotSearches.map((tag) => (
                  <button
                    key={tag}
                    className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-gray-700"
                    onClick={() => handleSearch(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* 最近搜索 */}
            {recentSearches.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-4">最近搜索</h3>
                <div className="space-y-2">
                  {recentSearches.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <button
                        onClick={() => handleSearch(item)}
                        className="flex-1 text-left text-sm"
                      >
                        {item}
                      </button>
                      <button
                        onClick={() => clearRecentSearch(index)}
                        className="text-gray-400 hover:text-white"
                      >
                        ❌
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setRecentSearches([])
                      localStorage.removeItem('recentSearches')
                    }}
                    className="w-full text-center text-sm text-gray-400 hover:text-white py-2"
                  >
                    清空搜索历史
                  </button>
                </div>
              </div>
            )}

            {/* 推荐分类 */}
            <div className="mt-8">
              <h3 className="text-lg font-bold mb-4">音乐分类</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: '流行音乐', icon: '🎤', count: '1.2K' },
                  { name: '电子音乐', icon: '🎧', count: '856' },
                  { name: '摇滚音乐', icon: '🎸', count: '432' },
                  { name: '爵士音乐', icon: '🎺', count: '298' },
                  { name: '古典音乐', icon: '🎼', count: '156' },
                  { name: '民谣音乐', icon: '🎵', count: '234' },
                ].map((category) => (
                  <button
                    key={category.name}
                    onClick={() => handleSearch(category.name)}
                    className="bg-gray-800 rounded-lg p-4 text-left hover:bg-gray-700 transition-colors"
                  >
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <h4 className="font-medium mb-1">{category.name}</h4>
                    <p className="text-sm text-gray-400">{category.count} 首歌曲</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 音频播放器 */}
      <AudioPlayer track={currentTrack} />
    </Layout>
  )
}

