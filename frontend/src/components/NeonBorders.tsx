// src/components/NeonBorders.tsx
"use client";

import { useEffect, useRef } from "react";

const NeonBorders = () => {
  const topBarRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const animateBorders = () => {
      if (topBarRef.current && bottomBarRef.current) {
        const hue = (Date.now() / 50) % 360;
        topBarRef.current.style.boxShadow = `0 0 15px hsla(${hue}, 100%, 70%, 0.8)`;
        bottomBarRef.current.style.boxShadow = `0 0 15px hsla(${hue + 120}, 100%, 70%, 0.8)`;
      }
      requestAnimationFrame(animateBorders);
    };
    
    animateBorders();
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
          height: "4px",
          background: "linear-gradient(90deg, #6a11cb, #2575fc, #ff2d75)",
          zIndex: 1000,
          transition: "box-shadow 0.3s ease"
        }}
      />
      <div 
        ref={bottomBarRef}
        className="neon-bottom-bar"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "4px",
          background: "linear-gradient(90deg, #ff2d75, #2575fc, #6a11cb)",
          zIndex: 1000,
          transition: "box-shadow 0.3s ease"
        }}
      />
    </>
  );
};

export default NeonBorders;
