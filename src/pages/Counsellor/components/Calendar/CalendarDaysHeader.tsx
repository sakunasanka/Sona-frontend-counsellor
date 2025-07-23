import React from 'react';

interface CalendarDaysHeaderProps {
  daysOfWeek: string[];
}

const CalendarDaysHeader: React.FC<CalendarDaysHeaderProps> = ({ daysOfWeek }) => {
  return (
    <div className="grid grid-cols-7 border-b border-gray-100">
      {daysOfWeek.map(day => (
        <div key={day} className="p-2 text-center text-xs font-medium text-gray-500 bg-gray-50">
          {day}
        </div>
      ))}
    </div>
  );
};

export default CalendarDaysHeader;
