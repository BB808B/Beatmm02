// src/app/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import NavbarComponent from '@/components/Navbar';
import MusicPlayer from '@/components/MusicPlayer';
import MusicCard from '@/components/MusicCard';
import { Track, Translations, CarouselSlide } from '@/types'; // 确保从正确的路径导入 Translations 类型
import { motion, AnimatePresence } from 'framer-motion';

// 模拟数据
const dummyTracks: Track[] = [
  { id: '1', title: 'Tropical Thunder', artist: 'DJ Beatmaster', albumArt: '/images/album-art-1.jpg', audioSrc: '/audio/song1.mp3', duration: '3:45', isLiked: false, likes: 1200 },
  { id: '2', title: 'Sunset Chill', artist: 'DJ Groove', albumArt: '/images/album-art-2.jpg', audioSrc: '/audio/song2.mp3', duration: '4:10', isLiked: true, likes: 2500 },
  { id: '3', title: 'Night Drive', artist: 'DJ Synthwave', albumArt: '/images/album-art-3.jpg', audioSrc: '/audio/song3.mp3', duration: '3:00', isLiked: false, likes: 800 },
  { id: '4', title: 'Rave On', artist: 'DJ Party', albumArt: '/images/album-art-4.jpg', audioSrc: '/audio/song4.mp3', duration: '5:20', isLiked: false, likes: 1800 },
  { id: '5', title: 'City Lights', artist: 'DJ Urban', albumArt: '/images/album-art-5.jpg', audioSrc: '/audio/song5.mp3', duration: '3:55', isLiked: true, likes: 3200 },
];

const dummyCarouselSlides: CarouselSlide[] = [
  { id: '1', imageUrl: '/images/carousel-1.jpg', title: '探索最新的DJ混音', description: '每周更新，尽享最热门的电子音乐！', link: '/music' },
  { id: '2', imageUrl: '/images/carousel-2.jpg', title: '成为认证DJ', description: '上传你的作品，让更多人听到你的声音！', link: '/dj/apply' },
  { id: '3', imageUrl: '/images/carousel-3.jpg', title: '加入直播派对', description: '与你最爱的DJ实时互动，感受现场气氛！', link: '/live' },
];

export default function Home() {
  const [currentLang, setCurrentLang] = useState('zh');
  const [translations, setTranslations] = useState<Translations | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [featuredTracks, setFeaturedTracks] = useState<Track[]>(dummyTracks);
  const [trendingTracks, setTrendingTracks] = useState<Track[]>(dummyTracks.slice().sort((a, b) => b.likes - a.likes));
  const [newReleaseTracks, setNewReleaseTracks] = useState<Track[]>(dummyTracks.slice().reverse());

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
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
            forgotPassword: "忘记密码？",
            noAccount: "没有账号？",
            hasAccount: "已有账号？",
            registerNow: "立即注册",
            registerTitle: "注册",
            registerButton: "注册",
            loginNow: "立即登录",
            loginSuccess: "登录成功！",
            loginError: "登录失败。",
            phoneRequired: "手机号码不能为空",
            passwordRequired: "密码不能为空",
            confirmPasswordRequired: "请确认密码",
            passwordMismatch: "密码不匹配",
            registerSuccess: "注册成功！",
            registerError: "注册失败。"
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

    // 轮播图自动播放
    const interval = setInterval(() => {
      setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % dummyCarouselSlides.length);
    }, 5000); // 每5秒切换一次

    return () => clearInterval(interval); // 清理定时器
  }, [currentLang]);

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
  };

  const handlePlayTrack = (track: Track) => {
    setCurrentTrack(track);
  };

  const handleLikeToggle = (trackId: string) => {
    setFeaturedTracks(prevTracks =>
      prevTracks.map(track =>
        track.id === trackId
          ? {
            ...track,
            isLiked: !track.isLiked,
            likes: track.isLiked ? track.likes - 1 : track.likes + 1
          }
          : track
      )
    );
    setTrendingTracks(prevTracks =>
      prevTracks.map(track =>
        track.id === trackId
          ? {
            ...track,
            isLiked: !track.isLiked,
            likes: track.isLiked ? track.likes - 1 : track.likes + 1
          }
          : track
      )
    );
    setNewReleaseTracks(prevTracks =>
      prevTracks.map(track =>
        track.id === trackId
          ? {
            ...track,
            isLiked: !track.isLiked,
            likes: track.isLiked ? track.likes - 1 : track.likes + 1
          }
          : track
      )
    );
  };

  if (!translations) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        {'加载中...'}
      </div>
    );
  }

  const currentSlide = dummyCarouselSlides[currentSlideIndex];

  return (
    <>
      <NavbarComponent
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        translations={translations}
      />

      <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white pt-20">
        {/* Carousel Section */}
        <section className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
          <AnimatePresence initial={false}>
            <motion.div
              key={currentSlide.id}
              className="absolute inset-0 bg-cover bg-center flex items-end p-8"
              style={{
                backgroundImage: `url(${currentSlide.imageUrl})`, // <--- 这里就是修复过的地方！
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <div className="bg-black bg-opacity-50 p-6 rounded-lg max-w-lg">
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-3xl md:text-4xl font-bold mb-3 text-primary"
                >
                  {currentSlide.title}
                </motion.h2>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-lg text-gray-200 mb-4"
                >
                  {currentSlide.description}
                </motion.p>
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  onClick={() => router.push(currentSlide.link)}
                  className="neon-button py-2 px-6 rounded-full text-lg font-semibold"
                >
                  {translations.common.viewDetails}
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {dummyCarouselSlides.map((_, idx) => (
              <button
                key={idx}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${idx === currentSlideIndex ? 'bg-primary' : 'bg-gray-400 opacity-50'
                  }`}
                onClick={() => setCurrentSlideIndex(idx)}
              />
            ))}
          </div>
        </section>


        {/* Music Sections */}
        <section className="px-4 py-8 max-w-7xl mx-auto">
          {/* Featured Music */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-white mb-6 border-b-2 border-primary pb-2 flex items-center"
          >
            {translations.home.featured}
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {featuredTracks.map((track) => (
                <MusicCard key={track.id} track={track} onPlay={handlePlayTrack} onLikeToggle={handleLikeToggle} />
              ))}
            </AnimatePresence>
          </div>

          {/* Trending Music */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl font-bold text-white mb-6 mt-10 border-b-2 border-accent pb-2 flex items-center"
          >
            {translations.home.trending}
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {trendingTracks.map((track) => (
                <MusicCard key={track.id} track={track} onPlay={handlePlayTrack} onLikeToggle={handleLikeToggle} />
              ))}
            </AnimatePresence>
          </div>

          {/* New Releases */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-3xl font-bold text-white mb-6 mt-10 border-b-2 border-secondary pb-2 flex items-center"
          >
            {translations.home.newReleases}
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {newReleaseTracks.map((track) => (
                <MusicCard key={track.id} track={track} onPlay={handlePlayTrack} onLikeToggle={handleLikeToggle} />
              ))}
            </AnimatePresence>
          </div>
        </section>
      </main>

      {currentTrack && <MusicPlayer track={currentTrack} />}
    </>
  );
}
