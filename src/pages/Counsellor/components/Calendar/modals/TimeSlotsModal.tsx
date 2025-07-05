import React from 'react';
import { X, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { TimeSlot } from '../types';

interface TimeSlotsModalProps {
  selectedDate: Date;
  timeSlots: TimeSlot[];
  isTimeSlotUnavailable: (date: Date, time: string) => boolean;
  onClose: () => void;
}

const TimeSlotsModal: React.FC<TimeSlotsModalProps> = ({
  selectedDate,
  timeSlots,
  isTimeSlotUnavailable,
  onClose
}) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-screen overflow-y-auto"
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
        
        <div className="p-6">
          <div className="space-y-2">
            {timeSlots.map(slot => {
              const isSlotUnavailable = isTimeSlotUnavailable(selectedDate, slot.time);
              return (
                <div 
                  key={slot.id} 
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isSlotUnavailable
                      ? 'border-red-200 bg-red-50 opacity-75'
                      : slot.isBooked 
                        ? 'border-green-200 bg-green-50' 
                        : slot.isAvailable 
                          ? 'border-blue-200 bg-blue-50 hover:border-blue-300 cursor-pointer' 
                          : 'border-gray-200 bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`font-medium ${isSlotUnavailable ? 'text-red-700 line-through' : 'text-gray-900'}`}>
                        {slot.time}
                      </span>
                      {slot.isBooked && slot.client && !isSlotUnavailable && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-gray-600" />
                          <span className="text-sm text-gray-600">{slot.client.name}</span>
                        </div>
                      )}
                      {isSlotUnavailable && (
                        <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                          Unavailable
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {isSlotUnavailable ? (
                        <XCircle className="w-5 h-5 text-red-600" />
                      ) : slot.isBooked ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : slot.isAvailable ? (
                        <Clock className="w-5 h-5 text-blue-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                  {slot.isBooked && slot.client && !isSlotUnavailable && (
                    <div className="mt-2 text-sm text-gray-600">
                      Duration: {slot.client.duration} minutes
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
