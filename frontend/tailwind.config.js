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
        // --- Apple Music 风格颜色 ---
        'background-primary': '#000000', // 纯黑背景
        'background-secondary': '#1C1C1E', // 深灰色元素背景
        'background-tertiary': '#2C2C2E', // 更亮的灰色
        'text-primary': '#FFFFFF', // 纯白文字
        'text-secondary': '#8E8E93', // 灰色辅助文字
        'accent-color-1': '#F62D59', // Apple Music 粉红色
        'accent-color-2': '#FF6B89', // 较亮的粉红色
        'border-color': 'rgba(255, 255, 255, 0.15)', // 边框颜色
      },
      backgroundImage: {
        // --- 渐变色 ---
        'gradient-pink-red': 'linear-gradient(to right, #F62D59, #FF2D55)',
        'gradient-purple-pink': 'linear-gradient(to right, #BF5AF2, #F62D59)',
      },
      fontFamily: {
        // --- 字体 (来自 layout.tsx 的最佳实践) ---
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      keyframes: {
        // --- 动画 ---
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
          '50%': { transform: 'scale(1.05)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-in-left': 'slide-in-left 0.6s ease-out forwards',
        'pulse': 'pulse 2s infinite ease-in-out',
      },
    },
  },
  plugins: [],
};
