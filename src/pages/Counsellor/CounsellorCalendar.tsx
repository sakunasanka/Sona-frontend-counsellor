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
  HistoricalDate,
  UnavailabilityRule,
  CalendarDay
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
  const [unavailabilityRules, setUnavailabilityRules] = useState<UnavailabilityRule[]>([]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  // Get current date and previous dates for mock data
  const yesterday = new Date(currentDate);
  yesterday.setDate(currentDate.getDate() - 1);
  const twoDaysAgo = new Date(currentDate);
  twoDaysAgo.setDate(currentDate.getDate() - 2);
  const threeDaysAgo = new Date(currentDate);
  threeDaysAgo.setDate(currentDate.getDate() - 3);
  const fourDaysAgo = new Date(currentDate);
  fourDaysAgo.setDate(currentDate.getDate() - 4);
  const fiveDaysAgo = new Date(currentDate);
  fiveDaysAgo.setDate(currentDate.getDate() - 5);
  
  // Get future dates for mock data
  const tomorrow = new Date(currentDate);
  tomorrow.setDate(currentDate.getDate() + 1);
  const twoDaysLater = new Date(currentDate);
  twoDaysLater.setDate(currentDate.getDate() + 2);
  const threeDaysLater = new Date(currentDate);
  threeDaysLater.setDate(currentDate.getDate() + 3);
  const fourDaysLater = new Date(currentDate);
  fourDaysLater.setDate(currentDate.getDate() + 4);
  const fiveDaysLater = new Date(currentDate);
  fiveDaysLater.setDate(currentDate.getDate() + 5);

  // Format dates for mock data
  const formatDateString = (date: Date) => date.toISOString().split('T')[0];
  const todayString = formatDateString(currentDate);
  const yesterdayString = formatDateString(yesterday);
  const twoDaysAgoString = formatDateString(twoDaysAgo);
  const threeDaysAgoString = formatDateString(threeDaysAgo);
  const fourDaysAgoString = formatDateString(fourDaysAgo);
  const fiveDaysAgoString = formatDateString(fiveDaysAgo);
  const tomorrowString = formatDateString(tomorrow);
  const twoDaysLaterString = formatDateString(twoDaysLater);
  const threeDaysLaterString = formatDateString(threeDaysLater);
  const fourDaysLaterString = formatDateString(fourDaysLater);
  const fiveDaysLaterString = formatDateString(fiveDaysLater);

  // Sample data
  const [sessions, setSessions] = useState<Session[]>([
    // Today's sessions - more than 3 to test the limit
    {
      id: '1',
      clientName: 'Sarah Johnson',
      date: todayString,
      time: '09:00',
      duration: 60,
      status: 'confirmed'
    },
    {
      id: '2',
      clientName: 'Mike Chen',
      date: todayString,
      time: '10:30',
      duration: 45,
      status: 'confirmed'
    },
    {
      id: '3',
      clientName: 'John Doe',
      date: todayString,
      time: '13:00',
      duration: 45,
      status: 'confirmed'
    },
    {
      id: '3a',
      clientName: 'Emma Wilson',
      date: todayString,
      time: '14:30',
      duration: 60,
      status: 'confirmed'
    },
    {
      id: '3b',
      clientName: 'Alex Smith',
      date: todayString,
      time: '16:00',
      duration: 45,
      status: 'confirmed'
    },
    
    // Tomorrow's sessions - more than 3 to test the limit
    {
      id: '4',
      clientName: 'Emma Wilson',
      date: tomorrowString,
      time: '09:30',
      duration: 60,
      status: 'confirmed'
    },
    {
      id: '5',
      clientName: 'Tom Williams',
      date: tomorrowString,
      time: '11:00',
      duration: 45,
      status: 'confirmed'
    },
    {
      id: '5a',
      clientName: 'Linda Brown',
      date: tomorrowString,
      time: '13:30',
      duration: 60,
      status: 'confirmed'
    },
    {
      id: '5b',
      clientName: 'Robert Garcia',
      date: tomorrowString,
      time: '15:00',
      duration: 45,
      status: 'confirmed'
    },
    
    // Two days later sessions
    {
      id: '6',
      clientName: 'Susan Davis',
      date: twoDaysLaterString,
      time: '10:30',
      duration: 60,
      status: 'confirmed'
    },
    {
      id: '7',
      clientName: 'Kevin Brown',
      date: twoDaysLaterString,
      time: '14:00',
      duration: 45,
      status: 'confirmed'
    },
    {
      id: '7a',
      clientName: 'Patricia Lee',
      date: twoDaysLaterString,
      time: '15:30',
      duration: 60,
      status: 'confirmed'
    },
    
    // Three days later sessions
    {
      id: '8',
      clientName: 'Nancy Clark',
      date: threeDaysLaterString,
      time: '09:00',
      duration: 60,
      status: 'confirmed'
    },
    {
      id: '8a',
      clientName: 'David Miller',
      date: threeDaysLaterString,
      time: '11:30',
      duration: 45,
      status: 'confirmed'
    },
    {
      id: '8b',
      clientName: 'Jennifer White',
      date: threeDaysLaterString,
      time: '14:00',
      duration: 60,
      status: 'confirmed'
    },
    {
      id: '8c',
      clientName: 'Michael Taylor',
      date: threeDaysLaterString,
      time: '16:30',
      duration: 45,
      status: 'confirmed'
    },
    
    // Four days later sessions
    {
      id: '9',
      clientName: 'Paul Martinez',
      date: fourDaysLaterString,
      time: '09:30',
      duration: 45,
      status: 'confirmed'
    },
    {
      id: '10',
      clientName: 'Rachel Green',
      date: fourDaysLaterString,
      time: '11:00',
      duration: 60,
      status: 'confirmed'
    },
    
    // Five days later sessions
    {
      id: '11',
      clientName: 'Steven Hall',
      date: fiveDaysLaterString,
      time: '10:00',
      duration: 45,
      status: 'confirmed'
    }
  ]);

  // Historical data (sessions and unavailability before today)
  const [historicalSessions, setHistoricalSessions] = useState<Session[]>([
    // Yesterday's sessions
    {
      id: 'h1',
      clientName: 'David Johnson',
      date: yesterdayString,
      time: '10:00',
      duration: 60,
      status: 'completed'
    },
    {
      id: 'h2',
      clientName: 'Lisa Chen',
      date: yesterdayString,
      time: '14:00',
      duration: 45,
      status: 'completed'
    },
    
    // Two days ago sessions
    {
      id: 'h3',
      clientName: 'Mark Wilson',
      date: twoDaysAgoString,
      time: '09:00',
      duration: 60,
      status: 'completed'
    },
    {
      id: 'h4',
      clientName: 'Jennifer Lee',
      date: twoDaysAgoString,
      time: '15:00',
      duration: 45,
      status: 'completed'
    },
    
    // Three days ago sessions
    {
      id: 'h5',
      clientName: 'Robert Miller',
      date: threeDaysAgoString,
      time: '11:30',
      duration: 60,
      status: 'completed'
    },
    
    // Four days ago sessions
    {
      id: 'h6',
      clientName: 'Jessica Taylor',
      date: fourDaysAgoString,
      time: '13:00',
      duration: 45,
      status: 'completed'
    },
    {
      id: 'h7',
      clientName: 'Daniel King',
      date: fourDaysAgoString,
      time: '16:30',
      duration: 60,
      status: 'completed'
    },
    
    // Five days ago sessions
    {
      id: 'h8',
      clientName: 'Amanda White',
      date: fiveDaysAgoString,
      time: '10:00',
      duration: 45,
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

  const [unavailableDates, setUnavailableDates] = useState<UnavailableDate[]>([
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

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Track available dates
  const [availableDates, setAvailableDates] = useState<string[]>([
    tomorrowString, // Make tomorrow available by default
    threeDaysLaterString, // Make three days later available by default
    fiveDaysLaterString // Make five days later available by default
  ]);

  // Function to check if a date is unavailable
  const isDateUnavailable = (date: Date) => {
    // By default, all days are unavailable
    const dateString = date.toISOString().split('T')[0];
    
    // If the date is in availableDates, it's available (not unavailable)
    return !availableDates.includes(dateString);
  };
  
  // Mock time slots data
  const generateTimeSlots = (date: Date) => {
    const timeSlots = [];
    const dateString = date.toISOString().split('T')[0];
    
    // Check if the date is available
    const isUnavailable = isDateUnavailable(date);
    
    // Only generate time slots for available days
    if (!isUnavailable) {
      const sessionsForDate = sessions.filter(session => session.date === dateString);
      
      // Generate time slots from 9:00 to 17:00 (9 AM to 5 PM)
      for (let hour = 9; hour <= 17; hour++) {
        const time = `${hour.toString().padStart(2, '0')}:00`;
        const sessionAtTime = sessionsForDate.find(session => session.time === time);
        
        timeSlots.push({
          id: `slot-${dateString}-${time}`,
          time,
          isBooked: !!sessionAtTime,
          isAvailable: true,
          client: sessionAtTime ? {
            name: sessionAtTime.clientName,
            duration: sessionAtTime.duration
          } : undefined
        });
      }
    }
    
    return timeSlots;
  };

  // Mock time slots
  const timeSlots = selectedDate ? generateTimeSlots(selectedDate) : [];

  // Function to get calendar days for current month view
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    const isSameDay = (d1: Date, d2: Date) => {
      // Create new Date objects to avoid time issues
      const date1 = new Date(d1);
      date1.setHours(0, 0, 0, 0);
      
      const date2 = new Date(d2);
      date2.setHours(0, 0, 0, 0);
      
      return date1.getTime() === date2.getTime();
    };

    // Create calendar days - use 35 days (5 weeks) instead of 42 days (6 weeks)
    // This will remove the extra block line at the bottom
    const days: (CalendarDay | null)[] = Array(35).fill(null);
    
    for (let i = 0; i < daysInMonth; i++) {
      const currentDate = new Date(year, month, i + 1);
      const dateString = currentDate.toISOString().split('T')[0];
      
      // Check if date is unavailable (default is true)
      const isUnavailable = isDateUnavailable(currentDate);
      
      // Get sessions for this date - include both current and historical sessions
      // For past days, always show sessions regardless of availability
      // For current and future days, only show sessions if the day is available
      let allSessions: Session[] = [];
      
      // Create a normalized version of currentDate for comparison
      const normalizedCurrentDate = new Date(currentDate);
      normalizedCurrentDate.setHours(0, 0, 0, 0);
      
      // Create a normalized version of today for comparison
      const normalizedToday = new Date();
      normalizedToday.setHours(0, 0, 0, 0);
      
      // Check if this is a past day
      const isPastDay = normalizedCurrentDate < normalizedToday;
      
      // For past days, always show sessions regardless of availability
      // For current and future days, only show sessions if the day is available
      if (isPastDay || !isUnavailable) {
        const currentSessions = sessions.filter(session => session.date === dateString);
        const historicalSessionsForDate = historicalSessions.filter(session => session.date === dateString);
        allSessions = [...currentSessions, ...historicalSessionsForDate];
      }
      
      // Get all time slots for this date (both unavailable and available)
      const timeSlots = unavailableDates
        .filter(slot => slot.date === dateString && !slot.isFullDay && slot.timeRange)
        .map(slot => ({
          start: slot.timeRange?.start,
          end: slot.timeRange?.end,
          isAvailable: slot.isAvailable || false
        }));
      
      // Check if this day has any available time slots
      const hasAvailableSlots = timeSlots.some(slot => slot.isAvailable);
      
      days[firstDayOfMonth + i] = {
        date: currentDate,
        sessions: allSessions,
        unavailableSlots: timeSlots,
        isToday: isSameDay(currentDate, today),
        isPastDay: isPastDay,
        isUnavailable: isUnavailable && !hasAvailableSlots, // If it has available slots, it's not fully unavailable
        unavailableDetails: undefined
      };
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

  // Function to handle clicking on a date
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    
    // Check if the date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time part for proper comparison
    
    // Create a normalized version of the clicked date for comparison
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    
    if (normalizedDate < today) {
      // If the date is in the past, show historical details but don't allow changes
      const dateString = date.toISOString().split('T')[0];
      const historicalSessionsForDate = historicalSessions.filter(session => session.date === dateString);
      
      setSelectedHistoricalDate({
        date: date,
        sessions: historicalSessionsForDate,
        unavailableSlots: [],
        unavailableDetails: undefined
      });
      setShowHistoricalDetails(true);
      return;
    }
    
    // For current or future dates, check availability
    const isUnavailable = isDateUnavailable(date);
    
    if (isUnavailable) {
      // If the date is unavailable (default), show the unavailable day details modal
      const dateString = date.toISOString().split('T')[0];
      const unavailableDate = {
        id: `unavailable-${dateString}`,
        date: dateString,
        isFullDay: true
      };
      setSelectedUnavailableDate(unavailableDate);
      setShowUnavailableDetails(true);
    } else {
      // If the date is available, show the time slots modal for available day
      setShowTimeSlots(true);
    }
  };

  // Handle marking a date as unavailable
  const handleMarkAsUnavailable = (recurFor4Weeks = false, timeRange: {start: string, end: string} | null = null) => {
    if (selectedDate) {
      // Check if the date is in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time part for proper comparison
      
      // Create a normalized version of the selected date for comparison
      const normalizedDate = new Date(selectedDate);
      normalizedDate.setHours(0, 0, 0, 0);
      
      if (normalizedDate < today) {
        console.error("Cannot modify availability for past dates");
        return;
      }
      
      const dateString = selectedDate.toISOString().split('T')[0];
      console.log('Marking date as unavailable:', dateString);
      console.log('Recur for 4 weeks:', recurFor4Weeks);
      console.log('Time range:', timeRange);
      
      // Create a list of dates to process
      const datesToProcess = [dateString];
      
      // If recurFor4Weeks is true, mark this week and 3 more weeks (total of 4 weeks)
      if (recurFor4Weeks) {
        for (let i = 1; i <= 3; i++) {
          const nextWeekDate = new Date(selectedDate);
          nextWeekDate.setDate(selectedDate.getDate() + (i * 7)); // Add 7 days for each week
          const nextWeekDateStr = nextWeekDate.toISOString().split('T')[0];
          datesToProcess.push(nextWeekDateStr);
        }
      }
      
      if (timeRange) {
        // For partial day unavailability, add to unavailableDates with time range
        const newUnavailableDates = [...unavailableDates];
        
        // Add unavailable entries for each date
        datesToProcess.forEach(date => {
          const unavailableEntry = {
            id: `unavailable-${date}-${timeRange.start}-${timeRange.end}`,
            date: date,
            isFullDay: false,
            timeRange: {
              start: timeRange.start,
              end: timeRange.end
            }
          };
          
          // Check if there's already an entry for this date and time range
          const existingIndex = newUnavailableDates.findIndex(
            entry => entry.date === date && 
                   !entry.isFullDay && 
                   entry.timeRange?.start === timeRange.start && 
                   entry.timeRange?.end === timeRange.end
          );
          
          if (existingIndex === -1) {
            newUnavailableDates.push(unavailableEntry);
          }
        });
        
        // Update unavailableDates state
        setUnavailableDates(newUnavailableDates);
      } else {
        // For full day unavailability, remove from availableDates
        const newAvailableDates = availableDates.filter(date => !datesToProcess.includes(date));
        setAvailableDates(newAvailableDates);
      }
      
      // Close the modal
      setShowTimeSlots(false);
    }
  };

  // Handle marking a date as available - directly mark it without showing another popup
  const handleMarkAsAvailable = (recurFor4Weeks = false, timeRange: {start: string, end: string} | null = null) => {
    if (selectedUnavailableDate) {
      const dateStr = selectedUnavailableDate.date;
      const selectedDate = new Date(dateStr);
      
      // Check if the date is in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time part for proper comparison
      
      // Create a normalized version of the selected date for comparison
      const normalizedDate = new Date(selectedDate);
      normalizedDate.setHours(0, 0, 0, 0);
      
      if (normalizedDate < today) {
        console.error("Cannot modify availability for past dates");
        return;
      }
      
      console.log('Marking date as available:', dateStr);
      console.log('Recur for 4 weeks:', recurFor4Weeks);
      console.log('Time range:', timeRange);
      
      // Create a list of dates to process
      const datesToProcess = [dateStr];
      
      // If recurFor4Weeks is true, mark this week and 3 more weeks (total of 4 weeks)
      if (recurFor4Weeks) {
        for (let i = 1; i <= 3; i++) {
          const nextWeekDate = new Date(selectedDate);
          nextWeekDate.setDate(selectedDate.getDate() + (i * 7)); // Add 7 days for each week
          const nextWeekDateStr = nextWeekDate.toISOString().split('T')[0];
          datesToProcess.push(nextWeekDateStr);
        }
      }
      
      if (timeRange) {
        // For partial day availability, add available slots to the calendar
        // These will be tracked as available slots within an otherwise unavailable day
        const newAvailableSlots = [...unavailableDates];
        
        // Add available time slots for each date
        datesToProcess.forEach(date => {
          const availableSlot = {
            id: `available-${date}-${timeRange.start}-${timeRange.end}`,
            date: date,
            isFullDay: false,
            isAvailable: true, // Mark this slot as available
            timeRange: {
              start: timeRange.start,
              end: timeRange.end
            }
          };
          
          // Check if there's already an entry for this date and time range
          const existingIndex = newAvailableSlots.findIndex(
            entry => entry.date === date && 
                   !entry.isFullDay && 
                   entry.timeRange?.start === timeRange.start && 
                   entry.timeRange?.end === timeRange.end &&
                   entry.isAvailable === true
          );
          
          if (existingIndex === -1) {
            newAvailableSlots.push(availableSlot);
          }
        });
        
        // Update unavailableDates state to include the available slots
        setUnavailableDates(newAvailableSlots);
      } else {
        // For full day availability, add to availableDates
        const newAvailableDates = [...availableDates];
        
        // Add each date if it's not already available
        datesToProcess.forEach(dateStr => {
          if (!newAvailableDates.includes(dateStr)) {
            newAvailableDates.push(dateStr);
          }
        });
        
        // Update the available dates
        setAvailableDates(newAvailableDates);
      }
      
      // Close the modal
      setShowUnavailableDetails(false);
      setSelectedUnavailableDate(null);
    }
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

  const handleSaveUnavailabilityRules = (rules: UnavailabilityRule[]) => {
    setUnavailabilityRules(rules);
    
    // Here you would typically:
    // 1. Save rules to backend
    // 2. Update calendar UI to reflect new rules
    // 3. Show success message
    console.log('Saving unavailability rules:', rules);
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
          <CalendarHeader 
            onMarkUnavailable={() => setShowUnavailable(true)} 
            onSaveUnavailabilityRules={handleSaveUnavailabilityRules}
            existingRules={unavailabilityRules}
          />

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

                {/* Time Slots Modal */}
      {showTimeSlots && selectedDate && (
        <TimeSlotsModal
          selectedDate={selectedDate}
          timeSlots={timeSlots}
          sessions={sessions}
          isTimeSlotUnavailable={isTimeSlotUnavailable}
          onClose={() => setShowTimeSlots(false)}
          onMarkAsUnavailable={handleMarkAsUnavailable}
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

          {/* Unavailable Day Details Modal */}
      {showUnavailableDetails && selectedUnavailableDate && (
        <UnavailableDayDetailsModal
          isOpen={showUnavailableDetails}
          onClose={() => setShowUnavailableDetails(false)}
          unavailableDate={selectedUnavailableDate}
          onMarkAsAvailable={handleMarkAsAvailable}
        />
      )}

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
            pendingSessions={sessions.filter(s => s.status === 'confirmed')}
          />
        </div>
      </div>
    </div>
  );
};

export default CounsellorCalendar;