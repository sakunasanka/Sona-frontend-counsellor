import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, Plus, X, User, Phone, Video, Settings, CheckCircle, XCircle, Edit3, CalendarX } from 'lucide-react';
import { NavBar, Sidebar } from '../../components/layout';

interface TimeSlot {
  id: string;
  time: string;
  isBooked: boolean;
  isAvailable: boolean;
  client?: {
    name: string;
    type: 'video' | 'phone';
    duration: number;
  };
}

interface DayData {
  date: Date;
  slots: TimeSlot[];
  isUnavailable: boolean;
}

interface Session {
  id: string;
  clientName: string;
  date: string;
  time: string;
  duration: number;
  type: 'video' | 'phone';
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
  const [showAddSession, setShowAddSession] = useState(false);
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [showUnavailable, setShowUnavailable] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  // Sample data
  const [sessions] = useState<Session[]>([
    {
      id: '1',
      clientName: 'Sarah Johnson',
      date: '2025-07-03',
      time: '10:00',
      duration: 60,
      type: 'video',
      status: 'confirmed'
    },
    {
      id: '2',
      clientName: 'Mike Chen',
      date: '2025-07-03',
      time: '14:30',
      duration: 45,
      type: 'video',
      status: 'confirmed'
    },
    {
      id: '3',
      clientName: 'Emma Wilson',
      date: '2025-07-05',
      time: '11:00',
      duration: 60,
      type: 'phone',
      status: 'pending'
    },
    {
      id: '4',
      clientName: 'John Doe',
      date: '2025-07-03',
      time: '09:00',
      duration: 45,
      type: 'video',
      status: 'confirmed'
    },
    {
      id: '5',
      clientName: 'Jane Smith',
      date: '2025-07-03',
      time: '16:00',
      duration: 60,
      type: 'phone',
      status: 'pending'
    },
    {
      id: '6',
      clientName: 'Bob Wilson',
      date: '2025-07-03',
      time: '18:00',
      duration: 30,
      type: 'video',
      status: 'confirmed'
    },
    {
      id: '7',
      clientName: 'Alice Brown',
      date: '2025-07-03',
      time: '20:00',
      duration: 45,
      type: 'phone',
      status: 'pending'
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
      date: '2025-07-10',
      reason: 'Conference',
      isFullDay: false,
      timeRange: {
        start: '09:00',
        end: '17:00'
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
    { id: '11', time: '10:00', isBooked: true, isAvailable: true, client: { name: 'Sarah Johnson', type: 'video', duration: 60 } },
    { id: '12', time: '11:00', isBooked: false, isAvailable: true },
    { id: '13', time: '12:00', isBooked: false, isAvailable: true },
    { id: '14', time: '13:00', isBooked: false, isAvailable: true },
    { id: '15', time: '14:00', isBooked: false, isAvailable: true },
    { id: '16', time: '14:30', isBooked: true, isAvailable: true, client: { name: 'Mike Chen', type: 'video', duration: 45 } },
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

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDay = new Date(year, month, day);
      const dateString = currentDay.toISOString().split('T')[0];
      const daysSessions = sessions.filter(session => session.date === dateString);
      const isUnavailable = unavailableDates.some(unavailable => unavailable.date === dateString);
      
      days.push({
        date: currentDay,
        sessions: daysSessions,
        isToday: currentDay.toDateString() === new Date().toDateString(),
        isSelected: selectedDate?.toDateString() === currentDay.toDateString(),
        isUnavailable
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
    setSelectedDate(date);
    setShowTimeSlots(true);
  };

  const getSessionTypeIcon = (type: 'video' | 'phone') => {
    switch (type) {
      case 'video': return <Video className="w-3 h-3" />;
      case 'phone': return <Phone className="w-3 h-3" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-orange-600 bg-orange-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
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
            </div>
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => setShowAddSession(true)}
                    className="bg-primary hover:bg-primaryLight text-white px-3 lg:px-4 py-2 rounded-lg font-medium transition-all shadow-sm flex items-center gap-2"
                >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Add Session</span>
            </button>
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
                    className={`aspect-square border-b border-r border-gray-100 p-1 cursor-pointer hover:bg-gray-50 transition-colors flex flex-col ${
                      day?.isToday ? 'bg-blue-50' : ''
                    } ${day?.isSelected ? 'bg-pink-100' : ''} ${
                      day?.isUnavailable ? 'bg-red-50 border-red-200' : ''
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
                        } ${day.isToday ? 'text-blue-600' : day.isUnavailable ? 'text-red-600' : 'text-gray-900'} flex-shrink-0 flex items-center justify-between`}>
                          <span>{day.date.getDate()}</span>
                          {day.isUnavailable && (
                            <CalendarX className="w-3 h-3 text-red-500" />
                          )}
                        </div>
                        <div className={`${
                          day.sessions.length > 3 ? 'space-y-0' : 'space-y-0.5'
                        } flex-1 overflow-hidden`}>
                          {day.sessions.slice(0, day.sessions.length > 4 ? 3 : 4).map(session => (
                            <div 
                              key={session.id}
                              className={`${
                                day.sessions.length > 3 
                                  ? 'text-xs px-0.5 py-0.5 rounded-sm' 
                                  : 'text-xs px-1 py-0.5 rounded-sm'
                              } ${getStatusColor(session.status)} flex items-center gap-1 truncate`}
                            >
                              <span className={`${
                                day.sessions.length > 3 ? 'hidden' : 'hidden lg:inline'
                              } flex-shrink-0`}>
                                {getSessionTypeIcon(session.type)}
                              </span>
                              <span className="truncate text-xs">
                                {session.time}
                              </span>
                            </div>
                          ))}
                          {day.sessions.length > 4 && (
                            <div className="text-xs text-gray-500 px-0.5 truncate">
                              +{day.sessions.length - 3}
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
                {sessions.filter(session => session.date === new Date().toISOString().split('T')[0]).map(session => (
                  <div key={session.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-lg ${session.type === 'video' ? 'bg-blue-100' : 'bg-green-100'}`}>
                      {getSessionTypeIcon(session.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{session.clientName}</p>
                      <p className="text-sm text-gray-600">{session.time} • {session.duration}min</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                      {session.status}
                    </span>
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
                  <span className="font-semibold text-green-600">10</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Pending</span>
                  <span className="font-semibold text-orange-600">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Available Slots</span>
                  <span className="font-semibold text-blue-600">28</span>
                </div>
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
                  {timeSlots.map(slot => (
                    <div 
                      key={slot.id} 
                      className={`p-4 rounded-lg border-2 transition-all ${
                        slot.isBooked 
                          ? 'border-green-200 bg-green-50' 
                          : slot.isAvailable 
                            ? 'border-blue-200 bg-blue-50 hover:border-blue-300 cursor-pointer' 
                            : 'border-gray-200 bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-gray-900">{slot.time}</span>
                          {slot.isBooked && slot.client && (
                            <div className="flex items-center gap-2">
                              {getSessionTypeIcon(slot.client.type)}
                              <span className="text-sm text-gray-600">{slot.client.name}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {slot.isBooked ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : slot.isAvailable ? (
                            <Plus className="w-5 h-5 text-blue-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                      {slot.isBooked && slot.client && (
                        <div className="mt-2 text-sm text-gray-600">
                          Duration: {slot.client.duration} minutes
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <button className="w-full bg-primary hover:bg-primaryLight text-white py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2">
                    <Edit3 className="w-5 h-5" />
                    Manage Availability
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Session Modal */}
        {showAddSession && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddSession(false)}
          >
            <div 
              className="bg-white rounded-2xl shadow-xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Add New Session</h3>
                  <button 
                    onClick={() => setShowAddSession(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter client name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <input 
                    type="time" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option value="video">Video Call</option>
                    <option value="phone">Phone Call</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                  </select>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setShowAddSession(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 bg-primary hover:bg-primaryLight text-white py-2 rounded-lg font-medium transition-all">
                    Add Session
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mark Unavailable Modal */}
        {showUnavailable && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowUnavailable(false)}
          >
            <div 
              className="bg-white rounded-2xl shadow-xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Mark Unavailable</h3>
                  <button 
                    onClick={() => setShowUnavailable(false)}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Availability Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                    <option value="full-day">Full Day Unavailable</option>
                    <option value="partial">Partial Day Unavailable</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Time (if partial)</label>
                  <input 
                    type="time" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    disabled
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Time (if partial)</label>
                  <input 
                    type="time" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    disabled
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason (optional)</label>
                  <textarea 
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    placeholder="Enter reason for unavailability..."
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setShowUnavailable(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition-all">
                    Mark Unavailable
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