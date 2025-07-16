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

// 翻译类型 (已修改，已与 profile/page.tsx 的 fallback 翻译完全同步)
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
    register: string; // 确保这里是 register
    logout: string;
    rules: string;
  };
  home: {
    welcome: string;
    subtitle: string;
    featured: string;
    trending: string;
    newReleases: string;
  };
  auth: {
    loginTitle: string; // <-- 新增
    phone: string;
    password: string;
    confirmPassword: string;
    loginButton: string; // <-- 新增
    forgotPassword: string;
    noAccount: string;
    hasAccount: string;
    registerNow: string;
    registerTitle: string; // <-- 新增
    registerButton: string; // <-- 新增
    loginNow: string;
    loginSuccess: string; // <-- 新增
    loginError: string; // <-- 新增
    phoneRequired: string; // <-- 新增
    passwordRequired: string; // <-- 新增
    confirmPasswordRequired: string; // <-- 新增
    passwordMismatch: string; // <-- 新增
    registerSuccess: string; // <-- 新增
    registerError: string; // <-- 新增
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
    editProfile: string; // <-- 新增 (profile/page.tsx 中有用到)
    myMusic: string;
    myWallet: string;
    settings: string;
    djApplication: string;
    balance: string;
    recharge: string;
    withdraw: string;
    logout: string; // <-- 新增 (profile/page.tsx 中有用到)
    phone: string; // <-- 新增 (profile/page.tsx 中有用到)
    username: string; // <-- 新增 (profile/page.tsx 中有用到)
    greeting: string; // <-- 新增 (profile/page.tsx 中有用到)
    djStatus: string; // <-- 新增 (profile/page.tsx 中有用到)
    notDj: string; // <-- 新增 (profile/page.tsx 中有用到)
    isDj: string; // <-- 新增 (profile/page.tsx 中有用到)
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
    viewDetails: string; // <-- 新增 (profile/page.tsx 中有用到)
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
