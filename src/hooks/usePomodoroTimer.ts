import { useState, useEffect, useCallback } from 'react';
import { audioSynth } from '../utils/audioSynth';

export type CycleMode = 'quick' | 'deep' | 'rinse';

export const CYCLES: Record<CycleMode, { name: string; native: string; minutes: number; color: string }> = {
  quick: { name: '25-Min Quick Wash', native: '快速洗滌 (Focus)', minutes: 25, color: '#ff2a8d' },
  deep: { name: '45-Min Heavy Spin', native: '強效脫水 (Deep Work)', minutes: 45, color: '#00f0ff' },
  rinse: { name: '5-Min Rinse Break', native: '過水放鬆 (Break)', minutes: 5, color: '#39ff14' },
};

export function usePomodoroTimer() {
  const [selectedCycle, setSelectedCycle] = useState<CycleMode>('quick');
  const [secondsRemaining, setSecondsRemaining] = useState(CYCLES.quick.minutes * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: number | null = null;
    if (isRunning && secondsRemaining > 0) {
      interval = window.setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            audioSynth.playWasherBuzzer();
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, secondsRemaining]);

  const selectCycle = useCallback((mode: CycleMode) => {
    audioSynth.playButtonBeep();
    setSelectedCycle(mode);
    setIsRunning(false);
    setSecondsRemaining(CYCLES[mode].minutes * 60);
  }, []);

  const toggleRunning = useCallback(() => {
    audioSynth.playButtonBeep();
    setIsRunning((prev) => !prev);
  }, []);

  const resetTimer = useCallback(() => {
    audioSynth.playButtonBeep();
    setIsRunning(false);
    setSecondsRemaining(CYCLES[selectedCycle].minutes * 60);
  }, [selectedCycle]);

  const totalSeconds = CYCLES[selectedCycle].minutes * 60;
  const progressPercent = ((totalSeconds - secondsRemaining) / totalSeconds) * 100;
  const m = Math.floor(secondsRemaining / 60);
  const s = secondsRemaining % 60;
  const timeFormatted = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  const isTimerActive = isRunning || secondsRemaining < totalSeconds;

  return {
    selectedCycle,
    secondsRemaining,
    isRunning,
    timeFormatted,
    progressPercent,
    isTimerActive,
    selectCycle,
    toggleRunning,
    resetTimer,
  };
}
