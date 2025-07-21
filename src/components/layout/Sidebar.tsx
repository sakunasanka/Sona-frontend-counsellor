import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Calendar, Users, ThumbsUp, MessageCircle, FileText, DollarSign, LogOut } from 'lucide-react';
import { Button } from '../ui';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMinimized?: boolean;
  onChatClick?: () => void;
  activeItem?: string;
  onExpandBeforeNavigation?: (href: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  isMinimized = false, 
  onChatClick,
  activeItem = '',
  onExpandBeforeNavigation
}) => {
  const navigate = useNavigate();
  
  const menuItems = [
    { icon: Home, label: 'Home', href: '/counsellor-dashboard', id: 'home' },
    { icon: Calendar, label: 'Sessions', href: '/counsellor-sessions', id: 'sessions' },
    { icon: Users, label: 'Clients', href: '/counsellor-clients', id: 'clients' },
    { icon: DollarSign, label: 'Earnings', href: '/counsellor/earnings', id: 'earnings' },
    { icon: ThumbsUp, label: 'Feedbacks', href: '/counsellor-feedbacks', id: 'feedbacks' },
    { icon: MessageCircle, label: 'Chats', href: '/counsellor/chats', id: 'chats' },
    { icon: FileText, label: 'Blogs', href: '/counsellor-blogs', id: 'blogs' },
  ];

  const handleItemClick = (item: any) => {
    if (item.id === 'chats' && onChatClick) {
      onChatClick();
    } else {
      if (item.href !== '#') {
        if (isMinimized && onExpandBeforeNavigation) {
          onExpandBeforeNavigation(item.href);
        } else {
          window.location.href = item.href;
        }
      }
    }
    
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && !isMinimized && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        h-full bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col transition-all duration-300 ease-out shadow-2xl
        fixed top-0 left-0 z-50 lg:relative lg:z-auto border-r border-slate-700/50
        ${isMinimized 
          ? 'w-20 lg:w-20' 
          : 'w-80 lg:w-80'
        }
        ${isOpen || isMinimized ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Mobile Header - Back button and logo for mobile */}
        {!isMinimized && (
          <div className="flex items-center justify-between p-4 lg:hidden border-b border-slate-700/30">
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-all duration-200 text-slate-300 hover:text-white"
            >
              <ArrowLeft size={20} />
            </button>
            <img 
              src="/assets/images/Sona-logo-light.png" 
              alt="SONA" 
              className="h-8 w-auto"
            />
            <div className="w-9" /> {/* Spacer for centering */}
          </div>
        )}

        {/* Logo Section - Hidden on mobile, visible on desktop */}
        <div className={`
          hidden lg:flex items-center py-6 border-b border-slate-700/30
          ${isMinimized ? 'px-2 justify-center' : 'px-6 pl-7'}
        `}>
          <img 
            src="/assets/images/Sona-logo-light.png" 
            alt="SONA" 
            className={`
              transition-all duration-300 ease-out
              ${isMinimized ? 'w-10 h-10 object-contain' : 'w-36 h-auto'}
            `}
          />
        </div>

        {/* Navigation Menu */}
        <nav className={`
          flex-1 py-6 transition-all duration-300 ease-out
          ${isMinimized ? 'px-3' : 'px-6'}
        `}>
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = activeItem === item.id;
              
              return (
                <li key={index}>
                  <button
                    onClick={() => handleItemClick(item)}
                    className={`
                      w-full flex items-center rounded-xl transition-all duration-200 ease-out group relative
                      ${isMinimized 
                        ? 'px-3 py-4 justify-center' 
                        : 'px-4 py-3 space-x-3'
                      }
                      ${isActive 
                        ? 'bg-white/10 text-white shadow-lg border border-white/20' 
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }
                    `}
                    title={isMinimized ? item.label : undefined}
                  >
                    <div className={`
                      flex items-center justify-center transition-transform duration-200
                      ${isActive ? 'scale-110' : 'group-hover:scale-105'}
                      ${isMinimized ? 'w-6 h-6' : 'w-5 h-5'}
                    `}>
                      <IconComponent 
                        size={isMinimized ? 24 : 20} 
                        className="transition-colors duration-200" 
                      />
                    </div>
                    
                    <span className={`
                      font-medium text-sm transition-all duration-300 ease-out whitespace-nowrap
                      ${isMinimized 
                        ? 'opacity-0 w-0 overflow-hidden transform translate-x-2' 
                        : 'opacity-100 w-auto transform translate-x-0'
                      }
                    `}>
                      {item.label}
                    </span>

                    {/* Active indicator */}
                    {isActive && (
                      <div className={`
                        absolute right-0 w-1 bg-gradient-to-b from-blue-400 to-blue-600 rounded-l-full transition-all duration-200
                        ${isMinimized ? 'h-8 -mr-3' : 'h-8 -mr-6'}
                      `} />
                    )}

                    {/* Tooltip for minimized state */}
                    {isMinimized && (
                      <div className="absolute left-full ml-4 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg border border-slate-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {item.label}
                        <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-800 border-l border-t border-slate-600 rotate-45" />
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className={`
          border-t border-slate-700/30 p-4 transition-all duration-300
          ${isMinimized ? 'px-3' : 'px-6'}
        `}>
          <button
            onClick={() => {
              console.log('Logout clicked');
              navigate('/signin');
              onClose();
            }}
            className={`
              w-full flex items-center text-slate-300 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 group relative border border-transparent hover:border-red-500/20
              ${isMinimized 
                ? 'px-3 py-4 justify-center' 
                : 'px-4 py-3 space-x-3'
              }
            `}
            title={isMinimized ? 'Log out' : undefined}
          >
            <div className={`
              flex items-center justify-center transition-transform duration-200 group-hover:scale-105
              ${isMinimized ? 'w-6 h-6' : 'w-5 h-5'}
            `}>
              <LogOut size={isMinimized ? 24 : 20} />
            </div>
            
            <span className={`
              font-medium text-sm transition-all duration-300 ease-out whitespace-nowrap
              ${isMinimized 
                ? 'opacity-0 w-0 overflow-hidden transform translate-x-2' 
                : 'opacity-100 w-auto transform translate-x-0'
              }
            `}>
              Log out
            </span>

            {/* Tooltip for minimized logout */}
            {isMinimized && (
              <div className="absolute left-full ml-4 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg border border-slate-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Log out
                <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-800 border-l border-t border-slate-600 rotate-45" />
              </div>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;