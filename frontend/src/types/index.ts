// src/types/index.ts

export interface NavbarProps {
  currentLang: string;
  onLanguageChange: (lang: string) => void;
  translations: Translations;
}

export interface Translations {
  title: string;
  nav: {
    home: string;
    music: string;
    dj: string;
    live: string;
    ranking: string;
    profile: string;
    login: string;
    register: string;
    logout: string;
    rules: string;
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
  auth: {
    loginTitle: string;
    phone: string;
    password: string;
    confirmPassword: string;
    loginButton: string;
    registerButton: string;
    forgotPassword: string;
    noAccount: string;
    hasAccount: string;
    registerNow: string;
    loginNow: string;
    loginSuccess: string;
    loginError: string;
    phoneRequired: string;
    passwordRequired: string;
    confirmPasswordRequired: string;
    passwordMismatch: string;
    registerSuccess: string;
    registerError: string;
    registerTitle: string;
  };
  player: {
    play: string;
    pause: string;
    next: string;
    previous: string;
    volume: string;
    shuffle: string;
    repeat: string;
  };
  profile: {
    myProfile: string;
    editProfile: string;
    myMusic: string;
    myWallet: string;
    balance: string;
    recharge: string;
    withdraw: string;
    djApplication: string;
    logout: string;
    phone: string;
    username: string;
    greeting: string;
    djStatus: string;
    notDj: string;
    isDj: string;
    title: string;
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
  common: {
    search: string;
    submit: string;
    cancel: string;
    confirm: string;
    save: string;
    edit: string;
    delete: string;
    loading: string;
    error: string;
    success: string;
    viewDetails: string;
    on: string;
    off: string;
  };
  rulesPage: {
    title: string;
    subtitle: string;
    section1Title: string;
    section1Item1: string;
    section1Item2: string;
    section1Item3: string;
    section1Item4: string;
    section1Item5: string;
    section1Item6: string;
    section1Item7: string;
    section1Item8: string;
    section2Title: string;
    section2Item1: string;
    section2Item2: string;
    section2Item3: string;
    section2Item4: string;
    section2Item5: string;
    section2Item6: string;
    section2Item7: string;
    section3Title: string;
    section3Item1: string;
    section3Item2: string;
    section3Item3: string;
    section3Item4Title: string;
    section3Item4Perm1: string;
    section3Item4Perm2: string;
    section3Item4Perm3: string;
    section3Item4Perm4: string;
    section3Item5: string; // 已经只保留一个了
    section3Item6: string;
    section3Item7: string;
    importantReminderTitle: string;
    importantReminderText1: string;
    importantReminderText2: string;
    importantReminderText3: string;
  };
  settingsPage: {
    title: string;
    language: string;
    theme: string;
    notifications: string;
    privacy: string;
    account: string;
    security: string;
    darkMode: string;
    lightMode: string;
    pushNotifications: string;
    emailNotifications: string;
    updateProfile: string;
    changePassword: string;
    deleteAccount: string;
    twoFactorAuth: string;
    activityLog: string;
  };
}

export type Language = 'zh' | 'my';

export interface Track {
  id: string;
  title: string;
  artist: string;
  coverImage: string;
  audioUrl: string; // 统一为 audioUrl，与 MusicPlayer 内部使用匹配
  duration: number; // MusicPlayer 内部需要秒数，保持为 number 类型
  isLiked?: boolean;
  likes?: number;
}

export interface CarouselSlide {
  id: string;
  imageUrl: string;
  title?: string;
  description?: string;
  link?: string;
  altText: string;
}

// MusicPlayer 组件的 props 接口
// 它现在内部管理播放状态，只需要接收曲目列表和当前播放索引
export interface MusicPlayerProps {
  tracks: Track[];
  onShowPlaylist: () => void; // 用于展示播放列表的函数
  currentTrackIndex: number; // 当前播放曲目的索引
  setCurrentTrackIndex: (index: number) => void; // 用于更新当前播放曲目索引的函数
}

// MusicCard 组件的 props 接口
export interface MusicCardProps {
  id: string;
  title: string;
  artist: string;
  coverImage: string;
  audioUrl: string; // **此行是新增的，解决 Vercel 报错**
  duration: string; // MusicCard 显示的 duration 仍然是格式化后的字符串
  isLiked: boolean;
  likes?: number;
  isPlaying: boolean; // MusicCard 需要知道是否正在播放，以显示正确按钮
  onPlayPause: (track: Track) => void; // 播放/暂停的事件处理器，告诉父组件要播放哪个完整的 Track
  onLikeToggle: (trackId: string) => void;
  onShare: (trackId: string) => void;
}
