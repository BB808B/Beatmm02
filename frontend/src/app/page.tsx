'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import NavbarComponent from '@/components/Navbar';
import MusicPlayer from '@/components/MusicPlayer';
import MusicCard from '@/components/MusicCard';
import Carousel from '@/components/Carousel';
import GenreCircles from '@/components/GenreCircles'; // 导入新增的 GenreCircles 组件
import { Track, CarouselSlide, Translations } from '@/types';
// 移除了 formatTime 的导入，因为 MusicCard 和 MusicPlayer 内部现在处理格式化

export default function Home() {
  const [currentLang, setCurrentLang] = useState('zh');
  const [translations, setTranslations] = useState<Translations | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false); // 新增状态以控制播放列表显示

  // 示例轮播图幻灯片 (根据需要替换为来自后端动态数据)
  const carouselSlides: CarouselSlide[] = [
    {
      id: 'slide1',
      imageUrl: '/images/hero-bg.jpg', // 占位符图片
      title: '发现新节奏',
      description: '探索缅甸和全球最新最热的DJ音乐。',
      link: '#',
      altText: 'Discover new rhythms'
    },
    {
      id: 'slide2',
      imageUrl: '/images/artist-profile.jpg', // 占位符图片
      title: '与顶级DJ互动',
      description: '关注你最爱的艺术家，获取独家内容。',
      link: '#',
      altText: 'Interact with top DJs'
    },
    {
      id: 'slide3',
      imageUrl: '/images/live-event.jpg', // 占位符图片
      title: '参与直播派对',
      description: '加入实时音乐盛宴，与DJ和乐迷一同狂欢。',
      link: '#',
      altText: 'Join live parties'
    },
  ];

  // 示例音乐类型数据 (根据需要替换为来自后端动态数据)
  const exampleGenres = [
    { id: 'g1', name: 'EDM', imageUrl: '/images/genre-edm.jpg', link: '/genres/edm' },
    { id: 'g2', name: 'Hip Hop', imageUrl: '/images/genre-hiphop.jpg', link: '/genres/hiphop' },
    { id: 'g3', name: 'Pop', imageUrl: '/images/genre-pop.jpg', link: '/genres/pop' },
    { id: 'g4', name: 'Trance', imageUrl: '/images/genre-trance.jpg', link: '/genres/trance' },
    { id: 'g5', name: 'House', imageUrl: '/images/genre-house.jpg', link: '/genres/house' },
    { id: 'g6', name: 'Techno', imageUrl: '/images/genre-techno.jpg', link: '/genres/techno' },
  ];

  useEffect(() => {
    // 加载翻译文件
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
        // 如果加载失败，使用备用翻译 - 必须与 Translations 类型匹配
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
            radio: "电台", // 新增
            charts: "排行榜" // 新增
          },
          home: {
            heroTitle: "音乐流淌，品味非凡", // 更新 Hero Title
            heroSubtitle: "发现缅甸和全球最新最热的DJ音乐，体验沉浸式听觉盛宴。", // 更新 Hero Subtitle
            featuredMusicTitle: "精选音乐",
            recentPlaysTitle: "热门趋势",
            topArtistsTitle: "热门艺术家",
            isDj: "已认证",
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

  // 加载示例曲目 (根据需要替换为来自后端动态数据)
  useEffect(() => {
    const exampleTracks: Track[] = [
      {
        id: '1',
        title: 'Myanmar EDM Vibes',
        artist: 'DJ Aung',
        coverImage: '/images/album-cover-1.jpg',
        audioUrl: '/audio/sample-1.mp3',
        duration: 225, // 秒数
        isLiked: false,
        likes: 123
      },
      {
        id: '2',
        title: 'Yangon Night Mix',
        artist: 'Burmese Beat',
        coverImage: '/images/album-cover-2.jpg',
        audioUrl: '/audio/sample-2.mp3',
        duration: 250, // 秒数
        isLiked: true,
        likes: 245
      },
      {
        id: '3',
        title: 'Mandalay Fusion',
        artist: 'MMRhythm',
        coverImage: '/images/album-cover-3.jpg',
        audioUrl: '/audio/sample-3.mp3',
        duration: 180, // 秒数
        isLiked: false,
        likes: 88
      },
      {
        id: '4',
        title: 'Inle Lake Trance',
        artist: 'DJ Thant',
        coverImage: '/images/album-cover-4.jpg',
        audioUrl: '/audio/sample-4.mp3',
        duration: 320, // 秒数
        isLiked: true,
        likes: 310
      },
      {
        id: '5',
        title: 'Bagan Chillout',
        artist: 'Myanmar Melodies',
        coverImage: '/images/album-cover-5.jpg',
        audioUrl: '/audio/sample-5.mp3',
        duration: 175, // 秒数
        isLiked: false,
        likes: 70
      },
      {
        id: '6',
        title: 'Golden Rock Groove',
        artist: 'Rave Burma',
        coverImage: '/images/album-cover-6.jpg',
        audioUrl: '/audio/sample-6.mp3',
        duration: 270, // 秒数
        isLiked: true,
        likes: 199
      },
    ];
    setTracks(exampleTracks);
    // 初始设置 currentTrackIndex 为 0，MusicPlayer 会加载第一首歌
    setCurrentTrackIndex(0);
  }, []);

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
  };

  // MusicCard 的 onPlay 处理器
  const handlePlayFromCard = useCallback((trackId: string) => {
    const trackIndex = tracks.findIndex(track => track.id === trackId);
    if (trackIndex !== -1) {
      setCurrentTrackIndex(trackIndex);
      // MusicPlayer 内部会处理播放逻辑
    }
  }, [tracks]);

  // MusicCard 的 onPause 处理器
  const handlePauseFromCard = useCallback((trackId: string) => {
    // 暂停逻辑通常由 MusicPlayer 内部管理，这里可以留空或传递给 MusicPlayer
    // 如果 MusicPlayer 暴露了暂停方法，可以在这里调用
    // 例如：audioRef.current?.pause();
  }, []);

  const handleLikeToggle = useCallback((id: string) => {
    setTracks(prevTracks =>
      prevTracks.map(track =>
        track.id === id ? { ...track, isLiked: !track.isLiked, likes: track.isLiked ? (track.likes || 0) - 1 : (track.likes || 0) + 1 } : track
      )
    );
  }, []);

  const handleShare = useCallback((id: string) => {
    // 替换 alert 为更友好的 UI 提示
    console.log(`Share functionality for track ${id}`);
    // 实现实际的分享逻辑
  }, []);

  // 如果 translations 或 tracks 尚未加载，显示加载状态
  if (!translations || tracks.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
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

      <main className="min-h-screen text-white pt-16 md:pt-20 pb-24"> {/* 移除了背景渐变，由 body 统一控制 */}
        {/* Hero Section */}
        <motion.section
          className="hero-section" // 使用 globals.css 中定义的 hero-section 样式
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="hero-background"></div> {/* 使用 globals.css 中定义的 hero-background 样式 */}
          <div className="hero-content"> {/* 使用 globals.css 中定义的 hero-content 样式 */}
            <motion.h1
              className="hero-title" // 使用 globals.css 中定义的 hero-title 样式
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <span className="hero-title-gradient"> {/* 使用 globals.css 中定义的 hero-title-gradient 样式 */}
                {translations.home.heroTitle}
              </span>
            </motion.h1>
            <motion.p
              className="hero-subtitle" // 使用 globals.css 中定义的 hero-subtitle 样式
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              {translations.home.heroSubtitle}
            </motion.p>
            <motion.div
              className="hero-buttons" // 使用 globals.css 中定义的 hero-buttons 样式
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              <button
                className="btn-primary" // 使用 globals.css 中定义的 btn-primary 样式
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {translations.home.viewAll}
              </button>
              <button
                className="btn-secondary" // 使用 globals.css 中定义的 btn-secondary 样式
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {translations.common.search}
              </button>
            </motion.div>
          </div>
        </motion.section>

        {/* 音乐类型圆形展示区域 */}
        <GenreCircles genres={exampleGenres} title="探索音乐类型" /> {/* 引入 GenreCircles 组件 */}

        {/* Carousel Section (保持不变，但确保样式与新主题兼容) */}
        <motion.section
          className="py-12 px-4 sm:px-6 lg:px-8"
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <Carousel slides={carouselSlides} />
        </motion.section>

        {/* Featured Music Section */}
        <motion.section
          className="py-12 px-4 sm:px-6 lg:px-8" // 移除了 bg-gray-900，由 body 统一控制
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <h2 className="text-3xl font-bold text-center gradient-text mb-8"> {/* 使用 gradient-text 样式 */}
            {translations.home.featuredMusicTitle}
          </h2>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {tracks.slice(0, 4).map((track) => ( // Display first 4 featured tracks
              <motion.div key={track.id} variants={itemVariants}>
                <MusicCard
                  {...track} // 传递所有 track 属性
                  // MusicCard 现在直接接收 number 类型的 duration
                  // isPlaying 逻辑保持不变
                  isPlaying={tracks[currentTrackIndex]?.id === track.id}
                  onPlay={handlePlayFromCard} // 修改为 onPlay
                  onPause={handlePauseFromCard} // 修改为 onPause
                  onLike={handleLikeToggle} // 修改为 onLike
                  onShare={handleShare}
                />
              </motion.div>
            ))}
          </motion.div>
          <div className="text-center mt-12">
            <button
              className="btn-primary" // 使用 globals.css 中定义的 btn-primary 样式
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {translations.home.viewAll}
            </button>
          </div>
        </motion.section>

        {/* Trending Music Section */}
        <motion.section
          className="py-12 px-4 sm:px-6 lg:px-8" // 移除了 bg-gray-900，由 body 统一控制
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <h2 className="text-3xl font-bold text-center gradient-text mb-8"> {/* 使用 gradient-text 样式 */}
            {translations.home.recentPlaysTitle}
          </h2>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {tracks.slice(4, 8).map((track) => ( // Display next 4 trending tracks
              <motion.div key={track.id} variants={itemVariants}>
                <MusicCard
                  {...track} // 传递所有 track 属性
                  // MusicCard 现在直接接收 number 类型的 duration
                  // isPlaying 逻辑保持不变
                  isPlaying={tracks[currentTrackIndex]?.id === track.id}
                  onPlay={handlePlayFromCard} // 修改为 onPlay
                  onPause={handlePauseFromCard} // 修改为 onPause
                  onLike={handleLikeToggle} // 修改为 onLike
                  onShare={handleShare}
                />
              </motion.div>
            ))}
          </motion.div>
          <div className="text-center mt-12">
            <button
              className="btn-primary" // 使用 globals.css 中定义的 btn-primary 样式
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {translations.home.viewAll}
            </button>
          </div>
        </motion.section>

        {/* Music Player */}
        <div className="fixed bottom-0 left-0 right-0 z-50"> {/* 移除了背景颜色和阴影，由 player-container 统一控制 */}
          {tracks.length > 0 && ( // 只有当有曲目时才渲染播放器
            <MusicPlayer
              tracks={tracks}
              onShowPlaylist={() => setShowPlaylist(true)} // 如果有播放列表组件，用于显示/隐藏
              currentTrackIndex={currentTrackIndex}
              setCurrentTrackIndex={setCurrentTrackIndex}
            />
          )}
        </div>
      </main>
    </>
  );
}
