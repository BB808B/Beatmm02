// frontend/tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // --- 核心颜色 (来自您的 globals.css) ---
        'background-primary': '#0A0A0A',
        'background-secondary': '#1A1A1A',
        'text-primary': '#E0E0E0',
        'text-secondary': '#A0A0A0',
        'accent-color-1': '#8A2BE2', // 紫罗兰
        'accent-color-2': '#FF1493', // 深粉红
        'border-color': 'rgba(255, 255, 255, 0.1)',
      },
      backgroundImage: {
        // --- 渐变色 (来自您的 globals.css) ---
        'gradient-purple-blue': 'linear-gradient(to right, #8A2BE2, #4169E1)',
        'gradient-pink-purple': 'linear-gradient(to right, #FF1493, #8A2BE2)',
      },
      fontFamily: {
        // --- 字体 (来自 layout.tsx 的最佳实践) ---
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      keyframes: {
        // --- 动画 (来自您的 globals.css) ---
        'fade-in': {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-left': {
          'from': { opacity: '0', transform: 'translateX(-20px)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        'pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
        'glow': {
          '0%, 100%': { textShadow: '0 0 8px #FF1493, 0 0 16px #8A2BE2' },
          '50%': { textShadow: '0 0 16px #FF1493, 0 0 32px #8A2BE2' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-in-left': 'slide-in-left 0.6s ease-out forwards',
        'pulse': 'pulse 1.5s infinite ease-in-out',
        'glow': 'glow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
