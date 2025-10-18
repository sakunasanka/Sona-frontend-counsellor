import { useEffect, useCallback, useRef } from 'react';
import { chatWebSocketService, ChatMessage as WSChatMessage, TypingStatus } from '../api/chatWebSocket';

interface UseWebSocketChatOptions {
  roomId: string | null;
  userId: string | null;
  token?: string;
  onMessage?: (message: WSChatMessage) => void;
  onTyping?: (typing: TypingStatus) => void;
  onConnectionChange?: (connected: boolean) => void;
  onError?: (error: Error) => void;
  enabled?: boolean; // Allow enabling/disabling the connection
}

/**
 * Custom hook for WebSocket chat functionality
 * Manages connection, reconnection, and event listeners
 */
export const useWebSocketChat = ({
  roomId,
  userId,
  token,
  onMessage,
  onTyping,
  onConnectionChange,
  onError,
  enabled = true,
}: UseWebSocketChatOptions) => {
  const isConnectedRef = useRef(false);
  const cleanupFnsRef = useRef<(() => void)[]>([]);

  // Cleanup function to remove all listeners and disconnect
  const cleanup = useCallback(() => {
    console.log('🧹 Cleaning up WebSocket connection');
    
    // Call all cleanup functions
    cleanupFnsRef.current.forEach(fn => fn());
    cleanupFnsRef.current = [];
    
    // Disconnect socket
    chatWebSocketService.disconnect();
    isConnectedRef.current = false;
  }, []);

  // Connect to WebSocket
  useEffect(() => {
    // Don't connect if disabled or missing required params
    if (!enabled || !roomId || !userId) {
      console.log('⏸️ WebSocket connection skipped:', { enabled, roomId, userId });
      return;
    }

    console.log('🚀 Setting up WebSocket connection for room:', roomId);

    // Connect to WebSocket
    chatWebSocketService.connect(roomId, userId, token);
    isConnectedRef.current = true;

    // Setup event listeners
    if (onMessage) {
      const unsubscribe = chatWebSocketService.onMessage(onMessage);
      cleanupFnsRef.current.push(unsubscribe);
    }

    if (onTyping) {
      const unsubscribe = chatWebSocketService.onTyping(onTyping);
      cleanupFnsRef.current.push(unsubscribe);
    }

    if (onConnectionChange) {
      const unsubscribe = chatWebSocketService.onConnectionChange(onConnectionChange);
      cleanupFnsRef.current.push(unsubscribe);
    }

    if (onError) {
      const unsubscribe = chatWebSocketService.onError(onError);
      cleanupFnsRef.current.push(unsubscribe);
    }

    // Cleanup on unmount or when dependencies change
    return cleanup;
  }, [roomId, userId, token, enabled, onMessage, onTyping, onConnectionChange, onError, cleanup]);

  // Send message function
  const sendMessage = useCallback((message: string, messageType: string = 'text') => {
    if (!roomId) {
      console.error('❌ Cannot send message: No room ID');
      return;
    }

    if (!chatWebSocketService.isConnected()) {
      console.warn('⚠️ WebSocket not connected, message may not be sent');
    }

    chatWebSocketService.sendMessage(roomId, message, messageType);
  }, [roomId]);

  // Send typing status
  const sendTypingStatus = useCallback((isTyping: boolean) => {
    if (!roomId) return;
    chatWebSocketService.sendTypingStatus(isTyping, roomId);
  }, [roomId]);

  // Check connection status
  const isConnected = useCallback(() => {
    return chatWebSocketService.isConnected();
  }, []);

  return {
    sendMessage,
    sendTypingStatus,
    isConnected,
    disconnect: cleanup,
  };
};
