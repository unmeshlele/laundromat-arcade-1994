import type { Rotation } from '../types';

export const ROTATIONS: Rotation[] = [
  {
    id: 'chungking-midnight',
    slug: 'chungking-midnight',
    nameEn: 'Chungking Midnight',
    nameZh: '深夜霓虹',
    nameKo: '심야 네온',
    window: '23:00–05:00 HKT/KST',
    startHour: 23,
    endHour: 5,
    description: 'Dreamy Cantopop, shoegaze melodies, and 90s Korean city pop under rainy midnight neon.',
    accentColor: '#ff2a8d', // Neon Pink
    songIds: [
      'faye-dreams',
      'leslie-wind-blows',
      'light-salt-fairy-tale',
      'tatsuro-sparkle',
      'faye-vulnerable-woman'
    ]
  },
  {
    id: 'morning-rinse',
    slug: 'morning-rinse',
    nameEn: 'Morning Rinse',
    nameZh: '早晨洗滌',
    nameKo: '아침 세탁',
    window: '05:00–11:00 HKT/KST',
    startHour: 5,
    endHour: 11,
    description: 'Gentle acoustic warmth, sweet 90s love ballads, and golden sunbeams through steamed glass.',
    accentColor: '#00f0ff', // Neon Cyan
    songIds: [
      'sandy-lam-at-least-i-have-you',
      'jacky-cheung-love-you-more',
      'anri-shyness-boy'
    ]
  },
  {
    id: 'coin-op-rush',
    slug: 'coin-op-rush',
    nameEn: 'Coin-Op Rush',
    nameZh: '街機投幣',
    nameKo: '오락실 러시',
    window: '11:00–18:00 HKT/KST',
    startHour: 11,
    endHour: 18,
    description: 'High-voltage 90s Korean New Jack Swing, Eurodance, and 16-bit arcade soundtracks.',
    accentColor: '#ffb800', // Amber Yellow
    songIds: [
      'sf2-guile-theme',
      'deux-in-summer',
      'kof94-esaka'
    ]
  },
  {
    id: 'detergent-dreams',
    slug: 'detergent-dreams',
    nameEn: 'Detergent Dreams',
    nameZh: '夕陽浪漫',
    nameKo: '황혼의 꿈',
    window: '18:00–23:00 HKT/KST',
    startHour: 18,
    endHour: 23,
    description: 'Smooth 90s R&B, city dusk romance, and cassette rewind vibes.',
    accentColor: '#aa3bff', // Electric Purple
    songIds: [
      'solid-holding-the-end-of-tonight',
      'anita-mui-sunset-song'
    ]
  }
];

