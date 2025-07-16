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

// 翻译类型 (已修正以匹配 login/page.tsx 的 fallback 翻译)
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
    rules: string; // 确保这里有 rules
  };
  home: {
    welcome: string;
    subtitle: string;
    featured: string;
    trending: string;
    newReleases: string;
  };
  auth: {
    loginTitle: string;
    phone: string;
    password: string;
    confirmPassword: string;
    loginButton: string;
    forgotPassword: string;
    noAccount: string;
    hasAccount: string; // login/page.tsx fallback 中没有，但之前的 profile/page.tsx 里有，这里加上
    registerNow: string;
    loginNow: string; // login/page.tsx fallback 中没有，但之前的 profile/page.tsx 里有，这里加上
    loginSuccess: string;
    loginError: string;
    phoneRequired: string;
    passwordRequired: string;
    // 下面这些在 login/page.tsx 的 auth fallback 中缺失，但 profile/page.tsx 和通用情况下可能需要，为了完整性添加
    registerTitle?: string; // 可选，因为 login/page.tsx fallback 里没有
    registerButton?: string; // 可选，因为 login/page.tsx fallback 里没有
    confirmPasswordRequired?: string; // 可选，因为 login/page.tsx fallback 里没有
    passwordMismatch?: string; // 可选，因为 login/page.tsx fallback 里没有
    registerSuccess?: string; // 可选，因为 login/page.tsx fallback 里没有
    registerError?: string; // 可选，因为 login/page.tsx fallback 里没有
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
    // 之前在 profile/page.tsx 提到的字段，为了完整性添加到这里
    editProfile?: string;
    logout?: string;
    phone?: string;
    username?: string;
    greeting?: string;
    djStatus?: string;
    notDj?: string;
    isDj?: string;
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
    viewDetails?: string; // 之前 profile/page.tsx 里有，这里添加
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
