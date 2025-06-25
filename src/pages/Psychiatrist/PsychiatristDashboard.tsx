import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavBar , SidebarForPsy } from "../../components/layout";  
import Container from "../../components/ui/Container";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { FaCalendarAlt, FaCamera, FaMeetup, FaMoneyBillWave, FaPen, FaPenNib } from "react-icons/fa";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

const PsychiatristDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleFeature = () => navigate("/signin");

  

  const sessions = [
    {
      name: "Mr. Romio Jayaweera",
      date: "June 20 | 7.00 PM",
      identity: "Active",
      status: true,
    },
    {
      name: "Ms. Malika Fernando",
      date: "June 13 | 4.00 PM",
      identity: "Active",
      status: true,
    },
    {
      name: "Mr. Chamara Perera",
      date: "June 13 | 4.00 PM",
      identity: "Inactive",
      status: false,
    },
    {
      name: "Ms. Rosara Fuger",
      date: "June 13 | 4.00 PM",
      identity: "Inactive",
      status: false,
    },
    {
      name: "Mr. Nalantha Silva",
      date: "June 13 | 4.00 PM",
      identity: "Active",
      status: true,
    },
  ];

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
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
      <div className="w-64 bg-white border-r">
          <SidebarForPsy isOpen={sidebarOpen} onClose={closeSidebar}/>
      </div>

      {/* Main Content */}
        <div className="flex-grow overflow-auto p-6">
            <div className="min-h-screen min-w-screen bg-pink-100 rounded-xl relative overflow-hidden"
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

                {/* Recent Prescriptions */}
                <section className="mb-10">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Prescriptions</h2>
                    <div ref={sliderRef} className="keen-slider overflow-hidden">
                      {sessions.map((session, idx) => (
                        <div key={idx} className="keen-slider__slide">
                          <Card className="bg-pink-300 p-4 h-full">
                            <h3 className="text-lg font-semibold">{session.name}</h3>
                            <p className="text-sm">{session.date}</p>
                            <p className="text-xs text-gray-600 mt-2">
                              Status: {session.identity} {session.status ? "✅" : "❌"}
                            </p>
                            <Button
                              variant="special"
                              onClick={handleFeature} className="mt-6"
                            >
                              View Details
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
                      <Card className="bg-primaryLight  p-6">
                        <h3 className="text-lg font-bold mb-2">Video Sessions</h3>
                        <p className="mb-4">View previous video sessions</p>
                        <Button variant="special" onClick={handleFeature} className="flex items-center">
                          <FaCamera className="mr-2" /> Explore Video Sessions
                        </Button>
                      </Card>

                      <Card className="bg-primaryLight p-6">
                        <h3 className="text-lg font-bold mb-2">Earnings</h3>
                        <p className="mb-4">Check your earnings on your humane efforts</p>
                        <Button variant="special" onClick={handleFeature} className="flex items-center">
                          <FaMoneyBillWave className="mr-2" /> Explore Earnings
                        </Button>
                      </Card>

                      <Card className="bg-primaryLight p-6">
                        <h3 className="text-lg font-bold mb-2">View Issued Prescriptions</h3>
                        <p className="mb-4">Monitor all the prescriptions issued by you</p>
                        <Button variant="special" onClick={handleFeature} className="flex items-center">
                          <FaPen className="mr-2" /> Explore Prescriptions
                        </Button>
                      </Card>
                    </section>
                  </Container>
              
            </div>
        </div>
      </div>
    </div> 
  );
}

export default PsychiatristDashboard