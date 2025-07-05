import React from 'react';
import { X } from 'lucide-react';

interface MarkUnavailableModalProps {
  unavailabilityType: string;
  onUnavailabilityTypeChange: (type: string) => void;
  onClose: () => void;
}

const MarkUnavailableModal: React.FC<MarkUnavailableModalProps> = ({
  unavailabilityType,
  onUnavailabilityTypeChange,
  onClose
}) => {
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
            <h3 className="text-xl font-semibold text-gray-900">Mark Unavailable</h3>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input 
              type="date" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Availability Type</label>
            <select 
              value={unavailabilityType}
              onChange={(e) => onUnavailabilityTypeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            >
              <option value="full-day">Full Day Unavailable</option>
              <option value="partial">Partial Day Unavailable</option>
            </select>
          </div>
          
          {/* Time Range Fields with Smooth Animation */}
          <div 
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              unavailabilityType === 'partial' 
                ? 'max-h-48 opacity-100' 
                : 'max-h-0 opacity-0'
            }`}
          >
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <input 
                  type="time" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="Select start time"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <input 
                  type="time" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="Select end time"
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reason (optional)</label>
            <textarea 
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none transition-all"
              placeholder="Enter reason for unavailability..."
            />
          </div>
          
          <div className="pt-4">
            <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition-all">
              Mark Unavailable
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkUnavailableModal;
