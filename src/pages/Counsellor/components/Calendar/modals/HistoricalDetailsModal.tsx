import React from 'react';
import { X, Calendar, CalendarX, History } from 'lucide-react';
import { Session, UnavailableDate } from '../types';

interface HistoricalDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  historicalData: {
    date: Date;
    sessions: Session[];
    unavailableSlots: any[];
    unavailableDetails?: UnavailableDate;
  } | null;
}

export const HistoricalDetailsModal: React.FC<HistoricalDetailsModalProps> = ({
  isOpen,
  onClose,
  historicalData
}) => {
  if (!isOpen || !historicalData) return null;

  // Format time to display in 12-hour format
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 === 0 ? 12 : hours % 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              {historicalData.date.toLocaleDateString('en-US', { 
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
        
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          {historicalData.sessions.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Sessions</h4>
              <div className="space-y-4">
                {historicalData.sessions.map(session => (
                  <div 
                    key={session.id} 
                    className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-900">{formatTime(session.time)}</span>
                        <div className="flex items-center gap-2">
                          <History className="w-3 h-3 text-gray-500" />
                          <span className="text-sm text-gray-600">{session.clientName}</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Completed
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Duration: {session.duration} minutes
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {historicalData.unavailableDetails && (
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Unavailable slots</h4>
              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                <div className="flex items-start gap-3">
                  <CalendarX className="w-5 h-5 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <h5 className="font-medium text-red-900 mb-1">
                      {historicalData.unavailableDetails.isFullDay ? 'Full Day Unavailable' : 'Partial Day Unavailable'}
                    </h5>
                    {historicalData.unavailableDetails.reason && (
                      <p className="text-sm text-red-700 mb-2">
                        <strong>Reason:</strong> {historicalData.unavailableDetails.reason}
                      </p>
                    )}
                    {!historicalData.unavailableDetails.isFullDay && historicalData.unavailableDetails.timeRange && (
                      <p className="text-sm text-red-700">
                        <strong>Time:</strong> {formatTime(historicalData.unavailableDetails.timeRange.start)} - {formatTime(historicalData.unavailableDetails.timeRange.end)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Empty state */}
          {historicalData.sessions.length === 0 && 
           !historicalData.unavailableDetails && (
            <div className="text-center py-8">
              <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No sessions or unavailability recorded for this day</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoricalDetailsModal;
