import { useState, useEffect, useRef } from 'react';

const PRESENCE_WS_URL = 'wss://demo.piesocket.com/v3/laundromat_1994_live_presence?api_key=VC3OtKQPAAfgcaAggGyGrOmqXXb6DnRwYAMjqxco&notify_self=1';
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

    // Add self
    peers.set(myId, Date.now());

    // 1. Cross-tab presence via BroadcastChannel
    let broadcastChannel: BroadcastChannel | null = null;
    try {
      broadcastChannel = new BroadcastChannel('laundromat_realtime_presence');
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
      // BroadcastChannel unsupported fallback
    }

    // 2. Global Cross-device presence via WebSocket Relay
    const connectWebSocket = () => {
      try {
        const ws = new WebSocket(PRESENCE_WS_URL);
        wsRef.current = ws;

        ws.onopen = () => {
          // Announce presence immediately
          sendHeartbeat();
        };

        ws.onmessage = (evt) => {
          try {
            const data = JSON.parse(evt.data);
            if (data.type === 'ping' && data.id) {
              peers.set(data.id, Date.now());
              updateLiveCount();
            } else if (data.type === 'leave' && data.id) {
              peers.delete(data.id);
              updateLiveCount();
            }
          } catch {
            // Ignore non-json frames
          }
        };

        ws.onerror = () => {
          // Silent fallback to local tab presence
        };

        ws.onclose = () => {
          // Auto-reconnect after 6 seconds if dropped
          setTimeout(connectWebSocket, 6000);
        };
      } catch {
        // Fallback
      }
    };

    connectWebSocket();

    const updateLiveCount = () => {
      const now = Date.now();
      // Remove dead peers
      for (const [id, lastSeen] of peers.entries()) {
        if (id !== myId && now - lastSeen > PEER_TIMEOUT_MS) {
          peers.delete(id);
        }
      }
      setOnlineCount(Math.max(1, peers.size));
    };

    const sendHeartbeat = () => {
      const now = Date.now();
      peers.set(myId, now);

      const msg = JSON.stringify({ type: 'ping', id: myId });

      // Send to WebSocket
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(msg);
      }

      // Send to BroadcastChannel
      if (broadcastChannel) {
        try {
          broadcastChannel.postMessage({ type: 'ping', id: myId });
        } catch { /* ignore */ }
      }

      updateLiveCount();
    };

    // Initial announce
    sendHeartbeat();

    // Heartbeat ticker
    const interval = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS);

    // Prune stale peers every 3 seconds
    const pruneInterval = setInterval(updateLiveCount, 3000);

    // Handle unload / tab close
    const handleBeforeUnload = () => {
      const leaveMsg = JSON.stringify({ type: 'leave', id: myId });
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        try { wsRef.current.send(leaveMsg); } catch { /* ignore */ }
      }
      if (broadcastChannel) {
        try { broadcastChannel.postMessage({ type: 'leave', id: myId }); } catch { /* ignore */ }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      handleBeforeUnload();
      clearInterval(interval);
      clearInterval(pruneInterval);
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
