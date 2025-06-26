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


import React from 'react';
import { ArrowLeft, Home, Calendar, Users, ThumbsUp, MessageCircle, FileText, LogOut } from 'lucide-react';

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
    { icon: ThumbsUp, label: 'Feedbacks', href: '/counsellor-feedbacks' },
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
        h-full w-80 bg-[#FFE9EF] flex flex-col
        fixed top-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:transform-none lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center p-4 border-b lg:hidden">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <img 
            src="/public/assets/images/Sona-logo.png" 
            alt="Sona Logo" 
            className="h-5 w-auto ml-3"
          />
        </div>

        {/* Menu Items */}
        <nav className="py-6 px-4 flex-1 flex flex-col">
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

          <div className="flex-1"></div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              className="w-full flex items-center space-x-4 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors group"
              onClick={() => {
                // Add your logout logic here
                console.log('Logout clicked');
                onClose();
              }}
            >
              <LogOut size={20} className="text-gray-600 group-hover:text-red-600" />
              <span className="font-medium">Log out</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}

export default Sidebar