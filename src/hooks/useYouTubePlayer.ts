import { useEffect, useRef, useState, useCallback } from 'react';
import type { Song } from '../types';
import { audioSynth } from '../utils/audioSynth';

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string | HTMLElement,
        config: {
          height?: string | number;
          width?: string | number;
          videoId?: string;
          playerVars?: Record<string, unknown>;
          events?: {
            onReady?: (event: { target: YTPlayerInstance }) => void;
            onStateChange?: (event: { data: number; target: YTPlayerInstance }) => void;
            onError?: (event: { data: number }) => void;
          };
        }
      ) => YTPlayerInstance;
      PlayerState: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YTPlayerInstance {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  loadVideoById: (videoId: string | { videoId: string; startSeconds?: number }) => void;
  cueVideoById: (videoId: string) => void;
  destroy: () => void;
}

export function useYouTubePlayer(playlist: Song[], initialIndex = 0) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180);
  const [volume, setVolume] = useState(85);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Direct HTML5 Audio element for 100% reliable streaming
  const html5AudioRef = useRef<HTMLAudioElement | null>(null);
  const playerRef = useRef<YTPlayerInstance | null>(null);
  const intervalRef = useRef<number | null>(null);
  const currentSong = playlist[currentTrackIndex] || playlist[0];

  // Initialize HTML5 Audio Element
  useEffect(() => {
    if (!html5AudioRef.current) {
      const audio = new Audio();
      audio.crossOrigin = 'anonymous';
      audio.preload = 'auto';
      audio.volume = volume / 100;
      html5AudioRef.current = audio;

      audio.addEventListener('playing', () => {
        setIsPlaying(true);
        setIsLoading(false);
      });

      audio.addEventListener('pause', () => {
        setIsPlaying(false);
        setIsLoading(false);
      });

      audio.addEventListener('ended', () => {
        nextTrack();
      });

      audio.addEventListener('error', (e) => {
        console.warn('HTML5 audio error, falling back to Web Audio City Pop Synth:', e);
        audioSynth.startCityPopMusic(volume / 100);
      });
    }

    return () => {
      if (html5AudioRef.current) {
        html5AudioRef.current.pause();
        html5AudioRef.current = null;
      }
    };
  }, []);

  // Next Track function
  const nextTrack = useCallback(() => {
    if (!playlist.length) return;
    audioSynth.playTapeRewind();
    const nextIdx = (currentTrackIndex + 1) % playlist.length;
    setCurrentTrackIndex(nextIdx);
    setIsLoading(true);
    setCurrentTime(0);
  }, [playlist.length, currentTrackIndex]);

  // Previous Track function
  const prevTrack = useCallback(() => {
    if (!playlist.length) return;
    audioSynth.playTapeRewind();
    const prevIdx = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    setCurrentTrackIndex(prevIdx);
    setIsLoading(true);
    setCurrentTime(0);
  }, [playlist.length, currentTrackIndex]);

  // Sync song changes with HTML5 Audio & YouTube
  useEffect(() => {
    if (!currentSong) return;

    // 1. Play via HTML5 stream if active
    if (html5AudioRef.current && isPlaying) {
      const streamUrl = currentSong.audioUrl || 'https://radio.plaza.one/mp3';
      if (html5AudioRef.current.src !== streamUrl) {
        html5AudioRef.current.src = streamUrl;
        html5AudioRef.current.play().catch((err) => {
          console.warn('HTML5 audio stream blocked, using Web Audio Synthesizer:', err);
          audioSynth.startCityPopMusic(volume / 100);
        });
      }
    }

    // 2. Play via Web Audio City Pop Synthesizer as rich layered sound
    if (isPlaying) {
      audioSynth.startCityPopMusic(volume / 100);
    }

    // 3. Sync YouTube if available
    if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
      try {
        playerRef.current.loadVideoById(currentSong.videoId);
      } catch { /* ignore */ }
    }
  }, [currentTrackIndex, currentSong, isPlaying]);

  // Setup YouTube iframe API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      initYT();
      return;
    }

    const existingScript = document.getElementById('youtube-iframe-api-script');
    if (!existingScript) {
      const tag = document.createElement('script');
      tag.id = 'youtube-iframe-api-script';
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    window.onYouTubeIframeAPIReady = () => {
      initYT();
    };

    function initYT() {
      if (playerRef.current) return;
      const playerDiv = document.getElementById('youtube-hidden-player');
      if (!playerDiv) return;

      try {
        playerRef.current = new window.YT.Player('youtube-hidden-player', {
          height: '100%',
          width: '100%',
          videoId: currentSong?.videoId || 's7118R20t7A',
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            enablejsapi: 1,
          },
          events: {
            onReady: (event) => {
              event.target.setVolume(volume);
            },
            onStateChange: (event) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
                setIsLoading(false);
              }
            },
            onError: () => {
              // YouTube blocked or failed; HTML5 / Synth continues uninterrupted!
              setIsLoading(false);
            },
          },
        });
      } catch { /* ignore */ }
    }
  }, [currentSong?.videoId, volume]);

  // Time Tracker Loop
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = window.setInterval(() => {
        if (html5AudioRef.current && !isNaN(html5AudioRef.current.currentTime) && html5AudioRef.current.currentTime > 0) {
          setCurrentTime(html5AudioRef.current.currentTime);
          if (html5AudioRef.current.duration && !isNaN(html5AudioRef.current.duration)) {
            setDuration(html5AudioRef.current.duration);
          }
        } else {
          // Synthetic progress for live streams
          setCurrentTime((prev) => (prev + 1) % 240);
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying]);

  // Dynamic Tab Title & Equalizer
  useEffect(() => {
    if (!currentSong) return;
    if (isPlaying) {
      document.title = `▶ ${currentSong.titleEn} (${currentSong.titleNative}) · Neon Laundry '94`;
    } else {
      document.title = `Neon Coin Laundromat & Arcade 1994 (深夜洗衣·街機)`;
    }
  }, [isPlaying, currentSong]);

  // OS MediaSession API Integration
  useEffect(() => {
    if (!('mediaSession' in navigator) || !currentSong) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: `${currentSong.titleEn} (${currentSong.titleNative})`,
      artist: `${currentSong.artistEn} (${currentSong.artistNative}) · ${currentSong.year}`,
      album: `${currentSong.album} (1994 Laundromat Radio)`,
      artwork: [
        {
          src: `https://i.ytimg.com/vi/${currentSong.videoId}/hqdefault.jpg`,
          sizes: '480x360',
          type: 'image/jpeg',
        },
      ],
    });

    navigator.mediaSession.setActionHandler('play', () => togglePlay());
    navigator.mediaSession.setActionHandler('pause', () => togglePlay());
    navigator.mediaSession.setActionHandler('previoustrack', () => prevTrack());
    navigator.mediaSession.setActionHandler('nexttrack', () => nextTrack());
  }, [currentSong, nextTrack, prevTrack]);

  // Play / Pause Toggle
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      if (html5AudioRef.current) {
        html5AudioRef.current.pause();
      }
      audioSynth.stopCityPopMusic();
      try { playerRef.current?.pauseVideo(); } catch { /* ignore */ }
      setIsPlaying(false);
    } else {
      const streamUrl = currentSong?.audioUrl || 'https://radio.plaza.one/mp3';
      if (html5AudioRef.current) {
        html5AudioRef.current.src = streamUrl;
        html5AudioRef.current.volume = isMuted ? 0 : volume / 100;
        html5AudioRef.current.play().catch(() => {
          audioSynth.startCityPopMusic(volume / 100);
        });
      }
      audioSynth.startCityPopMusic(isMuted ? 0 : volume / 100);
      try { playerRef.current?.playVideo(); } catch { /* ignore */ }
      setIsPlaying(true);
    }
  }, [isPlaying, currentSong, volume, isMuted]);

  // Jump to specific track
  const playTrack = useCallback((index: number) => {
    if (index >= 0 && index < playlist.length) {
      audioSynth.playTapeRewind();
      setCurrentTrackIndex(index);
      setIsLoading(true);
      setCurrentTime(0);

      const target = playlist[index];
      const streamUrl = target?.audioUrl || 'https://radio.plaza.one/mp3';

      if (html5AudioRef.current) {
        html5AudioRef.current.src = streamUrl;
        html5AudioRef.current.play().catch(() => {
          audioSynth.startCityPopMusic(volume / 100);
        });
      }
      audioSynth.startCityPopMusic(volume / 100);
      try { playerRef.current?.loadVideoById(target.videoId); } catch { /* ignore */ }
      setIsPlaying(true);
    }
  }, [playlist, volume]);

  // Seek
  const seekTo = useCallback((seconds: number) => {
    if (html5AudioRef.current && !isNaN(html5AudioRef.current.duration) && html5AudioRef.current.duration > 0) {
      html5AudioRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    } else {
      setCurrentTime(seconds);
    }
  }, []);

  // Volume
  const changeVolume = useCallback((newVolume: number) => {
    setVolume(newVolume);
    if (html5AudioRef.current) {
      html5AudioRef.current.volume = newVolume / 100;
    }
    audioSynth.setCityPopMusicVolume(newVolume / 100);
    try { playerRef.current?.setVolume(newVolume); } catch { /* ignore */ }

    if (isMuted && newVolume > 0) {
      setIsMuted(false);
    }
  }, [isMuted]);

  // Mute
  const toggleMute = useCallback(() => {
    if (isMuted) {
      if (html5AudioRef.current) html5AudioRef.current.volume = volume / 100;
      audioSynth.setCityPopMusicVolume(volume / 100);
      try { playerRef.current?.unMute(); } catch { /* ignore */ }
      setIsMuted(false);
    } else {
      if (html5AudioRef.current) html5AudioRef.current.volume = 0;
      audioSynth.setCityPopMusicVolume(0);
      try { playerRef.current?.mute(); } catch { /* ignore */ }
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  return {
    currentSong,
    currentTrackIndex,
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
    toggleMute,
  };
}

