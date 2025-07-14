import React from 'react';
import CalendarNavigation from './CalendarNavigation';
import CalendarDaysHeader from './CalendarDaysHeader';
import CalendarDayCell from './CalendarDayCell';
import { CalendarDay } from './types';

interface CalendarGridProps {
  currentDate: Date;
  days: (CalendarDay | null)[];
  months: string[];
  daysOfWeek: string[];
  onNavigateMonth: (direction: 'prev' | 'next') => void;
  onToday: () => void;
  onDateClick: (date: Date) => void;
  onUnavailableSlotClick: (date: Date, e: React.MouseEvent) => void;
  onSessionAction: (sessionId: string, action: 'accept' | 'reject') => void;
  getStatusColor: (status: string) => string;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate,
  days,
  months,
  daysOfWeek,
  onNavigateMonth,
  onToday,
  onDateClick,
  onUnavailableSlotClick,
  onSessionAction,
  getStatusColor
}) => {
  return (
    <div className="xl:col-span-3">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Calendar Header */}
        <CalendarNavigation
          currentDate={currentDate}
          months={months}
          onNavigateMonth={onNavigateMonth}
          onToday={onToday}
        />

        {/* Days of Week */}
        <CalendarDaysHeader daysOfWeek={daysOfWeek} />

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-0">
          {days.map((day, index) => (
            <CalendarDayCell
              key={index}
              day={day}
              onDateClick={onDateClick}
              onUnavailableSlotClick={onUnavailableSlotClick}
              onSessionAction={onSessionAction}
              getStatusColor={getStatusColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarGrid;
