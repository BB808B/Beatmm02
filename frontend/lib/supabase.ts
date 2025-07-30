import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 数据库表结构定义
export interface User {
  id: string
  email: string
  username: string
  avatar_url?: string
  is_vip: boolean
  vip_expires_at?: string
  wallet_balance: number
  created_at: string
  updated_at: string
}

export interface Track {
  id: string
  title: string
  artist: string
  description?: string
  audio_url: string
  cover_url?: string
  duration: number
  genre: string
  tags: string[]
  plays_count: number
  likes_count: number
  is_vip_only: boolean
  user_id: string
  created_at: string
  updated_at: string
}

export interface Comment {
  id: string
  content: string
  track_id: string
  user_id: string
  created_at: string
  updated_at: string
}

export interface Like {
  id: string
  track_id: string
  user_id: string
  created_at: string
}

export interface VipPurchase {
  id: string
  user_id: string
  plan_type: string
  amount: number
  expires_at: string
  created_at: string
}

export interface LiveStream {
  id: string
  title: string
  description?: string
  dj_id: string
  viewers_count: number
  is_live: boolean
  category: string
  started_at?: string
  ended_at?: string
  created_at: string
}

export interface DjApplication {
  id: string
  user_id: string
  real_name: string
  experience: string
  portfolio_url?: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
}

export interface WalletTransaction {
  id: string
  user_id: string
  type: 'recharge' | 'payment' | 'reward' | 'tip'
  amount: number
  description: string
  created_at: string
}

