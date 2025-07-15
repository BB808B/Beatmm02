// src/components/NeonBorders.tsx
"use client";

import { useEffect, useRef } from "react";

const NeonBorders = () => {
  const topBarRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  
  useEffect(() => {
    // 动画函数
    const animateBorders = () => {
      if (topBarRef.current && bottomBarRef.current) {
        const time = Date.now() / 1000;
        
        // 使用正弦波创建更流畅的颜色过渡
        const hue1 = Math.sin(time * 0.5) * 60 + 260;
        const hue2 = Math.sin(time * 0.5 + 2) * 60 + 200;
        
        // 动态改变阴影大小和强度
        const intensity = 0.5 + Math.sin(time * 2) * 0.3;
        const size = 10 + Math.sin(time * 3) * 5;
        
        topBarRef.current.style.boxShadow = `
          0 0 ${size}px hsla(${hue1}, 100%, 70%, ${intensity}),
          0 0 ${size * 1.5}px hsla(${hue1 + 30}, 100%, 60%, ${intensity * 0.7})
        `;
        
        bottomBarRef.current.style.boxShadow = `
          0 0 ${size}px hsla(${hue2}, 100%, 70%, ${intensity}),
          0 0 ${size * 1.5}px hsla(${hue2 + 30}, 100%, 60%, ${intensity * 0.7})
        `;
      }
      animationRef.current = requestAnimationFrame(animateBorders);
    };
    
    // 启动动画
    animationRef.current = requestAnimationFrame(animateBorders);
    
    // 清理函数
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <>
      <div 
        ref={topBarRef}
        className="neon-top-bar"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "3px",
          background: "linear-gradient(90deg, #6a11cb, #2575fc, #ff2d75)",
          zIndex: 1000,
          transition: "box-shadow 0.2s ease-out"
        }}
        aria-hidden="true" // 对屏幕阅读器隐藏
      />
      <div 
        ref={bottomBarRef}
        className="neon-bottom-bar"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "3px",
          background: "linear-gradient(90deg, #ff2d75, #2575fc, #6a11cb)",
          zIndex: 1000,
          transition: "box-shadow 0.2s ease-out"
        }}
        aria-hidden="true" // 对屏幕阅读器隐藏
      />
    </>
  );
};

export default NeonBorders;
