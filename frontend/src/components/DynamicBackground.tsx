// frontend/src/components/DynamicBackground.tsx
'use client';
import React, { useEffect, useRef, useCallback } from 'react';

const DynamicBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback((ctx: CanvasRenderingContext2D, frameCount: number) => {
    const { width, height } = ctx.canvas;
    ctx.clearRect(0, 0, width, height);

    const particleCount = 50;
    const connectionRadius = width > 768 ? 150 : 80;

    const particles = Array.from({ length: particleCount }, (_, i) => {
      const time = frameCount * 0.0005 + i * 100;
      const x = (Math.sin(time) * 0.5 + 0.5) * width;
      const y = (Math.cos(time * 0.7) * 0.5 + 0.5) * height;
      const r = Math.sin(time * 0.3) * 1.5 + 1.5;
      return { x, y, r };
    });

    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(138, 43, 226, 0.5)'; // Accent color 1 with opacity
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < connectionRadius) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255, 20, 147, ${1 - distance / connectionRadius})`; // Accent color 2 with opacity
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    let frameCount = 0;
    let animationFrameId: number;

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const render = () => {
      frameCount++;
      draw(context, frameCount);
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full -z-10"
    />
  );
};

export default DynamicBackground;
