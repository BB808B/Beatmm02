// frontend/src/types/index.ts

export type Language = 'zh' | 'en' | 'my';

export interface TranslationType {
  common: {
    loading: string;
    subscribe: string;
    freeTrial: string;
    popular: string;
    search: string;
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
  audioUrl?: string;
  duration: number;
  plays?: number;
  likes?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  phone: string;
  role: 'user' | 'dj' | 'admin' | 'super_admin';
  balance: number;
  isDj?: boolean;
  isActive?: boolean;
  createdAt?: string;
  lastLogin?: string;
  trialEndDate?: string;
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
