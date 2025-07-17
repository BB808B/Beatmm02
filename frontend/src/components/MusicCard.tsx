// src/components/MusicCard.tsx

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaHeart, FaShareAlt, FaEye } from 'react-icons/fa'; // 引入 FaEye for likes

interface MusicCardProps {
  id: string;
  title: string;
  artist: string;
  coverImage: string;
  audioSrc: string; // 确保有 audioSrc
  duration?: string; // 可选的播放时长
  isLiked: boolean;
  likes?: number; // 新增点赞数
  isPlaying: boolean;
  onPlayPause: (id: string) => void;
  onLikeToggle: (id: string) => void;
  onShare: (id: string) => void;
}

const MusicCard: React.FC<MusicCardProps> = ({
  id,
  title,
  artist,
  coverImage,
  audioSrc,
  duration,
  isLiked,
  likes,
  isPlaying,
  onPlayPause,
  onLikeToggle,
  onShare,
}) => {
  return (
    <motion.div
      className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer relative"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative w-full h-48 sm:h-64">
        <Image
          src={coverImage}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
          className="rounded-t-lg"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
          <motion.button
            className="text-white text-4xl p-3 rounded-full bg-primary-dark hover:bg-primary transition-colors duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onPlayPause(id)}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </motion.button>
        </div>
      </div>

      <div className="p-4 flex flex-col justify-between h-[calc(100%-12rem)] sm:h-[calc(100%-16rem)]"> {/* Adjust height based on image */}
        <div>
          <h3 className="text-xl font-bold text-white truncate mb-1">{title}</h3>
          <p className="text-gray-400 text-sm truncate">{artist}</p>
        </div>

        <div className="flex items-center justify-between mt-3 text-sm text-gray-400">
          {duration && (
            <span className="flex items-center">
              {duration}
            </span>
          )}
          {likes !== undefined && (
            <span className="flex items-center ml-auto">
              <FaEye className="mr-1 text-primary-light" /> {likes}
            </span>
          )}
        </div>

        <div className="flex justify-around items-center mt-4">
          <motion.button
            className={`p-2 rounded-full transition-colors duration-200 ${isLiked ? 'text-red-500 hover:bg-gray-700' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onLikeToggle(id)}
            aria-label={isLiked ? "Unlike" : "Like"}
          >
            <FaHeart className="text-lg" />
          </motion.button>
          <motion.button
            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onShare(id)}
            aria-label="Share"
          >
            <FaShareAlt className="text-lg" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default MusicCard;
