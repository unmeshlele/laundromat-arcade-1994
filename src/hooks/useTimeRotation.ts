import { useState, useEffect, useMemo } from 'react';
import { ROTATIONS } from '../data/rotations';
import type { Rotation } from '../types';

export function useTimeRotation() {
  const [selectedRotationId, setSelectedRotationId] = useState<string | null>(null);
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  const [timeZoneName, setTimeZoneName] = useState<'HKT' | 'KST'>('HKT');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Calculate Hong Kong Time (UTC+8) and Korea Time (UTC+9)
      const hktOffset = 8 * 60; // minutes
      const userOffset = now.getTimezoneOffset(); // in minutes (inverted)
      const hktDate = new Date(now.getTime() + (userOffset + hktOffset) * 60000);

      const hours = hktDate.getHours();
      const minutes = hktDate.getMinutes();
      const seconds = hktDate.getSeconds();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      const displayMinutes = minutes.toString().padStart(2, '0');
      const displaySeconds = seconds.toString().padStart(2, '0');

      setCurrentTimeStr(`${displayHours}:${displayMinutes}:${displaySeconds} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate current natural rotation according to HKT (UTC+8)
  const currentNaturalRotation = useMemo(() => {
    const now = new Date();
    const hktOffset = 8 * 60;
    const userOffset = now.getTimezoneOffset();
    const hktDate = new Date(now.getTime() + (userOffset + hktOffset) * 60000);
    const hour = hktDate.getHours();

    if (hour >= 23 || hour < 5) {
      return ROTATIONS.find((r) => r.id === 'chungking-midnight') || ROTATIONS[0];
    } else if (hour >= 5 && hour < 11) {
      return ROTATIONS.find((r) => r.id === 'morning-rinse') || ROTATIONS[1];
    } else if (hour >= 11 && hour < 18) {
      return ROTATIONS.find((r) => r.id === 'coin-op-rush') || ROTATIONS[2];
    } else {
      return ROTATIONS.find((r) => r.id === 'detergent-dreams') || ROTATIONS[3];
    }
  }, []);

  const activeRotation: Rotation = useMemo(() => {
    if (selectedRotationId) {
      const found = ROTATIONS.find((r) => r.id === selectedRotationId);
      if (found) return found;
    }
    return currentNaturalRotation;
  }, [selectedRotationId, currentNaturalRotation]);

  return {
    currentTimeStr,
    timeZoneName,
    setTimeZoneName,
    currentNaturalRotation,
    activeRotation,
    isManualOverride: !!selectedRotationId,
    selectRotation: (id: string | null) => setSelectedRotationId(id),
    allRotations: ROTATIONS,
  };
}
