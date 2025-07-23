import React, { useState, useEffect, useCallback } from 'react';
import { StatusConfig } from '../types';

interface StatusIndicatorProps {
  status: 'available' | 'busy' | 'offline';
  lastActiveAt?: string;
  onStatusChange: (status: 'available' | 'busy' | 'offline') => void;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, lastActiveAt, onStatusChange }) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const getStatusConfig = useCallback((status: 'available' | 'busy' | 'offline'): StatusConfig => {
    switch (status) {
      case 'available':
        return {
          color: 'bg-green-500',
          text: 'Available',
          textColor: 'text-green-700',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          hoverColor: 'hover:bg-green-100'
        };
      case 'busy':
        return {
          color: 'bg-yellow-500',
          text: 'Busy',
          textColor: 'text-yellow-700',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          hoverColor: 'hover:bg-yellow-100'
        };
      case 'offline':
        return {
          color: 'bg-gray-400',
          text: 'Offline',
          textColor: 'text-gray-700',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          hoverColor: 'hover:bg-gray-100'
        };
    }
  }, []);

  const currentStatus = getStatusConfig(status);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!showStatusMenu) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.status-dropdown-container')) {
        setShowStatusMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showStatusMenu]);

  return (
    <div className="relative status-dropdown-container">
      <button
        onClick={() => setShowStatusMenu(!showStatusMenu)}
        className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all duration-200 ${currentStatus.bgColor} ${currentStatus.borderColor} ${currentStatus.hoverColor} shadow-sm status-button`}
      >
        <div className={`w-3 h-3 rounded-full ${currentStatus.color}`}></div>
        <span className={`text-sm font-medium ${currentStatus.textColor}`}>
          {currentStatus.text}
        </span>
        <svg 
          className={`w-4 h-4 ${currentStatus.textColor} transition-transform duration-200 ${showStatusMenu ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showStatusMenu && (
        <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 min-w-[140px] status-dropdown">
          {(['available', 'offline'] as const).map((statusOption) => {
            const statusConfig = getStatusConfig(statusOption);
            return (
              <button
                key={statusOption}
                onClick={() => {
                  onStatusChange(statusOption);
                  setShowStatusMenu(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                  status === statusOption ? 'bg-gray-50' : ''
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${statusConfig.color}`}></div>
                <span className="text-sm font-medium text-gray-700">{statusConfig.text}</span>
                {status === statusOption && (
                  <svg className="w-4 h-4 text-pink-500 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            );
          })}
          
          {/* Show busy status as read-only if currently busy */}
          {status === 'busy' && (
            <>
              <div className="border-t border-gray-100 my-2"></div>
              <div className="px-4 py-2 bg-yellow-50 rounded mx-2">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div>
                    <span className="text-sm font-medium text-yellow-700">Currently Busy</span>
                    <p className="text-xs text-yellow-600 mt-1">Status automatically set during active sessions</p>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {lastActiveAt && status !== 'offline' && (
            <div className="border-t border-gray-100 mt-2 pt-2 px-4">
              <p className="text-xs text-gray-500">
                Active now
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StatusIndicator;
