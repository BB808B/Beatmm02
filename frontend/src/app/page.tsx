// src/app/page.tsx

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import NavbarComponent from '@/components/Navbar';
import MusicPlayer from '@/components/MusicPlayer';
import MusicCard from '@/components/MusicCard';
import Carousel from '@/components/Carousel';
import { Track, CarouselSlide, Translations } from '@/types'; // 确保导入所有需要的类型

export default function Home() {
  const [currentLang, setCurrentLang] = useState('zh');
  const [translations, setTranslations] = useState<Translations | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isLooping, setIsLooping] = useState(false);
  const [shuffleMode, setShuffleMode] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Example carousel slides (replace with dynamic data from your backend if needed)
  const carouselSlides: CarouselSlide[] = [
    {
      id: 'slide1',
      imageUrl: '/images/hero-bg.jpg', // Placeholder image
      title: '发现新节奏',
      description: '探索缅甸和全球最新最热的DJ音乐。',
      link: '#',
      altText: 'Discover new rhythms'
    },
    {
      id: 'slide2',
      imageUrl: '/images/artist-profile.jpg', // Placeholder image
      title: '与顶级DJ互动',
      description: '关注你最爱的艺术家，获取独家内容。',
      link: '#',
      altText: 'Interact with top DJs'
    },
    {
      id: 'slide3',
      imageUrl: '/images/live-event.jpg', // Placeholder image
      title: '参与直播派对',
      description: '加入实时音乐盛宴，与DJ和乐迷一同狂欢。',
      link: '#',
      altText: 'Join live parties'
    },
  ];

  useEffect(() => {
    // Load translations
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
        // Fallback translations if fetch fails - MUST match Translations type
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

    // Initialize audio element
    audioRef.current = new Audio();
    audioRef.current.volume = volume;
    audioRef.current.loop = isLooping;

    const currentAudio = audioRef.current;

    const updateProgress = () => {
      if (currentAudio && currentAudio.duration) {
        setProgress(currentAudio.currentTime);
        setDuration(currentAudio.duration);
      }
    };

    const handleTrackEnd = () => {
      // Logic for playing next track automatically or stopping if not looping
      if (isLooping) {
        currentAudio?.play();
      } else {
        handleNextTrack();
      }
    };

    currentAudio.addEventListener('timeupdate', updateProgress);
    currentAudio.addEventListener('ended', handleTrackEnd);

    return () => {
      currentAudio.removeEventListener('timeupdate', updateProgress);
      currentAudio.removeEventListener('ended', handleTrackEnd);
      currentAudio.pause();
      currentAudio.src = '';
    };
  }, [currentLang, volume, isLooping, shuffleMode]); // Add shuffleMode to dependencies

  // Load example tracks (replace with data from your backend if needed)
  useEffect(() => {
    const exampleTracks: Track[] = [
      {
        id: '1',
        title: 'Myanmar EDM Vibes',
        artist: 'DJ Aung',
        coverImage: '/images/album-cover-1.jpg',
        audioSrc: '/audio/sample-1.mp3', // Make sure these paths are correct
        duration: '3:45',
        isLiked: false,
        likes: 123
      },
      {
        id: '2',
        title: 'Yangon Night Mix',
        artist: 'Burmese Beat',
        coverImage: '/images/album-cover-2.jpg',
        audioSrc: '/audio/sample-2.mp3',
        duration: '4:10',
        isLiked: true,
        likes: 245
      },
      {
        id: '3',
        title: 'Mandalay Fusion',
        artist: 'MMRhythm',
        coverImage: '/images/album-cover-3.jpg',
        audioSrc: '/audio/sample-3.mp3',
        duration: '3:00',
        isLiked: false,
        likes: 88
      },
      {
        id: '4',
        title: 'Inle Lake Trance',
        artist: 'DJ Thant',
        coverImage: '/images/album-cover-4.jpg',
        audioSrc: '/audio/sample-4.mp3',
        duration: '5:20',
        isLiked: true,
        likes: 310
      },
      {
        id: '5',
        title: 'Bagan Chillout',
        artist: 'Myanmar Melodies',
        coverImage: '/images/album-cover-5.jpg',
        audioSrc: '/audio/sample-5.mp3',
        duration: '2:55',
        isLiked: false,
        likes: 70
      },
      {
        id: '6',
        title: 'Golden Rock Groove',
        artist: 'Rave Burma',
        coverImage: '/images/album-cover-6.jpg',
        audioSrc: '/audio/sample-6.mp3',
        duration: '4:30',
        isLiked: true,
        likes: 199
      },
    ];
    setTracks(exampleTracks);
    if (exampleTracks.length > 0) {
      setCurrentTrack(exampleTracks[0]);
      if (audioRef.current) {
        audioRef.current.src = exampleTracks[0].audioSrc;
      }
    }
  }, []);

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
  };

  const handlePlayPause = useCallback((trackId: string) => {
    if (!audioRef.current) return;

    if (currentTrack?.id === trackId) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      const newTrack = tracks.find(track => track.id === trackId);
      if (newTrack) {
        setCurrentTrack(newTrack);
        audioRef.current.src = newTrack.audioSrc;
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  }, [currentTrack, isPlaying, tracks]);

  const handleSeek = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = parseFloat(event.target.value);
      setProgress(parseFloat(event.target.value));
    }
  }, []);

  const handleVolumeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newVolume = parseFloat(event.target.value);
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  }, []);

  const handleToggleLoop = useCallback(() => {
    setIsLooping(prev => {
      if (audioRef.current) {
        audioRef.current.loop = !prev;
      }
      return !prev;
    });
  }, []);

  const handleToggleShuffle = useCallback(() => {
    setShuffleMode(prev => !prev);
  }, []);

  const handleNextTrack = useCallback(() => {
    if (!currentTrack || tracks.length === 0) return;

    let nextTrackIndex: number;
    if (shuffleMode) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * tracks.length);
      } while (tracks[randomIndex].id === currentTrack.id && tracks.length > 1); // Avoid playing same song twice if more than one song
      nextTrackIndex = randomIndex;
    } else {
      const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
      nextTrackIndex = (currentIndex + 1) % tracks.length;
    }

    const newTrack = tracks[nextTrackIndex];
    setCurrentTrack(newTrack);
    if (audioRef.current) {
      audioRef.current.src = newTrack.audioSrc;
      audioRef.current.play();
    }
    setIsPlaying(true);
  }, [currentTrack, tracks, shuffleMode]);

  const handlePreviousTrack = useCallback(() => {
    if (!currentTrack || tracks.length === 0) return;

    if (audioRef.current && audioRef.current.currentTime > 3) { // Restart song if already played for > 3s
      audioRef.current.currentTime = 0;
      return;
    }

    let previousTrackIndex: number;
    if (shuffleMode) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * tracks.length);
      } while (tracks[randomIndex].id === currentTrack.id && tracks.length > 1);
      previousTrackIndex = randomIndex;
    } else {
      const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
      previousTrackIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    }

    const newTrack = tracks[previousTrackIndex];
    setCurrentTrack(newTrack);
    if (audioRef.current) {
      audioRef.current.src = newTrack.audioSrc;
      audioRef.current.play();
    }
    setIsPlaying(true);
  }, [currentTrack, tracks, shuffleMode]);

  const handleLikeToggle = useCallback((id: string) => {
    setTracks(prevTracks =>
      prevTracks.map(track =>
        track.id === id ? { ...track, isLiked: !track.isLiked, likes: track.isLiked ? (track.likes || 0) - 1 : (track.likes || 0) + 1 } : track
      )
    );
  }, []);

  const handleShare = useCallback((id: string) => {
    alert(`Share functionality for track ${id}`);
    // Implement actual share logic here
  }, []);

  if (!translations || !currentTrack) {
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

      <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white pt-16 md:pt-20 pb-24"> {/* Added pb-24 for player */}
        {/* Hero Section */}
        <motion.section
          className="relative h-96 bg-cover bg-center flex items-center justify-center text-center p-4"
          style={{ backgroundImage: 'url(/images/hero-bg.jpg)' }} // Replace with a dynamic hero image
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
          <div className="relative z-10">
            <motion.h1
              className="text-5xl font-extrabold text-white mb-4 drop-shadow-lg"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {translations.home.heroTitle}
            </motion.h1>
            <motion.p
              className="text-xl text-gray-200 drop-shadow-md max-w-2xl mx-auto"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              {translations.home.heroSubtitle}
            </motion.p>
            <motion.button
              className="mt-8 px-8 py-3 rounded-full text-lg font-semibold neon-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {translations.home.viewAll}
            </motion.button>
          </div>
        </motion.section>

        {/* Carousel Section */}
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
          className="py-12 px-4 sm:px-6 lg:px-8"
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <h2 className="text-3xl font-bold text-center text-primary mb-8">
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
                  id={track.id}
                  title={track.title}
                  artist={track.artist}
                  coverImage={track.coverImage}
                  audioSrc={track.audioSrc}
                  duration={track.duration}
                  isLiked={track.isLiked || false}
                  likes={track.likes}
                  isPlaying={isPlaying && currentTrack?.id === track.id}
                  onPlayPause={handlePlayPause}
                  onLikeToggle={handleLikeToggle}
                  onShare={handleShare}
                />
              </motion.div>
            ))}
          </motion.div>
          <div className="text-center mt-12">
            <motion.button
              className="px-8 py-3 rounded-full text-lg font-semibold neon-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {translations.home.viewAll}
            </motion.button>
          </div>
        </motion.section>

        {/* Trending Music Section */}
        <motion.section
          className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900"
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <h2 className="text-3xl font-bold text-center text-primary mb-8">
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
                  id={track.id}
                  title={track.title}
                  artist={track.artist}
                  coverImage={track.coverImage}
                  audioSrc={track.audioSrc}
                  duration={track.duration}
                  isLiked={track.isLiked || false}
                  likes={track.likes}
                  isPlaying={isPlaying && currentTrack?.id === track.id}
                  onPlayPause={handlePlayPause}
                  onLikeToggle={handleLikeToggle}
                  onShare={handleShare}
                />
              </motion.div>
            ))}
          </motion.div>
          <div className="text-center mt-12">
            <motion.button
              className="px-8 py-3 rounded-full text-lg font-semibold neon-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {translations.home.viewAll}
            </motion.button>
          </div>
        </motion.section>

        {/* Music Player */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-950 p-3 shadow-top-lg">
          {currentTrack && (
            <MusicPlayer
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onPlayPause={() => handlePlayPause(currentTrack.id)} // Pass the current track's ID
              onNext={handleNextTrack}
              onPrevious={handlePreviousTrack}
              progress={progress}
              duration={duration}
              onSeek={handleSeek}
              volume={volume}
              onVolumeChange={handleVolumeChange}
              isLooping={isLooping}
              onToggleLoop={handleToggleLoop}
              shuffleMode={shuffleMode}
              onToggleShuffle={handleToggleShuffle}
            />
          )}
        </div>
      </main>
    </>
  );
}
