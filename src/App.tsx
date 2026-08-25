import { useState, useMemo, useEffect } from 'react';
import { SONGS } from './data/songs';
import { useYouTubePlayer } from './hooks/useYouTubePlayer';
import { useAmbientMixer } from './hooks/useAmbientMixer';
import { useTimeRotation } from './hooks/useTimeRotation';
import { useRealtimePresence } from './hooks/useRealtimePresence';
import { usePomodoroTimer } from './hooks/usePomodoroTimer';

// Components
import { SplashGate } from './components/SplashGate';
import { Header } from './components/Header';
import { Scene } from './components/Scene';
import { Player } from './components/Player';
import { AmbientMixerModal } from './components/AmbientMixerModal';
import { PlaylistModal } from './components/PlaylistModal';
import { PomodoroTimerModal } from './components/PomodoroTimerModal';
import { ThermalReceiptModal } from './components/ThermalReceiptModal';
import { BulletinBoardModal } from './components/BulletinBoardModal';
import { ZenOverlay } from './components/ZenOverlay';

export function App() {
  // Entry Gateway State
  const [hasEnteredShop, setHasEnteredShop] = useState(false);

  // Modal states
  const [isMixerOpen, setIsMixerOpen] = useState(false);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isBoardOpen, setIsBoardOpen] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);

  // Time & Rotation Hook
  const {
    currentTimeStr,
    timeZoneName,
    setTimeZoneName,
    activeRotation,
    allRotations,
    selectRotation,
  } = useTimeRotation();

  // Wash Cycle Focus Timer Hook (Persistent across modal open/close)
  const {
    selectedCycle,
    secondsRemaining,
    isRunning: isTimerRunning,
    timeFormatted: timerTimeFormatted,
    progressPercent: timerProgressPercent,
    isTimerActive,
    selectCycle,
    toggleRunning: toggleTimerRunning,
    resetTimer,
  } = usePomodoroTimer();

  // Active playlist derived from active rotation
  const rotationPlaylist = useMemo(() => {
    return activeRotation.songIds
      .map((id) => SONGS.find((s) => s.id === id))
      .filter((s): s is typeof SONGS[number] => Boolean(s));
  }, [activeRotation]);

  // Audio Player Hook
  const {
    currentSong,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    volume,
    isMuted,
    togglePlay,
    playTrack,
    nextTrack,
    prevTrack,
    seekTo,
    changeVolume,
    toggleMute: togglePlayerMute,
  } = useYouTubePlayer(rotationPlaylist);

  // Web Audio Procedural Ambient Mixer Hook
  const {
    ambientState,
    startAmbientAudio,
    setChannelVolume,
    toggleMute: toggleAmbientMute,
  } = useAmbientMixer();

  // Live Realtime Presence
  const {
    onlineCount,
  } = useRealtimePresence();

  // Global Ambient Keyboard Shortcuts (Space, M, T, B, Z)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      if (e.code === 'Space') {
        e.preventDefault();
        startAmbientAudio();
        togglePlay();
      } else if (e.key === 'z' || e.key === 'Z') {
        setIsZenMode((prev) => !prev);
      } else if (e.key === 'm' || e.key === 'M') {
        setIsMixerOpen((prev) => !prev);
      } else if (e.key === 't' || e.key === 'T') {
        setIsPomodoroOpen((prev) => !prev);
      } else if (e.key === 'b' || e.key === 'B') {
        setIsBoardOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, startAmbientAudio]);

  // Handle Entrance Gate Click (Door Chime + Start Ambience + Play Track)
  const handleEnterLaundromat = () => {
    setHasEnteredShop(true);
    startAmbientAudio();
    togglePlay();
  };

  const handleTogglePlayWithAmbient = () => {
    startAmbientAudio();
    togglePlay();
  };

  const handleSelectSong = (songId: string) => {
    const idx = rotationPlaylist.findIndex((s) => s.id === songId);
    if (idx !== -1) {
      startAmbientAudio();
      playTrack(idx);
    }
  };

  return (
    <div className="relative h-screen h-[100dvh] flex flex-col justify-between overflow-hidden bg-transparent text-white selection:bg-[#ff2a8d] selection:text-white select-none">
      {/* 
        Robust Headless YouTube Iframe Container:
        Positioned in-viewport with microscopic opacity so YouTube never suspends playback
      */}
      <div
        className="pointer-events-none fixed bottom-0 right-0 w-[240px] h-[160px] opacity-[0.01] -z-20 overflow-hidden"
        aria-hidden="true"
      >
        <div id="youtube-hidden-player" />
      </div>

      {/* Full-Bleed User-Provided Laundromat Illustration Backdrop (Uncropped + Easter Eggs) */}
      <Scene
        isPlaying={isPlaying}
        onOpenBoard={() => setIsBoardOpen(true)}
      />

      {/* Push-to-Enter Gate */}
      {!hasEnteredShop && (
        <SplashGate
          onEnter={handleEnterLaundromat}
          timeZone={timeZoneName}
          timeStr={currentTimeStr}
        />
      )}

      {/* Zen Mode Minimalist Screensaver Overlay */}
      <ZenOverlay
        isActive={isZenMode}
        onExit={() => setIsZenMode(false)}
        timeStr={currentTimeStr}
        timeZone={timeZoneName}
        currentSong={currentSong || SONGS[0]}
        activeRotation={activeRotation}
        onlineCount={onlineCount}
      />

      {/* Top Header with Live Timer, Time & Guestbook */}
      <Header
        timeStr={currentTimeStr}
        timeZone={timeZoneName}
        setTimeZone={setTimeZoneName}
        onlineCount={onlineCount}
        activeRotation={activeRotation}
        onOpenMixer={() => setIsMixerOpen(true)}
        onOpenPlaylists={() => setIsPlaylistOpen(true)}
        onOpenPomodoro={() => setIsPomodoroOpen(true)}
        onOpenReceipt={() => setIsReceiptOpen(true)}
        onOpenBoard={() => setIsBoardOpen(true)}
        isTimerActive={isTimerActive}
        timerTimeFormatted={timerTimeFormatted}
        isTimerRunning={isTimerRunning}
      />

      {/* 
        ========================================================================
        CENTER HERO: DELUXE SALON ICONIC TYPOGRAPHY (NO SCROLL, PURE VIBE)
        ========================================================================
      */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 text-center my-auto pointer-events-none">
        
        {/* Giant Iconic Native Typography */}
        <h1 className="font-extrabold tracking-tight text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl drop-shadow-[0_8px_30px_rgba(0,0,0,0.9)] font-['Noto_Sans_TC']">
          <span className="block neon-text-pink">深夜洗衣店</span>
        </h1>
        <p className="mt-2 sm:mt-4 font-mono text-[0.52rem] xs:text-[0.62rem] sm:text-xs tracking-[0.1em] sm:tracking-[0.4em] uppercase text-white/75 drop-shadow-md whitespace-nowrap">
          Deluxe Laundromat & Arcade · 1994 · open all hours
        </p>

        {/* Floating Active Mini-Timer Badge on Screen (When minimized) */}
        {isTimerActive && !isPomodoroOpen && (
          <button
            onClick={() => setIsPomodoroOpen(true)}
            className="mt-6 pointer-events-auto px-4 py-2 rounded-full bg-black/75 backdrop-blur-xl border border-[#00f0ff] shadow-[0_0_25px_rgba(0,240,255,0.4)] flex items-center gap-2.5 font-mono text-xs text-white hover:scale-105 transition-all cursor-pointer animate-in fade-in slide-in-from-bottom-3"
            title="Click to expand wash timer"
          >
            <span className={`size-2 rounded-full bg-[#00f0ff] ${isTimerRunning ? 'animate-ping' : ''}`} />
            <span className="text-[#00f0ff] font-bold">WASH CYCLE:</span>
            <span className="font-['Press_Start_2P'] text-[0.7rem] text-white tracking-wider">
              {timerTimeFormatted}
            </span>
            <span className="text-white/40 text-[0.65rem]">(tap to expand)</span>
          </button>
        )}

      </main>

      {/* 
        ========================================================================
        FLOATING DELUXE SALOON-STYLE RADIO PLAYER PILL
        ========================================================================
      */}
      <Player
        currentSong={currentSong || SONGS[0]}
        isPlaying={isPlaying}
        isLoading={isLoading}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isMuted={isMuted}
        activeRotation={activeRotation}
        onTogglePlay={handleTogglePlayWithAmbient}
        onNext={nextTrack}
        onPrev={prevTrack}
        onSeek={seekTo}
        onChangeVolume={changeVolume}
        onToggleMute={togglePlayerMute}
        onOpenPlaylists={() => setIsPlaylistOpen(true)}
        ambientState={ambientState}
        onSetAmbientVolume={(channel, val) => setChannelVolume(channel, val)}
      />

      {/* Ambient Sound Mixer Modal */}
      <AmbientMixerModal
        isOpen={isMixerOpen}
        onClose={() => setIsMixerOpen(false)}
        ambientState={ambientState}
        setChannelVolume={setChannelVolume}
        toggleMute={toggleAmbientMute}
      />

      {/* Playlist & Rotations Archive Modal */}
      <PlaylistModal
        isOpen={isPlaylistOpen}
        onClose={() => setIsPlaylistOpen(false)}
        rotations={allRotations}
        activeRotation={activeRotation}
        currentSong={currentSong || SONGS[0]}
        onSelectRotation={(id) => selectRotation(id)}
        onSelectSong={handleSelectSong}
      />

      {/* Wash Cycle Pomodoro Timer Modal (Can stay open or be minimized) */}
      <PomodoroTimerModal
        isOpen={isPomodoroOpen}
        onClose={() => setIsPomodoroOpen(false)}
        selectedCycle={selectedCycle}
        secondsRemaining={secondsRemaining}
        isRunning={isTimerRunning}
        timeFormatted={timerTimeFormatted}
        progressPercent={timerProgressPercent}
        onSelectCycle={selectCycle}
        onToggleRunning={toggleTimerRunning}
        onResetTimer={resetTimer}
      />

      {/* 1994 Thermal Receipt Exporter Modal */}
      <ThermalReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        currentSong={currentSong || SONGS[0]}
        activeRotation={activeRotation}
        timeStr={currentTimeStr}
        timeZone={timeZoneName}
        onlineCount={onlineCount}
        token={null}
      />

      {/* The Lost Sock Community Guestbook Modal */}
      <BulletinBoardModal
        isOpen={isBoardOpen}
        onClose={() => setIsBoardOpen(false)}
      />
    </div>
  );
}

export default App;






