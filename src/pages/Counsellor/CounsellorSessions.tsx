import { useState, useEffect, useRef } from "react";
import Container from "../../components/ui/Container";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Eye, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NavBar, Sidebar } from "../../components/layout";

const CounsellorSessions = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("Newest");
    const [visibleCount, setVisibleCount] = useState(4);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const loaderRef = useRef(null);

    const sessions = [
        {
            username: "JuniusIsMe",
            fullName: "Saman Kumara",
            date: "2025-06-20T19:00",
            identity: "Undisclosed",
            verified: true,
        },
        {
            username: "Unknown124",
            fullName: "Shanuka Perera",
            date: "2025-06-24T14:00",
            identity: "Undisclosed",
            verified: true,
        },
        {
            username: "HarryPotter",
            fullName: "Ramesha Fernando",
            date: "2025-04-10T19:00",
            identity: "Undisclosed",
            verified: true,
        },
        {
            username: "Thanos125",
            fullName: "Nehara Wickramasinghe",
            date: "2025-05-03T19:00",
            identity: "Undisclosed",
            verified: true,
        },
        {
            username: "Bavuma125",
            fullName: "Ronath Konara",
            date: "2025-06-25T19:00",
            identity: "Undisclosed",
            verified: true,
        },
        {
            username: "CoolCat22",
            fullName: "Sampath Jayasinghe",
            date: "2025-06-18T13:30",
            identity: "Undisclosed",
            verified: true,
        },
    ];

    const filteredSessions = [...sessions]
        .filter(
            (s) =>
                s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                new Date(s.date).toLocaleDateString().includes(searchTerm)
        )
        .sort((a, b) =>
            sortBy === "Oldest"
                ? new Date(a.date).getTime() - new Date(b.date).getTime()
                : new Date(b.date).getTime() - new Date(a.date).getTime()
        );

    const visibleSessions = filteredSessions.slice(0, visibleCount);

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
                <div className="w-80 bg-white border-r hidden lg:block">
                    <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
                </div>

                <div className="lg:hidden">
                    <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
                </div>

                <div className="bg-white min-h-screen pb-12 flex-1 overflow-y-auto">
                    <Container className="py-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Previous Sessions</h2>

                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                            <div className="relative w-full md:w-1/2">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by patient name or date"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm bg-gray-50 text-gray-800 placeholder-gray-500 focus:bg-white focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all duration-200"
                                />
                            </div>
                            <select
                                className="w-full md:w-40 pl-3 pr-8 py-3 border border-gray-300 rounded-xl text-sm bg-gray-50 text-gray-800 hover:bg-white focus:bg-white focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all duration-200 cursor-pointer"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option>Newest</option>
                                <option>Oldest</option>
                            </select>
                        </div>

                        <div className="space-y-6">
                            {visibleSessions.map((session, idx) => (
                                <Card key={idx} className="bg-pink-100 hover:bg-pink-200 p-5 w-full shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer group">
                                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                                {session.fullName}
                                                {session.verified && (
                                                    <span className="text-green-500 text-xs relative top-[-2px]">✔️</span>
                                                )}
                                            </h3>
                                            <p className="text-sm text-gray-600">{session.username}</p>
                                            <p className="text-sm text-gray-800 mt-1">
                                                {new Date(session.date).toLocaleString(undefined, {
                                                    dateStyle: "medium",
                                                    timeStyle: "short",
                                                })}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Identity: {session.identity} ⚠️
                                            </p>
                                        </div>
                                        <Button variant="special" className="mt-3 md:mt-0 self-start flex items-center" onClick={() => navigate("/counsellor-session-details")}>
                                            <Eye className="mr-2 group-hover:animate-pulse" size={16} />
                                            Explore Session
                                        </Button>
                                    </div>
                                </Card>
                            ))}

                            {isLoading && (
                                <p className="text-center text-sm text-gray-500 animate-pulse">Loading more sessions...</p>
                            )}
                            {!hasMore && !isLoading && (
                                <p className="text-center text-sm text-gray-500">All sessions caught up</p>
                            )}
                            <div ref={loaderRef}></div>
                        </div>
                    </Container>
                </div>
            </div>
        </div>
    );
};

export default CounsellorSessions;
