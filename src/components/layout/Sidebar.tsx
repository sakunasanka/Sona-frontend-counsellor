import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Calendar, Users, MessageCircle, FileText, DollarSign, LogOut } from 'lucide-react';
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
    { icon: Home, label: 'Home', href: '/dashboard', id: 'home' },
    { icon: Calendar, label: 'Sessions', href: '/sessions', id: 'sessions' },
    { icon: Users, label: 'Clients', href: '/clients', id: 'clients' },
    { icon: DollarSign, label: 'Earnings', href: '/earnings', id: 'earnings' },
    { icon: MessageCircle, label: 'Chats', href: '/chats', id: 'chats' },
    { icon: FileText, label: 'Blogs', href: '/blogs', id: 'blogs' },
  ];

  const handleItemClick = (item: any) => {
    if (item.id === 'chats' && onChatClick) {
      onChatClick();
    } else {
      // Handle other navigation with expansion animation if minimized
      if (item.href !== '#') {
        if (isMinimized && onExpandBeforeNavigation) {
          // Trigger expansion animation before navigation
          onExpandBeforeNavigation(item.href);
        } else {
          // Direct navigation if not minimized
          window.location.href = item.href;
        }
      }
    }
    
    // Close sidebar on mobile
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const handleLogoClick = () => {
    // Navigate to dashboard
    if (isMinimized && onExpandBeforeNavigation) {
      // Trigger expansion animation before navigation
      onExpandBeforeNavigation('/dashboard');
    } else {
      // Direct navigation if not minimized
      window.location.href = '/dashboard';
    }
    
    // Close sidebar on mobile
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && !isMinimized && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        h-full bg-slate-800 flex flex-col transition-all duration-500 ease-in-out
        fixed top-0 left-0 z-50 lg:relative lg:z-auto
        ${isMinimized 
          ? 'w-16 lg:w-16' 
          : 'w-72 lg:w-72'
        }
        ${isOpen || isMinimized ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Logo Section - Left aligned for web, with back arrow for mobile */}
        <div className="py-6 px-4">
          {/* Desktop: Left-aligned logo with margin to align with menu icons */}
          <div className="hidden lg:flex items-center">
            <img 
              src="/assets/images/Sona-logo-light.png" 
              alt="SONA" 
              className={`${isMinimized ? 'w-8' : 'w-32'} transition-all duration-300 ${isMinimized ? '' : 'ml-4'} cursor-pointer hover:opacity-80`}
              onClick={handleLogoClick}
            />
          </div>
          
          {/* Mobile: Back arrow + logo on same level when not minimized */}
          {!isMinimized && (
            <div className="flex items-center lg:hidden">
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-700 rounded-md transition-colors mr-3"
              >
                <ArrowLeft size={20} className="text-slate-300" />
              </button>
              <img 
                src="/assets/images/Sona-logo-light.png" 
                alt="SONA" 
                className="w-32 cursor-pointer hover:opacity-80"
                onClick={handleLogoClick}
              />
            </div>
          )}
          
          {/* Mobile minimized: Just logo centered */}
          {isMinimized && (
            <div className="flex items-center justify-center lg:hidden">
              <img 
                src="/assets/images/Sona-logo-light.png" 
                alt="SONA" 
                className="w-8 cursor-pointer hover:opacity-80"
                onClick={handleLogoClick}
              />
            </div>
          )}
        </div>

        {/* Subtle Divider */}
        <div className="mx-4 border-t border-slate-600"></div>

        {/* Menu Items */}
        <nav className={`py-4 ${isMinimized ? 'px-2' : 'px-4'} flex-1 flex flex-col transition-all duration-500 ease-in-out`}>
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = activeItem === item.id;
              
              return (
                <li key={index}>
                  <button
                    onClick={() => handleItemClick(item)}
                    className={`
                      flex items-center text-slate-100 hover:bg-gray-50 rounded-lg text-l mt-0 transition-all duration-300 ease-in-out group w-full
                      ${isMinimized 
                        ? 'px-3 py-3 justify-center hover:bg-gray-50 ' 
                        : 'px-4 py-3 space-x-4'
                      }
                      ${isActive ? 'bg-white shadow-sm' : ''}
                    `}
                    title={isMinimized ? item.label : undefined}
                  >
                    <IconComponent 
                      size={20} 
                      className={`
                        text-slate-100 group-hover:text-gray-400 transition-colors duration-200
                        ${isActive ? 'text-gray-800' : ''}
                      `} 
                    />
                    <span className={`
                      font-medium group-hover:text-gray-800 transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap
                      ${isActive ? 'text-gray-800' : ''}
                      ${isMinimized 
                        ? 'opacity-0 w-0 transform scale-0' 
                        : 'opacity-100 w-auto transform scale-100'
                      }
                    `}>
                      {item.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          
          <div className="flex-1"></div>
          
          <div className="mt-6 pt-4 border-t border-slate-600">
            <Button
              variant="logout"
              isMinimized={isMinimized}
              title={isMinimized ? 'Log out' : undefined}
              icon={<LogOut size={20} className="text-white group-hover:text-red-600 transition-colors duration-200" />}
              onClick={() => {
                console.log('Logout clicked');
                localStorage.removeItem('auth_token');
                localStorage.removeItem('counsellor_id');
                navigate('/signin');
                onClose();
              }}
            >
              <span className={`
                font-medium transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap
                ${isMinimized 
                  ? 'opacity-0 w-0 transform scale-0' 
                  : 'opacity-100 w-auto transform scale-100'
                }
              `}>
                Log out
              </span>
            </Button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;