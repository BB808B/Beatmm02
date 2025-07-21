// file: frontend/src/components/MusicCard.tsx (极致简约版)
'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Track } from '@/types';

const MusicCard: React.FC<Track> = ({ title, artist, coverImage }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="music-card group">
      <div className="music-card-image-wrapper">
        {!imageError && coverImage ? (
          <Image
            src={coverImage}
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500">
            <span>Image not available</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="music-card-title truncate">{title}</h3>
        <p className="music-card-artist truncate">{artist}</p>
      </div>
    </div>
  );
};

export default MusicCard;
