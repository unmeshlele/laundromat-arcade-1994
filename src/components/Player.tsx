import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, SlidersHorizontal, CloudRain, Wind, ExternalLink, Moon } from 'lucide-react';
import type { Song, Rotation, AmbientMixerState } from '../types';

interface PlayerProps {
  currentSong: Song;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  activeRotation: Rotation;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (seconds: number) => void;
  onChangeVolume: (val: number) => void;
  onToggleMute: () => void;
  onOpenPlaylists: () => void;
  ambientState: AmbientMixerState;
  onSetAmbientVolume: (channel: 'rainVolume' | 'dryerVolume', val: number) => void;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export const Player: React.FC<PlayerProps> = ({
  currentSong,
  isPlaying,
  isLoading,
  currentTime,
  duration,
  volume,
  isMuted,
  activeRotation,
  onTogglePlay,
  onNext,
  onPrev,
  onSeek,
  onChangeVolume,
  onToggleMute,
  onOpenPlaylists,
  ambientState,
  onSetAmbientVolume,
}) => {
  const [showAtmosphere, setShowAtmosphere] = useState(false);
  const [sleepMinutes, setSleepMinutes] = useState<number | null>(null);
  const [sleepSecondsLeft, setSleepSecondsLeft] = useState<number | null>(null);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Sleep Timer countdown & gentle fade out
  useEffect(() => {
    if (!sleepMinutes) {
      setSleepSecondsLeft(null);
      return;
    }

    setSleepSecondsLeft(sleepMinutes * 60);
    const interval = setInterval(() => {
      setSleepSecondsLeft((prev) => {
        if (!prev || prev <= 1) {
          clearInterval(interval);
          if (isPlaying) onTogglePlay();
          setSleepMinutes(null);
          return null;
        }
        // Smooth fade out in the final 30 seconds
        if (prev <= 30) {
          const fadeVol = Math.round((prev / 30) * volume);
          onChangeVolume(fadeVol);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sleepMinutes]);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-4 sm:pb-8 pointer-events-none">
      <div className="max-w-xl mx-auto pointer-events-auto flex flex-col items-center gap-2">
        
        {/* Collapsible Atmosphere & Sleep Timer Box */}
        {showAtmosphere && (
          <div className="w-full bg-[#120c22]/90 backdrop-blur-2xl rounded-2xl p-3.5 border border-white/15 shadow-2xl flex flex-col gap-3 text-xs font-mono animate-in fade-in slide-in-from-bottom-2 duration-200">
            {/* Foley Volume Sliders */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <CloudRain className="size-3.5 text-[#00f0ff]" />
                <span className="text-white/70 text-[0.7rem]">Rain:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={ambientState.rainVolume}
                  onChange={(e) => onSetAmbientVolume('rainVolume', Number(e.target.value))}
                  className="retro-slider flex-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <Wind className="size-3.5 text-[#ffb800]" />
                <span className="text-white/70 text-[0.7rem]">Dryer:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={ambientState.dryerVolume}
                  onChange={(e) => onSetAmbientVolume('dryerVolume', Number(e.target.value))}
                  className="retro-slider flex-1"
                />
              </div>
            </div>

            {/* Sleep Timer Preset Selector */}
            <div className="flex items-center justify-between border-t border-white/10 pt-2.5">
              <div className="flex items-center gap-1.5 text-white/70 text-[0.7rem]">
                <Moon className="size-3.5 text-indigo-300" />
                <span>Sleep Timer:</span>
                {sleepSecondsLeft && (
                  <span className="text-[#00f0ff] font-bold font-mono">
                    ({Math.ceil(sleepSecondsLeft / 60)}m left)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                {[null, 15, 30, 45, 60].map((mins) => (
                  <button
                    key={mins ?? 'off'}
                    onClick={() => setSleepMinutes(mins)}
                    className={`px-2 py-0.5 rounded-lg text-[0.65rem] transition-all cursor-pointer ${
                      sleepMinutes === mins
                        ? 'bg-indigo-500 text-white font-bold shadow-sm'
                        : 'bg-white/5 hover:bg-white/10 text-white/60'
                    }`}
                  >
                    {mins ? `${mins}m` : 'Off'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mobile & Desktop Responsive Player Container */}
        <div className="w-full bg-[#120b22]/90 backdrop-blur-2xl rounded-2xl sm:rounded-full p-3 sm:p-2.5 sm:pr-5 border border-white/20 shadow-[0_12px_45px_rgba(0,0,0,0.85),0_0_25px_rgba(255,42,141,0.25)] flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4">
          
          {/* Main Top Row on Mobile / Single Row on Desktop */}
          <div className="flex items-center gap-3 sm:gap-3.5 flex-1 min-w-0">
            {/* Rotating Album Art / Cassette Thumbnail */}
            <div className="relative size-12 sm:size-13 shrink-0 rounded-xl sm:rounded-full overflow-hidden bg-black/70 border border-white/25 flex items-center justify-center shadow-lg">
              <img
                src={`https://i.ytimg.com/vi/${currentSong.videoId}/hqdefault.jpg`}
                alt={currentSong.titleEn}
                className="size-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%231a142c" width="100" height="100"/><text y="55" x="25" fill="%23ff2a8d" font-size="30">90s</text></svg>';
                }}
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className={`text-base ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }}>
                  📼
                </span>
              </div>
            </div>

            {/* Song Meta (Title, Native Title, Artist, Rotation) */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-xs sm:text-sm font-bold text-white font-['Outfit']">
                  {currentSong.titleEn}
                </p>
                <span className="shrink-0 text-[0.65rem] text-[#00f0ff] font-medium hidden md:inline">
                  {currentSong.titleNative}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[0.68rem] sm:text-xs text-white/60">
                <span className="truncate max-w-[110px] sm:max-w-none">{currentSong.artistEn}</span>
                <span>·</span>
                <button
                  onClick={onOpenPlaylists}
                  className="text-[#ff2a8d] hover:underline truncate cursor-pointer font-medium"
                >
                  {activeRotation.nameEn}
                </button>
              </div>

              {/* Desktop-only Inline Seekbar */}
              <div className="mt-1 hidden sm:flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={(e) => onSeek(Number(e.target.value))}
                  className="retro-slider h-1 flex-1"
                  style={{
                    background: `linear-gradient(to right, #ff2a8d ${progressPercent}%, rgba(255,255,255,0.15) ${progressPercent}%)`
                  }}
                />
                <span className="shrink-0 font-mono text-[0.6rem] text-white/50 tabular-nums">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Playback Controls & Atmosphere Button */}
            <div className="flex shrink-0 items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={onPrev}
                className="p-2 text-white/70 hover:text-white transition-colors cursor-pointer active:scale-90"
                title="Previous track"
              >
                <SkipBack className="size-4" />
              </button>

              <button
                type="button"
                onClick={onTogglePlay}
                className="size-10 sm:size-10 rounded-full bg-gradient-to-tr from-[#ff2a8d] to-[#aa3bff] text-white flex items-center justify-center shadow-[0_0_20px_rgba(255,42,141,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isLoading ? (
                  <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isPlaying ? (
                  <Pause className="size-4 fill-current" />
                ) : (
                  <Play className="size-4 fill-current ml-0.5" />
                )}
              </button>

              <button
                type="button"
                onClick={onNext}
                className="p-2 text-white/70 hover:text-white transition-colors cursor-pointer active:scale-90"
                title="Next track"
              >
                <SkipForward className="size-4" />
              </button>

              {/* Atmosphere Toggle & Volume Controls */}
              <div className="flex items-center gap-1 border-l border-white/10 pl-1.5 sm:pl-2">
                <button
                  onClick={() => setShowAtmosphere(!showAtmosphere)}
                  className={`p-2 rounded-full transition-colors cursor-pointer active:scale-90 ${
                    showAtmosphere ? 'text-[#ff2a8d] bg-[#ff2a8d]/20' : 'text-white/60 hover:text-white'
                  }`}
                  title="Adjust Rain & Dryer Ambience"
                >
                  <SlidersHorizontal className="size-4" />
                </button>

                <button
                  onClick={onToggleMute}
                  className="p-1 text-white/60 hover:text-white transition-colors cursor-pointer hidden sm:inline-flex"
                  title="Mute / Unmute"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="size-3.5 text-rose-400" />
                  ) : (
                    <Volume2 className="size-3.5" />
                  )}
                </button>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => onChangeVolume(Number(e.target.value))}
                  className="retro-slider hidden h-1 w-14 sm:block"
                  title="Master Volume"
                />

                <a
                  href={`https://www.youtube.com/watch?v=${currentSong.videoId}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="p-1 text-white/40 hover:text-[#00f0ff] transition-colors hidden md:inline-flex"
                  title="Watch on YouTube"
                >
                  <ExternalLink className="size-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Mobile Full-Width Bottom Seekbar */}
          <div className="w-full sm:hidden flex items-center gap-2 pt-1 border-t border-white/10">
            <span className="font-mono text-[0.62rem] text-white/60 tabular-nums">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={(e) => onSeek(Number(e.target.value))}
              className="retro-slider h-1.5 flex-1"
              style={{
                background: `linear-gradient(to right, #ff2a8d ${progressPercent}%, rgba(255,255,255,0.15) ${progressPercent}%)`
              }}
            />
            <span className="font-mono text-[0.62rem] text-white/40 tabular-nums">
              {formatTime(duration)}
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};

