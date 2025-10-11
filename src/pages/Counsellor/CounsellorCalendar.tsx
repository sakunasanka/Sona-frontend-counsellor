import React, { useState, useEffect } from 'react';
import { NavBar, Sidebar } from '../../components/layout';
import { FlashMessage } from '../../components/ui';
import { 
  Calendar, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Minus,
  CheckCircle,
  XCircle,
  User,
  Settings
} from 'lucide-react';
import { 
  getMonthlyAvailability, 
  setAvailability, 
  setUnavailability, 
  getCounselorSessions,
  type TimeSlot,
  type Session,
  type AvailabilityRequest
} from '../../api/calendarAPI';
import SessionFeeManager from './components/SessionFeeManager';

const CounsellorCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState({ start: '09:00', end: '17:00' });
  const [monthlyTimeSlots, setMonthlyTimeSlots] = useState<{ [date: string]: TimeSlot[] }>({});
  const [monthlyLoading, setMonthlyLoading] = useState(false);
  // const [sessionsLoading, setSessionsLoading] = useState(false);
  
  const [flashMessage, setFlashMessage] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    isVisible: boolean;
  }>({
    type: 'info',
    message: '',
    isVisible: false
  });
  
  // Session Fee Manager Modal State
  const [isSessionFeeModalOpen, setIsSessionFeeModalOpen] = useState(false);
  
  // TODO: Get counselor ID from auth context or user profile
  // For now using hardcoded ID - replace with actual user's counselor ID
  const counselorIdString = localStorage.getItem('counsellor_id');
  const counselorId = counselorIdString ? parseInt(counselorIdString, 10) : null;

  console.log('Using counselor ID:', counselorId);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  // Flash message helpers
  const showFlashMessage = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    setFlashMessage({
      type,
      message,
      isVisible: true
    });
  };

  const hideFlashMessage = () => {
    setFlashMessage(prev => ({ ...prev, isVisible: false }));
  };

  // Build YYYY-MM-DD in local time to avoid timezone shifts
  const formatDateKey = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Get today's sessions
  const getTodaysSessions = () => {
    const today = formatDateKey(new Date());
    return sessions.filter(session => session.date === today);
  };

  // Load time slots for all days in the current month
  const loadMonthlyTimeSlots = async () => {
    if (!counselorId) {
      console.error('No counselor ID available');
      setMonthlyTimeSlots({});
      setMonthlyLoading(false);
      return;
    }

    setMonthlyLoading(true);
    console.log('Starting to load monthly availability...');
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // API expects 1-based month
    
    try {
      const monthlyData = await getMonthlyAvailability(counselorId, year, month);
      console.log('Monthly availability data received:', monthlyData);
      
      const monthSlots: { [date: string]: TimeSlot[] } = {};
      
      // Transform the API response into our expected format
      if (monthlyData.availability && Array.isArray(monthlyData.availability)) {
        monthlyData.availability.forEach((dayData) => {
          if (dayData.date && Array.isArray(dayData.slots)) {
            // Transform MonthlyAvailabilitySlot[] to TimeSlot[]
            const timeSlots: TimeSlot[] = dayData.slots.map(slot => ({
              id: slot.id,
              counselorId: monthlyData.counselorId,
              date: dayData.date,
              time: slot.time,
              isBooked: slot.isBooked,
              isAvailable: slot.isAvailable,
              updatedAt: new Date().toISOString(),
              createdAt: new Date().toISOString()
            }));
            monthSlots[dayData.date] = timeSlots;
          }
        });
      }
      
      console.log('Transformed monthly time slots:', monthSlots);
      setMonthlyTimeSlots(monthSlots);
    } catch (error) {
      console.error('Error loading monthly availability:', error);
      setMonthlyTimeSlots({});
    }
    
    setMonthlyLoading(false);
  };

  // Load sessions
  const loadSessions = async () => {
    if (!counselorId) {
      console.error('No counselor ID available');
      setSessions([]);
      return;
    }

    try {
      const sessionData = await getCounselorSessions(counselorId);
      setSessions(sessionData);
    } catch (error) {
      console.error('Error loading sessions:', error);
      setSessions([]);
    }
  };

  useEffect(() => {
    loadSessions();
    loadMonthlyTimeSlots();
  }, []);

  useEffect(() => {
    loadMonthlyTimeSlots();
  }, [currentDate]);

  // No longer need useEffect for individual time slots

  // Calendar navigation
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

  // Helper function to get availability status for a date
  const getAvailabilityStatus = (dateString: string) => {
    const daySlots = monthlyTimeSlots[dateString] || [];
    
    // Create a map of all 24 hours with their status
    const hourStatuses: Array<{ hour: number; status: 'available' | 'booked' | 'unavailable' }> = [];
    
    for (let hour = 0; hour < 24; hour++) {
      const hourTime = `${String(hour).padStart(2, '0')}:00`;
      const existingSlot = daySlots.find(slot => slot.time === hourTime);
      
      let status: 'available' | 'booked' | 'unavailable';
      if (existingSlot) {
        if (existingSlot.isBooked) {
          status = 'booked';
        } else if (existingSlot.isAvailable) {
          status = 'available';
        } else {
          status = 'unavailable';
        }
      } else {
        // If no slot exists in DB, consider it unavailable
        status = 'unavailable';
      }
      
      hourStatuses.push({ hour, status });
    }
    
    const availableCount = hourStatuses.filter(h => h.status === 'available').length;
    const bookedCount = hourStatuses.filter(h => h.status === 'booked').length;
    
    if (availableCount > 0 && bookedCount === 0) {
      return 'available'; // Has available slots, no bookings
    } else if (availableCount > 0 && bookedCount > 0) {
      return 'partially-booked'; // Has both available and booked slots
    } else if (bookedCount > 0 && availableCount === 0) {
      return 'fully-booked'; // Has bookings but no available slots
    } else {
      return 'unavailable'; // All 24 hours are unavailable (either explicitly set or not in DB)
    }
  };

  // Get calendar days
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
  const date = new Date(year, month, day);
  const dateString = formatDateKey(date);
      const daysSessions = sessions.filter(session => session.date === dateString);
      const availabilityStatus = getAvailabilityStatus(dateString);
      
      days.push({
        date,
        sessions: daysSessions,
        isToday: date.toDateString() === today.toDateString(),
        isPast: date < today,
        availabilityStatus
      });
    }
    
    return days;
  };

  // Handle setting availability
  const handleSetAvailability = async (isAvailable: boolean) => {
    if (!selectedDate || !counselorId) {
      if (!counselorId) {
        showFlashMessage('error', 'No counselor ID available. Please log in again.');
      }
      return;
    }
    
    setLoading(true);
    try {
      const dateString = formatDateKey(selectedDate);

      // Check if selected date is in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selected = new Date(selectedDate);
      selected.setHours(0, 0, 0, 0);
      if (selected < today) {
        showFlashMessage('warning', 'Cannot set availability for past dates.');
        setLoading(false);
        return;
      }

      // Validate range
      const [startH] = selectedTimeRange.start.split(':').map(Number);
      const [endH] = selectedTimeRange.end.split(':').map(Number);
      if (Number.isNaN(startH) || Number.isNaN(endH) || endH <= startH) {
        showFlashMessage('warning', 'Please select a valid time range (end must be greater than start).');
        setLoading(false);
        return;
      }

      // Check if setting availability for today and time is in the past
      const now = new Date();
      const isToday = selected.getTime() === today.getTime();
      
      if (isToday) {
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        // Round up to the next hour if we're past the current hour
        const nextAvailableHour = currentMinute > 0 ? currentHour + 1 : currentHour;
        
        if (startH < nextAvailableHour) {
          const nextHourFormatted = `${String(nextAvailableHour).padStart(2, '0')}:00`;
          showFlashMessage('warning', `Cannot set availability for past times. You can only set availability from ${nextHourFormatted} onwards.`);
          setLoading(false);
          return;
        }
      }

      // Calculate number of hours in the range
      const hourCount = endH - startH;
      console.log(`Setting availability for ${hourCount} hour(s): ${selectedTimeRange.start} to ${selectedTimeRange.end}`);

      // Build 1-hour slot ranges: each hour gets its own slot
      // Example: 9-10 (1 hour) = only 9:00-10:00
      // Example: 9-11 (2 hours) = 9:00-10:00 and 10:00-11:00
      const slotRanges: Array<{ start: string; end: string }> = [];
      for (let h = startH; h < endH; h++) {
        const s = `${String(h).padStart(2, '0')}:00`;
        const e = `${String(h + 1).padStart(2, '0')}:00`;
        slotRanges.push({ start: s, end: e });
      }
      
      console.log(`Generated ${slotRanges.length} slot range(s):`, slotRanges);

      // Make one request per 1-hour slot
      const tasks = slotRanges.map(({ start, end }) => {
        const payload: AvailabilityRequest = {
          Counselorid: counselorId,
          startDate: dateString,
          endDate: dateString,
          startTime: start,
          endTime: end,
        };
        return isAvailable ? setAvailability(payload) : setUnavailability(payload);
      });
      await Promise.all(tasks);

      // Reload monthly view to refresh availability data
      await loadMonthlyTimeSlots();
      showFlashMessage('success', `Successfully ${isAvailable ? 'set availability' : 'set unavailability'} for ${dateString}`);
    } catch (error) {
      console.error('Error setting availability:', error);
      showFlashMessage('error', `Failed to ${isAvailable ? 'set availability' : 'set unavailability'}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const days = getDaysInMonth();
  const todaysSessions = getTodaysSessions();
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="hidden lg:block">
          <Sidebar isOpen={true} onClose={closeSidebar} />
        </div>
        
        <div className="lg:hidden">
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <NavBar onMenuClick={toggleSidebar} />
          <div className="p-4 lg:p-6">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">My Calendar</h1>
                  <p className="text-gray-600">Manage your availability and view your sessions</p>
                </div>
                <button
                  onClick={() => setIsSessionFeeModalOpen(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Session Fees
                </button>
              </div>
            </div>

            {/* Monthly Availability Summary */}
            <div className="mb-6 bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Monthly Availability Overview</h3>
              {monthlyLoading ? (
                <div className="text-sm text-gray-600 flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Loading availability data...
                </div>
              ) : (() => {
                console.log('Rendering monthly overview. Monthly time slots:', monthlyTimeSlots);
                const allSlots = Object.values(monthlyTimeSlots).flat();
                console.log('All slots flattened:', allSlots);
                
                if (allSlots.length === 0) {
                  return (
                    <div className="text-sm text-gray-600">
                      No availability configured yet. Start by selecting dates and setting your availability.
                    </div>
                  );
                }
                
                const totalAvailable = allSlots.filter(slot => slot.isAvailable && !slot.isBooked).length;
                const totalBooked = allSlots.filter(slot => slot.isBooked).length;
                
                // Calculate total unavailable as: future slots - marked available slots
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                const totalPossibleSlots = 24 * daysInMonth;
                
                // Calculate expired slots (past times from current moment)
                const now = new Date();
                let expiredSlots = 0;
                for (let day = 1; day <= daysInMonth; day++) {
                  const date = new Date(year, month, day);
                  for (let hour = 0; hour < 24; hour++) {
                    const slotTime = new Date(date);
                    slotTime.setHours(hour, 0, 0, 0);
                    if (slotTime < now) {
                      expiredSlots++;
                    }
                  }
                }
                
                const futureSlots = totalPossibleSlots - expiredSlots;
                const totalUnavailable = futureSlots - totalAvailable;
                
                const daysWithSlots = Object.keys(monthlyTimeSlots).filter(date => monthlyTimeSlots[date].length > 0).length;
                
                return (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{daysWithSlots}</div>
                      <div className="text-blue-800">Days Configured</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{totalAvailable}</div>
                      <div className="text-green-800">Available Slots</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{totalBooked}</div>
                      <div className="text-yellow-800">Booked Slots</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-600">{totalUnavailable}</div>
                      <div className="text-gray-800">Unavailable Slots</div>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Calendar */}
              <div className="xl:col-span-3">
                <div className="bg-white rounded-lg shadow p-6">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => navigateMonth('prev')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => setCurrentDate(new Date())}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors"
                      >
                        Today
                      </button>
                      <button
                        onClick={() => navigateMonth('next')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {/* Day headers */}
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                        {day}
                      </div>
                    ))}
                    
                    {/* Calendar days */}
                    {days.map((day, index) => (
                      <div key={index} className="min-h-[100px] border border-gray-200 p-1">
                        {day && (
                          <div
                            className={`cursor-pointer p-2 rounded-md transition-colors ${
                              day.isToday 
                                ? 'bg-blue-100 border border-blue-300' 
                                : 'hover:bg-gray-50'
                            } ${
                              selectedDate?.toDateString() === day.date.toDateString()
                                ? 'ring-2 ring-blue-500'
                                : ''
                            }`}
                            onClick={() => setSelectedDate(day.date)}
                          >
                            <div className="flex items-center justify-between">
                              <div className={`text-sm ${day.isToday ? 'font-bold text-blue-600' : 'text-gray-900'}`}>
                                {day.date.getDate()}
                              </div>
                              
                              {/* Availability indicator (always show) */}
                              {day.availabilityStatus && (
                                <div className={`w-2 h-2 rounded-full ${
                                  day.availabilityStatus === 'available' ? 'bg-green-500' :
                                  day.availabilityStatus === 'partially-booked' ? 'bg-yellow-500' :
                                  day.availabilityStatus === 'fully-booked' ? 'bg-red-500' :
                                  day.availabilityStatus === 'unavailable' ? 'bg-gray-400' :
                                  'bg-gray-200'
                                }`} title={
                                  day.availabilityStatus === 'available' ? 'Available' :
                                  day.availabilityStatus === 'partially-booked' ? 'Partially Booked' :
                                  day.availabilityStatus === 'fully-booked' ? 'Fully Booked' :
                                  day.availabilityStatus === 'unavailable' ? 'Unavailable' :
                                  'No slots set'
                                } />
                              )}
                            </div>
                            
                            {/* Show sessions */}
                            {day.sessions.slice(0, 2).map((session, idx) => (
                              <div key={idx} className="text-xs bg-green-100 text-green-700 px-1 py-0.5 rounded mt-1 truncate">
                                {session.time} - {session.clientName}
                              </div>
                            ))}

                            {/* Available time slots preview for the day */}
                            {(() => {
                              const dateKey = formatDateKey(day.date);
                              const slots = monthlyTimeSlots[dateKey] || [];
                              const available = slots.filter(s => s.isAvailable && !s.isBooked);
                              if (available.length === 0) return null;
                              return (
                                <div className="mt-1">
                                  {available.slice(0, 2).map((s) => (
                                    <div key={`${dateKey}-${s.id}`} className="text-[10px] bg-blue-50 text-blue-700 px-1 py-0.5 rounded mt-1 inline-block mr-1">
                                      {s.time}
                                    </div>
                                  ))}
                                  {available.length > 2 && (
                                    <span className="text-[10px] text-gray-500">+{available.length - 2} more</span>
                                  )}
                                </div>
                              );
                            })()}
                            
                            {day.sessions.length > 2 && (
                              <div className="text-xs text-gray-500 mt-1">
                                +{day.sessions.length - 2} more
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Availability Legend */}
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Availability Status</h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-gray-600">Available</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                        <span className="text-gray-600">Partially Booked</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                        <span className="text-gray-600">Fully Booked</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                        <span className="text-gray-600">Unavailable</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Schedule for Selected Date or Today */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                    {selectedDate 
                      ? `${selectedDate.toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })} Schedule`
                      : "Today's Schedule"
                    }
                  </h3>
                  
                  {(() => {
                    // Get sessions for selected date or today
                    const displaySessions = selectedDate 
                      ? sessions.filter(session => session.date === formatDateKey(selectedDate))
                      : todaysSessions;
                    
                    const dateLabel = selectedDate 
                      ? selectedDate.toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'long', 
                          day: 'numeric' 
                        })
                      : 'today';
                    
                    return displaySessions.length === 0 ? (
                      <p className="text-gray-500 text-sm">No sessions scheduled for {dateLabel}</p>
                    ) : (
                      <div className="space-y-3">
                        {displaySessions.map((session) => (
                          <div key={session.id} className="border border-gray-200 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 text-gray-500 mr-2" />
                                <span className="font-medium text-gray-900">{session.time}</span>
                              </div>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                session.status === 'scheduled' ? 'bg-green-100 text-green-700' :
                                session.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                session.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                session.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                session.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {session.status}
                              </span>
                            </div>
                            <div className="flex items-center mt-1">
                              <User className="w-4 h-4 text-gray-500 mr-2" />
                              <span className="text-sm text-gray-600">{session.clientName}</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {session.duration} minutes
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                {/* Selected Date Details */}
                {selectedDate && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h3>

                    {/* Current Availability Status */}
                    {(() => {
                      const selectedDateString = formatDateKey(selectedDate);
                      const availabilityStatus = getAvailabilityStatus(selectedDateString);
                      const daySlots = monthlyTimeSlots[selectedDateString] || [];
                      
                      // Calculate counts for all 24 hours
                      let availableCount = 0, bookedCount = 0, unavailableCount = 0;
                      
                      for (let hour = 0; hour < 24; hour++) {
                        const hourTime = `${String(hour).padStart(2, '0')}:00`;
                        const existingSlot = daySlots.find(slot => slot.time === hourTime);
                        
                        if (existingSlot) {
                          if (existingSlot.isBooked) {
                            bookedCount++;
                          } else if (existingSlot.isAvailable) {
                            availableCount++;
                          } else {
                            unavailableCount++;
                          }
                        } else {
                          // If no slot exists in DB, count as unavailable
                          unavailableCount++;
                        }
                      }
                      
                      if (availableCount > 0 || bookedCount > 0 || unavailableCount > 0) {
                        
                        return (
                          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center mb-2">
                              <div className={`w-3 h-3 rounded-full mr-2 ${
                                availabilityStatus === 'available' ? 'bg-green-500' :
                                availabilityStatus === 'partially-booked' ? 'bg-yellow-500' :
                                availabilityStatus === 'fully-booked' ? 'bg-red-500' :
                                'bg-gray-400'
                              }`} />
                              <span className="text-sm font-medium text-gray-900">
                                Current Status: {
                                  availabilityStatus === 'available' ? 'Available' :
                                  availabilityStatus === 'partially-booked' ? 'Partially Booked' :
                                  availabilityStatus === 'fully-booked' ? 'Fully Booked' :
                                  'Unavailable'
                                }
                              </span>
                            </div>
                            <div className="text-xs text-gray-600 space-y-1">
                              <div>Available slots: {availableCount}</div>
                              <div>Booked slots: {bookedCount}</div>
                              <div>Unavailable slots: {unavailableCount}</div>
                            </div>
                          </div>
                        );
                      } else {
                        // This should never happen since we always have 24 hours, but keep as fallback
                        return (
                          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-800">
                              All 24 hours are unavailable for this date.
                            </div>
                          </div>
                        );
                      }
                    })()}

                    {/* Availability Controls */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Set Time Range
                      </label>
                      <div className="flex space-x-2">
                        <select
                          value={selectedTimeRange.start}
                          onChange={(e) => setSelectedTimeRange(prev => ({ ...prev, start: e.target.value }))}
                          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                        >
                          {Array.from({ length: 24 }, (_, i) => {
                            // Check if this time slot should be disabled for today
                            const today = new Date();
                            const selectedToday = selectedDate && selectedDate.toDateString() === today.toDateString();
                            
                            let isDisabled = false;
                            if (selectedToday) {
                              const currentHour = today.getHours();
                              const currentMinute = today.getMinutes();
                              const nextAvailableHour = currentMinute > 0 ? currentHour + 1 : currentHour;
                              isDisabled = i < nextAvailableHour;
                            }
                            
                            return (
                              <option 
                                key={i} 
                                value={`${i.toString().padStart(2, '0')}:00`}
                                disabled={isDisabled}
                                style={isDisabled ? { color: '#9CA3AF' } : {}}
                              >
                                {`${i.toString().padStart(2, '0')}:00`} {isDisabled ? '(Past)' : ''}
                              </option>
                            );
                          })}
                        </select>
                        <span className="self-center text-gray-500">to</span>
                        <select
                          value={selectedTimeRange.end}
                          onChange={(e) => setSelectedTimeRange(prev => ({ ...prev, end: e.target.value }))}
                          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                        >
                          {Array.from({ length: 25 }, (_, i) => (
                            <option key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                              {`${i.toString().padStart(2, '0')}:00`}
                            </option>
                          ))}
                        </select>
                      </div>
                      {(() => {
                        const today = new Date();
                        const selectedToday = selectedDate && selectedDate.toDateString() === today.toDateString();
                        
                        if (selectedToday) {
                          const currentHour = today.getHours();
                          const currentMinute = today.getMinutes();
                          const nextAvailableHour = currentMinute > 0 ? currentHour + 1 : currentHour;
                          const nextHourFormatted = `${String(nextAvailableHour).padStart(2, '0')}:00`;
                          
                          return (
                            <div className="text-xs text-blue-600 mt-1 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              Current time: {today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}. 
                              You can set availability from {nextHourFormatted} onwards.
                            </div>
                          );
                        }
                        return null;
                      })()}
                      {(() => {
                        const [startH] = selectedTimeRange.start.split(':').map(Number);
                        const [endH] = selectedTimeRange.end.split(':').map(Number);
                        if (endH <= startH) {
                          return <div className="text-xs text-red-600 mt-1">End time must be greater than start time</div>;
                        }
                        return null;
                      })()}
                    </div>

                    <div className="flex space-x-2">
                      {(() => {
                        // Check if selected date is in the past
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const selected = new Date(selectedDate);
                        selected.setHours(0, 0, 0, 0);
                        const isPastDate = selected < today;
                        
                        // Check if time range is valid
                        const [startH] = selectedTimeRange.start.split(':').map(Number);
                        const [endH] = selectedTimeRange.end.split(':').map(Number);
                        const isValidRange = endH > startH;
                        
                        const isDisabled = loading || isPastDate || !isValidRange;
                        
                        return (
                          <>
                            <button
                              onClick={() => handleSetAvailability(true)}
                              disabled={isDisabled}
                              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center justify-center text-sm"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Set Available
                            </button>
                            <button
                              onClick={() => handleSetAvailability(false)}
                              disabled={isDisabled}
                              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center justify-center text-sm"
                            >
                              <Minus className="w-4 h-4 mr-1" />
                              Set Unavailable
                            </button>
                          </>
                        );
                      })()}
                    </div>
                    
                    {(() => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const selected = new Date(selectedDate);
                      selected.setHours(0, 0, 0, 0);
                      if (selected < today) {
                        return <div className="text-xs text-red-600 mt-2">Cannot set availability for past dates</div>;
                      }
                      return null;
                    })()}

                    {/* Time Slots - Show all 24 hours */}
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Time Slots (24 Hours)</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {Array.from({ length: 24 }, (_, i) => {
                          const hourTime = `${String(i).padStart(2, '0')}:00`;
                          const selectedDateString = formatDateKey(selectedDate);
                          const daySlots = monthlyTimeSlots[selectedDateString] || [];
                          
                          // Check if this time slot is in the past for today
                          const today = new Date();
                          const selectedToday = selectedDate.toDateString() === today.toDateString();
                          let isPastTime = false;
                          
                          if (selectedToday) {
                            const currentHour = today.getHours();
                            const currentMinute = today.getMinutes();
                            const nextAvailableHour = currentMinute > 0 ? currentHour + 1 : currentHour;
                            isPastTime = i < nextAvailableHour;
                          }
                          
                          // Find if this hour has a slot in the database
                          const existingSlot = daySlots.find(slot => slot.time === hourTime);
                          
                          let status: 'booked' | 'available' | 'unavailable' | 'past';
                          if (isPastTime) {
                            status = 'past';
                          } else if (existingSlot) {
                            if (existingSlot.isBooked) {
                              status = 'booked';
                            } else if (existingSlot.isAvailable) {
                              status = 'available';
                            } else {
                              status = 'unavailable';
                            }
                          } else {
                            // If no slot exists in DB, consider it unavailable
                            status = 'unavailable';
                          }
                          
                          return (
                            <div
                              key={i}
                              className={`p-2 rounded-md text-xs text-center border ${
                                status === 'past'
                                  ? 'bg-gray-50 border-gray-300 text-gray-400 opacity-60'
                                  : status === 'booked'
                                    ? 'bg-red-100 border-red-200 text-red-700'
                                    : status === 'available'
                                      ? 'bg-green-100 border-green-200 text-green-700'
                                      : 'bg-gray-100 border-gray-200 text-gray-500'
                              }`}
                              title={isPastTime ? 'Past time - cannot modify' : ''}
                            >
                              <div className="font-medium">{hourTime}</div>
                              <div className="flex items-center justify-center mt-1">
                                {status === 'past' ? (
                                  <Clock className="w-3 h-3" />
                                ) : status === 'booked' ? (
                                  <XCircle className="w-3 h-3" />
                                ) : status === 'available' ? (
                                  <CheckCircle className="w-3 h-3" />
                                ) : (
                                  <Minus className="w-3 h-3" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                        
                      <div className="mt-3 text-xs text-gray-500">
                        <div className="flex items-center space-x-3 flex-wrap">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-100 border border-green-200 rounded mr-1"></div>
                            Available
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-red-100 border border-red-200 rounded mr-1"></div>
                            Booked
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded mr-1"></div>
                            Unavailable
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-gray-50 border border-gray-300 rounded mr-1 opacity-60"></div>
                            Past Time
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sessions for selected day */}
                    {/* {(() => {
                      const key = formatDateKey(selectedDate);
                      const daySessions = sessions.filter(s => s.date === key);
                      return (
                        <div className="mt-6">
                          <h4 className="text-sm font-medium text-gray-700 mb-3">Sessions</h4>
                          {daySessions.length === 0 ? (
                            <div className="text-xs text-gray-500">No sessions for this day.</div>
                          ) : (
                            <div className="space-y-2">
                              {daySessions.map((s) => (
                                <div key={s.id} className="border border-gray-200 rounded p-2">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center text-sm">
                                      <Clock className="w-4 h-4 text-gray-500 mr-2" />
                                      <span className="font-medium text-gray-900">{s.time}</span>
                                    </div>
                                    <span className={`px-2 py-0.5 text-[11px] rounded-full ${
                                      s.status === 'scheduled' ? 'bg-green-100 text-green-700' :
                                      s.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                      s.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                      s.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                      s.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                                      'bg-gray-100 text-gray-700'
                                    }`}>
                                      {s.status}
                                    </span>
                                  </div>
                                  <div className="flex items-center mt-1 text-sm text-gray-700">
                                    <User className="w-4 h-4 text-gray-500 mr-2" />
                                    {s.clientName}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">{s.duration} minutes</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })()} */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Flash Message */}
      <FlashMessage
        type={flashMessage.type}
        message={flashMessage.message}
        isVisible={flashMessage.isVisible}
        onClose={hideFlashMessage}
      />

      {/* Session Fee Manager Modal */}
      <SessionFeeManager
        isOpen={isSessionFeeModalOpen}
        onClose={() => setIsSessionFeeModalOpen(false)}
        onSuccess={() => showFlashMessage('success', 'Session fee settings updated successfully!')}
        onError={(error) => showFlashMessage('error', error)}
      />
    </div>
  );
};

export default CounsellorCalendar;