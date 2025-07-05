import React from 'react';
import TodaysSchedule from './TodaysSchedule';
import QuickStats from './QuickStats';
import { Session } from './types';

interface CalendarSidebarProps {
  sessions: Session[];
  onSessionAction: (sessionId: string, action: 'accept' | 'reject') => void;
  onShowPendingRequests: () => void;
  getStatusColor: (status: string) => string;
}

const CalendarSidebar: React.FC<CalendarSidebarProps> = ({
  sessions,
  onSessionAction,
  onShowPendingRequests,
  getStatusColor
}) => {
  return (
    <div className="space-y-6">
      <TodaysSchedule
        sessions={sessions}
        onSessionAction={onSessionAction}
        getStatusColor={getStatusColor}
      />
      <QuickStats
        sessions={sessions}
        onShowPendingRequests={onShowPendingRequests}
      />
    </div>
  );
};

export default CalendarSidebar;
