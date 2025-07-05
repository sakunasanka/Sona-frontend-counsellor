import React from 'react';
import { X, CalendarX } from 'lucide-react';
import { UnavailableDate } from '../types';

interface UnavailableDayDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  unavailableDate: UnavailableDate | null;
  onMarkAsAvailable: () => void;
}

export const UnavailableDayDetailsModal: React.FC<UnavailableDayDetailsModalProps> = ({
  isOpen,
  onClose,
  unavailableDate,
  onMarkAsAvailable,
}) => {
  if (!isOpen || !unavailableDate) return null;

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
              {unavailableDate.isFullDay ? 'Unavailable Day' : 'Unavailable Time Slots'}
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
              {unavailableDate.isFullDay 
                ? 'This day is marked as unavailable' 
                : 'Some time slots are marked as unavailable'
              }
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <CalendarX className="w-5 h-5 text-red-600 mt-0.5" />
              </div>
              <div className="flex-1">
                <h5 className="font-medium text-red-900 mb-1">
                  {unavailableDate.isFullDay ? 'Full Day Unavailable' : 'Partial Day Unavailable'}
                </h5>
                {unavailableDate.reason && (
                  <p className="text-sm text-red-700 mb-2">
                    <strong>Reason:</strong> {unavailableDate.reason}
                  </p>
                )}
                {!unavailableDate.isFullDay && unavailableDate.timeRange && (
                  <p className="text-sm text-red-700">
                    <strong>Time:</strong> {unavailableDate.timeRange.start} - {unavailableDate.timeRange.end}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex pt-4">
            <button 
              onClick={onMarkAsAvailable}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition-all"
            >
              Mark as Available
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
