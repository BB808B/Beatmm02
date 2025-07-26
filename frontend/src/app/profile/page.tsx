// src/app/profile/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useUser } from '@/hooks/useUser'; // 引入我们自己的 useUser hook 来获取真实用户数据
import { useRouter } from 'next/navigation';
import MusicCard from '@/components/MusicCard';
import { Track } from '@/types';
import { motion } from 'framer-motion';
import { Music, Settings, Loader2 } from 'lucide-react';

// 模拟数据 (未来将从API获取)
const mockUploadedTracks: Partial<Track>[] = [
  { id: 'u1', title: 'Golden Land Rhythm', artist: 'DJ_MyanmarBeat', coverImage: 'https://images.unsplash.com/photo-1594623930335-94a4b634604c?w=500&auto=format&fit=crop' },
  { id: 'u2', title: 'Yangon Night Groove', artist: 'DJ_MyanmarBeat', coverImage: 'https://images.unsplash.com/photo-1519692933481-e14e246e46d4?w=500&auto=format&fit=crop' },
];
const mockLikedTracks: Partial<Track>[] = [
  { id: 'l1', title: 'Mandalay Sunset', artist: 'Local Sound', coverImage: 'https://images.unsplash.com/photo-1574362846830-a3e1b7a2e06a?w=500&auto=format&fit=crop' },
];

const ProfilePage = () => {
  const t = (key: string) => key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const router = useRouter();
  const { isLoading, user, userDetails } = useUser(); // 使用 hook 获取真实用户数据
  
  const [activeTab, setActiveTab] = useState<'uploaded' | 'liked'>('uploaded');
  
  // 模拟获取歌曲数据
  const uploadedTracks = mockUploadedTracks;
  const likedTracks = mockLikedTracks;

  // 如果用户数据还在加载，或者用户未登录，显示加载或提示信息
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login'); // 如果未登录，重定向到登录页
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-16 h-16 animate-spin text-accent-color-1" />
      </div>
    );
  }

  const renderTrackList = () => {
    const tracks = activeTab === 'uploaded' ? uploadedTracks : likedTracks;
    if (tracks.length === 0) {
      return (
        <div className="col-span-full text-center py-20 flex flex-col items-center">
          <div className="w-24 h-24 bg-background-secondary rounded-full flex items-center justify-center mb-4">
            <Music className="w-12 h-12 text-text-secondary" />
          </div>
          <h3 className="text-xl font-semibold text-text-primary">{t('no_songs_found_title')}</h3>
          <p className="text-text-secondary mt-1">{t('no_songs_found_desc')}</p>
        </div>
      );
    }
    return tracks.map((track) => <MusicCard key={track.id} track={track} />);
  };

  return (
    <>
      {/* 英雄区 */}
      <section className="relative pt-20 pb-10 md:pt-32 md:pb-16 text-white overflow-hidden">
        {userDetails?.avatar_url && (
            <div 
              className="absolute inset-0 bg-cover bg-center filter blur-3xl opacity-30 scale-125"
              style={{ backgroundImage: `url(${userDetails.avatar_url})` }}
            />
        )}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 animate-fade-in">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-accent-color-1 shadow-2xl flex-shrink-0 bg-background-secondary">
              {userDetails?.avatar_url && (
                <Image src={userDetails.avatar_url} alt={userDetails.full_name || user.email || 'User Avatar'} fill className="object-cover" />
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-extrabold mb-1">{userDetails?.full_name || user.email}</h1>
              <p className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent-color-1 to-accent-color-2 mb-3">
                {/* 以后这里会显示真实的会员等级 */}
                VIP Member
              </p>
              <p className="text-text-secondary max-w-xl text-center md:text-left mb-5">
                {/* 以后这里会显示真实的个人简介 */}
                A passionate DJ from the heart of Myanmar.
              </p>
              <div className="flex items-center justify-center md:justify-start gap-8">
                <div className="text-center">
                  <span className="block text-2xl font-bold">12.3k</span>
                  <span className="text-text-secondary text-sm">{t('followers')}</span>
                </div>
                <div className="text-center">
                  <span className="block text-2xl font-bold">123</span>
                  <span className="text-text-secondary text-sm">{t('following')}</span>
                </div>
                <button onClick={() => router.push('/settings')} className="btn-secondary !py-2 !px-4 ml-4 flex items-center gap-2">
                  <Settings size={16}/> {t('edit_profile')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 内容区 */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-background-secondary p-1.5 rounded-full inline-flex mb-8 shadow-lg relative">
          <button
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors z-10 ${activeTab === 'uploaded' ? 'text-white' : 'text-text-secondary hover:text-white'}`}
            onClick={() => setActiveTab('uploaded')}
          >
            {t('uploads')}
          </button>
          <button
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors z-10 ${activeTab === 'liked' ? 'text-white' : 'text-text-secondary hover:text-white'}`}
            onClick={() => setActiveTab('liked')}
          >
            {t('likes')}
          </button>
          <motion.div
            layoutId="profile-tab-indicator"
            className="absolute top-1.5 bottom-1.5 h-auto w-1/2 bg-accent-color-1 rounded-lg"
            initial={false}
            animate={{ x: activeTab === 'uploaded' ? '0%' : '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
          {renderTrackList()}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
