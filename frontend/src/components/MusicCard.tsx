// src/components/MusicCard.tsx
'use client';

import Image from 'next/image';
import { Play, Music } from 'lucide-react'; // <-- 这是修正后的行
import { Track } from '@/types'; 

interface MusicCardProps {
  track: Partial<Track>; 
  onClick?: (id: string) => void; 
}

const MusicCard: React.FC<MusicCardProps> = ({ track, onClick }) => {
  
  const { id = '', title = 'Untitled', artist = 'Unknown Artist', coverImage } = track;

  const handleCardClick = () => {
    if (onClick && id) {
      onClick(id);
    }
  };

  return (
    <div 
      className="group animate-fade-in cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative mb-3 aspect-square rounded-xl overflow-hidden transition-all duration-300 group-hover:shadow-2xl">
        
        {coverImage ? (
          <Image 
            src={coverImage} 
            alt={title} 
            fill 
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          />
        ) : (
          <div className="w-full h-full bg-background-secondary flex items-center justify-center">
            <Music className="w-1/3 h-1/3 text-text-secondary opacity-50" />
          </div>
        )}

        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-6 h-6 text-white ml-1" />
          </div>
        </div>
      </div>

      <h4 className="font-semibold truncate text-text-primary">{title}</h4>
      <p className="text-sm text-text-secondary truncate">{artist}</p>
    </div>
  );
};

export default MusicCard;
