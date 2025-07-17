// src/types/index.ts

// 重要的：Translations 接口，用于多语言文本
export interface Translations {
  login: {
    welcome: string;
    usernamePlaceholder: string;
    passwordPlaceholder: string;
    rememberMe: string;
    forgotPassword: string;
    signInButton: string;
    signUpLink: string;
    signUpText: string;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    featuredMusicTitle: string;
    recentPlaysTitle: string;
    topArtistsTitle: string;
    newReleasesTitle: string;
    viewAll: string;
  };
  navbar: {
    home: string;
    music: string;
    profile: string;
    rules: string;
    logout: string;
    login: string; // 如果未登录用户导航栏也有登录选项
    language: string;
  };
  profile: {
    title: string;
    username: string;
    email: string;
    changePassword: string;
    currentPasswordPlaceholder: string;
    newPasswordPlaceholder: string;
    confirmPasswordPlaceholder: string;
    updateProfileButton: string;
    settings: string;
    darkMode: string;
    notifications: string;
  };
  rules: {
    title: string;
    generalRules: string;
    musicUploadRules: string;
    communityGuidelines: string;
    copyrightPolicy: string;
  };
  // 根据你应用的实际需求，这里可以添加更多页面或组件的翻译字段
}

// NavTranslations (如果你的 Navbar.tsx 明确需要这个单独的类型)
export interface NavTranslations {
  home: string;
  music: string;
  profile: string;
  rules: string;
  logout: string;
  login: string;
  language: string;
}

// HomeTranslations (如果你的 page.tsx 明确需要这个单独的类型)
export interface HomeTranslations {
  heroTitle: string;
  heroSubtitle: string;
  featuredMusicTitle: string;
  recentPlaysTitle: string;
  topArtistsTitle: string;
  newReleasesTitle: string;
  viewAll: string;
}

// Track 接口
export interface Track {
  id: string;
  title: string;
  artist: string;
  coverImage: string;
  audioSrc: string;
  isLiked?: boolean;
}

// CarouselSlide 接口
export interface CarouselSlide {
  id: string;
  imageUrl: string;
  altText: string;
  link: string;
}

// MusicCardProps 接口
export interface MusicCardProps {
  id: string;
  title: string;
  artist: string;
  coverImage: string;
  audioSrc: string;
  isLiked: boolean;
  isPlaying: boolean;
  onPlayPause: (id: string) => void;
  onLikeToggle: (id: string) => void;
  onShare: (id: string) => void;
}

// MusicPlayerProps 接口 (如果 MusicPlayer.tsx 需要)
export interface MusicPlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  progress: number;
  duration: number;
  onSeek: (event: React.ChangeEvent<HTMLInputElement>) => void;
  volume: number;
  onVolumeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLooping: boolean;
  onToggleLoop: () => void;
  shuffleMode: boolean;
  onToggleShuffle: () => void;
}

// 其他常用的类型，例如 User, APIResponse 等，如果需要可以添加
