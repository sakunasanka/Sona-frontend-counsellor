import { useNavigate } from 'react-router-dom';
import { Smartphone, Star, Shield, Heart, Users, ArrowLeft, Calendar } from 'lucide-react';
import Button from '../../components/ui/Button';

function GeneralUserSignIn() {
  const navigate = useNavigate();

  const handleAppStoreClick = () => {
    // For demo purposes, you can replace these with actual app store links
    window.open('https://apps.apple.com/app/sona-mental-health', '_blank');
  };

  const handlePlayStoreClick = () => {
    // For demo purposes, you can replace these with actual play store links
    window.open('https://play.google.com/store/apps/details?id=com.sona.mentalhealth', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-400/20 to-yellow-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 z-50 transition-all duration-300">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:pl-16 lg:pr-6">
          <div className="flex items-center h-14 sm:h-16">
            {/* Logo - Left Corner aligned with Home page */}
            <div className="flex items-center flex-shrink-0">
              <img 
                src="/assets/images/Sona-logo.png" 
                alt="Sona Logo" 
                className="h-6 sm:h-8 w-auto transition-transform duration-300 hover:scale-105"
              />
            </div>
            
            {/* Spacer to push back button to the right */}
            <div className="flex-1"></div>
            
            {/* Back to Home Button */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Home</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 pt-20 sm:pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - Content */}
            <div className="text-center lg:text-left space-y-8">
              {/* Hero Section */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                  <Smartphone className="w-4 h-4" />
                  Mobile App Available
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Get the{' '}
                  <span className="bg-gradient-to-r from-[#FF978A] via-[#B19FE8] via-[#B19FE8] to-[#A1BEE3] bg-clip-text text-transparent drop-shadow-md">
                    Sona
                  </span>
                  <br />
                  <span className="block">App</span>
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Access mental health support on the go. Connect with professionals, 
                  track your wellness journey, and get the care you deserve - all from your mobile device.
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto lg:mx-0">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium">Secure & Private</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium">24/7 Support</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium">Expert Care</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Star className="w-4 h-4 text-yellow-600" />
                  </div>
                  <span className="text-sm font-medium">5-Star Rated</span>
                </div>
              </div>

              {/* Download Buttons */}
              <div className="space-y-4">
                <p className="text-lg font-semibold text-gray-900">Download the app today:</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  {/* App Store Button */}
                  <button
                    onClick={handleAppStoreClick}
                    className="group flex items-center gap-3 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <div className="w-8 h-8 flex-shrink-0">
                      <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
                        <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="text-xs text-gray-300">Download on the</div>
                      <div className="text-lg font-semibold leading-tight">App Store</div>
                    </div>
                  </button>

                  {/* Google Play Button */}
                  <button
                    onClick={handlePlayStoreClick}
                    className="group flex items-center gap-3 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <div className="w-8 h-8 flex-shrink-0">
                      <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
                        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="text-xs text-gray-300">Get it on</div>
                      <div className="text-lg font-semibold leading-tight">Google Play</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Why choose the Sona mobile app?</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">Book appointments with certified mental health professionals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">Track your mood and wellness journey with personalized insights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">Access guided meditations and mental health resources</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">Secure messaging with your healthcare providers</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column - Phone Mockup */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Phone frame */}
                <div className="relative w-80 h-[600px] bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
                  <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                    {/* Phone notch */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-36 h-6 bg-gray-900 rounded-b-2xl z-10"></div>
                    
                    {/* Screen content */}
                    <div className="relative h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
                      {/* App header */}
                      <div className="pt-8 pb-4 px-6">
                        <div className="flex items-center justify-between">
                          <img 
                            src="/assets/images/Sona-logo.png" 
                            alt="Sona Logo" 
                            className="h-6 w-auto"
                          />
                          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        </div>
                      </div>
                      
                      {/* Welcome section */}
                      <div className="px-6 py-4">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Welcome back!</h2>
                        <p className="text-sm text-gray-600">How are you feeling today?</p>
                      </div>
                      
                      {/* Quick actions */}
                      <div className="px-6 py-4 space-y-3">
                        <div className="bg-white rounded-2xl p-4 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Calendar className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">Next Session</div>
                              <div className="text-xs text-gray-500">Today at 2:00 PM</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-2xl p-4 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <Heart className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">Daily Check-in</div>
                              <div className="text-xs text-gray-500">Log your mood</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-2xl p-4 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">Support Groups</div>
                              <div className="text-xs text-gray-500">Join community</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Bottom navigation */}
                      <div className="mt-auto bg-white border-t border-gray-200 p-4">
                        <div className="flex justify-around">
                          <div className="w-6 h-6 bg-blue-500 rounded"></div>
                          <div className="w-6 h-6 bg-gray-300 rounded"></div>
                          <div className="w-6 h-6 bg-gray-300 rounded"></div>
                          <div className="w-6 h-6 bg-gray-300 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Available on iOS 12.0+ and Android 8.0+
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">4.8/5 rating with 50K+ downloads</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GeneralUserSignIn;
