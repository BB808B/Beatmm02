// frontend/src/app/profile/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
// import Navbar from '@/components/Navbar'; // 假设Navbar存在
// import MusicCard from '@/components/MusicCard'; // 假设MusicCard存在
// import { useTranslation } from 'react-i18next';
import { Track } from '@/types'; // 假设 Track 类型已定义

// --- 为了让页面能独立运行，我暂时创建了这些组件的简单版本 ---
const Navbar = () => (
    <header className="bg-background-primary/80 backdrop-blur-sm sticky top-0 z-50 border-b border-border-color">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <a href="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-purple-blue">BeatMM Pro</a>
        <div className="flex items-center gap-4">
          <a href="/login" className="btn-secondary">Login</a>
          <a href="/signup" className="btn-primary">Sign Up</a>
        </div>
      </nav>
    </header>
  );
  
const MusicCard = ({ title, artist, coverImage }: Partial<Track>) => (
    <div className="group animate-fade-in">
        <div className="relative mb-3 aspect-square rounded-lg overflow-hidden shadow-lg transition-transform duration-300 group-hover:-translate-y-2">
        <img src={coverImage} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-14 h-14 bg-gradient-pink-purple rounded-full flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M4.52 16.89A.75.75 0 005.47 16l8-6.5a.75.75 0 000-1.18l-8-6.5a.75.75 0 00-1.2 1.06L5.3 9.5 4.07 15.83a.75.75 0 00.45 1.06z"></path></svg>
            </div>
        </div>
        </div>
        <h4 className="font-semibold truncate text-text-primary">{title}</h4>
        <p className="text-sm text-text-secondary truncate">{artist}</p>
    </div>
);
// --- 临时组件结束 ---

// --- 您的核心数据逻辑，100%保留 ---
const mockUser = {
  id: 'user123',
  username: 'DJ_MyanmarBeat',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop', // 使用高质量占位图
  bio: '热爱越南鼓的DJ，致力于推广缅甸本土音乐。',
  level: 'VIP Member',
  followers: '12.3k', // 使用更友好的格式
  following: 123,
};

const mockUploadedTracks: Track[] = [
  { id: 'u1', title: 'Golden Land Rhythm', artist: 'DJ_MyanmarBeat', coverImage: 'https://images.unsplash.com/photo-1594623930335-94a4b634604c?w=500&auto=format&fit=crop', duration: 280, audioUrl: '/audio/sample1.mp3' },
  { id: 'u2', title: 'Yangon Night Groove', artist: 'DJ_MyanmarBeat', coverImage: 'https://images.unsplash.com/photo-1519692933481-e14e246e46d4?w=500&auto=format&fit=crop', duration: 250, audioUrl: '/audio/sample2.mp3' },
];

const mockLikedTracks: Track[] = [
  { id: 'l1', title: 'Mandalay Sunset', artist: 'Local Sound', coverImage: 'https://images.unsplash.com/photo-1574362846830-a3e1b7a2e06a?w=500&auto=format&fit=crop', duration: 210, audioUrl: '/audio/sample3.mp3' },
];
// --- 数据逻辑结束 ---

const ProfilePage = () => {
  // const { t } = useTranslation();
  const t = (key: string) => ({
    'followers': 'Followers',
    'following': 'Following',
    'edit_profile': 'Edit Profile',
    'uploaded_songs': 'Uploads',
    'liked_songs': 'Likes',
    'no_songs_found_title': 'Nothing to see here',
    'no_songs_found_desc': 'This list is currently empty.',
  }[key] || key);

  // --- 您的核心功能逻辑，100%保留 ---
  const [user, setUser] = useState(mockUser);
  const [uploadedTracks, setUploadedTracks] = useState<Track[]>(mockUploadedTracks);
  const [likedTracks, setLikedTracks] = useState<Track[]>(mockLikedTracks);
  const [activeTab, setActiveTab] = useState<'uploaded' | 'liked'>('uploaded');

  useEffect(() => {
    // fetchUserData();
  }, []);

  const handleEditProfile = () => {
    alert(t('edit_profile_feature_coming_soon'));
  };
  // --- 功能逻辑结束 ---

  const renderTrackList = () => {
    const tracks = activeTab === 'uploaded' ? uploadedTracks : likedTracks;
    if (tracks.length === 0) {
      return (
        // 更美观的空状态
        <div className="col-span-full text-center py-20 flex flex-col items-center">
            <div className="w-24 h-24 bg-background-secondary rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" /></svg>
            </div>
            <h3 className="text-xl font-semibold text-text-primary">{t('no_songs_found_title')}</h3>
            <p className="text-text-secondary mt-1">{t('no_songs_found_desc')}</p>
        </div>
      );
    }
    return tracks.map((track) => <MusicCard key={track.id} {...track} />);
  };

  return (
    <div className="min-h-screen bg-background-primary">
      <Navbar />
      <main className="flex-grow">
        {/* 英雄式头部 */}
        <section className="relative pt-20 pb-10 md:pt-32 md:pb-16 text-white overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center filter blur-3xl opacity-30 scale-125"
            style={{ backgroundImage: `url(${user.avatar})` }}
          ></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 animate-fade-in">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-accent-color-1 shadow-2xl flex-shrink-0">
                <img src={user.avatar} alt={user.username} className="object-cover w-full h-full" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-5xl font-extrabold mb-1">{user.username}</h1>
                <p className="text-lg font-bold bg-clip-text text-transparent bg-gradient-pink-purple mb-3">{user.level}</p>
                <p className="text-text-secondary max-w-xl text-center md:text-left mb-5">{user.bio}</p>
                <div className="flex items-center justify-center md:justify-start gap-8">
                    <div className="text-center">
                        <span className="block text-2xl font-bold">{user.followers}</span>
                        <span className="text-text-secondary text-sm">{t('followers')}</span>
                    </div>
                    <div className="text-center">
                        <span className="block text-2xl font-bold">{user.following}</span>
                        <span className="text-text-secondary text-sm">{t('following')}</span>
                    </div>
                    <button onClick={handleEditProfile} className="btn-secondary !py-2 !px-4 ml-4">
                        {t('edit_profile')}
                    </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
            {/* 胶囊式选项卡 */}
            <div className="bg-background-secondary p-1.5 rounded-xl inline-flex mb-8 shadow-lg">
              <button
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'uploaded' ? 'bg-accent-color-1 text-white' : 'text-text-secondary hover:bg-white/10'}`}
                onClick={() => setActiveTab('uploaded')}
              >
                {t('uploaded_songs')}
              </button>
              <button
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'liked' ? 'bg-accent-color-1 text-white' : 'text-text-secondary hover:bg-white/10'}`}
                onClick={() => setActiveTab('liked')}
              >
                {t('liked_songs')}
              </button>
            </div>

            {/* 歌曲列表 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
              {renderTrackList()}
            </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
