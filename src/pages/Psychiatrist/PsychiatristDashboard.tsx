import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavBar, SidebarForPsy } from "../../components/layout";
import {
  Calendar,
  Users,
  MessageCircle,
  HandCoins,
  Clock,
  Star,
  Activity,
  BarChart3,
  ArrowRight,
  HeartPlusIcon
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

  // Get recent prescriptions from localStorage or use default data
  const getRecentPrescriptions = () => {
    const stored = localStorage.getItem('savedPrescriptions');
    if (stored) {
      const savedPrescriptions = JSON.parse(stored);
      return savedPrescriptions.map((prescription: any) => ({
        id: prescription.id,
        patientId: prescription.patientId,
        patientName: prescription.patientName,
        date: new Date(prescription.createdAt).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        medicineCount: prescription.medicines.length,
        status: prescription.status,
        medicines: prescription.medicines.map((med: any) => `${med.name} ${med.dosage}`)
      })).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    
    // Default data if no saved prescriptions
    return [
      {
        id: "7",
        patientId: "7",
        patientName: "Nayani Wickramasinghe",
        date: "July 16, 2025",
        medicineCount: 3,
        status: "active",
        medicines: ["Olanzapine 5mg", "Haloperidol 2ml", "Vitamin B12 1ml"]
      },
      {
        id: "6",
        patientId: "6",
        patientName: "Chamara Perera",
        date: "July 15, 2025",
        medicineCount: 2,
        status: "active",
        medicines: ["Escitalopram 10mg", "Mirtazapine 15mg"]
      },
      {
        id: "5",
        patientId: "5",
        patientName: "Kumari Silva",
        date: "July 14, 2025",
        medicineCount: 2,
        status: "active",
        medicines: ["Paroxetine 25mg", "Alprazolam 0.5mg"]
      },
      {
        id: "1",
        patientId: "1",
        patientName: "Ronath Konara",
        date: "July 13, 2025",
        medicineCount: 1,
        status: "active",
        medicines: ["Sertraline 50mg"]
      }
    ];
  };

  const [recentPrescriptions, setRecentPrescriptions] = useState(getRecentPrescriptions());

  // Refresh prescriptions data when component mounts or when returning from prescription management
  useEffect(() => {
    const refreshData = () => {
      setRecentPrescriptions(getRecentPrescriptions());
    };

    // Listen for storage changes to update dashboard when prescriptions change
    window.addEventListener('storage', refreshData);
    
    // Also listen for a custom event when prescriptions are updated from the same tab
    window.addEventListener('prescriptionsUpdated', refreshData);

    return () => {
      window.removeEventListener('storage', refreshData);
      window.removeEventListener('prescriptionsUpdated', refreshData);
    };
  }, []);

  // Quick actions data
  const quickActions = [
    {
      title: "Schedule Session",
      description: "Set your availability and manage appointments",
      icon: Calendar,
      action: () => navigate("/psychiatrist-sessions"),
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      title: "View Patients",
      description: "Manage your patient relationships",
      icon: Users,
      action: () => navigate("/psychiatrist-patients"),
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      title: "View Prescriptions",
      description: "Manage your patient prescriptions",
      icon: HeartPlusIcon,
      action: () => navigate("/psychiatrist/create-prescription"),
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    },
    {
      title: "View Earnings",
      description: "Track your income and payments",
      icon: HandCoins,
      action: () => navigate("/psychiatrist-earnings"),
      color: "bg-yellow-500",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600"
    }
  ];

  return (
    <div className="flex flex-col h-screen">
      <NavBar onMenuClick={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Desktop */}
        <div className="w-80 bg-white border-r hidden lg:block">
          <SidebarForPsy isOpen={true} onClose={closeSidebar} />
        </div>

        {/* Mobile Sidebar */}
        <div className="lg:hidden">
          <SidebarForPsy isOpen={sidebarOpen} onClose={closeSidebar} />
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto p-4 lg:p-6 bg-gray-50">
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
                  <p className="text-gray-600 text-xs lg:text-sm leading-tight">Consultations</p>
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
                  <p className="text-gray-600 text-xs lg:text-sm leading-tight">Total Patients</p>
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
                  <HeartPlusIcon className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">{dashboardStats.totalBlogs}</p>
                  <p className="text-gray-600 text-xs lg:text-sm leading-tight">Prescriptions</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Recent Sessions */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6 h-[400px] flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg lg:text-xl font-semibold text-gray-900">Recent Prescriptions</h2>
                  <button
                    onClick={() => navigate("/psychiatrist/create-prescription?tab=saved")}
                    className="text-secondaryDusk hover:text-secondaryDarker font-medium text-sm flex items-center gap-2 transition-colors"
                  >
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {recentPrescriptions.map((prescription: any) => (
                    <div 
                      key={prescription.id} 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors h-[64px] cursor-pointer"
                      onClick={() => navigate(`/psychiatrist/create-prescription?tab=saved&patientId=${prescription.patientId}&prescriptionId=${prescription.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <HeartPlusIcon className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {prescription.patientName}
                          </p>
                          <p className="text-xs text-gray-600">{prescription.date} • {prescription.medicineCount} medicine{prescription.medicineCount > 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        prescription.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {prescription.status === 'active' ? 'Active' : 'Discontinued'}
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
                        className={`w-full p-3 ${action.bgColor} rounded-xl hover:shadow-md transition-all group text-left h-[64px]`}
                      >
                        <div className="flex items-center gap-3 h-full">
                          <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0`}>
                            <IconComponent className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className={`font-semibold ${action.textColor} mb-1 text-sm`}>{action.title}</h3>
                            <p className="text-gray-600 text-xs">{action.description}</p>
                          </div>
                          <ArrowRight className={`w-4 h-4 ${action.textColor} group-hover:translate-x-1 transition-transform flex-shrink-0`} />
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
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Client Satisfaction</span>
                  <span className="font-semibold text-gray-900">4.8/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Response Time</span>
                  <span className="font-semibold text-gray-900">&lt; 2 hours</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '85%' }}></div>
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
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">New message from Ronath Konara</p>
                    <p className="text-xs text-gray-600">2 minutes ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <HeartPlusIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Prescription issued to Hashara Edirimauni</p>
                    <p className="text-xs text-gray-600">1 hour ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Star className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Received 5-star rating</p>
                    <p className="text-xs text-gray-600">3 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Consultation completed with Shenara Fernando</p>
                    <p className="text-xs text-gray-600">1 day ago</p>
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
