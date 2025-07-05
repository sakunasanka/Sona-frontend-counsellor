import React from 'react';
import { Check, X, CalendarX } from 'lucide-react';
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
      } flex items-center gap-1 truncate ${
        session.status === 'pending' && !day.isPastDay ? 'border-l-2 border-l-orange-400' : ''
      }`}
    >
      <span className="truncate text-xs font-medium">
        {session.time}
      </span>
      {session.status === 'pending' && !day.isPastDay && (
        <div className="flex gap-1 ml-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSessionAction(session.id, 'accept');
            }}
            className="w-3 h-3 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center"
            title="Accept"
          >
            <Check className="w-2 h-2 text-white" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSessionAction(session.id, 'reject');
            }}
            className="w-3 h-3 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center"
            title="Reject"
          >
            <X className="w-2 h-2 text-white" />
          </button>
        </div>
      )}
    </div>
  );

  const renderUnavailableSlot = (slot: any) => (
    <div 
      key={slot.id}
      className={`${
        (day.sessions.length + day.unavailableSlots.length) > 3 
          ? 'text-xs px-0.5 py-0.5 rounded-sm border' 
          : 'text-xs px-1 py-0.5 rounded-sm border'
      } bg-red-100 text-red-700 border-red-300 flex items-center gap-1 truncate cursor-pointer hover:bg-red-200`}
      onClick={(e) => onUnavailableSlotClick(day.date, e)}
    >
      <span className="truncate text-xs font-medium">
        {slot.time}
      </span>
      <CalendarX className="w-3 h-3 text-red-600 ml-auto" />
    </div>
  );

  return (
    <div 
      className={`aspect-square border-b border-r border-gray-100 p-1 transition-colors flex flex-col relative cursor-pointer ${
        day.isToday ? 'bg-blue-50' : ''
      } ${
        day.isPastDay ? 'bg-gray-25 opacity-90' : ''
      } ${
        day.isUnavailable ? 
          'bg-red-100 border-red-300 hover:bg-red-150' : 
          day.sessions.length === 0 && day.unavailableSlots.length === 0 ? 
            'bg-blue-25 hover:bg-blue-50' : 
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
        day.isToday ? 'text-blue-600' : 
        day.isUnavailable ? 'text-red-700' : 
        day.isPastDay ? 'text-gray-600' :
        'text-gray-900'
      } flex-shrink-0 flex items-center justify-between relative z-10`}>
        <span className={day.isUnavailable ? 'line-through' : ''}>{day.date.getDate()}</span>
        {day.isUnavailable && (
          <CalendarX className="w-3 h-3 text-red-600" />
        )}
      </div>
      
      <div className={`${
        (day.sessions.length + day.unavailableSlots.length) > 3 ? 'space-y-0' : 'space-y-0.5'
      } flex-1 overflow-hidden relative z-10`}>
        {day.isUnavailable ? (
          <div className="text-xs text-red-600 font-medium px-1 py-0.5 bg-red-200/50 rounded-sm relative z-10">
            Unavailable
          </div>
        ) : (
          <>
            {/* Render sessions */}
            {day.sessions.slice(0, (day.sessions.length + day.unavailableSlots.length) > 4 ? Math.max(1, 3 - day.unavailableSlots.length) : 4).map(renderSession)}
            
            {/* Render unavailable slots */}
            {day.unavailableSlots.slice(0, (day.sessions.length + day.unavailableSlots.length) > 4 ? Math.max(1, 3 - day.sessions.length) : 4).map(renderUnavailableSlot)}
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
