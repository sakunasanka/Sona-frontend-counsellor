import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  ArrowLeft,
  Send,
  Smile,
  Paperclip,
  Search,
  MoreVertical,
  MessageCircle,
  Wifi,
  WifiOff
} from 'lucide-react';
import { NavBar, Sidebar } from "../../components/layout";
import { getCouncilorChatRooms, sendMessageToChatRoom, getChatRoomMessages, markChatRoomAsRead } from '../../api/counsellorAPI';
import { useWebSocketChat } from '../../hooks/useWebSocketChat';
import type { ChatMessage as WSChatMessage } from '../../api/chatWebSocket';

// Define ChatRoom interface locally if not exported
interface ChatRoom {
  id: number;
  name: string | null;
  type: string;
  counselorId: number;
  clientId: number;
  createdAt: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  clientName: string;
  clientAvatar: string;
}

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  avatar: string;
  isOnline: boolean;
  unreadCount: number;
}

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  time: string;
  status?: 'sent' | 'delivered' | 'read';
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
  senderType?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface CounsellorChatProps {
  // No props needed currently
}

// Chat List Component
const ChatList: React.FC<{ 
  chats: Chat[], 
  selectedChat: Chat | null, 
  onChatSelect: (chat: Chat) => void,
  getLastMessage?: (chatId: number) => string,
  isMobile?: boolean,
  isLoading?: boolean
}> = ({ chats, selectedChat, onChatSelect, getLastMessage, isMobile, isLoading = false }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`
      bg-white border-r border-gray-200 flex flex-col h-full
      ${isMobile ? 'w-full' : 'w-80'}
    `}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Messages</h2>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <MoreVertical size={20} className="text-gray-600" />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          {searchTerm && (
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setSearchTerm('')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading chats...</p>
            </div>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex items-center justify-center h-full p-8">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations yet</h3>
              <p className="text-gray-600 text-sm">
                {searchTerm ? 'No chats match your search' : 'Your conversations will appear here'}
              </p>
            </div>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onChatSelect(chat)}
              className={`
                flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50
                ${selectedChat?.id === chat.id ? 'bg-slate-50 border-slate-100' : ''}
              `}
            >
              <div className="relative">
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {chat.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
                  <span className="text-xs text-gray-500">{chat.time}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {getLastMessage ? getLastMessage(chat.id) : chat.lastMessage}
                </p>
              </div>
              
              {chat.unreadCount > 0 && (
                <div className="ml-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {chat.unreadCount}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Message Bubble Component
const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isMe = message.sender === 'me';
  
  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`
        max-w-xs lg:max-w-md px-4 py-2 rounded-2xl
        ${isMe 
          ? 'bg-slate-800 text-white rounded-br-md' 
          : 'bg-gray-100 text-gray-900 rounded-bl-md'
        }
      `}>
        <p className="text-sm">{message.text}</p>
        <div className={`flex items-center justify-end mt-1 ${isMe ? 'text-slate-100' : 'text-gray-500'}`}>
          <span className="text-xs">{message.time}</span>
          {isMe && message.status && (
            <div className="ml-1">
              {message.status === 'sent' && <span className="text-xs">✓</span>}
              {message.status === 'delivered' && <span className="text-xs">✓✓</span>}
              {message.status === 'read' && <span className="text-xs text-slate-200">✓✓</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Chat Area Component
const ChatArea: React.FC<{ 
  selectedChat: Chat | null, 
  messages: Message[], 
  onSendMessage: (text: string) => void,
  onBack?: () => void,
  isMobile?: boolean,
  isSending?: boolean,
  isWsConnected?: boolean,
  typingUsers?: Record<string, string>,
  isLoadingMessages?: boolean
}> = ({ selectedChat, messages, onSendMessage, onBack, isMobile, isSending = false, isWsConnected = false, typingUsers = {}, isLoadingMessages = false }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
      // Immediately scroll to bottom after sending
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a conversation</h3>
          <p className="text-gray-600">Choose from your existing conversations or start a new one</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
        <div className="flex items-center">
          {isMobile && (
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full mr-2">
              <ArrowLeft size={20} />
            </button>
          )}
          <img
            src={selectedChat.avatar}
            alt={selectedChat.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="ml-3 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{selectedChat.name}</h3>
              {/* WebSocket Connection Status Indicator */}
              <span title={isWsConnected ? "Real-time connected" : "Real-time disconnected"}>
                {isWsConnected ? (
                  <Wifi size={16} className="text-green-500" />
                ) : (
                  <WifiOff size={16} className="text-red-500" />
                )}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              {selectedChat.isOnline ? 'Active now' : 'Last seen recently'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col">
        <div className="flex-1"></div>
        <div>
          {isLoadingMessages ? (
            <div className="flex justify-center items-center py-8">
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span>Loading messages...</span>
              </div>
            </div>
          ) : messages.length > 0 ? (
            messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))
          ) : (
            <div className="flex justify-center items-center py-8">
              <div className="text-gray-500 text-center">
                <MessageCircle size={48} className="mx-auto mb-2 opacity-50" />
                <p>No messages yet</p>
                <p className="text-sm">Start a conversation!</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Typing Indicator */}
      {Object.keys(typingUsers).length > 0 && (
        <div className="px-4 py-2 bg-gray-50 text-sm text-gray-600 italic">
          {Object.values(typingUsers)[0]} is typing...
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Paperclip size={20} className="text-gray-600" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
            {newMessage && (
              <button 
                className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setNewMessage('')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full">
              <Smile size={16} className="text-gray-600" />
            </button>
          </div>
          <button
            onClick={handleSend}
            disabled={!newMessage.trim() || isSending}
            className="p-2 bg-primary hover:bg-opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            {isSending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Chat Component
const CounsellorChat: React.FC<CounsellorChatProps> = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [currentView, setCurrentView] = useState<'chats' | 'chat'>('chats'); // For mobile navigation
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [isWsConnected, setIsWsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Record<string, string>>({}); // userId -> userName
  const token = localStorage.getItem('auth_token') || '';
  const counsellorId = localStorage.getItem('counsellor_id') || '';

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  // Handle incoming WebSocket messages
  const handleWsMessage = useCallback((wsMessage: WSChatMessage) => {
    console.log('📨 Received WebSocket message:', wsMessage);
    
    // Transform WebSocket message to our Message format
    const newMessage: Message = {
      id: wsMessage.id,
      text: wsMessage.message,
      sender: wsMessage.senderId === counsellorId ? 'me' : 'other',
      time: new Date(wsMessage.createdAt).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      status: 'delivered',
      senderId: wsMessage.senderId,
      senderName: wsMessage.senderName,
      senderAvatar: wsMessage.senderAvatar,
      senderType: wsMessage.senderType,
    };

    // Only add message if it's for the currently selected chat
    if (selectedChat && String(selectedChat.id) === wsMessage.roomId) {
      setMessages(prevMessages => {
        // Check if message already exists to prevent duplicates
        const exists = prevMessages.some(msg => msg.id === newMessage.id);
        if (exists) {
          console.log('⚠️ Duplicate message detected, skipping');
          return prevMessages;
        }
        return [...prevMessages, newMessage];
      });
    }

    // Update last message in chat list
    setChats(prevChats => 
      prevChats.map(c => {
        if (String(c.id) === wsMessage.roomId) {
          const truncatedMessage = wsMessage.message.length > 50 
            ? wsMessage.message.substring(0, 50) + '...' 
            : wsMessage.message;
          return {
            ...c,
            lastMessage: truncatedMessage,
            time: 'now',
            // Increment unread count if not current chat
            unreadCount: selectedChat?.id === c.id ? 0 : (c.unreadCount || 0) + 1,
          };
        }
        return c;
      })
    );
  }, [selectedChat, counsellorId]);

  // Handle typing status
  const handleTypingStatus = useCallback((typing: { userId: string; userName: string; isTyping: boolean; roomId: string }) => {
    console.log('✏️ Typing status:', typing);
    
    // Don't show typing indicator for own messages
    if (typing.userId === counsellorId) return;

    // Only show typing for current chat
    if (selectedChat && String(selectedChat.id) === typing.roomId) {
      setTypingUsers(prev => {
        const newTypingUsers = { ...prev };
        if (typing.isTyping) {
          newTypingUsers[typing.userId] = typing.userName;
        } else {
          delete newTypingUsers[typing.userId];
        }
        return newTypingUsers;
      });
    }
  }, [selectedChat, counsellorId]);

  // Handle connection status
  const handleConnectionChange = useCallback((connected: boolean) => {
    console.log('🔌 WebSocket connection status:', connected);
    setIsWsConnected(connected);
  }, []);

  // Handle WebSocket errors
  const handleWsError = useCallback((error: Error) => {
    console.error('❌ WebSocket error:', error);
    // You can show a toast notification here
  }, []);

  // Initialize WebSocket connection
  // Note: We don't need sendMessage from WebSocket anymore
  // Messages are sent via HTTP API, and backend broadcasts them via WebSocket
  useWebSocketChat({
    roomId: selectedChat ? String(selectedChat.id) : null,
    userId: counsellorId,
    token,
    onMessage: handleWsMessage,
    onTyping: handleTypingStatus,
    onConnectionChange: handleConnectionChange,
    onError: handleWsError,
    enabled: !!selectedChat, // Only connect when a chat is selected
  });

  const getChatRooms = useCallback(async () => {
    // Helper function to format timestamp
    const formatTime = (timestamp: string): string => {
      if (!timestamp) return '';
      
      const now = new Date();
      const messageTime = new Date(timestamp);
      const diffMs = now.getTime() - messageTime.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      if (diffMins < 1) return 'now';
      if (diffMins < 60) return `${diffMins}m`;
      if (diffHours < 24) return `${diffHours}h`;
      if (diffDays < 7) return `${diffDays}d`;
      
      return messageTime.toLocaleDateString();
    };

    setIsLoadingChats(true);
    try {
      const response = await getCouncilorChatRooms();
      console.log('Chat rooms fetched:', response);
      setChatRooms(
        response.map((room) => ({
          ...room,
          unread_count: Number(room.unread_count) || 0,
        }))
      );
      
      // Transform ChatRoom[] to Chat[] format
      const transformedChats: Chat[] = response.map((room) => ({
        id: room.id,
        name: room.clientName || 'Unknown Client',
        lastMessage: room.last_message || 'No messages yet',
        time: formatTime(room.last_message_time),
        avatar: room.clientAvatar || 'https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png',
        isOnline: false, // You can add online status from your API if available
        unreadCount: Number(room.unread_count) || 0
      }));
      
      setChats(transformedChats);
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
    } finally {
      setIsLoadingChats(false);
    }
  }, []);

  // Auto-minimize sidebar with animation when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setSidebarMinimized(true);
    }, 300); // Small delay to show the animation
    
    return () => clearTimeout(timer);
  }, []);


  // Fetch chat rooms on mount
  useEffect(() => {
    getChatRooms();
  }, [getChatRooms]);

  // Log chatRooms whenever it changes
  useEffect(() => {
    if (chatRooms.length > 0) {
      console.log("Chat Rooms updated:", chatRooms);
    }
  }, [chatRooms]);

  // Handle expansion animation before navigation
  const handleExpandBeforeNavigation = (href: string) => {
    setSidebarMinimized(false);
    // Wait for expansion animation to complete, then navigate
    setTimeout(() => {
      window.location.href = href;
    }, 500); // Match the sidebar transition duration
  };

  // Chats state - will be populated from API
  const [chats, setChats] = useState<Chat[]>([]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Fetch messages for a specific chat room
  const fetchChatMessages = useCallback(async (chatId: number) => {
    if (!token) {
      console.error('No auth token available');
      return;
    }

    setIsLoadingMessages(true);
    console.log('🔄 Fetching messages for chat:', chatId);

    try {
      const result = await getChatRoomMessages(
        String(chatId),
        1, // page
        50, // limit
        token
      );

      console.log('📋 getChatRoomMessages result:', result);

      if (result.success && result.messages) {
        console.log('✅ Messages fetched successfully:', {
          count: result.messages.length,
          chatId,
          messages: result.messages
        });

        // Transform ChatMessage[] to Message[] format
        const transformedMessages: Message[] = result.messages.map((msg) => ({
          id: String(msg.id),
          text: msg.message,
          sender: String(msg.senderId) === counsellorId ? 'me' : 'other',
          time: new Date(msg.createdAt).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          status: 'delivered',
          senderId: String(msg.senderId),
          senderName: msg.senderName,
          senderAvatar: msg.senderAvatar,
          senderType: msg.senderType,
        }));

        setMessages(transformedMessages);
        console.log('📱 Transformed messages:', transformedMessages);

        // Mark chat as read if there are messages
        if (result.messages.length > 0) {
          const lastMessage = result.messages[result.messages.length - 1];
          const lastMessageId = String(lastMessage.id);

          console.log('📖 Marking chat as read up to message:', lastMessageId);

          try {
            const markReadResult = await markChatRoomAsRead(
              String(chatId),
              lastMessageId,
              token
            );

            if (markReadResult.success) {
              console.log('✅ Chat marked as read successfully');
            } else {
              console.warn('⚠️ Failed to mark chat as read:', markReadResult.error);
            }
          } catch (markReadError) {
            console.error('❌ Error marking chat as read:', markReadError);
          }
        }
      } else {
        console.warn('⚠️ Failed to fetch messages:', result.error);
        setMessages([]); // Clear messages if fetch fails
      }
    } catch (error) {
      console.error('❌ Error fetching messages:', error);
      setMessages([]); // Clear messages on error
    } finally {
      setIsLoadingMessages(false);
    }
  }, [token, counsellorId]);

  // Function to get the last message for a chat
  const getLastMessage = (chatId: number): string => {
    if (chatId === 1 && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      // Truncate message to fit in one line (about 50 characters)
      return lastMessage.text.length > 50 
        ? lastMessage.text.substring(0, 50) + '...'
        : lastMessage.text;
    }
    
    // For other chats, use the default message from sample data
    const chat = chats.find(c => c.id === chatId);
    return chat?.lastMessage || '';
  };

  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);
    
    // Fetch messages for the selected chat
    fetchChatMessages(chat.id);
    
    // Clear unread count when chat is opened
    if (chat.unreadCount > 0) {
      setChats(prevChats => 
        prevChats.map(c => 
          c.id === chat.id 
            ? { ...c, unreadCount: 0 }
            : c
        )
      );
    }
    
    if (window.innerWidth < 1024) {
      setCurrentView('chat');
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!selectedChat) {
      console.error('No chat selected');
      return;
    }

    setIsSendingMessage(true);

    console.log('user token: ', token)
    try {
      // Send via HTTP API (for persistence)
      // The backend will broadcast the message to all users in the room via WebSocket (including sender)
      const response = await sendMessageToChatRoom(
        String(selectedChat.id),
        text,
        Number(counsellorId),
        'text',
        token
      );

      if (response.success && response.messageData) {
        console.log('✅ Message sent successfully via API:', response.messageData);
        
        // DON'T add message locally here - wait for WebSocket broadcast
        // The backend will send it back via 'new_message' event
        // This prevents duplicate messages and ensures consistency
        
        // Update the last message in the chat list for optimistic UI
        const truncatedMessage = text.length > 50 ? text.substring(0, 50) + '...' : text;
        setChats(prevChats => 
          prevChats.map(c => 
            c.id === selectedChat.id 
              ? { ...c, lastMessage: truncatedMessage, time: 'now' }
              : c
          )
        );

        // Note: The actual message will appear when we receive the WebSocket event
      } else {
        console.error('Failed to send message:', response.error);
        // You could show an error toast here
        alert('Failed to send message: ' + response.error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // You could show an error toast here
      alert('Error sending message. Please try again.');
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleBackToChats = () => {
    setCurrentView('chats');
    setSelectedChat(null);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Minimized Sidebar - Always visible on desktop */}
        <div className="hidden lg:block">
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={closeSidebar} 
            isMinimized={sidebarMinimized}
            onExpandBeforeNavigation={handleExpandBeforeNavigation}
          />
        </div>

        {/* Mobile Sidebar */}
        <div className="lg:hidden">
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={closeSidebar}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Navbar */}
          <NavBar onMenuClick={toggleSidebar} />

          {/* Chat Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Desktop Layout */}
            <div className="hidden lg:flex flex-1">
              {/* Chat List */}
              <ChatList
                chats={chats}
                selectedChat={selectedChat}
                onChatSelect={handleChatSelect}
                getLastMessage={getLastMessage}
                isLoading={isLoadingChats}
              />
              
              {/* Chat Area */}
              <ChatArea
                selectedChat={selectedChat}
                messages={messages}
                onSendMessage={handleSendMessage}
                isSending={isSendingMessage}
                isWsConnected={isWsConnected}
                typingUsers={typingUsers}
                isLoadingMessages={isLoadingMessages}
              />
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden flex-1 flex flex-col">
              {currentView === 'chats' ? (
                <ChatList
                  chats={chats}
                  selectedChat={selectedChat}
                  onChatSelect={handleChatSelect}
                  getLastMessage={getLastMessage}
                  isMobile={true}
                  isLoading={isLoadingChats}
                />
              ) : (
                <ChatArea
                  selectedChat={selectedChat}
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  onBack={handleBackToChats}
                  isMobile={true}
                  isSending={isSendingMessage}
                  isWsConnected={isWsConnected}
                  typingUsers={typingUsers}
                  isLoadingMessages={isLoadingMessages}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounsellorChat;