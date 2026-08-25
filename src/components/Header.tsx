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
    <header className="relative z-30 w-full px-2.5 pt-3 sm:px-8 sm:pt-6 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
      {/* Left: Time & Timezone Switcher + Online Badge */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={() => setTimeZone(timeZone === 'HKT' ? 'KST' : 'HKT')}
          className="px-2.5 py-1 sm:px-3 rounded-full bg-black/60 backdrop-blur-md border border-white/15 hover:border-[#00f0ff]/50 font-mono text-[0.7rem] sm:text-xs text-white/90 transition-all flex items-center gap-1 cursor-pointer shadow-sm active:scale-95"
          title="Toggle Hong Kong / Seoul time"
        >
          <span className="text-[#00f0ff] font-bold">{timeZone}</span>
          <span className="tabular-nums tracking-wider">{timeStr}</span>
        </button>

        {/* Live Listeners Presence Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 rounded-full bg-black/60 backdrop-blur-md border border-emerald-500/30 text-[0.7rem] sm:text-xs shadow-sm">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-70"></span>
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
          </span>
          <span className="font-semibold tabular-nums text-white">{onlineCount}</span>
          <span className="text-white/60 hidden xs:inline">online</span>
        </div>
      </div>

      {/* Right: Clean Chips (Timer, Guestbook, Receipt, Mixer & Rotations) */}
      <nav className="flex items-center gap-1 sm:gap-2">
        {/* Live / Persistent Pomodoro Timer Chip */}
        <button
          onClick={onOpenPomodoro}
          className={`px-2.5 py-1 sm:px-3 rounded-full backdrop-blur-md border transition-all text-[0.7rem] sm:text-xs font-medium cursor-pointer shadow-sm flex items-center gap-1 active:scale-95 ${
            isTimerActive
              ? 'bg-[#00f0ff]/20 border-[#00f0ff] text-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.4)] animate-pulse'
              : 'bg-black/60 hover:bg-black/80 border-white/15 hover:border-[#00f0ff] text-white/90 hover:text-white'
          }`}
          title={isTimerActive ? 'Click to expand live wash cycle timer' : '25-min Wash Cycle Focus Timer'}
        >
          <span className={isTimerRunning ? 'animate-spin' : ''}>⏱️</span>
          <span className="font-mono font-bold">
            {isTimerActive ? timerTimeFormatted : <span className="hidden xs:inline">Timer</span>}
          </span>
        </button>

        {/* The Lost Sock Guestbook Chip */}
        <button
          onClick={onOpenBoard}
          className="px-2.5 py-1 sm:px-3 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 hover:border-amber-400 text-white/90 hover:text-white transition-all text-[0.7rem] sm:text-xs font-medium cursor-pointer shadow-sm flex items-center gap-1 active:scale-95"
          title="Open the Lost Sock Community Guestbook"
        >
          <span>📌</span>
          <span className="hidden sm:inline">Guestbook</span>
        </button>

        {/* Receipt Souvenir */}
        <button
          onClick={onOpenReceipt}
          className="px-2.5 py-1 sm:px-3 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 hover:border-[#ffb800] text-white/90 hover:text-white transition-all text-[0.7rem] sm:text-xs font-medium cursor-pointer shadow-sm flex items-center gap-1 hidden md:inline-flex active:scale-95"
          title="Print 1994 Thermal Receipt Souvenir"
        >
          <span>📜</span>
          <span>Receipt</span>
        </button>

        {/* Rotations */}
        <button
          onClick={onOpenPlaylists}
          className="px-2.5 py-1 sm:px-3 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 hover:border-[#ff2a8d] text-white/90 hover:text-white transition-all text-[0.7rem] sm:text-xs font-medium cursor-pointer shadow-sm active:scale-95"
        >
          <span className="sm:hidden">📻</span>
          <span className="hidden sm:inline">Rotations</span>
        </button>

        {/* Ambience Mixer */}
        <button
          onClick={onOpenMixer}
          className="px-2.5 py-1 sm:px-3 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 hover:border-white text-white/90 hover:text-white transition-all text-[0.7rem] sm:text-xs font-medium cursor-pointer shadow-sm active:scale-95"
        >
          <span className="sm:hidden">🎚️</span>
          <span className="hidden sm:inline">Ambience</span>
        </button>
      </nav>
    </header>
  );
};



