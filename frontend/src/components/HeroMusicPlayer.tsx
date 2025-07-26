// src/components/HeroMusicPlayer.tsx
'use client';

import { Play, SkipBack, SkipForward } from 'lucide-react';

// 这是一个纯UI组件，专门用于首页英雄区展示，不包含实际播放逻辑。
// 真正的播放逻辑将在未来的 GlobalPlayer 组件中实现。

const HeroMusicPlayer = () => {
  return (
    <div className="w-full max-w-md mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
      
      {/* 播放控制按钮 */}
      <div className="flex items-center justify-center gap-8 my-4">
        <button className="text-text-secondary hover:text-white transition-colors disabled:opacity-50" disabled>
          <SkipBack size={24} />
        </button>
        <button className="w-16 h-16 bg-gradient-to-br from-accent-color-1 to-accent-color-2 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform">
          <Play size={32} className="ml-1" />
        </button>
        <button className="text-text-secondary hover:text-white transition-colors disabled:opacity-50" disabled>
          <SkipForward size={24} />
        </button>
      </div>

      {/* 进度条 */}
      <div className="flex items-center gap-4 text-sm text-text-secondary">
        <span>1:10</span>
        <div className="w-full bg-background-primary h-1.5 rounded-full cursor-pointer group relative">
          <div 
            className="bg-gradient-to-r from-accent-color-2 to-accent-color-1 h-1.5 rounded-full" 
            style={{ width: '30%' }} 
          />
          <div 
            className="absolute top-1/2 -mt-2 w-4 h-4 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: '30%', transform: 'translateX(-50%)' }}
          />
        </div>
        <span>3:45</span>
      </div>

    </div>
  );
};

export default HeroMusicPlayer;
