// src/types/index.ts

// 定义 Translations 接口，包含应用程序的所有文本内容
export interface Translations {
  title: string;
  nav: NavTranslations;
  home: HomeTranslations;
  auth: AuthTranslations;
  player: PlayerTranslations;
  profile: ProfileTranslations;
  common: CommonTranslations;
  rulesPage: RulesPageTranslations; // 新增的 rulesPage 翻译
  settingsPage: SettingsPageTranslations; // 新增的 settingsPage 翻译
}

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

export interface HomeTranslations {
  welcome: string;
  subtitle: string;
  featured: string;
  trending: string;
  newReleases: string;
}

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
  registerTitle: string; // 确保这个属性在这里
}

export interface PlayerTranslations {
  play: string;
  pause: string;
  next: string;
  previous: string;
  volume: string;
  shuffle: string;
  repeat: string;
}

export interface ProfileTranslations {
  myProfile: string;
  editProfile: string;
  myMusic: string;
  myWallet: string;
  balance: string;
  recharge: string;
  withdraw: string;
  settings: string;
  djApplication: string;
  logout: string;
  phone: string;
  username: string;
  greeting: string;
  djStatus: string;
  notDj: string;
  isDj: string;
}

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

// >>> 新增 MusicCardProps 接口 <<<
export interface MusicCardProps {
  id: string;
  title: string;
  artist: string;
  coverImage: string; // URL to the album cover
  audioSrc: string;   // URL to the audio file
  isLiked: boolean;
  isPlaying: boolean;
  onPlayPause: (id: string) => void;
  onLikeToggle: (id: string) => void;
  onShare: (id: string) => void;
  // 可以根据实际需求添加更多属性，例如 duration, views, etc.
}
