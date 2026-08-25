import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { VENDING_DRINKS } from '../data/songs';
import { audioSynth } from '../utils/audioSynth';

interface VendingMachineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDrinkBought: (drinkName: string) => void;
}

export const VendingMachineModal: React.FC<VendingMachineModalProps> = ({
  isOpen,
  onClose,
  onDrinkBought,
}) => {
  const [dispensedDrink, setDispensedDrink] = useState<typeof VENDING_DRINKS[number] | null>(null);

  if (!isOpen) return null;

  const handleBuyDrink = (drink: typeof VENDING_DRINKS[number]) => {
    audioSynth.playVendingDrinkDrop();
    setDispensedDrink(drink);
    onDrinkBought(drink.nameEn);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="arcade-glass w-full max-w-sm rounded-3xl p-6 border-2 border-[#00b4d8] shadow-[0_0_40px_rgba(0,180,216,0.3)] flex flex-col gap-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white font-['Outfit']">
              Vintage Corner Vending
            </h2>
            <p className="text-xs text-[#00b4d8] font-mono">
              Chilled Beverages · 1994 Auto-Dispenser
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Cans Grid */}
        <div className="grid grid-cols-2 gap-3">
          {VENDING_DRINKS.map((drink) => (
            <button
              key={drink.id}
              onClick={() => handleBuyDrink(drink)}
              className="p-3 rounded-2xl bg-[#131d2e] border border-white/10 hover:border-[#00b4d8] hover:scale-105 transition-all text-left flex flex-col justify-between group shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{drink.icon}</span>
                <span className="font-mono text-[0.65rem] text-[#39ff14] font-bold">HK$6</span>
              </div>
              <div className="mt-2">
                <p className="font-bold text-xs text-white truncate group-hover:text-[#00b4d8]">
                  {drink.nameEn}
                </p>
                <p className="text-[0.65rem] text-white/60 truncate">
                  {drink.nameNative}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Dispensed Can Animation Card */}
        {dispensedDrink && (
          <div className="p-3 rounded-2xl bg-gradient-to-r from-[#102a43] to-[#1e3a5f] border border-[#00b4d8]/60 flex items-center gap-3 animate-bounce">
            <span className="text-3xl">{dispensedDrink.icon}</span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#90e0ef]">
                Dispensed: {dispensedDrink.nameEn}
              </p>
              <p className="text-[0.65rem] text-white/70">
                {dispensedDrink.description}
              </p>
            </div>
          </div>
        )}

        <div className="text-center font-mono text-[0.65rem] text-white/40 pt-1 flex items-center justify-center gap-1">
          <Sparkles className="size-3 text-[#ffbe0b]" /> PUSH THE FLAP TO COLLECT YOUR CAN
        </div>

      </div>
    </div>
  );
};
