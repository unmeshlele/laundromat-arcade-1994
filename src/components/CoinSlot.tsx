import React, { useState } from 'react';
import { X, Sparkles, Award, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { CoinToken } from '../types';
import { audioSynth } from '../utils/audioSynth';

interface CoinSlotProps {
  isOpen: boolean;
  onClose: () => void;
  onCoinInserted: (token: CoinToken) => void;
}

const RARITIES: CoinToken['rarity'][] = ['Common Brass', 'Shiny Chrome', 'Cyberpunk Gold', 'Neo-Geo Holo'];

export const CoinSlot: React.FC<CoinSlotProps> = ({ isOpen, onClose, onCoinInserted }) => {
  const [issuedToken, setIssuedToken] = useState<CoinToken | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isInserting, setIsInserting] = useState(false);

  if (!isOpen) return null;

  const handleDropCoin = () => {
    if (isInserting) return;
    setIsInserting(true);
    audioSynth.playCoinSound();

    // Fire Confetti
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff2a8d', '#00f0ff', '#ffb800', '#39ff14'],
    });

    setTimeout(() => {
      const randomRarity = RARITIES[Math.floor(Math.random() * RARITIES.length)];
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const token: CoinToken = {
        tokenNumber: `HK94-${randomNum}`,
        issuedAt: new Date().toLocaleTimeString(),
        rarity: randomRarity,
      };
      setIssuedToken(token);
      setIsInserting(false);
      onCoinInserted(token);
    }, 400);
  };

  const copyToken = () => {
    if (!issuedToken) return;
    navigator.clipboard.writeText(`I am listening to Neon Coin Laundromat & Arcade '94 with ${issuedToken.rarity} Token #${issuedToken.tokenNumber}! 🕹️🧺`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="arcade-glass w-full max-w-sm rounded-3xl p-6 border-2 border-[#ff2a8d] shadow-[0_0_50px_rgba(255,42,141,0.35)] flex flex-col items-center text-center gap-5">
        
        {/* Close Button */}
        <div className="w-full flex justify-end -mr-2 -mt-2">
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Physical Coin Slot Illustration */}
        <div className="flex flex-col items-center gap-2">
          <div className="size-20 rounded-full bg-gradient-to-br from-[#ffd166] via-[#f77f00] to-[#d62828] p-1 shadow-[0_0_25px_rgba(247,127,0,0.6)] flex items-center justify-center animate-bounce">
            <span className="font-['Press_Start_2P'] text-xl text-black font-bold">
              $5
            </span>
          </div>
          <h2 className="text-xl font-bold text-white font-['Outfit']">
            Insert 1994 Token
          </h2>
          <p className="text-xs text-white/70">
            Drop a virtual HK$5 or ₩500 coin into the arcade slot to claim your commemorative seat token!
          </p>
        </div>

        {/* Insert Coin Action Button */}
        {!issuedToken ? (
          <button
            onClick={handleDropCoin}
            disabled={isInserting}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#ff2a8d] via-[#aa3bff] to-[#00f0ff] font-extrabold text-white text-sm shadow-[0_0_25px_rgba(255,42,141,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="size-4" />
            <span>{isInserting ? 'DROPPING COIN…' : 'CLICK TO INSERT COIN (投幣)'}</span>
          </button>
        ) : (
          /* Issued Token Card */
          <div className="w-full bg-[#1c1430] p-4 rounded-2xl border border-[#ffb800]/50 shadow-lg flex flex-col items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#ffb800]">
              <Award className="size-4" />
              <span>COLLECTIBLE LISTENER TOKEN</span>
            </div>

            <div className="font-['Press_Start_2P'] text-lg text-white tracking-wider my-1 text-[#00f0ff]">
              {issuedToken.tokenNumber}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-[#ff2a8d]/20 text-[#ff2a8d] font-bold border border-[#ff2a8d]/40">
                {issuedToken.rarity}
              </span>
              <span className="text-white/40 font-mono text-[0.7rem]">{issuedToken.issuedAt}</span>
            </div>

            <div className="w-full flex gap-2 mt-2">
              <button
                onClick={copyToken}
                className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
              >
                {isCopied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                <span>{isCopied ? 'Copied!' : 'Copy Token'}</span>
              </button>
              <button
                onClick={handleDropCoin}
                className="py-2 px-3 rounded-xl bg-[#ff2a8d]/20 hover:bg-[#ff2a8d]/40 text-xs font-semibold text-[#ff2a8d] transition-colors"
              >
                Another Coin
              </button>
            </div>
          </div>
        )}

        <div className="text-[0.65rem] font-mono text-white/40">
          STREET FIGHTER II · KOF '94 · 1 CREDIT = 3 ROUNDS
        </div>

      </div>
    </div>
  );
};
