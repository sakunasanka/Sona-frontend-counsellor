import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarNavigationProps {
  currentDate: Date;
  months: string[];
  onNavigateMonth: (direction: 'prev' | 'next') => void;
  onToday: () => void;
}

const CalendarNavigation: React.FC<CalendarNavigationProps> = ({
  currentDate,
  months,
  onNavigateMonth,
  onToday
}) => {
  return (
    <div className="p-3 lg:p-4 border-b border-gray-100">
      <div className="flex items-center justify-between">
        <h2 className="text-lg lg:text-xl font-bold text-gray-900">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onNavigateMonth('prev')}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <button 
            onClick={onToday}
            className="px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Today
          </button>
          <button 
            onClick={() => onNavigateMonth('next')}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarNavigation;
