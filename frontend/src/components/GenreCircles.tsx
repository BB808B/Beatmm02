'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Music } from 'lucide-react'; // 使用 Lucide React 图标

interface GenreCircleProps {
  id: string;
  name: string;
  imageUrl: string;
  link: string;
}

const GenreCircle: React.FC<GenreCircleProps> = ({ id, name, imageUrl, link }) => {
  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Link href={link} className="block">
      <motion.div
        className="genre-circle relative flex items-center justify-center" // 使用 globals.css 中定义的 genre-circle 样式
        style={{ backgroundImage: `url(${imageError ? '/images/default-genre.png' : imageUrl})` }}
        whileHover={{ scale: 1.05 }} // 保持与 globals.css 动画一致
        transition={{ duration: 0.3 }}
      >
        {/* 叠加层和图标 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Music size={36} className="text-white mb-2" />
          <span className="text-white font-semibold text-lg">{name}</span>
        </div>
        {/* 标签，在悬停时显示 */}
        <span className="genre-label">{name}</span> {/* 使用 globals.css 中定义的 genre-label 样式 */}
      </motion.div>
    </Link>
  );
};

interface GenreCirclesProps {
  genres: GenreCircleProps[];
  title: string;
}

const GenreCircles: React.FC<GenreCirclesProps> = ({ genres, title }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center gradient-text mb-8">
        {title}
      </h2>
      <motion.div
        className="flex flex-wrap justify-center gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {genres.map((genre) => (
          <motion.div key={genre.id} variants={itemVariants}>
            <GenreCircle {...genre} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default GenreCircles;
