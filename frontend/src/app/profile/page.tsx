// src/app/profile/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaCog, FaSignOutAlt, FaMusic, FaWallet, FaAward } from 'react-icons/fa';
import NavbarComponent from '@/components/Navbar';
import { Translations } from '@/types'; // 确保从正确的路径导入 Translations 类型

export default function ProfilePage() {
  const [currentLang, setCurrentLang] = useState('zh');
  const [translations, setTranslations] = useState<Translations | null>(null);
  const router = useRouter();

  // 模拟用户数据
  const [user, setUser] = useState({
    username: '用户DABAI',
    phone: '09xxxxxxxxx',
    isDJ: true,
    balance: 150000, // 缅甸币
  });

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
        // Fallback translations - 必须与 src/types/index.ts 的 Translations 类型完全匹配
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
            welcome: "欢迎来到缅甸DJ平台",
            subtitle: "发现最棒的越南鼓DJ音乐",
            featured: "精选音乐",
            trending: "热门趋势",
            newReleases: "最新发布"
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
            registerError: "注册失败.",
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
            settings: "设置",
            djApplication: "DJ认证申请",
            logout: "退出登录",
            phone: "手机号码",
            username: "用户名",
            greeting: "你好，{username}！",
            djStatus: "DJ状态：",
            notDj: "未认证",
            isDj: "已认证"
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

  const handleLogout = () => {
    // 实际应用中会清除用户session/token
    console.log('User logged out');
    router.push('/login');
  };

  if (!translations) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        加载中... {/* 直接显示加载文本，避免在 translations 为 null 时访问其属性 */}
      </div>
    );
  }

  const menuItems = [
    { name: translations.profile.myMusic, icon: FaMusic, path: '/profile/music' },
    { name: translations.profile.myWallet, icon: FaWallet, path: '/profile/wallet' },
    { name: translations.profile.djApplication, icon: FaAward, path: '/dj/apply' },
    { name: translations.profile.settings, icon: FaCog, path: '/settings' },
  ];

  return (
    <>
      <NavbarComponent
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        translations={translations}
      />

      <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white pt-20 p-4">
        <motion.div
          className="max-w-4xl mx-auto glass-panel neon-border p-8 rounded-xl shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* User Avatar */}
            <motion.div
              className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary shadow-lg flex-shrink-0"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <img
                src="/images/profile-placeholder.jpg" // 替换为用户的头像URL
                alt="Profile Avatar"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* User Info */}
            <div className="flex-grow text-center md:text-left">
              <motion.h2
                className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {translations.profile.greeting.replace('{username}', user.username)}
              </motion.h2>
              <motion.p
                className="text-lg text-gray-300 flex items-center justify-center md:justify-start mb-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <FaPhone className="mr-2 text-primary" /> {user.phone}
              </motion.p>
              <motion.p
                className="text-lg text-gray-300 flex items-center justify-center md:justify-start mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <FaAward className="mr-2 text-accent" /> {translations.profile.djStatus}{' '}
                <span className={`font-semibold ${user.isDJ ? 'text-green-400' : 'text-red-400'}`}>
                  {user.isDJ ? translations.profile.isDj : translations.profile.notDj}
                </span>
              </motion.p>
              <motion.button
                onClick={() => router.push('/profile/edit')}
                className="neon-button py-2 px-6 rounded-full text-lg font-semibold flex items-center justify-center md:justify-start mx-auto md:mx-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <FaUser className="mr-2" /> {translations.profile.editProfile}
              </motion.button>
            </div>
          </div>

          {/* Wallet Info */}
          <motion.div
            className="mt-10 bg-gray-800 bg-opacity-60 p-6 rounded-lg shadow-inner border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold text-primary mb-4 flex items-center">
              <FaWallet className="mr-3" /> {translations.profile.myWallet}
            </h3>
            <div className="flex flex-col sm:flex-row justify-between items-center text-xl">
              <p className="text-gray-200 mb-4 sm:mb-0">
                {translations.profile.balance}:{' '}
                <span className="font-semibold text-green-400">{user.balance.toLocaleString()} MMK</span>
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => alert(translations.profile.recharge)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg transition duration-300"
                >
                  {translations.profile.recharge}
                </button>
                <button
                  onClick={() => alert(translations.profile.withdraw)}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-5 rounded-lg transition duration-300"
                >
                  {translations.profile.withdraw}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Navigation Menu */}
          <motion.div
            className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            {menuItems.map((item, index) => (
              <motion.button
                key={index}
                className="glass-card flex items-center p-6 rounded-lg text-xl font-semibold hover:bg-gray-700 hover:bg-opacity-50 transition-all duration-300 border border-gray-700 hover:border-primary"
                onClick={() => router.push(item.path)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.1, duration: 0.3 }}
              >
                <item.icon className="mr-4 text-primary text-3xl" />
                {item.name}
              </motion.button>
            ))}
          </motion.div>

          {/* Logout Button */}
          <motion.button
            onClick={handleLogout}
            className="w-full mt-10 neon-button-red py-3 rounded-lg font-bold text-lg flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <FaSignOutAlt className="mr-2" /> {translations.profile.logout}
          </motion.button>
        </motion.div>
      </main>
    </>
  );
}
