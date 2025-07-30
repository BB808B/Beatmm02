'use client'

import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { Track, Comment, supabase } from '@/lib/supabase'

export default function Player() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(45)
  const [duration] = useState(180)
  const [showLyrics, setShowLyrics] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkUser()
    // 从 localStorage 获取当前播放的歌曲
    const savedTrack = localStorage.getItem('currentTrack')
    if (savedTrack) {
      const track = JSON.parse(savedTrack)
      setCurrentTrack(track)
      fetchComments(track.id)
    }
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  const fetchComments = async (trackId: string) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          users (
            username,
            avatar_url
          )
        `)
        .eq('track_id', trackId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setComments(data || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  const handleAddComment = async () => {
    if (!user || !currentTrack || !newComment.trim()) return

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          content: newComment.trim(),
          track_id: currentTrack.id,
          user_id: user.id
        })

      if (error) throw error

      setNewComment('')
      fetchComments(currentTrack.id)
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  const handleLikeTrack = async () => {
    if (!user || !currentTrack) return

    try {
      // 检查是否已点赞
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('track_id', currentTrack.id)
        .eq('user_id', user.id)
        .single()

      if (existingLike) {
        // 取消点赞
        await supabase
          .from('likes')
          .delete()
          .eq('track_id', currentTrack.id)
          .eq('user_id', user.id)
      } else {
        // 添加点赞
        await supabase
          .from('likes')
          .insert({ track_id: currentTrack.id, user_id: user.id })
      }
    } catch (error) {
      console.error('Error handling like:', error)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60))
      return `${minutes}分钟前`
    } else if (hours < 24) {
      return `${hours}小时前`
    } else {
      const days = Math.floor(hours / 24)
      return `${days}天前`
    }
  }

  if (!currentTrack) {
    return (
      <Layout>
        <div className="p-4 flex items-center justify-center min-h-screen">
          <div className="text-center text-gray-400">
            <div className="text-6xl mb-4">🎵</div>
            <p className="text-lg mb-2">暂无播放内容</p>
            <p className="text-sm">去首页选择一首歌曲开始播放</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="p-4">
        {/* 专辑封面 */}
        <div className="flex justify-center mb-6">
          <div className="w-64 h-64 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg shadow-2xl flex items-center justify-center overflow-hidden">
            {currentTrack.cover_url ? (
              <img 
                src={currentTrack.cover_url} 
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-6xl">🎵</span>
            )}
          </div>
        </div>

        {/* 歌曲信息 */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">{currentTrack.title}</h1>
          <p className="text-gray-400 mb-1">{currentTrack.artist}</p>
          <p className="text-sm text-gray-500">{currentTrack.genre} • {new Date(currentTrack.created_at).getFullYear()}</p>
          {currentTrack.is_vip_only && (
            <div className="inline-block bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold mt-2">
              VIP 专享
            </div>
          )}
        </div>

        {/* 进度条 */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(currentTrack.duration)}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1">
            <div 
              className="bg-blue-500 h-1 rounded-full"
              style={{ width: `${(currentTime / currentTrack.duration) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* 控制按钮 */}
        <div className="flex justify-center items-center space-x-8 mb-6">
          <button className="text-2xl text-gray-400">⏮️</button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl hover:bg-blue-700"
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <button className="text-2xl text-gray-400">⏭️</button>
        </div>

        {/* 功能按钮 */}
        <div className="flex justify-between items-center mb-6">
          <button className="text-gray-400">🔀</button>
          <button 
            onClick={handleLikeTrack}
            className="text-gray-400 hover:text-red-400"
          >
            ❤️
          </button>
          <button 
            onClick={() => setShowLyrics(!showLyrics)}
            className={`${showLyrics ? 'text-blue-400' : 'text-gray-400'}`}
          >
            📝
          </button>
          <button className="text-gray-400">💬</button>
          <button className="text-gray-400">📤</button>
        </div>

        {/* 歌词/评论切换 */}
        {showLyrics ? (
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-bold mb-4">歌词</h3>
            <div className="space-y-2 text-sm">
              <p className="text-blue-400">夜色降临城市上空</p>
              <p className="text-gray-400">霓虹灯闪烁着梦想</p>
              <p className="text-gray-400">音乐在心中流淌</p>
              <p className="text-gray-400">带我飞向远方</p>
              <p className="text-gray-400">节拍在耳边响起</p>
              <p className="text-gray-400">旋律如此动人</p>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-bold mb-4">评论 ({comments.length})</h3>
            
            {/* 评论输入 */}
            {user ? (
              <div className="mb-4 flex space-x-2">
                <input
                  type="text"
                  placeholder="写下你的评论..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-lg text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <button 
                  onClick={handleAddComment}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                  disabled={!newComment.trim()}
                >
                  发送
                </button>
              </div>
            ) : (
              <div className="mb-4 text-center">
                <p className="text-gray-400 text-sm mb-2">登录后可以发表评论</p>
                <a href="/auth/login" className="text-blue-400 text-sm">立即登录</a>
              </div>
            )}

            {/* 评论列表 */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                      {comment.users?.avatar_url ? (
                        <img 
                          src={comment.users.avatar_url} 
                          alt={comment.users.username}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-xs">👤</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium">{comment.users?.username || '匿名用户'}</span>
                        <span className="text-xs text-gray-500">{formatDate(comment.created_at)}</span>
                      </div>
                      <p className="text-sm text-gray-300">{comment.content}</p>
                    </div>
                    <button className="text-gray-400 text-sm hover:text-red-400">
                      ❤️
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-4">
                  <p>暂无评论</p>
                  <p className="text-sm">成为第一个评论的人</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 歌曲统计 */}
        <div className="mt-6 bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-bold mb-3">歌曲信息</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">播放次数</span>
              <p className="font-medium">{currentTrack.plays_count.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-gray-400">点赞数</span>
              <p className="font-medium">{currentTrack.likes_count}</p>
            </div>
            <div>
              <span className="text-gray-400">时长</span>
              <p className="font-medium">{formatTime(currentTrack.duration)}</p>
            </div>
            <div>
              <span className="text-gray-400">发布时间</span>
              <p className="font-medium">{new Date(currentTrack.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          
          {/* 标签 */}
          {currentTrack.tags && currentTrack.tags.length > 0 && (
            <div className="mt-3">
              <span className="text-gray-400 text-sm">标签</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {currentTrack.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

