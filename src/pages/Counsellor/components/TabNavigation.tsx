import React from 'react';

interface TabNavigationProps {
  activeTab: 'overview' | 'credentials' | 'achievements';
  onTabChange: (tab: 'overview' | 'credentials' | 'achievements') => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex items-center gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
      <div 
        onClick={() => onTabChange('overview')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
          activeTab === 'overview' 
            ? 'bg-white text-gray-900 shadow-sm' 
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Overview
      </div>
      <div 
        onClick={() => onTabChange('credentials')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
          activeTab === 'credentials' 
            ? 'bg-white text-gray-900 shadow-sm' 
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Edu Qualifications
      </div>
      <div 
        onClick={() => onTabChange('achievements')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
          activeTab === 'achievements' 
            ? 'bg-white text-gray-900 shadow-sm' 
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Experiences
      </div>
    </div>
  );
};

export default TabNavigation;
