// src/types/index.ts

// ... (省略所有现有的接口定义，如 Translations, NavTranslations, etc.)

// >>> 新增 Track 接口 <<<
export interface Track {
  id: string;
  title: string;
  artist: string;
  coverImage: string;
  audioSrc: string;
  isLiked?: boolean; // 可选的，根据您的 MusicCardProps 来看，这里可能需要
}

// >>> 新增 CarouselSlide 接口 <<<
// 由于日志中也提到了 CarouselSlide 丢失，这里也一并添加
export interface CarouselSlide {
  id: string;
  imageUrl: string;
  altText: string;
  link: string; // 点击轮播图跳转的链接
}

// 确保 MusicCardProps 也在这个文件里，并与 MusicCard.tsx 的使用一致
export interface MusicCardProps {
  id: string;
  title: string;
  artist: string;
  coverImage: string; // URL to the album cover
  audioSrc: string;   // URL to the audio file
  isLiked: boolean;
  isPlaying: boolean;
  onPlayPause: (id: string) => void;
  onLikeToggle: (id: string) => void;
  onShare: (id: string) => void;
  // 可以根据实际需求添加更多属性，例如 duration, views, etc.
}

// ... (其他接口)
