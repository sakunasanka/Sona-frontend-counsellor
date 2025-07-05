import React from 'react';
import { CalendarX, Settings } from 'lucide-react';

interface CalendarHeaderProps {
  onMarkUnavailable: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  onMarkUnavailable
}) => {
  return (
    <div className="flex items-center justify-between mb-6 lg:mb-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Calendar</h1>
        <p className="text-sm text-gray-600">Manage your sessions and availability</p>
      </div>
      <div className="flex items-center gap-3">
        <button 
          onClick={onMarkUnavailable}
          className="bg-primary hover:bg-primaryLight text-white px-3 lg:px-4 py-2 rounded-lg font-medium transition-all shadow-sm flex items-center gap-2"
        >
          <CalendarX className="w-4 h-4" />
          <span className="hidden sm:inline text-sm">Mark Unavailable</span>
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Settings className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader;
