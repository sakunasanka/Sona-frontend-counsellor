import React, { useEffect, useRef, useState } from 'react';
import { X, Calendar, Clock, CheckCircle, XCircle, History } from 'lucide-react';
import { TimeSlot, Session } from '../types';

interface TimeSlotsModalProps {
  selectedDate: Date;
  timeSlots: TimeSlot[];
  sessions: Session[];
  isTimeSlotUnavailable: (date: Date, time: string) => boolean;
  onClose: () => void;
  onMarkAsUnavailable?: (recurFor4Weeks?: boolean, timeRange?: {start: string, end: string} | null) => void;
}

const TimeSlotsModal: React.FC<TimeSlotsModalProps> = ({
  selectedDate,
  timeSlots,
  sessions,
  isTimeSlotUnavailable,
  onClose,
  onMarkAsUnavailable
}) => {
  const [recurFor4Weeks, setRecurFor4Weeks] = useState(false);
  const [unavailabilityType, setUnavailabilityType] = useState<'full-day' | 'specific-hours'>('full-day');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const currentTimeRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Get sessions for the selected date
  const dateString = selectedDate.toISOString().split('T')[0];
  const daysSessions = sessions.filter(session => session.date === dateString);

  // Helper function to get session for a time slot
  const getSessionForTimeSlot = (time: string) => {
    return daysSessions.find(session => session.time === time);
  };

  // Helper function to check if a time slot is before current time
  const isBeforeCurrentTime = (time: string) => {
    // Create a new Date object for the current time
    const now = new Date();
    
    // Create a new Date object for today at 00:00:00
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Create a new Date object for the selected date at 00:00:00
    const selectedDay = new Date(selectedDate);
    selectedDay.setHours(0, 0, 0, 0);
    
    // If selected date is before today, all slots are in the past
    if (selectedDay < today) return true;
    // If selected date is after today, no slots are in the past
    if (selectedDay > today) return false;
    
    // For today, compare with current time
    const [hours, minutes] = time.split(':').map(Number);
    const slotTime = hours * 60 + minutes;
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    return slotTime < currentTime;
  };

  // Helper function to check if a time slot is the current hour
  const isCurrentTimeSlot = (time: string) => {
    const now = new Date();
    
    // Create a new Date object for today at 00:00:00
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Create a new Date object for the selected date at 00:00:00
    const selectedDay = new Date(selectedDate);
    selectedDay.setHours(0, 0, 0, 0);
    
    // Only check for today
    if (selectedDay.getTime() !== today.getTime()) return false;
    
    const [hours] = time.split(':').map(Number);
    return hours === now.getHours();
  };

  // Scroll to current time when modal opens
  useEffect(() => {
    if (currentTimeRef.current && modalContentRef.current) {
      // Create a new Date object for today at 00:00:00
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Create a new Date object for the selected date at 00:00:00
      const selectedDay = new Date(selectedDate);
      selectedDay.setHours(0, 0, 0, 0);
      
      // Only scroll if viewing today's schedule
      if (selectedDay.getTime() === today.getTime()) {
        const modalContent = modalContentRef.current;
        const currentTimeElement = currentTimeRef.current;
        const modalHeight = modalContent.clientHeight;
        const scrollPosition = currentTimeElement.offsetTop - (modalHeight / 2);
        
        modalContent.scrollTo({
          top: scrollPosition,
          behavior: 'smooth'
        });
      }
    }
  }, [selectedDate]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-screen overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]" ref={modalContentRef}>
          <div className="space-y-4 mb-6">
            <div className="text-center">
              <Calendar className="w-12 h-12 text-blue-500 mx-auto mb-3" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Available Day
              </h4>
              <p className="text-gray-600">
                This day is available for scheduling sessions.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                </div>
                <div className="flex-1">
                  <h5 className="font-medium text-blue-900 mb-1">
                    Available for Sessions
                  </h5>
                  <p className="text-sm text-blue-700">
                    You can mark this day as unavailable.
                  </p>
                </div>
              </div>
            </div>

            {onMarkAsUnavailable && (
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700 mb-1">Unavailability Type:</div>
                  <div className="flex space-x-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="full-day"
                        name="unavailabilityType"
                        value="full-day"
                        checked={unavailabilityType === 'full-day'}
                        onChange={() => setUnavailabilityType('full-day')}
                        className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <label htmlFor="full-day" className="ml-2 text-sm text-gray-700">
                        Full Day
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="specific-hours"
                        name="unavailabilityType"
                        value="specific-hours"
                        checked={unavailabilityType === 'specific-hours'}
                        onChange={() => setUnavailabilityType('specific-hours')}
                        className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <label htmlFor="specific-hours" className="ml-2 text-sm text-gray-700">
                        Specific Hours
                      </label>
                    </div>
                  </div>
                </div>
                
                {unavailabilityType === 'specific-hours' && (
                  <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-700 mb-2">Select Time Range:</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="startTime" className="block text-xs text-gray-600 mb-1">
                          Start Time
                        </label>
                        <select
                          id="startTime"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        >
                          {Array.from({ length: 17 }, (_, i) => i + 8).map((hour) => (
                            <option key={`start-${hour}`} value={`${hour.toString().padStart(2, '0')}:00`}>
                              {`${hour.toString().padStart(2, '0')}:00`}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="endTime" className="block text-xs text-gray-600 mb-1">
                          End Time
                        </label>
                        <select
                          id="endTime"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        >
                          {Array.from({ length: 17 }, (_, i) => i + 8).map((hour) => (
                            <option key={`end-${hour}`} value={`${hour.toString().padStart(2, '0')}:00`}>
                              {`${hour.toString().padStart(2, '0')}:00`}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="recurFor4Weeks"
                    checked={recurFor4Weeks}
                    onChange={(e) => setRecurFor4Weeks(e.target.checked)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="recurFor4Weeks" className="ml-2 text-sm text-gray-700">
                    Make unavailable for this week and 3 more weeks
                  </label>
                </div>
                
                <div className="flex">
                  <button 
                    onClick={() => {
                      if (unavailabilityType === 'specific-hours') {
                        onMarkAsUnavailable(recurFor4Weeks, { start: startTime, end: endTime });
                      } else {
                        onMarkAsUnavailable(recurFor4Weeks, null);
                      }
                    }}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition-all"
                  >
                    Mark as Unavailable
                  </button>
                </div>
              </div>
            )}
          </div>

          <h5 className="font-medium text-gray-900 mb-4 border-t pt-4">Time Slots</h5>
          
          <div className="space-y-4">
            {timeSlots.map((slot) => {
              const isSlotUnavailable = isTimeSlotUnavailable(selectedDate, slot.time);
              const sessionForSlot = getSessionForTimeSlot(slot.time);
              const isPastTime = isBeforeCurrentTime(slot.time);
              const isCurrentTime = isCurrentTimeSlot(slot.time);
              
              return (
                <div key={slot.id} className="relative" ref={isCurrentTime ? currentTimeRef : null}>
                  <div 
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isSlotUnavailable
                        ? 'border-red-200 bg-red-50 opacity-75'
                        : slot.isBooked 
                          ? isPastTime
                            ? 'border-gray-200 bg-gray-50'
                            : 'border-green-200 bg-green-50'
                          : slot.isAvailable && !isPastTime
                            ? 'border-blue-200 bg-blue-50 hover:border-blue-300 cursor-pointer' 
                            : 'border-gray-200 bg-gray-50'
                    } ${isPastTime ? 'opacity-75' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`font-medium ${
                          isSlotUnavailable 
                            ? 'text-red-700 line-through' 
                            : isPastTime 
                              ? 'text-gray-500'
                              : 'text-gray-900'
                        }`}>
                          {slot.time}
                        </span>
                        {sessionForSlot && !isSlotUnavailable && (
                          <div className="flex items-center gap-2">
                            {isPastTime ? (
                              <History className="w-3 h-3 text-gray-500" />
                            ) : (
                              <Calendar className="w-3 h-3 text-gray-600" />
                            )}
                            <span className={`text-sm ${isPastTime ? 'text-gray-500' : 'text-gray-600'}`}>
                              {sessionForSlot.clientName}
                            </span>
                          </div>
                        )}
                        {slot.isBooked && slot.client && !sessionForSlot && !isSlotUnavailable && (
                          <div className="flex items-center gap-2">
                            {isPastTime ? (
                              <History className="w-3 h-3 text-gray-500" />
                            ) : (
                              <Calendar className="w-3 h-3 text-gray-600" />
                            )}
                            <span className={`text-sm ${isPastTime ? 'text-gray-500' : 'text-gray-600'}`}>
                              {slot.client.name}
                            </span>
                          </div>
                        )}
                        {isSlotUnavailable && (
                          <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                            Unavailable
                          </span>
                        )}
                        {isPastTime && !isSlotUnavailable && !slot.isBooked && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            Past
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {isSlotUnavailable ? (
                          <XCircle className="w-5 h-5 text-red-600" />
                        ) : slot.isBooked || sessionForSlot ? (
                          isPastTime ? (
                            <History className="w-5 h-5 text-gray-400" />
                          ) : (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          )
                        ) : slot.isAvailable && !isPastTime ? (
                          <Clock className="w-5 h-5 text-blue-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                    {(sessionForSlot || (slot.isBooked && slot.client)) && !isSlotUnavailable && (
                      <div className={`mt-2 text-sm ${isPastTime ? 'text-gray-500' : 'text-gray-600'}`}>
                        Duration: {sessionForSlot?.duration || slot.client?.duration} minutes
                      </div>
                    )}
                  </div>
                  
                  {/* Current time indicator */}
                  {isCurrentTime && (
                    <div className="absolute -bottom-2 inset-x-0 z-10">
                      <div className="relative flex items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-blue-500/20"></div>
                        <div className="h-[1.5px] flex-1 bg-blue-500"></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeSlotsModal;
