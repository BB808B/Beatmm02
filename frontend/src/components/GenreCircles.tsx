'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GenreCirclesProps } from '@/types';

const GenreCircles: React.FC<GenreCirclesProps> = ({ currentLang }) => {
  const getTitle = () => {
    switch (currentLang) {
      case 'zh':
        return '发现塑造我们音乐风景的声音';
      case 'my':
        return 'ကျွန်ုပ်တို့၏ ဂီတရှုခင်းကို ပုံဖော်သည့် အသံများကို ရှာဖွေပါ';
      case 'en':
      default:
        return 'Discover the voices that shape our musical landscape';
    }
  };

  const genres = [
    {
      id: 'ethnic',
      name: currentLang === 'zh' ? '民族音乐' : currentLang === 'my' ? 'လူမျိုးစုဂီတ' : 'Ethnic Vibes',
      image: '/images/genres/ethnic.jpg',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'live',
      name: currentLang === 'zh' ? '现场演出' : currentLang === 'my' ? 'တိုက်ရိုက်ဖျော်ဖြေပွဲ' : 'Live Pop',
      image: '/images/genres/live.jpg',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'electronic',
      name: currentLang === 'zh' ? '电子音乐' : currentLang === 'my' ? 'အီလက်ထရွန်းနစ်ဂီတ' : 'Future Dreams',
      image: '/images/genres/electronic.jpg',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'crystal',
      name: currentLang === 'zh' ? '水晶音效' : currentLang === 'my' ? 'ကြည်လင်သောအသံ' : 'Crystal Sky',
      image: '/images/genres/crystal.jpg',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      id: 'velvet',
      name: currentLang === 'zh' ? '丝绒回声' : currentLang === 'my' ? 'ပိုးထည်တွန်ဆိုင်မှု' : 'Velvet Echo',
      image: '/images/genres/velvet.jpg',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-white mb-6">
            {getTitle()}
          </h2>
        </motion.div>

        <div className="flex justify-center items-center gap-8 flex-wrap">
          {genres.map((genre, index) => (
            <motion.div
              key={genre.id}
              className="genre-circle relative cursor-pointer"
              style={{
                backgroundImage: `url(${genre.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${genre.color} opacity-60 rounded-full`} />
              <div className="genre-label absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white font-semibold text-sm text-center px-2">
                {genre.name}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GenreCircles;
