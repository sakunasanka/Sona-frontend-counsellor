import React, { useState } from 'react';
import { NavBar, Sidebar } from '../../components/layout';
import {
  CalendarHeader,
  StatusLegend,
  CalendarGrid,
  CalendarSidebar,
  TimeSlotsModal,
  MarkUnavailableModal,
  UnavailableDayDetailsModal,
  HistoricalDetailsModal,
  PendingRequestsModal,
  TimeSlot,
  Session,
  UnavailableDate,
  HistoricalDate
} from './components/Calendar';

const CounsellorCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [showUnavailable, setShowUnavailable] = useState(false);
  const [showUnavailableDetails, setShowUnavailableDetails] = useState(false);
  const [showHistoricalDetails, setShowHistoricalDetails] = useState(false);
  const [selectedHistoricalDate, setSelectedHistoricalDate] = useState<HistoricalDate | null>(null);
  const [selectedUnavailableDate, setSelectedUnavailableDate] = useState<UnavailableDate | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unavailabilityType, setUnavailabilityType] = useState('full-day');
  const [showPendingRequests, setShowPendingRequests] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  // Sample data
  const [sessions] = useState<Session[]>([
    // Today's sessions (July 3, 2025)
    {
      id: '1',
      clientName: 'Sarah Johnson',
      date: '2025-07-03',
      time: '10:00',
      duration: 60,
      status: 'confirmed'
    },
    {
      id: '2',
      clientName: 'Mike Chen',
      date: '2025-07-03',
      time: '14:30',
      duration: 45,
      status: 'confirmed'
    },
    {
      id: '4',
      clientName: 'John Doe',
      date: '2025-07-03',
      time: '09:00',
      duration: 45,
      status: 'confirmed'
    },
    {
      id: '5',
      clientName: 'Jane Smith',
      date: '2025-07-03',
      time: '16:00',
      duration: 60,
      status: 'pending'
    },
    {
      id: '6',
      clientName: 'Bob Wilson',
      date: '2025-07-03',
      time: '18:00',
      duration: 30,
      status: 'confirmed'
    },
    {
      id: '7',
      clientName: 'Alice Brown',
      date: '2025-07-03',
      time: '20:00',
      duration: 45,
      status: 'pending'
    },
    {
      id: '8',
      clientName: 'Maria Garcia',
      date: '2025-07-03',
      time: '11:30',
      duration: 60,
      status: 'confirmed'
    },
    {
      id: '9',
      clientName: 'David Thompson',
      date: '2025-07-03',
      time: '13:00',
      duration: 45,
      status: 'pending'
    },
    {
      id: '10',
      clientName: 'Jennifer Lee',
      date: '2025-07-03',
      time: '15:00',
      duration: 60,
      status: 'confirmed'
    },
    {
      id: '11',
      clientName: 'Robert Miller',
      date: '2025-07-03',
      time: '17:00',
      duration: 45,
      status: 'pending'
    },
    {
      id: '12',
      clientName: 'Lisa Anderson',
      date: '2025-07-03',
      time: '19:00',
      duration: 30,
      status: 'confirmed'
    },
    
    // Other days' sessions
    {
      id: '3',
      clientName: 'Emma Wilson',
      date: '2025-07-05',
      time: '11:00',
      duration: 60,
      status: 'pending'
    },
    {
      id: '13',
      clientName: 'Tom Williams',
      date: '2025-07-05',
      time: '14:00',
      duration: 45,
      status: 'confirmed'
    },
    {
      id: '14',
      clientName: 'Susan Davis',
      date: '2025-07-06',
      time: '10:30',
      duration: 60,
      status: 'confirmed'
    },
    {
      id: '15',
      clientName: 'Kevin Brown',
      date: '2025-07-06',
      time: '15:30',
      duration: 45,
      status: 'pending'
    },
    {
      id: '16',
      clientName: 'Nancy Clark',
      date: '2025-07-07',
      time: '18:00',
      duration: 60,
      status: 'confirmed'
    },
    {
      id: '17',
      clientName: 'Paul Martinez',
      date: '2025-07-08',
      time: '09:30',
      duration: 45,
      status: 'pending'
    },
    {
      id: '18',
      clientName: 'Rachel Green',
      date: '2025-07-08',
      time: '16:30',
      duration: 60,
      status: 'confirmed'
    },
    {
      id: '19',
      clientName: 'Steven Hall',
      date: '2025-07-09',
      time: '11:00',
      duration: 45,
      status: 'confirmed'
    },
    {
      id: '20',
      clientName: 'Monica White',
      date: '2025-07-09',
      time: '14:30',
      duration: 60,
      status: 'pending'
    },
    {
      id: '21',
      clientName: 'James Taylor',
      date: '2025-07-11',
      time: '10:00',
      duration: 45,
      status: 'confirmed'
    },
    {
      id: '22',
      clientName: 'Laura Lopez',
      date: '2025-07-11',
      time: '17:00',
      duration: 60,
      status: 'pending'
    },
    {
      id: '23',
      clientName: 'Daniel King',
      date: '2025-07-12',
      time: '13:00',
      duration: 45,
      status: 'confirmed'
    }
  ]);

  // Historical data (sessions and unavailability before today)
  const [historicalSessions] = useState<Session[]>([
    {
      id: 'h1',
      clientName: 'David Johnson',
      date: '2025-07-01',
      time: '10:00',
      duration: 60,
      status: 'completed'
    },
    {
      id: 'h2',
      clientName: 'Lisa Chen',
      date: '2025-07-01',
      time: '14:00',
      duration: 45,
      status: 'completed'
    },
    {
      id: 'h3',
      clientName: 'Mark Wilson',
      date: '2025-07-02',
      time: '09:00',
      duration: 60,
      status: 'completed'
    },
    {
      id: 'h4',
      clientName: 'Sarah Davis',
      date: '2025-07-02',
      time: '11:00',
      duration: 45,
      status: 'completed'
    },
    {
      id: 'h5',
      clientName: 'Tom Brown',
      date: '2025-06-30',
      time: '16:00',
      duration: 30,
      status: 'completed'
    }
  ]);

  const [historicalUnavailableDates] = useState<UnavailableDate[]>([
    {
      id: 'hu1',
      date: '2025-06-29',
      reason: 'Medical appointment',
      isFullDay: true
    },
    {
      id: 'hu2',
      date: '2025-07-01',
      reason: 'Training session',
      isFullDay: false,
      timeRange: {
        start: '13:00',
        end: '15:00'
      }
    }
  ]);

  const [unavailableDates] = useState<UnavailableDate[]>([
    {
      id: '1',
      date: '2025-07-04',
      reason: 'Personal leave',
      isFullDay: true
    },
    {
      id: '2',
      date: '2025-07-07',
      reason: 'Conference',
      isFullDay: false,
      timeRange: {
        start: '09:00',
        end: '17:00'
      }
    },
    {
      id: '3',
      date: '2025-07-08',
      reason: 'Training session',
      isFullDay: false,
      timeRange: {
        start: '14:00',
        end: '16:00'
      }
    },
    {
      id: '4',
      date: '2025-07-10',
      reason: 'Medical appointment',
      isFullDay: false,
      timeRange: {
        start: '10:00',
        end: '12:00'
      }
    },
    {
      id: '5',
      date: '2025-07-15',
      reason: 'Vacation',
      isFullDay: true
    },
    {
      id: '6',
      date: '2025-07-20',
      reason: 'Team building',
      isFullDay: false,
      timeRange: {
        start: '13:00',
        end: '18:00'
      }
    }
  ]);

  const [timeSlots] = useState<TimeSlot[]>([
    { id: '1', time: '00:00', isBooked: false, isAvailable: true },
    { id: '2', time: '01:00', isBooked: false, isAvailable: true },
    { id: '3', time: '02:00', isBooked: false, isAvailable: true },
    { id: '4', time: '03:00', isBooked: false, isAvailable: true },
    { id: '5', time: '04:00', isBooked: false, isAvailable: true },
    { id: '6', time: '05:00', isBooked: false, isAvailable: true },
    { id: '7', time: '06:00', isBooked: false, isAvailable: true },
    { id: '8', time: '07:00', isBooked: false, isAvailable: true },
    { id: '9', time: '08:00', isBooked: false, isAvailable: true },
    { id: '10', time: '09:00', isBooked: false, isAvailable: true },
    { id: '11', time: '10:00', isBooked: true, isAvailable: true, client: { name: 'Sarah Johnson', duration: 60 } },
    { id: '12', time: '11:00', isBooked: false, isAvailable: true },
    { id: '13', time: '12:00', isBooked: false, isAvailable: true },
    { id: '14', time: '13:00', isBooked: false, isAvailable: true },
    { id: '15', time: '14:00', isBooked: false, isAvailable: true },
    { id: '16', time: '14:30', isBooked: true, isAvailable: true, client: { name: 'Mike Chen', duration: 45 } },
    { id: '17', time: '15:00', isBooked: false, isAvailable: true },
    { id: '18', time: '15:30', isBooked: false, isAvailable: true },
    { id: '19', time: '16:00', isBooked: false, isAvailable: true },
    { id: '20', time: '17:00', isBooked: false, isAvailable: true },
    { id: '21', time: '18:00', isBooked: false, isAvailable: true },
    { id: '22', time: '19:00', isBooked: false, isAvailable: true },
    { id: '23', time: '20:00', isBooked: false, isAvailable: true },
    { id: '24', time: '21:00', isBooked: false, isAvailable: true },
    { id: '25', time: '22:00', isBooked: false, isAvailable: true },
    { id: '26', time: '23:00', isBooked: false, isAvailable: true }
  ]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    const today = new Date();

    // Helper to compare local dates
    const isSameDay = (d1: Date, d2: Date) =>
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDay = new Date(year, month, day);
      const dateString = currentDay.toISOString().split('T')[0];
      // const todayString = today.toISOString().split('T')[0];
      // const isPastDay = dateString < todayString;
      // Use local comparison for isPastDay:
      let isPastDay = false;
      if (currentDay < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
        isPastDay = true;
      }
      // Get data based on whether it's a past day or not
      const daysSessions = isPastDay 
        ? historicalSessions.filter(session => session.date === dateString)
        : sessions.filter(session => session.date === dateString);
      
      const unavailableEntry = isPastDay
        ? historicalUnavailableDates.find(unavailable => unavailable.date === dateString)
        : unavailableDates.find(unavailable => unavailable.date === dateString);
        
      const isFullDayUnavailable = unavailableEntry?.isFullDay || false;
      
      // Create unavailable slots for partial unavailability
      const unavailableSlots = [];
      if (unavailableEntry && !unavailableEntry.isFullDay && unavailableEntry.timeRange) {
        unavailableSlots.push({
          id: `unavailable-${unavailableEntry.id}`,
          time: `${unavailableEntry.timeRange.start}-${unavailableEntry.timeRange.end}`,
          status: 'unavailable'
        });
      }
      days.push({
        date: currentDay,
        sessions: daysSessions,
        unavailableSlots: unavailableSlots,
        isToday: isSameDay(currentDay, today),
        isPastDay: isPastDay,
        isUnavailable: isFullDayUnavailable,
        unavailableDetails: unavailableEntry
      });
    }
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDateClick = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    const isPastDay = dateString < todayString;
    
    if (isPastDay) {
      // Handle historical date click - show read-only historical details
      const historicalSessionsForDate = historicalSessions.filter(session => session.date === dateString);
      const historicalUnavailableForDate = historicalUnavailableDates.find(unavailable => unavailable.date === dateString);
      
      // Create unavailable slots for historical partial unavailability
      const historicalUnavailableSlots = [];
      if (historicalUnavailableForDate && !historicalUnavailableForDate.isFullDay && historicalUnavailableForDate.timeRange) {
        historicalUnavailableSlots.push({
          id: `unavailable-${historicalUnavailableForDate.id}`,
          time: `${historicalUnavailableForDate.timeRange.start}-${historicalUnavailableForDate.timeRange.end}`,
          status: 'unavailable'
        });
      }
      
      setSelectedHistoricalDate({
        date: date,
        sessions: historicalSessionsForDate,
        unavailableSlots: historicalUnavailableSlots,
        unavailableDetails: historicalUnavailableForDate
      });
      setShowHistoricalDetails(true);
      return;
    }
    
    // Handle current/future date click
    const unavailableDate = unavailableDates.find(unavailable => unavailable.date === dateString && unavailable.isFullDay);
    
    if (unavailableDate) {
      // Show unavailable details popup for full day unavailable
      setSelectedUnavailableDate(unavailableDate);
      setShowUnavailableDetails(true);
      return;
    }
    
    setSelectedDate(date);
    setShowTimeSlots(true);
  };

  const handleUnavailableSlotClick = (date: Date, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the day click
    const dateString = date.toISOString().split('T')[0];
    const unavailableDate = unavailableDates.find(unavailable => unavailable.date === dateString);
    
    if (unavailableDate) {
      setSelectedUnavailableDate(unavailableDate);
      setShowUnavailableDetails(true);
    }
  };

  const handleMarkAsAvailable = () => {
    // Here you would implement the logic to remove the unavailable date
    console.log('Mark as available:', selectedUnavailableDate);
    setShowUnavailableDetails(false);
    setSelectedUnavailableDate(null);
  };

  // Helper function to check if a time slot is unavailable for partial day restrictions
  const isTimeSlotUnavailable = (date: Date, time: string) => {
    const dateString = date.toISOString().split('T')[0];
    const unavailableEntry = unavailableDates.find(u => u.date === dateString && !u.isFullDay);
    
    if (!unavailableEntry || !unavailableEntry.timeRange) return false;
    
    const slotTime = time.padStart(5, '0'); // Ensure format like "09:00"
    const startTime = unavailableEntry.timeRange.start;
    const endTime = unavailableEntry.timeRange.end;
    
    return slotTime >= startTime && slotTime <= endTime;
  };

  const handleSessionAction = (sessionId: string, action: 'accept' | 'reject') => {
    // Here you would implement the logic to accept/reject the session
    console.log(`${action} session ${sessionId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100 border-green-200';
      case 'pending': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'completed': return 'text-blue-600 bg-blue-100 border-blue-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navbar */}
      <NavBar onMenuClick={toggleSidebar} />

      {/* Bottom section: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r hidden lg:block">
          <Sidebar isOpen={true} onClose={closeSidebar} />
        </div>

        {/* Mobile Sidebar */}
        <div className="lg:hidden">
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-4 lg:p-6">
          {/* Header */}
          <CalendarHeader onMarkUnavailable={() => setShowUnavailable(true)} />

          {/* Status Legend */}
          <StatusLegend />

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 h-full">
            {/* Calendar */}
            <div className="xl:col-span-3">
              <CalendarGrid
                currentDate={currentDate}
                days={days}
                months={months}
                daysOfWeek={daysOfWeek}
                onNavigateMonth={navigateMonth}
                onToday={() => setCurrentDate(new Date())}
                onDateClick={handleDateClick}
                onUnavailableSlotClick={handleUnavailableSlotClick}
                onSessionAction={handleSessionAction}
                getStatusColor={getStatusColor}
              />
            </div>

            {/* Right Sidebar */}
            <CalendarSidebar
              sessions={sessions}
              onSessionAction={handleSessionAction}
              onShowPendingRequests={() => setShowPendingRequests(true)}
              getStatusColor={getStatusColor}
            />
          </div>

          {/* Modals */}
          {showTimeSlots && selectedDate && (
            <TimeSlotsModal
              selectedDate={selectedDate}
              timeSlots={timeSlots}
              sessions={sessions}
              isTimeSlotUnavailable={isTimeSlotUnavailable}
              onClose={() => setShowTimeSlots(false)}
            />
          )}

          {showUnavailable && (
            <MarkUnavailableModal
              unavailabilityType={unavailabilityType}
              onUnavailabilityTypeChange={setUnavailabilityType}
              sessions={sessions}
              unavailableDates={unavailableDates}
              onClose={() => {
                setShowUnavailable(false);
                setUnavailabilityType('full-day');
              }}
            />
          )}

          <UnavailableDayDetailsModal
            isOpen={showUnavailableDetails}
            onClose={() => {
              setShowUnavailableDetails(false);
              setSelectedUnavailableDate(null);
            }}
            unavailableDate={selectedUnavailableDate}
            onMarkAsAvailable={handleMarkAsAvailable}
          />

          <HistoricalDetailsModal
            isOpen={showHistoricalDetails}
            onClose={() => {
              setShowHistoricalDetails(false);
              setSelectedHistoricalDate(null);
            }}
            historicalData={selectedHistoricalDate}
          />

          <PendingRequestsModal
            isOpen={showPendingRequests}
            onClose={() => setShowPendingRequests(false)}
            pendingSessions={sessions.filter(s => s.status === 'pending')}
            onSessionAction={handleSessionAction}
          />
        </div>
      </div>
    </div>
  );
};

export default CounsellorCalendar;