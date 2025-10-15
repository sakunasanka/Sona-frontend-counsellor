import React, { useState, useRef, useEffect } from 'react';
import { X, Check, CheckCheck, Trash2, Bell, Info, CheckCircle, AlertTriangle, AlertCircle, MessageSquare } from 'lucide-react';
import { Notification, NotificationType } from '../../api/notificationAPI';
import { useNavigate } from 'react-router-dom';

interface NotificationDropdownProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (notificationId: number) => Promise<void>;
  onMarkAllAsRead: () => Promise<void>;
  onDeleteNotification: (notificationId: number) => Promise<void>;
  onClearAll: () => Promise<void>;
  isOpen: boolean;
  onClose: () => void;
}

// Color schemes for each notification type
const notificationColors = {
  [NotificationType.INFO]: {
    bg: 'bg-blue-50',
    hoverBg: 'hover:bg-blue-100',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
    icon: 'text-blue-600',
    IconComponent: Info,
  },
  [NotificationType.SUCCESS]: {
    bg: 'bg-green-50',
    hoverBg: 'hover:bg-green-100',
    border: 'border-green-200',
    dot: 'bg-green-500',
    icon: 'text-green-600',
    IconComponent: CheckCircle,
  },
  [NotificationType.WARNING]: {
    bg: 'bg-yellow-50',
    hoverBg: 'hover:bg-yellow-100',
    border: 'border-yellow-200',
    dot: 'bg-yellow-500',
    icon: 'text-yellow-600',
    IconComponent: AlertTriangle,
  },
  [NotificationType.DANGER]: {
    bg: 'bg-red-50',
    hoverBg: 'hover:bg-red-100',
    border: 'border-red-200',
    dot: 'bg-red-500',
    icon: 'text-red-600',
    IconComponent: AlertCircle,
  },
  [NotificationType.MESSAGE]: {
    bg: 'bg-purple-50',
    hoverBg: 'hover:bg-purple-100',
    border: 'border-purple-200',
    dot: 'bg-purple-500',
    icon: 'text-purple-600',
    IconComponent: MessageSquare,
  },
};

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onClearAll,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'unread'>('newest');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [expandedNotifications, setExpandedNotifications] = useState<Set<number>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Character limit for truncating messages
  const MESSAGE_CHAR_LIMIT = 100;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Filter and sort notifications
  const filteredNotifications = notifications
    .filter(n => !showOnlyUnread || !n.isRead)
    .sort((a, b) => {
      if (sortOption === 'unread') {
        if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
      }
      if (sortOption === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      // newest (default)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // Get relative time string
  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diff = now.getTime() - then.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return then.toLocaleDateString();
  };

  // Handle notification click
  const handleNotificationClick = async (notification: Notification) => {
    try {
      // Mark as read if unread
      if (!notification.isRead) {
        await onMarkAsRead(notification.id);
      }

      // Navigate to related URL if exists
      if (notification.relatedURL) {
        navigate(notification.relatedURL);
        onClose();
      } else {
        // Show notification details in modal
        setSelectedNotification(notification);
      }
    } catch (error) {
      console.error('Error handling notification click:', error);
    }
  };

  // Handle mark as read
  const handleMarkAsRead = async (e: React.MouseEvent, notificationId: number) => {
    e.stopPropagation();
    try {
      await onMarkAsRead(notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Handle delete
  const handleDelete = async (e: React.MouseEvent, notificationId: number) => {
    e.stopPropagation();
    try {
      await onDeleteNotification(notificationId);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Toggle expanded state for a notification
  const toggleExpanded = (e: React.MouseEvent, notificationId: number) => {
    e.stopPropagation();
    setExpandedNotifications(prev => {
      const newSet = new Set(prev);
      if (newSet.has(notificationId)) {
        newSet.delete(notificationId);
      } else {
        newSet.add(notificationId);
      }
      return newSet;
    });
  };

  // Check if message needs truncation
  const needsTruncation = (message: string) => message.length > MESSAGE_CHAR_LIMIT;

  // Get display message (truncated or full)
  const getDisplayMessage = (notification: Notification) => {
    const isExpanded = expandedNotifications.has(notification.id);
    if (!needsTruncation(notification.message) || isExpanded) {
      return notification.message;
    }
    return notification.message.substring(0, MESSAGE_CHAR_LIMIT) + '...';
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        ref={dropdownRef}
        className="absolute right-0 top-12 w-96 bg-white rounded-xl border shadow-2xl z-50 transform transition-all duration-300 ease-in-out"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-gray-700" />
            <h4 className="text-lg font-semibold text-gray-800">Notifications</h4>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-semibold bg-red-500 text-white rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlyUnread}
              onChange={() => setShowOnlyUnread(!showOnlyUnread)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">Unread only</span>
          </label>
          <select
            className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as 'newest' | 'oldest' | 'unread')}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="unread">Unread first</option>
          </select>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto custom-scrollbar">
          {filteredNotifications.length > 0 ? (
            <div className="divide-y">
              {filteredNotifications.map((notification) => {
                const colorScheme = notificationColors[notification.type];
                const IconComponent = colorScheme.IconComponent;

                return (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`group relative p-4 transition-all duration-200 cursor-pointer ${
                      notification.isRead
                        ? 'bg-white hover:bg-gray-50'
                        : `${colorScheme.bg} ${colorScheme.hoverBg} border-l-4 ${colorScheme.border}`
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div className={`flex-shrink-0 ${colorScheme.icon}`}>
                        <IconComponent size={20} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h5 className={`font-semibold text-sm ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h5>
                          {!notification.isRead && (
                            <div className={`w-2 h-2 rounded-full ${colorScheme.dot} flex-shrink-0 mt-1.5`} />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {getDisplayMessage(notification)}
                        </p>
                        {needsTruncation(notification.message) && (
                          <button
                            onClick={(e) => toggleExpanded(e, notification.id)}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-1 transition-colors"
                          >
                            {expandedNotifications.has(notification.id) ? 'Show less' : 'Show more'}
                          </button>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-400">
                            {getRelativeTime(notification.createdAt)}
                          </span>
                          
                          {/* Actions */}
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!notification.isRead && (
                              <button
                                onClick={(e) => handleMarkAsRead(e, notification.id)}
                                className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                                title="Mark as read"
                              >
                                <Check size={14} className="text-blue-600" />
                              </button>
                            )}
                            {/* <button
                              onClick={(e) => handleDelete(e, notification.id)}
                              className="p-1 hover:bg-red-100 rounded-full transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={14} className="text-red-600" />
                            </button> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Bell size={48} className="mb-3 opacity-50" />
              <p className="text-sm font-medium">No notifications</p>
              <p className="text-xs mt-1">You're all caught up!</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {notifications.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t">
            <button
              onClick={onMarkAllAsRead}
              disabled={unreadCount === 0}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <CheckCheck size={16} />
              Mark all read
            </button>
            {/* <button
              onClick={onClearAll}
              className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 transition-colors"
            >
              <Trash2 size={16} />
              Clear all
            </button> */}
          </div>
        )}
      </div>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[60]">
          <div className="bg-white w-full max-w-md rounded-lg shadow-2xl p-6 m-4 animate-fadeIn">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                {(() => {
                  const colorScheme = notificationColors[selectedNotification.type];
                  const IconComponent = colorScheme.IconComponent;
                  return <IconComponent size={24} className={colorScheme.icon} />;
                })()}
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedNotification.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedNotification(null)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <p className="text-sm text-gray-700 mb-4 whitespace-pre-wrap">
              {selectedNotification.message}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{getRelativeTime(selectedNotification.createdAt)}</span>
              <span className="capitalize">{selectedNotification.type}</span>
            </div>
            {selectedNotification.relatedURL && (
              <button
                onClick={() => {
                  navigate(selectedNotification.relatedURL!);
                  setSelectedNotification(null);
                  onClose();
                }}
                className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Details
              </button>
            )}
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default NotificationDropdown;
