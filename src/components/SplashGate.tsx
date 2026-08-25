import React from 'react';
import { Sparkles, Disc, Radio, CloudRain } from 'lucide-react';
import { audioSynth } from '../utils/audioSynth';

interface SplashGateProps {
  onEnter: () => void;
  timeZone: string;
  timeStr: string;
}

export const SplashGate: React.FC<SplashGateProps> = ({ onEnter, timeZone, timeStr }) => {
  const handleEnterClick = () => {
    audioSynth.playDoorChime();
    onEnter();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080512] overflow-hidden select-none">
      {/* Background Distant Rainy Midnight Streets */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0e0a1e] via-[#080612] to-[#040208]">
        {/* Blurry Neon Billboards */}
        <div className="absolute top-1/4 left-10 text-6xl sm:text-8xl font-['Noto_Sans_TC'] font-black text-[#ff0055] opacity-25 blur-[4px] rotate-[-6deg] animate-pulse">
          重慶大廈
        </div>
        <div className="absolute top-1/3 right-12 text-5xl sm:text-7xl font-['Noto_Sans_KR'] font-black text-[#00f0ff] opacity-20 blur-[4px] rotate-[4deg]">
          24시 심야 빨래방
        </div>
        <div className="absolute bottom-1/4 left-1/3 text-4xl sm:text-6xl font-['Noto_Sans_TC'] font-bold text-[#ffb800] opacity-20 blur-[3px]">
          金雀茶餐廳
        </div>
        
        {/* Rainy Window Drops texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0d_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />
      </div>

      {/* Center Frosted Glass Entrance Portal */}
      <div className="relative z-10 w-full max-w-lg rounded-3xl p-6 sm:p-10 border-2 border-white/20 bg-[#150f28]/85 backdrop-blur-2xl shadow-[0_0_60px_rgba(255,42,141,0.35)] flex flex-col items-center text-center gap-6 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Vintage Neon Header */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff2a8d]/15 border border-[#ff2a8d]/40 text-[#ff2a8d] font-mono text-xs">
            <Radio className="size-3.5 animate-pulse" />
            <span className="tabular-nums font-bold">{timeZone} {timeStr}</span>
            <span>· 24H BROADCAST</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-widest font-['Noto_Sans_TC'] mt-2">
            <span className="neon-text-pink">深夜洗衣</span>
            <span className="text-white/40 mx-2 font-mono">·</span>
            <span className="neon-text-cyan">街機 1994</span>
          </h1>

          <p className="text-xs sm:text-sm text-white/70 font-['Outfit'] max-w-sm mt-1">
            Midnight Laundromat & 16-Bit Neon Arcade Radio
          </p>
        </div>

        {/* Ambient Atmosphere Tags */}
        <div className="flex flex-wrap justify-center gap-2 text-[0.7rem] font-mono text-white/60">
          <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1">
            <CloudRain className="size-3 text-[#00f0ff]" /> Rain on Glass
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1">
            <Disc className="size-3 text-[#ff2a8d]" /> 90s Cantopop & K-Pop
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1">
            <Sparkles className="size-3 text-[#ffb800]" /> Speed Queen Dryers
          </span>
        </div>

        {/* Large Cinematic "Push Door to Enter" Button */}
        <button
          onClick={handleEnterClick}
          className="group w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#ff2a8d] via-[#aa3bff] to-[#00f0ff] font-extrabold text-white text-sm sm:text-base tracking-wider shadow-[0_0_35px_rgba(255,42,141,0.6)] hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer"
        >
          <span className="text-lg group-hover:translate-x-0.5 transition-transform">🚪</span>
          <span>PUSH DOOR TO ENTER · 推門入內</span>
        </button>

        <p className="text-[0.65rem] font-mono text-white/40">
          🔊 Click to open the shop door and unlock ambient audio stream
        </p>

      </div>
    </div>
  );
};
