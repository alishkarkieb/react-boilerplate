import { useEffect, useState, useCallback, useRef } from 'react';
import { useSocket } from '../utils/socketContext';

export interface ChatMessage {
  id: string;
  room: string;
  sender: string;
  text: string;
  timestamp: string;
  isMe: boolean; 
}

export const useChat = (roomId: string, userId: string) => {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  // Use a ref to keep track of joined room to prevent duplicate joins
  const joinedRoomRef = useRef<string | null>(null);

  // Typing State
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!socket || !isConnected || !roomId || !userId) return;

    // Join room
    if (joinedRoomRef.current !== roomId) {
        // Emit only the roomId string to match Backend's handleJoinRoom(client, room: string)
        socket.emit('joinRoom', roomId);
        joinedRoomRef.current = roomId;
        // Optional: Clear messages when switching rooms
        setMessages([]); 
        setTypingUsers(new Set());
    }

    // Listener for incoming messages
    const handleReceiveMessage = (payload: any) => {
        // Ensure the message belongs to the current room
        if (payload.room === roomId) {
            const newMessage: ChatMessage = {
                id: payload.id || Date.now().toString(),
                room: payload.room,
                sender: payload.sender, // Assuming backend sends 'sender' (userId)
                text: payload.message,
                timestamp: payload.timestamp || new Date().toISOString(),
                isMe: payload.sender === userId
            };
            console.log(newMessage)
            setMessages((prev) => [...prev, newMessage]);
            
            // If user sent a message, they stopped typing
            setTypingUsers(prev => {
                const next = new Set(prev);
                next.delete(payload.sender);
                return next;
            });
        }
    };

    const handleTyping = (payload: { room: string, user: string, isTyping: boolean }) => {
        if (payload.room !== roomId) return;
        
        setTypingUsers(prev => {
            const next = new Set(prev);
            if (payload.isTyping) {
                next.add(payload.user);
            } else {
                next.delete(payload.user);
            }
            return next;
        });
    };

    socket.on('receiveMessage', handleReceiveMessage);
    socket.on('typing', handleTyping);
    
    // Debug: Listen to all events
    socket.onAny((event, ...args) => {
        console.log(`[Socket Event] ${event}`, args);
    });

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
      socket.off('typing', handleTyping);
      socket.offAny();
       // Optional: Leave room logic if backend supports it
       // socket.emit('leaveRoom', roomId);
       joinedRoomRef.current = null;
    };
  }, [socket, isConnected, roomId, userId]);

  const sendMessage = useCallback((text: string) => {
    if (!socket || !isConnected) return;

    const payload = {
        room: roomId,
        message: text,
        sender: userId,
        timestamp: new Date().toISOString()
    };

    console.log('[Frontend] Emitting sendMessage:', payload);
    socket.emit('sendMessage', payload);
    
    // Stop typing immediately when sending
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    socket.emit('typing', { room: roomId, user: userId, isTyping: false });

  }, [socket, isConnected, roomId, userId]);

  const sendTyping = useCallback((isTyping: boolean) => {
    if (!socket || !isConnected) return;
    
    socket.emit('typing', { room: roomId, user: userId, isTyping });
    
    // Auto-stop typing after 3 seconds if no new input
    if (isTyping) {
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('typing', { room: roomId, user: userId, isTyping: false });
        }, 3000);
    }
  }, [socket, isConnected, roomId, userId]);

  return { messages, sendMessage, isConnected, typingUsers, sendTyping };
};
