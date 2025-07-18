'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, User, Music, Home, Trophy, Radio, FileText, Menu, X } from 'lucide-react'; // 导入 Lucide React 图标
import { NavbarProps, Language } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import MusicVisualizer from './MusicVisualizer'; // 导入 MusicVisualizer 组件

const NavbarComponent: React.FC<NavbarProps> = ({ currentLang, onLanguageChange, translations }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false); // 控制桌面端语言下拉菜单
  const menuRef = useRef<HTMLDivElement>(null); // 用于检测点击外部关闭菜单和下拉菜单

  // 检测移动端尺寸
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // 设置初始值
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 点击外部关闭菜单和语言下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
        setShowLanguageDropdown(false);
      }
    };

    if (isMenuOpen || showLanguageDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, showLanguageDropdown]); // 依赖 showLanguageDropdown

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLanguageClick = (lang: Language) => {
    onLanguageChange(lang);
    setShowLanguageDropdown(false); // 语言选择后关闭下拉菜单
    if (isMobile) {
      setIsMenuOpen(false); // 移动端语言选择后关闭侧边菜单
    }
  };

  // 获取当前语言的显示文本（如 '中', 'မြန်', 'EN'）
  const getCurrentLanguageDisplay = () => {
    switch (currentLang) {
      case 'zh': return '中';
      case 'my': return 'မြန်';
      case 'en': return 'EN';
      default: return 'EN';
    }
  };

  // 导航菜单项定义，使用 Lucide React 图标
  const menuItems = [
    {
      icon: Home,
      label: translations.nav.home,
      href: '/',
      active: true // 假设主页默认激活
    },
    {
      icon: Music,
      label: translations.nav.music,
      href: '/music'
    },
    {
      icon: Radio, // 新增 Radio 图标
      label: translations.nav.radio, // 对应 translations.nav.radio
      href: '/radio'
    },
    {
      icon: Trophy, // 新增 Trophy 图标
      label: translations.nav.charts, // 对应 translations.nav.charts
      href: '/charts'
    },
    {
      icon: FileText,
      label: translations.nav.rules,
      href: '/rules'
    }
  ];

  return (
    <nav className="navbar-container"> {/* 使用 globals.css 中定义的样式 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Music className="text-white" size={20} />
              </div>
              {/* Logo 旁的音乐可视化器 */}
              <div className="absolute -top-1 -right-1">
                <MusicVisualizer isPlaying={true} size="xs" />
              </div>
            </div>
            <span className="navbar-brand">BeatMM Pro</span> {/* 使用 globals.css 中定义的样式 */}
          </Link>

          {/* Desktop Menu */}
          {!isMobile && (
            <div className="navbar-menu"> {/* 使用 globals.css 中定义的样式 */}
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`navbar-link ${item.active ? 'active' : ''}`} {/* 使用 globals.css 中定义的样式 */}
                >
                  <item.icon size={18} /> {/* Lucide React 图标 */}
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right Side - Search, Language, User Profile */}
          <div className="flex items-center gap-4">
            {/* Search Button (Desktop & Mobile) */}
            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <Search size={20} className="text-gray-300" />
            </button>

            {/* Language Switcher (Desktop) */}
            {!isMobile && (
              <div className="relative" ref={menuRef}> {/* 使用 menuRef 确保点击外部关闭 */}
                <button
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  className="language-button" {/* 使用 globals.css 中定义的样式 */}
                >
                  {getCurrentLanguageDisplay()}
                </button>

                <AnimatePresence>
                  {showLanguageDropdown && (
                    <motion.div
                      className="language-dropdown" {/* 使用 globals.css 中定义的样式 */}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <button
                        onClick={() => handleLanguageClick('zh')}
                        className={`language-option ${currentLang === 'zh' ? 'active' : ''}`} {/* 使用 globals.css 中定义的样式 */}
                      >
                        中文
                      </button>
                      <button
                        onClick={() => handleLanguageClick('en')}
                        className={`language-option ${currentLang === 'en' ? 'active' : ''}`} {/* 新增英文选项 */}
                      >
                        English
                      </button>
                      <button
                        onClick={() => handleLanguageClick('my')}
                        className={`language-option ${currentLang === 'my' ? 'active' : ''}`} {/* 使用 globals.css 中定义的样式 */}
                      >
                        မြန်မာ
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* User Profile Button */}
            <Link href="/profile" className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <User size={20} className="text-gray-300" />
            </Link>

            {/* Mobile Menu Button (Hamburger/Close icon) */}
            {isMobile && (
              <button
                onClick={toggleMenu}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />} {/* 根据菜单状态切换图标 */}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobile && isMenuOpen && (
            <motion.div
              className="md:hidden fixed top-0 right-0 w-64 h-full shadow-2xl p-6 z-50 overflow-y-auto navbar-container" // 移动端菜单也使用 navbar-container 样式
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: '0%' }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="flex justify-end mb-6">
                <button onClick={toggleMenu} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                  <X size={24} className="text-white" />
                </button>
              </div>
              {/* Mobile Search Bar (Inside menu) */}
              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder={translations.common.search}
                  className="w-full py-2 pl-10 pr-4 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>

              <ul className="space-y-4">
                {menuItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={toggleMenu}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        item.active
                          ? 'text-purple-400 bg-purple-500/10'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      <item.icon size={18} />
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li className="pt-4 border-t border-gray-700 mt-4">
                  <Link href="/login" onClick={toggleMenu} className="block px-4 py-2 rounded-full text-xl font-semibold bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-center hover:opacity-90 transition-opacity">
                    {translations.nav.login}
                  </Link>
                </li>
              </ul>

              {/* Language Selector Mobile (Inside menu) */}
              <div className="mt-8 pt-4 border-t border-gray-700">
                <h3 className="text-lg font-bold text-white mb-3">语言 / Language</h3>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleLanguageClick('zh')}
                    className={`px-4 py-2 rounded-lg text-lg font-medium transition-colors duration-200 ${
                      currentLang === 'zh' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    中文
                  </button>
                  <button
                    onClick={() => handleLanguageClick('en')}
                    className={`px-4 py-2 rounded-lg text-lg font-medium transition-colors duration-200 ${
                      currentLang === 'en' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => handleLanguageClick('my')}
                    className={`px-4 py-2 rounded-lg text-lg font-medium transition-colors duration-200 ${
                      currentLang === 'my' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    မြန်မာ
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default NavbarComponent;
