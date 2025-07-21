'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, User, Music, Home, Trophy, Radio, FileText, Menu, X } from 'lucide-react';
import { Language, TranslationType } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  translations: TranslationType;
}

const NavbarComponent: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  translations,
}) => {
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
        setShowLanguageDropdown(false);
      }
    };
    if (showLanguageDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLanguageDropdown]);
  
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
      case 'en': return 'EN';
      case 'my': return 'MY';
      default: return 'EN';
    }
  };

  const menuItems = [
    { icon: Home, label: translations.nav.home, href: '/', active: true },
    { icon: Music, label: translations.nav.music, href: '/music' },
    { icon: Radio, label: translations.nav.radio, href: '/radio' },
    { icon: Trophy, label: translations.nav.charts, href: '/charts' },
    { icon: FileText, label: translations.nav.rules, href: '/rules' },
  ];

  return (
    <nav className="navbar-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-lg">
              <Music className="text-white" size={20} />
            </div>
            <span className="navbar-brand">BeatMM Pro</span>
          </Link>

          {!isMobile && (
            <div className="navbar-menu">
              {menuItems.map((item) => (
                <Link key={item.href} href={item.href} className={`navbar-link ${item.active ? 'active' : ''}`}>
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
                      <button onClick={() => handleLanguageClick('zh')} className={`language-option ${currentLang === 'zh' ? 'active' : ''}`}>中文</button>
                      <button onClick={() => handleLanguageClick('en')} className={`language-option ${currentLang === 'en' ? 'active' : ''}`}>English</button>
                      <button onClick={() => handleLanguageClick('my')} className={`language-option ${currentLang === 'my' ? 'active' : ''}`}>မြန်မာ</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <Link href="/profile" className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <User size={20} className="text-gray-300" />
            </Link>

            {isMobile && (
              <button onClick={toggleMenu} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {isMobile && isMenuOpen && (
          <motion.div
             className="md:hidden fixed top-0 right-0 w-64 h-full shadow-2xl p-6 z-40 overflow-y-auto navbar-container"
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
            
            <ul className="space-y-4">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} onClick={toggleMenu} className={`flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${item.active ? 'text-white bg-gray-700' : 'text-gray-300 hover:text-white hover:bg-gray-700'}`}>
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className="mt-8 pt-4 border-t border-gray-700">
               <h3 className="text-lg font-bold text-white mb-3">语言 / Language</h3>
               <div className="flex flex-col space-y-2">
                 <button onClick={() => handleLanguageClick('zh')} className={`w-full text-left language-option ${currentLang === 'zh' ? 'active' : ''}`}>中文</button>
                 <button onClick={() => handleLanguageClick('en')} className={`w-full text-left language-option ${currentLang === 'en' ? 'active' : ''}`}>English</button>
                 <button onClick={() => handleLanguageClick('my')} className={`w-full text-left language-option ${currentLang === 'my' ? 'active' : ''}`}>မြန်မာ</button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavbarComponent;
