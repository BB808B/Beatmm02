// src/app/login/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';
import NavbarComponent from '@/components/Navbar';
import { Translations } from '@/types'; // 确保从正确的路径导入 Translations 类型

export default function LoginPage() {
  const [currentLang, setCurrentLang] = useState('zh');
  const [translations, setTranslations] = useState<Translations | null>(null);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
          title: "缅甸DJ平台", // 确保存在
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
            // 注意：这里不再包含 'welcome', 'subtitle' 等，因为 HomeTranslations 接口已更新
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
          // 修复：profile 属性的键名与 ProfileTranslations 接口完全匹配
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
            title: "个人资料设置", // 确保存在，并提供中文翻译
            email: "邮箱", // 确保存在，并提供中文翻译
            changePassword: "修改密码", // 确保存在，并提供中文翻译
            currentPasswordPlaceholder: "当前密码", // 确保存在，并提供中文翻译
            newPasswordPlaceholder: "新密码", // 确保存在，并提供中文翻译
            confirmPasswordPlaceholder: "确认新密码", // 确保存在，并提供中文翻译
            updateProfileButton: "更新资料", // 确保存在，并提供中文翻译
            settings: "设置", // 确保存在，并提供中文翻译
            darkMode: "深色模式", // 确保存在，并提供中文翻译
            notifications: "通知" // 确保存在，并提供中文翻译
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!phone) {
      setError(translations?.auth?.phoneRequired || '手机号码不能为空');
      return;
    }
    if (!password) {
      setError(translations?.auth?.passwordRequired || '密码不能为空');
      return;
    }

    setLoading(true);
    try {
      const response = await new Promise(resolve =>
        setTimeout(() => {
          if (phone === '123456789' && password === 'password123') {
            resolve({ success: true, message: translations?.auth?.loginSuccess || 'Login successful!' });
          } else {
            resolve({ success: false, message: translations?.auth?.loginError || 'Login failed. Please check your phone number or password.' });
          }
        }, 1500)
      );

      const data = response as { success: boolean; message: string };

      if (data.success) {
        console.log(data.message);
        router.push('/profile');
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(translations?.common?.error || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (!translations) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        {'加载中...'}
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

      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
        <motion.div
          className="glass-panel neon-border p-8 rounded-xl shadow-2xl w-full max-w-md text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            {translations.auth.loginTitle}
          </h2>

          {error && (
            <motion.div
              className="bg-red-800 bg-opacity-70 text-white px-4 py-3 rounded-lg mb-6 text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={translations.auth.phone}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-primary focus:ring-primary focus:outline-none transition-all duration-300 text-lg"
                aria-label={translations.auth.phone}
              />
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder={translations.auth.password}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-primary focus:ring-primary focus:outline-none transition-all duration-300 text-lg"
                aria-label={translations.auth.password}
              />
            </motion.div>

            <motion.button
              type="submit"
              className="w-full neon-button py-3 rounded-lg font-bold text-lg flex items-center justify-center transition-all duration-300"
              disabled={loading}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {loading ? (
                translations.common.loading
              ) : (
                <>
                  <FaSignInAlt className="mr-2" />
                  {translations.auth.loginButton}
                </>
              )}
            </motion.button>
          </form>

          <motion.div
            className="text-center mt-6 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <p className="text-gray-300 mb-2">
              {translations.auth.forgotPassword}{' '}
              <a href="#" className="text-primary hover:underline transition-colors duration-200">
                {translations.auth.confirmPassword} {/* 这里可能应该是一个链接文本，而不是confirmPassword */}
              </a>
            </p>
            <p className="text-gray-300">
              {translations.auth.noAccount}{' '}
              <a
                href="/register"
                className="text-accent hover:underline transition-colors duration-200"
              >
                {translations.auth.registerNow}
              </a>
            </p>
          </motion.div>
        </motion.div>
      </main>
    </>
  );
}
