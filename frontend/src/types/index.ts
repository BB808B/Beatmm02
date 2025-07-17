// src/types/index.ts

// 定义通用的翻译类型
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

// 定义导航栏的翻译类型
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

// 定义首页的翻译类型
export interface HomeTranslations {
  welcome: string;
  subtitle: string;
  featured: string;
  trending: string;
  newReleases: string;
}

// 定义认证/登录/注册相关的翻译类型
export interface AuthTranslations {
  loginTitle: string;
  phone: string;
  password: string;
  confirmPassword: string;
  loginButton: string;
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
  registerTitle: string; // <--- 修复: 添加缺失的 registerTitle 属性
  registerButton: string;
}

// 定义播放器相关的翻译类型
export interface PlayerTranslations {
  play: string;
  pause: string;
  next: string;
  previous: string;
  volume: string;
  shuffle: string;
  repeat: string;
}

// 定义个人中心相关的翻译类型
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

// 定义规则页面的翻译类型
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

// 定义设置页面的翻译类型
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


// 组合所有翻译类型
export interface Translations {
  title: string;
  nav: NavTranslations;
  home: HomeTranslations;
  auth: AuthTranslations;
  player: PlayerTranslations;
  profile: ProfileTranslations;
  common: CommonTranslations;
  rulesPage: RulesPageTranslations;
  settingsPage: SettingsPageTranslations;
}

// 定义音乐播放器轨道类型
export interface Track {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  audioSrc: string;
  duration: string;
  isLiked: boolean;
  likes: number;
}

// 定义轮播图幻灯片类型
export interface CarouselSlide {
  id: string;
  imageUrl: string; // 使用 imageUrl 而不是 image
  title: string;
  description: string;
  link: string;
}
