import React from 'react';
import { Session } from './types';

interface QuickStatsProps {
  sessions: Session[];
  onShowPendingRequests: () => void;
}

const QuickStats: React.FC<QuickStatsProps> = ({
  sessions,
  onShowPendingRequests
}) => {
  const pendingCount = sessions.filter(s => s.status === 'pending').length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Total Sessions</span>
          <span className="font-semibold text-gray-900">12</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Confirmed</span>
          <span className="font-semibold text-green-600">8</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Pending Requests</span>
          <span className="font-semibold text-orange-600">4</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Available Hours</span>
          <span className="font-semibold text-blue-600">32</span>
        </div>
      </div>
      
      {/* Quick Action for Pending - Only show if there are pending requests */}
      {pendingCount > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600 mb-2">Pending requests need your attention</p>
          <button 
            onClick={onShowPendingRequests}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors"
          >
            Review Pending ({pendingCount})
          </button>
        </div>
      )}
    </div>
  );
};

export default QuickStats;
