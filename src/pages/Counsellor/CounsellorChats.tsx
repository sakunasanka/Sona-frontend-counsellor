import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft,
  Send,
  Smile,
  Paperclip,
  Search,
  MoreVertical,
  MessageCircle
} from 'lucide-react';
import { NavBar, Sidebar } from "../../components/layout";

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
  id: number;
  text: string;
  sender: 'me' | 'other';
  time: string;
  status?: 'sent' | 'delivered' | 'read';
}

interface CounsellorChatProps {
  // No props needed currently
}

// Chat List Component
const ChatList: React.FC<{ 
  chats: Chat[], 
  selectedChat: Chat | null, 
  onChatSelect: (chat: Chat) => void,
  getLastMessage?: (chatId: number) => string,
  isMobile?: boolean 
}> = ({ chats, selectedChat, onChatSelect, getLastMessage, isMobile }) => {
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
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onChatSelect(chat)}
            className={`
              flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50
              ${selectedChat?.id === chat.id ? 'bg-pink-50 border-pink-100' : ''}
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
              <div className="ml-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {chat.unreadCount}
              </div>
            )}
          </div>
        ))}
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
          ? 'bg-pink-500 text-white rounded-br-md' 
          : 'bg-gray-100 text-gray-900 rounded-bl-md'
        }
      `}>
        <p className="text-sm">{message.text}</p>
        <div className={`flex items-center justify-end mt-1 ${isMe ? 'text-pink-100' : 'text-gray-500'}`}>
          <span className="text-xs">{message.time}</span>
          {isMe && message.status && (
            <div className="ml-1">
              {message.status === 'sent' && <span className="text-xs">✓</span>}
              {message.status === 'delivered' && <span className="text-xs">✓✓</span>}
              {message.status === 'read' && <span className="text-xs text-pink-200">✓✓</span>}
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
  isMobile?: boolean 
}> = ({ selectedChat, messages, onSendMessage, onBack, isMobile }) => {
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
          <div className="ml-3">
            <h3 className="font-semibold text-gray-900">{selectedChat.name}</h3>
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
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

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
            disabled={!newMessage.trim()}
            className="p-2 bg-primary hover:bg-opacity-90 disabled:bg-gray-300 text-white rounded-lg transition-colors"
          >
            <Send size={20} />
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

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  // Auto-minimize sidebar with animation when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setSidebarMinimized(true);
    }, 300); // Small delay to show the animation
    
    return () => clearTimeout(timer);
  }, []);

  // Handle expansion animation before navigation
  const handleExpandBeforeNavigation = (href: string) => {
    setSidebarMinimized(false);
    // Wait for expansion animation to complete, then navigate
    setTimeout(() => {
      window.location.href = href;
    }, 500); // Match the sidebar transition duration
  };

  // Sample data
  const [chats, setChats] = useState<Chat[]>([
    {
      id: 1,
      name: 'Sarah Johnson',
      lastMessage: 'Thank you for the session yesterday. I feel much better now.',
      time: '2m',
      avatar: '/assets/images/profile-photo.png',
      isOnline: true,
      unreadCount: 2
    },
    {
      id: 2,
      name: 'Michael Chen',
      lastMessage: 'Can we reschedule our appointment for next week?',
      time: '1h',
      avatar: '/assets/images/student-photo.png',
      isOnline: false,
      unreadCount: 0
    },
    {
      id: 3,
      name: 'Emily Davis',
      lastMessage: 'The breathing exercises you taught me are really helping!',
      time: '3h',
      avatar: '/assets/images/profile-photo.png',
      isOnline: true,
      unreadCount: 1
    },
    {
      id: 4,
      name: 'James Wilson',
      lastMessage: 'Looking forward to our session tomorrow.',
      time: '1d',
      avatar: '/assets/images/student-photo.png',
      isOnline: false,
      unreadCount: 0
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Hi Sarah! How are you feeling today?',
      sender: 'me',
      time: '10:30 AM',
      status: 'read'
    },
    {
      id: 2,
      text: 'Hello! I\'m doing much better after our last session. The techniques you taught me are really helping.',
      sender: 'other',
      time: '10:32 AM'
    },
    {
      id: 3,
      text: 'That\'s wonderful to hear! I\'m glad the mindfulness exercises are working for you. Have you been practicing them daily?',
      sender: 'me',
      time: '10:35 AM',
      status: 'read'
    },
    {
      id: 4,
      text: 'Yes, I try to do them every morning. It really sets a positive tone for my day.',
      sender: 'other',
      time: '10:37 AM'
    }
  ]);

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

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: messages.length + 1,
      text,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };
    setMessages([...messages, newMessage]);
    
    // Update the last message in the chat list for the selected chat
    if (selectedChat) {
      const truncatedMessage = text.length > 50 ? text.substring(0, 50) + '...' : text;
      setChats(prevChats => 
        prevChats.map(c => 
          c.id === selectedChat.id 
            ? { ...c, lastMessage: truncatedMessage, time: 'now' }
            : c
        )
      );
    }
  };

  const handleBackToChats = () => {
    setCurrentView('chats');
    setSelectedChat(null);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top Navbar */}
      <NavBar onMenuClick={toggleSidebar} />

      {/* Bottom section: Sidebar + Chat Content */}
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

        {/* Chat Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Desktop Layout */}
          <div className="hidden lg:flex flex-1">
            {/* Chat List */}
            <ChatList
              chats={chats}
              selectedChat={selectedChat}
              onChatSelect={handleChatSelect}
              getLastMessage={getLastMessage}
            />
            
            {/* Chat Area */}
            <ChatArea
              selectedChat={selectedChat}
              messages={selectedChat?.id === 1 ? messages : []}
              onSendMessage={handleSendMessage}
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
              />
            ) : (
              <ChatArea
                selectedChat={selectedChat}
                messages={selectedChat?.id === 1 ? messages : []}
                onSendMessage={handleSendMessage}
                onBack={handleBackToChats}
                isMobile={true}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounsellorChat;