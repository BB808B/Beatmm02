// src/components/Carousel.tsx

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { CarouselSlide } from '@/types'; // Import CarouselSlide

interface CarouselProps {
  slides: CarouselSlide[];
  autoPlayInterval?: number; // Interval in ms, default to 5000ms
}

const Carousel: React.FC<CarouselProps> = ({ slides, autoPlayInterval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, autoPlayInterval);
  }, [slides.length, autoPlayInterval]);

  useEffect(() => {
    resetTimeout();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex, resetTimeout]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    resetTimeout();
  };

  if (!slides || slides.length === 0) {
    return <div className="text-center text-gray-400 py-10">No carousel slides available.</div>;
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: '0%',
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      position: 'absolute', // To prevent layout shift during exit
    }),
  };

  const paginate = useCallback((newDirection: number) => {
    let nextIndex = currentIndex + newDirection;
    if (nextIndex < 0) {
      nextIndex = slides.length - 1;
    } else if (nextIndex >= slides.length) {
      nextIndex = 0;
    }
    setCurrentIndex(nextIndex);
    resetTimeout();
  }, [currentIndex, slides.length, resetTimeout]);

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl aspect-video">
      <AnimatePresence initial={false} custom={1}> {/* custom prop for direction */}
        <motion.div
          key={currentIndex}
          custom={1} // Default direction for initial load or if not explicitly passed
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="absolute inset-0 w-full h-full"
        >
          <Link href={slides[currentIndex].link || '#'} passHref>
            <div className="relative w-full h-full">
              <Image
                src={slides[currentIndex].imageUrl}
                alt={slides[currentIndex].altText || slides[currentIndex].title || `Slide ${currentIndex + 1}`} // Use altText first, then title
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                style={{ objectFit: 'cover' }}
                priority={currentIndex === 0} // Prioritize loading the first image
                className="brightness-75"
              />
              {(slides[currentIndex].title || slides[currentIndex].description) && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent p-6 text-white text-center">
                  {slides[currentIndex].title && (
                    <h2 className="text-3xl font-bold mb-2 drop-shadow-lg">
                      {slides[currentIndex].title}
                    </h2>
                  )}
                  {slides[currentIndex].description && (
                    <p className="text-lg text-gray-200 hidden sm:block drop-shadow-md">
                      {slides[currentIndex].description}
                    </p>
                  )}
                </div>
              )}
            </div>
          </Link>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              currentIndex === idx ? 'bg-primary' : 'bg-gray-400 hover:bg-gray-300'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => paginate(-1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full text-2xl hover:bg-opacity-75 transition-colors duration-300 z-10 hidden md:block"
        aria-label="Previous slide"
      >
        &#10094;
      </button>
      <button
        onClick={() => paginate(1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full text-2xl hover:bg-opacity-75 transition-colors duration-300 z-10 hidden md:block"
        aria-label="Next slide"
      >
        &#10095;
      </button>
    </div>
  );
};

export default Carousel;
