
'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname()

  const navItems = [
    { href: '/', icon: '🏠', label: '首页' },
    { href: '/search', icon: '🔍', label: '搜索' },
    { href: '/player', icon: '▶️', label: '播放' },
    { href: '/profile', icon: '👤', label: '我的' },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="pb-20">
        {children}
      </main>
      
      {/* 底部导航 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50">
        <div className="flex justify-around py-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-2 px-4 ${
                pathname === item.href ? 'text-blue-400' : 'text-gray-400'
              }`}
            >
              <span className="text-xl mb-1">{item.icon}</span>
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}


