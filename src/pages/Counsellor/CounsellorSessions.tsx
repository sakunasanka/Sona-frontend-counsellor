import React, { useState, useEffect, useRef } from "react";
import { NavBar, Sidebar } from "../../components/layout";
import { Search, Calendar, Clock, User, Eye, ChevronDown, CheckCircle2, Video, MapPin, X, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui";
import { apiClient } from "../../api/apiBase";

interface User {
  id: number;
  name: string;
  avatar: string | null;
}

interface Session {
  id: number;
  userId: number;
  counselorId: number;
  date: string;
  timeSlot: string;
  duration: number;
  price: number;
  notes: string | null;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  createdAt: string;
  updatedAt: string;
  user: User;
  isStudent: boolean;
}

// JWT token payload interface
interface TokenPayload {
  id: number;
  email?: string;
  role?: string;
  iat: number;
  exp: number;
}

interface SessionCardProps {
  session: Session;
  onViewDetails: (sessionId: number) => void;
}

const SessionCard: React.FC<SessionCardProps> = ({ session, onViewDetails }) => {
  const navigate = useNavigate();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'no-show':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'scheduled':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getSessionTypeIcon = () => {
    return <User className="w-4 h-4" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-[rgb(174,175,247)] hover:border-opacity-50 transition-all hover:shadow-md overflow-hidden">
      <div className="p-6">
        {/* Header Section - Client Name and Status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg mb-1">
              {session.user.name}
            </h3>
            <p className="text-sm text-slate-400 font-medium">
              Booked Date: {new Date(session.createdAt).toLocaleString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })}
            </p>
          </div>
          <div className="gap-2 flex items-center">
            <div className="flex flex-col items-end gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor('completed')}`}>
                {formatStatus(session.isStudent ? 'student' : 'Regular User')}
              </span>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(session.status)}`}>
                {formatStatus(session.status)}
              </span>
            </div>
          </div>
        </div>

        {/* Session Info Grid */}
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg">
                <Calendar className="w-4 h-4 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Date</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatDate(session.date)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg">
                <Clock className="w-4 h-4 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Time</p>
                <p className="text-sm font-semibold text-gray-900">{session.timeSlot}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg">
                {getSessionTypeIcon()}
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Type</p>
                <p className="text-sm font-semibold text-gray-900">Individual</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg">
                <Clock className="w-4 h-4 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Duration</p>
                <p className="text-sm font-semibold text-gray-900">{session.duration} mins</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>Price: {session.price} LKR</span>
          </div>
        </div>

        {/* Notes Section */}
        {session.notes && (
          <div className="mb-4">
            <div className="bg-secondary bg-opacity-20 border-l-4 border-secondary rounded-r-lg p-3">
              <h4 className="text-xs font-semibold text-gray-800 mb-1 uppercase tracking-wide">Session Notes</h4>
              <p className="text-sm text-gray-700 line-clamp-2">
                {session.notes}
              </p>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 border-t border-gray-100">
          <Button 
              variant="calendar" 
              onClick={() => onViewDetails(session.id)}
              icon={<Eye className="w-4 h-4" />}
          >
              <span className="hidden sm:inline">View Details</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

const CounsellorSessions = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("Newest");
    const [filterBy, setFilterBy] = useState("All");
    const [visibleCount, setVisibleCount] = useState(6);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [counselorId, setCounselorId] = useState<number | null>(null);

    const loaderRef = useRef(null);
  
    // First, ensure token is set in apiClient before making requests
    useEffect(() => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        apiClient.setAuthToken(token);
      } else {
        setError('Authentication token not found. Please log in again.');
      }
    }, []);

    // Get the logged-in counselor's ID from the token
    useEffect(() => {
      const getUserIdFromToken = () => {
        try {
          const token = localStorage.getItem('auth_token');
          if (!token) {
            setError('Authentication token not found. Please log in again.');
            return;
          }
          
          // Decode the token to get the user ID
          try {
            // Simple JWT decode (no verification)
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            
            const payload = JSON.parse(jsonPayload) as TokenPayload;
            
            if (payload && payload.id) {
              console.log('Using counselor ID from token:', payload.id);
              setCounselorId(payload.id);
            } else {
              setError('Invalid token format: user ID not found');
              console.error('Invalid token payload:', payload);
            }
          } catch (decodeError) {
            console.error('Error decoding token:', decodeError);
            setError('Error decoding authentication token');
          }
        } catch (err) {
          setError('Error retrieving user data');
          console.error('Error getting user data:', err);
        }
      };

      getUserIdFromToken();
    }, []);

    // Then, fetch sessions once we have the counselor ID
    useEffect(() => {
      if (!counselorId) return;

      const fetchSessions = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
          // Ensure we're using the token for this request
          const token = localStorage.getItem('auth_token');
          if (!token) {
            setError('Authentication token not found. Please log in again.');
            setIsLoading(false);
            return;
          }

          // Make the API request with authentication
          const response = await apiClient.get<{data: Session[]}>(`/sessions/counselor/${counselorId}`, undefined, token, true);
          
          if (response.success && response.data) {
            setSessions(response.data.data || []);
          } else {
            setError('Failed to fetch sessions data');
          }
        } catch (err: any) {
          if (err.code === 'NETWORK_ERROR') {
            setError('Network error: Unable to connect to the server. Please check your internet connection.');
          } else if (err.status === 401) {
            setError('Authentication error: Your session has expired. Please log in again.');
            // Clear invalid token
            localStorage.removeItem('auth_token');
            // Redirect to login page after a delay
            setTimeout(() => navigate('/signin'), 3000);
          } else if (err.status === 404) {
            setError('No sessions found for this counselor.');
            setSessions([]);
          } else {
            setError(`Error: ${err.message || 'Unknown error occurred'}`);
          }
          console.error('Error fetching sessions:', err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchSessions();
    }, [counselorId, navigate]);

    const filteredSessions = [...sessions]
        .filter((s) => {
            const matchesSearch = 
                s.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.date.includes(searchTerm) ||
                s.timeSlot.includes(searchTerm);
            
            const matchesFilter = filterBy === "All" || s.status === filterBy.toLowerCase();
            
            return matchesSearch && matchesFilter;
        })
        .sort((a, b) =>
            sortBy === "Oldest"
                ? new Date(a.date).getTime() - new Date(b.date).getTime()
                : new Date(b.date).getTime() - new Date(a.date).getTime()
        );

    const visibleSessions = filteredSessions.slice(0, visibleCount);

    const handleViewDetails = (sessionId: number) => {
        navigate(`/counsellor-session-details?id=${sessionId}`);
    };

    useEffect(() => {
        const loader = loaderRef.current;
        if (!loader) return;
      
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting && hasMore && !isLoading) {
              setIsLoading(true);
              setTimeout(() => {
                setVisibleCount((prev) => {
                  const newCount = prev + 2;
                  if (newCount >= filteredSessions.length) {
                    setHasMore(false);
                  }
                  return newCount;
                });
                setIsLoading(false);
              }, 1000);
            }
          },
          { threshold: 1 }
        );
      
        observer.observe(loader);
      
        return () => {
          if (loader) observer.unobserve(loader);
        };
      }, [filteredSessions.length, isLoading, hasMore]);
      
    const getCompletedCount = () => {
      return sessions.filter(s => s.status === 'completed').length;
    };

    const getCancelledCount = () => {
      return sessions.filter(s => s.status === 'cancelled').length;
    };

    const getScheduledCount = () => {
      return sessions.filter(s => s.status === 'scheduled').length;
    };

    const getTotalMinutes = () => {
      return sessions.reduce((total, s) => total + s.duration, 0);
    };

    const handleSignIn = () => {
      navigate('/signin');
    };

    return (
        <div className="flex flex-col h-screen">
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar - Let the Sidebar component handle its own positioning */}
                <div className="hidden lg:block">
                  <Sidebar isOpen={true} onClose={closeSidebar} />
                </div>
                
                {/* Mobile Sidebar */}
                <div className="lg:hidden">
                  <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
                </div>
                
                {/* Main content */}
                <div className="flex-1 overflow-auto">
                  <NavBar onMenuClick={toggleSidebar} />
                    <div className="p-4 lg:p-6">
                        {/* Page Title */}
                        <div className="mb-6 lg:mb-8 flex items-center justify-between">
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Recent Sessions</h1>
                            <Button 
                                variant="calendar" 
                                onClick={() => navigate('/counsellor-calendar')} 
                                icon={<Calendar className="w-4 h-4" />}
                            >
                                <span className="hidden sm:inline">View Calendar</span>
                            </Button>
                        </div>

                        {/* Stats Cards - Desktop Only */}
                        <div className="hidden lg:grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
                            <div className="bg-white rounded-2xl p-3 lg:p-4 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-green-50 rounded-xl">
                                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {getCompletedCount()}
                                        </p>
                                        <p className="text-sm text-gray-600">Completed</p>
                                    </div>
                                </div>
                            </div>
                        
                        <div className="bg-white rounded-2xl p-3 lg:p-4 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-red-50 rounded-xl">
                                    <Calendar className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {getCancelledCount()}
                                    </p>
                                    <p className="text-sm text-gray-600">Cancelled</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-2xl p-3 lg:p-4 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-yellow-50 rounded-xl">
                                    <Clock className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {getScheduledCount()}
                                    </p>
                                    <p className="text-sm text-gray-600">Scheduled</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-2xl p-3 lg:p-4 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-[rgb(174,175,247)] bg-opacity-25 rounded-xl">
                                    <User className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {getTotalMinutes()}
                                    </p>
                                    <p className="text-sm text-gray-600">Total Minutes</p>
                                </div>
                            </div>
                        </div>
                    </div>

                        {/* Search and Filters */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                            <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
                            {/* Search Bar */}
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search by client name, date, or time..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-500 bg-gray-50 focus:bg-white focus:border-slate-500 f ocus:border-opacity-50 focus:ring-2 focus:ring-slate-500 focus:ring-opacity-20 transition-all duration-200 outline-none shadow-sm"
                                    />
                                    {searchTerm && (
                                        <button
                                            onClick={() => setSearchTerm("")}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                            
                            {/* Filter Controls */}
                            <div className="flex gap-3 lg:gap-4 w-full lg:w-auto">
                                <div className="relative flex-1 lg:flex-initial lg:min-w-[140px]">
                                    <select
                                        value={filterBy}
                                        onChange={(e) => setFilterBy(e.target.value)}
                                        className="appearance-none w-full pl-4 pr-10 py-3.5 border border-gray-200 rounded-xl text-sm text-gray-900 bg-gray-50 hover:bg-white focus:bg-white focus:border-slate-500 focus:border-opacity-50 focus:ring-2 focus:ring-slate-500 focus:ring-opacity-20 transition-all duration-200 outline-none cursor-pointer shadow-sm font-medium"
                                    >
                                        <option value="All">All Status</option>
                                        <option value="scheduled">Scheduled</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                                </div>
                                
                                <div className="relative flex-1 lg:flex-initial lg:min-w-[130px]">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="appearance-none w-full pl-4 pr-10 py-3.5 border border-gray-200 rounded-xl text-sm text-gray-900 bg-gray-50 hover:bg-white focus:bg-white focus:border-slate-500 focus:border-opacity-50 focus:ring-2 focus:ring-slate-500 focus:ring-opacity-20 transition-all duration-200 outline-none cursor-pointer shadow-sm font-medium"
                                    >
                                        <option value="Newest">Newest First</option>
                                        <option value="Oldest">Oldest First</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                                </div>
                            </div>
                        </div>
                    </div>

                        {/* Session List */}
                        <div className="space-y-6">
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
                                    <p className="text-red-600">{error}</p>
                                    {error.includes('log in') && (
                                        <Button 
                                            variant="primary" 
                                            className="mt-4"
                                            onClick={handleSignIn}
                                        >
                                            Go to Sign In
                                        </Button>
                                    )}
                                </div>
                            )}
                            
                            {!error && isLoading && sessions.length === 0 && (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[rgb(174,175,247)]"></div>
                                    <span className="ml-3 text-gray-600">Loading sessions...</span>
                                </div>
                            )}

                            {!error && !isLoading && visibleSessions.length === 0 && (
                                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No sessions found</h3>
                                    <p className="text-gray-600">
                                        {searchTerm || filterBy !== "All" 
                                            ? "Try adjusting your search or filter criteria" 
                                            : "You haven't completed any sessions yet"
                                        }
                                    </p>
                                </div>
                            )}

                            {!error && visibleSessions.length > 0 && (
                                visibleSessions.map((session) => (
                                    <SessionCard 
                                        key={session.id} 
                                        session={session} 
                                        onViewDetails={handleViewDetails}
                                    />
                                ))
                            )}

                            {/* Loading More State */}
                            {!error && isLoading && sessions.length > 0 && (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgb(174,175,247)]"></div>
                                    <span className="ml-3 text-gray-600">Loading more sessions...</span>
                                </div>
                            )}

                            {/* End of Results */}
                            {!error && !isLoading && !hasMore && visibleSessions.length > 0 && (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">You've reached the end of your session history</p>
                                </div>
                            )}

                            {/* Intersection Observer Target */}
                            <div ref={loaderRef} className="h-4"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CounsellorSessions;
