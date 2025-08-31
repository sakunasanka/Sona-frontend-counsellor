
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Camera, Users, Pen, DollarSign, MessageCircle, Contact, HelpingHand, LogOut } from 'lucide-react';
import { Button } from '../ui';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMinimized?: boolean;
  onChatClick?: () => void;
  activeItem?: string;
  onExpandBeforeNavigation?: (href: string) => void;
}

const SidebarForPsy: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  isMinimized = false, 
  onChatClick,
  activeItem = '',
  onExpandBeforeNavigation
}) => {
  const navigate = useNavigate();
  const menuItems = [
    { icon: Home, label: 'Home', href: '/psychiatrist-dashboard', id: 'home' },
    { icon: Camera, label: 'Sessions', href: '/psychiatrist-sessions', id: 'sessions' },
    { icon: Users, label: 'Patients', href: '/psychiatrist-patients', id: 'patients' },
    { icon: Pen, label: 'Prescriptions', href: '/psychiatrist/create-prescription', id: 'prescriptions' },
    { icon: DollarSign, label: 'Earnings', href: '#', id: 'earnings' },
    { icon: MessageCircle, label: 'Chats', href: '/psychiatrist-chats', id: 'chats' },
    { icon: Contact, label: 'Contact Counsellors', href: '#', id: 'contact' },
    { icon: HelpingHand, label: 'Get Help', href: '#', id: 'help' },
  ];

  const handleItemClick = (item: any) => {
    if (item.id === 'chats' && onChatClick) {
      onChatClick();
    } else {
      // Handle other navigation
      if (item.href !== '#') {
        if (isMinimized && onExpandBeforeNavigation) {
          // Trigger expansion animation before navigation
          onExpandBeforeNavigation(item.href);
        } else {
          // Use React Router navigation instead of window.location
          navigate(item.href);
        }
      }
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
        
        <div className="items-center justify-center max-w-xl mx-4 p-4 border-b lg:border-none mt-5">
            <img src="/assets/images/Sona-logo-light.png" alt="SONA" className='w-32' />
          </div>
        {/* Sidebar Header - Only show on mobile when not minimized */}
        {!isMinimized && (
          <div className="flex items-center p-4 border-b lg:hidden">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <img
              src="/assets/images/Sona-logo.png"
              alt="Sona Logo"
              className="h-8 w-auto ml-3"
            />
          </div>
        )}

        {/* Menu Items */}
        <nav className={`py-6 ${isMinimized ? 'px-2' : 'px-4'} flex-1 flex flex-col transition-all duration-500 ease-in-out`}>
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
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button
              variant="logout"
              isMinimized={isMinimized}
              title={isMinimized ? 'Log out' : undefined}
              icon={<LogOut size={20} className="text-gray-600 group-hover:text-red-600 transition-colors duration-200" />}
              onClick={() => {
                console.log('Logout clicked');
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

export default SidebarForPsy;