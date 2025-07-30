'use client'

import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function VIP() {
  const [user, setUser] = useState<any>(null)
  const [selectedPlan, setSelectedPlan] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('wallet')
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  const plans = [
    {
      id: 'basic',
      name: '普通会员',
      price: 0,
      duration: '永久',
      features: [
        '基础音质播放',
        '有广告播放',
        '每日限制播放',
        '基础搜索功能',
      ],
      current: true,
    },
    {
      id: 'monthly',
      name: 'VIP 月卡',
      price: 99,
      originalPrice: 199,
      duration: '1个月',
      features: [
        '无损音质播放',
        '无广告体验',
        '无限制播放',
        '高级搜索功能',
        '离线下载',
        '专属客服',
      ],
      popular: true,
    },
    {
      id: 'yearly',
      name: 'VIP 年卡',
      price: 999,
      originalPrice: 1999,
      duration: '12个月',
      features: [
        '所有月卡功能',
        '独家音乐内容',
        '演唱会门票优先',
        '艺术家见面会',
        '专属徽章',
        '优先客服',
      ],
      badge: '最划算',
    },
    {
      id: 'lifetime',
      name: '终身 VIP',
      price: 4999,
      originalPrice: 9999,
      duration: '终身',
      features: [
        '所有 VIP 功能',
        '终身无损音质',
        '永久无广告',
        '独家收藏特权',
        '专属身份标识',
        '优先新功能体验',
      ],
      badge: '限时特惠',
    },
  ]

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) {
      router.push('/auth/login')
      return
    }

    // 获取用户详细信息
    const { data: userProfile } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single()

    setUser(userProfile)
  }

  const handlePurchase = async () => {
    if (!selectedPlan || !user) return

    const plan = plans.find(p => p.id === selectedPlan)
    if (!plan || plan.price === 0) return

    setIsProcessing(true)

    try {
      // 检查钱包余额
      if (paymentMethod === 'wallet') {
        if (user.wallet_balance < plan.price) {
          alert('钱包余额不足，请先充值')
          router.push('/wallet')
          return
        }

        // 扣除钱包余额
        const { error: walletError } = await supabase
          .from('users')
          .update({ 
            wallet_balance: user.wallet_balance - plan.price 
          })
          .eq('id', user.id)

        if (walletError) throw walletError

        // 记录交易
        await supabase
          .from('wallet_transactions')
          .insert({
            user_id: user.id,
            type: 'payment',
            amount: -plan.price,
            description: `购买 ${plan.name}`
          })
      }

      // 更新 VIP 状态
      const expiresAt = new Date()
      if (plan.id === 'monthly') {
        expiresAt.setMonth(expiresAt.getMonth() + 1)
      } else if (plan.id === 'yearly') {
        expiresAt.setFullYear(expiresAt.getFullYear() + 1)
      } else if (plan.id === 'lifetime') {
        expiresAt.setFullYear(expiresAt.getFullYear() + 100) // 100年后过期
      }

      const { error: vipError } = await supabase
        .from('users')
        .update({
          is_vip: true,
          vip_expires_at: plan.id === 'lifetime' ? null : expiresAt.toISOString()
        })
        .eq('id', user.id)

      if (vipError) throw vipError

      // 记录 VIP 购买记录
      await supabase
        .from('vip_purchases')
        .insert({
          user_id: user.id,
          plan_type: plan.id,
          amount: plan.price,
          expires_at: plan.id === 'lifetime' ? null : expiresAt.toISOString()
        })

      alert('VIP 购买成功！')
      router.push('/profile')
    } catch (error: any) {
      console.error('Purchase error:', error)
      alert('购买失败：' + (error.message || '未知错误'))
    } finally {
      setIsProcessing(false)
    }
  }

  if (!user) {
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
        <h1 className="text-2xl font-bold mb-2">升级 VIP 会员</h1>
        <p className="text-gray-400 mb-6">享受更好的音乐体验</p>

        {/* 当前状态 */}
        {user.is_vip && (
          <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-bold mb-2">👑 您已是 VIP 会员</h2>
            <p className="text-sm opacity-90">
              到期时间: {user.vip_expires_at ? new Date(user.vip_expires_at).toLocaleDateString() : '永久'}
            </p>
          </div>
        )}

        {/* VIP 特权介绍 */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">🎵 VIP 专享特权</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <span>🎧</span>
              <span>无损音质</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🚫</span>
              <span>无广告播放</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>⬇️</span>
              <span>离线下载</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🎤</span>
              <span>独家内容</span>
            </div>
          </div>
        </div>

        {/* 会员套餐 */}
        <div className="space-y-4 mb-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-lg p-4 border-2 cursor-pointer transition-all ${
                selectedPlan === plan.id
                  ? 'border-blue-500 bg-blue-900/20'
                  : plan.popular
                  ? 'border-purple-500 bg-purple-900/20'
                  : plan.current && user.is_vip
                  ? 'border-gray-600 bg-gray-800'
                  : 'border-gray-700 bg-gray-800 hover:border-gray-600'
              }`}
              onClick={() => !plan.current && setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-2 left-4 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  推荐
                </div>
              )}
              
              {plan.badge && (
                <div className="absolute -top-2 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  {plan.badge}
                </div>
              )}
              
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold">{plan.name}</h3>
                  <p className="text-sm text-gray-400">{plan.duration}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    {plan.price === 0 ? (
                      <span className="text-xl font-bold text-green-400">免费</span>
                    ) : (
                      <>
                        <span className="text-xl font-bold text-blue-400">{plan.price} 缅币</span>
                        {plan.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">{plan.originalPrice} 缅币</span>
                        )}
                      </>
                    )}
                  </div>
                </div>
                
                {plan.current && user.is_vip ? (
                  <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">
                    当前套餐
                  </span>
                ) : selectedPlan === plan.id ? (
                  <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                    已选择
                  </span>
                ) : null}
              </div>

              <ul className="space-y-2 mb-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm">
                    <span className="text-green-400">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 支付方式 */}
        {selectedPlan && (
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-bold mb-4">支付方式</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg cursor-pointer">
                <input 
                  type="radio" 
                  name="payment" 
                  value="wallet" 
                  checked={paymentMethod === 'wallet'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="text-2xl">💰</span>
                <div className="flex-1">
                  <p className="font-medium">缅币钱包</p>
                  <p className="text-sm text-gray-400">余额: {user.wallet_balance} 缅币</p>
                </div>
              </label>
              <label className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg cursor-pointer opacity-50">
                <input type="radio" name="payment" value="bank" disabled />
                <span className="text-2xl">🏦</span>
                <div>
                  <p className="font-medium">银行转账</p>
                  <p className="text-sm text-gray-400">即将开放</p>
                </div>
              </label>
              <label className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg cursor-pointer opacity-50">
                <input type="radio" name="payment" value="mobile" disabled />
                <span className="text-2xl">📱</span>
                <div>
                  <p className="font-medium">手机支付</p>
                  <p className="text-sm text-gray-400">即将开放</p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* 购买按钮 */}
        {selectedPlan && (
          <div className="mb-6">
            <button
              onClick={handlePurchase}
              disabled={isProcessing || paymentMethod === 'wallet' && user.wallet_balance < (plans.find(p => p.id === selectedPlan)?.price || 0)}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="loading-spinner"></div>
                  <span>处理中...</span>
                </div>
              ) : paymentMethod === 'wallet' && user.wallet_balance < (plans.find(p => p.id === selectedPlan)?.price || 0) ? (
                '余额不足，去充值'
              ) : (
                `立即购买 ${plans.find(p => p.id === selectedPlan)?.name}`
              )}
            </button>
            
            {paymentMethod === 'wallet' && user.wallet_balance < (plans.find(p => p.id === selectedPlan)?.price || 0) && (
              <button
                onClick={() => router.push('/wallet')}
                className="w-full mt-2 btn-secondary"
              >
                前往充值
              </button>
            )}
          </div>
        )}

        {/* 优惠信息 */}
        <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4 mb-6">
          <h3 className="text-yellow-400 font-bold mb-2">🎉 限时优惠</h3>
          <p className="text-sm text-yellow-300">
            新用户首次购买享受 5 折优惠！立即升级享受无损音质体验。
          </p>
        </div>

        {/* 常见问题 */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-bold mb-4">常见问题</h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-medium mb-1">Q: VIP 会员可以在多个设备使用吗？</p>
              <p className="text-gray-400">A: 可以，一个账号最多支持 3 个设备同时登录。</p>
            </div>
            <div>
              <p className="font-medium mb-1">Q: 如何取消自动续费？</p>
              <p className="text-gray-400">A: 在设置中可以随时取消自动续费，不影响当前会员期。</p>
            </div>
            <div>
              <p className="font-medium mb-1">Q: 支持退款吗？</p>
              <p className="text-gray-400">A: 支持 7 天无理由退款，详见用户协议。</p>
            </div>
            <div>
              <p className="font-medium mb-1">Q: VIP 特权什么时候生效？</p>
              <p className="text-gray-400">A: 购买成功后立即生效，可立即享受所有 VIP 特权。</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

