// src/app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaHeart, FaRegHeart, FaSearch, FaVolumeUp, FaEllipsisH, FaUser } from 'react-icons/fa';
import NavbarComponent from '@/components/Navbar';
import FooterComponent from '@/components/Footer';
import MusicPlayer from '@/components/MusicPlayer';
import { Translations } from '@/types';

export default function Home() {
  const [currentLang, setCurrentLang] = useState('zh');
  const [translations, setTranslations] = useState<Translations | null>(null);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likedSongs, setLikedSongs] = useState<Set<number>>(new Set());
  const [volume, setVolume] = useState(80);

  // 模拟音乐数据
  const musicData = [
    { id: 1, title: "越南鼓热曲", artist: "DJ Aung", duration: "3:45", plays: "1.2M" },
    { id: 2, title: "缅甸之夜", artist: "DJ Myo", duration: "4:20", plays: "980K" },
    { id: 3, title: "电子风暴", artist: "DJ Zaw", duration: "3:15", plays: "850K" },
    { id: 4, title: "狂欢派对", artist: "DJ Hla", duration: "5:10", plays: "1.5M" },
    { id: 5, title: "热带节奏", artist: "DJ Min", duration: "3:55", plays: "720K" },
    { id: 6, title: "城市脉动", artist: "DJ Kyaw", duration: "4:05", plays: "930K" },
  ];

  // 模拟艺术家数据
  const artistsData = [
    { id: 1, name: "DJ Aung", followers: "120K" },
    { id: 2, name: "DJ Myo", followers: "98K" },
    { id: 3, name: "DJ Zaw", followers: "85K" },
    { id: 4, name: "DJ Hla", followers: "150K" },
  ];

  // 加载翻译
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const response = await fetch(`/locales/${currentLang}/common.json`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error('Failed to load translations:', error);
        // 回退翻译 - 确保类型匹配
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
            rules: "规则",
            radio: "电台",
            charts: "排行榜"
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
          // 修复：添加缺失的 rulesPage 和 settingsPage 属性
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

  const togglePlay = (track: any) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const toggleLike = (id: number) => {
    setLikedSongs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  if (!translations) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        {translations?.common?.loading || '加载中...'}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <NavbarComponent 
        currentLang={currentLang} 
        onLanguageChange={handleLanguageChange} 
        translations={translations}
      />
      
      {/* 英雄区域 */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 to-cyan-900/40"></div>
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-extrabold tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                {translations.home.heroTitle}
              </span>
            </motion.h1>
            <motion.p 
              className="mt-4 max-w-2xl mx-auto text-xl text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {translations.home.heroSubtitle}
            </motion.p>
            
            <motion.div 
              className="mt-10 flex justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full font-bold text-lg hover:opacity-90 transition-opacity">
                {translations.auth.registerNow}
              </button>
              <button className="px-8 py-3 bg-gray-800 rounded-full font-bold text-lg border border-gray-700 hover:bg-gray-700 transition-colors">
                {translations.common.viewDetails}
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 精选音乐 */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">{translations.home.featuredMusicTitle}</h2>
            <button className="text-cyan-400 hover:text-cyan-300 flex items-center">
              {translations.home.viewAll}
              <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {musicData.map((track) => (
              <motion.div 
                key={track.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 hover:bg-gray-700/50 transition-colors group"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-start">
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                      <FaPlay className="text-white" />
                    </div>
                    <button 
                      className="absolute -bottom-2 -right-2 bg-gray-900 rounded-full p-2 shadow-lg hover:bg-cyan-600 transition-colors"
                      onClick={() => togglePlay(track)}
                    >
                      <FaPlay className="text-white text-xs" />
                    </button>
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <h3 className="font-bold text-lg truncate">{track.title}</h3>
                    <p className="text-gray-400">{track.artist}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-gray-500 text-sm">{track.duration}</span>
                      <div className="flex items-center">
                        <span className="text-gray-500 text-sm mr-2">{track.plays}</span>
                        <button onClick={() => toggleLike(track.id)} className="text-gray-500 hover:text-cyan-400">
                          {likedSongs.has(track.id) ? 
                            <FaHeart className="text-cyan-400" /> : 
                            <FaRegHeart />
                          }
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* 热门艺术家 */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">{translations.home.topArtistsTitle}</h2>
            <button className="text-cyan-400 hover:text-cyan-300 flex items-center">
              {translations.home.viewAll}
              <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {artistsData.map((artist) => (
              <motion.div 
                key={artist.id}
                className="text-center"
                whileHover={{ y: -5 }}
              >
                <div className="mx-auto mb-4 relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 mx-auto flex items-center justify-center">
                    <div className="bg-gray-800 rounded-full w-20 h-20 flex items-center justify-center">
                      <FaUser className="text-white text-2xl" />
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-cyan-500 rounded-full w-8 h-8 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">{artist.id}</span>
                  </div>
                </div>
                <h3 className="font-bold text-lg">{artist.name}</h3>
                <p className="text-gray-500">{artist.followers} {translations.profile.followers || "粉丝"}</p>
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* 最新发布 */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">{translations.home.newReleasesTitle}</h2>
            <button className="text-cyan-400 hover:text-cyan-300 flex items-center">
              {translations.home.viewAll}
              <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
            </button>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-3 px-4 text-left text-gray-400 font-normal">#</th>
                  <th className="py-3 px-4 text-left text-gray-400 font-normal">标题</th>
                  <th className="py-3 px-4 text-left text-gray-400 font-normal">艺术家</th>
                  <th className="py-3 px-4 text-left text-gray-400 font-normal">时长</th>
                  <th className="py-3 px-4 text-left text-gray-400 font-normal">播放量</th>
                  <th className="py-3 px-4 text-left text-gray-400 font-normal"></th>
                </tr>
              </thead>
              <tbody>
                {musicData.slice(0, 5).map((track, index) => (
                  <tr key={track.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4 font-medium">{track.title}</td>
                    <td className="py-3 px-4 text-gray-400">{track.artist}</td>
                    <td className="py-3 px-4 text-gray-400">{track.duration}</td>
                    <td className="py-3 px-4 text-gray-400">{track.plays}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end space-x-3">
                        <button 
                          className="text-gray-500 hover:text-cyan-400"
                          onClick={() => togglePlay(track)}
                        >
                          <FaPlay />
                        </button>
                        <button 
                          className="text-gray-500 hover:text-cyan-400"
                          onClick={() => toggleLike(track.id)}
                        >
                          {likedSongs.has(track.id) ? 
                            <FaHeart className="text-cyan-400" /> : 
                            <FaRegHeart />
                          }
                        </button>
                        <button className="text-gray-500 hover:text-cyan-400">
                          <FaEllipsisH />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* 音乐播放器 */}
      {currentTrack && (
        <MusicPlayer 
          track={currentTrack} 
          isPlaying={isPlaying} 
          onPlayPause={() => setIsPlaying(!isPlaying)}
          volume={volume}
          onVolumeChange={setVolume}
          translations={translations.player}
        />
      )}

      <FooterComponent 
        currentLang={currentLang} 
        onLanguageChange={handleLanguageChange} 
        translations={translations}
      />
    </div>
  );
}
