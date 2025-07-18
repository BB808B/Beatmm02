'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, User, Music, Home, Trophy, Radio, FileText, Menu, X } from 'lucide-react';
import { NavbarProps, Language } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import MusicVisualizer from './MusicVisualizer';

const NavbarComponent: React.FC<NavbarProps> = ({ currentLang, onLanguageChange, translations }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
  }, [isMenuOpen, showLanguageDropdown]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLanguageClick = (lang: Language) => {
    onLanguageChange(lang);
    setShowLanguageDropdown(false);
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  const getCurrentLanguageDisplay = () => {
    switch (currentLang) {
      case 'zh': return '中';
      case 'my': return 'မြန်';
      case 'en': return 'EN';
      default: return 'EN';
    }
  };

  const menuItems = [
    {
      icon: Home,
      label: translations.nav.home,
      href: '/',
      active: true
    },
    {
      icon: Music,
      label: translations.nav.music,
      href: '/music'
    },
    {
      icon: Radio,
      label: translations.nav.radio,
      href: '/radio'
    },
    {
      icon: Trophy,
      label: translations.nav.charts,
      href: '/charts'
    },
    {
      icon: FileText,
      label: translations.nav.rules,
      href: '/rules'
    }
  ];

  return (
    <nav className="navbar-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Music className="text-white" size={20} />
              </div>
              <div className="absolute -top-1 -right-1">
                <MusicVisualizer isPlaying={true} size="xs" />
              </div>
            </div>
            <span className="navbar-brand">BeatMM Pro</span>
          </Link>

          {!isMobile && (
            <div className="navbar-menu">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`navbar-link ${item.active ? 'active' : ''}`}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <Search size={20} className="text-gray-300" />
            </button>

            {!isMobile && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  className="language-button"
                >
                  {getCurrentLanguageDisplay()}
                </button>

                <AnimatePresence>
                  {showLanguageDropdown && (
                    <motion.div
                      className="language-dropdown"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <button
                        onClick={() => handleLanguageClick('zh')}
                        className={`language-option ${currentLang === 'zh' ? 'active' : ''}`}
                      >
                        中文
                      </button>
                      <button
                        onClick={() => handleLanguageClick('en')}
                        className={`language-option ${currentLang === 'en' ? 'active' : ''}`}
                      >
                        English
                      </button>
                      <button
                        onClick={() => handleLanguageClick('my')}
                        className={`language-option ${currentLang === 'my' ? 'active' : ''}`}
                      >
                        မြန်မာ
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <Link href="/profile" className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <User size={20} className="text-gray-300" />
            </Link>

            {isMobile && (
              <button
                onClick={toggleMenu}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {isMobile && isMenuOpen && (
            <motion.div
              className="md:hidden fixed top-0 right-0 w-64 h-full shadow-2xl p-6 z-50 overflow-y-auto navbar-container"
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
