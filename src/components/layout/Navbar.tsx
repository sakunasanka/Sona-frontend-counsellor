import { useState } from 'react';
import { Menu, Bell } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useProfile } from '../../contexts/ProfileContext';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationDropdown from './NotificationDropdown';

const Navbar = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const navigate = useNavigate();
  const handleProfile = () => navigate("/profile");
  const { profile } = useProfile();
  
  const [showDropdown, setShowDropdown] = useState(false);

  // Use the notifications hook with backend integration and polling
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  } = useNotifications();


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
          {/* Notification Bell Button */}
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
          >
            <Bell size={22} className="text-gray-600" />
            {unreadCount > 0 && (
              <div className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-xs font-bold rounded-full">
                {unreadCount > 99 ? '99+' : unreadCount}
              </div>
            )}
          </button>

          {/* Notification Dropdown Component */}
          <NotificationDropdown
            notifications={notifications}
            unreadCount={unreadCount}
            onMarkAsRead={markAsRead}
            onMarkAllAsRead={markAllAsRead}
            onDeleteNotification={deleteNotification}
            onClearAll={clearAllNotifications}
            isOpen={showDropdown}
            onClose={() => setShowDropdown(false)}
          />

          {/* Profile Button */}
          <button
            className="w-8 h-8 rounded-full overflow-hidden hover:ring-2 hover:ring-pink-200 transition-all"
            onClick={() => handleProfile()}
          >
            <img 
              src={profile?.profileImage || "https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png"} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
