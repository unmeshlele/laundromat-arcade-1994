import React from 'react';
import type { Rotation } from '../types';

interface HeaderProps {
  timeStr: string;
  timeZone: 'HKT' | 'KST';
  setTimeZone: (tz: 'HKT' | 'KST') => void;
  onlineCount: number;
  activeRotation: Rotation;
  onOpenMixer: () => void;
  onOpenPlaylists: () => void;
  onOpenPomodoro: () => void;
  onOpenReceipt: () => void;
  onOpenBoard: () => void;
  isTimerActive: boolean;
  timerTimeFormatted: string;
  isTimerRunning: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  timeStr,
  timeZone,
  setTimeZone,
  onlineCount,
  onOpenMixer,
  onOpenPlaylists,
  onOpenPomodoro,
  onOpenReceipt,
  onOpenBoard,
  isTimerActive,
  timerTimeFormatted,
  isTimerRunning,
}) => {
  return (
    <header className="relative z-30 w-full px-4 pt-4 sm:px-8 sm:pt-6 flex items-center justify-between gap-3 text-xs sm:text-sm">
      {/* Left: Time & Timezone Switcher */}
      <button
        onClick={() => setTimeZone(timeZone === 'HKT' ? 'KST' : 'HKT')}
        className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 hover:border-[#00f0ff]/50 font-mono text-xs text-white/90 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
        title="Toggle Hong Kong / Seoul time"
      >
        <span className="text-[#00f0ff] font-bold">{timeZone}</span>
        <span className="tabular-nums tracking-widest">{timeStr}</span>
      </button>

      {/* Center: Live Listeners Presence Badge */}
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-emerald-500/20 text-xs sm:text-sm shadow-sm">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-70"></span>
          <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
        </span>
        <span className="font-semibold tabular-nums text-white">{onlineCount}</span>
        <span className="text-white/60">online</span>
      </div>

      {/* Right: Clean Chips (Timer, Guestbook, Receipt, Mixer & Rotations) */}
      <nav className="flex items-center gap-1.5 sm:gap-2">
        {/* Live / Persistent Pomodoro Timer Chip */}
        <button
          onClick={onOpenPomodoro}
          className={`px-3 py-1 rounded-full backdrop-blur-md border transition-all text-xs font-medium cursor-pointer shadow-sm flex items-center gap-1.5 ${
            isTimerActive
              ? 'bg-[#00f0ff]/20 border-[#00f0ff] text-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.4)] animate-pulse'
              : 'bg-black/50 hover:bg-black/70 border-white/15 hover:border-[#00f0ff] text-white/90 hover:text-white'
          }`}
          title={isTimerActive ? 'Click to expand live wash cycle timer' : '25-min Wash Cycle Focus Timer'}
        >
          <span className={isTimerRunning ? 'animate-spin' : ''}>⏱️</span>
          <span className="font-mono font-bold">
            {isTimerActive ? timerTimeFormatted : 'Timer'}
          </span>
        </button>

        {/* The Lost Sock Guestbook Chip */}
        <button
          onClick={onOpenBoard}
          className="px-3 py-1 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/15 hover:border-amber-400 text-white/90 hover:text-white transition-all text-xs font-medium cursor-pointer shadow-sm flex items-center gap-1.5"
          title="Open the Lost Sock Community Guestbook"
        >
          <span>📌</span>
          <span className="hidden sm:inline">Guestbook</span>
        </button>

        {/* Receipt Souvenir */}
        <button
          onClick={onOpenReceipt}
          className="px-3 py-1 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/15 hover:border-[#ffb800] text-white/90 hover:text-white transition-all text-xs font-medium cursor-pointer shadow-sm flex items-center gap-1.5 hidden md:inline-flex"
          title="Print 1994 Thermal Receipt Souvenir"
        >
          <span>📜</span>
          <span>Receipt</span>
        </button>

        {/* Rotations */}
        <button
          onClick={onOpenPlaylists}
          className="px-3 py-1 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/15 hover:border-[#ff2a8d] text-white/90 hover:text-white transition-all text-xs font-medium cursor-pointer shadow-sm"
        >
          Rotations
        </button>

        {/* Ambience Mixer */}
        <button
          onClick={onOpenMixer}
          className="px-3 py-1 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/15 hover:border-white text-white/90 hover:text-white transition-all text-xs font-medium cursor-pointer shadow-sm"
        >
          Ambience
        </button>
      </nav>
    </header>
  );
};



