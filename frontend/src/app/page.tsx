'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Carousel, Button } from 'react-bootstrap';
import NavbarComponent from '@/components/Navbar';
import MusicPlayer from '@/components/MusicPlayer';
import MusicCard from '@/components/MusicCard';
import { Track, Translations, CarouselSlide } from '@/types';

// 模拟数据
const mockTracks: Track[] = [
  {
    id: '1',
    title: 'Vietnamese Drum Beat 1',
    artist: 'DJ Myanmar',
    duration: 180,
    url: '/audio/sample1.mp3',
    cover: 'https://via.placeholder.com/300x300/ff6b35/ffffff?text=DJ+1',
    plays: 15420,
    likes: 234,
    isLiked: false,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'Tropical House Mix',
    artist: 'DJ Yangon',
    duration: 240,
    url: '/audio/sample2.mp3',
    cover: 'https://via.placeholder.com/300x300/004e89/ffffff?text=DJ+2',
    plays: 8930,
    likes: 156,
    isLiked: true,
    created_at: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    title: 'Electronic Fusion',
    artist: 'DJ Mandalay',
    duration: 200,
    url: '/audio/sample3.mp3',
    cover: 'https://via.placeholder.com/300x300/ffd23f/000000?text=DJ+3',
    plays: 12340,
    likes: 189,
    isLiked: false,
    created_at: '2024-01-03T00:00:00Z'
  },
  {
    id: '4',
    title: 'Bass Drop Anthem',
    artist: 'DJ Naypyidaw',
    duration: 220,
    url: '/audio/sample4.mp3',
    cover: 'https://via.placeholder.com/300x300/ff6b35/ffffff?text=DJ+4',
    plays: 20150,
    likes: 312,
    isLiked: false,
    created_at: '2024-01-04T00:00:00Z'
  }
];

const featuredSlides: CarouselSlide[] = [
  {
    id: 1,
    title: '精选DJ音乐',
    subtitle: '发现最棒的越南鼓节拍',
    image: 'https://via.placeholder.com/1200x400/ff6b35/ffffff?text=Featured+Music',
    buttonText: '立即收听'
  },
  {
    id: 2,
    title: '热门排行榜',
    subtitle: '本周最受欢迎的DJ作品',
    image: 'https://via.placeholder.com/1200x400/004e89/ffffff?text=Top+Charts',
    buttonText: '查看排行'
  },
  {
    id: 3,
    title: '新人DJ推荐',
    subtitle: '支持新兴DJ创作者',
    image: 'https://via.placeholder.com/1200x400/ffd23f/000000?text=New+DJs',
    buttonText: '发现新人'
  }
];

