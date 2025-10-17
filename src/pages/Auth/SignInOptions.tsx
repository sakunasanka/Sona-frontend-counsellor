import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, UserCheck, Stethoscope, Smartphone } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

function SignInOptions() {
  const navigate = useNavigate();

  const handleProfessionalSignIn = (role: 'counsellor' | 'psychiatrist') => {
    navigate('/signin', { state: { selectedRole: role } });
  };

  const handleGeneralUserSignIn = () => {
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
              Welcome to{' '}
              <span className="bg-gradient-to-r from-[#FF978A] via-[#B19FE8] to-[#A1BEE3] bg-clip-text text-transparent">
                Sona
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Choose how you'd like to sign in to access your personalized mental health journey
            </p>
          </div>

          {/* Sign In Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* General User Option */}
            <div className="cursor-pointer" onClick={handleGeneralUserSignIn}>
              <Card className="p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/90 backdrop-blur-md group">
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <User className="h-10 w-10 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">I'm seeking support</h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      Access our mobile app to connect with mental health professionals, track your wellness, and get the support you need.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-blue-600 font-medium">
                    <Smartphone className="w-4 h-4" />
                    <span>Mobile App Access</span>
                  </div>
                  <Button 
                    variant="special" 
                    className="w-full py-3 transform group-hover:scale-105 transition-all duration-300"
                  >
                    Continue as Client
                  </Button>
                </div>
              </Card>
            </div>

            {/* Counsellor Option */}
            <div className="cursor-pointer" onClick={() => handleProfessionalSignIn('counsellor')}>
              <Card className="p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/90 backdrop-blur-md group">
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-green-200 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <UserCheck className="h-10 w-10 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">I'm a Counsellor</h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      Access your professional dashboard to manage clients, sessions, and track your practice growth.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
                    <UserCheck className="w-4 h-4" />
                    <span>Professional Portal</span>
                  </div>
                  <Button 
                    variant="special" 
                    className="w-full py-3 transform group-hover:scale-105 transition-all duration-300"
                  >
                    Continue as Counsellor
                  </Button>
                </div>
              </Card>
            </div>

            {/* Psychiatrist Option */}
            <div className="cursor-pointer" onClick={() => handleProfessionalSignIn('psychiatrist')}>
              <Card className="p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/90 backdrop-blur-md group">
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-purple-200 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Stethoscope className="h-10 w-10 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">I'm a Psychiatrist</h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      Access your medical portal to manage patients, prescriptions, and collaborate with care teams.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-purple-600 font-medium">
                    <Stethoscope className="w-4 h-4" />
                    <span>Medical Portal</span>
                  </div>
                  <Button 
                    variant="special" 
                    className="w-full py-3 transform group-hover:scale-105 transition-all duration-300"
                  >
                    Continue as Psychiatrist
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Don't have an account yet?
            </p>
            <Button 
              variant="border" 
              onClick={() => navigate('/signup')}
              className="px-8 py-3 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300"
            >
              Create New Account
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
              Trusted by over 50,000 users worldwide
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInOptions;