'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // 登录成功后跳转到首页
      router.push('/')
    } catch (error: any) {
      setError(error.message || '登录失败，请检查邮箱和密码')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            BeatMM Pro
          </h1>
          <p className="text-gray-400 mt-2">登录你的音乐世界</p>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-900/50 border border-red-600 text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* 登录表单 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">邮箱地址</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="输入你的邮箱"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="输入你的密码"
              className="input-field"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm text-gray-400">记住我</span>
            </label>
            <Link href="/auth/forgot-password" className="text-sm text-blue-400 hover:text-blue-300">
              忘记密码？
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="loading-spinner"></div>
                <span>登录中...</span>
              </div>
            ) : (
              '登录'
            )}
          </button>
        </form>

        {/* 分割线 */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-700"></div>
          <span className="px-4 text-gray-400 text-sm">或</span>
          <div className="flex-1 border-t border-gray-700"></div>
        </div>

        {/* 第三方登录 */}
        <div className="space-y-3">
          <button 
            onClick={() => {
              // 实现手机号登录
              alert('手机号登录功能开发中')
            }}
            className="w-full bg-gray-800 text-white py-3 rounded-lg font-medium border border-gray-700 hover:bg-gray-700"
          >
            📱 手机号登录
          </button>
          <button 
            onClick={async () => {
              try {
                const { error } = await supabase.auth.signInWithOAuth({
                  provider: 'google'
                })
                if (error) throw error
              } catch (error) {
                console.error('OAuth login error:', error)
              }
            }}
            className="w-full bg-gray-800 text-white py-3 rounded-lg font-medium border border-gray-700 hover:bg-gray-700"
          >
            🔗 Google 登录
          </button>
        </div>

        {/* 注册链接 */}
        <div className="text-center mt-6">
          <span className="text-gray-400">还没有账号？</span>
          <Link href="/auth/register" className="text-blue-400 hover:text-blue-300 ml-1">
            立即注册
          </Link>
        </div>

        {/* 协议 */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            登录即表示同意
            <Link href="/terms" className="text-blue-400 hover:text-blue-300">用户协议</Link>
            和
            <Link href="/privacy" className="text-blue-400 hover:text-blue-300">隐私政策</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

