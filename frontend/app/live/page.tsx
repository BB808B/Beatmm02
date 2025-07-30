'use client'

import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { LiveStream, supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Live() {
  const [activeTab, setActiveTab] = useState('live')
  const [liveStreams, setLiveStreams] = useState<LiveStream[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  const tabs = [
    { id: 'live', label: '正在直播' },
    { id: 'upcoming', label: '即将开始' },
    { id: 'categories', label: '分类' },
  ]

  const categories = [
    { id: 'pop', name: '流行音乐', icon: '🎤', count: 12 },
    { id: 'electronic', name: '电子音乐', icon: '🎧', count: 8 },
    { id: 'rock', name: '摇滚音乐', icon: '🎸', count: 5 },
    { id: 'jazz', name: '爵士音乐', icon: '🎺', count: 3 },
    { id: 'classical', name: '古典音乐', icon: '🎼', count: 2 },
    { id: 'myanmar', name: '缅甸音乐', icon: '🏮', count: 6 },
  ]

  useEffect(() => {
    checkUser()
    fetchLiveStreams()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  const fetchLiveStreams = async () => {
    try {
      const { data, error } = await supabase
        .from('live_streams')
        .select(`
          *,
          users (
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setLiveStreams(data || [])
    } catch (error) {
      console.error('Error fetching live streams:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatViewers = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">音乐直播</h1>
          <div className="flex space-x-2">
            <button className="text-gray-400">🔍</button>
            {user && (
              <Link href="/live/create" className="bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                开播
              </Link>
            )}
          </div>
        </div>

        {/* 推荐直播横幅 */}
        <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-red-600 font-bold text-sm">LIVE</span>
            </div>
            <div className="flex-1">
              <h2 className="font-bold mb-1">DJ 夜场音乐会</h2>
              <p className="text-sm opacity-90">电子音乐 • 1.2K 观看</p>
            </div>
            <button className="bg-white text-red-600 px-4 py-2 rounded-lg font-medium">
              进入
            </button>
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
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 正在直播 */}
        {activeTab === 'live' && (
          <div className="space-y-4">
            {liveStreams
              .filter(stream => stream.is_live)
              .map((stream) => (
                <div key={stream.id} className="bg-gray-800 rounded-lg p-4 card-hover">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gray-600 rounded-full overflow-hidden">
                        {stream.users?.avatar_url ? (
                          <img 
                            src={stream.users.avatar_url} 
                            alt={stream.users.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            👤
                          </div>
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-red-600 text-white text-xs px-1 rounded">
                        LIVE
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{stream.title}</h3>
                      <p className="text-sm text-gray-400">{stream.users?.username}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 text-sm text-gray-400">
                        <span>👁️</span>
                        <span>{formatViewers(stream.viewers_count)}</span>
                      </div>
                      <p className="text-xs text-gray-500">{stream.category}</p>
                    </div>
                  </div>
                  
                  {stream.description && (
                    <p className="text-sm text-gray-300 mb-3">{stream.description}</p>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>🎵 {stream.category}</span>
                      <span>⏰ {stream.started_at ? formatTime(stream.started_at) : '刚刚开始'}</span>
                    </div>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700">
                      观看
                    </button>
                  </div>
                </div>
              ))}

            {liveStreams.filter(stream => stream.is_live).length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <div className="text-4xl mb-4">📺</div>
                <p className="text-lg mb-2">暂无正在直播的内容</p>
                <p className="text-sm">稍后再来看看吧</p>
              </div>
            )}
          </div>
        )}

        {/* 即将开始 */}
        {activeTab === 'upcoming' && (
          <div className="space-y-4">
            {/* 预告直播 */}
            {[
              {
                id: 1,
                title: '周末电音派对',
                dj: 'DJ Max',
                time: '今晚 20:00',
                category: '电子音乐',
                subscribers: 256,
              },
              {
                id: 2,
                title: '缅甸传统音乐欣赏',
                dj: 'Thant Zin',
                time: '明天 19:30',
                category: '缅甸音乐',
                subscribers: 128,
              },
              {
                id: 3,
                title: '爵士夜现场',
                dj: 'Sarah Jazz',
                time: '周六 21:00',
                category: '爵士音乐',
                subscribers: 89,
              },
            ].map((stream) => (
              <div key={stream.id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">预告</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{stream.title}</h3>
                    <p className="text-sm text-gray-400">{stream.dj}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-purple-400">{stream.time}</p>
                    <p className="text-xs text-gray-500">{stream.subscribers} 人预约</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">🎵 {stream.category}</span>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700">
                    预约提醒
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 分类 */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-2 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                className="bg-gray-800 rounded-lg p-4 text-left card-hover"
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <h3 className="font-medium mb-1">{category.name}</h3>
                <p className="text-sm text-gray-400">{category.count} 个直播间</p>
              </button>
            ))}
          </div>
        )}

        {/* 开播入口 */}
        {user && (
          <div className="fixed bottom-24 right-4">
            <Link
              href="/live/create"
              className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-red-700"
            >
              📹
            </Link>
          </div>
        )}

        {/* 热门主播 */}
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-4">热门主播</h3>
          <div className="grid grid-cols-4 gap-4">
            {[
              { name: 'DJ Max', followers: '12K', avatar: '🎧' },
              { name: 'Sarah', followers: '8.5K', avatar: '🎤' },
              { name: 'Thant', followers: '6.2K', avatar: '🎵' },
              { name: 'Maya', followers: '4.8K', avatar: '🎸' },
            ].map((dj, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl mb-2 mx-auto">
                  {dj.avatar}
                </div>
                <p className="text-sm font-medium">{dj.name}</p>
                <p className="text-xs text-gray-400">{dj.followers} 粉丝</p>
              </div>
            ))}
          </div>
        </div>

        {/* 直播须知 */}
        <div className="mt-6 bg-blue-900/30 border border-blue-600 rounded-lg p-4">
          <h3 className="text-blue-400 font-bold mb-2">📋 直播须知</h3>
          <ul className="text-sm text-blue-300 space-y-1">
            <li>• 直播内容需符合社区规范</li>
            <li>• 建议使用稳定的网络环境</li>
            <li>• 支持音频和视频直播</li>
            <li>• 观众可通过打赏支持主播</li>
          </ul>
        </div>
      </div>
    </Layout>
  )
}

