// src/types/index.ts

// 定义整个应用的翻译结构
export interface Translations {
  title: string; // 应用的整体标题
  nav: NavTranslations; // 导航栏翻译
  home: HomeTranslations; // 首页翻译
  auth: AuthTranslations; // 认证（登录/注册）翻译
  player: PlayerTranslations; // 音乐播放器翻译
  profile: ProfileTranslations; // 个人资料页翻译
  common: CommonTranslations; // 公共/通用翻译
  rulesPage: RulesPageTranslations; // 规则页翻译
  settingsPage: SettingsPageTranslations; // 设置页翻译
}

// 导航栏翻译接口
export interface NavTranslations {
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
}

// 首页翻译接口
export interface HomeTranslations {
  heroTitle: string;
  heroSubtitle: string;
  featuredMusicTitle: string;
  recentPlaysTitle: string;
  topArtistsTitle: string;
  newReleasesTitle: string;
  viewAll: string;
}

// 认证（登录/注册）翻译接口
export interface AuthTranslations {
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
}

// 音乐播放器翻译接口
export interface PlayerTranslations {
  play: string;
  pause: string;
  next: string;
  previous: string;
  volume: string;
  shuffle: string;
  repeat: string;
}

// 个人资料页翻译接口
export interface ProfileTranslations {
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
}

// 通用翻译接口
export interface CommonTranslations {
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
}

// 规则页翻译接口
export interface RulesPageTranslations {
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
}

// 设置页翻译接口
export interface SettingsPageTranslations {
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
}


// >>> 其他独立接口（非Translations一部分） <<<

// Track 接口 - 添加缺失的属性
export interface Track {
  id: string;
  title: string;
  artist: string;
  coverImage: string; // 对应 albumArt
  audioSrc: string;
  isLiked?: boolean;
  albumArt?: string; // 确保包含 albumArt，或者直接使用 coverImage
  duration?: string; // 添加 duration
  likes?: number; // 添加 likes
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

// MusicPlayerProps 接口
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
