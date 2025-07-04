import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavBar, Sidebar } from "../../components/layout";
import Container from "../../components/ui/Container";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { FaCalendarAlt, FaMoneyBillWave, FaPenNib } from "react-icons/fa";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

const CounsellorDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleCreateBlog = () => navigate("/counsellor/create-blog");
  const handleExploreCalendar = () => navigate("/counsellor-calendar");
  const handleExploreEarnings = () => navigate("/counsellor/earnings");


  const sessions = [
    {
      name: "JuniusIsMe",
      date: "June 20 | 7.00 PM",
      identity: "Undisclosed",
      verified: true,
    },
    {
      name: "OptimusPrime",
      date: "June 13 | 4.00 PM",
      identity: "Undisclosed",
      verified: true,
    },
    {
      name: "Boraluoda",
      date: "June 13 | 4.00 PM",
      identity: "Undisclosed",
      verified: true,
    },
    {
      name: "Unknown101",
      date: "June 13 | 4.00 PM",
      identity: "Undisclosed",
      verified: true,
    },
    {
      name: "Bumblebee",
      date: "June 13 | 4.00 PM",
      identity: "Undisclosed",
      verified: true,
    },
  ];

  // Group sessions into chunks of 3
  const groupedSessions = [];
  for (let i = 0; i < sessions.length; i += 3) {
    groupedSessions.push(sessions.slice(i, i + 3));
  }

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    slides: {
      perView: 1,
      spacing: 0,
    },
    loop: true,
    mode: "snap",
    drag: true,
    rubberband: true,
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
    defaultAnimation: {
      duration: 1000,
      easing: (t: number) => 1 - Math.pow(1 - t, 3), // ease-out-cubic for smoother animation
    },
  }, [
    (slider) => {
      let timeout: ReturnType<typeof setTimeout>;
      let mouseOver = false;
      
      function clearNextTimeout() {
        clearTimeout(timeout);
      }
      
      function nextTimeout() {
        clearTimeout(timeout);
        if (mouseOver) return;
        timeout = setTimeout(() => {
          slider.next();
        }, 7000);
      }
      
      slider.on("created", () => {
        slider.container.addEventListener("mouseover", () => {
          mouseOver = true;
          clearNextTimeout();
        });
        slider.container.addEventListener("mouseout", () => {
          mouseOver = false;
          nextTimeout();
        });
        nextTimeout();
      });
      
      slider.on("dragStarted", clearNextTimeout);
      slider.on("animationEnded", nextTimeout);
      slider.on("updated", nextTimeout);
    },
  ]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = groupedSessions.length;

  const handleDotClick = (index: number) => {
    if (instanceRef.current) {
      instanceRef.current.moveToIdx(index);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navbar */}
      <NavBar onMenuClick={toggleSidebar} />

      {/* Bottom section: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
             
      {/* Sidebar */}
      <div className="w-80 bg-white border-r hidden lg:block">
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar}/>
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar}/>
      </div>

      {/* Main Content */}
        <div className="flex-1 overflow-auto lg:ml-0">
            <div className="p-6">
            <div className="min-h-[calc(100vh-8rem)] w-full bg-white rounded-xl relative overflow-hidden"
                style={{
                  backgroundImage: `
                    url('../../../public/assets/images/bg-trans.jpg'), 
                    linear-gradient(rgba(255, 192,  203, 0.7), rgba(255, 192, 203, 0.1))
                  `,
                  backgroundBlendMode: 'overlay',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}>
                <Container className="py-6">
                {/* Welcome Section */}
                <div className="mb-8">
                    <p className="text-lg text-gray-700">Welcome back,</p>
                    <h1 className="text-3xl font-bold text-gray-900">Dr. Sakuna!</h1>
                </div>

                {/* Recent Sessions */}
                <section className="mb-10">
                  <h2 className="text-xl font-semibold text-gray-800 mb-0.5 ">Recent Sessions</h2>
                  <div className="py-4">
                    <div ref={sliderRef} className="keen-slider overflow-hidden">
                      {groupedSessions.map((sessionGroup, groupIdx) => (
                        <div key={groupIdx} className="keen-slider__slide will-change-transform">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
                            {sessionGroup.map((session, idx) => (
                              <Card key={idx} className="bg-pink-100 p-6 h-full shadow-lg transition-all duration-300 ease-out hover:shadow-xl origin-center">
                                <h3 className="text-xl font-bold mb-3 transition-colors duration-200">{session.name}</h3>
                                <p className="text-base mb-3 transition-colors duration-200">{session.date}</p>
                                <p className="text-sm text-gray-600 mb-4 transition-colors duration-200">
                                  Identity: {session.identity} {session.verified ? "✅" : "⚠️"}
                                </p>
                                <Button
                                  variant="special"
                                  onClick={() => navigate("/counsellor-sessions")}
                                  className="mt-6 flex items-center transition-all duration-200"
                                >
                                  Explore Session
                                </Button>
                              </Card>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Slider Dots - Only show if there are multiple groups */}
                  {totalSlides > 1 && (
                    <div className="flex justify-center mt-6 space-x-3">
                      {Array.from({ length: totalSlides }).map((_, i) => (
                        <div
                          key={i}
                          onClick={() => handleDotClick(i)}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ease-out transform hover:scale-125 cursor-pointer ${
                            i === currentSlide 
                              ? 'bg-gray-800 scale-110 shadow-md' 
                              : 'bg-gray-400 hover:bg-gray-600'
                          }`}
                        ></div>
                      ))}
                    </div>
                  )}
                </section>

                {/* Functional Cards */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 px-0.5">Browse Features</h2>
                  <section className="grid md:grid-cols-3 gap-6 px-0.5">
                    <Card className="bg-rose-300 p-6 flex flex-col h-full">
                      <h3 className="text-lg font-bold mb-2">Working Schedule</h3>
                      <p className="mb-4 flex-grow">Work on demand & set your availability on your terms!</p>
                      <div className="mt-auto">
                        <Button variant="special" onClick={handleExploreCalendar} className="flex items-center">
                          <FaCalendarAlt className="mr-2" /> Explore Calendar
                        </Button>
                      </div>
                    </Card>

                    <Card className="bg-rose-300 p-6 flex flex-col h-full">
                      <h3 className="text-lg font-bold mb-2">Earnings</h3>
                      <p className="mb-4 flex-grow">Check your earnings on your humane efforts</p>
                      <div className="mt-auto">
                        <Button variant="special" onClick={handleExploreEarnings} className="flex items-center">
                          <FaMoneyBillWave className="mr-2" /> Explore Earnings
                        </Button>
                      </div>
                    </Card>

                    <Card className="bg-rose-300 p-6 flex flex-col h-full">
                      <h3 className="text-lg font-bold mb-2">Write a Blog Post</h3>
                      <p className="mb-4 flex-grow">Share your experience with the community</p>
                      <div className="mt-auto">
                        <Button variant="special" onClick={handleCreateBlog} className="flex items-center">
                          <FaPenNib className="mr-2" /> Start Writing
                        </Button>
                      </div>
                    </Card>
                  </section>
                </div>
                  </Container>              
            </div>
            </div>
        </div>
      </div>
    </div> 
  );
};


export default CounsellorDashboard;
