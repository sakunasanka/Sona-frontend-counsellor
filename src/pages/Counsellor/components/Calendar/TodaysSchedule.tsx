import React from 'react';
import { Calendar, Check, X } from 'lucide-react';
import { Session } from './types';

interface TodaysScheduleProps {
  sessions: Session[];
  onSessionAction: (sessionId: string, action: 'accept' | 'reject') => void;
  getStatusColor: (status: string) => string;
}

const TodaysSchedule: React.FC<TodaysScheduleProps> = ({
  sessions,
  onSessionAction,
  getStatusColor
}) => {
  const todayString = new Date().toISOString().split('T')[0];
  const todaySessions = sessions
    .filter(session => session.date === todayString)
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Calendar className="w-4 lg:w-5 h-4 lg:h-5 text-primary" />
        Today's Schedule
      </h3>
      <div className={`space-y-3 ${todaySessions.length > 2 ? 'max-h-40 overflow-y-auto' : ''}`}>
        {todaySessions.map(session => (
          <div key={session.id} className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg border-l-4 ${
            session.status === 'confirmed' ? 'border-l-green-400' : 
            session.status === 'pending' ? 'border-l-orange-400' : 'border-l-blue-400'
          }`}>
            <div className={`p-2 rounded-lg ${
              session.status === 'confirmed' ? 'bg-green-100' : 
              session.status === 'pending' ? 'bg-orange-100' : 'bg-blue-100'
            }`}>
              <Calendar className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{session.clientName}</p>
              <p className="text-sm text-gray-600">{session.time} • {session.duration}min</p>
            </div>
            {session.status === 'pending' ? (
              <div className="flex gap-2">
                <button
                  onClick={() => onSessionAction(session.id, 'accept')}
                  className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                  title="Accept"
                >
                  <Check className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onSessionAction(session.id, 'reject')}
                  className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  title="Reject"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                {session.status}
              </span>
            )}
          </div>
        ))}
        {todaySessions.length === 0 && (
          <p className="text-gray-500 text-center py-4">No sessions today</p>
        )}
      </div>
    </div>
  );
};

export default TodaysSchedule;
