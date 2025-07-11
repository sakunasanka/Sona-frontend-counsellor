import React, { useEffect, useRef } from 'react';
import { X, Calendar, Clock, CheckCircle, XCircle, History } from 'lucide-react';
import { TimeSlot, Session } from '../types';

interface TimeSlotsModalProps {
  selectedDate: Date;
  timeSlots: TimeSlot[];
  sessions: Session[];
  isTimeSlotUnavailable: (date: Date, time: string) => boolean;
  onClose: () => void;
}

const TimeSlotsModal: React.FC<TimeSlotsModalProps> = ({
  selectedDate,
  timeSlots,
  sessions,
  isTimeSlotUnavailable,
  onClose
}) => {
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
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    
    // If selected date is before today, all slots are in the past
    if (selectedDateStr < today) return true;
    // If selected date is after today, no slots are in the past
    if (selectedDateStr > today) return false;
    
    // For today, compare with current time
    const [hours, minutes] = time.split(':').map(Number);
    const slotTime = hours * 60 + minutes;
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    return slotTime < currentTime;
  };

  // Helper function to check if a time slot is the current hour
  const isCurrentTimeSlot = (time: string) => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    
    // Only check for today
    if (selectedDateStr !== today) return false;
    
    const [hours] = time.split(':').map(Number);
    return hours === now.getHours();
  };

  // Scroll to current time when modal opens
  useEffect(() => {
    if (currentTimeRef.current && modalContentRef.current) {
      const today = new Date().toISOString().split('T')[0];
      const selectedDateStr = selectedDate.toISOString().split('T')[0];
      
      // Only scroll if viewing today's schedule
      if (selectedDateStr === today) {
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
          <div className="space-y-4">
            {timeSlots.map((slot, index) => {
              const isSlotUnavailable = isTimeSlotUnavailable(selectedDate, slot.time);
              const sessionForSlot = getSessionForTimeSlot(slot.time);
              const isPendingSession = sessionForSlot?.status === 'pending';
              const isPastTime = isBeforeCurrentTime(slot.time);
              const isCurrentTime = isCurrentTimeSlot(slot.time);
              
              return (
                <div key={slot.id} className="relative" ref={isCurrentTime ? currentTimeRef : null}>
                  <div 
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isPendingSession
                        ? 'border-orange-300 bg-orange-50 shadow-md'
                        : isSlotUnavailable
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
                        {isPendingSession && (
                          <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded font-medium">
                            Pending Review
                          </span>
                        )}
                        {isSlotUnavailable && (
                          <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                            Unavailable
                          </span>
                        )}
                        {isPastTime && !isSlotUnavailable && !slot.isBooked && !isPendingSession && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            Past
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {isPendingSession ? (
                          <Clock className="w-5 h-5 text-orange-600" />
                        ) : isSlotUnavailable ? (
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
                        {isPendingSession && (
                          <span className="block text-orange-600 font-medium">
                            This session requires your approval
                          </span>
                        )}
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
