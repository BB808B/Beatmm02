// src/app/rules/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import NavbarComponent from '@/components/Navbar';
import { Translations } from '@/types'; // 确保 Translations 类型被导入

export default function RulesPage() {
  const [currentLang, setCurrentLang] = useState('zh');
  const [translations, setTranslations] = useState<Translations | null>(null);

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
            heroTitle: "欢迎来到缅甸DJ平台", // 修正：将 'welcome' 改为 'heroTitle'
            heroSubtitle: "发现最棒的越南鼓DJ音乐", // 修正：将 'subtitle' 改为 'heroSubtitle'
            featuredMusicTitle: "精选音乐", // 修正：将 'featured' 改为 'featuredMusicTitle'
            recentPlaysTitle: "热门趋势",   // 修正：将 'trending' 改为 'recentPlaysTitle'
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

  if (!translations) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  // 动画变体
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
      <NavbarComponent
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        translations={translations}
      />

      <main className="bg-gradient-to-br from-gray-900 to-black min-h-screen text-white p-4 sm:p-6 lg:p-8">
        <motion.section
          className="text-center mb-8"
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <h1 className="text-4xl font-bold text-primary mb-4">
            {translations.rulesPage.title}
          </h1>
          <p className="text-gray-300 max-w-3xl mx-auto">
            {translations.rulesPage.subtitle}
          </p>
        </motion.section>

        <motion.section
          className="bg-gray-800 p-6 rounded-lg shadow-xl mb-8"
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <h2 className="text-2xl font-semibold text-accent mb-4">{translations.rulesPage.section1Title}</h2>
          <motion.ul
            className="list-disc list-inside space-y-2 text-gray-300"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {[
              translations.rulesPage.section1Item1,
              translations.rulesPage.section1Item2,
              translations.rulesPage.section1Item3,
              translations.rulesPage.section1Item4,
              translations.rulesPage.section1Item5,
              translations.rulesPage.section1Item6,
              translations.rulesPage.section1Item7,
              translations.rulesPage.section1Item8
            ].map((item, index) => (
              <motion.li key={index} variants={itemVariants}>
                {item}
              </motion.li>
            ))}
          </motion.ul>
        </motion.section>

        <motion.section
          className="bg-gray-800 p-6 rounded-lg shadow-xl mb-8"
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <h2 className="text-2xl font-semibold text-accent mb-4">{translations.rulesPage.section2Title}</h2>
          <motion.ul
            className="list-disc list-inside space-y-2 text-gray-300"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {[
              translations.rulesPage.section2Item1,
              translations.rulesPage.section2Item2,
              translations.rulesPage.section2Item3,
              translations.rulesPage.section2Item4,
              translations.rulesPage.section2Item5,
              translations.rulesPage.section2Item6,
              translations.rulesPage.section2Item7
            ].map((item, index) => (
              <motion.li key={index} variants={itemVariants}>
                {item}
              </motion.li>
            ))}
          </motion.ul>
        </motion.section>

        <motion.section
          className="bg-gray-800 p-6 rounded-lg shadow-xl mb-8"
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <h2 className="text-2xl font-semibold text-accent mb-4">{translations.rulesPage.section3Title}</h2>
          <motion.ul
            className="list-disc list-inside space-y-2 text-gray-300 mb-4"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {[
              translations.rulesPage.section3Item1,
              translations.rulesPage.section3Item2,
              translations.rulesPage.section3Item3,
            ].map((item, index) => (
              <motion.li key={index} variants={itemVariants}>
                {item}
              </motion.li>
            ))}
          </motion.ul>

          <h3 className="text-xl font-semibold text-primary mb-2">{translations.rulesPage.section3Item4Title}</h3>
          <motion.ul
            className="list-disc list-inside space-y-1 text-gray-300 mb-4 ml-4"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {[
              translations.rulesPage.section3Item4Perm1,
              translations.rulesPage.section3Item4Perm2,
              translations.rulesPage.section3Item4Perm3,
              translations.rulesPage.section3Item4Perm4
            ].map((item, index) => (
              <motion.li key={index} variants={itemVariants}>
                {item}
              </motion.li>
            ))}
          </motion.ul>

          <motion.ul
            className="list-disc list-inside space-y-2 text-gray-300"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {[
              translations.rulesPage.section3Item5,
              translations.rulesPage.section3Item6,
              translations.rulesPage.section3Item7
            ].map((item, index) => (
              <motion.li key={index} variants={itemVariants}>
                {item}
              </motion.li>
            ))}
          </motion.ul>
        </motion.section>

        <motion.section
          className="bg-gray-800 p-6 rounded-lg shadow-xl"
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <h2 className="text-2xl font-semibold text-red-400 mb-4">{translations.rulesPage.importantReminderTitle}</h2>
          <motion.ul
            className="list-disc list-inside space-y-2 text-gray-300"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {[
              translations.rulesPage.importantReminderText1,
              translations.rulesPage.importantReminderText2,
              translations.rulesPage.importantReminderText3
            ].map((item, index) => (
              <motion.li key={index} variants={itemVariants}>
                {item}
              </motion.li>
            ))}
          </motion.ul>
        </motion.section>
      </main>
    </>
  );
}
