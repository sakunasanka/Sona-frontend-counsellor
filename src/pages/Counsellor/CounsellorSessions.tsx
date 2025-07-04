import React, { useState, useEffect, useRef } from "react";
import { NavBar, Sidebar } from "../../components/layout";
import { Search, Calendar, Clock, User, Eye, ChevronDown, CheckCircle2, Video, MapPin, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Session {
  id: string;
  username: string;
  fullName: string;
  date: string;
  time: string;
  identity: string;
  verified: boolean;
  sessionType: 'individual' | 'group' | 'emergency';
  status: 'completed' | 'cancelled' | 'no-show';
  duration: number;
  notes?: string;
  mood?: 'positive' | 'neutral' | 'concerned';
  followUpRequired?: boolean;
}

interface SessionCardProps {
  session: Session;
  onViewDetails: (sessionId: string) => void;
}

const SessionCard: React.FC<SessionCardProps> = ({ session, onViewDetails }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'no-show':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'individual':
        return <User className="w-4 h-4" />;
      case 'group':
        return <User className="w-4 h-4" />;
      case 'emergency':
        return <Video className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-[rgb(174,175,247)] hover:border-opacity-50 transition-all hover:shadow-md overflow-hidden">
      <div className="p-6">
        {/* Header Section - Client Name and Status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg mb-1">
              {session.fullName}
            </h3>
            <p className="text-sm text-gray-500">@{session.username}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(session.status)}`}>
              {session.status === 'completed' ? 'Completed' : 
               session.status === 'cancelled' ? 'Cancelled' : 
               'No Show'}
            </span>
            {session.followUpRequired && (
              <span className="px-2 py-1 bg-orange-50 text-orange-600 text-xs rounded-full border border-orange-200">
                Follow-up needed
              </span>
            )}
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
                  {new Date(session.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg">
                <Clock className="w-4 h-4 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Time</p>
                <p className="text-sm font-semibold text-gray-900">{session.time}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg">
                {getSessionTypeIcon(session.sessionType)}
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Type</p>
                <p className="text-sm font-semibold text-gray-900 capitalize">{session.sessionType}</p>
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
            <span>Identity: {session.identity}</span>
          </div>
          {session.mood && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className={`w-3 h-3 rounded-full ${
                session.mood === 'positive' ? 'bg-green-400' :
                session.mood === 'neutral' ? 'bg-yellow-400' :
                'bg-red-400'
              }`} />
              <span className="capitalize">Mood: {session.mood}</span>
            </div>
          )}
        </div>

        {/* Notes Section */}
        {session.notes && (
          <div className="mb-4">
            <div className="bg-blue-50 border-l-4 border-blue-200 rounded-r-lg p-3">
              <h4 className="text-xs font-semibold text-blue-800 mb-1 uppercase tracking-wide">Session Notes</h4>
              <p className="text-sm text-blue-700 line-clamp-2">
                {session.notes}
              </p>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 border-t border-gray-100">
          <button
            onClick={() => onViewDetails(session.id)}
            className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[rgb(174,175,247)] bg-opacity-25 text-indigo-700 rounded-xl hover:bg-[rgb(174,175,247)] hover:bg-opacity-40 hover:text-indigo-800 transition-all duration-200 font-medium text-sm"
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>
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

    const loaderRef = useRef(null);

    const sessions: Session[] = [
        {
            id: "1",
            username: "JuniusIsMe",
            fullName: "Saman Kumara",
            date: "2025-06-20",
            time: "7:00 PM",
            identity: "Undisclosed",
            verified: true,
            sessionType: 'individual',
            status: 'completed',
            duration: 60,
            notes: "Client showed significant improvement in managing anxiety. Discussed coping strategies and homework assignments for the coming week.",
            mood: 'positive',
            followUpRequired: false
        },
        {
            id: "2",
            username: "Unknown124",
            fullName: "Shanuka Perera",
            date: "2025-06-24",
            time: "2:00 PM",
            identity: "Undisclosed",
            verified: true,
            sessionType: 'individual',
            status: 'completed',
            duration: 45,
            notes: "Discussed work-life balance issues. Client is implementing new time management techniques.",
            mood: 'neutral'
        },
        {
            id: "3",
            username: "HarryPotter",
            fullName: "Ramesha Fernando",
            date: "2025-04-10",
            time: "7:00 PM",
            identity: "Undisclosed",
            verified: true,
            sessionType: 'group',
            status: 'completed',
            duration: 90,
            notes: "Group therapy session focused on communication skills. Good participation from all members.",
            mood: 'positive'
        },
        {
            id: "4",
            username: "Thanos125",
            fullName: "Nehara Wickramasinghe",
            date: "2025-05-03",
            time: "7:00 PM",
            identity: "Undisclosed",
            verified: true,
            sessionType: 'individual',
            status: 'no-show',
            duration: 0,
            followUpRequired: true
        },
        {
            id: "5",
            username: "Bavuma125",
            fullName: "Ronath Konara",
            date: "2025-06-25",
            time: "7:00 PM",
            identity: "Undisclosed",
            verified: true,
            sessionType: 'emergency',
            status: 'completed',
            duration: 30,
            notes: "Emergency session due to panic attack. Client was stabilized and provided with immediate coping techniques.",
            mood: 'concerned',
            followUpRequired: true
        },
        {
            id: "6",
            username: "CoolCat22",
            fullName: "Sampath Jayasinghe",
            date: "2025-06-18",
            time: "1:30 PM",
            identity: "Undisclosed",
            verified: true,
            sessionType: 'individual',
            status: 'cancelled',
            duration: 0,
            notes: "Client cancelled due to family emergency. Rescheduled for next week."
        },
    ];

    const filteredSessions = [...sessions]
        .filter((s) => {
            const matchesSearch = 
                s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                new Date(s.date).toLocaleDateString().includes(searchTerm);
            
            const matchesFilter = filterBy === "All" || s.status === filterBy.toLowerCase();
            
            return matchesSearch && matchesFilter;
        })
        .sort((a, b) =>
            sortBy === "Oldest"
                ? new Date(a.date).getTime() - new Date(b.date).getTime()
                : new Date(b.date).getTime() - new Date(a.date).getTime()
        );

    const visibleSessions = filteredSessions.slice(0, visibleCount);

    const handleViewDetails = (sessionId: string) => {
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
      

    return (
        <div className="flex flex-col h-screen">
            <NavBar onMenuClick={toggleSidebar} />
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar - Let the Sidebar component handle its own positioning */}
                <div className="w-80 bg-white border-r hidden lg:block">
                    <Sidebar isOpen={true} onClose={closeSidebar} activeItem="sessions" />
                </div>
                
                {/* Mobile Sidebar - Handled entirely by Sidebar component */}
                <div className="lg:hidden">
                    <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} activeItem="sessions" />
                </div>
                
                {/* Main content */}
                <div className="flex-1 overflow-auto">
                    <div className="p-4 lg:p-6">
                        {/* Page Title */}
                        <div className="mb-6 lg:mb-8">
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Session History</h1>
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
                                            {sessions.filter(s => s.status === 'completed').length}
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
                                        {sessions.filter(s => s.status === 'cancelled').length}
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
                                        {sessions.filter(s => s.status === 'no-show').length}
                                    </p>
                                    <p className="text-sm text-gray-600">No Shows</p>
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
                                        {sessions.reduce((total, s) => total + s.duration, 0)}
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
                                        placeholder="Search by client name, username, or date..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-500 bg-gray-50 focus:bg-white focus:border-[rgb(174,175,247)] focus:ring-2 focus:ring-[rgb(174,175,247)] focus:ring-opacity-20 transition-all duration-200 outline-none shadow-sm"
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
                                        className="appearance-none w-full pl-4 pr-10 py-3.5 border border-gray-200 rounded-xl text-sm text-gray-900 bg-gray-50 hover:bg-white focus:bg-white focus:border-[rgb(174,175,247)] focus:ring-2 focus:ring-[rgb(174,175,247)] focus:ring-opacity-20 transition-all duration-200 outline-none cursor-pointer shadow-sm font-medium"
                                    >
                                        <option value="All">All Status</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                        <option value="no-show">No Show</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                                </div>
                                
                                <div className="relative flex-1 lg:flex-initial lg:min-w-[130px]">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="appearance-none w-full pl-4 pr-10 py-3.5 border border-gray-200 rounded-xl text-sm text-gray-900 bg-gray-50 hover:bg-white focus:bg-white focus:border-[rgb(174,175,247)] focus:ring-2 focus:ring-[rgb(174,175,247)] focus:ring-opacity-20 transition-all duration-200 outline-none cursor-pointer shadow-sm font-medium"
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
                            {visibleSessions.length > 0 ? (
                                visibleSessions.map((session) => (
                                    <SessionCard 
                                        key={session.id} 
                                        session={session} 
                                        onViewDetails={handleViewDetails}
                                    />
                                ))
                            ) : (
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

                            {/* Loading State */}
                            {isLoading && (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgb(174,175,247)]"></div>
                                    <span className="ml-3 text-gray-600">Loading more sessions...</span>
                                </div>
                            )}

                            {/* End of Results */}
                            {!hasMore && !isLoading && visibleSessions.length > 0 && (
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
