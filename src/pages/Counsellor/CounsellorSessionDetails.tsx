import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavBar, Sidebar } from "../../components/layout";
import { 
    Calendar, 
    Clock, 
    User, 
    Video, 
    MapPin, 
    CheckCircle2, 
    MessageCircle, 
    TrendingUp, 
    Activity,
    AlertCircle,
    FileText,
    Star
} from "lucide-react";
import { Bar, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend);

interface SessionDetails {
    id: string;
    clientName: string;
    username: string;
    date: string;
    time: string;
    duration: number;
    sessionType: 'individual' | 'group' | 'emergency';
    status: 'completed' | 'cancelled' | 'no-show';
    identity: string;
    verified: boolean;
    mood: 'positive' | 'neutral' | 'concerned';
    notes: string;
    followUpRequired: boolean;
    profileImage: string;
    institution?: string;
    concerns: string[];
    previousSessions: number;
    rating?: number;
}

const CounsellorSessionDetails: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);
    const navigate = useNavigate();

    // Mock session data - in real app, this would come from API
    const sessionData: SessionDetails = {
        id: "1",
        clientName: "Ronath Konara",
        username: "Bavuma125",
        date: "2025-06-25",
        time: "7:00 PM",
        duration: 30,
        sessionType: 'emergency',
        status: 'completed',
        identity: "Undisclosed",
        verified: true,
        mood: 'concerned',
        notes: "Emergency session due to panic attack. Client was stabilized and provided with immediate coping techniques. Discussed breathing exercises and grounding methods. Client showed improvement by end of session. Scheduled follow-up for tomorrow.",
        followUpRequired: true,
        profileImage: "/assets/images/patient-photo.png",
        institution: "University of Colombo",
        concerns: ["Anxiety", "Panic Attacks", "Academic Stress"],
        previousSessions: 5,
        rating: 4.5
    };

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
                return <User className="w-5 h-5" />;
            case 'group':
                return <User className="w-5 h-5" />;
            case 'emergency':
                return <AlertCircle className="w-5 h-5" />;
            default:
                return <User className="w-5 h-5" />;
        }
    };

    const getMoodColor = (mood: string) => {
        switch (mood) {
            case 'positive':
                return 'bg-green-400';
            case 'neutral':
                return 'bg-yellow-400';
            case 'concerned':
                return 'bg-red-400';
            default:
                return 'bg-gray-400';
        }
    };

    // Chart data for analytics
    const progressData = {
        labels: ["Session 1", "Session 2", "Session 3", "Session 4", "Session 5", "Current"],
        datasets: [
            {
                label: "Mood Score (1-10)",
                data: [4, 5, 6, 7, 6, 5],
                borderColor: "rgb(174,175,247)",
                backgroundColor: "rgba(174,175,247,0.1)",
                tension: 0.4,
                fill: true,
            },
            {
                label: "Anxiety Level (1-10)",
                data: [8, 7, 6, 5, 6, 7],
                borderColor: "#EF5DA8",
                backgroundColor: "rgba(239, 93, 168, 0.1)",
                tension: 0.4,
                fill: true,
            }
        ],
    };

    const sessionMetrics = {
        labels: ["Duration", "Engagement", "Progress", "Satisfaction"],
        datasets: [
            {
                label: "Session Metrics",
                data: [30, 85, 70, 90],
                backgroundColor: [
                    "rgba(174,175,247,0.8)",
                    "#EF5DA8",
                    "rgba(239, 93, 168, 0.6)",
                    "rgba(174,175,247,0.6)"
                ],
                borderRadius: 8,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 10
            }
        }
    };

    const barChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100
            }
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
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
                    <div className="p-3 sm:p-4 lg:p-6">
                        {/* Client Overview Card */}
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 mb-4 sm:mb-6 overflow-hidden">
                            {/* Header Section */}
                            <div className="p-4 sm:p-6 border-b border-gray-100">
                                <div className="flex items-start gap-4 sm:gap-6">
                                    <div className="relative">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl overflow-hidden border-3 border-white shadow-lg flex-shrink-0">
                                            <img
                                                src={sessionData.profileImage}
                                                alt="Client"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="mb-2">
                                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                                                {sessionData.clientName}
                                            </h1>
                                        </div>
                                        <p className="text-primary text-sm sm:text-base font-medium mb-3">
                                            @{sessionData.username}
                                        </p>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <MapPin className="w-3 h-3" />
                                                </div>
                                                <span className="font-medium">Identity:</span>
                                                <span>{sessionData.identity}</span>
                                            </div>
                                            {sessionData.institution && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <FileText className="w-3 h-3" />
                                                    </div>
                                                    <span className="font-medium">Institution:</span>
                                                    <span className="truncate">{sessionData.institution}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Status and Action Section */}
                            <div className="p-4 sm:p-6 bg-gray-50">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                        <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border ${getStatusColor(sessionData.status)}`}>
                                            <div className={`w-2 h-2 rounded-full ${
                                                sessionData.status === 'completed' ? 'bg-green-500' :
                                                sessionData.status === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'
                                            }`} />
                                            {sessionData.status === 'completed' ? 'Completed' : 
                                             sessionData.status === 'cancelled' ? 'Cancelled' : 
                                             'No Show'}
                                        </div>
                                        {sessionData.followUpRequired && (
                                            <div className="inline-flex items-center gap-2 px-3 py-2 bg-orange-50 text-orange-700 text-sm font-medium rounded-lg border border-orange-200">
                                                <AlertCircle className="w-3 h-3" />
                                                Follow-up Required
                                            </div>
                                        )}
                                    </div>
                                    <button 
                                        onClick={() => navigate('/counsellor-feedbacks')}
                                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md w-full sm:w-auto"
                                    >
                                        <Star className="w-4 h-4" />
                                        View Feedback
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Session Info Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
                            {/* Session Details */}
                            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Session Information</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                        <div className="p-2 sm:p-3 bg-white rounded-xl border border-gray-200 flex-shrink-0">
                                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Date</p>
                                            <p className="text-sm sm:text-base font-semibold text-gray-900 mt-1 leading-tight">
                                                {new Date(sessionData.date).toLocaleDateString('en-US', { 
                                                    weekday: 'short',
                                                    month: 'short', 
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                        <div className="p-2 sm:p-3 bg-white rounded-xl border border-gray-200 flex-shrink-0">
                                            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Time & Duration</p>
                                            <p className="text-sm sm:text-base font-semibold text-gray-900 mt-1">{sessionData.time}</p>
                                            <p className="text-xs sm:text-sm text-gray-600">{sessionData.duration} minutes</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                        <div className="p-2 sm:p-3 bg-white rounded-xl border border-gray-200 flex-shrink-0">
                                            <div className="text-gray-600">
                                                {getSessionTypeIcon(sessionData.sessionType)}
                                            </div>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Session Type</p>
                                            <p className="text-sm sm:text-base font-semibold text-gray-900 mt-1 capitalize">{sessionData.sessionType}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                        <div className="p-2 sm:p-3 bg-white rounded-xl border border-gray-200 flex-shrink-0">
                                            <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full ${getMoodColor(sessionData.mood)}`} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Mood Assessment</p>
                                            <p className="text-sm sm:text-base font-semibold text-gray-900 mt-1 capitalize">{sessionData.mood}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Client Stats */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Client Overview</h3>
                                <div className="space-y-4 sm:space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4">
                                        <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                            <div className="p-2 sm:p-3 bg-white rounded-xl border border-gray-200 flex-shrink-0">
                                                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Sessions</p>
                                                <p className="text-sm sm:text-base font-semibold text-gray-900 mt-1">{sessionData.previousSessions}</p>
                                            </div>
                                        </div>
                                        
                                        {sessionData.rating && (
                                            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                                <div className="p-2 sm:p-3 bg-white rounded-xl border border-gray-200 flex-shrink-0">
                                                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Average Rating</p>
                                                    <p className="text-sm sm:text-base font-semibold text-gray-900 mt-1">{sessionData.rating}/5</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                        <div className="p-2 sm:p-3 bg-white rounded-xl border border-gray-200 flex-shrink-0">
                                            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Main Concerns</p>
                                            <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                                                {sessionData.concerns.map((concern, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-200 break-words"
                                                    >
                                                        {concern}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Session Notes */}
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-4 sm:mb-6">
                            <div className="flex items-center gap-3 mb-3 sm:mb-4">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                                </div>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Session Notes</h3>
                            </div>
                            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{sessionData.notes}</p>
                            </div>
                        </div>

                        {/* Analytics Section */}
                        <div className="space-y-4 sm:space-y-6 mb-4 sm:mb-6">
                            {/* Progress Chart - Mobile First */}
                            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                                    <div className="p-2 bg-[rgb(174,175,247)] bg-opacity-10 rounded-lg">
                                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[rgb(174,175,247)]" />
                                    </div>
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Progress Overview</h3>
                                </div>
                                <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 overflow-hidden">
                                    <div className="h-64 sm:h-72 lg:h-80">
                                        <Line data={progressData} options={{
                                            ...chartOptions,
                                            maintainAspectRatio: false,
                                            responsive: true,
                                            plugins: {
                                                ...chartOptions.plugins,
                                                legend: {
                                                    position: 'top' as const,
                                                    labels: {
                                                        usePointStyle: true,
                                                        pointStyle: 'circle',
                                                        padding: 15,
                                                        font: {
                                                            size: 12
                                                        }
                                                    }
                                                }
                                            },
                                            scales: {
                                                ...chartOptions.scales,
                                                x: {
                                                    ticks: {
                                                        maxRotation: 45,
                                                        font: {
                                                            size: 10
                                                        }
                                                    }
                                                },
                                                y: {
                                                    ...chartOptions.scales.y,
                                                    ticks: {
                                                        font: {
                                                            size: 10
                                                        }
                                                    }
                                                }
                                            }
                                        }} />
                                    </div>
                                </div>
                            </div>

                            {/* Session Metrics - Mobile Optimized */}
                            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                                    <div className="p-2 bg-primary bg-opacity-10 rounded-lg">
                                        <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                                    </div>
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Session Metrics</h3>
                                </div>
                                <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 overflow-hidden">
                                    <div className="h-64 sm:h-72 lg:h-80">
                                        <Bar data={sessionMetrics} options={{
                                            ...barChartOptions,
                                            maintainAspectRatio: false,
                                            responsive: true,
                                            plugins: {
                                                ...barChartOptions.plugins,
                                                legend: {
                                                    display: false,
                                                }
                                            },
                                            scales: {
                                                ...barChartOptions.scales,
                                                x: {
                                                    ticks: {
                                                        maxRotation: 45,
                                                        font: {
                                                            size: 10
                                                        }
                                                    }
                                                },
                                                y: {
                                                    ...barChartOptions.scales.y,
                                                    ticks: {
                                                        font: {
                                                            size: 10
                                                        }
                                                    }
                                                }
                                            }
                                        }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                            <div className="flex items-center gap-3 mb-4 sm:mb-6">
                                <div className="p-2 bg-green-50 rounded-lg">
                                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                                </div>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Interactions</h3>
                            </div>
                            <div className="space-y-3 sm:space-y-4">
                                <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
                                    <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                                        <Video className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 text-sm sm:text-base">Emergency session completed</p>
                                        <p className="text-xs sm:text-sm text-gray-600 mt-0.5">Today at {sessionData.time} • Duration: {sessionData.duration} mins</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
                                    <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                                        <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 text-sm sm:text-base">Coping strategies discussed</p>
                                        <p className="text-xs sm:text-sm text-gray-600 mt-0.5">Breathing exercises and grounding techniques provided</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
                                    <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
                                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 text-sm sm:text-base">Follow-up scheduled</p>
                                        <p className="text-xs sm:text-sm text-gray-600 mt-0.5">Next session planned for tomorrow</p>
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

export default CounsellorSessionDetails;
