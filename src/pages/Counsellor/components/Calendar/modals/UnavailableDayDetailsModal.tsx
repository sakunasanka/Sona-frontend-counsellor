import React, { useState } from 'react';
import { X, CalendarX } from 'lucide-react';
import { UnavailableDate } from '../types';

interface UnavailableDayDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  unavailableDate: UnavailableDate | null;
  onMarkAsAvailable: (recurFor4Weeks: boolean, timeRange?: {start: string, end: string} | null) => void;
}

export const UnavailableDayDetailsModal: React.FC<UnavailableDayDetailsModalProps> = ({
  isOpen,
  onClose,
  unavailableDate,
  onMarkAsAvailable,
}) => {
  const [recurFor4Weeks, setRecurFor4Weeks] = useState(false);
  const [availabilityType, setAvailabilityType] = useState<'full-day' | 'specific-hours'>('full-day');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  
  if (!isOpen || !unavailableDate) return null;

  const handleMarkAsAvailable = () => {
    // Pass the recurFor4Weeks value and time range to the parent component
    if (availabilityType === 'specific-hours') {
      onMarkAsAvailable(recurFor4Weeks, { start: startTime, end: endTime });
    } else {
      onMarkAsAvailable(recurFor4Weeks, null);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              Unavailable Day
            </h3>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="text-center">
            <CalendarX className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              {new Date(unavailableDate.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h4>
            <p className="text-gray-600">
              This day is currently unavailable
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <CalendarX className="w-5 h-5 text-red-600 mt-0.5" />
              </div>
              <div className="flex-1">
                <h5 className="font-medium text-red-900 mb-1">
                  Unavailable for Sessions
                </h5>
                <p className="text-sm text-red-700">
                  You can make this day available for scheduling sessions.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700 mb-1">Availability Type:</div>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="full-day"
                    name="availabilityType"
                    value="full-day"
                    checked={availabilityType === 'full-day'}
                    onChange={() => setAvailabilityType('full-day')}
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
                    name="availabilityType"
                    value="specific-hours"
                    checked={availabilityType === 'specific-hours'}
                    onChange={() => setAvailabilityType('specific-hours')}
                    className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                  />
                  <label htmlFor="specific-hours" className="ml-2 text-sm text-gray-700">
                    Specific Hours
                  </label>
                </div>
              </div>
            </div>
            
            {availabilityType === 'specific-hours' && (
              <div className="space-y-2 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-blue-700 mb-2">Select Time Range:</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="startTime" className="block text-xs text-blue-600 mb-1">
                      Start Time
                    </label>
                    <select
                      id="startTime"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full p-2 border border-blue-300 rounded-md text-sm bg-white"
                    >
                      {Array.from({ length: 17 }, (_, i) => i + 8).map((hour) => (
                        <option key={`start-${hour}`} value={`${hour.toString().padStart(2, '0')}:00`}>
                          {`${hour.toString().padStart(2, '0')}:00`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="endTime" className="block text-xs text-blue-600 mb-1">
                      End Time
                    </label>
                    <select
                      id="endTime"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full p-2 border border-blue-300 rounded-md text-sm bg-white"
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
                Make available for this week and 3 more weeks
              </label>
            </div>
            
            <div className="flex pt-2">
              <button 
                onClick={handleMarkAsAvailable}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition-all"
              >
                Mark as Available
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
