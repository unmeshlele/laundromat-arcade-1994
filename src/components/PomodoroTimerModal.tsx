import React from 'react';
import { X, Play, Pause, RotateCcw, Timer, Sparkles } from 'lucide-react';
import { CYCLES, type CycleMode } from '../hooks/usePomodoroTimer';

interface PomodoroTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCycle: CycleMode;
  secondsRemaining: number;
  isRunning: boolean;
  timeFormatted: string;
  progressPercent: number;
  onSelectCycle: (mode: CycleMode) => void;
  onToggleRunning: () => void;
  onResetTimer: () => void;
}

export const PomodoroTimerModal: React.FC<PomodoroTimerModalProps> = ({
  isOpen,
  onClose,
  selectedCycle,
  isRunning,
  timeFormatted,
  progressPercent,
  onSelectCycle,
  onToggleRunning,
  onResetTimer,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="arcade-glass w-full max-w-sm rounded-3xl p-6 border-2 border-[#00f0ff]/50 shadow-[0_0_50px_rgba(0,240,255,0.25)] flex flex-col items-center text-center gap-5">
        
        {/* Header */}
        <div className="w-full flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-[#00f0ff]/10 text-[#00f0ff]">
              <Timer className="size-4" />
            </div>
            <div className="text-left">
              <h2 className="text-sm font-bold text-white font-['Outfit']">
                Wash Cycle Timer
              </h2>
              <p className="text-[0.65rem] text-[#00f0ff] font-mono">
                1994 Pomodoro Focus Clock
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Minimize to screen"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-3 gap-1.5 w-full bg-[#120d22] p-1.5 rounded-2xl border border-white/5">
          {(Object.keys(CYCLES) as CycleMode[]).map((mode) => {
            const isSelected = selectedCycle === mode;
            return (
              <button
                key={mode}
                onClick={() => onSelectCycle(mode)}
                className={`py-2 px-1 rounded-xl text-[0.65rem] font-bold transition-all truncate cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#ff2a8d] to-[#aa3bff] text-white shadow-md'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {CYCLES[mode].minutes}m Cycle
              </button>
            );
          })}
        </div>

        {/* Circular Countdown Dial */}
        <div className="relative size-44 rounded-full bg-gradient-to-b from-[#18112c] to-[#0c0818] border-4 border-[#2b2148] flex flex-col items-center justify-center shadow-[inset_0_0_25px_rgba(0,0,0,0.8)]">
          {/* Progress Ring Glow */}
          <svg className="absolute inset-0 size-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-white/10 fill-none"
              strokeWidth="4"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              className="fill-none transition-all duration-500"
              stroke={CYCLES[selectedCycle].color}
              strokeWidth="4"
              strokeDasharray="276"
              strokeDashoffset={276 - (276 * progressPercent) / 100}
              strokeLinecap="round"
            />
          </svg>

          {/* 7-Segment Digital Clock Output */}
          <div className="font-['Press_Start_2P'] text-2xl text-[#00f0ff] tracking-wider drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]">
            {timeFormatted}
          </div>

          <div className="text-[0.65rem] font-mono text-white/60 mt-2">
            {CYCLES[selectedCycle].native}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={onToggleRunning}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#00f0ff] to-[#0077b6] text-black font-extrabold text-xs shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isRunning ? <Pause className="size-4 fill-current" /> : <Play className="size-4 fill-current ml-0.5" />}
            <span>{isRunning ? 'PAUSE CYCLE' : 'START CYCLE'}</span>
          </button>

          <button
            onClick={onResetTimer}
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Reset Cycle"
          >
            <RotateCcw className="size-4" />
          </button>
        </div>

        <div className="text-[0.6rem] font-mono text-white/40 flex items-center gap-1">
          <Sparkles className="size-3 text-[#ffb800]" /> Buzzer rings when the spin cycle finishes
        </div>

      </div>
    </div>
  );
};

