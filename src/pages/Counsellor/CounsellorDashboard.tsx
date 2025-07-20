import { useState } from "react";
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

const CounsellorDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  // Mock data for dashboard stats
  const dashboardStats = {
    totalSessions: 127,
    upcomingSessions: 5,
    totalClients: 48,
    averageRating: 4.8,
    monthlyEarnings: 3240,
    totalBlogs: 12
  };

  // Recent sessions data
  const recentSessions = [
    {
      id: 1,
      clientName: "JuniusIsMe",
      date: "Today",
      time: "2:00 PM",
      status: "upcoming",
      anonymous: true
    },
    {
      id: 2,
      clientName: "OptimusPrime", 
      date: "Tomorrow",
      time: "10:00 AM",
      status: "upcoming",
      anonymous: true
    },
    {
      id: 3,
      clientName: "Sarah Johnson",
      date: "June 20",
      time: "4:00 PM", 
      status: "completed",
      anonymous: true
    },
    {
      id: 4,
      clientName: "Boraluoda",
      date: "June 19",
      time: "11:00 AM",
      status: "completed", 
      anonymous: true
    }
  ];

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
      action: () => navigate("/signin"),
      color: "bg-yellow-100",
      textcolor: "text-yellow-600"
    }
  ];

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
              {/* Page Header */}
              <div className="mb-6 lg:mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      Welcome back, Dr. Sakuna! 👋
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
                      <p className="text-xl lg:text-2xl font-bold text-gray-900">{dashboardStats.totalSessions}</p>
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
                      <p className="text-xl lg:text-2xl font-bold text-gray-900">{dashboardStats.upcomingSessions}</p>
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
                    <p className="text-xl lg:text-2xl font-bold text-gray-900">{dashboardStats.totalClients}</p>
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
                    <p className="text-xl lg:text-2xl font-bold text-gray-900">{dashboardStats.averageRating}</p>
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
                    <p className="text-xl lg:text-2xl font-bold text-gray-900">{dashboardStats.totalBlogs}</p>
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
                    {recentSessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors h-[64px]">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            {session.anonymous ? (
                              <Users className="w-4 h-4 text-gray-600" />
                            ) : (
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-blue-600">
                                  {session.clientName.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">
                              {session.anonymous ? session.clientName : session.clientName}
                            </p>
                            <p className="text-xs text-gray-600">{session.date} at {session.time}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          session.status === 'upcoming' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {session.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                        </span>
                      </div>
                    ))}
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
                    <span className="font-semibold text-gray-900">96%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-slateButton-300 h-2 rounded-full" style={{ width: '96%' }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Client Satisfaction</span>
                    <span className="font-semibold text-gray-900">4.8/5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-slateButton-300 h-2 rounded-full" style={{ width: '96%' }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Response Time</span>
                    <span className="font-semibold text-gray-900">2 hours</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-slateButton-300 h-2 rounded-full" style={{ width: '85%' }}></div>
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
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">New message from JuniusIsMe</p>
                      <p className="text-xs text-gray-600">2 minutes ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Session completed with Sarah Johnson</p>
                      <p className="text-xs text-gray-600">1 hour ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Star className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Received 5-star rating</p>
                      <p className="text-xs text-gray-600">3 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Published new blog post</p>
                      <p className="text-xs text-gray-600">1 day ago</p>
                    </div>
                  </div>
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