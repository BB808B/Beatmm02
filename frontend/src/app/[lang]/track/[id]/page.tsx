'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Play, Pause, SkipBack, SkipForward, Heart, Download, Share2 } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/Button';
import React from 'react';

import { Track } from '@/types';
import { fetchTrackById } from '@/lib/api';

// 临时的多语言占位符
const t = (key: string) => key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

const TrackPage = () => {
  const { id } = useParams();
  const [track, setTrack] = React.useState<Track | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (typeof id === 'string') {
      const loadTrack = async () => {
        setLoading(true);
        const fetchedTrack = await fetchTrackById(id);
        setTrack(fetchedTrack || null);
        setLoading(false);
      };
      loadTrack();
    }
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p>Loading...</p></div>;
  }

  if (!track) {
    return <div className="flex justify-center items-center h-screen"><p>Track not found.</p></div>;
  }

  return (
    <div>
      <PageHeader title={track.title} subtitle={`By ${track.artist}`} />
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          {/* --- 专辑封面 --- */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 mb-8 rounded-2xl shadow-2xl overflow-hidden">
            <Image src={track.coverImage} alt={track.title} layout="fill" objectFit="cover" />
          </div>

          {/* --- 歌曲信息 --- */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white">{track.title}</h2>
            <p className="text-xl text-text-secondary">{track.artist}</p>
          </div>

          {/* --- 进度条 --- */}
          <div className="w-full max-w-md mb-8">
            <div className="h-2 bg-background-tertiary rounded-full">
              <div className="h-full bg-accent-color-1 rounded-full" style={{ width: '40%' }}></div>
            </div>
            <div className="flex justify-between text-sm text-text-secondary mt-1">
              <span>1:34</span>
              <span>3:55</span>
            </div>
          </div>

          {/* --- 播放控件 --- */}
          <div className="flex items-center justify-center space-x-6 mb-8">
            <Button variant="ghost" size="sm" className="text-text-secondary hover:text-white">
              <SkipBack size={32} />
            </Button>
            <Button variant="primary" size="lg" className="w-20 h-20 shadow-lg">
              <Play size={40} />
            </Button>
            <Button variant="ghost" size="sm" className="text-text-secondary hover:text-white">
              <SkipForward size={32} />
            </Button>
          </div>

          {/* --- 操作按钮 --- */}
          <div className="flex items-center space-x-6">
            <Button variant="ghost" size="sm" className="text-text-secondary hover:text-accent-color-2">
              <Heart size={24} />
            </Button>
            <Button variant="ghost" size="sm" className="text-text-secondary hover:text-white">
              <Download size={24} />
            </Button>
            <Button variant="ghost" size="sm" className="text-text-secondary hover:text-white">
              <Share2 size={24} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackPage;