export default function Home() {
  const [currentLang, setCurrentLang] = useState('zh');
  const [translations, setTranslations] = useState<Translations | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tracks, setTracks] = useState(mockTracks);

  // 加载翻译文件
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const response = await fetch(`/locales/${currentLang}/common.json`);
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error('Failed to load translations:', error);
        // 如果加载失败，使用默认的中文翻译
        setTranslations({
          title: '缅甸DJ平台',
          nav: {
            home: '首页',
            music: '音乐',
            dj: 'DJ',
            live: '直播',
            ranking: '排行榜',
            profile: '个人中心',
            login: '登录',
            register: '注册',
            logout: '退出'
          },
          home: {
            welcome: '欢迎来到缅甸DJ平台',
            subtitle: '发现最棒的越南鼓DJ音乐',
            featured: '精选音乐',
            trending: '热门趋势',
            newReleases: '最新发布'
          },
          auth: {
            phone: '手机号码',
            password: '密码',
            confirmPassword: '确认密码',
            login: '登录',
            register: '注册',
            forgotPassword: '忘记密码？',
            noAccount: '没有账号？',
            hasAccount: '已有账号？',
            registerNow: '立即注册',
            loginNow: '立即登录'
          },
          player: {
            play: '播放',
            pause: '暂停',
            next: '下一首',
            previous: '上一首',
            volume: '音量',
            shuffle: '随机播放',
            repeat: '重复播放'
          },
          profile: {
            myProfile: '我的资料',
            myMusic: '我的音乐',
            myWallet: '我的钱包',
            settings: '设置',
            djApplication: 'DJ认证申请',
            balance: '余额',
            recharge: '充值',
            withdraw: '提现'
          },
          common: {
            search: '搜索',
            submit: '提交',
            cancel: '取消',
            confirm: '确认',
            save: '保存',
            edit: '编辑',
            delete: '删除',
            loading: '加载中...',
            error: '错误',
            success: '成功'
          }
        });
      }
    };

    loadTranslations();
  }, [currentLang]);

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
  };

  const handlePlay = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleNext = () => {
    if (currentTrack) {
      const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
      const nextIndex = (currentIndex + 1) % tracks.length;
      setCurrentTrack(tracks[nextIndex]);
    }
  };

  const handlePrevious = () => {
    if (currentTrack) {
      const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
      const prevIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1;
      setCurrentTrack(tracks[prevIndex]);
    }
  };

  const handleLike = (trackId: string) => {
    setTracks(prevTracks =>
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
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavbarComponent
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        translations={translations}
      />

      <main style={{ paddingTop: '80px', paddingBottom: '120px' }}>
        {/* 轮播图 */}
        <Carousel className="mb-5">
          {featuredSlides.map((slide) => (
            <Carousel.Item key={slide.id}>
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  height: '400px',
                  backgroundImage: `url(${slide.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="text-center text-white">
                  <h1 className="display-4 fw-bold mb-3 fade-in-up">
                    {slide.title}
                  </h1>
                  <p className="lead mb-4 fade-in-up">
                    {slide.subtitle}
                  </p>
                  <Button className="btn-primary-custom fade-in-up">
                    {slide.buttonText}
                  </Button>
                </div>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>

        <Container>
          {/* 精选音乐 */}
          <section className="mb-5">
            <h2 className="mb-4 fw-bold">{translations.home.featured}</h2>
            <Row>
              {tracks.slice(0, 4).map((track) => (
                <Col key={track.id} lg={3} md={4} sm={6} className="mb-4">
                  <MusicCard
                    track={track}
                    isPlaying={isPlaying}
                    isCurrentTrack={currentTrack?.id === track.id}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onLike={handleLike}
                    translations={translations}
                  />
                </Col>
              ))}
            </Row>
          </section>

          {/* 热门趋势 */}
          <section className="mb-5">
            <h2 className="mb-4 fw-bold">{translations.home.trending}</h2>
            <Row>
              {tracks.map((track) => (
                <Col key={track.id} lg={3} md={4} sm={6} className="mb-4">
                  <MusicCard
                    track={track}
                    isPlaying={isPlaying}
                    isCurrentTrack={currentTrack?.id === track.id}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onLike={handleLike}
                    translations={translations}
                  />
                </Col>
              ))}
            </Row>
          </section>

          {/* 最新发布 */}
          <section className="mb-5">
            <h2 className="mb-4 fw-bold">{translations.home.newReleases}</h2>
            <Row>
              {tracks.slice().reverse().map((track) => (
                <Col key={track.id} lg={3} md={4} sm={6} className="mb-4">
                  <MusicCard
                    track={track}
                    isPlaying={isPlaying}
                    isCurrentTrack={currentTrack?.id === track.id}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onLike={handleLike}
                    translations={translations}
                  />
                </Col>
              ))}
            </Row>
          </section>
        </Container>
      </main>

      {/* 音乐播放器 */}
      <MusicPlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onPlay={() => setIsPlaying(true)}
        onPause={handlePause}
        onNext={handleNext}
        onPrevious={handlePrevious}
        translations={translations}
      />
    </>
  );
}

