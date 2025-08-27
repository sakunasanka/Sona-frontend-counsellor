import React from 'react';

const StatusLegend: React.FC = () => {
  return (
    <div className="mb-4 flex flex-wrap gap-2 items-center">
      <div className="text-sm font-medium text-gray-700 mr-2">Legend:</div>
      
      <div className="flex items-center">
        <div className="w-3 h-3 bg-gray-200 border border-gray-300 rounded-sm mr-1"></div>
        <span className="text-xs text-gray-600">Unavailable</span>
      </div>
      
      <div className="flex items-center">
        <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded-sm mr-1"></div>
        <span className="text-xs text-gray-600">Available</span>
      </div>
      
      <div className="flex items-center">
        <div className="w-3 h-3 bg-green-50 border border-green-200 rounded-sm mr-1"></div>
        <span className="text-xs text-gray-600">Partially Available</span>
      </div>
    </div>
  );
};

export default StatusLegend;
