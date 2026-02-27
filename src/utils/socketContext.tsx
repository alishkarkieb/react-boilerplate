import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { useAuth } from './authContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: Set<string>;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Replace with your actual backend URL
const SOCKET_URL = import.meta.env.VITE_PUBLIC_SOCKET_ENDPOINT || 'http://localhost:3000';

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const { token } = useAuth();
  
  // Get current user ID from token
  const currentUserId = React.useMemo(() => {
      if (!token) return null;
      try {
          // decoding manually nicely or using jwt-decode if you prefer, 
          // reusing what you have in authContext or similar
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          const decoded = JSON.parse(jsonPayload);
          return decoded.userId || decoded.sub;
      } catch (e) {
          return null;
      }
  }, [token]);

  useEffect(() => {
    if (!token) return;

    const newSocket = io(SOCKET_URL, {
      auth: {
        token: token,
      },
      transports: ['websocket'], // Force WebSocket to avoid polling issues
      autoConnect: true,
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      setIsConnected(true);
      
      // Register user presence
       if (currentUserId) {
           newSocket.emit('register', currentUserId);
       }
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setIsConnected(false);
      setOnlineUsers(new Set());
    });

    newSocket.on('connect_error', (err: Error) => {
        console.error('Socket connection error:', err);
    });
    
    // Presence Listeners
    newSocket.on('userOnline', (userId: string) => {
        setOnlineUsers(prev => {
            const next = new Set(prev);
            next.add(userId);
            return next;
        });
    });
    
    newSocket.on('userOffline', (userId: string) => {
        setOnlineUsers(prev => {
            const next = new Set(prev);
            next.delete(userId);
            return next;
        });
    });
    
    // Optional: Received initial list of online users
    newSocket.on('onlineUsersList', (userIds: string[]) => {
         setOnlineUsers(new Set(userIds));
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [token, currentUserId]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
