// src/app/profile/page.tsx

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaUserEdit, FaMusic, FaWallet, FaSignOutAlt, FaCrown, FaPhone, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import NavbarComponent from '@/components/Navbar';
import Carousel from '@/components/Carousel'; // Assuming you use Carousel here
import { CarouselSlide, Translations } from '@/types'; // Import CarouselSlide and Translations from types

export default function ProfilePage() {
  const [currentLang, setCurrentLang] = useState('zh');
  const [translations, setTranslations] = useState<Translations | null>(null);
  const [username, setUsername] = useState('John Doe'); // Placeholder
  const [email, setEmail] = useState('john.doe@example.com'); // Placeholder
  const [phone, setPhone] = useState('09XXXXXXXXX'); // Placeholder
  const [balance, setBalance] = useState(15000); // Placeholder balance
  const [isDj, setIsDj] = useState(false); // Placeholder DJ status
  const [editMode, setEditMode] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Dummy data for carousel (adjust as needed)
  const dummySlides: CarouselSlide[] = [
    { id: '1', imageUrl: '/images/carousel-1.jpg', altText: 'Promotion 1', link: '#' },
    { id: '2', imageUrl: '/images/carousel-2.jpg', altText: 'Promotion 2', link: '#' },
    { id: '3', imageUrl: '/images/carousel-3.jpg', altText: 'Promotion 3', link: '#' },
  ];

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const response = await fetch(`/locales/${currentLang}/common.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error('Failed to load translations:', error);
        // Fallback translations - MUST match Translations type
        setTranslations({
          title: "缅甸DJ平台",
          nav: {
            home: "首页",
            music: "音乐",
            dj: "DJ",
            live: "直播",
            ranking: "排行榜",
            profile: "个人中心",
            login: "登录",
            register: "注册",
            logout: "退出",
            rules: "规则"
          },
          home: {
            heroTitle: "欢迎来到缅甸DJ平台",
            heroSubtitle: "发现最棒的越南鼓DJ音乐",
            featuredMusicTitle: "精选音乐",
            recentPlaysTitle: "热门趋势",
            topArtistsTitle: "热门艺术家",
            newReleasesTitle: "最新发布",
            viewAll: "查看全部"
          },
          auth: {
            loginTitle: "登录",
            phone: "手机号码",
            password: "密码",
            confirmPassword: "确认密码",
            loginButton: "登录",
            registerButton: "注册",
            forgotPassword: "忘记密码？",
            noAccount: "没有账号？",
            hasAccount: "已有账号？",
            registerNow: "立即注册",
            loginNow: "立即登录",
            loginSuccess: "登录成功！",
            loginError: "登录失败。",
            phoneRequired: "手机号码不能为空",
            passwordRequired: "密码不能为空",
            confirmPasswordRequired: "请确认密码",
            passwordMismatch: "密码不匹配",
            registerSuccess: "注册成功！",
            registerError: "注册失败。",
            registerTitle: "注册"
          },
          player: {
            play: "播放",
            pause: "暂停",
            next: "下一首",
            previous: "上一首",
            volume: "音量",
            shuffle: "随机播放",
            repeat: "重复播放"
          },
          profile: {
            myProfile: "我的资料",
            editProfile: "编辑资料",
            myMusic: "我的音乐",
            myWallet: "我的钱包",
            balance: "余额",
            recharge: "充值",
            withdraw: "提现",
            djApplication: "DJ认证申请",
            logout: "退出登录",
            phone: "手机号码",
            username: "用户名",
            greeting: "你好，{username}！",
            djStatus: "DJ状态：",
            notDj: "未认证",
            isDj: "已认证",
            title: "个人资料设置",
            email: "邮箱",
            changePassword: "修改密码",
            currentPasswordPlaceholder: "当前密码",
            newPasswordPlaceholder: "新密码",
            confirmPasswordPlaceholder: "确认新密码",
            updateProfileButton: "更新资料",
            settings: "设置",
            darkMode: "深色模式",
            notifications: "通知"
          },
          common: {
            search: "搜索",
            submit: "提交",
            cancel: "取消",
            confirm: "确认",
            save: "保存",
            edit: "编辑",
            delete: "删除",
            loading: "加载中...",
            error: "错误",
            success: "成功",
            viewDetails: "查看详情",
            on: "开启",
            off: "关闭"
          },
          rulesPage: {
            title: "平台规则与条款",
            subtitle: "为了维护平台秩序，保障用户权益，请仔细阅读以下规则与条款",
            section1Title: "使用条款",
            section1Item1: "BeatMM Pro 是面向缅甸用户的音乐分享与DJ社区平台，仅限合法、和平用途。",
            section1Item2: "用户上传内容必须为本人原创或已获得授权。禁止盗用他人音乐、封面或介绍。",
            section1Item3: "所有打赏行为为用户自愿，不支持打赏退款。平台提供技术服务并抽取服务费用。",
            section1Item4: "用户在平台注册即表示同意遵守平台规则，如有违规行为，平台有权删除内容或封禁账号。",
            section1Item5: "禁止上传或发布任何违法、色情、暴力、仇恨、政治相关内容。",
            section1Item6: "本平台禁止用户私聊，仅允许与系统客服互动，以确保信息安全与合规。",
            section1Item7: "提现前需提供真实收款信息。若提现账户与注册身份不一致，平台有权拒绝处理。",
            section1Item8: "BeatMM Pro 保留最终解释权，并有权随时修改条款以适应本地法规或运营策略。",
            section2Title: "打赏与提现规则",
            section2Item1: "用户可通过 KPay、KBZ Banking 等方式进行账户充值，并用于打赏喜爱的 DJ。",
            section2Item2: "打赏金额由用户自由选择，打赏一经确认，不可撤销、不可退款。",
            section2Item3: "打赏收入将进入 DJ 的账户，平台将自动扣除 10% 技术服务费。",
            section2Item4: "DJ 可在余额满 3,000 MMK 后申请提现。提现金额将通过 KPay/KBZ Banking 发放。",
            section2Item5: "所有提现申请将在 24 小时内由管理员人工审核，需上传真实收款二维码。",
            section2Item6: "提现账户必须与 DJ 账号绑定手机号一致，严禁使用他人账户或虚假资料。",
            section2Item7: "若发现刷打赏、伪造截图、虚假交易等行为，将立即封禁账号，冻结余额。",
            section3Title: "DJ认证规则",
            section3Item1: "任何 BeatMM 用户均可在“申请成为DJ”页面提交申请，填写个人信息与上传音乐作品。",
            section3Item2: "申请需提交：艺名、头像、至少一首原创音乐作品。",
            section3Item3: "平台将于 1~2 个工作日内进行人工审核，主要审核内容包括：作品原创性、音质、是否违规。",
            section3Item4Title: "DJ权限",
            section3Item4Perm1: "上传音乐",
            section3Item4Perm2: "查看数据",
            section3Item4Perm3: "提现收入",
            section3Item4Perm4: "进入排行榜",
            section3Item5: "若 DJ 上传违反规定的内容，将撤销认证并永久封禁。",
            section3Item6: "每位 DJ 对其上传内容负全责，平台不承担任何侵权责任。",
            section3Item7: "鼓励创作越南鼓、缅甸风格、本地原创音乐作品。",
            importantReminderTitle: "重要提醒",
            importantReminderText1: "使用本平台即表示您已阅读、理解并同意遵守以上所有规则与条款。",
            importantReminderText2: "平台致力于为用户提供安全、合规的音乐分享环境，共同维护良好的社区氛围。",
            importantReminderText3: "如有疑问，请联系客服或查看帮助文档。"
          },
          settingsPage: {
            title: "设置",
            language: "语言",
            theme: "主题",
            notifications: "通知",
            privacy: "隐私",
            account: "账户",
            security: "安全",
            darkMode: "深色模式",
            lightMode: "浅色模式",
            pushNotifications: "推送通知",
            emailNotifications: "邮件通知",
            updateProfile: "更新资料",
            changePassword: "修改密码",
            deleteAccount: "删除账户",
            twoFactorAuth: "两步验证",
            activityLog: "活动日志"
          }
        });
      }
    };
    loadTranslations();
  }, [currentLang]);

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
  };

  const handleUpdateProfile = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // Implement profile update logic here
    console.log('Updating profile:', { username, email, phone });
    setEditMode(false);
    alert(translations?.common.success || 'Profile updated successfully!');
  }, [username, email, phone, translations]);

  const handleChangePassword = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      alert(translations?.auth.passwordMismatch || 'New passwords do not match.');
      return;
    }
    // Implement change password logic here (e.g., API call)
    console.log('Changing password:', { currentPassword, newPassword });
    alert(translations?.common.success || 'Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  }, [currentPassword, newPassword, confirmNewPassword, translations]);

  const handleDjApplication = () => {
    // Implement DJ application logic (e.g., navigate to application form or show modal)
    alert(translations?.profile.djApplication || 'Navigating to DJ application form.');
  };

  const handleLogout = () => {
    // Implement logout logic
    alert(translations?.profile.logout || 'Logged out successfully!');
  };

  if (!translations) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  return (
    <>
      <NavbarComponent
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        translations={translations}
      />

      <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white pt-16 md:pt-20 pb-8">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          <motion.h1
            className="text-4xl font-extrabold text-center text-primary mb-10 mt-4"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {translations.profile.myProfile}
          </motion.h1>

          {/* Carousel Section (Optional, remove if not needed) */}
          <motion.section
            className="mb-10"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Carousel slides={dummySlides} />
          </motion.section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Overview */}
            <motion.div
              className="md:col-span-1 bg-gray-800 rounded-lg shadow-xl p-6 flex flex-col items-center"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="relative w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center mb-4 border-4 border-primary">
                <FaUser className="text-6xl text-gray-400" />
                {/* <img src="/images/profile-placeholder.jpg" alt="Profile" className="w-full h-full rounded-full object-cover" /> */}
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{username}</h2>
              <p className="text-gray-400 text-sm mb-4">{translations.profile.greeting.replace('{username}', username)}</p>

              <div className="w-full space-y-3 mb-6">
                <div className="flex items-center justify-between text-lg">
                  <span className="text-gray-300">{translations.profile.balance}:</span>
                  <span className="font-semibold text-primary">{balance} MMK</span>
                </div>
                <div className="flex items-center justify-between text-lg">
                  <span className="text-gray-300">{translations.profile.djStatus}:</span>
                  <span className={`font-semibold ${isDj ? 'text-green-500' : 'text-yellow-500'}`}>
                    {isDj ? translations.profile.isDj : translations.profile.notDj}
                  </span>
                </div>
              </div>

              <div className="w-full space-y-4">
                <motion.button
                  className="w-full flex items-center justify-center bg-primary-dark hover:bg-primary text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setEditMode(true)}
                >
                  <FaUserEdit className="mr-2" /> {translations.profile.editProfile}
                </motion.button>
                <motion.button
                  className="w-full flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => alert(translations.profile.myMusic || 'My Music Page')}
                >
                  <FaMusic className="mr-2" /> {translations.profile.myMusic}
                </motion.button>
                <motion.button
                  className="w-full flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => alert(translations.profile.myWallet || 'My Wallet Page')}
                >
                  <FaWallet className="mr-2" /> {translations.profile.myWallet}
                </motion.button>
                {!isDj && (
                  <motion.button
                    className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDjApplication}
                  >
                    <FaCrown className="mr-2" /> {translations.profile.djApplication}
                  </motion.button>
                )}
                <motion.button
                  className="w-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="mr-2" /> {translations.profile.logout}
                </motion.button>
              </div>
            </motion.div>

            {/* Profile Settings / Edit Mode */}
            <motion.div
              className="md:col-span-2 bg-gray-800 rounded-lg shadow-xl p-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">
                {editMode ? translations.profile.editProfile : translations.profile.settings}
              </h2>

              {editMode ? (
                <>
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div>
                      <label htmlFor="username" className="block text-gray-300 text-sm font-bold mb-2">
                        {translations.profile.username}
                      </label>
                      <input
                        type="text"
                        id="username"
                        className="shadow-sm bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-gray-300 text-sm font-bold mb-2">
                        {translations.profile.phone}
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        className="shadow-sm bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-gray-300 text-sm font-bold mb-2">
                        {translations.profile.email}
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="shadow-sm bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <motion.button
                        type="button"
                        className="px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white font-semibold transition-colors duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setEditMode(false)}
                      >
                        {translations.common.cancel}
                      </motion.button>
                      <motion.button
                        type="submit"
                        className="px-6 py-2 rounded-lg bg-primary-dark hover:bg-primary text-white font-semibold transition-colors duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {translations.profile.updateProfileButton}
                      </motion.button>
                    </div>
                  </form>

                  <h3 className="text-xl font-bold text-white mt-8 mb-4 border-b border-gray-700 pb-3">
                    {translations.profile.changePassword}
                  </h3>
                  <form onSubmit={handleChangePassword} className="space-y-6">
                    <div>
                      <label htmlFor="current-password" className="block text-gray-300 text-sm font-bold mb-2">
                        {translations.profile.currentPasswordPlaceholder}
                      </label>
                      <input
                        type="password"
                        id="current-password"
                        className="shadow-sm bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="new-password" className="block text-gray-300 text-sm font-bold mb-2">
                        {translations.profile.newPasswordPlaceholder}
                      </label>
                      <input
                        type="password"
                        id="new-password"
                        className="shadow-sm bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="confirm-new-password" className="block text-gray-300 text-sm font-bold mb-2">
                        {translations.profile.confirmPasswordPlaceholder}
                      </label>
                      <input
                        type="password"
                        id="confirm-new-password"
                        className="shadow-sm bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex justify-end">
                      <motion.button
                        type="submit"
                        className="px-6 py-2 rounded-lg bg-primary-dark hover:bg-primary text-white font-semibold transition-colors duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {translations.profile.changePassword}
                      </motion.button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-lg">{translations.settingsPage.darkMode}</span>
                    <label htmlFor="dark-mode-toggle" className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" id="dark-mode-toggle" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-primary-dark peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-lg">{translations.settingsPage.pushNotifications}</span>
                    <label htmlFor="push-notifications-toggle" className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" id="push-notifications-toggle" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-primary-dark peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  {/* Add more settings options as needed */}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
}
