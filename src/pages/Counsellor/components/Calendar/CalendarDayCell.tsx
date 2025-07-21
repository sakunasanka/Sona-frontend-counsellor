import React from 'react';
import { Calendar, Clock } from 'lucide-react';
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

  // Determine cell styling based on the new rules
  const getCellStyles = () => {
    // Base styles
    let styles = "aspect-square border-b border-r border-gray-100 p-1 transition-colors flex flex-col relative";
    
    // If the day is today, add today styling
    if (day.isToday) {
      styles += " bg-blue-100 ring-2 ring-primary ring-inset";
    }
    
    // If the day is in the past, style it as past but make it clickable
    if (day.isPastDay) {
      styles += " bg-gray-50 opacity-80 cursor-pointer hover:bg-gray-100";
    } 
    // If the day is not clickable (outside the 2-week window), style it as unclickable
    else if (!day.isClickable) {
      styles += " bg-gray-100 cursor-default";
    }
    // If the day is clickable (within the 2-week window)
    else {
      // If the day is fully available
      if (!day.isUnavailable) {
        styles += " bg-blue-100 border-blue-300 hover:bg-blue-150 cursor-pointer";
      }
      // If the day has some available slots (partially available)
      else if (hasAvailableSlots) {
        styles += " bg-green-50 border-green-200 hover:bg-green-100 cursor-pointer";
      }
      // If the day is unavailable but clickable
      else {
        styles += " bg-gray-200 hover:bg-gray-300 cursor-pointer";
      }
    }
    
    return styles;
  };

  // Determine text styling for the date number
  const getDateNumberStyles = () => {
    let styles = "text-xs lg:text-sm font-medium mb-1 flex items-center justify-between relative z-10";
    
    if (day.isToday) {
      styles += " text-primary font-bold";
    } else if (!day.isClickable) {
      styles += " text-gray-500"; // Unclickable days
    } else if (!day.isUnavailable) {
      styles += " text-blue-700"; // Available days
    } else if (hasAvailableSlots) {
      styles += " text-green-700"; // Partially available days - changed from blue to green
    } else if (day.isPastDay) {
      styles += " text-gray-600"; // Past days
    } else {
      styles += " text-gray-900"; // Default
    }
    
    return styles;
  };

  return (
    <div 
      className={getCellStyles()}
      onClick={() => onDateClick(day.date)} // Make all days clickable, including past days
    >
      {/* Date number and availability indicator */}
      <div className={getDateNumberStyles()}>
        <span className={!day.isUnavailable || hasAvailableSlots ? '' : 'line-through'}>
          {day.date.getDate()}
        </span>
        {(day.isClickable || day.isPastDay) && (!day.isUnavailable || hasAvailableSlots) && (
          <Calendar className="w-3 h-3 text-blue-600" />
        )}
      </div>
      
      {/* Partial day slots - show if there are any */}
      {day.unavailableSlots.length > 0 && (
        <div className="space-y-0.5 mb-1">
          {day.unavailableSlots.map(renderPartialDaySlot)}
        </div>
      )}
      
      {/* Sessions - show up to the limit */}
      {day.sessions.length > 0 && (
        <div className="space-y-0.5">
          {day.sessions.slice(0, maxSessionsDesktop).map(renderSession)}
          {day.sessions.length > maxSessionsDesktop && (
            <div className="text-xs text-gray-600 font-medium">
              +{day.sessions.length - maxSessionsDesktop} more
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarDayCell;
