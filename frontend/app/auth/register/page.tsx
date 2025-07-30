'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')
    
    if (password !== confirmPassword) {
      setError('密码不一致')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('密码至少需要6位')
      setIsLoading(false)
      return
    }

    try {
      // 注册用户
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          }
        }
      })

      if (error) throw error

      if (data.user) {
        // 创建用户资料
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: email,
            username: username,
            is_vip: false,
            wallet_balance: 100, // 新用户赠送100缅币
          })

        if (profileError) {
          console.error('Profile creation error:', profileError)
        }

        setSuccess('注册成功！请检查邮箱验证链接。')
        
        // 3秒后跳转到登录页
        setTimeout(() => {
          router.push('/auth/login')
        }, 3000)
      }
    } catch (error: any) {
      setError(error.message || '注册失败，请重试')
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
          <p className="text-gray-400 mt-2">加入音乐社区</p>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-900/50 border border-red-600 text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* 成功提示 */}
        {success && (
          <div className="bg-green-900/50 border border-green-600 text-green-300 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {/* 注册表单 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">用户名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="输入用户名"
              className="input-field"
              required
              minLength={2}
              maxLength={20}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">邮箱地址</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="输入邮箱地址"
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
              placeholder="设置密码（至少6位）"
              className="input-field"
              minLength={6}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">确认密码</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="再次输入密码"
              className="input-field"
              required
            />
          </div>

          <div className="flex items-start space-x-2">
            <input type="checkbox" className="mt-1 rounded" required />
            <span className="text-sm text-gray-400">
              我已阅读并同意
              <Link href="/terms" className="text-blue-400 hover:text-blue-300">《用户协议》</Link>
              和
              <Link href="/privacy" className="text-blue-400 hover:text-blue-300">《隐私政策》</Link>
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="loading-spinner"></div>
                <span>注册中...</span>
              </div>
            ) : (
              '注册账号'
            )}
          </button>
        </form>

        {/* 登录链接 */}
        <div className="text-center mt-6">
          <span className="text-gray-400">已有账号？</span>
          <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 ml-1">
            立即登录
          </Link>
        </div>

        {/* 新用户福利 */}
        <div className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-4 text-center">
          <h3 className="font-bold mb-2">🎉 新用户福利</h3>
          <p className="text-sm opacity-90">注册即送 100 缅币 + 7天VIP体验</p>
        </div>
      </div>
    </div>
  )
}

