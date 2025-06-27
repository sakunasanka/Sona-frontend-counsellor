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

  const handleFeature = () => navigate("/signin");


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

  const [sliderRef] = useKeenSlider<HTMLDivElement>({
  slides: {
    perView: 3,
    spacing: 16,
  },
  loop: false,
  slideChanged(s) {
    setCurrentSlide(s.track.details.rel);
  },
  });

  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = Math.ceil(sessions.length / 3) + 1;

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
            <div className="min-h-[calc(100vh-8rem)] w-full bg-pink-100 rounded-xl relative overflow-hidden"
                style={{
                  backgroundImage: `
                    url('../../../public/assets/images/bg-trans.jpg'), 
                    linear-gradient(rgba(255, 192, 203, 0.7), rgba(255, 192, 203, 0.1))
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
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Sessions</h2>
                    <div ref={sliderRef} className="keen-slider overflow-hidden">
                      {sessions.map((session, idx) => (
                        <div key={idx} className="keen-slider__slide">
                          <Card className="bg-pink-100 p-4 h-full">
                            <h3 className="text-lg font-semibold">{session.name}</h3>
                            <p className="text-sm">{session.date}</p>
                            <p className="text-xs text-gray-600 mt-2">
                              Identity: {session.identity} {session.verified ? "✅" : "⚠️"}
                            </p>
                            <Button
                              variant="special"
                              onClick={() => navigate("/counsellor-sessions")}
                              className="mt-6"
                            >
                              Explore Session
                            </Button>
                          </Card>
                        </div>
                      ))}
                      </div>

                      {/* Slider Dots */}
                      <div className="flex justify-center mt-4 space-x-2">
                        {Array.from({ length: totalSlides }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 rounded-full ${
                              i === currentSlide ? 'bg-gray-800' : 'bg-gray-400'
                            }`}
                          ></div>
                        ))}
                      </div>
                    </section>

                    {/* Functional Cards */}
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Browse Features</h2>
                    <section className="grid md:grid-cols-3 gap-6">
                      <Card className="bg-rose-300  p-6">
                        <h3 className="text-lg font-bold mb-2">Working Schedule</h3>
                        <p className="mb-4">Work on demand & set your availability on your terms!</p>
                        <Button variant="special" onClick={handleFeature} className="flex items-center">
                          <FaCalendarAlt className="mr-2" /> Explore Calendar
                        </Button>
                      </Card>

                      <Card className="bg-rose-300  p-6">
                        <h3 className="text-lg font-bold mb-2">Earnings</h3>
                        <p className="mb-4">Check your earnings on your humane efforts</p>
                        <Button variant="special" onClick={handleFeature} className="flex items-center">
                          <FaMoneyBillWave className="mr-2" /> Explore Earnings
                        </Button>
                      </Card>

                      <Card className="bg-rose-300  p-6">
                        <h3 className="text-lg font-bold mb-2">Write a Blog Post</h3>
                        <p className="mb-4">Share your experience with the community</p>
                        <Button variant="special" onClick={() => navigate("/counsellor/create-blog")} className="flex items-center">
                          <FaPenNib className="mr-2" /> Start Writing
                        </Button>
                      </Card>
                    </section>
                  </Container>
              
            </div>
            </div>
        </div>
      </div>
    </div> 
  );
};


export default CounsellorDashboard;
