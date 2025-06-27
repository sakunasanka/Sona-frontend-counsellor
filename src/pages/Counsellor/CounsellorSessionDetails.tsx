import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../../components/ui/Container";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
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
import { NavBar, Sidebar } from "../../components/layout";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend);

const CounsellorSessionDetails: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);
    const navigate = useNavigate();
    const [animateRing, setAnimateRing] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setAnimateRing(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    const analyticsData = {
        labels: ["Session 01", "Session 02", "Chat 01", "Session 03"],
        datasets: [
            {
                label: "Rating",
                data: [60, 90, 75, 130],
                backgroundColor: "#d48fa5",
                borderRadius: 6,
            },
            {
                label: "Time Spent (min)",
                data: [30, 45, 20, 60],
                backgroundColor: "#ecacc0",
                borderRadius: 6,
            },
        ],
    };

    const lineData = {
        labels: ["Session 01", "Session 02", "Chat 01", "Session 03"],
        datasets: [
            {
                label: "Satisfaction",
                data: [50, 70, 60, 120],
                fill: true,
                backgroundColor: "#c1768e",
                tension: 0.3,
            },
        ],
    };

    const activities = [
        "Logged in to the system",
        "Viewed session summary",
        "Opened mood tracker",
        "Sent a thank-you note"
    ];

    const timestamps = [
        "Just now",
        "5 mins ago",
        "Yesterday",
        "2 days ago"
    ];

    return (
        <div className="flex flex-col h-screen">
            <NavBar onMenuClick={toggleSidebar} />

            <div className="flex flex-1 overflow-hidden">
                <div className="w-80 bg-white border-r hidden lg:block">
                    <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
                </div>

                <div className="lg:hidden">
                    <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
                </div>

                <div className="bg-pink-50 min-h-screen pb-12 flex-1 overflow-y-auto">
                    <Container className="py-6 space-y-6">

                        {/* Session Summary */}
                        <Card className="bg-rose-300 p-6 flex flex-col md:flex-row justify-between items-center transition-transform duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:-translate-y-1 hover:shadow-lg">
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-800 drop-shadow-md mb-2">Mr.Ronath Konara <span className="text-green-500 text-xs relative -top-[8px]">✔️</span></h2>
                                <p className="text-gray-800 text-sm">June 25, 2025 | 7.00 PM</p>
                                <p className="mt-2 font-medium gray-800">
                                    Bavuma125 <br />
                                    <span className="text-xs font-light">Undergraduate | University of Colombo</span>
                                </p>
                                <p className="text-xs text-gray-800 mt-2">Identity Undisclosed 🔖</p>
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-gray-800 via-gray-700 to-white-100 p-1">
                                    <img
                                        src="/assets/images/patient-photo.png"
                                        alt="User"
                                        className="w-full h-full rounded-full object-cover border-2 border-white shadow-md"
                                    />
                                </div>

                                <Button variant="special" className="mt-6" onClick={() => navigate("/counsellor-feedbacks")}>
                                    View Feedback
                                </Button>
                            </div>
                        </Card>

                        {/* Recent Interactions */}
                        <Card className="bg-pink-100 transition-transform duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:-translate-y-1 hover:shadow-lg">
                            <h3 className="text-lg font-semibold mb-4">Recent Interactions</h3>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <p className="font-semibold">Online meeting 👥</p>
                                    <p>Thursday, 20th of June, 2025 | 7.00 PM | <span className="text-blue-500 underline">Jitsi Meet</span></p>
                                </div>
                                <div>
                                    <p className="font-semibold">Chat 🗨️</p>
                                    <p>Monday, 14th of June, 2025 | 3.41 PM</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Online meeting 👥</p>
                                    <p>Saturday, 28th of June, 2025 | 7.00 PM | <span className="text-blue-500 underline">Jitsi Meet</span></p>
                                </div>
                            </div>
                        </Card>

                        {/* Analytics */}
                        <Card className="bg-pink-100 transition-transform duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:-translate-y-1 hover:shadow-lg">
                            <h3 className="text-lg font-semibold mb-4">Analytics</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white p-4 rounded-lg shadow-inner">
                                    <Line data={lineData} options={{ responsive: true, plugins: { legend: { display: true } } }} />
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-inner">
                                    <Bar data={analyticsData} options={{ responsive: true, plugins: { legend: { display: true } } }} />
                                </div>
                            </div>
                        </Card>

                        {/* Recent Activities */}
                        <Card className="bg-pink-100 transition-transform duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:-translate-y-1 hover:shadow-lg">
                            <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
                            <div className="space-y-3">
                                {activities.map((activity, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-white rounded-md p-4 shadow-sm flex items-center justify-between hover:shadow-md transition duration-300 ease-in-out"
                                    >
                                        <p className="text-sm text-gray-700">{activity}</p>
                                        <span className="text-xs text-gray-400">{timestamps[idx]}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Mood Summary */}
                        <Card className="bg-pink-100 transition-transform duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:-translate-y-1 hover:shadow-lg">
                            <h3 className="text-lg font-semibold mb-4">Mood Summary</h3>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="bg-white p-4 rounded-lg">
                                    <p className="text-3xl">😊</p>
                                    <p className="text-sm mt-2">Happy</p>
                                    <p className="text-sm mt-2 text-green-600">10</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg">
                                    <p className="text-3xl">😐</p>
                                    <p className="text-sm mt-2">Neutral</p>
                                    <p className="text-sm mt-2 text-gray-800">5</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg">
                                    <p className="text-3xl">😔</p>
                                    <p className="text-sm mt-2">Not So Good</p>
                                    <p className="text-sm mt-2 text-red-600">2</p>
                                </div>
                            </div>
                        </Card>

                    </Container>
                </div>
            </div>
        </div>
    );
};

export default CounsellorSessionDetails;
