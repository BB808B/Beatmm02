'use client'

import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { WalletTransaction, supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Wallet() {
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('balance')
  const [transactions, setTransactions] = useState<WalletTransaction[]>([])
  const [rechargeAmount, setRechargeAmount] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  const rechargeOptions = [
    { amount: 100, bonus: 0, label: '100 缅币' },
    { amount: 500, bonus: 50, label: '500 缅币 + 50 赠送' },
    { amount: 1000, bonus: 150, label: '1000 缅币 + 150 赠送' },
    { amount: 2000, bonus: 400, label: '2000 缅币 + 400 赠送' },
    { amount: 5000, bonus: 1200, label: '5000 缅币 + 1200 赠送' },
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
    
    if (userProfile) {
      fetchTransactions(userProfile.id)
    }
  }

  const fetchTransactions = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      setTransactions(data || [])
    } catch (error) {
      console.error('Error fetching transactions:', error)
    }
  }

  const handleRecharge = async (amount: number, bonus: number = 0) => {
    if (!user) return

    setIsProcessing(true)

    try {
      const totalAmount = amount + bonus

      // 更新用户余额
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          wallet_balance: user.wallet_balance + totalAmount 
        })
        .eq('id', user.id)

      if (updateError) throw updateError

      // 记录充值交易
      const { error: transactionError } = await supabase
        .from('wallet_transactions')
        .insert({
          user_id: user.id,
          type: 'recharge',
          amount: totalAmount,
          description: bonus > 0 ? `充值 ${amount} 缅币 + ${bonus} 赠送` : `充值 ${amount} 缅币`
        })

      if (transactionError) throw transactionError

      // 如果有赠送，记录赠送交易
      if (bonus > 0) {
        await supabase
          .from('wallet_transactions')
          .insert({
            user_id: user.id,
            type: 'reward',
            amount: bonus,
            description: `充值赠送 ${bonus} 缅币`
          })
      }

      // 更新本地状态
      setUser({ ...user, wallet_balance: user.wallet_balance + totalAmount })
      fetchTransactions(user.id)

      alert('充值成功！')
    } catch (error: any) {
      console.error('Recharge error:', error)
      alert('充值失败：' + (error.message || '未知错误'))
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCustomRecharge = async () => {
    const amount = parseInt(rechargeAmount)
    if (!amount || amount < 10) {
      alert('充值金额不能少于10缅币')
      return
    }
    if (amount > 10000) {
      alert('单次充值金额不能超过10000缅币')
      return
    }

    await handleRecharge(amount)
    setRechargeAmount('')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN')
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'recharge': return '💳'
      case 'payment': return '💰'
      case 'reward': return '🎁'
      case 'tip': return '❤️'
      default: return '💱'
    }
  }

  const getTransactionColor = (amount: number) => {
    return amount > 0 ? 'text-green-400' : 'text-red-400'
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
        <h1 className="text-2xl font-bold mb-6">我的钱包</h1>

        {/* 余额卡片 */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-blue-100 text-sm mb-1">钱包余额</p>
              <p className="text-3xl font-bold text-white">{user.wallet_balance}</p>
              <p className="text-blue-100 text-sm">缅币 (MMK)</p>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm mb-1">VIP 状态</p>
              <p className="text-white font-medium">
                {user.is_vip ? '已开通' : '未开通'}
              </p>
              {user.is_vip && user.vip_expires_at && (
                <p className="text-blue-100 text-xs">
                  到期: {new Date(user.vip_expires_at).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => setActiveTab('recharge')}
              className="flex-1 bg-white text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-50"
            >
              充值
            </button>
            <button 
              className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600"
              onClick={() => alert('提现功能开发中')}
            >
              提现
            </button>
          </div>
        </div>

        {/* 快捷功能 */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <button 
            onClick={() => setActiveTab('recharge')}
            className="flex flex-col items-center p-4 bg-gray-800 rounded-lg card-hover"
          >
            <span className="text-2xl mb-2">💳</span>
            <span className="text-xs">充值</span>
          </button>
          <button 
            className="flex flex-col items-center p-4 bg-gray-800 rounded-lg card-hover"
            onClick={() => alert('提现功能开发中')}
          >
            <span className="text-2xl mb-2">💰</span>
            <span className="text-xs">提现</span>
          </button>
          <button 
            className="flex flex-col items-center p-4 bg-gray-800 rounded-lg card-hover"
            onClick={() => alert('打赏功能开发中')}
          >
            <span className="text-2xl mb-2">🎁</span>
            <span className="text-xs">打赏</span>
          </button>
          <button 
            onClick={() => setActiveTab('balance')}
            className="flex flex-col items-center p-4 bg-gray-800 rounded-lg card-hover"
          >
            <span className="text-2xl mb-2">📊</span>
            <span className="text-xs">账单</span>
          </button>
        </div>

        {/* 标签页 */}
        <div className="flex space-x-1 mb-4">
          {[
            { id: 'balance', label: '余额明细' },
            { id: 'recharge', label: '充值中心' },
            { id: 'payment', label: '消费记录' },
          ].map((tab) => (
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

        {/* 充值中心 */}
        {activeTab === 'recharge' && (
          <div className="space-y-6">
            {/* 快速充值 */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-bold mb-4">快速充值</h3>
              <div className="grid grid-cols-1 gap-3">
                {rechargeOptions.map((option) => (
                  <button
                    key={option.amount}
                    onClick={() => handleRecharge(option.amount, option.bonus)}
                    disabled={isProcessing}
                    className="flex justify-between items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                  >
                    <span className="font-medium">{option.label}</span>
                    <span className="text-blue-400">充值</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 自定义充值 */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-bold mb-4">自定义充值</h3>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(e.target.value)}
                  placeholder="输入充值金额（10-10000）"
                  className="flex-1 input-field"
                  min="10"
                  max="10000"
                  disabled={isProcessing}
                />
                <button
                  onClick={handleCustomRecharge}
                  disabled={isProcessing || !rechargeAmount}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? '处理中...' : '充值'}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                最低充值10缅币，最高单次充值10000缅币
              </p>
            </div>

            {/* 充值优惠 */}
            <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4">
              <h3 className="text-yellow-400 font-bold mb-2">💰 充值优惠</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-yellow-800/30 rounded p-2">
                  <p className="font-medium">充值 1000 送 150</p>
                  <p className="text-yellow-300">限时优惠</p>
                </div>
                <div className="bg-yellow-800/30 rounded p-2">
                  <p className="font-medium">首次充值 8 折</p>
                  <p className="text-yellow-300">新用户专享</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 交易记录 */}
        {(activeTab === 'balance' || activeTab === 'payment') && (
          <div className="space-y-3">
            {transactions
              .filter((t) => {
                if (activeTab === 'payment') return t.type === 'payment' || t.type === 'tip'
                return true
              })
              .map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.amount > 0 ? 'bg-green-600' : 'bg-red-600'
                    }`}>
                      <span className="text-white text-sm">
                        {getTransactionIcon(transaction.type)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-gray-400">{formatDate(transaction.created_at)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${getTransactionColor(transaction.amount)}`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                    </p>
                    <p className="text-xs text-gray-400">缅币</p>
                  </div>
                </div>
              ))}

            {transactions.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <p>暂无交易记录</p>
              </div>
            )}
          </div>
        )}

        {/* 安全提示 */}
        <div className="mt-6 bg-gray-800 rounded-lg p-4">
          <h3 className="font-bold mb-2">🔒 安全提示</h3>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• 请勿向陌生人转账或透露支付密码</li>
            <li>• 充值时请确认收款方信息</li>
            <li>• 如有异常交易请及时联系客服</li>
            <li>• 建议开启账户安全验证</li>
          </ul>
        </div>
      </div>
    </Layout>
  )
}

