import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, Check, X, Settings, CheckCircle, XCircle, CalendarX } from 'lucide-react';
import { NavBar, Sidebar } from '../../components/layout';

interface TimeSlot {
  id: string;
  time: string;
  isBooked: boolean;
  isAvailable: boolean;
  client?: {
    name: string;
    duration: number;
  };
}

interface Session {
  id: string;
  clientName: string;
  date: string;
  time: string;
  duration: number;
  status: 'confirmed' | 'pending' | 'completed';
}

interface UnavailableDate {
  id: string;
  date: string;
  reason?: string;
  isFullDay: boolean;
  timeRange?: {
    start: string;
    end: string;
  };
}

const CounsellorCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [showUnavailable, setShowUnavailable] = useState(false);
  const [showUnavailableDetails, setShowUnavailableDetails] = useState(false);
  const [showHistoricalDetails, setShowHistoricalDetails] = useState(false);
  const [selectedHistoricalDate, setSelectedHistoricalDate] = useState<{
    date: Date;
    sessions: Session[];
    unavailableSlots: any[];
    unavailableDetails?: UnavailableDate;
  } | null>(null);
  const [selectedUnavailableDate, setSelectedUnavailableDate] = useState<UnavailableDate | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unavailabilityType, setUnavailabilityType] = useState('full-day');

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

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDay = new Date(year, month, day);
      const dateString = currentDay.toISOString().split('T')[0];
      const todayString = today.toISOString().split('T')[0];
      const isPastDay = dateString < todayString;
      
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
        isToday: dateString === todayString,
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
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        </div>

        {/* Mobile Sidebar */}
        <div className="lg:hidden">
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto lg:ml-0">
          <div className="h-full bg-gray-50">
            <div className="h-full max-w-7xl mx-auto p-2 lg:pl-1 lg:pr-4 lg:py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 lg:mb-4">
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">Calendar</h1>
                <p className="text-sm text-gray-600">Manage your sessions and availability</p>
            </div>
            <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowUnavailable(true)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 lg:px-4 py-2 rounded-lg font-medium transition-all shadow-sm flex items-center gap-2"
            >
              <CalendarX className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Mark Unavailable</span>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Status Legend */}
        <div className="mb-4 bg-white rounded-lg shadow-sm border border-gray-100 p-3">
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

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 h-full">
          {/* Calendar */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Calendar Header */}
              <div className="p-3 lg:p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg lg:text-xl font-bold text-gray-900">
                    {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => navigateMonth('prev')}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => setCurrentDate(new Date())}
                      className="px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Today
                    </button>
                    <button 
                      onClick={() => navigateMonth('next')}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Days of Week */}
              <div className="grid grid-cols-7 border-b border-gray-100">
                {daysOfWeek.map(day => (
                  <div key={day} className="p-2 text-center text-xs font-medium text-gray-500 bg-gray-50">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-0">
                {days.map((day, index) => (
                  <div 
                    key={index}
                    className={`aspect-square border-b border-r border-gray-100 p-1 transition-colors flex flex-col relative cursor-pointer ${
                      day?.isToday ? 'bg-blue-50' : ''
                    } ${
                      day?.isPastDay ? 'bg-gray-25 opacity-90' : ''
                    } ${
                      day?.isUnavailable ? 
                        'bg-red-100 border-red-300 hover:bg-red-150' : 
                        day?.sessions.length === 0 && day?.unavailableSlots.length === 0 && day ? 
                          'bg-blue-25 hover:bg-blue-50' : 
                          'hover:bg-gray-50'
                    }`}
                    onClick={() => day && handleDateClick(day.date)}
                  >
                    {day && (
                      <>
                        <div className={`${
                          day.sessions.length > 3 
                            ? 'text-xs' 
                            : 'text-xs lg:text-sm'
                        } font-medium ${
                          day.sessions.length > 2 ? 'mb-0.5' : 'mb-1'
                        } ${
                          day.isToday ? 'text-blue-600' : 
                          day.isUnavailable ? 'text-red-700' : 
                          day.isPastDay ? 'text-gray-600' :
                          'text-gray-900'
                        } flex-shrink-0 flex items-center justify-between relative z-10`}>
                          <span className={day.isUnavailable ? 'line-through' : ''}>{day.date.getDate()}</span>
                          {day.isUnavailable && (
                            <CalendarX className="w-3 h-3 text-red-600" />
                          )}
                        </div>
                        <div className={`${
                          (day.sessions.length + day.unavailableSlots.length) > 3 ? 'space-y-0' : 'space-y-0.5'
                        } flex-1 overflow-hidden relative z-10`}>
                          {day.isUnavailable ? (
                            <div className="text-xs text-red-600 font-medium px-1 py-0.5 bg-red-200/50 rounded-sm relative z-10">
                              Unavailable
                            </div>
                          ) : (
                            <>
                              {/* Render sessions */}
                              {day.sessions.slice(0, (day.sessions.length + day.unavailableSlots.length) > 4 ? Math.max(1, 3 - day.unavailableSlots.length) : 4).map(session => (
                                <div 
                                  key={session.id}
                                  className={`${
                                    (day.sessions.length + day.unavailableSlots.length) > 3 
                                      ? 'text-xs px-0.5 py-0.5 rounded-sm border' 
                                      : 'text-xs px-1 py-0.5 rounded-sm border'
                                  } ${
                                    day.isPastDay && session.status === 'completed'
                                      ? 'text-green-600 bg-green-100 border-green-200'
                                      : getStatusColor(session.status)
                                  } flex items-center gap-1 truncate ${
                                    session.status === 'pending' && !day.isPastDay ? 'border-l-2 border-l-orange-400' : ''
                                  }`}
                                >
                                  <span className="truncate text-xs font-medium">
                                    {session.time}
                                  </span>
                                  {session.status === 'pending' && !day.isPastDay && (
                                    <div className="flex gap-1 ml-auto">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleSessionAction(session.id, 'accept');
                                        }}
                                        className="w-3 h-3 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center"
                                        title="Accept"
                                      >
                                        <Check className="w-2 h-2 text-white" />
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleSessionAction(session.id, 'reject');
                                        }}
                                        className="w-3 h-3 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center"
                                        title="Reject"
                                      >
                                        <X className="w-2 h-2 text-white" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ))}
                              
                              {/* Render unavailable slots */}
                              {day.unavailableSlots.slice(0, (day.sessions.length + day.unavailableSlots.length) > 4 ? Math.max(1, 3 - day.sessions.length) : 4).map(slot => (
                                <div 
                                  key={slot.id}
                                  className={`${
                                    (day.sessions.length + day.unavailableSlots.length) > 3 
                                      ? 'text-xs px-0.5 py-0.5 rounded-sm border' 
                                      : 'text-xs px-1 py-0.5 rounded-sm border'
                                  } bg-red-100 text-red-700 border-red-300 flex items-center gap-1 truncate cursor-pointer hover:bg-red-200`}
                                  onClick={(e) => handleUnavailableSlotClick(day.date, e)}
                                >
                                  <span className="truncate text-xs font-medium">
                                    {slot.time}
                                  </span>
                                  <CalendarX className="w-3 h-3 text-red-600 ml-auto" />
                                </div>
                              ))}
                            </>
                          )}
                          {!day.isUnavailable && (day.sessions.length + day.unavailableSlots.length) > 4 && (
                            <div className="text-xs text-gray-500 px-0.5 truncate">
                              +{(day.sessions.length + day.unavailableSlots.length) - 3}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Today's Schedule */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Today's Schedule
              </h3>
              <div className="space-y-3">
                {sessions
                  .filter(session => session.date === new Date().toISOString().split('T')[0])
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map(session => (
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
                          onClick={() => handleSessionAction(session.id, 'accept')}
                          className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                          title="Accept"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleSessionAction(session.id, 'reject')}
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
                {sessions.filter(session => session.date === new Date().toISOString().split('T')[0]).length === 0 && (
                  <p className="text-gray-500 text-center py-4">No sessions today</p>
                )}
              </div>
            </div>

            {/* Quick Stats */}
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
              
              {/* Quick Action for Pending */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600 mb-2">Pending requests need your attention</p>
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                  Review Pending ({sessions.filter(s => s.status === 'pending').length})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Time Slots Modal */}
        {showTimeSlots && selectedDate && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowTimeSlots(false)}
          >
            <div 
              className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-screen overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                  <button 
                    onClick={() => setShowTimeSlots(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-2">
                  {timeSlots.map(slot => {
                    const isSlotUnavailable = selectedDate ? isTimeSlotUnavailable(selectedDate, slot.time) : false;
                    return (
                      <div 
                        key={slot.id} 
                        className={`p-4 rounded-lg border-2 transition-all ${
                          isSlotUnavailable
                            ? 'border-red-200 bg-red-50 opacity-75'
                            : slot.isBooked 
                              ? 'border-green-200 bg-green-50' 
                              : slot.isAvailable 
                                ? 'border-blue-200 bg-blue-50 hover:border-blue-300 cursor-pointer' 
                                : 'border-gray-200 bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className={`font-medium ${isSlotUnavailable ? 'text-red-700 line-through' : 'text-gray-900'}`}>
                              {slot.time}
                            </span>
                            {slot.isBooked && slot.client && !isSlotUnavailable && (
                              <div className="flex items-center gap-2">
                                <Calendar className="w-3 h-3 text-gray-600" />
                                <span className="text-sm text-gray-600">{slot.client.name}</span>
                              </div>
                            )}
                            {isSlotUnavailable && (
                              <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                                Unavailable
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {isSlotUnavailable ? (
                              <XCircle className="w-5 h-5 text-red-600" />
                            ) : slot.isBooked ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : slot.isAvailable ? (
                              <Clock className="w-5 h-5 text-blue-600" />
                            ) : (
                              <XCircle className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                        {slot.isBooked && slot.client && !isSlotUnavailable && (
                          <div className="mt-2 text-sm text-gray-600">
                            Duration: {slot.client.duration} minutes
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mark Unavailable Modal */}
        {showUnavailable && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowUnavailable(false);
              setUnavailabilityType('full-day');
            }}
          >
            <div 
              className="bg-white rounded-2xl shadow-xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Mark Unavailable</h3>
                  <button 
                    onClick={() => {
                      setShowUnavailable(false);
                      setUnavailabilityType('full-day');
                    }}
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
                    onChange={(e) => setUnavailabilityType(e.target.value)}
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
        )}

        {/* Unavailable Day Details Modal */}
        {showUnavailableDetails && selectedUnavailableDate && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowUnavailableDetails(false);
              setSelectedUnavailableDate(null);
            }}
          >
            <div 
              className="bg-white rounded-2xl shadow-xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedUnavailableDate.isFullDay ? 'Unavailable Day' : 'Unavailable Time Slots'}
                  </h3>
                  <button 
                    onClick={() => {
                      setShowUnavailableDetails(false);
                      setSelectedUnavailableDate(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="text-center">
                  <CalendarX className="w-12 h-12 text-red-500 mx-auto mb-3" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    {new Date(selectedUnavailableDate.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h4>
                  <p className="text-gray-600">
                    {selectedUnavailableDate.isFullDay 
                      ? 'This day is marked as unavailable' 
                      : 'Some time slots are marked as unavailable'
                    }
                  </p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <CalendarX className="w-5 h-5 text-red-600 mt-0.5" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-red-900 mb-1">
                        {selectedUnavailableDate.isFullDay ? 'Full Day Unavailable' : 'Partial Day Unavailable'}
                      </h5>
                      {selectedUnavailableDate.reason && (
                        <p className="text-sm text-red-700 mb-2">
                          <strong>Reason:</strong> {selectedUnavailableDate.reason}
                        </p>
                      )}
                      {!selectedUnavailableDate.isFullDay && selectedUnavailableDate.timeRange && (
                        <p className="text-sm text-red-700">
                          <strong>Time:</strong> {selectedUnavailableDate.timeRange.start} - {selectedUnavailableDate.timeRange.end}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex pt-4">
                  <button 
                    onClick={handleMarkAsAvailable}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition-all"
                  >
                    Mark as Available
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Historical Details Modal */}
        {showHistoricalDetails && selectedHistoricalDate && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowHistoricalDetails(false);
              setSelectedHistoricalDate(null);
            }}
          >
            <div 
              className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-screen overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedHistoricalDate.date.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                  <button 
                    onClick={() => {
                      setShowHistoricalDetails(false);
                      setSelectedHistoricalDate(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {/* Historical Sessions */}
                {selectedHistoricalDate.sessions.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Completed Sessions</h4>
                    <div className="space-y-2">
                      {selectedHistoricalDate.sessions.map(session => (
                        <div 
                          key={session.id}
                          className="p-3 rounded-lg bg-green-50 border border-green-200"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{session.clientName}</p>
                              <p className="text-sm text-gray-600">{session.time} • {session.duration} minutes</p>
                            </div>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                              Completed
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Historical Unavailability */}
                {selectedHistoricalDate.unavailableDetails && (
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Unavailability</h4>
                    <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                      <div className="flex items-start gap-3">
                        <CalendarX className="w-5 h-5 text-red-600 mt-0.5" />
                        <div className="flex-1">
                          <h5 className="font-medium text-red-900 mb-1">
                            {selectedHistoricalDate.unavailableDetails.isFullDay ? 'Full Day Unavailable' : 'Partial Day Unavailable'}
                          </h5>
                          {selectedHistoricalDate.unavailableDetails.reason && (
                            <p className="text-sm text-red-700 mb-2">
                              <strong>Reason:</strong> {selectedHistoricalDate.unavailableDetails.reason}
                            </p>
                          )}
                          {!selectedHistoricalDate.unavailableDetails.isFullDay && selectedHistoricalDate.unavailableDetails.timeRange && (
                            <p className="text-sm text-red-700">
                              <strong>Time:</strong> {selectedHistoricalDate.unavailableDetails.timeRange.start} - {selectedHistoricalDate.unavailableDetails.timeRange.end}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Historical Unavailable Slots */}
                {selectedHistoricalDate.unavailableSlots.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Unavailable Time Slots</h4>
                    <div className="space-y-2">
                      {selectedHistoricalDate.unavailableSlots.map(slot => (
                        <div 
                          key={slot.id}
                          className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-3"
                        >
                          <CalendarX className="w-4 h-4 text-red-600" />
                          <span className="font-medium text-red-900">{slot.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty state */}
                {selectedHistoricalDate.sessions.length === 0 && 
                 !selectedHistoricalDate.unavailableDetails && 
                 selectedHistoricalDate.unavailableSlots.length === 0 && (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No sessions or unavailability recorded for this day</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounsellorCalendar;