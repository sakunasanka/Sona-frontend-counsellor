import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Session, UnavailableDate } from '../types';

interface MarkUnavailableModalProps {
  unavailabilityType: string;
  onUnavailabilityTypeChange: (type: string) => void;
  onClose: () => void;
  sessions?: Session[];
  unavailableDates?: UnavailableDate[];
}

const MarkUnavailableModal: React.FC<MarkUnavailableModalProps> = ({
  unavailabilityType,
  onUnavailabilityTypeChange,
  onClose,
  sessions = [],
  unavailableDates = []
}) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [reason, setReason] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const checkConflicts = () => {
    if (!selectedDate) {
      setErrorMessage('Please select a date');
      return false;
    }

    // Check if selected date is in the past
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    if (selectedDate < todayString) {
      setErrorMessage('Cannot mark past dates as unavailable. Please select today or a future date.');
      return false;
    }

    // Check if the date already has full day unavailability
    const existingUnavailable = unavailableDates.find(
      unavailable => unavailable.date === selectedDate && unavailable.isFullDay
    );

    if (existingUnavailable) {
      setErrorMessage(`This date is already marked unavailable. Reason: ${existingUnavailable.reason || 'No reason provided'}`);
      return false;
    }

    if (unavailabilityType === 'full-day') {
      // Check if there are any sessions on this date
      const existingSessions = sessions.filter(session => session.date === selectedDate);
      if (existingSessions.length > 0) {
        const sessionNames = existingSessions.map(s => s.clientName).join(', ');
        setErrorMessage(`Cannot mark full day unavailable. There are existing sessions with: ${sessionNames}`);
        return false;
      }
    } else {
      // Partial day - check time conflicts
      if (!startTime || !endTime) {
        setErrorMessage('Please select both start and end times');
        return false;
      }

      if (startTime >= endTime) {
        setErrorMessage('End time must be after start time');
        return false;
      }

      // Check for existing partial unavailability conflicts
      const partialUnavailable = unavailableDates.find(
        unavailable => unavailable.date === selectedDate && 
        !unavailable.isFullDay && 
        unavailable.timeRange
      );

      if (partialUnavailable) {
        const existingStart = partialUnavailable.timeRange!.start;
        const existingEnd = partialUnavailable.timeRange!.end;
        
        // Check for time overlap
        if ((startTime >= existingStart && startTime < existingEnd) ||
            (endTime > existingStart && endTime <= existingEnd) ||
            (startTime <= existingStart && endTime >= existingEnd)) {
          setErrorMessage(`Time slot conflicts with existing unavailability (${existingStart}-${existingEnd}). Reason: ${partialUnavailable.reason || 'No reason provided'}`);
          return false;
        }
      }

      // Check for session conflicts in the time range
      const conflictingSessions = sessions.filter(session => {
        if (session.date !== selectedDate) return false;
        
        const sessionTime = session.time;
        return sessionTime >= startTime && sessionTime < endTime;
      });

      if (conflictingSessions.length > 0) {
        const conflictNames = conflictingSessions.map(s => `${s.clientName} at ${s.time}`).join(', ');
        setErrorMessage(`Cannot mark unavailable. There are existing sessions: ${conflictNames}`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = () => {
    setErrorMessage('');
    
    if (checkConflicts()) {
      // Process the unavailability marking here
      console.log('Marking unavailable:', {
        date: selectedDate,
        type: unavailabilityType,
        startTime: unavailabilityType === 'partial' ? startTime : undefined,
        endTime: unavailabilityType === 'partial' ? endTime : undefined,
        reason
      });
      onClose();
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
                          <h3 className="text-xl font-semibold text-gray-900">Mark as Available</h3>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700 text-sm">{errorMessage}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input 
              type="date" 
              value={selectedDate}
              min={new Date().toISOString().split('T')[0]} // Prevent selecting past dates
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setErrorMessage(''); // Clear error when date changes
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Availability Type</label>
            <select 
              value={unavailabilityType}
              onChange={(e) => {
                onUnavailabilityTypeChange(e.target.value);
                setErrorMessage(''); // Clear error when type changes
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            >
                              <option value="full-day">Full Day Available</option>
                <option value="partial">Partial Day Available</option>
            </select>
          </div>
          
          {/* Time Range Fields with Smooth Animation */}
          <div 
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              unavailabilityType === 'partial' 
                ? 'max-h-48 opacity-100' 
                : 'max-h-0 opacity-0'
            }`}
          >
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <input 
                  type="time" 
                  value={startTime}
                  onChange={(e) => {
                    setStartTime(e.target.value);
                    setErrorMessage('');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="Select start time"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <input 
                  type="time" 
                  value={endTime}
                  onChange={(e) => {
                    setEndTime(e.target.value);
                    setErrorMessage('');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="Select end time"
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reason (optional)</label>
            <textarea 
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none transition-all"
                              placeholder="Enter reason for availability..."
            />
          </div>
          
          <div className="pt-4">
            <button 
              onClick={handleSubmit}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition-all"
            >
                              Mark as Available
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MarkUnavailableModal;

