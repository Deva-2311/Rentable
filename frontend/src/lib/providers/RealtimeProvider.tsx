'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from 'react';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/lib/auth/AuthContext';

interface RealtimeContextType {
  isConnected: boolean;
}

const RealtimeContext = createContext<RealtimeContextType>({ isConnected: false });

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);
  const isConnectedRef = useRef(false);

  const handleEvent = useCallback(
    (event: string, data: { message: string }) => {
      const iconMap: Record<string, string> = {
        'booking:new_request': '📬',
        'booking:status_updated': '🔔',
        'rental:active': '✅',
        'rental:return_requested': '📦',
        'rental:completed': '🎉',
      };
      const icon = iconMap[event] || '🔔';
      toast(`${icon} ${data.message}`, {
        duration: 5000,
        style: {
          background: 'hsl(var(--card))',
          color: 'hsl(var(--foreground))',
          border: '1px solid hsl(var(--border))',
          borderRadius: '2px',
          fontFamily: 'inherit',
          fontSize: '13px',
        },
      });

      // Invalidate relevant queries so dashboards auto-refresh
      if (event.startsWith('booking:')) {
        queryClient.invalidateQueries({ queryKey: ['bookings'] });
        queryClient.invalidateQueries({ queryKey: ['owner', 'bookings'] });
      }
      if (event.startsWith('rental:')) {
        queryClient.invalidateQueries({ queryKey: ['rentals'] });
        queryClient.invalidateQueries({ queryKey: ['bookings'] });
        queryClient.invalidateQueries({ queryKey: ['owner', 'bookings'] });
      }
    },
    [queryClient]
  );

  useEffect(() => {
    if (!user) {
      // Disconnect if user logs out
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        isConnectedRef.current = false;
      }
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001';

    const socket = io(BACKEND_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      isConnectedRef.current = true;
      console.log('[Realtime] Connected:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      isConnectedRef.current = false;
      console.log('[Realtime] Disconnected:', reason);
    });

    // ── Listen for all business events ───────────────────────────────────────
    const events = [
      'booking:new_request',
      'booking:status_updated',
      'rental:active',
      'rental:return_requested',
      'rental:completed',
    ];

    events.forEach((event) => {
      socket.on(event, (data) => handleEvent(event, data));
    });

    return () => {
      events.forEach((event) => socket.off(event));
      socket.disconnect();
      socketRef.current = null;
      isConnectedRef.current = false;
    };
  }, [user, handleEvent]);

  return (
    // eslint-disable-next-line react-hooks/refs
    <RealtimeContext.Provider value={{ isConnected: isConnectedRef.current }}>
      {children}
    </RealtimeContext.Provider>
  );
}

export const useRealtime = () => useContext(RealtimeContext);
