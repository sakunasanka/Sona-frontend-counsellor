import React, { useState } from 'react';
import { X, CalendarX, Calendar, Clock } from 'lucide-react';
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

  // Check if this day already has any available slots
  const hasAvailableSlots = unavailableDate.timeRange && unavailableDate.isAvailable;

  const handleMarkAsAvailable = () => {
    // Pass the recurFor4Weeks value and time range to the parent component
    if (availabilityType === 'specific-hours') {
      onMarkAsAvailable(recurFor4Weeks, { start: startTime, end: endTime });
    } else {
      onMarkAsAvailable(recurFor4Weeks, null);
    }
  };

  // Create a proper Date object to ensure correct date display
  // Fix: Parse the date string with explicit year, month, day to avoid timezone issues
  const dateParts = unavailableDate.date.split('-').map(Number);
  const displayDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);

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
              {displayDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h4>
            <p className="text-gray-600">
              This day is currently unavailable for sessions
            </p>
          </div>

          {/* Only show the mark as available option if the day doesn't already have available slots */}
          {!hasAvailableSlots && (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-blue-900 mb-1">
                      Make Available for Sessions
                    </h5>
                    <p className="text-sm text-blue-700">
                      You can mark this day as available for scheduling sessions.
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                        Start Time
                      </label>
                      <select
                        id="startTime"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
                      >
                        {Array.from({ length: 9 }, (_, i) => i + 9).map((hour) => (
                          <option key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                            {hour}:00 {hour < 12 ? 'AM' : 'PM'}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                        End Time
                      </label>
                      <select
                        id="endTime"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
                      >
                        {Array.from({ length: 9 }, (_, i) => i + 9).map((hour) => (
                          <option key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                            {hour}:00 {hour < 12 ? 'AM' : 'PM'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="recurFor4Weeks"
                    checked={recurFor4Weeks}
                    onChange={() => setRecurFor4Weeks(!recurFor4Weeks)}
                    className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                  />
                  <label htmlFor="recurFor4Weeks" className="ml-2 text-sm text-gray-700">
                    Repeat for next 4 weeks
                  </label>
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMarkAsAvailable}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Mark as Available
                </button>
              </div>
            </>
          )}

          {/* Show message if the day already has available slots */}
          {hasAvailableSlots && (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <Clock className="w-5 h-5 text-green-600 mt-0.5" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-green-900 mb-1">
                      Partially Available Day
                    </h5>
                    <p className="text-sm text-green-700">
                      This day already has available time slots: {unavailableDate.timeRange?.start} - {unavailableDate.timeRange?.end}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnavailableDayDetailsModal;
