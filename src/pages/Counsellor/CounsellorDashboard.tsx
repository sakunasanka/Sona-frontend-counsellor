import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavBar, Sidebar } from "../../components/layout";
import { 
  Calendar, 
  Users, 
  MessageCircle,
  HandCoins,
  Clock,
  Star,
  BookOpen,
  Activity,
  BarChart3,
  PlusCircle,
  ArrowRight
} from "lucide-react";
import { 
  getDashboardStats,
  getRecentSessions,
  getRecentActivities,
  getPerformanceMetrics,
  getCounsellorProfile,
  type DashboardStats,
  type Session,
  type Activity as ActivityType,
  type PerformanceMetrics
} from "../../api/counsellorAPI";

const CounsellorDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // State for API data
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [recentSessions, setRecentSessions] = useState<Session[]>([]);
  const [recentActivities, setRecentActivities] = useState<ActivityType[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [counsellorProfile, setCounsellorProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [counselorId, setCounselorId] = useState<number | null>(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  // Get counselor ID from token
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
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          
          const payload = JSON.parse(jsonPayload);
          
          if (payload && payload.id) {
            setCounselorId(payload.id);
          } else {
            setError('Invalid token format: user ID not found');
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

  // Fetch all dashboard data
  useEffect(() => {
    if (!counselorId) return;
    
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [
          statsResponse,
          sessionsResponse,
          activitiesResponse,
          metricsResponse,
          profileResponse
        ] = await Promise.allSettled([
          getDashboardStats(),
          getRecentSessions(counselorId, 4),
          getRecentActivities(4),
          getPerformanceMetrics(),
          getCounsellorProfile()
        ]);

        // Handle dashboard stats
        if (statsResponse.status === 'fulfilled') {
          setDashboardStats(statsResponse.value);
        } else {
          console.error('Failed to fetch dashboard stats:', statsResponse.reason);
        }

        // Handle recent sessions
        if (sessionsResponse.status === 'fulfilled') {
          setRecentSessions(sessionsResponse.value);
        } else {
          console.error('Failed to fetch recent sessions:', sessionsResponse.reason);
        }

        // Handle recent activities
        if (activitiesResponse.status === 'fulfilled') {
          setRecentActivities(activitiesResponse.value);
        } else {
          console.error('Failed to fetch recent activities:', activitiesResponse.reason);
        }

        // Handle performance metrics
        if (metricsResponse.status === 'fulfilled') {
          setPerformanceMetrics(metricsResponse.value);
        } else {
          console.error('Failed to fetch performance metrics:', metricsResponse.reason);
        }

        // Handle counsellor profile
        if (profileResponse.status === 'fulfilled') {
          setCounsellorProfile(profileResponse.value);
        } else {
          console.error('Failed to fetch counsellor profile:', profileResponse.reason);
        }

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [counselorId]);

  // Fallback data for when API fails or data is loading
  const fallbackStats = {
    totalSessions: 0,
    upcomingSessions: 0,
    totalClients: 0,
    averageRating: 0.0,
    monthlyEarnings: 0,
    totalBlogs: 0
  };

  const fallbackMetrics = {
    sessionCompletionRate: 0,
    clientSatisfaction: 0,
    averageResponseTime: "0 hours",
    responseTimeHours: 0
  };

  // Calculate stats from sessions data if API stats aren't available
  const calculateStatsFromSessions = () => {
    const totalSessions = recentSessions.length;
    const upcomingSessions = recentSessions.filter(s => s.status === 'scheduled').length;
    const completedSessions = recentSessions.filter(s => s.status === 'completed').length;
    
    // Get unique clients
    const uniqueClients = new Set(recentSessions.map(s => s.userId)).size;
    
    return {
      totalSessions,
      upcomingSessions,
      totalClients: uniqueClients,
      completedSessions
    };
  };

  const sessionStats = calculateStatsFromSessions();

  // Use real data or fallback - ensure all values are defined
  const stats = {
    totalSessions: dashboardStats?.totalSessions ?? sessionStats.totalSessions,
    upcomingSessions: dashboardStats?.upcomingSessions ?? sessionStats.upcomingSessions,
    totalClients: dashboardStats?.totalClients ?? sessionStats.totalClients,
    averageRating: dashboardStats?.averageRating ?? fallbackStats.averageRating,
    monthlyEarnings: dashboardStats?.monthlyEarnings ?? fallbackStats.monthlyEarnings,
    totalBlogs: dashboardStats?.totalBlogs ?? fallbackStats.totalBlogs,
  };
  
  const metrics = {
    sessionCompletionRate: performanceMetrics?.sessionCompletionRate ?? fallbackMetrics.sessionCompletionRate,
    clientSatisfaction: performanceMetrics?.clientSatisfaction ?? fallbackMetrics.clientSatisfaction,
    averageResponseTime: performanceMetrics?.averageResponseTime ?? fallbackMetrics.averageResponseTime,
    responseTimeHours: performanceMetrics?.responseTimeHours ?? fallbackMetrics.responseTimeHours,
  };

  // Helper functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Quick actions data
  const quickActions = [
    {
      title: "Schedule Session",
      description: "Set your availability and manage appointments",
      icon: Calendar,
      action: () => navigate("/counsellor-calendar"),
      color: "bg-blue-100",
      textcolor: "text-blue-600"
    },
    {
      title: "View Clients",
      description: "Manage your client relationships",
      icon: Users,
      action: () => navigate("/counsellor-clients"),
      color: "bg-green-100",
      textcolor: "text-green-600"
    },
    {
      title: "Write Blog",
      description: "Share insights with the community",
      icon: PlusCircle,
      action: () => navigate("/counsellor/create-blog"),
      color: "bg-purple-100",
      textcolor: "text-purple-600"
    },
    {
      title: "View Earnings",
      description: "Track your income and payments",
      icon: HandCoins,
      action: () => navigate("/counsellor-earnings"),
      color: "bg-yellow-100",
      textcolor: "text-yellow-600"
    }
  ];

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex flex-1 overflow-hidden">
          <div className="hidden lg:block">
            <Sidebar isOpen={true} onClose={closeSidebar} />
          </div>
          <div className="lg:hidden">
            <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
          </div>
          <div className="flex-1 overflow-auto">
            <NavBar onMenuClick={toggleSidebar} />
            <div className="p-4 lg:p-6 flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Loading dashboard...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            
            {/* Error State */}
            {error && (
              <div className="p-4 lg:p-6">
                <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6">
                  <p className="font-medium">Error loading dashboard</p>
                  <p className="text-sm">{error}</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="mt-2 text-sm underline hover:no-underline"
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}
            <div className="p-4 lg:p-6">
              {/* Page Header */}
              <div className="mb-6 lg:mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      Welcome back, {counsellorProfile?.name || counsellorProfile?.displayName || 'Doctor'}! 👋
                    </h1>
                    <p className="text-gray-600">Here's what's happening with your practice today.</p>
                  </div>
                </div>
              </div>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 mb-8">
                {/* Total Sessions */}
                <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-[120px] flex items-center">
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.totalSessions}</p>
                      <p className="text-gray-600 text-xs lg:text-sm leading-tight">Total Sessions</p>
                    </div>
                  </div>
                </div>

                {/* Upcoming Sessions */}
                <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-[120px] flex items-center">
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-orange-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.upcomingSessions}</p>
                    <p className="text-gray-600 text-xs lg:text-sm leading-tight">Bookings</p>
                  </div>
                </div>
              </div>

              {/* Total Clients */}
              <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-[120px] flex items-center">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.totalClients}</p>
                    <p className="text-gray-600 text-xs lg:text-sm leading-tight">Total Clients</p>
                  </div>
                </div>
              </div>

              {/* Average Rating */}
              <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-[120px] flex items-center">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.averageRating}</p>
                    <p className="text-gray-600 text-xs lg:text-sm leading-tight">Avg Rating</p>
                  </div>
                </div>
              </div>

              {/* Total Blogs */}
              <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-[120px] flex items-center">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats.totalBlogs}</p>
                    <p className="text-gray-600 text-xs lg:text-sm leading-tight">Published Blogs</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Recent Sessions */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6 h-[400px] flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Recent Sessions</h2>
                    <button 
                      onClick={() => navigate("/counsellor-sessions")}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2 transition-colors"
                    >
                      View All
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3 flex-1 overflow-y-auto">
                    {recentSessions.length > 0 ? (
                      recentSessions.map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors h-[64px]">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-blue-600">
                                  {session.user.name.charAt(0)}
                                </span>
                              </div>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">
                                {session.user.name}
                              </p>
                              <p className="text-xs text-gray-600">
                                {formatDate(session.date)} at {session.timeSlot}
                              </p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            session.status === 'scheduled' 
                              ? 'bg-blue-100 text-blue-700' 
                              : session.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : session.status === 'cancelled'
                              ? 'bg-red-100 text-red-700'
                              : session.status === 'no-show'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {session.status === 'no-show' ? 'No Show' : session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">No recent sessions</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6 h-[400px] flex flex-col">
                  <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
                  <div className="space-y-3 flex-1">
                    {quickActions.map((action, index) => {
                      const IconComponent = action.icon;
                      return (
                        <button
                          key={index}
                          onClick={action.action}
                          className={`w-full p-3 shadow-sm border border-gray-100 lg:p-6 rounded-xl hover:shadow-md transition-all group text-left h-[64px]`}
                        >
                          <div className="flex items-center gap-3 h-full">
                            <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0`}>
                              <IconComponent className={`w-4 h-4 ${action.textcolor}`} />
                            </div>
                            <div className="flex-1">
                              <h3 className={`font-semibold mb-1 text-sm`}>{action.title}</h3>
                              <p className="text-gray-600 text-xs">{action.description}</p>
                            </div>
                            <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform flex-shrink-0`} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional Dashboard Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mt-8">
              {/* Performance Overview */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Performance Overview</h2>
                  <BarChart3 className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Session Completion Rate</span>
                    <span className="font-semibold text-gray-900">{metrics.sessionCompletionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-slateButton-300 h-2 rounded-full" style={{ width: `${metrics.sessionCompletionRate}%` }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Client Satisfaction</span>
                    <span className="font-semibold text-gray-900">{metrics.clientSatisfaction}/5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-slateButton-300 h-2 rounded-full" style={{ width: `${(metrics.clientSatisfaction / 5) * 100}%` }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Response Time</span>
                    <span className="font-semibold text-gray-900">{metrics.averageResponseTime}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-slateButton-300 h-2 rounded-full" style={{ width: `${Math.min((24 - metrics.responseTimeHours) / 24 * 100, 100)}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Recent Activity</h2>
                  <Activity className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-4">
                  {recentActivities.length > 0 ? (
                    recentActivities.map((activity) => {
                      const getActivityIcon = (type: string) => {
                        switch (type) {
                          case 'message':
                            return { icon: MessageCircle, color: 'bg-green-100', textColor: 'text-green-600' };
                          case 'session':
                            return { icon: Calendar, color: 'bg-blue-100', textColor: 'text-blue-600' };
                          case 'rating':
                            return { icon: Star, color: 'bg-purple-100', textColor: 'text-purple-600' };
                          case 'blog':
                            return { icon: BookOpen, color: 'bg-yellow-100', textColor: 'text-yellow-600' };
                          case 'payment':
                            return { icon: HandCoins, color: 'bg-orange-100', textColor: 'text-orange-600' };
                          default:
                            return { icon: Activity, color: 'bg-gray-100', textColor: 'text-gray-600' };
                        }
                      };

                      const { icon: IconComponent, color, textColor } = getActivityIcon(activity.type);

                      return (
                        <div key={activity.id} className="flex items-start gap-3">
                          <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <IconComponent className={`w-4 h-4 ${textColor}`} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                            <p className="text-xs text-gray-600">{new Date(activity.timestamp).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                            })}</p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      <Activity className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No recent activities</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default CounsellorDashboard;