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
  const [volume, setVolume] = useState(80); // 只保留一个音量状态

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
