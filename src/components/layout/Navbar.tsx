import React from 'react'
import { Menu, Bell } from 'lucide-react';

const Navbar = ({ onMenuClick }: { onMenuClick: () => void }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100 relative z-30">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - Menu button (mobile only) and Logo */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={onMenuClick}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors lg:hidden"
          >
            <Menu size={24} className="text-gray-700" />
          </button>
          
          <div className="flex items-center">
            <img src="public/assets/images/Sona-logo.png" alt="SONA" className="w-20" />
          </div>
        </div>

        {/* Right side - Notification and Profile */}
        <div className="flex items-center space-x-3">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
            <Bell size={20} className="text-gray-600" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </button>
          
          <button className="w-8 h-8 rounded-full overflow-hidden hover:ring-2 hover:ring-pink-200 transition-all">
            <img 
              src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar