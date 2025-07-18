export type Language = 'zh' | 'my' | 'en';

export interface TranslationType {
  common: {
    loading: string;
    subscribe: string;
    freeTrial: string;
    popular: string;
  };
  navbar: {
    home: string;
    music: string;
    radio: string;
    charts: string;
    rules: string;
  };
  hero: {
    title: string;
    subtitle: string;
  };
  pricing: {
    title: string;
    basic: string;
    premium: string;
    vip: string;
    month: string;
    features: {
      unlimited: string;
      hq: string;
      offline: string;
      exclusive: string;
      early: string;
    };
    mostPopular: string;
  };
}

export interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  translations: {
    navbar: {
      home: string;
      music: string;
      radio: string;
      charts: string;
      rules: string;
    };
  };
}

export interface MusicCardProps {
  id: string;
  title: string;
  artist: string;
  coverImage: string;
  audioUrl: string;
  duration: string | number;
  isPlaying?: boolean;
  onPlay?: (id: string) => void;
  onPause?: (id: string) => void;
  onLike?: (id: string) => void;
  onShare?: (id: string) => void;
  isLiked?: boolean;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  coverImage: string;
  audioUrl: string;
  duration: number;
}

export interface MusicPlayerProps {
  tracks: Track[];
  onShowPlaylist: () => void;
  currentTrackIndex: number;
  setCurrentTrackIndex: (index: number) => void;
}

export interface GenreCirclesProps {
  currentLang: Language;
}

export interface MusicVisualizerProps {
  isPlaying: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: string;
}

export interface PricingSectionProps {
  currentLang: Language;
}
