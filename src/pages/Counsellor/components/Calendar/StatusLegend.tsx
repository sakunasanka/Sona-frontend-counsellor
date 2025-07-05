import React from 'react';

const StatusLegend: React.FC = () => {
  return (
    <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-100 p-3">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Session Status Legend</h3>
      <div className="flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-100 border border-green-200"></div>
          <span className="text-gray-600">Confirmed Sessions</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-orange-100 border border-orange-200 border-l-2 border-l-orange-400"></div>
          <span className="text-gray-600">Pending Requests (Need Action)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-50 border border-blue-200"></div>
          <span className="text-gray-600">Available Slots</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-100 border border-red-200"></div>
          <span className="text-gray-600">Unavailable</span>
        </div>
      </div>
    </div>
  );
};

export default StatusLegend;
