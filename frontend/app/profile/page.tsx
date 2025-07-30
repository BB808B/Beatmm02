'use client'

import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { User, supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Profile() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) {
        router.push('/auth/login')
        return
      }

      // 获取用户详细信息
      const { data: userProfile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (error) throw error
      setUser(userProfile)
    } catch (error) {
      console.error('Error fetching user:', error)
      router.push('/auth/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/auth/login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN')
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

  if (!user) {
    return (
      <Layout>
        <div className="p-4 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-gray-400 mb-4">请先登录</p>
            <Link href="/auth/login" className="btn-primary">
              立即登录
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="p-4">
        {/* 用户信息 */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
              {user.avatar_url ? (
                <img 
                  src={user.avatar_url} 
                  alt={user.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl">👤</span>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{user.username}</h2>
              <p className="text-gray-400">{user.email}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-sm text-gray-400">关注 128</span>
                <span className="text-sm text-gray-400">粉丝 256</span>
              </div>
            </div>
            <div className="text-center">
              {user.is_vip ? (
                <div>
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold mb-2">
                    VIP
                  </div>
                  <p className="text-xs text-gray-400">
                    到期: {user.vip_expires_at ? formatDate(user.vip_expires_at) : '永久'}
                  </p>
                </div>
              ) : (
                <Link href="/vip" className="bg-gray-600 text-white px-3 py-1 rounded-full text-xs">
                  升级VIP
                </Link>
              )}
            </div>
          </div>
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700">
            编辑资料
          </button>
        </div>

        {/* 钱包余额 */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-90">钱包余额</p>
              <p className="text-2xl font-bold">{user.wallet_balance}</p>
              <p className="text-sm opacity-90">缅币 (MMK)</p>
            </div>
            <Link href="/wallet" className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium">
              管理钱包
            </Link>
          </div>
        </div>

        {/* 功能菜单 */}
        <div className="space-y-4">
          {/* 我的音乐 */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-bold mb-3">我的音乐</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/library" className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg card-hover">
                <span className="text-xl">❤️</span>
                <div>
                  <p className="text-sm font-medium">我的收藏</p>
                  <p className="text-xs text-gray-400">128 首歌曲</p>
                </div>
              </Link>
              <Link href="/history" className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg card-hover">
                <span className="text-xl">🕒</span>
                <div>
                  <p className="text-sm font-medium">播放历史</p>
                  <p className="text-xs text-gray-400">最近播放</p>
                </div>
              </Link>
            </div>
          </div>

          {/* 创作中心 */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-bold mb-3">创作中心</h3>
            <div className="space-y-3">
              <Link href="/upload" className="flex items-center justify-between p-3 bg-gray-700 rounded-lg card-hover">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">📤</span>
                  <span className="text-sm font-medium">上传音乐</span>
                </div>
                <span className="text-gray-400">→</span>
              </Link>
              <Link href="/my-uploads" className="flex items-center justify-between p-3 bg-gray-700 rounded-lg card-hover">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">🎵</span>
                  <span className="text-sm font-medium">我的作品</span>
                </div>
                <span className="text-gray-400">→</span>
              </Link>
              <Link href="/dj-cert" className="flex items-center justify-between p-3 bg-gray-700 rounded-lg card-hover">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">🎧</span>
                  <span className="text-sm font-medium">DJ 认证</span>
                </div>
                <span className="text-gray-400">→</span>
              </Link>
            </div>
          </div>

          {/* VIP 服务 */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-bold mb-3">VIP 服务</h3>
            <div className="space-y-3">
              {!user.is_vip && (
                <Link href="/vip" className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">👑</span>
                    <span className="text-sm font-medium">升级 VIP</span>
                  </div>
                  <span className="text-white">→</span>
                </Link>
              )}
              <Link href="/wallet" className="flex items-center justify-between p-3 bg-gray-700 rounded-lg card-hover">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">💰</span>
                  <span className="text-sm font-medium">我的钱包</span>
                </div>
                <span className="text-gray-400">→</span>
              </Link>
            </div>
          </div>

          {/* 设置 */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-bold mb-3">设置</h3>
            <div className="space-y-3">
              <Link href="/settings" className="flex items-center justify-between p-3 bg-gray-700 rounded-lg card-hover">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">⚙️</span>
                  <span className="text-sm font-medium">应用设置</span>
                </div>
                <span className="text-gray-400">→</span>
              </Link>
              <Link href="/language" className="flex items-center justify-between p-3 bg-gray-700 rounded-lg card-hover">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">🌐</span>
                  <span className="text-sm font-medium">语言设置</span>
                </div>
                <span className="text-gray-400">→</span>
              </Link>
              <Link href="/help" className="flex items-center justify-between p-3 bg-gray-700 rounded-lg card-hover">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">❓</span>
                  <span className="text-sm font-medium">帮助中心</span>
                </div>
                <span className="text-gray-400">→</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center justify-between w-full p-3 bg-gray-700 rounded-lg text-left card-hover"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">🚪</span>
                  <span className="text-sm font-medium">退出登录</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>
            </div>
          </div>

          {/* 账户信息 */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-bold mb-3">账户信息</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">注册时间</span>
                <span>{formatDate(user.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">最后更新</span>
                <span>{formatDate(user.updated_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">用户ID</span>
                <span className="font-mono text-xs">{user.id.slice(0, 8)}...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

