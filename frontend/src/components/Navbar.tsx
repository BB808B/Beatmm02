'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaUser, FaMusic, FaHome, FaTrophy, FaBroadcastTower, FaFileContract, FaTimes } from 'react-icons/fa';
import { NavbarProps, Language } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

const NavbarComponent: React.FC<NavbarProps> = ({ 
  currentLang, 
  onLanguageChange, 
  translations 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const languages: Language[] = [
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'my', name: 'မြန်မာ', flag: '🇲🇲' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search query:', searchQuery);
    setIsSearchOpen(false);
  };

  // 点击外部关闭搜索框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 滚动检测
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navItems = [
    { href: "/", icon: <FaHome />, label: translations.nav.home },
    { href: "/music", icon: <FaMusic />, label: translations.nav.music },
    { href: "/dj", icon: <FaBroadcastTower />, label: translations.nav.dj },
    { href: "/ranking", icon: <FaTrophy />, label: translations.nav.ranking },
    { href: "/rules", icon: <FaFileContract />, label: "规则条款" }
  ];

  const userMenuItems = [
    { href: "/login", label: translations.nav.login },
    { href: "/register", label: translations.nav.register },
    { href: "/profile", label: translations.profile.myProfile },
    { href: "/wallet", label: translations.profile.myWallet }
  ];

  return (
    <>
      {/* 导航栏 */}
      <motion.nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'glass-panel neon-border py-2' : 'bg-transparent py-4'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* 品牌标志 */}
          <motion.a 
            href="/" 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="neon-logo w-10 h-10 rounded-full flex items-center justify-center">
              <FaMusic className="text-xl" />
            </div>
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              {translations.title}
            </span>
          </motion.a>

          {/* 桌面导航 */}
          <div className="hidden md:flex items-center gap-8">
            {/* 导航链接 */}
            <div className="flex gap-6">
              {navItems.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  className="flex items-center gap-2 font-medium hover:text-accent transition-colors"
                  whileHover={{ y: -2 }}
                >
                  <span className="text-primary">{item.icon}</span>
                  {item.label}
                </motion.a>
              ))}
            </div>

            {/* 搜索按钮 */}
            <motion.button
              className="neon-icon-btn"
              onClick={() => setIsSearchOpen(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaSearch />
            </motion.button>

            {/* 语言切换器 */}
            <Dropdown 
              currentLang={currentLang} 
              languages={languages} 
              onLanguageChange={onLanguageChange}
            />

            {/* 用户菜单 */}
            <Dropdown 
              trigger={
                <motion.button 
                  className="neon-icon-btn"
                  whileHover={{ scale: 1.1 }}
                >
                  <FaUser />
                </motion.button>
              }
              items={userMenuItems}
            />
          </div>

          {/* 移动端菜单按钮 */}
          <button 
            className="md:hidden neon-icon-btn"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <div className="w-6 flex flex-col gap-1">
              <span className="h-0.5 bg-white w-full"></span>
              <span className="h-0.5 bg-white w-3/4"></span>
              <span className="h-0.5 bg-white w-full"></span>
            </div>
          </button>
        </div>
      </motion.nav>

      {/* 移动端菜单 */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="glass-panel h-full w-80 max-w-full ml-auto p-6"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                  <div className="neon-logo w-10 h-10 rounded-full flex items-center justify-center">
                    <FaMusic className="text-xl" />
                  </div>
                  <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                    {translations.title}
                  </span>
                </div>
                <button 
                  className="neon-icon-btn"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaTimes />
                </button>
              </div>

              {/* 移动端导航链接 */}
              <div className="flex flex-col gap-4 mb-8">
                {navItems.map((item, index) => (
                  <motion.a
                    key={index}
                    href={item.href}
                    className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-white/10 transition-colors"
                    whileHover={{ x: 5 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="text-primary text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </motion.a>
                ))}
              </div>

              {/* 语言切换器 */}
              <div className="mb-6">
                <h3 className="text-gray-400 mb-3">选择语言</h3>
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang) => (
                    <motion.button
                      key={lang.code}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        currentLang === lang.code 
                          ? 'bg-gradient-to-r from-primary to-accent' 
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setIsMobileMenuOpen(false);
                      }}
                      whileHover={{ scale: 1.05 }}
                    >
                      {lang.flag} {lang.name}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* 用户菜单 */}
              <div>
                <h3 className="text-gray-400 mb-3">用户菜单</h3>
                <div className="flex flex-col gap-2">
                  {userMenuItems.map((item, index) => (
                    <motion.a
                      key={index}
                      href={item.href}
                      className="py-2 px-4 rounded-lg hover:bg-white/10 transition-colors"
                      whileHover={{ x: 5 }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 搜索框 */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="glass-panel neon-border max-w-2xl w-full p-6"
              ref={searchRef}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">搜索音乐和DJ</h2>
                <button 
                  className="neon-icon-btn"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <FaTimes />
                </button>
              </div>
              
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="输入歌曲名、DJ或专辑..."
                  className="w-full bg-gray-800/50 border border-white/10 rounded-full py-4 pl-5 pr-14 focus:outline-none focus:ring-2 focus:ring-accent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button 
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 neon-icon-btn w-10 h-10"
                >
                  <FaSearch />
                </button>
              </form>
              
              <div className="mt-6">
                <h3 className="text-gray-400 mb-3">热门搜索</h3>
                <div className="flex flex-wrap gap-2">
                  {['越南鼓', '电子音乐', 'DJ Mix', '最新专辑', '排行榜'].map((tag, index) => (
                    <motion.button
                      key={index}
                      className="px-3 py-1.5 bg-gray-800/50 rounded-full text-sm hover:bg-gray-700 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      onClick={() => {
                        setSearchQuery(tag);
                        handleSearch(new Event('submit') as any);
                      }}
                    >
                      {tag}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// 下拉菜单组件
const Dropdown: React.FC<{
  currentLang?: string;
  languages?: Language[];
  onLanguageChange?: (code: string) => void;
  trigger?: React.ReactNode;
  items?: { href: string; label: string }[];
}> = ({ currentLang, languages, onLanguageChange, trigger, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        className="flex items-center"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
      >
        {trigger ? (
          trigger
        ) : (
          <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-800/50 rounded-full">
            <span>{languages?.find(lang => lang.code === currentLang)?.flag}</span>
            <span>{languages?.find(lang => lang.code === currentLang)?.name}</span>
          </div>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 mt-2 w-48 glass-panel rounded-xl overflow-hidden z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {languages ? (
              languages.map((lang) => (
                <motion.a
                  key={lang.code}
                  className={`flex items-center gap-2 px-4 py-3 hover:bg-white/10 transition-colors ${
                    currentLang === lang.code ? 'text-accent' : ''
                  }`}
                  onClick={() => {
                    onLanguageChange?.(lang.code);
                    setIsOpen(false);
                  }}
                  whileHover={{ x: 5 }}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span>{lang.name}</span>
                </motion.a>
              ))
            ) : (
              items?.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  className="block px-4 py-3 hover:bg-white/10 transition-colors"
                  onClick={() => setIsOpen(false)}
                  whileHover={{ x: 5 }}
                >
                  {item.label}
                </motion.a>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavbarComponent;
