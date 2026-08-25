import React from 'react';
import { X, CloudRain, RotateCw, Zap, Gamepad2, Volume2, VolumeX, Sparkles } from 'lucide-react';
import type { AmbientMixerState } from '../types';
import { audioSynth } from '../utils/audioSynth';

interface AmbientMixerModalProps {
  isOpen: boolean;
  onClose: () => void;
  ambientState: AmbientMixerState;
  setChannelVolume: (channel: keyof Omit<AmbientMixerState, 'isMuted'>, val: number) => void;
  toggleMute: () => void;
}

export const AmbientMixerModal: React.FC<AmbientMixerModalProps> = ({
  isOpen,
  onClose,
  ambientState,
  setChannelVolume,
  toggleMute,
}) => {
  if (!isOpen) return null;

  const applyPreset = (dryer: number, rain: number, neon: number, arcade: number) => {
    audioSynth.playButtonBeep();
    setChannelVolume('dryerVolume', dryer);
    setChannelVolume('rainVolume', rain);
    setChannelVolume('neonVolume', neon);
    setChannelVolume('arcadeVolume', arcade);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="arcade-glass w-full max-w-md rounded-3xl p-5 sm:p-6 border border-[#00f0ff]/40 shadow-[0_0_40px_rgba(0,240,255,0.25)] flex flex-col gap-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30">
              <CloudRain className="size-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-['Outfit']">
                Ambient Sound Studio
              </h2>
              <p className="text-xs text-[#00f0ff] font-mono">
                1994 Environmental Foley Synthesizer
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Ambient Channel Sliders */}
        <div className="space-y-4">
          
          {/* 1. Industrial Dryer */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-semibold text-white">
              <span className="flex items-center gap-2">
                <RotateCw className="size-4 text-[#ff2a8d] animate-spin" style={{ animationDuration: '6s' }} />
                <span>Dryer Drum & Tumbling Clothes</span>
              </span>
              <span className="font-mono text-[0.7rem] text-[#ff2a8d] tabular-nums">
                {Math.round(ambientState.dryerVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={ambientState.dryerVolume}
              onChange={(e) => setChannelVolume('dryerVolume', Number(e.target.value))}
              className="retro-slider w-full"
            />
          </div>

          {/* 2. Midnight Rain */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-semibold text-white">
              <span className="flex items-center gap-2">
                <CloudRain className="size-4 text-[#00f0ff]" />
                <span>Midnight Rain on Glass</span>
              </span>
              <span className="font-mono text-[0.7rem] text-[#00f0ff] tabular-nums">
                {Math.round(ambientState.rainVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={ambientState.rainVolume}
              onChange={(e) => setChannelVolume('rainVolume', Number(e.target.value))}
              className="retro-slider w-full"
            />
          </div>

          {/* 3. Neon 60Hz Transformer Hum */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-semibold text-white">
              <span className="flex items-center gap-2">
                <Zap className="size-4 text-[#ffb800]" />
                <span>60Hz Neon Buzz & Ceiling Fan</span>
              </span>
              <span className="font-mono text-[0.7rem] text-[#ffb800] tabular-nums">
                {Math.round(ambientState.neonVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={ambientState.neonVolume}
              onChange={(e) => setChannelVolume('neonVolume', Number(e.target.value))}
              className="retro-slider w-full"
            />
          </div>

          {/* 4. Arcade Attract Mode */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-semibold text-white">
              <span className="flex items-center gap-2">
                <Gamepad2 className="size-4 text-[#39ff14]" />
                <span>Arcade Cabinet Blips & Chatter</span>
              </span>
              <span className="font-mono text-[0.7rem] text-[#39ff14] tabular-nums">
                {Math.round(ambientState.arcadeVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={ambientState.arcadeVolume}
              onChange={(e) => setChannelVolume('arcadeVolume', Number(e.target.value))}
              className="retro-slider w-full"
            />
          </div>

        </div>

        {/* Atmosphere Presets */}
        <div className="pt-2 border-t border-white/10">
          <p className="text-[0.65rem] font-mono text-white/50 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Sparkles className="size-3 text-[#ff2a8d]" /> Quick Vibe Presets
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => applyPreset(0.8, 0.4, 0.2, 0.1)}
              className="py-1.5 px-2 rounded-xl bg-[#231838] hover:bg-[#ff2a8d]/30 border border-white/10 text-white font-medium transition-colors"
            >
              Heavy Laundry
            </button>
            <button
              onClick={() => applyPreset(0.2, 0.9, 0.3, 0.2)}
              className="py-1.5 px-2 rounded-xl bg-[#231838] hover:bg-[#00f0ff]/30 border border-white/10 text-white font-medium transition-colors"
            >
              Typhoon Night
            </button>
            <button
              onClick={() => applyPreset(0.3, 0.2, 0.4, 0.9)}
              className="py-1.5 px-2 rounded-xl bg-[#231838] hover:bg-[#39ff14]/30 border border-white/10 text-white font-medium transition-colors"
            >
              Arcade Rush
            </button>
          </div>
        </div>

        {/* Footer: Master Ambient Mute */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={toggleMute}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
              ambientState.isMuted
                ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                : 'bg-white/10 border-white/10 text-white hover:bg-white/20'
            }`}
          >
            {ambientState.isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            <span>{ambientState.isMuted ? 'Ambient Muted' : 'Mute All Ambient'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#00f0ff] font-bold text-black text-xs hover:bg-[#00f0ff]/80 transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
