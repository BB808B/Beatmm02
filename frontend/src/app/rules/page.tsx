// src/app/rules/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaFileContract, FaMoneyBillWave, FaMicrophone } from 'react-icons/fa';
import NavbarComponent from '@/components/Navbar';
import { Translations } from '@/types'; // 确保 Translations 类型正确导入
import { motion } from 'framer-motion';


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
        // 提供一个最小的备用翻译，或者显示错误消息
        setTranslations({
          title: '缅甸DJ平台', // Updated title for consistency
          nav: {
            home: '首页', music: '音乐', dj: 'DJ', live: '直播', ranking: '排行榜',
            profile: '个人中心', login: '登录', register: '注册', logout: '退出', rules: '规则'
          },
          home: {
            welcome: '欢迎来到缅甸DJ平台', subtitle: '发现最棒的越南鼓DJ音乐', featured: '精选音乐', trending: '热门趋势', newReleases: '最新发布'
          },
          auth: {
            // 确保与 src/types/index.ts 中的 Translations 接口的 auth 部分完全匹配
            loginTitle: '登录', // Added to match types
            phone: '手机号码',
            password: '密码',
            confirmPassword: '确认密码',
            loginButton: '登录', // Changed from 'login'
            registerButton: '注册', // Changed from 'register'
            forgotPassword: '忘记密码？',
            noAccount: '没有账号？',
            hasAccount: '已有账号？',
            registerNow: '立即注册',
            loginNow: '立即登录',
            loginSuccess: '登录成功！', // Added to match types
            loginError: '登录失败。', // Added to match types
            phoneRequired: '手机号码不能为空', // Added to match types
            passwordRequired: '密码不能为空', // Added to match types
            confirmPasswordRequired: '请确认密码', // Added to match types
            passwordMismatch: '密码不匹配', // Added to match types
            registerSuccess: '注册成功！', // Added to match types
            registerError: '注册失败。' // Added to match types
          },
          player: {
            play: '播放', pause: '暂停', next: '下一首', previous: '上一首',
            volume: '音量', shuffle: '随机播放', repeat: '重复播放'
          },
          profile: {
            myProfile: '我的资料',
            editProfile: '编辑资料', // Added to match types
            myMusic: '我的音乐',
            myWallet: '我的钱包',
            balance: '余额',
            recharge: '充值',
            withdraw: '提现',
            settings: '设置',
            djApplication: 'DJ认证申请',
            logout: '退出登录', // Added to match types
            phone: '手机号码', // Added to match types
            username: '用户名', // Added to match types
            greeting: '你好，{username}！', // Added to match types
            djStatus: 'DJ状态：', // Added to match types
            notDj: '未认证', // Added to match types
            isDj: '已认证' // Added to match types
          },
          common: {
            search: '搜索', submit: '提交', cancel: '取消', confirm: '确认',
            save: '保存', edit: '编辑', delete: '删除', loading: '加载中...',
            error: '错误', success: '成功',
            viewDetails: '查看详情' // Added to match types
          },
          // 最小的 rulesPage 备用翻译 (已补全所有缺失的字段)
          rulesPage: {
            title: "平台规则与条款",
            subtitle: "为了维护平台秩序，保障用户权益，请仔细阅读以下规则与条款",
            section1Title: "一、使用条款", // Changed to match common.json style
            section1Item1: "BeatMM Pro 是面向缅甸用户的音乐分享与DJ社区平台，仅限合法、和平用途。",
            section1Item2: "用户上传内容必须为本人原创或已获得授权。禁止盗用他人音乐、封面或介绍。",
            section1Item3: "所有打赏行为为用户自愿，不支持打赏退款。平台提供技术服务并抽取服务费用。",
            section1Item4: "用户在平台注册即表示同意遵守平台规则，如有违规行为，平台有权删除内容或封禁账号。",
            section1Item5: "禁止上传或发布任何违法、色情、暴力、仇恨、政治相关内容。",
            section1Item6: "本平台禁止用户私聊，仅允许与系统客服互动，以确保信息安全与合规。",
            section1Item7: "提现前需提供真实收款信息。若提现账户与注册身份不一致，平台有权拒绝处理。",
            section1Item8: "BeatMM Pro 保留最终解释权，并有权随时修改条款以适应本地法规或运营策略。",
            section2Title: "二、打赏与提现规则", // Changed to match common.json style
            section2Item1: "用户可通过 KPay、KBZ Banking 等方式进行账户充值，并用于打赏喜爱的 DJ。",
            section2Item2: "打赏金额由用户自由选择，打赏一经确认，不可撤销、不可退款。",
            section2Item3: "打赏收入将进入 DJ 的账户，平台将自动扣除 10% 技术服务费。",
            section2Item4: "DJ 可在余额满 3,000 MMK 后申请提现。提现金额将通过 KPay/KBZ Banking 发放。",
            section2Item5: "所有提现申请将在 24 小时内由管理员人工审核，需上传真实收款二维码。",
            section2Item6: "提现账户必须与 DJ 账号绑定手机号一致，严禁使用他人账户或虚假资料。",
            section2Item7: "若发现刷打赏、伪造截图、虚假交易等行为，将立即封禁账号，冻结余额。",
            section3Title: "三、DJ认证规则", // Changed to match common.json style
            section3Item1: "任何 BeatMM 用户均可在“申请成为DJ”页面提交申请，填写个人信息与上传音乐作品。",
            section3Item2: "申请需提交：艺名、头像、至少一首原创音乐作品。",
            section3Item3: "平台将于 1~2 个工作日内进行人工审核，主要审核内容包括：作品原创性、音质、是否违规。",
            section3Item4Title: "DJ权限", // Corrected as per common.json
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
          }
        });
      }
    };

    loadTranslations();
  }, [currentLang]);

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
  };

  const goBack = () => {
    window.history.back();
  };

  if (!translations) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        {translations?.common?.loading || '加载中...'} {/* Changed 'Loading...' to '加载中...' for consistency */}
      </div>
    );
  }

  // Common motion variants for cards and items
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <>
      <NavbarComponent
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        translations={translations}
      />

      <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white pt-24 pb-10">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8"
          >
            <div className="flex items-center mb-4 md:mb-0">
              <button
                className="neon-icon-btn p-2 mr-3"
                onClick={goBack}
              >
                <FaArrowLeft size={20} />
              </button>
              <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent leading-tight">
                <FaFileContract className="inline-block mr-2 text-primary" />
                {translations.rulesPage.title}
              </h1>
            </div>
            <p className="text-gray-400 text-lg md:text-right md:max-w-md">
              {translations.rulesPage.subtitle}
            </p>
          </motion.div>

          {/* Section 1: Usage Terms */}
          <motion.div
            className="glass-panel neon-border p-6 rounded-xl shadow-lg mb-8"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="bg-primary text-white p-4 rounded-t-lg -mx-6 -mt-6 mb-6">
              <h3 className="text-2xl font-bold flex items-center">
                <FaFileContract className="mr-3" />
                {translations.rulesPage.section1Title}
              </h3>
            </div>
            <ul className="list-none p-0 space-y-4">
              {[
                translations.rulesPage.section1Item1,
                translations.rulesPage.section1Item2,
                translations.rulesPage.section1Item3,
                translations.rulesPage.section1Item4,
                translations.rulesPage.section1Item5,
                translations.rulesPage.section1Item6,
                translations.rulesPage.section1Item7,
                translations.rulesPage.section1Item8,
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="flex items-start"
                  variants={listItemVariants}
                >
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full font-bold text-sm mr-3">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Section 2: Tipping & Withdrawal Rules */}
          <motion.div
            className="glass-panel neon-border p-6 rounded-xl shadow-lg mb-8"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="bg-secondary text-white p-4 rounded-t-lg -mx-6 -mt-6 mb-6">
              <h3 className="text-2xl font-bold flex items-center">
                <FaMoneyBillWave className="mr-3" />
                {translations.rulesPage.section2Title}
              </h3>
            </div>
            <ul className="list-none p-0 space-y-4">
              {[
                translations.rulesPage.section2Item1,
                translations.rulesPage.section2Item2,
                translations.rulesPage.section2Item3,
                translations.rulesPage.section2Item4,
                translations.rulesPage.section2Item5,
                translations.rulesPage.section2Item6,
                translations.rulesPage.section2Item7,
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="flex items-start"
                  variants={listItemVariants}
                >
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-secondary text-white rounded-full font-bold text-sm mr-3">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Section 3: DJ Certification Rules */}
          <motion.div
            className="glass-panel neon-border p-6 rounded-xl shadow-lg mb-8"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="bg-accent text-black p-4 rounded-t-lg -mx-6 -mt-6 mb-6">
              <h3 className="text-2xl font-bold flex items-center">
                <FaMicrophone className="mr-3" />
                {translations.rulesPage.section3Title}
              </h3>
            </div>
            <ul className="list-none p-0 space-y-4">
              {[
                translations.rulesPage.section3Item1,
                translations.rulesPage.section3Item2,
                translations.rulesPage.section3Item3,
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="flex items-start"
                  variants={listItemVariants}
                >
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-accent text-black rounded-full font-bold text-sm mr-3">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </motion.li>
              ))}
              <motion.li className="mb-3 flex items-start" variants={listItemVariants}>
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-accent text-black rounded-full font-bold text-sm mr-3">
                  4
                </span>
                <div>
                  <span>{translations.rulesPage.section3Item4Title}</span>
                  <ul className="mt-2 ml-3 list-disc list-inside">
                    <li>{translations.rulesPage.section3Item4Perm1}</li>
                    <li>{translations.rulesPage.section3Item4Perm2}</li>
                    <li>{translations.rulesPage.section3Item4Perm3}</li>
                    <li>{translations.rulesPage.section3Item4Perm4}</li>
                  </ul>
                </div>
              </motion.li>
              {[
                translations.rulesPage.section3Item5,
                translations.rulesPage.section3Item6,
                translations.rulesPage.section3Item7,
              ].map((item, index) => (
                <motion.li
                  key={index + 4} // Adjust key for uniqueness
                  className="flex items-start"
                  variants={listItemVariants}
                >
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-accent text-black rounded-full font-bold text-sm mr-3">
                    {index + 5}
                  </span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Important Reminder */}
          <motion.div
            className="glass-panel neon-border border-warning p-6 rounded-xl text-center shadow-lg"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <h4 className="text-warning text-2xl font-bold mb-3">
              {translations.rulesPage.importantReminderTitle}
            </h4>
            <p className="mb-3 text-lg">
              {translations.rulesPage.importantReminderText1}
            </p>
            <p className="mb-3 text-lg">
              {translations.rulesPage.importantReminderText2}
            </p>
            <p className="mb-0 text-gray-400">
              {translations.rulesPage.importantReminderText3}
            </p>
          </motion.div>
        </div>
      </main>
    </>
  );
}
