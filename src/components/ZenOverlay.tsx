import React from 'react';
import { EyeOff, Radio } from 'lucide-react';
import type { Song, Rotation } from '../types';

interface ZenOverlayProps {
  isActive: boolean;
  onExit: () => void;
  timeStr: string;
  timeZone: string;
  currentSong: Song;
  activeRotation: Rotation;
  onlineCount: number;
}

export const ZenOverlay: React.FC<ZenOverlayProps> = ({
  isActive,
  onExit,
  timeStr,
  timeZone,
  currentSong,
  activeRotation,
  onlineCount,
}) => {
  if (!isActive) return null;

  return (
    <div
      onClick={onExit}
      className="fixed inset-0 z-50 pointer-events-auto cursor-pointer flex flex-col justify-between p-6 sm:p-10 select-none bg-black/10 backdrop-blur-[1px] animate-in fade-in duration-500"
      title="Click anywhere or press Z / Space to exit Zen Mode"
    >
      {/* Top Floating Time & Atmosphere */}
      <div className="flex items-center justify-between text-xs font-mono text-white/70">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#120e24]/70 border border-white/10 shadow-lg">
          <span className="text-[#00f0ff] font-bold">{timeZone}</span>
          <span className="tabular-nums font-mono text-white/90 text-sm font-semibold">{timeStr}</span>
        </div>

        <div className="flex items-center gap-1.5 text-white/40 text-[0.65rem] hover:text-white transition-colors">
          <EyeOff className="size-3.5" />
          <span>Click anywhere to exit Zen</span>
        </div>
      </div>

      {/* Center Subtle Marquee */}
      <div className="text-center my-auto opacity-35 hover:opacity-60 transition-opacity">
        <p className="font-['Noto_Sans_TC'] text-lg sm:text-2xl font-black tracking-widest text-[#ff2a8d]">
          深夜洗衣 · 街機 1994
        </p>
        <p className="text-[0.6rem] tracking-[0.3em] uppercase text-white font-mono mt-1">
          {activeRotation.nameEn} · {onlineCount} IN LAUNDROMAT
        </p>
      </div>

      {/* Bottom Floating Minimal Track Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-[#140e26]/80 border border-white/10 text-xs shadow-xl">
          <Radio className="size-4 text-[#ff2a8d] animate-spin" style={{ animationDuration: '6s' }} />
          <div>
            <p className="font-bold text-white text-xs">
              {currentSong.titleEn} <span className="text-[#00f0ff]">({currentSong.titleNative})</span>
            </p>
            <p className="text-[0.65rem] text-white/60">
              {currentSong.artistEn} · {currentSong.year}
            </p>
          </div>
        </div>

        <div className="hidden sm:block font-mono text-[0.65rem] text-white/40">
          [PRESS 'Z' OR 'SPACE' TO RESTORE INTERFACE]
        </div>
      </div>
    </div>
  );
};
