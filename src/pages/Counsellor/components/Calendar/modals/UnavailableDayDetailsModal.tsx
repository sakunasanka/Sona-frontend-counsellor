import React, { useState } from 'react';
import { X, CalendarX } from 'lucide-react';
import { UnavailableDate } from '../types';

interface UnavailableDayDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  unavailableDate: UnavailableDate | null;
  onMarkAsAvailable: (recurFor4Weeks: boolean) => void;
}

export const UnavailableDayDetailsModal: React.FC<UnavailableDayDetailsModalProps> = ({
  isOpen,
  onClose,
  unavailableDate,
  onMarkAsAvailable,
}) => {
  const [recurFor4Weeks, setRecurFor4Weeks] = useState(false);
  
  if (!isOpen || !unavailableDate) return null;

  const handleMarkAsAvailable = () => {
    // Pass the recurFor4Weeks value to the parent component
    onMarkAsAvailable(recurFor4Weeks);
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
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="recurFor4Weeks"
              checked={recurFor4Weeks}
              onChange={(e) => setRecurFor4Weeks(e.target.checked)}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="recurFor4Weeks" className="ml-2 text-sm text-gray-700">
              Make available recurrently for 4 weeks
            </label>
          </div>
          
          <div className="flex pt-4">
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
  );
};
