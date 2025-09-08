import React from 'react';
import { X, Clock, Calendar, CheckCircle } from 'lucide-react';
import { Session } from '../types';

interface PendingRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingSessions: Session[];
}

export const PendingRequestsModal: React.FC<PendingRequestsModalProps> = ({
  isOpen,
  onClose,
  pendingSessions,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Confirmed Sessions</h3>
                <p className="text-sm text-gray-600">
                  {pendingSessions.length} confirmed sessions
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {pendingSessions.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Confirmed Sessions</h4>
              <p className="text-gray-500">You don't have any confirmed sessions at the moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingSessions
                .sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime())
                .map(session => (
                <div 
                  key={session.id} 
                  className="p-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Calendar className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900">{session.clientName}</h5>
                          <p className="text-sm text-gray-600">
                            {new Date(session.date + 'T00:00:00').toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 ml-11">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{session.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>{session.duration} minutes</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                            Confirmed
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
