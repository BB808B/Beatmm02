'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, User } from 'lucide-react';
import { motion } from 'framer-motion';

// 临时的多语言占位符
const t = (key: string) => key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/me', label: 'Me', icon: User },
];

const BottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background-secondary/80 backdrop-blur-lg border-t border-border-color z-50 md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center w-full h-full">
              <motion.div
                animate={{ scale: isActive ? 1.1 : 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <item.icon
                  size={24}
                  className={`transition-colors ${isActive ? 'text-accent-color-1' : 'text-text-secondary'}`}
                />
              </motion.div>
              <span className={`text-xs mt-1 transition-colors ${isActive ? 'text-text-primary' : 'text-text-secondary'}`}>
                {t(item.label)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
