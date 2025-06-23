// import React from 'react';

// interface SidebarProps {
//   children: React.ReactNode;
//   className?: string;
// }

// const Sidebar: React.FC<SidebarProps> = ({ children, className = '' }) => (
//   <aside className={`w-64 bg-white border-r border-border p-4 ${className}`}>
//     {children}
//   </aside>
// );

// export default Sidebar;

import React, { useState } from 'react';
import { Menu, Bell, ArrowLeft, Home, Calendar, Users, ThumbsUp, MessageCircle, FileText } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Sidebar Component
const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const menuItems = [
    { icon: Home, label: 'Home', href: '#' },
    { icon: Calendar, label: 'Sessions', href: '#' },
    { icon: Users, label: 'Clients', href: '#' },
    { icon: ThumbsUp, label: 'Feedbacks', href: '#' },
    { icon: MessageCircle, label: 'Chats', href: '#' },
    { icon: FileText, label: 'Blogs', href: '#' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b lg:hidden">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="py-6 px-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <li key={index}>
                  <a
                    href={item.href}
                    className="flex items-center space-x-4 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors group"
                    onClick={onClose}
                  >
                    <IconComponent size={20} className="text-gray-600 group-hover:text-gray-800" />
                    <span className="font-medium group-hover:text-gray-800">{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Branding */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="relative">
            {/* Decorative Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 rounded-2xl opacity-20"></div>
            <div className="relative p-6 rounded-2xl">
              <div className="flex items-center mb-2">
                <img 
                  src="public/assets/images/Sona-logo.png" 
                  alt="SONA" 
                  className="w-30 h-10 rounded-full mr-2" />
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Wellness Starts With A Conversation
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar