import React from 'react';
import { X, Clock, Check, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { Session } from '../types';

interface PendingRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingSessions: Session[];
  onSessionAction: (sessionId: string, action: 'accept' | 'reject') => void;
}

export const PendingRequestsModal: React.FC<PendingRequestsModalProps> = ({
  isOpen,
  onClose,
  pendingSessions,
  onSessionAction,
}) => {
  if (!isOpen) return null;

  const handleSessionAction = (sessionId: string, action: 'accept' | 'reject') => {
    onSessionAction(sessionId, action);
    // Close modal if no more pending requests after this action
    const remainingPending = pendingSessions.filter(s => s.id !== sessionId);
    if (remainingPending.length === 0) {
      onClose();
    }
  };

  const handleBatchAction = (action: 'accept' | 'reject') => {
    pendingSessions.forEach(session => {
      onSessionAction(session.id, action);
    });
    onClose();
  };

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
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Pending Session Requests</h3>
                <p className="text-sm text-gray-600">
                  {pendingSessions.length} requests awaiting your response
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
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">All Caught Up!</h4>
              <p className="text-gray-500">No pending requests at the moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingSessions
                .sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime())
                .map(session => (
                <div 
                  key={session.id} 
                  className="p-4 rounded-lg border-2 border-orange-200 bg-orange-50 hover:bg-orange-75 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <Calendar className="w-4 h-4 text-orange-600" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900">{session.clientName}</h5>
                          <p className="text-sm text-gray-600">
                            {new Date(session.date).toLocaleDateString('en-US', { 
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
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200">
                            Pending
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <button
                        onClick={() => handleSessionAction(session.id, 'reject')}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        title="Reject Request"
                      >
                        <X className="w-4 h-4" />
                        <span className="hidden sm:inline">Reject</span>
                      </button>
                      <button
                        onClick={() => handleSessionAction(session.id, 'accept')}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        title="Accept Request"
                      >
                        <Check className="w-4 h-4" />
                        <span className="hidden sm:inline">Accept</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Batch Actions */}
              {pendingSessions.length > 1 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Batch Actions</h4>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleBatchAction('accept')}
                      className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Accept All ({pendingSessions.length})
                    </button>
                    <button
                      onClick={() => handleBatchAction('reject')}
                      className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject All ({pendingSessions.length})
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
