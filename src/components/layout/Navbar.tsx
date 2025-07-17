import React, { useState } from 'react';
import { Menu, Bell, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";

const initialNotifications = [
  {
    id: 1,
    title: "Upcoming Session",
    description: "4.00 PM | 26th of June, 2025",
    read: false,
    type: "reminder",
    timestamp: "2025-06-22T21:00:00"
  },

  {
    id: 2,
    title: "Had an amazing time, feeling an immense relief! ",
    description: "Aline Joseph posted a feedback",
    read: true,
    type: "feedback",
    timestamp: "2025-06-23T08:00:00"
  },
  {
    id: 3,
    title: "Reminder",
    description: "Configure your availability for upcoming month!",
    read: false,
    type: "reminder",
    timestamp: "2025-06-24T00:00:00"
  },
  {
    id: 4,
    title: "John commented: 'Nice post!'",
    description: "John Dawson commented on your blog post",
    read: false,
    type: 'comment',
    timestamp: "2025-06-26T03:00:00"
  }
];

const Navbar = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const navigate = useNavigate();
  const handleProfile = () => navigate("/counsellor-profile");
  
  const [notifications, setNotifications] = useState(initialNotifications);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  const [sortOption, setSortOption] = useState('Newest');
  const [activeNotification, setActiveNotification] = useState<null | typeof notifications[0]>(null);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showDropdown &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short'
    });

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (notification: typeof notifications[0]) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notification.id ? { ...n, read: true } : n))
    );
    setActiveNotification(notification);
  };

  const handleReaction = (id: number, emoji: string) => {
  setNotifications(prev =>
    prev.map(n =>
      n.id === id ? { ...n, read: true, reaction: emoji } : n
      )
    );
  };

  const filteredNotifications = (showOnlyUnread
    ? notifications.filter(n => !n.read)
    : [...notifications]
  ).sort((a, b) => {
    if (sortOption === 'Unread First') return Number(a.read) - Number(b.read);
    if (sortOption === 'Oldest') return a.id - b.id;
    return b.id - a.id;
  }); 

  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diff = now.getTime() - then.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
    if (seconds < 60) return rtf.format(-seconds, 'second');
    if (minutes < 60) return rtf.format(-minutes, 'minute');
    if (hours < 24) return rtf.format(-hours, 'hour');
    return rtf.format(-days, 'day');
  };


  return (
    <header className="bg-slate-200 shadow-sm border-b border-gray-100 relative z-30">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <button onClick={onMenuClick} className="p-1 hover:bg-gray-100 rounded-md transition-colors lg:hidden">
            <Menu size={24} className="text-gray-700" />
          </button>
          
          {/* <div className="flex items-center">
            <img src="/assets/images/Sona-logo.png" alt="SONA" className="w-20" />
          </div> */}
        </div>

        <div className="flex items-center space-x-3 relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
          >
            <Bell size={22} className="text-gray-600" />
            {notifications.some(n => !n.read) && (
              <div className="absolute -top-0.5 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>

          <div
            ref={dropdownRef}
            className={`absolute right-10 top-12 w-80 bg-white rounded-xl border p-4 z-50 shadow-xl transform transition-all duration-300 ease-in-out ${showDropdown ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
              }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-md font-semibold">Notifications</h4>
              <button onClick={() => setShowDropdown(false)}>
                <X size={18} />
              </button>
            </div>


            <div className="flex items-center justify-between mb-4 text-sm">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showOnlyUnread}
                  onChange={() => setShowOnlyUnread(!showOnlyUnread)}
                />
                <span>Show only unread</span>
              </label>
              <select
                className="border rounded-md px-2 py-1 text-sm"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option>Newest</option>
                <option>Oldest</option>
                <option>Unread First</option>
              </select>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar pr-1">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={`group relative text-sm p-3 rounded-lg transition-all duration-300 cursor-pointer ${
                      n.read
                        ? 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                        : 'bg-blue-50 text-gray-800 hover:bg-blue-100 font-semibold'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full mt-1" style={{ backgroundColor: n.read ? 'transparent' : '#3b82f6' }}></div>
                      <div className="flex-1">
                        <div>
                          <p className="font-semibold text-sm">{n.title}</p>
                          <p className="text-xs text-gray-500">{n.description}</p>
                          <p className="text-xs text-gray-400 mt-2">{getRelativeTime(n.timestamp)}</p>
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-gray-400">
                        </div>
                        {n.type === 'comment' && (
                          <div className="mt-2 flex gap-2 text-sm">
                            {['👍', '❤️', '😄'].map((emoji) => (
                              <button
                                key={emoji}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReaction(n.id, emoji);
                                }}
                                className="hover:scale-110 transition-transform"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-black-400 text-center py-6 animate-pulse">
                  You’re all caught up!
                </p>
              )}
            </div>
            <div className="flex justify-between mb-2 mt-6 text-sm ">
              <button className="text-blue-600 hover:underline" onClick={handleMarkAllAsRead}>
                Mark all as read
              </button>
              <button className="text-red-500 hover:underline" onClick={handleClearAll}>
                Clear all
              </button>
            </div>
          </div>

          <button
            className="w-8 h-8 rounded-full overflow-hidden hover:ring-2 hover:ring-pink-200 transition-all"
            onClick={() => handleProfile()}
          >
            <img 
              src="/assets/images/profile-photo.png" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>

      {/* 🔍 Modal */}
      {activeNotification && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white w-96 rounded-lg shadow-lg p-6 relative animate-fadeIn">
            <h2 className="text-lg font-semibold mb-2">Notification</h2>
            <p className="text-sm text-gray-800 mb-4">{activeNotification.title}</p>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{activeNotification.description}</span>
            </div>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setActiveNotification(null)}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
