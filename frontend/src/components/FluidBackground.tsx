// src/components/FluidBackground.tsx
"use client";

import { useEffect, useRef } from "react";

// 粒子类定义
class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  
  constructor(canvas: HTMLCanvasElement) {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1.5; // 减小粒子尺寸
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
    this.color = `hsla(${265 + Math.random() * 40}, 80%, 60%, ${0.05 + Math.random() * 0.1})`; // 更一致的色调
  }
  
  update(canvas: HTMLCanvasElement) {
    this.x += this.speedX;
    this.y += this.speedY;
    
    // 边界反弹
    if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
    if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

const FluidBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // 设置画布尺寸
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // 重置粒子
      particlesRef.current = [];
      const particleCount = Math.min(80, Math.floor(window.innerWidth / 15));
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push(new Particle(canvas));
      }
    };
    
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    
    // 连接粒子
    const connectParticles = () => {
      const maxDistance = 120;
      const particles = particlesRef.current;
      
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            const opacity = 1 - distance / maxDistance;
            ctx.strokeStyle = `hsla(275, 80%, 70%, ${opacity * 0.15})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };
    
    // 动画循环
    const animate = () => {
      if (!ctx || !canvas) return;
      
      // 使用半透明填充创建拖尾效果
      ctx.fillStyle = "rgba(15, 12, 41, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 添加径向渐变背景
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height) / 1.5
      );
      gradient.addColorStop(0, "rgba(25, 20, 60, 0.3)");
      gradient.addColorStop(1, "rgba(15, 12, 41, 0.1)");
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 更新和绘制粒子
      particlesRef.current.forEach(particle => {
        particle.update(canvas);
        particle.draw(ctx);
      });
      
      connectParticles();
      animationFrameId.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fluid-background"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1
      }}
      aria-hidden="true" // 对屏幕阅读器隐藏
    />
  );
};

export default FluidBackground;
