import React from 'react';
import { X, Calendar, CalendarX } from 'lucide-react';
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
  historicalData,
}) => {
  if (!isOpen || !historicalData) return null;

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
        
        <div className="p-6">
          {/* Historical Sessions */}
          {historicalData.sessions.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Completed Sessions</h4>
              <div className="space-y-2">
                {historicalData.sessions.map(session => (
                  <div 
                    key={session.id}
                    className="p-3 rounded-lg bg-green-50 border border-green-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{session.clientName}</p>
                        <p className="text-sm text-gray-600">{session.time} • {session.duration} minutes</p>
                      </div>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                        Completed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Historical Unavailability */}
          {historicalData.unavailableDetails && (
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Unavailability</h4>
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
                        <strong>Time:</strong> {historicalData.unavailableDetails.timeRange.start} - {historicalData.unavailableDetails.timeRange.end}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Historical Unavailable Slots */}
          {historicalData.unavailableSlots.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Unavailable Time Slots</h4>
              <div className="space-y-2">
                {historicalData.unavailableSlots.map(slot => (
                  <div 
                    key={slot.id}
                    className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-3"
                  >
                    <CalendarX className="w-4 h-4 text-red-600" />
                    <span className="font-medium text-red-900">{slot.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {historicalData.sessions.length === 0 && 
           !historicalData.unavailableDetails && 
           historicalData.unavailableSlots.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No sessions or unavailability recorded for this day</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
