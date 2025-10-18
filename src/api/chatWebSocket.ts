import { io, Socket } from 'socket.io-client';

interface ChatMessage {
  id: string;
  message: string;
  senderId: string;
  senderName?: string;
  senderAvatar?: string;
  senderType?: string;
  createdAt: string;
  roomId: string;
  messageType: string;
}

interface TypingStatus {
  userId: string;
  userName: string;
  isTyping: boolean;
  roomId: string;
}

class ChatWebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private messageListeners: ((message: ChatMessage) => void)[] = [];
  private typingListeners: ((typing: TypingStatus) => void)[] = [];
  private connectionListeners: ((connected: boolean) => void)[] = [];
  private errorListeners: ((error: Error) => void)[] = [];
  private currentRoomId: string | null = null;

  constructor(private baseUrl: string) {}

  /**
   * Connect to WebSocket server and join a chat room
   */
  connect(roomId: string, userId: string, token?: string) {
    this.currentRoomId = roomId;

    try {
      // Disconnect existing socket if any
      if (this.socket) {
        this.socket.disconnect();
      }

      console.log('🔗 Connecting to WebSocket server:', {
        url: this.baseUrl,
        roomId,
        userId,
        hasToken: !!token,
      });

      // Create socket connection
      this.socket = io(this.baseUrl, {
        auth: {
          token: token,
        },
        query: {
          token: token,
        },
        transports: ['websocket', 'polling'], // Try WebSocket first, fallback to polling
        timeout: 10000,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
      });

      this.setupEventListeners();
    } catch (error) {
      console.error('❌ Error connecting to WebSocket:', error);
      this.notifyErrorListeners(error as Error);
    }
  }

  /**
   * Setup all socket event listeners
   */
  private setupEventListeners() {
    if (!this.socket) return;

    // ========== Connection Events ==========
    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected successfully!', {
        socketId: this.socket?.id,
        transport: this.socket?.io?.engine?.transport?.name,
        roomId: this.currentRoomId,
      });
      
      this.reconnectAttempts = 0;
      this.notifyConnectionListeners(true);

      // Auto-join room after connection
      if (this.currentRoomId) {
        this.joinRoom(this.currentRoomId);
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 WebSocket disconnected:', reason);
      this.notifyConnectionListeners(false);

      // Auto-reconnect for certain reasons
      if (reason === 'io server disconnect') {
        // Server disconnected, need to reconnect manually
        this.socket?.connect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error.message);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('❌ Max reconnection attempts reached');
        this.notifyErrorListeners(new Error('Failed to connect after maximum attempts'));
      }
    });

    // ========== Message Events ==========
    this.socket.on('new_message', (data) => {
      console.log('💬 New message received:', data);
      
      if (data.message) {
        const message: ChatMessage = {
          id: data.message.id,
          message: data.message.message,
          senderId: data.message.senderId,
          senderName: data.message.senderName,
          senderAvatar: data.message.senderAvatar,
          senderType: data.message.senderType,
          createdAt: data.message.createdAt,
          roomId: data.message.roomId || this.currentRoomId || '',
          messageType: data.message.messageType || 'text',
        };
        
        this.notifyMessageListeners(message);
      }
    });

    // ========== Typing Events ==========
    this.socket.on('user_typing', (data) => {
      console.log('✏️ User typing:', data);
      this.notifyTypingListeners({
        userId: data.userId,
        userName: data.userName,
        isTyping: true,
        roomId: data.roomId || this.currentRoomId || '',
      });
    });

    this.socket.on('user_stopped_typing', (data) => {
      console.log('✋ User stopped typing:', data);
      this.notifyTypingListeners({
        userId: data.userId,
        userName: data.userName,
        isTyping: false,
        roomId: data.roomId || this.currentRoomId || '',
      });
    });

    // ========== Room Events ==========
    this.socket.on('joined_room', (data) => {
      console.log('🏠 Successfully joined room:', data);
    });

    this.socket.on('user_joined_room', (data) => {
      console.log('👥 User joined room:', data);
    });

    this.socket.on('user_left_room', (data) => {
      console.log('👋 User left room:', data);
    });

    // ========== Error Events ==========
    this.socket.on('error', (error) => {
      console.error('❌ Socket error:', error);
      this.notifyErrorListeners(error);
    });

    // ========== Reconnection Events ==========
    this.socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Reconnected after', attemptNumber, 'attempts');
      this.reconnectAttempts = 0;
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log('🔄 Reconnection attempt', attemptNumber);
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('❌ Reconnection error:', error);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('❌ Reconnection failed');
      this.notifyErrorListeners(new Error('Failed to reconnect'));
    });
  }

  /**
   * Join a specific chat room
   */
  joinRoom(roomId: string) {
    if (this.socket?.connected) {
      console.log('🏠 Joining chat room:', roomId);
      this.socket.emit('join_room', { roomId });
      this.currentRoomId = roomId;
    } else {
      console.warn('⚠️ Socket not connected, cannot join room');
    }
  }

  /**
   * Leave current chat room
   */
  leaveRoom(roomId: string) {
    if (this.socket?.connected) {
      console.log('👋 Leaving chat room:', roomId);
      this.socket.emit('leave_room', { roomId });
    }
  }

  /**
   * Send a message to the current room
   */
  sendMessage(roomId: string, message: string, messageType: string = 'text') {
    if (this.socket?.connected) {
      console.log('📤 Sending message:', { roomId, message, messageType });
      this.socket.emit('send_message', {
        roomId,
        message,
        messageType,
      });
    } else {
      console.warn('⚠️ Socket not connected, cannot send message');
      this.notifyErrorListeners(new Error('Not connected to WebSocket'));
    }
  }

  /**
   * Send typing status
   */
  sendTypingStatus(isTyping: boolean, roomId: string) {
    if (this.socket?.connected) {
      if (isTyping) {
        this.socket.emit('typing_start', { roomId });
      } else {
        this.socket.emit('typing_stop', { roomId });
      }
    }
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect() {
    if (this.socket) {
      console.log('🔌 Disconnecting WebSocket');
      
      // Leave current room before disconnecting
      if (this.currentRoomId) {
        this.leaveRoom(this.currentRoomId);
      }
      
      this.socket.disconnect();
      this.socket = null;
      this.currentRoomId = null;
    }
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  // ========== Event Listener Management ==========

  /**
   * Subscribe to new messages
   */
  onMessage(listener: (message: ChatMessage) => void): () => void {
    this.messageListeners.push(listener);
    return () => {
      this.messageListeners = this.messageListeners.filter(l => l !== listener);
    };
  }

  /**
   * Subscribe to typing status changes
   */
  onTyping(listener: (typing: TypingStatus) => void): () => void {
    this.typingListeners.push(listener);
    return () => {
      this.typingListeners = this.typingListeners.filter(l => l !== listener);
    };
  }

  /**
   * Subscribe to connection status changes
   */
  onConnectionChange(listener: (connected: boolean) => void): () => void {
    this.connectionListeners.push(listener);
    return () => {
      this.connectionListeners = this.connectionListeners.filter(l => l !== listener);
    };
  }

  /**
   * Subscribe to errors
   */
  onError(listener: (error: Error) => void): () => void {
    this.errorListeners.push(listener);
    return () => {
      this.errorListeners = this.errorListeners.filter(l => l !== listener);
    };
  }

  // ========== Internal Notification Methods ==========

  private notifyMessageListeners(message: ChatMessage) {
    this.messageListeners.forEach(listener => {
      try {
        listener(message);
      } catch (error) {
        console.error('Error in message listener:', error);
      }
    });
  }

  private notifyTypingListeners(typing: TypingStatus) {
    this.typingListeners.forEach(listener => {
      try {
        listener(typing);
      } catch (error) {
        console.error('Error in typing listener:', error);
      }
    });
  }

  private notifyConnectionListeners(connected: boolean) {
    this.connectionListeners.forEach(listener => {
      try {
        listener(connected);
      } catch (error) {
        console.error('Error in connection listener:', error);
      }
    });
  }

  private notifyErrorListeners(error: Error) {
    this.errorListeners.forEach(listener => {
      try {
        listener(error);
      } catch (error) {
        console.error('Error in error listener:', error);
      }
    });
  }
}

// Get WebSocket URL from environment or use default
const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:5001';

// Create and export singleton instance
export const chatWebSocketService = new ChatWebSocketService(WS_URL);

// Export types
export type { ChatMessage, TypingStatus };
