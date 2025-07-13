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
  const confirmedCount = sessions.filter(s => s.status === 'confirmed').length;

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
          <span className="font-semibold text-green-600">{confirmedCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Available Hours</span>
          <span className="font-semibold text-blue-600">32</span>
        </div>
      </div>
      
      {/* Quick Action for Confirmed Sessions */}
      {confirmedCount > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600 mb-2">View all your confirmed sessions</p>
          <button 
            onClick={onShowPendingRequests}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors"
          >
            View Confirmed ({confirmedCount})
          </button>
        </div>
      )}
    </div>
  );
};

export default QuickStats;
