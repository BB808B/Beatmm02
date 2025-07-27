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
          <SkipBack size={28} />
        </button>
        <button className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all transform hover:scale-105">
          <Play size={40} className="ml-1" />
        </button>
        <button className="text-text-secondary hover:text-white transition-colors disabled:opacity-50" disabled>
          <SkipForward size={28} />
        </button>
      </div>

      {/* 进度条 */}
      <div className="flex items-center gap-4 text-sm text-text-secondary">
        <span>1:10</span>
        <div className="w-full bg-white/10 h-1.5 rounded-full cursor-pointer group relative">
          <div 
            className="bg-white h-1.5 rounded-full"
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
