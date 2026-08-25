import { useState, useEffect, useRef } from 'react';

const PRESENCE_TOPIC = 'laundromat_arcade_1994_live_presence_global';
const WS_URL = `wss://ntfy.sh/${PRESENCE_TOPIC}/ws`;
const POST_URL = `https://ntfy.sh/${PRESENCE_TOPIC}`;
const HEARTBEAT_INTERVAL_MS = 4000;
const PEER_TIMEOUT_MS = 10000;

export function useRealtimePresence() {
  const [onlineCount, setOnlineCount] = useState<number>(1);
  const peersRef = useRef<Map<string, number>>(new Map());
  const myClientIdRef = useRef<string>(`usr_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const myId = myClientIdRef.current;
    const peers = peersRef.current;

    // Register own presence
    peers.set(myId, Date.now());

    // 1. Cross-tab synchronization via BroadcastChannel
    let broadcastChannel: BroadcastChannel | null = null;
    try {
      broadcastChannel = new BroadcastChannel('laundromat_realtime_presence_v2');
      broadcastChannel.onmessage = (event) => {
        const data = event.data;
        if (!data || typeof data !== 'object') return;

        if (data.type === 'ping' && data.id) {
          peers.set(data.id, Date.now());
          updateLiveCount();
        } else if (data.type === 'leave' && data.id) {
          peers.delete(data.id);
          updateLiveCount();
        }
      };
    } catch {
      // BroadcastChannel fallback
    }

    const updateLiveCount = () => {
      const now = Date.now();
      // Remove stale peers
      for (const [id, lastSeen] of peers.entries()) {
        if (id !== myId && now - lastSeen > PEER_TIMEOUT_MS) {
          peers.delete(id);
        }
      }
      setOnlineCount(Math.max(1, peers.size));
    };

    // 2. Global Cross-device presence via ntfy.sh WebSocket
    let reconnectTimer: number | null = null;

    const connectWebSocket = () => {
      try {
        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;

        ws.onopen = () => {
          sendHeartbeat();
        };

        ws.onmessage = (evt) => {
          try {
            const raw = JSON.parse(evt.data);
            // ntfy.sh wraps messages in { event: 'message', message: '...' }
            if (raw.event === 'message' && raw.message) {
              const data = typeof raw.message === 'string' ? JSON.parse(raw.message) : raw.message;
              if (data.type === 'ping' && data.id) {
                peers.set(data.id, Date.now());
                updateLiveCount();
              } else if (data.type === 'leave' && data.id) {
                peers.delete(data.id);
                updateLiveCount();
              }
            }
          } catch {
            // Ignore non-json frames
          }
        };

        ws.onerror = () => {
          // Reconnect on error
        };

        ws.onclose = () => {
          if (!reconnectTimer) {
            reconnectTimer = window.setTimeout(() => {
              reconnectTimer = null;
              connectWebSocket();
            }, 4000);
          }
        };
      } catch {
        // Fallback
      }
    };

    connectWebSocket();

    const sendHeartbeat = () => {
      const now = Date.now();
      peers.set(myId, now);

      const payload = JSON.stringify({ type: 'ping', id: myId });

      // Publish to global pub/sub
      try {
        fetch(POST_URL, {
          method: 'POST',
          body: payload,
          headers: { 'Content-Type': 'application/json' },
          mode: 'no-cors',
        }).catch(() => { /* ignore */ });
      } catch {
        // ignore
      }

      // Publish to local BroadcastChannel
      if (broadcastChannel) {
        try {
          broadcastChannel.postMessage({ type: 'ping', id: myId });
        } catch { /* ignore */ }
      }

      updateLiveCount();
    };

    // Immediate initial announcement
    sendHeartbeat();

    // Periodic heartbeat every 4 seconds
    const interval = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS);

    // Prune stale peers every 2.5 seconds
    const pruneInterval = setInterval(updateLiveCount, 2500);

    // Handle unload / tab close
    const handleBeforeUnload = () => {
      const leavePayload = JSON.stringify({ type: 'leave', id: myId });
      try {
        fetch(POST_URL, {
          method: 'POST',
          body: leavePayload,
          headers: { 'Content-Type': 'application/json' },
          mode: 'no-cors',
          keepalive: true,
        }).catch(() => { /* ignore */ });
      } catch { /* ignore */ }

      if (broadcastChannel) {
        try { broadcastChannel.postMessage({ type: 'leave', id: myId }); } catch { /* ignore */ }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      handleBeforeUnload();
      clearInterval(interval);
      clearInterval(pruneInterval);
      if (reconnectTimer) clearTimeout(reconnectTimer);
      window.removeEventListener('beforeunload', handleBeforeUnload);

      if (broadcastChannel) {
        try { broadcastChannel.close(); } catch { /* ignore */ }
      }
      if (wsRef.current) {
        try { wsRef.current.close(); } catch { /* ignore */ }
      }
    };
  }, []);

  return {
    onlineCount,
  };
}

