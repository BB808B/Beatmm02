// file: frontend/src/components/Navbar.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next'; // 假设已集成i18n

const Navbar = () => {
  const pathname = usePathname();
  const { t } = useTranslation(); // 获取翻译函数

  const navItems = [
    { href: '/', label: t('home') },
    { href: '/browse', label: t('browse') },
    { href: '/library', label: t('library') },
    { href: '/leaderboard', label: t('leaderboard') }, // 新增排行榜
    { href: '/vip', label: t('vip') }, // 新增VIP
  ];

  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 bg-background-primary shadow-lg z-50 relative"> {/* 添加背景色和阴影 */}
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          {/* 假设这里有一个Logo SVG或图片 */}
          <img src="/next.svg" alt="BeatMM Pro Logo" className="h-8 w-auto" /> {/* 替换为实际Logo */}
          <span className="text-2xl font-bold text-text-primary">BeatMM Pro</span>
        </Link>

        {/* 中间导航链接 */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`navbar-link text-base ${pathname === item.href ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 右侧操作按钮 */}
        <div className="flex items-center space-x-4">
          <Link href="/login" className="btn btn-secondary text-sm hidden md:flex">
            {t('login')}
          </Link>
          <Link href="/signup" className="btn btn-primary text-sm hidden md:flex"> {/* 新增注册按钮 */}
            {t('signup')}
          </Link>
          {/* 移动端菜单按钮，待实现 */}
          <button className="md:hidden text-text-primary focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;


