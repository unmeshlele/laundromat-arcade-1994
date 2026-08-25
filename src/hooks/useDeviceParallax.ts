import { useState, useEffect } from 'react';

export function useDeviceParallax() {
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    let hasGyroscope = false;

    // Mobile / Tablet Gyroscope Motion Handler
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;
      hasGyroscope = true;

      // gamma: left-to-right tilt (-90 to 90)
      // beta: front-to-back tilt (-180 to 180, normal viewing is ~45deg)
      const maxTilt = 22;
      const targetX = Math.max(-maxTilt, Math.min(maxTilt, -(e.gamma * 0.7)));
      const targetY = Math.max(-maxTilt, Math.min(maxTilt, -((e.beta - 45) * 0.5)));

      setOffset({ x: targetX, y: targetY });
    };

    // Desktop Subtle Mouse Parallax Fallback
    const handleMouseMove = (e: MouseEvent) => {
      if (hasGyroscope) return;
      const maxMove = 14;
      const x = ((e.clientX / window.innerWidth) - 0.5) * -maxMove * 2;
      const y = ((e.clientY / window.innerHeight) - 0.5) * -maxMove * 2;
      setOffset({ x, y });
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return offset;
}
