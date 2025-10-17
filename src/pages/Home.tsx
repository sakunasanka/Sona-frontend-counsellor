import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Heart,
  Shield,
  Users,
  Calendar,
  FileText,
  BarChart3,
  MessageSquare,
  Star,
  Phone,
  Mail,
  MapPin,
  Send,
  Clock,
  Globe
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Container from '../components/ui/Container';

function Home() {
  const navigate = useNavigate();
  const [showAuthFocus, setShowAuthFocus] = useState(false);
  const [isVideoTransitioning, setIsVideoTransitioning] = useState(false);

  // Scroll to top on component mount (page load/reload)
  useEffect(() => {
    window.scrollTo(0, 0);
    // Also reset scroll restoration behavior
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  // Add scroll event listener to reset zoom effect when scrolling
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // If user is scrolling down and zoom is active, reset it
      if (currentScrollY > lastScrollY && showAuthFocus) {
        setShowAuthFocus(false);
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showAuthFocus]);

  const handleSignIn = () => {
    // Hide focus effect when user clicks sign in
    setShowAuthFocus(false);
    // Navigate to sign in selection page
    navigate('/signin-options');
  };

  const handleSignUp = () => {
    // Hide focus effect when user clicks sign up
    setShowAuthFocus(false);
    // Navigate to sign up page 
    navigate('/signup');
  };

  const handleLearnMore = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleGetStartedToday = () => {
    navigate('/general-user-signin');
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 z-50 transition-all duration-300">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:pl-16 lg:pr-6">
          <div className="flex items-center h-14 sm:h-16">
            {/* Logo - Left Corner aligned with content below */}
            <div className="flex items-center flex-shrink-0">
              <img 
                src="/assets/images/Sona-logo.png" 
                alt="Sona Logo" 
                className="h-6 sm:h-8 w-auto transition-transform duration-300 hover:scale-105"
              />
            </div>
            
            {/* Spacer to push navigation to the right */}
            <div className="flex-1"></div>
            
            {/* Navigation Links and Button - Desktop */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              <a href="#features" className="text-gray-600 hover:text-pink-500 transition-all duration-300 font-medium relative group text-sm xl:text-base">
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#about" className="text-gray-600 hover:text-pink-500 transition-all duration-300 font-medium relative group text-sm xl:text-base">
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#contact" className="text-gray-600 hover:text-pink-500 transition-all duration-300 font-medium relative group text-sm xl:text-base">
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <Button 
                variant="special" 
                onClick={handleSignIn}
                className="px-4 xl:px-6 py-2 text-sm font-medium transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Get Started
              </Button>
            </div>

            {/* Mobile Get Started Button */}
            <div className="lg:hidden">
              <Button 
                variant="special" 
                onClick={handleSignIn}
                className="px-4 py-2 text-sm font-medium transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen relative flex items-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full">
            <video
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster="/assets/images/hero-dashboard-preview.webp"
              onTimeUpdate={(e) => {
                const video = e.target as HTMLVideoElement;
                const duration = video.duration;
                const currentTime = video.currentTime;
                
                // Trigger transition effect near the end of the video (last 0.5 seconds)
                if (duration - currentTime <= 0.5 && duration - currentTime > 0.1 && !isVideoTransitioning) {
                  setIsVideoTransitioning(true);
                  const overlay = document.getElementById('video-transition-overlay');
                  if (overlay) {
                    overlay.classList.add('video-loop-transition');
                    // Remove the class after animation completes and reset state
                    setTimeout(() => {
                      overlay.classList.remove('video-loop-transition');
                      setIsVideoTransitioning(false);
                    }, 1500);
                  }
                }
              }}
              onEnded={() => {
                // Also trigger on video end event as a backup
                if (!isVideoTransitioning) {
                  setIsVideoTransitioning(true);
                  const overlay = document.getElementById('video-transition-overlay');
                  if (overlay) {
                    overlay.classList.add('video-loop-transition');
                    setTimeout(() => {
                      overlay.classList.remove('video-loop-transition');
                      setIsVideoTransitioning(false);
                    }, 1500);
                  }
                }
              }}
            >
              <source src="/assets/videos/healthcare-background.mp4" type="video/mp4" />
              {/* Fallback for browsers that don't support video */}
              <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white"></div>
            </video>
            
            {/* Transition overlay that masks the video loop */}
            <div 
              id="video-transition-overlay"
              className="absolute inset-0 pointer-events-none opacity-0 z-10"
            ></div>
            
            {/* White tint overlay for better text readability */}
            <div className="absolute inset-0 bg-secondary/90"></div>
            
            {/* Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40"></div>
            
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          </div>
        </div>

        <div className="relative z-10 w-full h-full flex items-center lg:justify-start justify-center">
          <div className="w-full px-4 sm:px-6 md:px-8 lg:pl-16 lg:pr-16 pt-6 sm:pt-8 pb-12 sm:pb-16 flex items-center lg:justify-start justify-center min-h-screen">
            <div className="w-full animate-fade-in-up lg:text-left text-center">
              {/* Left Side - Main Content */}
              <div className="space-y-4 sm:space-y-6 md:space-y-8 max-w-5xl mt-14 sm:mt-16 md:mt-20 lg:mx-0 mx-auto">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-semi-bold text-white leading-tight tracking-tight drop-shadow-lg">
                  Wellness starts with a
                </h1>
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-6xl xl:text-8xl font-bold leading-tight tracking-tight drop-shadow-lg">
                  <span
                    className="inline-block animate-gradient bg-clip-text text-transparent"
                    style={{ 
                      background: 'linear-gradient(-45deg, #FFE2EA, #A1BEE3, #FF978A, #B4A7F5, #FFE2EA)',
                      backgroundSize: '400% 400%',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    Conversation
                  </span>
                </h1>
                <p className="hidden lg:block text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/90 leading-relaxed max-w-4xl">
                  Whether you're seeking support, providing care, or managing your practice,
                  <span className="block mt-1 sm:mt-2">Sona connects everyone in mental health :)</span>
                </p>

                {/* Auth Panel - Desktop/Tablet */}
                <div className={`hidden lg:block space-y-6 max-w-3xl transition-all duration-500 transform-gpu ${
                  showAuthFocus ? 'scale-110 translate-x-4 lg:translate-x-8' : 'scale-100 translate-x-0'
                }`} style={{ transformOrigin: 'left center' }}>
                  {/* Welcome message */}
                  <div className={`text-white/90 text-lg font-medium transition-all duration-300 ${
                    showAuthFocus ? 'animate-pulse text-white font-semibold' : ''
                  }`}>
                    Join our mental health community
                  </div>
                  
                  {/* Sign In and Sign Up Buttons - Same Line */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <Button 
                      variant="special"
                      onClick={handleSignIn}
                      className="w-full sm:w-auto px-8 py-3 h-12 text-base font-medium transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex-shrink-0 rounded-lg"
                    >
                      Sign In
                    </Button>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                      <span className={`text-white/80 text-base transition-all duration-300 flex-shrink-0 ${
                        showAuthFocus ? 'animate-pulse font-semibold text-white' : ''
                      }`}>
                        New here?
                      </span>
                      <Button 
                        variant="border"
                        onClick={handleSignUp}
                        className="w-full sm:w-auto px-8 py-3 h-12 text-base font-medium border border-white/40 text-white hover:bg-white hover:text-gray-900 transition-all duration-300 flex-shrink-0 rounded-lg"
                      >
                        Join with us!
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Auth Controls - Show only on mobile and tablet */}
              <div className="lg:hidden flex justify-center mt-8">
                <div className="w-full max-w-sm space-y-6">
                  {/* Welcome message for mobile */}
                  <div className={`text-white/90 text-lg font-medium text-center transition-all duration-300 ${
                    showAuthFocus ? 'animate-pulse text-white font-semibold' : ''
                  }`}>
                    Join our community
                  </div>
                  
                  <div className="flex flex-col space-y-6">
                    <Button 
                      variant="special"
                      onClick={handleSignIn}
                      className="w-full px-6 py-3 h-12 text-base font-medium shadow-lg transition-all duration-300 rounded-lg"
                    >
                      Sign In
                    </Button>
                    
                    {/* Not a member section for mobile */}
                    <div className="flex flex-col space-y-4">
                      <span className={`text-white/80 text-base transition-all duration-300 text-center ${
                        showAuthFocus ? 'animate-pulse font-semibold text-white' : ''
                      }`}>
                        New here?
                      </span>
                      <Button 
                        variant="border"
                        onClick={handleSignUp}
                        className="w-full px-6 py-3 h-12 text-base font-medium border border-white/40 text-white hover:bg-white hover:text-gray-900 transition-all duration-300 rounded-lg"
                      >
                        Join with us!
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 sm:py-16 md:py-20 border-b border-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-white to-gray-50"></div>
        <Container>
          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <div className="text-center group hover:scale-105 transition-all duration-300">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 sm:mb-3">5K+</div>
              <div className="text-gray-600 font-medium text-xs sm:text-sm md:text-base leading-tight">Mental Health Professionals</div>
              <div className="w-8 sm:w-10 md:w-12 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-2 sm:mt-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="text-center group hover:scale-105 transition-all duration-300">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 sm:mb-3">50K+</div>
              <div className="text-gray-600 font-medium text-xs sm:text-sm md:text-base leading-tight">Clients Supported</div>
              <div className="w-8 sm:w-10 md:w-12 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-2 sm:mt-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="text-center group hover:scale-105 transition-all duration-300">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 sm:mb-3">98%</div>
              <div className="text-gray-600 font-medium text-xs sm:text-sm md:text-base leading-tight">User Satisfaction</div>
              <div className="w-8 sm:w-10 md:w-12 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-2 sm:mt-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="text-center group hover:scale-105 transition-all duration-300">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 sm:mb-3">24/7</div>
              <div className="text-gray-600 font-medium text-xs sm:text-sm md:text-base leading-tight">Support Available</div>
              <div className="w-8 sm:w-10 md:w-12 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-2 sm:mt-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
          
        </Container>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden animate-gradient">
        <Container className="relative z-10">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 tracking-tight drop-shadow-lg">
              Everything You Need for<br />
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Better Mental Health Care</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-lg px-4">
              Whether you're seeking support, providing therapy, or managing your practice - 
              our platform connects clients with the right professionals and gives providers the tools they need.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <Card className="p-6 md:p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-white/90 backdrop-blur-md group shadow-xl hover:shadow-3xl">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-pink-100 to-pink-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Calendar className="h-7 w-7 md:h-8 md:w-8 text-primary" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Easy Scheduling</h3>
              <p className="text-base text-gray-700 leading-relaxed mb-6">
                Book appointments with mental health professionals, manage your schedule, 
                and receive automated reminders - all in one place.
              </p>
              <div className="w-8 h-1 bg-gradient-to-r from-primary to-secondary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Card>

            <Card className="p-6 md:p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-white/90 backdrop-blur-md group shadow-xl hover:shadow-3xl">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FileText className="h-7 w-7 md:h-8 md:w-8 text-green-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Secure Records</h3>
              <p className="text-base text-gray-700 leading-relaxed mb-6">
                Access your treatment history, session notes, and progress tracking 
                with complete privacy and HIPAA compliance.
              </p>
              <div className="w-8 h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Card>

            <Card className="p-6 md:p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-white/90 backdrop-blur-md group shadow-xl hover:shadow-3xl">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <BarChart3 className="h-7 w-7 md:h-8 md:w-8 text-purple-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Progress Tracking</h3>
              <p className="text-base text-gray-700 leading-relaxed mb-6">
                Monitor your mental health journey with visual progress reports, 
                mood tracking, and goal achievement insights.
              </p>
              <div className="w-8 h-1 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Card>

            <Card className="p-6 md:p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-white/90 backdrop-blur-md group shadow-xl hover:shadow-3xl">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <MessageSquare className="h-7 w-7 md:h-8 md:w-8 text-orange-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Safe Communication</h3>
              <p className="text-base text-gray-700 leading-relaxed mb-6">
                Connect with your therapist or clients through secure messaging, 
                video calls, and crisis support channels.
              </p>
              <div className="w-8 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Card>

            <Card className="p-6 md:p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-white/90 backdrop-blur-md group shadow-xl hover:shadow-3xl">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-red-100 to-red-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Shield className="h-7 w-7 md:h-8 md:w-8 text-red-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Privacy & Security</h3>
              <p className="text-base text-gray-700 leading-relaxed mb-6">
                Your mental health information is protected with enterprise-grade security, 
                end-to-end encryption, and strict privacy controls.
              </p>
              <div className="w-8 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Card>

            <Card className="p-6 md:p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-white/90 backdrop-blur-md group shadow-xl hover:shadow-3xl">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Users className="h-7 w-7 md:h-8 md:w-8 text-blue-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Care Team Connection</h3>
              <p className="text-base text-gray-700 leading-relaxed mb-6">
                Seamlessly connect with your entire care team including counselors, 
                psychiatrists, and support specialists for comprehensive care.
              </p>
              <div className="w-8 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Card>
          </div>
        </Container>
      </section>

      {/* About Section */}
      <section id="about" className="bg-white py-12 sm:py-16 md:py-20 lg:py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                Connecting Mental Health Care for Everyone
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                Sona brings together clients seeking support, counselors providing therapy, and psychiatrists 
                offering specialized care. Our platform bridges the gap between those who need help and those 
                who provide it, creating a comprehensive mental health ecosystem.
              </p>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-3">
                  <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-red-500 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-700">Client-centered care approach</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-700">Evidence-based treatment options</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-700">Complete privacy and security</span>
                </div>
              </div>
            </div>

            <div className="relative order-1 lg:order-2">
              <img
                src="https://images.pexels.com/photos/7176026/pexels-photo-7176026.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Mental health team collaboration"
                className="rounded-2xl shadow-xl w-full h-auto"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-12 sm:py-16 md:py-20 lg:py-24">
        <Container>
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Trusted by Our Mental Health Community
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
              See what clients and professionals say about their experience with Sona
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <Card className="p-6 md:p-8">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-base text-gray-700 mb-6 leading-relaxed">
                "Finding the right therapist through Sona was so easy. The secure messaging 
                and appointment scheduling made getting help feel less overwhelming."
              </p>
              <div className="flex items-center">
                <img
                  src="https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=150"
                  alt="Hasini Chandradasa"
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <div className="font-semibold text-gray-900 text-base">Sameera Silva</div>
                  <div className="text-gray-600 text-sm">Client</div>
                </div>
              </div>
            </Card>

            <Card className="p-6 md:p-8">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-base text-gray-700 mb-6 leading-relaxed">
                "The security features and HIPAA compliance give me complete peace of mind.
                My patients love the seamless appointment scheduling."
              </p>
              <div className="flex items-center mt-12">
                <img
                  src="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=150"
                  alt="Dr. Michael Chen"
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <div className="font-semibold text-gray-900 text-base">Dr. Sarath Kothalawala</div>
                  <div className="text-gray-600 text-sm">Psychiatrist</div>
                </div>
              </div>
            </Card>

            <Card className="p-6 md:p-8 md:col-span-2 lg:col-span-1">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-base text-gray-700 mb-6 leading-relaxed">
                "The platform makes it easy to track patient progress and collaborate with other 
                professionals. My clients love the convenience and security it provides."
              </p>
              <div className="flex items-center">
                <img
                  src="https://images.pexels.com/photos/5327647/pexels-photo-5327647.jpeg?auto=compress&cs=tinysrgb&w=150"
                  alt="Dr. Emily Rodriguez"
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <div className="font-semibold text-gray-900 text-base">Dr. Harindu Ranasinghe</div>
                  <div className="text-gray-600 text-sm">Licensed Counselor</div>
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-secondary py-12 sm:py-16 md:py-20 lg:py-24">
        <Container>
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Ready to Start Your Mental Health Journey?
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white opacity-90 mb-6 sm:mb-8 md:mb-10 leading-relaxed max-w-3xl mx-auto">
              Join thousands of people who have found support, connection, and healing through 
              our mental health platform. Whether you're seeking help or providing care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md sm:max-w-none mx-auto">
              <Button 
                variant="secondary"
                onClick={handleGetStartedToday}
                className="bg-white text-primary px-6 py-2 text-base font-medium hover:bg-gray-800 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Get Started Today
              </Button>
              <Button 
                variant="border"
                onClick={handleLearnMore}
                className="border-2 border-white text-white px-6 py-2 text-base font-medium hover:bg-white hover:text-primary transition-all duration-300"
              >
                Learn More
              </Button>
            </div>
            <p className="text-white opacity-75 mt-4 sm:mt-6 text-xs sm:text-sm">
              Free to join • Secure & private • Available 24/7
            </p>
          </div>
        </Container>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-white py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-secondary/20 to-primary/20 rounded-full blur-2xl"></div>
        </div>
        
        <Container className="relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Get in Touch
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Ready to transform mental health care? We'd love to hear from you. Reach out and let's start a conversation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Side - Contact Information */}
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                {/* Phone */}
                <Card className="p-6 hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-indigo-50 group">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Call Us</h3>
                      <p className="text-gray-600">(011) 222 7 222</p>
                      <p className="text-sm text-gray-500">Mon-Fri 9AM-6PM</p>
                    </div>
                  </div>
                </Card>

                {/* Email */}
                <Card className="p-6 hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-emerald-50 group">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Email Us</h3>
                      <p className="text-gray-600">support@sona.org.lk</p>
                      <p className="text-sm text-gray-500">24/7 Response</p>
                    </div>
                  </div>
                </Card>

                {/* Location */}
                <Card className="p-6 hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-pink-50 group sm:col-span-2 lg:col-span-1">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Visit Us</h3>
                      <p className="text-gray-600">Colombo, Sri Lanka</p>
                      <p className="text-sm text-gray-500">By appointment only</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Additional Info */}
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Why Contact Us?</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                    <span className="text-sm">Partnership opportunities for healthcare organizations</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-2 h-2 bg-secondary rounded-full flex-shrink-0"></div>
                    <span className="text-sm">Professional licensing and verification support</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                    <span className="text-sm">Technical support and platform assistance</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-2 h-2 bg-secondary rounded-full flex-shrink-0"></div>
                    <span className="text-sm">Media inquiries and press relations</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div>
              <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                        placeholder="First"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                        placeholder="Last"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                      placeholder="me@hello.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200">
                      <option value="">Choose a topic</option>
                      <option value="partnership">Partnership Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="licensing">Professional Licensing</option>
                      <option value="media">Media Inquiry</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="Tell us more about your inquiry..."
                    ></textarea>
                  </div>

                  <Button 
                    variant="special" 
                    className="w-full py-3 px-6 text-base font-medium transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Send Message
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>We typically respond within 24 hours</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Globe className="h-6 w-6" />
                <h3 className="text-xl font-semibold">Join Our Global Community</h3>
              </div>
              <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                Be part of the revolution in mental health care. Connect with professionals and clients worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="secondary"
                  onClick={handleGetStartedToday}
                  className="bg-white text-primary px-6 py-3 font-medium hover:bg-gray-100 transition-all duration-300"
                >
                  Get Started Today
                </Button>
                <Button 
                  variant="border"
                  onClick={() => navigate('/signin-options')}
                  className="border-2 border-white text-white px-6 py-3 font-medium hover:bg-white hover:text-primary transition-all duration-300"
                >
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12 md:py-16">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="mb-4 mt-1">
                <img 
                  src="/assets/images/Sona-logo-light.png" 
                  alt="Sona Logo" 
                  className="h-6 sm:h-8 w-auto"
                />
              </div>
            </div>

            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Product</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-gray-400 text-sm sm:text-base">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Support</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-gray-400 text-sm sm:text-base">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Training</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contact</h4>
              <ul className="space-y-2 sm:space-y-3 text-gray-400 text-sm sm:text-base">
                <li className="flex items-center space-x-2 sm:space-x-3">
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>(011) 222 7 222</span>
                </li>
                <li className="flex items-center space-x-2 sm:space-x-3">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>support@sona.org.lk</span>
                </li>
                <li className="flex items-center space-x-2 sm:space-x-3">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>Colombo, LK</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-xs sm:text-sm text-center md:text-left">
              © 2025 Sona. All rights reserved.
            </p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 md:space-x-6 text-center">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">HIPAA Compliance</a>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}

export default Home;