import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { CalendarDay, Session } from './types';

interface CalendarDayCellProps {
  day: CalendarDay | null;
  onDateClick: (date: Date) => void;
  getStatusColor: (status: string) => string;
}

const CalendarDayCell: React.FC<CalendarDayCellProps> = ({
  day,
  onDateClick,
  getStatusColor
}) => {
  if (!day) {
    return <div className="aspect-square border-b border-r border-gray-100"></div>;
  }

  const renderSession = (session: Session) => (
    <div 
      key={session.id}
      className={`text-xs px-1 py-0.5 rounded-sm border ${
        day.isPastDay && session.status === 'completed'
          ? 'text-green-600 bg-green-100 border-green-200'
          : getStatusColor(session.status)
      } flex items-center gap-1 truncate mb-0.5`}
    >
      <span className="truncate text-xs font-medium">
        {session.time} - {session.clientName}
      </span>
    </div>
  );

  // Render partial day availability/unavailability
  const renderPartialDaySlot = (slot: any) => (
    <div 
      key={`slot-${slot.start}-${slot.end}`}
      className={`text-xs px-1 py-0.5 rounded-sm border ${
        slot.isAvailable 
          ? 'text-blue-600 bg-blue-100 border-blue-200' 
          : 'text-red-600 bg-red-100 border-red-200'
      } flex items-center gap-1 truncate mb-0.5`}
    >
      <Clock className={`w-3 h-3 ${slot.isAvailable ? 'text-blue-600' : 'text-red-600'}`} />
      <span className="truncate text-xs font-medium">
        {slot.isAvailable ? 'Available: ' : 'Unavailable: '}{slot.start} - {slot.end}
      </span>
    </div>
  );

  // Determine how many sessions to show based on screen size
  const maxSessionsDesktop = 3;
  const maxSessionsMobile = 2;
  
  // Check if the day has any available time slots
  const hasAvailableSlots = day.unavailableSlots.some(slot => slot.isAvailable);

  return (
    <div 
      className={`aspect-square border-b border-r border-gray-100 p-1 transition-colors flex flex-col relative ${
        day.isPastDay ? 'cursor-default' : 'cursor-pointer'
      } ${
        day.isToday ? 'bg-blue-100 ring-2 ring-primary ring-inset' : ''
      } ${
        day.isPastDay ? 'bg-gray-50 opacity-80' : ''
      } ${
        !day.isUnavailable ? 
          'bg-blue-100 border-blue-300 hover:bg-blue-150' : 
          hasAvailableSlots ?
            'bg-blue-50 border-blue-200 hover:bg-blue-100' :
          day.sessions.length === 0 && day.unavailableSlots.length === 0 ? 
            'bg-red-25 hover:bg-red-50' : 
            'hover:bg-gray-50'
      }`}
      onClick={() => onDateClick(day.date)}
    >
      {/* Date number and availability indicator */}
      <div className={`
        text-xs lg:text-sm font-medium mb-1
        ${day.isToday ? 'text-primary font-bold' : 
          !day.isUnavailable || hasAvailableSlots ? 'text-blue-700' : 
          day.isPastDay ? 'text-gray-600' :
          'text-gray-900'
        } flex items-center justify-between relative z-10`}>
        <span className={!day.isUnavailable || hasAvailableSlots ? '' : 'line-through'}>{day.date.getDate()}</span>
        {!day.isPastDay && (!day.isUnavailable || hasAvailableSlots) && (
          <Calendar className="w-3 h-3 text-blue-600" />
        )}
      </div>
      
      {/* Availability status label - only show "Unavailable" for fully unavailable days */}
      {day.isUnavailable && !hasAvailableSlots && !day.isPastDay && (
        <div className="text-xs text-red-600 font-medium px-1 py-0.5 bg-red-200/50 rounded-sm mb-1">
          Unavailable
        </div>
      )}
      
      {/* Partial day slots - show if there are any */}
      {day.unavailableSlots.length > 0 && (
        <div className="flex-1 overflow-hidden mb-1">
          {day.unavailableSlots.slice(0, 2).map(renderPartialDaySlot)}
          {day.unavailableSlots.length > 2 && (
            <div className="text-xs text-gray-500 px-0.5 truncate">
              +{day.unavailableSlots.length - 2} more
            </div>
          )}
        </div>
      )}
      
      {/* Sessions list - Show if day is available, has available slots, OR it's a past day */}
      {(!day.isUnavailable || hasAvailableSlots || day.isPastDay) && day.sessions.length > 0 && (
        <div className="flex-1 overflow-hidden">
          {/* Desktop view: Show up to 3 sessions */}
          <div className="hidden lg:block">
            {day.sessions.slice(0, maxSessionsDesktop).map(renderSession)}
            {day.sessions.length > maxSessionsDesktop && (
              <div className="text-xs text-gray-500 px-0.5 truncate">
                +{day.sessions.length - maxSessionsDesktop} more
              </div>
            )}
          </div>
          
          {/* Mobile view: Show up to 2 sessions */}
          <div className="lg:hidden">
            {day.sessions.slice(0, maxSessionsMobile).map(renderSession)}
            {day.sessions.length > maxSessionsMobile && (
              <div className="text-xs text-gray-500 px-0.5 truncate">
                +{day.sessions.length - maxSessionsMobile} more
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarDayCell;
