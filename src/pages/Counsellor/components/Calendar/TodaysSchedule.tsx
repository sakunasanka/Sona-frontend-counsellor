import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Check, X, ChevronRight, ChevronUp } from 'lucide-react';
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
  const [showAllSessions, setShowAllSessions] = useState(false);
  const [containerHeight, setContainerHeight] = useState<string>('auto');
  const containerRef = useRef<HTMLDivElement>(null);
  
  const todayString = new Date().toISOString().split('T')[0];
  const todaySessions = sessions
    .filter(session => session.date === todayString)
    .sort((a, b) => a.time.localeCompare(b.time));

  // Show all sessions if showAllSessions is true, otherwise limit to 3
  const displaySessions = showAllSessions ? todaySessions : todaySessions.slice(0, 3);
  const hasMoreSessions = todaySessions.length > 3;
  
  // Initialize container height when component mounts
  useEffect(() => {
    // Set initial height after a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (containerRef.current) {
        const sessionHeight = 80; // Approximate height of each session item
        const buttonHeight = 24; // Approximate height of the "View more" button
        const spacing = 12; // Spacing between items
        // Calculate the height without extra padding at the bottom
        const initialHeight = Math.min(todaySessions.length, 3) * (sessionHeight + spacing) - (todaySessions.length > 0 ? spacing : 0) + (hasMoreSessions ? buttonHeight : 0);
        setContainerHeight(`${initialHeight}px`);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Update container height when sessions change or showAllSessions changes
  useEffect(() => {
    if (containerRef.current) {
      if (showAllSessions) {
        // When showing all sessions, set height to the full scroll height
        // Subtract a small amount to remove extra space at the bottom
        setContainerHeight(`${containerRef.current.scrollHeight - 8}px`);
      } else {
        // When collapsing, first set height to current scroll height
        setContainerHeight(`${containerRef.current.scrollHeight}px`);
        // Force a reflow
        containerRef.current.offsetHeight;
        // Then set to the height of just 3 sessions
        const sessionHeight = 80; // Approximate height of each session item
        const buttonHeight = 24; // Approximate height of the "View more" button
        const spacing = 12; // Spacing between items
        // Calculate the height without extra padding at the bottom
        const newHeight = Math.min(todaySessions.length, 3) * (sessionHeight + spacing) - (todaySessions.length > 0 ? spacing : 0) + (hasMoreSessions ? buttonHeight : 0);
        setContainerHeight(`${newHeight}px`);
      }
    }
  }, [showAllSessions, todaySessions.length, hasMoreSessions]);
  
  const toggleShowAllSessions = () => {
    setShowAllSessions(prev => !prev);
  };

    return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Calendar className="w-4 lg:w-5 h-4 lg:h-5 text-primary" />
        Today's Schedule
      </h3>
      <div 
        ref={containerRef}
        className="space-y-3 transition-all duration-300 ease-in-out overflow-hidden"
        style={{ height: containerHeight }}>
        {displaySessions.map(session => (
          <div 
            key={session.id} 
            className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg border-l-4 ${
              session.status === 'confirmed' ? 'border-l-green-400' : 
              session.status === 'pending' ? 'border-l-orange-400' : 'border-l-blue-400'
            } transition-all duration-300 ease-in-out`}>
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
        
        {/* Show "View more" or "Show less" button */}
        {hasMoreSessions && (
          <div className="flex items-center justify-center mt-2">
            <button 
              onClick={toggleShowAllSessions}
              className="flex items-center gap-1 text-sm text-primary hover:text-primaryLight transition-colors"
            >
              {showAllSessions ? (
                <>
                  <span>Show less</span>
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>View {todaySessions.length - 3} more</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
        
        {todaySessions.length === 0 && (
          <p className="text-gray-500 text-center py-4">No sessions today</p>
        )}
      </div>
    </div>
  );
};

export default TodaysSchedule;
