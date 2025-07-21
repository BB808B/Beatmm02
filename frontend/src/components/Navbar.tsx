// file: frontend/src/components/Navbar.tsx (极致简约版)
'use client';
import React from 'react';
import Link from 'next/link';

// 假设我们有一个 usePathname hook 来获取当前路径
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/browse', label: 'Browse' },
    { href: '/library', label: 'Library' },
  ];

  return (
    <header className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* 左侧导航链接 */}
        <nav className="flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`navbar-link text-sm ${pathname === item.href ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 右侧登录按钮 */}
        <div>
          <Link href="/login" className="login-button text-sm">
            Log in
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
