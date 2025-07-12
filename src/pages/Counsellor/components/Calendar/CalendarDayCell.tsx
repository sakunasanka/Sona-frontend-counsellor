import React from 'react';
import { Calendar } from 'lucide-react';
import { CalendarDay, Session } from './types';

interface CalendarDayCellProps {
  day: CalendarDay | null;
  onDateClick: (date: Date) => void;
  onUnavailableSlotClick: (date: Date, e: React.MouseEvent) => void;
  onSessionAction: (sessionId: string, action: 'accept' | 'reject') => void;
  getStatusColor: (status: string) => string;
}

const CalendarDayCell: React.FC<CalendarDayCellProps> = ({
  day,
  onDateClick,
  onUnavailableSlotClick,
  onSessionAction,
  getStatusColor
}) => {
  if (!day) {
    return <div className="aspect-square border-b border-r border-gray-100"></div>;
  }

  const renderSession = (session: Session) => (
    <div 
      key={session.id}
      className={`${
        (day.sessions.length + day.unavailableSlots.length) > 3 
          ? 'text-xs px-0.5 py-0.5 rounded-sm border' 
          : 'text-xs px-1 py-0.5 rounded-sm border'
      } ${
        day.isPastDay && session.status === 'completed'
          ? 'text-green-600 bg-green-100 border-green-200'
          : getStatusColor(session.status)
      } flex items-center gap-1 truncate`}
    >
      <span className="truncate text-xs font-medium">
        {session.time}
      </span>
    </div>
  );

  const renderUnavailableSlot = (slot: any) => (
    <div 
      key={slot.id}
      className={`${
        (day.sessions.length + day.unavailableSlots.length) > 3 
          ? 'text-xs px-0.5 py-0.5 rounded-sm border' 
          : 'text-xs px-1 py-0.5 rounded-sm border'
      } bg-blue-100 text-blue-700 border-blue-300 flex items-center gap-1 truncate cursor-pointer hover:bg-blue-200`}
      onClick={(e) => onUnavailableSlotClick(day.date, e)}
    >
      <span className="truncate text-xs font-medium">
        {slot.time}
      </span>
      <Calendar className="w-3 h-3 text-blue-600 ml-auto" />
    </div>
  );

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
          day.sessions.length === 0 && day.unavailableSlots.length === 0 ? 
            'bg-red-25 hover:bg-red-50' : 
            'hover:bg-gray-50'
      }`}
      onClick={() => onDateClick(day.date)}
    >
      <div className={`${
        day.sessions.length > 3 
          ? 'text-xs' 
          : 'text-xs lg:text-sm'
      } font-medium ${
        day.sessions.length > 2 ? 'mb-0.5' : 'mb-1'
      } ${
        day.isToday ? 'text-primary font-bold' : 
        !day.isUnavailable ? 'text-blue-700' : 
        day.isPastDay ? 'text-gray-600' :
        'text-gray-900'
      } flex-shrink-0 flex items-center justify-between relative z-10`}>
        <span className={!day.isUnavailable ? '' : 'line-through'}>{day.date.getDate()}</span>
        {!day.isPastDay && !day.isUnavailable && (
          <Calendar className="w-3 h-3 text-blue-600" />
        )}
      </div>
      
      <div className={`${
        (day.sessions.length + day.unavailableSlots.length) > 3 ? 'space-y-0' : 'space-y-0.5'
      } flex-1 overflow-hidden relative z-10`}>
        {!day.isUnavailable ? (
          <div className="text-xs text-blue-600 font-medium px-1 py-0.5 bg-blue-200/50 rounded-sm relative z-10">
            Available
          </div>
        ) : day.isUnavailable && !day.isPastDay ? (
          <div className="text-xs text-red-600 font-medium px-1 py-0.5 bg-red-200/50 rounded-sm relative z-10">
            Unavailable
          </div>
        ) : (
          <>
            {/* Only show sessions for past days or available days */}
            {!day.isUnavailable && day.sessions.slice(0, (day.sessions.length + day.unavailableSlots.length) > 4 ? Math.max(1, 3 - day.unavailableSlots.length) : 4).map(renderSession)}
            
            {/* Only show unavailable slots for available days */}
            {!day.isUnavailable && day.unavailableSlots.slice(0, (day.sessions.length + day.unavailableSlots.length) > 4 ? Math.max(1, 3 - day.sessions.length) : 4).map(renderUnavailableSlot)}
          </>
        )}
        
        {!day.isUnavailable && (day.sessions.length + day.unavailableSlots.length) > 4 && (
          <div className="text-xs text-gray-500 px-0.5 truncate">
            +{(day.sessions.length + day.unavailableSlots.length) - 3}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarDayCell;
