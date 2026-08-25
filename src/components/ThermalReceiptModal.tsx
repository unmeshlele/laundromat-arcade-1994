import React, { useState, useRef } from 'react';
import { X, Copy, Check, Download, Receipt, Sparkles } from 'lucide-react';
import type { Song, Rotation, CoinToken } from '../types';
import { audioSynth } from '../utils/audioSynth';

interface ThermalReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSong: Song;
  activeRotation: Rotation;
  timeStr: string;
  timeZone: string;
  onlineCount: number;
  token: CoinToken | null;
}

export const ThermalReceiptModal: React.FC<ThermalReceiptModalProps> = ({
  isOpen,
  onClose,
  currentSong,
  activeRotation,
  timeStr,
  timeZone,
  onlineCount,
  token,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const receiptRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen) return null;

  const dateStr = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const receiptText = `
╔══════════════════════════════════════════╗
║      NEON COIN LAUNDRY & ARCADE '94      ║
║        深夜洗衣·街機 (HONG KONG / SEOUL)       ║
╠══════════════════════════════════════════╣
║ DATE: ${dateStr} · ${timeStr} (${timeZone})     ║
║ SEAT TOKEN: ${token ? `${token.tokenNumber} [${token.rarity}]` : '#HK94-COMMUNITY'}
║ CURRENT TRACK: ${currentSong.titleEn} (${currentSong.titleNative})
║ ARTIST: ${currentSong.artistEn} (${currentSong.year})
║ ROTATION: ${activeRotation.nameEn} (${activeRotation.window})
║ NIGHT-OWLS PRESENT: ${onlineCount} LISTENING
║ STORE STATUS: 24/7 OPEN · RAIN OUTSIDE   ║
╚══════════════════════════════════════════╝
`.trim();

  const handleCopy = () => {
    audioSynth.playButtonBeep();
    navigator.clipboard.writeText(receiptText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    audioSynth.playButtonBeep();
    // Render text to canvas and download PNG
    const canvas = document.createElement('canvas');
    canvas.width = 440;
    canvas.height = 560;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Vintage paper background
    ctx.fillStyle = '#f4eedb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Thermal ink text
    ctx.fillStyle = '#1c1b18';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('*** NEON COIN LAUNDROMAT ***', 220, 45);
    ctx.font = '13px monospace';
    ctx.fillText('深夜洗衣·街機 1994 (24H OPEN)', 220, 70);
    ctx.fillText('--------------------------------------', 220, 95);

    ctx.textAlign = 'left';
    ctx.font = '12px monospace';
    let y = 130;
    const lines = [
      `DATE: ${dateStr}`,
      `TIME: ${timeStr} (${timeZone})`,
      `TOKEN: ${token ? `${token.tokenNumber} [${token.rarity}]` : 'GUEST #1994'}`,
      `TRACK: ${currentSong.titleEn}`,
      `ARTIST: ${currentSong.artistEn} (${currentSong.year})`,
      `ROTATION: ${activeRotation.nameEn}`,
      `DRYER: SPEED QUEEN #2 (SPINNING)`,
      `NIGHT-OWLS: ${onlineCount} in laundromat`,
    ];

    lines.forEach((l) => {
      ctx.fillText(l, 30, y);
      y += 26;
    });

    ctx.textAlign = 'center';
    ctx.fillText('--------------------------------------', 220, y + 10);
    ctx.font = '24px monospace';
    ctx.fillText('||| | |||| || ||||| |||', 220, y + 45);
    ctx.font = '11px monospace';
    ctx.fillText('THANK YOU FOR WASHING & PLAYING', 220, y + 80);
    ctx.fillText('KEEP YOUR MEMORIES WARM · 1994', 220, y + 100);

    const a = document.createElement('a');
    a.download = `laundromat-receipt-${dateStr}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="arcade-glass w-full max-w-sm rounded-3xl p-6 border-2 border-[#ffb800]/50 shadow-[0_0_50px_rgba(255,184,0,0.25)] flex flex-col items-center text-center gap-4">
        
        {/* Header */}
        <div className="w-full flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-[#ffb800]/10 text-[#ffb800]">
              <Receipt className="size-4" />
            </div>
            <div className="text-left">
              <h2 className="text-sm font-bold text-white font-['Outfit']">
                1994 Thermal Receipt
              </h2>
              <p className="text-[0.65rem] text-[#ffb800] font-mono">
                Souvenir Cash Register Printout
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Vintage Paper Receipt Preview Card */}
        <div
          ref={receiptRef}
          className="w-full bg-[#f4eedb] text-[#1c1b18] p-4 rounded-xl shadow-2xl font-mono text-left text-xs border border-amber-900/20 relative overflow-hidden"
        >
          {/* Top Zig-zag paper tear graphic */}
          <div className="text-center font-bold text-xs tracking-wider mb-2">
            *** NEON LAUNDROMAT '94 ***
            <div className="text-[0.65rem] font-normal text-stone-700">深夜洗衣·街機 (24H OPEN)</div>
          </div>
          <div className="border-b border-dashed border-stone-600 my-2" />

          <div className="space-y-1.5 text-[0.7rem]">
            <div className="flex justify-between">
              <span className="text-stone-600">DATE:</span>
              <span className="font-bold">{dateStr} {timeStr}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600">TOKEN:</span>
              <span className="font-bold text-[#b7094c]">{token ? token.tokenNumber : '#HK94-GUEST'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600">TRACK:</span>
              <span className="font-bold truncate max-w-[170px]">{currentSong.titleEn}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600">ARTIST:</span>
              <span className="truncate max-w-[170px]">{currentSong.artistEn} ({currentSong.year})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600">ROTATION:</span>
              <span>{activeRotation.nameEn}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600">NIGHT-OWLS:</span>
              <span>{onlineCount} listening</span>
            </div>
          </div>

          <div className="border-b border-dashed border-stone-600 my-3" />

          {/* Barcode & Footer */}
          <div className="text-center">
            <div className="tracking-[0.25em] text-sm font-bold opacity-80">
              |||| ||| ||||| || |||
            </div>
            <div className="text-[0.6rem] text-stone-600 mt-1">
              THANK YOU FOR WASHING & PLAYING · 1994
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 w-full mt-1">
          <button
            onClick={handleCopy}
            className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            {isCopied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
            <span>{isCopied ? 'Copied ASCII' : 'Copy ASCII'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#ffb800] to-[#f77f00] text-black font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md hover:scale-105 transition-all cursor-pointer"
          >
            <Download className="size-3.5" />
            <span>Save as PNG</span>
          </button>
        </div>

        <div className="text-[0.6rem] font-mono text-white/40 flex items-center gap-1">
          <Sparkles className="size-3 text-[#ff2a8d]" /> Perfect format for Instagram Stories & Twitter
        </div>

      </div>
    </div>
  );
};
