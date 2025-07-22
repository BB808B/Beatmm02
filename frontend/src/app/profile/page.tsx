// file: frontend/src/app/profile/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import MusicCard from '@/components/MusicCard';
import { useTranslation } from 'react-i18next';
import { Track } from '@/types'; // 假设 Track 类型已定义

// 模拟用户数据和歌曲数据
const mockUser = {
  id: 'user123',
  username: 'DJ_MyanmarBeat',
  avatar: '/images/avatar.jpg',
  bio: '热爱越南鼓的DJ，致力于推广缅甸本土音乐。',
  level: 'VIP 3',
  followers: 12345,
  following: 123,
};

const mockUploadedTracks: Track[] = [
  { id: 'u1', title: 'Golden Land Rhythm', artist: 'DJ_MyanmarBeat', coverImage: '/images/album1.jpg', duration: 280, audioUrl: '/audio/sample1.mp3' },
  { id: 'u2', title: 'Yangon Night Groove', artist: 'DJ_MyanmarBeat', coverImage: '/images/album2.jpg', duration: 250, audioUrl: '/audio/sample2.mp3' },
];

const mockLikedTracks: Track[] = [
  { id: 'l1', title: 'Mandalay Sunset', artist: 'Local Sound', coverImage: '/images/album3.jpg', duration: 210, audioUrl: '/audio/sample3.mp3' },
  { id: 'l2', title: 'Inle Lake Echoes', artist: 'Traditional Fusion', coverImage: '/images/album4.jpg', duration: 190, audioUrl: '/audio/sample4.mp3' },
];

const ProfilePage = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState(mockUser);
  const [uploadedTracks, setUploadedTracks] = useState<Track[]>(mockUploadedTracks);
  const [likedTracks, setLikedTracks] = useState<Track[]>(mockLikedTracks);
  const [activeTab, setActiveTab] = useState<'uploaded' | 'liked'>('uploaded');

  // 实际应用中，这里会从后端API获取用户数据和歌曲列表
  useEffect(() => {
    // fetchUserData();
    // fetchUploadedTracks();
    // fetchLikedTracks();
  }, []);

  const handleEditProfile = () => {
    // TODO: 实现编辑个人资料的模态框或页面跳转
    alert(t('edit_profile_feature_coming_soon'));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-primary">
      <Navbar />
      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          {/* 用户信息区域 */}
          <section className="bg-background-secondary rounded-lg shadow-xl p-6 md:p-8 mb-10 flex flex-col md:flex-row items-center md:items-start gap-6 animate-fade-in">
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-accent-color-1 shadow-lg flex-shrink-0">
              <img src={user.avatar} alt={user.username} className="object-cover w-full h-full" />
              {/* TODO: 添加更换头像的图标 */}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">{user.username} <span className="text-sm text-text-secondary ml-2">ID: {user.id}</span></h1>
              <p className="text-accent-color-1 text-lg font-semibold mb-2">{user.level}</p>
              <p className="text-text-secondary mb-4">{user.bio}</p>
              <div className="flex justify-center md:justify-start space-x-6 mb-4">
                <div className="text-center">
                  <span className="block text-xl font-bold text-text-primary">{user.followers}</span>
                  <span className="text-text-secondary text-sm">{t('followers')}</span>
                </div>
                <div className="text-center">
                  <span className="block text-xl font-bold text-text-primary">{user.following}</span>
                  <span className="text-text-secondary text-sm">{t('following')}</span>
                </div>
              </div>
              <button onClick={handleEditProfile} className="btn btn-secondary">
                {t('edit_profile')}
              </button>
            </div>
          </section>

          {/* 歌曲列表切换 */}
          <section className="mb-10">
            <div className="flex border-b border-border-color">
              <button
                className={`py-3 px-6 text-lg font-semibold transition-colors ${activeTab === 'uploaded' ? 'text-accent-color-1 border-b-2 border-accent-color-1' : 'text-text-secondary hover:text-text-primary'}`}
                onClick={() => setActiveTab('uploaded')}
              >
                {t('uploaded_songs')}
              </button>
              <button
                className={`py-3 px-6 text-lg font-semibold transition-colors ${activeTab === 'liked' ? 'text-accent-color-1 border-b-2 border-accent-color-1' : 'text-text-secondary hover:text-text-primary'}`}
                onClick={() => setActiveTab('liked')}
              >
                {t('liked_songs')}
              </button>
            </div>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {activeTab === 'uploaded' && uploadedTracks.length > 0 ? (
                uploadedTracks.map((track) => (
                  <MusicCard key={track.id} {...track} />
                ))
              ) : activeTab === 'liked' && likedTracks.length > 0 ? (
                likedTracks.map((track) => (
                  <MusicCard key={track.id} {...track} />
                ))
              ) : (
                <p className="text-text-secondary col-span-full text-center py-10">{t('no_songs_found')}</p>
              )}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default ProfilePage;


