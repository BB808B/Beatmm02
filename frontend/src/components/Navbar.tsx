// src/components/Navbar.tsx

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaUser, FaMusic, FaHome, FaTrophy, FaBroadcastTower, FaFileContract, FaTimes } from 'react-icons/fa';
import { NavbarProps, Language } from '@/types'; // 确保导入 NavbarProps 和 Language
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const NavbarComponent: React.FC<NavbarProps> = ({ currentLang, onLanguageChange, translations }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuVariants = {
    hidden: { x: '100%' },
    visible: { x: '0%', transition: { type: 'spring', stiffness: 120, damping: 17 } },
    exit: { x: '100%', transition: { type: 'spring', stiffness: 120, damping: 17 } },
  };

  const handleLanguageClick = (lang: Language) => {
    onLanguageChange(lang);
    if (isMobile) {
      setIsMenuOpen(false); // Close menu on language change for mobile
    }
  };

  const navItems = [
    { name: translations.nav.home, icon: FaHome, href: '/' },
    { name: translations.nav.music, icon: FaMusic, href: '/music' },
    { name: translations.nav.dj, icon: FaBroadcastTower, href: '/dj' },
    { name: translations.nav.live, icon: FaTrophy, href: '/live' }, // Changed icon to FaTrophy for Live (assuming leaderboard/competition aspect)
    { name: translations.nav.ranking, icon: FaTrophy, href: '/ranking' }, // FaTrophy for Ranking
    { name: translations.nav.profile, icon: FaUser, href: '/profile' },
    { name: translations.nav.rules, icon: FaFileContract, href: '/rules' }, // Added Rules page
  ];

  return (
    <nav className="fixed w-full z-50 bg-gradient-to-r from-gray-900 to-black shadow-lg py-3 px-4 md:px-8">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/images/logo.png" alt="BeatMM Pro Logo" width={40} height={40} className="rounded-full" />
          <span className="text-white text-2xl font-bold tracking-tight hidden sm:block">BeatMM Pro</span>
        </Link>

        {/* Search Bar (Desktop Only) */}
        <div className="relative flex-grow mx-4 md:mx-8 hidden md:block max-w-md">
          <input
            type="text"
            placeholder={translations.common.search}
            className="w-full py-2 pl-10 pr-4 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-dark border border-gray-700"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        {/* Desktop Nav Items & User Actions */}
        <div className="hidden md:flex items-center space-x-6">
          <ul className="flex space-x-6">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link href={item.href} className="text-gray-300 hover:text-primary-light flex items-center transition-colors duration-200 group">
                  <item.icon className="mr-2 text-xl group-hover:text-primary" />
                  <span className="text-lg font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
          {/* Language Selector Desktop */}
          <div className="relative group">
            <button className="text-gray-300 hover:text-primary-light flex items-center transition-colors duration-200">
              <span className="text-lg font-medium uppercase">{currentLang}</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div className="absolute right-0 mt-2 w-24 bg-gray-800 rounded-md shadow-lg py-1 hidden group-hover:block transition-all duration-200 ease-out transform origin-top-right">
              <button
                onClick={() => handleLanguageClick('zh')}
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-primary-light w-full text-left"
              >
                中文
              </button>
              <button
                onClick={() => handleLanguageClick('my')}
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-primary-light w-full text-left"
              >
                Myanmar
              </button>
            </div>
          </div>
          {/* Login/Register (Placeholder) */}
          <Link href="/login" className="px-5 py-2 rounded-full text-lg font-semibold neon-button">
            {translations.nav.login}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          <button className="text-gray-300 text-2xl" onClick={toggleMenu}>
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            ref={menuRef}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
            className="fixed top-0 right-0 w-64 h-full bg-gradient-to-b from-gray-900 to-black shadow-2xl p-6 md:hidden z-50 overflow-y-auto"
          >
            <div className="flex justify-end mb-6">
              <button onClick={toggleMenu} className="text-gray-300 text-3xl">
                <FaTimes />
              </button>
            </div>
            {/* Mobile Search Bar */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder={translations.common.search}
                className="w-full py-2 pl-10 pr-4 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-dark border border-gray-700"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <ul className="space-y-4">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} onClick={toggleMenu} className="text-gray-300 hover:text-primary-light flex items-center py-2 text-xl font-medium transition-colors duration-200">
                    <item.icon className="mr-3 text-2xl" />
                    {item.name}
                  </Link>
                </li>
              ))}
              <li className="pt-4 border-t border-gray-700 mt-4">
                <Link href="/login" onClick={toggleMenu} className="block px-4 py-2 rounded-full text-xl font-semibold neon-button text-center">
                  {translations.nav.login}
                </Link>
              </li>
            </ul>

            {/* Language Selector Mobile */}
            <div className="mt-8 pt-4 border-t border-gray-700">
              <h3 className="text-lg font-bold text-white mb-3">语言 / Language</h3>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleLanguageClick('zh')}
                  className={`px-4 py-2 rounded-lg text-lg font-medium transition-colors duration-200 ${
                    currentLang === 'zh' ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  中文
                </button>
                <button
                  onClick={() => handleLanguageClick('my')}
                  className={`px-4 py-2 rounded-lg text-lg font-medium transition-colors duration-200 ${
                    currentLang === 'my' ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Myanmar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavbarComponent;
