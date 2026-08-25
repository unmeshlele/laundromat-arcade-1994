export interface Song {
  id: string;
  titleEn: string;
  titleNative: string; // Chinese or Korean
  artistEn: string;
  artistNative: string;
  year: number;
  origin: 'HK' | 'KR' | 'JP' | 'ARCADE';
  videoId: string; // YouTube Video ID
  audioUrl?: string; // Direct HTML5 Audio Streaming URL
  durationSec?: number;
  album?: string;
  tagline?: string;
}

export interface Rotation {
  id: string;
  slug: string;
  nameEn: string;
  nameZh: string;
  nameKo: string;
  window: string; // e.g. "23:00–05:00 HKT/KST"
  startHour: number;
  endHour: number;
  description: string;
  accentColor: string;
  songIds: string[];
}

export interface AmbientMixerState {
  dryerVolume: number; // 0 to 1
  rainVolume: number; // 0 to 1
  neonVolume: number; // 0 to 1
  arcadeVolume: number; // 0 to 1
  isMuted: boolean;
}

export interface CoinToken {
  tokenNumber: string;
  issuedAt: string;
  rarity: 'Common Brass' | 'Shiny Chrome' | 'Cyberpunk Gold' | 'Neo-Geo Holo';
}

export interface VendingDrink {
  id: string;
  nameEn: string;
  nameNative: string;
  origin: 'HK' | 'KR' | 'JP';
  color: string;
  description: string;
  icon: string;
}
