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
            <NavBar onMenuClick={toggleSidebar} />
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className="w-80 bg-white border-r hidden lg:block">
                    <Sidebar isOpen={true} onClose={closeSidebar} />
                </div>
                
                <div className="lg:hidden">
                    <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
                </div>
                
                {/* Main content */}
                <div className="flex-1 overflow-auto bg-gray-50">
                    <div className="p-4 lg:p-6">
                        {/* Client Overview Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 p-6">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-gray-100 flex-shrink-0">
                                        <img
                                            src={sessionData.profileImage}
                                            alt="Client"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="mb-2">
                                            <h2 className="text-2xl font-bold text-gray-900">{sessionData.clientName}</h2>
                                        </div>
                                        <p className="text-gray-600 mb-3">@{sessionData.username}</p>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                            <MapPin className="w-4 h-4" />
                                            <span>Identity: {sessionData.identity}</span>
                                        </div>
                                        {sessionData.institution && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <FileText className="w-4 h-4" />
                                                <span>{sessionData.institution}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col lg:items-end gap-3">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(sessionData.status)}`}>
                                        {sessionData.status === 'completed' ? 'Completed' : 
                                         sessionData.status === 'cancelled' ? 'Cancelled' : 
                                         'No Show'}
                                    </span>
                                    {sessionData.followUpRequired && (
                                        <span className="px-3 py-1 bg-orange-50 text-orange-600 text-sm rounded-full border border-orange-200">
                                            Follow-up Required
                                        </span>
                                    )}
                                    <button 
                                        onClick={() => navigate('/counsellor-feedbacks')}
                                        className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary hover:bg-opacity-90 transition-all duration-200 font-medium text-sm"
                                    >
                                        View Feedback
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Session Info Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                            {/* Session Details */}
                            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">Session Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                        <div className="p-3 bg-white rounded-xl border border-gray-200">
                                            <Calendar className="w-5 h-5 text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Date</p>
                                            <p className="text-base font-semibold text-gray-900 mt-1">
                                                {new Date(sessionData.date).toLocaleDateString('en-US', { 
                                                    weekday: 'long',
                                                    year: 'numeric', 
                                                    month: 'long', 
                                                    day: 'numeric' 
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                        <div className="p-3 bg-white rounded-xl border border-gray-200">
                                            <Clock className="w-5 h-5 text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Time & Duration</p>
                                            <p className="text-base font-semibold text-gray-900 mt-1">{sessionData.time}</p>
                                            <p className="text-sm text-gray-600">{sessionData.duration} minutes</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                        <div className="p-3 bg-white rounded-xl border border-gray-200">
                                            <div className="text-gray-600">
                                                {getSessionTypeIcon(sessionData.sessionType)}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Session Type</p>
                                            <p className="text-base font-semibold text-gray-900 mt-1 capitalize">{sessionData.sessionType}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                        <div className="p-3 bg-white rounded-xl border border-gray-200">
                                            <div className={`w-5 h-5 rounded-full ${getMoodColor(sessionData.mood)}`} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Mood Assessment</p>
                                            <p className="text-base font-semibold text-gray-900 mt-1 capitalize">{sessionData.mood}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Client Stats */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">Client Overview</h3>
                                <div className="space-y-4">
                                    <div className="text-center p-5 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors">
                                        <div className="text-3xl font-bold text-gray-900 mb-1">{sessionData.previousSessions}</div>
                                        <div className="text-sm text-gray-600 font-medium">Total Sessions</div>
                                    </div>
                                    
                                    {sessionData.rating && (
                                        <div className="text-center p-5 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors">
                                            <div className="flex items-center justify-center gap-1 mb-1">
                                                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                                                <span className="text-2xl font-bold text-gray-900">{sessionData.rating}</span>
                                            </div>
                                            <div className="text-sm text-gray-600 font-medium">Average Rating</div>
                                        </div>
                                    )}
                                    
                                    <div className="space-y-3">
                                        <p className="text-sm font-semibold text-gray-900">Main Concerns</p>
                                        <div className="flex flex-wrap gap-2">
                                            {sessionData.concerns.map((concern, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full border border-gray-200 hover:bg-gray-200 transition-colors"
                                                >
                                                    {concern}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Session Notes */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Session Notes</h3>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-gray-700 leading-relaxed">{sessionData.notes}</p>
                            </div>
                        </div>

                        {/* Analytics Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            {/* Progress Chart */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-[rgb(174,175,247)] bg-opacity-10 rounded-lg">
                                        <TrendingUp className="w-5 h-5 text-[rgb(174,175,247)]" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">Progress Overview</h3>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <Line data={progressData} options={chartOptions} />
                                </div>
                            </div>

                            {/* Session Metrics */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-primary bg-opacity-10 rounded-lg">
                                        <Activity className="w-5 h-5 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">Session Metrics</h3>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <Bar data={sessionMetrics} options={barChartOptions} />
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-green-50 rounded-lg">
                                    <MessageCircle className="w-5 h-5 text-green-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Recent Interactions</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Video className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">Emergency session completed</p>
                                        <p className="text-sm text-gray-600">Today at {sessionData.time} • Duration: {sessionData.duration} mins</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">Coping strategies discussed</p>
                                        <p className="text-sm text-gray-600">Breathing exercises and grounding techniques provided</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                    <div className="p-2 bg-orange-100 rounded-lg">
                                        <Calendar className="w-4 h-4 text-orange-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">Follow-up scheduled</p>
                                        <p className="text-sm text-gray-600">Next session planned for tomorrow</p>
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
