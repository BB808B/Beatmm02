// src/components/Navbar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Compass, Music, Crown, Upload, LogIn, UserPlus, LogOut, Settings, UserCircle, Search, X, Menu } from 'lucide-react';

const Navbar = () => {
  const user = useUser();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);

  // 临时的多语言占位符
  const t = (key: string) => key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  // 导航链接
  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/explore', label: 'Explore', icon: Compass },
    { href: '/leaderboard', label: 'Leaderboard', icon: Crown },
  ];
  
  // 用户下拉菜单项
  const userMenuItems = [
    { href: '/profile', label: 'Profile', icon: UserCircle },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/'); // 登出后跳转到首页
  };

  // 监听滚动，实现导航栏背景模糊效果
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NavLink = ({ item }: { item: typeof navItems[0] }) => (
    <Link href={item.href}
      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        pathname === item.href 
          ? 'text-white bg-accent-color-1/20' 
          : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
      }`}
    >
      <item.icon size={18} />
      <span>{t(item.label)}</span>
    </Link>
  );

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background-primary/80 backdrop-blur-md border-b border-border-color' : 'bg-transparent'} hidden md:block`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white">
             {/* <img src="/logo.svg" alt="BeatMM Pro Logo" className="h-8 w-auto" /> */}
             <span className="text-accent-color-1">Beat</span><span className="text-accent-color-2">MM</span><span className="text-white">Pro</span>
          </Link>

          {/* 中间导航链接 (桌面端) */}
          <nav className="flex items-center gap-2">
            {navItems.map(item => <NavLink key={item.href} item={item} />)}
          </nav>

          {/* 右侧区域 (桌面端) */}
          <div className="flex items-center gap-4">
             {/* Search Bar Placeholder */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18}/>
              <input type="text" placeholder={t('Search...')} className="bg-background-secondary border border-border-color rounded-full pl-10 pr-4 py-1.5 text-sm w-48 focus:w-64 transition-all duration-300 focus:ring-1 focus:ring-accent-color-1 outline-none"/>
            </div>

            {user ? (
              <>
                <Link href="/upload" className="btn-secondary text-sm"><Upload size={16} />{t('Upload')}</Link>
                {/* User Dropdown Placeholder */}
                <div className="relative group">
                   <button className="w-9 h-9 bg-background-secondary rounded-full flex items-center justify-center border border-border-color">
                     <UserCircle className="text-text-secondary" />
                   </button>
                   {/* Dropdown Menu */}
                   <div className="absolute top-full right-0 mt-2 w-48 bg-background-secondary rounded-lg shadow-lg border border-border-color opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-2 space-y-1">
                      {userMenuItems.map(item => (
                         <Link key={item.href} href={item.href} className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-text-secondary hover:text-text-primary hover:bg-white/5">
                           <item.icon size={16} /><span>{t(item.label)}</span>
                         </Link>
                      ))}
                      <hr className="border-border-color !my-2" />
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-red-400 hover:bg-red-500/10">
                        <LogOut size={16} /><span>{t('Logout')}</span>
                      </button>
                   </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="btn-secondary text-sm">{t('Login')}</Link>
                <Link href="/signup" className="btn-primary text-sm">{t('Sign Up')}</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
