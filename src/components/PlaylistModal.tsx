import React from 'react';
import { X, Disc, Play, Radio, Sparkles } from 'lucide-react';
import type { Rotation, Song } from '../types';
import { SONGS } from '../data/songs';
import { audioSynth } from '../utils/audioSynth';

interface PlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  rotations: Rotation[];
  activeRotation: Rotation;
  currentSong: Song;
  onSelectRotation: (id: string | null) => void;
  onSelectSong: (songId: string) => void;
}

export const PlaylistModal: React.FC<PlaylistModalProps> = ({
  isOpen,
  onClose,
  rotations,
  activeRotation,
  currentSong,
  onSelectRotation,
  onSelectSong,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="arcade-glass w-full max-w-2xl max-h-[85vh] rounded-3xl p-5 sm:p-6 border border-[#ff2a8d]/40 shadow-[0_0_40px_rgba(255,42,141,0.2)] flex flex-col gap-4 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#ff2a8d]/10 text-[#ff2a8d] border border-[#ff2a8d]/30">
              <Disc className="size-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-['Outfit']">
                Radio Rotations & Archive
              </h2>
              <p className="text-xs text-[#ff2a8d] font-mono">
                Hong Kong & Seoul 1994 Cassette Archives
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

        {/* Rotations Pill Carousel */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-white/60 uppercase tracking-wider">
              Select 24H Daypart Rotation:
            </span>
            <button
              onClick={() => {
                audioSynth.playButtonBeep();
                onSelectRotation(null);
              }}
              className="text-[0.7rem] font-mono text-[#00f0ff] hover:underline"
            >
              Reset to Auto (HKT Time)
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {rotations.map((r) => {
              const isSelected = activeRotation.id === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => {
                    audioSynth.playButtonBeep();
                    onSelectRotation(r.id);
                  }}
                  className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#2b183f] to-[#170e26] shadow-[0_0_15px_rgba(255,42,141,0.3)]'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                  style={{ borderColor: isSelected ? r.accentColor : 'rgba(255,255,255,0.1)' }}
                >
                  <span className="font-bold text-xs text-white truncate">{r.nameEn}</span>
                  <span className="text-[0.65rem] text-[#00f0ff] font-semibold">{r.nameZh} / {r.nameKo}</span>
                  <span className="font-mono text-[0.6rem] text-white/50 mt-1">{r.window}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Songs List inside Active Rotation */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-1.5 mt-2">
          <p className="font-mono text-xs text-white/60 uppercase tracking-wider mb-1">
            Tracks in {activeRotation.nameEn} ({activeRotation.songIds.length} Songs):
          </p>

          {activeRotation.songIds.map((songId, index) => {
            const song = SONGS.find((s) => s.id === songId);
            if (!song) return null;
            const isPlayingThis = currentSong.id === song.id;

            return (
              <div
                key={song.id}
                onClick={() => {
                  audioSynth.playButtonBeep();
                  onSelectSong(song.id);
                }}
                className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                  isPlayingThis
                    ? 'bg-[#29173c] border-[#ff2a8d] shadow-[0_0_12px_rgba(255,42,141,0.3)]'
                    : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-xs text-white/40 w-4 text-right">
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                  <div className="relative size-9 rounded-lg overflow-hidden shrink-0 bg-black/40">
                    <img
                      src={`https://i.ytimg.com/vi/${song.videoId}/hqdefault.jpg`}
                      alt={song.titleEn}
                      className="size-full object-cover"
                    />
                    {isPlayingThis && (
                      <div className="absolute inset-0 bg-[#ff2a8d]/40 flex items-center justify-center">
                        <Radio className="size-4 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-bold text-xs sm:text-sm text-white">{song.titleEn}</span>
                      <span className="text-[0.7rem] text-[#00f0ff] font-semibold">{song.titleNative}</span>
                    </div>
                    <p className="text-[0.7rem] text-white/60 truncate">
                      {song.artistEn} ({song.artistNative}) · {song.year}
                    </p>
                  </div>
                </div>

                <button
                  className={`p-2 rounded-full transition-colors ${
                    isPlayingThis ? 'text-[#ff2a8d]' : 'text-white/40 hover:text-white'
                  }`}
                >
                  {isPlayingThis ? <Radio className="size-4 animate-pulse" /> : <Play className="size-4 fill-current" />}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 pt-3 flex items-center justify-between text-xs text-white/50">
          <span className="flex items-center gap-1">
            <Sparkles className="size-3 text-[#ffb800]" /> 1994 Audio Archive · Free & Public
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
