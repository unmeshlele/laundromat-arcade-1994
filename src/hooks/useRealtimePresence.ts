import { useState, useEffect } from 'react';

const CITIES = ['Hong Kong', 'Seoul', 'Tokyo', 'Taipei', 'Singapore', 'London', 'New York', 'Toronto', 'Melbourne', 'Osaka', 'Busan'];
const ACTIONS = [
  'inserted a HK$5 coin into Street Fighter II',
  'started a quick rinse cycle in Dryer #3',
  'bought a chilled Vitasoy from the vending machine',
  'tuned in from a midnight taxi',
  'wiped condensation off the front glass',
  'set a high score on KOF \'94 (ESAKA Team)',
  'flipped the cassette tape over to Side B',
  'pulled up a stool by the window counter',
];

export interface BroadcastNotification {
  id: string;
  city: string;
  action: string;
  timestamp: string;
}

export function useRealtimePresence() {
  const [onlineCount, setOnlineCount] = useState(218);
  const [recentNotification, setRecentNotification] = useState<BroadcastNotification | null>(null);

  useEffect(() => {
    // Generate an initial random baseline between 180 and 310
    const initial = 180 + Math.floor(Math.random() * 120);
    setOnlineCount(initial);

    // Fluctuate count gently every 6-12 seconds
    const interval = setInterval(() => {
      setOnlineCount((prev) => {
        const delta = Math.floor(Math.random() * 7) - 3; // -3 to +3
        return Math.max(120, prev + delta);
      });
    }, 8000);

    // Periodic organic notification popup
    const notifInterval = setInterval(() => {
      const city = CITIES[Math.floor(Math.random() * CITIES.length)];
      const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
      setRecentNotification({
        id: Math.random().toString(36).substring(2, 9),
        city,
        action,
        timestamp: 'just now',
      });

      const timer = setTimeout(() => {
        setRecentNotification(null);
      }, 5000);

      return () => clearTimeout(timer);
    }, 14000);

    return () => {
      clearInterval(interval);
      clearInterval(notifInterval);
    };
  }, []);

  const triggerUserAction = (customAction: string) => {
    setRecentNotification({
      id: Math.random().toString(36).substring(2, 9),
      city: 'You',
      action: customAction,
      timestamp: 'just now',
    });
    setTimeout(() => {
      setRecentNotification(null);
    }, 5000);
  };

  return {
    onlineCount,
    recentNotification,
    triggerUserAction,
  };
}
