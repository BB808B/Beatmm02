export type Language = 'zh' | 'my' | 'en';

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
    dj?: string;
    live?: string;
    ranking?: string;
    profile?: string;
    register?: string;
    logout?: string;
    settings?: string; // Add settings property
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
    features: {
      unlimited: string;
      hq: string;
      offline: string;
      exclusive: string;
      early: string;
    };
    mostPopular: string;
  };
  // Add specific properties for other pages
  login?: {
    welcome: string;
    phonePlaceholder: string;
    passwordPlaceholder: string;
    forgotPassword: string;
    loginButton: string;
    orLoginWith: string;
    noAccount: string;
    registerNow: string;
    phoneOrPasswordError: string;
    loginFailed: string;
  };
  profile?: {
    musicLover: string;
    collectedSongs: string;
    playlists: string;
    playTime: string;
    myMusic: string;
    favoriteSongs: string;
    settings: string;
    recommendedContent: string;
    recentActivity: string;
    played: string;
    collected: string;
    createdNewPlaylist: string;
  };
  rules?: {
    title: string;
    subtitle: string;
    sections: {
      title: string;
      content: string[];
    }[];
    contactUs: string;
    contactMessage: string;
  };
  settings?: { // New settings section
    title: string;
    subtitle: string;
    appearance: string;
    theme: string;
    language: string;
    accountManagement: string;
    changePassword: string;
    deleteAccount: string;
    darkMode: string;
    lightMode: string;
  };
  // 支持任意扩展属性
  [key: string]: any;
}

export type Translations = TranslationType;

export interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  translations: TranslationType;
}

export interface MusicCardProps {
  id: string;
  title: string;
  artist: string;
  coverImage: string;
  audioUrl: string;
  duration: string | number;
  isPlaying?: boolean;
  onPlay?: (id: string) => void;
  onPause?: (id: string) => void;
  onLike?: (id: string) => void;
  onShare?: (id: string) => void;
  isLiked?: boolean;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  coverImage: string;
  audioUrl: string;
  duration: number;
}

export interface MusicPlayerProps {
  tracks: Track[];
  onShowPlaylist: () => void;
  currentTrackIndex: number;
  setCurrentTrackIndex: (index: number) => void;
}

export interface GenreCirclesProps {
  currentLang: Language;
}

export interface MusicVisualizerProps {
  isPlaying: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: string;
}

export interface PricingSectionProps {
  currentLang: Language;
}

export interface CarouselSlide {
  id: string;
  imageUrl: string;
  altText: string;
  link: string;
}
