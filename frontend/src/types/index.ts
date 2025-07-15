// 用户相关类型
export interface User {
  id: string;
  phone: string;
  role: 'user' | 'dj' | 'admin' | 'super_admin';
  balance: number;
  is_dj: boolean;
  is_active: boolean;
  created_at: string;
  last_login?: string;
  nickname?: string;
  avatar_url?: string;
}

// 音乐轨道类型
export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  cover: string;
  plays: number;
  likes: number;
  isLiked?: boolean;
  uploader_id?: string;
  genre?: string;
  tags?: string[];
  created_at: string;
}

// 翻译类型 (已修改)
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
    rules: string; // <-- 新增这一行，解决 'rules' 不存在的问题
  };
  home: {
    welcome: string;
    subtitle: string;
    featured: string;
    trending: string;
    newReleases: string;
  };
  auth: {
    phone: string;
    password: string;
    confirmPassword: string;
    login: string;
    register: string;
    forgotPassword: string;
    noAccount: string;
    hasAccount: string;
    registerNow: string;
    loginNow: string;
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
    myMusic: string;
    myWallet: string;
    settings: string;
    djApplication: string;
    balance: string;
    recharge: string;
    withdraw: string;
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
  };
  // 根据您login/page.tsx的fallback，还需要添加 rulesPage:
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
    section3Item5: string;
    section3Item6: string;
    section3Item7: string;
    importantReminderTitle: string;
    importantReminderText1: string;
    importantReminderText2: string;
    importantReminderText3: string;
  };
}

// 语言选项类型
export interface Language {
  code: string;
  name: string;
  flag: string;
}

// 轮播图类型
export interface CarouselSlide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  buttonText: string;
}

// 组件Props类型
export interface NavbarProps {
  currentLang: string;
  onLanguageChange: (lang: string) => void;
  translations: Translations;
}

export interface MusicPlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  translations: Translations;
}

export interface MusicCardProps {
  track: Track;
  isPlaying: boolean;
  isCurrentTrack: boolean;
  onPlay: (track: Track) => void;
  onPause: () => void;
  onLike: (trackId: string) => void;
  translations: Translations;
}
