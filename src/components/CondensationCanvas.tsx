import React, { useRef, useEffect, useCallback } from 'react';

interface CondensationCanvasProps {
  onWipe?: () => void;
  isWipedClean?: boolean;
}

export const CondensationCanvas: React.FC<CondensationCanvasProps> = ({ onWipe, isWipedClean = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const wipeTriggeredRef = useRef(false);
  const dripsRef = useRef<{ x: number; y: number; length: number; speed: number; opacity: number }[]>([]);

  const initFog = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.globalCompositeOperation = 'source-over';
    
    // Rich realistic steamy glass gradient with subtle atmospheric blur
    const fogGradient = ctx.createLinearGradient(0, 0, 0, height);
    fogGradient.addColorStop(0, 'rgba(18, 14, 30, 0.52)');
    fogGradient.addColorStop(0.5, 'rgba(25, 20, 42, 0.44)');
    fogGradient.addColorStop(1, 'rgba(14, 10, 24, 0.54)');
    ctx.fillStyle = fogGradient;
    ctx.fillRect(0, 0, width, height);

    // Condensation moisture speckles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    for (let i = 0; i < (width * height) / 900; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const r = Math.random() * 2 + 0.5;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Seed gentle vertical rain water drips running down the pane
    dripsRef.current = Array.from({ length: 10 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.4,
      length: Math.random() * 70 + 25,
      speed: Math.random() * 0.7 + 0.3,
      opacity: Math.random() * 0.35 + 0.15,
    }));
  }, []);

  // Clear all fog if isWipedClean is true
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (isWipedClean) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      initFog(ctx, canvas.width, canvas.height);
    }
  }, [isWipedClean, initFog]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (!isWipedClean) {
        initFog(ctx, canvas.width, canvas.height);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    // Slow natural re-condensation (only if not manually kept wiped clean)
    const fogInterval = setInterval(() => {
      if (ctx && canvas && !isDrawingRef.current && !isWipedClean) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgba(20, 16, 32, 0.025)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }, 3200);

    // Animate falling rain streaks on the glass pane
    const animateDrips = () => {
      if (ctx && canvas && !isWipedClean) {
        dripsRef.current.forEach((drip) => {
          ctx.globalCompositeOperation = 'destination-out';
          ctx.fillStyle = `rgba(0, 0, 0, ${drip.opacity * 0.12})`;
          ctx.beginPath();
          ctx.ellipse(drip.x, drip.y, 1.5, 6, 0, 0, Math.PI * 2);
          ctx.fill();

          drip.y += drip.speed;
          if (drip.y > canvas.height + 50) {
            drip.y = -20;
            drip.x = Math.random() * canvas.width;
          }
        });
      }
      animFrame = requestAnimationFrame(animateDrips);
    };
    animateDrips();

    return () => {
      window.removeEventListener('resize', resize);
      clearInterval(fogInterval);
      cancelAnimationFrame(animFrame);
    };
  }, [initFog, isWipedClean]);

  const erase = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';

    // Outer smooth wipe radius
    const gradient = ctx.createRadialGradient(x, y, 15, x, y, 60);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
    gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.8)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, 60, 0, Math.PI * 2);
    ctx.fill();

    if (!wipeTriggeredRef.current && onWipe) {
      wipeTriggeredRef.current = true;
      onWipe();
      setTimeout(() => {
        wipeTriggeredRef.current = false;
      }, 6000);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    isDrawingRef.current = true;
    erase(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawingRef.current) return;
    erase(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
  };

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`absolute inset-0 size-full z-15 pointer-events-auto cursor-crosshair transition-opacity duration-500 ${
        isWipedClean ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      title="Drag to wipe window steam"
    />
  );
};

