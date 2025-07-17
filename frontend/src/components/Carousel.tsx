// src/components/Carousel.tsx
// 这是一个基础的 Carousel 组件示例。如果您的项目中有更复杂的实现，请使用您的版本。
// 但请确保它有一个默认导出，并且符合 CarouselSlide 类型。

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { CarouselSlide } from '@/types'; // 确保导入 CarouselSlide 类型

interface CarouselProps {
  slides: CarouselSlide[];
  interval?: number; // 自动播放间隔，默认为5000ms
}

const Carousel: React.FC<CarouselProps> = ({ slides, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length > 1) {
      const timer = setInterval(nextSlide, interval);
      return () => clearInterval(timer);
    }
  }, [slides.length, interval, nextSlide]);

  if (slides.length === 0) {
    return (
      <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-400">
        No slides available.
      </div>
    );
  }

  const currentSlide = slides[currentIndex];

  return (
    <div className="relative w-full h-full overflow-hidden">
      <AnimatePresence initial={false} custom={currentIndex}>
        <motion.div
          key={currentSlide.id}
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <Image
            src={currentSlide.imageUrl}
            alt={currentSlide.altText}
            layout="fill"
            objectFit="cover"
            className="z-0"
            priority={currentIndex === 0} // 优化首张图片加载
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 p-3 rounded-full text-white hover:bg-opacity-75 transition-all duration-300 z-10"
            aria-label="Previous slide"
          >
            &#10094;
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 p-3 rounded-full text-white hover:bg-opacity-75 transition-all duration-300 z-10"
            aria-label="Next slide"
          >
            &#10095;
          </button>
        </>
      )}

      {/* Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                idx === currentIndex ? 'bg-white' : 'bg-gray-400 bg-opacity-50'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
