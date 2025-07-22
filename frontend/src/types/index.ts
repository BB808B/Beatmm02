// frontend/src/types/index.ts

export type Language = 'zh' | 'en' | 'my';

export interface TranslationType {
  common: {
    loading: string;
    subscribe: string;
    freeTrial: string;
    popular: string;
    search: string;
    home: string;
    browse: string;
    library: string;
    leaderboard: string;
    vip: string;
    login: string;
    signup: string;
    euphoric_beats: string;
    recommended_music: string;
    hot_tracks: string;
    become_vip: string;
    vip_benefits_desc: string;
    learn_more: string;
    login_to_beatmm_pro: string;
    phone_login: string;
    username_login: string;
    phone_number: string;
    username: string;
    password: string;
    logging_in: string;
    no_account_yet: string;
    sign_up_now: string;
    forgot_password: string;
    edit_profile_feature_coming_soon: string;
    followers: string;
    following: string;
    edit_profile: string;
    uploaded_songs: string;
    liked_songs: string;
    no_songs_found: string;
    no_playlists_found: string;
    no_liked_songs_found: string;
    platform_rules: string;
    terms_of_service: string;
    terms_of_service_content_p1: string;
    terms_of_service_content_p2: string;
    privacy_policy: string;
    privacy_policy_content_p1: string;
    privacy_policy_content_p2: string;
    community_guidelines: string;
    community_guidelines_content_p1: string;
    community_guidelines_content_p2: string;
    settings: string;
    general_settings: string;
    language: string;
    myanmar: string;
    chinese: string;
    english: string;
    theme: string;
    dark_theme: string;
    light_theme: string;
    enable_notifications: string;
    auto_play_next_song: string;
    save_settings: string;
    account_settings: string;
    change_password: string;
    manage_privacy: string;
    delete_account: string;
    music_categories: string;
    vietnamese_drum: string;
    traditional_myanmar: string;
    electronic_dance: string;
    hip_hop: string;
    pop: string;
    featured_music: string;
    playlists: string;
    songs: string;
  };
  navbar: {
    home: string;
    music: string;
    radio: string;
    charts: string;
    rules: string;
  };
  nav: {
    home: string;
    music: string;
    radio: string;
    charts: string;
    rules: string;
    login: string;
  };
  hero: {
    title: string;
    subtitle: string;
  };
  pricing: {
    title: string;
    basic: string;
    premium: string;
    vip: string;
    month: string;
    mostPopular: string;
    features: {
      unlimited: string;
      hq: string;
      offline: string;
      exclusive: string;
      early: string;
      ads: string;
      support: string;
      devices: string;
    };
  };
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  coverImage: string;
  audioUrl?: string; // 音频文件URL
  duration: number;
  plays?: number;
  likes?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  phone?: string; // 手机号可选
  username?: string; // 用户名可选
  email?: string; // 邮箱可选
  role: 'user' | 'dj' | 'admin' | 'super_admin';
  balance: number;
  isDj?: boolean;
  isActive?: boolean;
  createdAt?: string;
  lastLogin?: string;
  trialEndDate?: string;
  avatar?: string; // 用户头像
  bio?: string; // 个人简介
  level?: string; // 用户等级
  followers?: number; // 粉丝数
  following?: number; // 关注数
}

export interface Subscription {
  id: string;
  userId: string;
  planName: string;
  status: 'active' | 'inactive' | 'cancelled';
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface DjApplication {
  id: string;
  userId: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}


