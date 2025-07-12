import React, { useState } from 'react';
import { CalendarX, Settings } from 'lucide-react';
import UnavailabilitySettingsModal from './modals/UnavailabilitySettingsModal';

interface CalendarHeaderProps {
  onMarkUnavailable: () => void;
  onSaveUnavailabilityRules: (rules: any[]) => void;
  existingRules?: any[];
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  onMarkUnavailable,
  onSaveUnavailabilityRules,
  existingRules = []
}) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Calendar</h2>
      <div className="flex items-center gap-3">
        <button
          onClick={onMarkUnavailable}
          className="bg-primary from-pink-500 to-purple-500 hover:bg-primaryLight text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg text-sm font-medium transition-all shadow-sm flex items-center gap-2 flex-shrink-0"
        >
          <CalendarX className="w-4 lg:w-5 h-4 lg:h-5" />
          Mark as Available
        </button>
        <button
          onClick={() => setShowSettings(true)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Availability Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <UnavailabilitySettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={onSaveUnavailabilityRules}
        existingRules={existingRules}
      />
    </div>
  );
};

export default CalendarHeader;
