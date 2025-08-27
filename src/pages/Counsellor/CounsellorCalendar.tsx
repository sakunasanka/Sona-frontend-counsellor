import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Check,
  X,
  Settings,
  CheckCircle,
  XCircle,
  CalendarX,
} from 'lucide-react';
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

type AvailabilityEntry = {
  id: string;
  date?: string; // specific yyyy-mm-dd
  isFullDay: boolean;
  timeRanges: { id: string; start: string; end: string }[];
  isRecurring?: boolean;
  recurringPattern?: 'weekly';
  recurringDays?: string[]; // ['Sun'..'Sat']
};

type DayCell = {
  date: Date;
  sessions: Session[];
  unavailableSlots: { id: string; time: string }[];
  availableSlots: { id: string; time: string; status: 'available' | 'recurring' }[];
  isToday: boolean;
  isPastDay: boolean;
  isUnavailable: boolean; // Entire day unavailable
  isAvailable: boolean; // Has availability (specific or recurring)
  isClickable: boolean; // within next 2 weeks window
};

const CounsellorCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [showAvailability, setShowAvailability] = useState(false);
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
  const [availabilityType, setAvailabilityType] = useState<'full-day' | 'time-range'>('full-day');
  const [showRecurring, setShowRecurring] = useState(false);
  // recurringPattern is fixed to 'weekly' in this simplified version
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedStartTime, setSelectedStartTime] = useState('09:00');
  const [selectedEndTime, setSelectedEndTime] = useState('17:00');

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);


  // Helpers for dates
  const today = new Date();
  const formatDateString = (date: Date) => {
    // Use local date (avoid timezone issues)
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };
  const todayString = formatDateString(today);

  // Clear all mock sessions
  const [sessions] = useState<Session[]>([]);
  const [historicalSessions] = useState<Session[]>([]);
  const [unavailableDates, setUnavailableDates] = useState<UnavailableDate[]>([]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];


  // Track available dates - initially empty as all days are unavailable by default
  const [availableEntries, setAvailableEntries] = useState<AvailabilityEntry[]>([]);

  // Function to check if a date is within the next two weeks (clickable period)
  const isWithinTwoWeeks = (date: Date) => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 14);
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d >= start && d <= end;
  };

  // Function to check if a date is unavailable
  const isDateAvailable = (date: Date) => {
    const dateString = formatDateString(date);
    const dow = daysOfWeek[date.getDay()];
    const specific = availableEntries.some((a) => a.date === dateString);
    const recurring = availableEntries.some(
      (a) => a.isRecurring && a.recurringPattern === 'weekly' && a.recurringDays?.includes(dow)
    );
    return specific || recurring;
  };

  const isDateUnavailable = (date: Date) => !isDateAvailable(date);
  
  // Mock time slots data
  const generateTimeSlots = (date: Date) => {
    const dateString = formatDateString(date);
    const sessionsForDate = sessions.filter((s) => s.date === dateString);
    const slots: TimeSlot[] = [];
    for (let hour = 0; hour < 24; hour++) {
      const time = `${String(hour).padStart(2, '0')}:00`;
      const sessionAtTime = sessionsForDate.find((s) => s.time === time);
      const available = isDateAvailable(date) && !isTimeSlotUnavailable(date, time);
      slots.push({
        id: `slot-${dateString}-${time}`,
        time,
        isBooked: !!sessionAtTime,
        isAvailable: available,
        client: sessionAtTime
          ? { name: sessionAtTime.clientName, duration: sessionAtTime.duration }
          : undefined,
      });
    }
    return slots;
  };

  // Mock time slots
  const generatedTimeSlots = selectedDate ? generateTimeSlots(selectedDate) : [];

  // Function to get calendar days for current month view
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: Array<DayCell | null> = [];
    // leading blanks
    for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const currentDay = new Date(year, month, d);
      const dateStr = formatDateString(currentDay);
      const isPastDay = dateStr < todayString;
      const isClickable = isWithinTwoWeeks(currentDay);
      const isAvailable = isDateAvailable(currentDay);
      const availSpecific = availableEntries.find((a) => a.date === dateStr);
      const dow = daysOfWeek[currentDay.getDay()];
      const availRecurring = availableEntries.find(
        (a) => a.isRecurring && a.recurringPattern === 'weekly' && a.recurringDays?.includes(dow)
      );
      const availableSlots: DayCell['availableSlots'] = [];
      for (const entry of [availSpecific, availRecurring].filter(Boolean) as AvailabilityEntry[]) {
        entry.timeRanges.forEach((range) => {
          availableSlots.push({ id: `${entry.id}-${range.id}`, time: `${range.start}-${range.end}`, status: entry.isRecurring ? 'recurring' : 'available' });
        });
      }
      const dayUnavailableEntries = unavailableDates.filter((u) => u.date === dateStr);
      const unavailableSlots = dayUnavailableEntries
        .filter((u) => !u.isFullDay && u.timeRange)
        .map((u) => ({ id: u.id, time: `${u.timeRange!.start}-${u.timeRange!.end}` }));
      const daysSessions = isPastDay
        ? historicalSessions.filter((s) => s.date === dateStr)
        : sessions.filter((s) => s.date === dateStr);
      days.push({
        date: currentDay,
        sessions: daysSessions,
        unavailableSlots,
        availableSlots,
        isToday: dateStr === todayString,
        isPastDay,
        isUnavailable: !isAvailable,
        isAvailable,
        isClickable,
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
    const dateStr = formatDateString(date);
    const todayNorm = new Date(today);
    todayNorm.setHours(0, 0, 0, 0);
    const dNorm = new Date(date);
    dNorm.setHours(0, 0, 0, 0);
    const isPast = dNorm < todayNorm;
    if (isPast) {
      const sessionsForDate = sessions.filter((s) => s.date === dateStr);
      const histForDate = historicalSessions.filter((s) => s.date === dateStr);
      const allSessions = [...sessionsForDate, ...histForDate];
      const unavailableDetails = unavailableDates.find((u) => u.date === dateStr);
      setSelectedHistoricalDate({
        date,
        sessions: allSessions,
        unavailableSlots: [],
        unavailableDetails,
      });
      setShowHistoricalDetails(true);
      return;
    }
    if (!isWithinTwoWeeks(date)) return;
    setSelectedDate(date);
    if (isDateUnavailable(date)) {
      setSelectedUnavailableDate({ id: `unavailable-${dateStr}`, date: dateStr, isFullDay: true });
      setShowUnavailableDetails(true);
    } else {
      setShowTimeSlots(true);
    }
  };

  // Handle marking a date as unavailable
  const handleMarkAsUnavailable = (
    recurFor4Weeks = false,
    timeRange: { start: string; end: string } | null = null
  ) => {
    if (selectedDate) {
      const dateString = formatDateString(selectedDate);
      // Create a list of dates to process
      const datesToProcess = [dateString];
      
      // If recurFor4Weeks is true, mark this week and 3 more weeks (total of 4 weeks)
      if (recurFor4Weeks) {
        for (let i = 1; i <= 3; i++) {
          const nextWeekDate = new Date(selectedDate);
          nextWeekDate.setDate(selectedDate.getDate() + (i * 7)); // Add 7 days for each week
          const nextWeekDateStr = formatDateString(nextWeekDate);
          datesToProcess.push(nextWeekDateStr);
        }
      }
      
      if (timeRange) {
        const newUnavailableDates = [...unavailableDates];
        datesToProcess.forEach((date) => {
          const entry: UnavailableDate = {
            id: `unavailable-${date}-${timeRange.start}-${timeRange.end}`,
            date,
            isFullDay: false,
            timeRange: { start: timeRange.start, end: timeRange.end },
          };
          const exists = newUnavailableDates.some(
            (e) => e.date === date && !e.isFullDay && e.timeRange?.start === timeRange.start && e.timeRange?.end === timeRange.end
          );
          if (!exists) newUnavailableDates.push(entry);
        });
        setUnavailableDates(newUnavailableDates);
      } else {
        // Full day unavailability: remove any availability for those days
        const newAvailable = availableEntries.filter((a) => !a.date || !datesToProcess.includes(a.date));
        setAvailableEntries(newAvailable);
        // Add explicit full-day unavailability entries (optional; UI mainly depends on absence of availability)
        const newUnavail = [...unavailableDates];
        datesToProcess.forEach((date) => {
          const exists = newUnavail.some((e) => e.date === date && e.isFullDay);
          if (!exists) newUnavail.push({ id: `unavailable-${date}`, date, isFullDay: true });
        });
        setUnavailableDates(newUnavail);
      }
      
      // Close the modal
      setShowTimeSlots(false);
    }
  };

  // Mark currently selected unavailable day as available (full day by default)
  const handleMarkAsAvailable = () => {
    if (!selectedUnavailableDate) return;
    const dateStr = selectedUnavailableDate.date;
    // Remove unavailability entries for this day
    setUnavailableDates((prev) => prev.filter((u) => u.date !== dateStr));
    // Add a full-day availability entry (or ensure exists)
    setAvailableEntries((prev) => {
      const exists = prev.some((a) => a.date === dateStr);
      if (exists) return prev;
      return [
        ...prev,
        {
          id: `avail-${dateStr}`,
          date: dateStr,
          isFullDay: true,
          timeRanges: [{ id: `full-${dateStr}`, start: '00:00', end: '23:59' }],
        },
      ];
    });
    setShowUnavailableDetails(false);
    setSelectedUnavailableDate(null);
  };

  const handleUnavailableSlotClick = (date: Date, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the day click
    const dateString = formatDateString(date);
    const unavailableDate = unavailableDates.find((unavailable) => unavailable.date === dateString);
    
    if (unavailableDate) {
      setSelectedUnavailableDate(unavailableDate);
      setShowUnavailableDetails(true);
    }
  };

  // Helper function to check if a time slot is unavailable for partial day restrictions
  const isTimeSlotUnavailable = (date: Date, time: string) => {
    const dateString = formatDateString(date);
    const entries = unavailableDates.filter((u) => u.date === dateString);
    if (entries.some((e) => e.isFullDay)) return true;
    const slotTime = time.padStart(5, '0');
    return entries.some((e) => {
      if (!e.timeRange) return false;
      const { start, end } = e.timeRange;
      return slotTime >= start && slotTime <= end;
    });
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

  // Helper function to handle saving availability
  const handleSaveAvailability = () => {
    if (!selectedDate) return;
    const dateString = formatDateString(selectedDate);
    const isRecurring = showRecurring;
    const entry: AvailabilityEntry = {
      id: `avail-${Date.now()}`,
      date: isRecurring ? undefined : dateString,
      isFullDay: availabilityType === 'full-day',
      timeRanges:
        availabilityType === 'full-day'
          ? [{ id: `tr-${Date.now()}`, start: '00:00', end: '23:59' }]
          : [{ id: `tr-${Date.now()}`, start: selectedStartTime, end: selectedEndTime }],
      isRecurring,
      recurringPattern: isRecurring ? 'weekly' : undefined,
      recurringDays: isRecurring ? selectedDays : undefined,
    };
    setAvailableEntries((prev) => {
      // If non-recurring: replace any existing entry for the same date
      if (!isRecurring) {
        const without = prev.filter((a) => a.date !== dateString);
        return [...without, entry];
      }
      // Recurring: keep unique by pattern/days
      const isDup = prev.some(
        (a) => a.isRecurring && a.recurringPattern === 'weekly' && JSON.stringify(a.recurringDays?.slice().sort()) === JSON.stringify(selectedDays.slice().sort())
      );
      return isDup ? prev : [...prev, entry];
    });
    setShowAvailability(false);
    setAvailabilityType('full-day');
    setShowRecurring(false);
  };

  // Helper function to get available time ranges for a date
  // getAvailabilityForDate helper removed as it's not used directly in the UI

  const days = getDaysInMonth(currentDate);

  // Use helper functions for the UI
  useEffect(() => {
    if (availableEntries.length === 0) {
      const weekdayAvailability: AvailabilityEntry = {
        id: 'weekday-avail',
        isFullDay: false,
        timeRanges: [
          { id: 'morning-hours', start: '09:00', end: '12:00' },
          { id: 'afternoon-hours', start: '14:00', end: '17:00' },
        ],
        isRecurring: true,
        recurringPattern: 'weekly',
        recurringDays: ['Mon', 'Wed', 'Fri'],
      };
      const nextWeekDate = new Date();
      nextWeekDate.setDate(nextWeekDate.getDate() + 7);
      const dateStr = formatDateString(nextWeekDate);
      const specificAvailability: AvailabilityEntry = {
        id: 'specific-day',
        date: dateStr,
        isFullDay: true,
        timeRanges: [{ id: 'full-day', start: '00:00', end: '23:59' }],
      };
      setAvailableEntries([weekdayAvailability, specificAvailability]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              onClick={() => setShowAvailability(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-3 lg:px-4 py-2 rounded-lg font-medium transition-all shadow-sm flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Set Availability</span>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Status Legend */}
        <div className="mb-4 bg-white rounded-lg shadow-sm border border-gray-100 p-3">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Calendar Legend</h3>
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
              <span className="text-gray-600">Available Time Slots</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gray-100 border border-gray-200"></div>
              <span className="text-gray-600">Unavailable (Default)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-50 border-l-2 border border-green-400"></div>
              <span className="text-gray-600">Available</span>
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
                    className={`aspect-square border-b border-r border-gray-100 p-1 transition-colors flex flex-col relative ${
                      day?.isPastDay ? 'cursor-not-allowed bg-gray-100 opacity-70' : 'cursor-pointer'
                    } ${
                      day?.isToday ? 'bg-blue-50' : ''
                    } ${
                      !day?.isPastDay && day?.isAvailable ? 'bg-green-50 hover:bg-green-100 border-l-2 border-l-green-400' :
                      !day?.isPastDay && day?.sessions.length === 0 && day?.unavailableSlots.length === 0 && day ? 
                        'bg-gray-50 hover:bg-gray-100' : 
                        !day?.isPastDay ? 'hover:bg-gray-50' : ''
                    }`}
                    onClick={() => day && !day.isPastDay && handleDateClick(day.date)}
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
                          day.isPastDay ? 'text-gray-500' :
                          day.isAvailable ? 'text-green-600' :
                          'text-gray-900'
                        } flex-shrink-0 flex items-center justify-between relative z-10`}>
                          <span>{day.date.getDate()}</span>
                          {day.isAvailable && (
                            <Calendar className="w-3 h-3 text-green-600" />
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
                              {day.sessions
                                .slice(0, (day.sessions.length + day.unavailableSlots.length) > 4 ? Math.max(1, 3 - day.unavailableSlots.length) : 4)
                                .map((session) => (
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
                              {day.unavailableSlots
                                .slice(0, (day.sessions.length + day.unavailableSlots.length) > 4 ? Math.max(1, 3 - day.sessions.length) : 4)
                                .map((slot) => (
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
                  .filter(session => {
                    const today = new Date();
                    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                    return session.date === todayString;
                  })
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
                {(() => {
                  const today = new Date();
                  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                  return sessions.filter(session => session.date === todayString).length === 0;
                })() && (
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
                  {generatedTimeSlots.map((slot) => {
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
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleMarkAsUnavailable(false, null)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg text-sm font-medium"
                  >
                    Mark day as Unavailable
                  </button>
                  <button
                    onClick={() => setShowTimeSlots(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 py-2 px-3 rounded-lg text-sm font-medium"
                  >
                    Close
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
            onClick={() => setShowUnavailableDetails(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Day Unavailable</h3>
                <button onClick={() => setShowUnavailableDetails(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-gray-700">
                  {new Date(selectedUnavailableDate.date).toLocaleDateString('en-US', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                  })} is currently marked as unavailable.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleMarkAsAvailable}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium"
                  >
                    Mark as Available
                  </button>
                  <button
                    onClick={() => setShowUnavailableDetails(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 py-2 px-3 rounded-lg text-sm font-medium"
                  >
                    Close
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
                      day: 'numeric',
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
                {selectedHistoricalDate.sessions.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Completed Sessions</h4>
                    <div className="space-y-2">
                      {selectedHistoricalDate.sessions.map((session) => (
                        <div key={session.id} className="p-3 rounded-lg bg-green-50 border border-green-200">
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

                {selectedHistoricalDate.unavailableSlots.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Unavailable Time Slots</h4>
                    <div className="space-y-2">
                      {selectedHistoricalDate.unavailableSlots.map((slot) => (
                        <div key={slot.id} className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-3">
                          <CalendarX className="w-4 h-4 text-red-600" />
                          <span className="font-medium text-red-900">{slot.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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

        {/* Set Availability Modal */}
        {showAvailability && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAvailability(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Set Availability</h3>
                <button onClick={() => setShowAvailability(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Type</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAvailabilityType('full-day')}
                      className={`flex-1 px-3 py-2 rounded-lg border ${availabilityType === 'full-day' ? 'border-blue-500 text-blue-600' : 'border-gray-200'}`}
                    >
                      Full day
                    </button>
                    <button
                      onClick={() => setAvailabilityType('time-range')}
                      className={`flex-1 px-3 py-2 rounded-lg border ${availabilityType === 'time-range' ? 'border-blue-500 text-blue-600' : 'border-gray-200'}`}
                    >
                      Time range
                    </button>
                  </div>
                </div>
                {availabilityType === 'time-range' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-gray-700">Start</label>
                      <input
                        type="time"
                        value={selectedStartTime}
                        onChange={(e) => setSelectedStartTime(e.target.value)}
                        className="w-full mt-1 border rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-700">End</label>
                      <input
                        type="time"
                        value={selectedEndTime}
                        onChange={(e) => setSelectedEndTime(e.target.value)}
                        className="w-full mt-1 border rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={showRecurring}
                      onChange={(e) => setShowRecurring(e.target.checked)}
                    />
                    <span className="text-sm text-gray-700">Repeat weekly</span>
                  </label>
                  {showRecurring && (
                    <div className="grid grid-cols-7 gap-1">
                      {daysOfWeek.map((d) => (
                        <button
                          key={d}
                          onClick={() =>
                            setSelectedDays((prev) =>
                              prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
                            )
                          }
                          className={`px-2 py-2 rounded-lg border text-xs ${
                            selectedDays.includes(d) ? 'border-blue-500 text-blue-600' : 'border-gray-200'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveAvailability}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowAvailability(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 py-2 px-3 rounded-lg text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
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