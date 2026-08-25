import { useState, useEffect, useCallback } from 'react';
import type { AmbientMixerState } from '../types';
import { audioSynth } from '../utils/audioSynth';

const STORAGE_KEY = 'neon-laundromat-ambient-state';

export function useAmbientMixer() {
  const [ambientState, setAmbientState] = useState<AmbientMixerState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return {
      dryerVolume: 0.15,
      rainVolume: 0.20,
      neonVolume: 0.08,
      arcadeVolume: 0.12,
      isMuted: false,
    };
  });

  const [hasStartedAudio, setHasStartedAudio] = useState(false);

  // Sync with Web Audio Synth
  useEffect(() => {
    if (hasStartedAudio) {
      audioSynth.setDryerVolume(ambientState.dryerVolume);
      audioSynth.setRainVolume(ambientState.rainVolume);
      audioSynth.setNeonVolume(ambientState.neonVolume);
      audioSynth.setArcadeVolume(ambientState.arcadeVolume);
      audioSynth.setMasterMute(ambientState.isMuted);
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ambientState));
    } catch {
      // ignore
    }
  }, [ambientState, hasStartedAudio]);

  const startAmbientAudio = useCallback(() => {
    audioSynth.init();
    audioSynth.resume();
    audioSynth.setDryerVolume(ambientState.dryerVolume);
    audioSynth.setRainVolume(ambientState.rainVolume);
    audioSynth.setNeonVolume(ambientState.neonVolume);
    audioSynth.setArcadeVolume(ambientState.arcadeVolume);
    audioSynth.setMasterMute(ambientState.isMuted);
    setHasStartedAudio(true);
  }, [ambientState]);

  const setChannelVolume = useCallback((channel: keyof Omit<AmbientMixerState, 'isMuted'>, value: number) => {
    if (!hasStartedAudio) {
      startAmbientAudio();
    }
    setAmbientState((prev) => ({
      ...prev,
      [channel]: Math.max(0, Math.min(1, value)),
    }));
  }, [hasStartedAudio, startAmbientAudio]);

  const toggleMute = useCallback(() => {
    if (!hasStartedAudio) {
      startAmbientAudio();
    }
    setAmbientState((prev) => ({
      ...prev,
      isMuted: !prev.isMuted,
    }));
  }, [hasStartedAudio, startAmbientAudio]);

  return {
    ambientState,
    hasStartedAudio,
    startAmbientAudio,
    setChannelVolume,
    toggleMute,
  };
}
