'use client'

import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import TrackCard from '../components/TrackCard'
import AudioPlayer from '../components/AudioPlayer'
import { Track, supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Home() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    fetchTracks()
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  const fetchTracks = async () => {
    try {
      const { data, error } = await supabase
        .from('tracks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error
      setTracks(data || [])
    } catch (error) {
      console.error('Error fetching tracks:', error)
    } finally {
      setLoading(false)
    }
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

  const handleLikeTrack = async (trackId: string) => {
    if (!user) {
      // 跳转到登录页
      window.location.href = '/auth/login'
      return
    }

    try {
      // 检查是否已点赞
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('track_id', trackId)
        .eq('user_id', user.id)
        .single()

      if (existingLike) {
        // 取消点赞
        await supabase
          .from('likes')
          .delete()
          .eq('track_id', trackId)
          .eq('user_id', user.id)
      } else {
        // 添加点赞
        await supabase
          .from('likes')
          .insert({ track_id: trackId, user_id: user.id })
      }

      // 刷新数据
      fetchTracks()
    } catch (error) {
      console.error('Error handling like:', error)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="p-4 flex items-center justify-center min-h-screen">
          <div className="loading-spinner"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="p-4">
        {/* 头部 */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">BeatMM Pro</h1>
          <div className="flex space-x-4">
            <button className="text-gray-400">🔔</button>
            {user ? (
              <Link href="/profile" className="text-gray-400">
                👤
              </Link>
            ) : (
              <Link href="/auth/login" className="text-blue-400">
                登录
              </Link>
            )}
          </div>
        </header>

        {/* VIP 横幅 */}
        {!user?.is_vip && (
          <Link href="/vip" className="block mb-6">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-4">
              <h2 className="text-lg font-bold mb-2">升级 VIP 会员</h2>
              <p className="text-sm opacity-90 mb-3">享受无损音质、无广告播放</p>
              <div className="bg-white text-purple-600 px-4 py-2 rounded-full text-sm font-bold inline-block">
                立即升级
              </div>
            </div>
          </Link>
        )}

        {/* 快捷入口 */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Link href="/search" className="flex flex-col items-center p-3 bg-gray-800 rounded-lg">
            <span className="text-2xl mb-1">🔍</span>
            <span className="text-xs">搜索</span>
          </Link>
          <Link href="/upload" className="flex flex-col items-center p-3 bg-gray-800 rounded-lg">
            <span className="text-2xl mb-1">📤</span>
            <span className="text-xs">上传</span>
          </Link>
          <Link href="/live" className="flex flex-col items-center p-3 bg-gray-800 rounded-lg">
            <span className="text-2xl mb-1">📺</span>
            <span className="text-xs">直播</span>
          </Link>
          <Link href="/ranking" className="flex flex-col items-center p-3 bg-gray-800 rounded-lg">
            <span className="text-2xl mb-1">🏆</span>
            <span className="text-xs">排行</span>
          </Link>
        </div>

        {/* 推荐音乐 */}
        <section className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">为你推荐</h3>
            <Link href="/search" className="text-blue-400 text-sm">
              查看更多
            </Link>
          </div>
          
          {tracks.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {tracks.slice(0, 6).map((track) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  onPlay={handlePlayTrack}
                  onLike={handleLikeTrack}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>暂无音乐内容</p>
              <Link href="/upload" className="text-blue-400 mt-2 inline-block">
                上传第一首歌曲
              </Link>
            </div>
          )}
        </section>

        {/* 热门排行 */}
        <section className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">热门排行</h3>
            <Link href="/ranking" className="text-blue-400 text-sm">
              查看更多
            </Link>
          </div>
          
          <div className="space-y-3">
            {tracks
              .sort((a, b) => b.plays_count - a.plays_count)
              .slice(0, 5)
              .map((track, index) => (
                <div key={track.id} className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
                  <span className={`text-2xl font-bold ${
                    index === 0 ? 'text-yellow-400' : 
                    index === 1 ? 'text-gray-300' : 
                    index === 2 ? 'text-orange-400' : 'text-gray-500'
                  }`}>
                    {index + 1}
                  </span>
                  <div className="w-12 h-12 bg-gray-700 rounded overflow-hidden">
                    {track.cover_url ? (
                      <img src={track.cover_url} alt={track.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">🎵</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate">{track.title}</h4>
                    <p className="text-xs text-gray-400 truncate">{track.artist}</p>
                  </div>
                  <button 
                    onClick={() => handlePlayTrack(track)}
                    className="text-gray-400 hover:text-white"
                  >
                    ▶️
                  </button>
                </div>
              ))}
          </div>
        </section>

        {/* 直播预告 */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">直播预告</h3>
            <Link href="/live" className="text-blue-400 text-sm">
              查看更多
            </Link>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">LIVE</span>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">DJ 夜场音乐会</h4>
                <p className="text-xs text-gray-400">今晚 20:00 开始</p>
              </div>
              <Link href="/live" className="bg-red-600 text-white px-3 py-1 rounded text-xs">
                预约
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* 音频播放器 */}
      <AudioPlayer track={currentTrack} />
    </Layout>
  )
}

