// frontend/tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    // 关键修复：确保 Tailwind 扫描 src 目录下的所有相关文件！
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 1. 定义我们的核心设计语言颜色
      colors: {
        background: '#121212', // 深邃的暗黑背景
        foreground: '#E0E0E0', // 柔和的白色文字，避免纯白刺眼
        card: '#1A1A1A',       // 卡片、输入框等元素的背景色
        'card-foreground': '#E0E0E0', // 卡片上的文字颜色
        
        primary: '#8A2BE2', // 我们的主品牌色 - 霓虹紫
        'primary-foreground': '#FFFFFF', // 主品牌色上的文字

        secondary: '#4A4A4A', // 次要元素，如边框、分割线
        
        // 用于强调、高亮或特殊状态的颜色
        accent: '#FF00FF', // 亮粉色，可用于点缀
        destructive: '#FF4D4D', // 错误、删除等警示色
        success: '#39C790', // 成功提示色
      },

      // 2. 将 Inter 字体应用到默认的 sans-serif 字体族
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },

      // 3. 添加一些预设的酷炫动画，方便后续使用
      keyframes: {
        'glow': {
          '0%, 100%': { boxShadow: '0 0 5px #8A2BE2' },
          '50%': { boxShadow: '0 0 20px #FF00FF' },
        },
        'fade-in': {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          'from': { transform: 'translateX(-100%)' },
          'to': { transform: 'translateX(0)' },
        }
      },
      animation: {
        'glow': 'glow 3s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-in': 'slide-in 0.5s ease-out forwards',
      },
      
      // 4. 定义一些圆角尺寸，保持统一
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.25rem',
      }
    },
  },
  plugins: [],
};
