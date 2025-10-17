import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, UserCheck, Stethoscope, Smartphone, Heart, Calendar, Shield } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

function SignUpOptions() {
  const navigate = useNavigate();

  const handleProfessionalSignUp = () => {
    navigate('/signup-professional');
  };

  const handleGeneralUserSignUp = () => {
    navigate('/general-user-signin');
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
        <div className="max-w-4xl mx-auto w-full">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Join{' '}
              <span className="bg-gradient-to-r from-[#FF978A] via-[#B19FE8] to-[#A1BEE3] bg-clip-text text-transparent">
                Sona
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Start your journey with us. Choose the option that best describes you to create your account.
            </p>
          </div>

          {/* Sign Up Options */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* General User Option */}
            <div className="cursor-pointer" onClick={handleGeneralUserSignUp}>
              <Card className="p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/90 backdrop-blur-md group">
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <User className="h-12 w-12 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">I need support</h3>
                    <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                      I'm looking for mental health support and want to connect with professionals who can help me on my wellness journey.
                    </p>
                  </div>
                  
                  {/* Features for general users */}
                  <div className="space-y-3 text-left">
                    <div className="flex items-center gap-3 text-gray-700">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm">Book appointments with certified professionals</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Heart className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-sm">Track your mood and wellness journey</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Shield className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="text-sm">Access secure messaging and resources</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 text-blue-600 font-medium">
                    <Smartphone className="w-4 h-4" />
                    <span>Download our mobile app to get started</span>
                  </div>
                  
                  <Button 
                    variant="special" 
                    className="w-full py-4 text-lg transform group-hover:scale-105 transition-all duration-300"
                  >
                    Get Started as Client
                  </Button>
                </div>
              </Card>
            </div>

            {/* Professional Option */}
            <div className="cursor-pointer" onClick={handleProfessionalSignUp}>
              <Card className="p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/90 backdrop-blur-md group">
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-green-100 to-green-200 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <UserCheck className="h-12 w-12 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">I provide care</h3>
                    <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                      I'm a mental health professional who wants to help clients and manage my practice through Sona's platform.
                    </p>
                  </div>
                  
                  {/* Features for professionals */}
                  <div className="space-y-3 text-left">
                    <div className="flex items-center gap-3 text-gray-700">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <UserCheck className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-sm">Manage clients and appointments</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Stethoscope className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="text-sm">Access professional dashboard tools</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Shield className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm">HIPAA-compliant secure platform</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
                    <UserCheck className="w-4 h-4" />
                    <span>Professional verification required</span>
                  </div>
                  
                  <Button 
                    variant="special" 
                    className="w-full py-4 text-lg transform group-hover:scale-105 transition-all duration-300"
                  >
                    Join as Professional
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Already have an account?
            </p>
            <Button 
              variant="border" 
              onClick={() => navigate('/signin-options')}
              className="px-8 py-3 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300"
            >
              Sign In Instead
            </Button>
          </div>

          {/* Security Notice */}
          <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 mt-12 max-w-2xl mx-auto">
            <h4 className="text-lg font-semibold text-gray-900 mb-3 text-center">Your Privacy & Security</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-sm text-gray-600">HIPAA Compliant</div>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
                <div className="text-sm text-gray-600">End-to-End Encryption</div>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                </div>
                <div className="text-sm text-gray-600">Secure Authentication</div>
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
              Join over 50,000 users in our mental health community
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpOptions;