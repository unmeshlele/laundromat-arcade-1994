import React, { useState, useEffect } from 'react';
import { X, Send, Pin } from 'lucide-react';
import { audioSynth } from '../utils/audioSynth';

interface StickyNote {
  id: string;
  text: string;
  author: string;
  city: string;
  timeStr: string;
  color: 'yellow' | 'pink' | 'cyan';
  rotation: number;
}

const DEFAULT_NOTES: StickyNote[] = [
  {
    id: '1',
    text: 'Studying for finals at 3:15 AM while folding socks ☕',
    author: 'Min-jun',
    city: 'Seoul',
    timeStr: '03:15',
    color: 'yellow',
    rotation: -2,
  },
  {
    id: '2',
    text: 'Listening to Faye Wong from a rainy bus stop 🌧️',
    author: 'Wing-sum',
    city: 'Hong Kong',
    timeStr: '01:42',
    color: 'pink',
    rotation: 3,
  },
  {
    id: '3',
    text: 'Beat the high score on Pac-Man! Insert coin 🪙',
    author: 'Alex',
    city: 'London',
    timeStr: '23:50',
    color: 'cyan',
    rotation: -1,
  },
  {
    id: '4',
    text: 'Nothing beats the warm smell of industrial laundry detergent at night ✨',
    author: 'Chloe',
    city: 'Tokyo',
    timeStr: '02:08',
    color: 'yellow',
    rotation: 2,
  },
  {
    id: '5',
    text: 'Left a single striped sock in dryer #4. If found, please adopt it.',
    author: 'Anonymous',
    city: 'San Francisco',
    timeStr: '04:20',
    color: 'pink',
    rotation: -3,
  }
];

interface BulletinBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  userCity?: string;
}

export const BulletinBoardModal: React.FC<BulletinBoardModalProps> = ({
  isOpen,
  onClose,
  userCity = 'Anonymous',
}) => {
  const [notes, setNotes] = useState<StickyNote[]>(() => {
    const saved = localStorage.getItem('laundromat_board_notes');
    if (saved) {
      try { return JSON.parse(saved); } catch { return DEFAULT_NOTES; }
    }
    return DEFAULT_NOTES;
  });

  const [inputNote, setInputNote] = useState('');
  const [inputName, setInputName] = useState('');
  const [selectedColor, setSelectedColor] = useState<'yellow' | 'pink' | 'cyan'>('yellow');

  useEffect(() => {
    localStorage.setItem('laundromat_board_notes', JSON.stringify(notes));
  }, [notes]);

  if (!isOpen) return null;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputNote.trim()) return;

    audioSynth.playButtonBeep();
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newNote: StickyNote = {
      id: Date.now().toString(),
      text: inputNote.trim().slice(0, 120),
      author: inputName.trim() || 'Midnight Visitor',
      city: userCity || 'Laundromat',
      timeStr,
      color: selectedColor,
      rotation: Math.floor(Math.random() * 8) - 4,
    };

    setNotes((prev) => [newNote, ...prev]);
    setInputNote('');
    setInputName('');
  };

  const colorClasses = {
    yellow: 'bg-[#fef08a] text-stone-900 border-[#fde047] shadow-[0_6px_20px_rgba(254,240,138,0.25)]',
    pink: 'bg-[#fbcfe8] text-stone-900 border-[#f472b6] shadow-[0_6px_20px_rgba(244,114,182,0.25)]',
    cyan: 'bg-[#a5f3fc] text-stone-900 border-[#67e8f9] shadow-[0_6px_20px_rgba(103,232,249,0.25)]',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-3xl max-h-[85vh] rounded-3xl p-5 sm:p-7 border-2 border-amber-900/60 shadow-[0_0_60px_rgba(0,0,0,0.9)] bg-[#1e1510] flex flex-col justify-between overflow-hidden">
        
        {/* Corkboard Texture Pattern */}
        <div className="absolute inset-0 opacity-25 pointer-events-none bg-[radial-gradient(#c28251_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-amber-800/40 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🧦</span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-amber-100 font-['Outfit'] flex items-center gap-2">
                <span>The Lost Sock Bulletin Board</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-700/50 text-amber-300">
                  失物招領 · 留言板
                </span>
              </h2>
              <p className="text-xs text-amber-200/60 font-mono">
                Pin an anonymous 1-sentence note for midnight listeners worldwide
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-amber-200/60 hover:text-white hover:bg-amber-900/40 transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Notes Grid */}
        <div className="relative z-10 flex-1 overflow-y-auto my-4 pr-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 max-h-[48vh]">
          {notes.map((note) => (
            <div
              key={note.id}
              style={{ transform: `rotate(${note.rotation}deg)` }}
              className={`p-4 rounded-xl border relative font-['Outfit'] transition-transform hover:scale-105 hover:z-20 ${colorClasses[note.color]}`}
            >
              {/* Pushpin */}
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-rose-600 drop-shadow">
                <Pin className="size-4 fill-current rotate-45" />
              </div>

              <p className="text-xs font-medium leading-relaxed mt-1">
                "{note.text}"
              </p>

              <div className="mt-3 pt-2 border-t border-black/10 flex items-center justify-between text-[0.65rem] font-mono opacity-70">
                <span className="font-bold">{note.author} ({note.city})</span>
                <span>{note.timeStr}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar to Pin a New Note */}
        <form
          onSubmit={handleAddNote}
          className="relative z-10 pt-3 border-t border-amber-800/40 flex flex-col sm:flex-row items-center gap-2.5 text-xs font-mono"
        >
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Color Switcher */}
            {(['yellow', 'pink', 'cyan'] as const).map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`size-6 rounded-full border-2 transition-transform cursor-pointer ${
                  color === 'yellow' ? 'bg-yellow-300' : color === 'pink' ? 'bg-pink-300' : 'bg-cyan-300'
                } ${selectedColor === color ? 'scale-125 border-white shadow-md' : 'border-transparent opacity-60'}`}
                title={`Select ${color} note`}
              />
            ))}

            <input
              type="text"
              placeholder="Your Name (Optional)"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              className="bg-black/40 border border-amber-800/50 rounded-xl px-3 py-2 text-white placeholder-amber-200/30 text-xs outline-none focus:border-amber-400 w-36"
              maxLength={20}
            />
          </div>

          <input
            type="text"
            placeholder="Write a late-night thought... (e.g. Folding laundry at 2 AM)"
            value={inputNote}
            onChange={(e) => setInputNote(e.target.value)}
            className="flex-1 bg-black/40 border border-amber-800/50 rounded-xl px-3.5 py-2 text-white placeholder-amber-200/30 text-xs outline-none focus:border-amber-400 w-full"
            maxLength={120}
          />

          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 text-stone-950 font-bold hover:scale-105 active:scale-95 transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Send className="size-3.5" />
            <span>Pin Note</span>
          </button>
        </form>

      </div>
    </div>
  );
};
