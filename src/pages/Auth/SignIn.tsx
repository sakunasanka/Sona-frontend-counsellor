import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Checkbox from '../../components/ui/Checkbox';

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the selected role from navigation state if available
  const passedRole = location.state?.selectedRole;
  const initialUserType = (passedRole === 'counsellor' || passedRole === 'psychiatrist') 
    ? passedRole as 'counsellor' | 'psychiatrist'
    : 'counsellor';
  
  const [userType, setUserType] = useState<'counsellor' | 'psychiatrist'>(initialUserType);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  // Letter dissolve effect states
  const [visibleLetters, setVisibleLetters] = useState({
    wellness: 0,
    startsWith: 0,
    conversation: 0
  });

  const [showConversation, setShowConversation] = useState(false);

  const texts = {
    wellness: 'Wellness',
    startsWith: 'starts with a',
    conversation: 'Conversation'
  };

  useEffect(() => {
    const dissolveText = (
      key: keyof typeof visibleLetters,
      text: string,
      startDelay: number,
      letterDelay: number = 60
    ) => {
      const timer = setTimeout(() => {
        for (let i = 0; i < text.length; i++) {
          setTimeout(() => {
            setVisibleLetters(prev => ({
              ...prev,
              [key]: i + 1
            }));
          }, i * letterDelay);
        }
      }, startDelay);

      return () => clearTimeout(timer);
    };

    // Start dissolve animations with faster, more consistent timing
    const cleanup1 = dissolveText('wellness', texts.wellness, 400, 80);
    const cleanup2 = dissolveText('startsWith', texts.startsWith, 1000, 60);
    
    // Special handling for "Conversation" - show as whole word after previous text completes
    // Calculate when "starts with a" finishes: 1000ms delay + (13 chars * 60ms) = 1780ms
    const cleanup3 = setTimeout(() => {
      setShowConversation(true);
    }, 2200); // Much longer delay for smoother, more dramatic entrance

    return () => {
      cleanup1();
      cleanup2();
      clearTimeout(cleanup3);
    };
  }, []);

  const renderTextWithDissolve = (text: string, visibleCount: number) => {
    return text.split('').map((letter, index) => (
      <span
        key={index}
        className={`inline-block transition-opacity duration-300 ease-out ${
          index < visibleCount ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          transitionDelay: `${index * 30}ms`
        }}
      >
        {letter === ' ' ? '\u00A0' : letter}
      </span>
    ));
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Please enter a valid email address';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, accept any valid email/password
      if (email && password.length >= 6) {
        if (userType === 'counsellor') {
          navigate('/counsellor-dashboard');
        } else {
          navigate('/psychiatrist-dashboard');
        }
      } else {
        setErrors({ general: 'Invalid email or password. Please try again.' });
      }
    } catch {
      setErrors({ general: 'An error occurred. Please try again later.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-rose-50 to-white px-4">
      {/* Mobile: Full screen with gradient background */}
      <div className="mobile-layout w-full min-h-screen animate-gradient flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          {/* Mobile Logo */}
          <div className="text-center mb-8">
            <img 
              src="/assets/images/Sona-logo.png" 
              alt="Sona Logo" 
              className="h-8 w-auto mx-auto mb-4 drop-shadow-lg"
            />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
            <p className="text-gray-600">Access your portal</p>
          </div>

          {/* Role Toggle - Mobile */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative bg-gray-100 rounded-full p-1 w-full max-w-sm drop-shadow-md">
              <div
                className={`absolute top-1 left-1 h-10 bg-secondary rounded-full transition-all duration-300 ease-in-out drop-shadow-md ${
                  userType === 'psychiatrist' ? 'w-1/2 transform translate-x-[calc(100%-0.5rem)]' : 'w-1/2'
                }`}
              />
              <div className="relative flex">
                <button
                  type="button"
                  className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-full transition-colors duration-300 z-10 focus:outline-none ${
                    userType === 'counsellor' ? 'text-black' : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setUserType('counsellor')}
                >
                  Counsellor
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-full transition-colors duration-300 z-10 focus:outline-none ${
                    userType === 'psychiatrist' ? 'text-black' : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setUserType('psychiatrist')}
                >
                  Psychiatrist
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSignIn} className="space-y-5">
            <div>
              <Input
                type="email"
                placeholder="you@example.com"
                label="E-Mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />{errors.email}
                </p>
              )}
            </div>
            <div>
              <Input
                type="password"
                placeholder="••••••••"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />{errors.password}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3 text-sm">
              <Checkbox
                label="Remember me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <button
                type="button"
                className="text-pink-600 hover:underline text-left"
                onClick={() => alert('Forgot password logic here')}
              >
                Forgot Password?
              </button>
            </div>

            {errors.general && (
              <p className="text-red-700 text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />{errors.general}
              </p>
            )}

            <Button 
              type="submit" 
              variant="special" 
              className="w-full py-3 font-semibold"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            New to Sona?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-pink-600 font-medium hover:underline"
            >
              Join with us
            </button>
          </p>
        </div>
      </div>

      {/* Desktop: Card layout */}
      <Card className="two-pane-desktop w-full max-w-5xl shadow-lg rounded-2xl overflow-hidden">
        {/* Left Pane - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 bg-white flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 ml-2">Welcome Back!</h2>
          <p className="text-gray-600 mb-6 ml-2">Access your portal</p>

          {/* Role Toggle */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative bg-gray-100 rounded-full p-1 w-full max-w-sm drop-shadow-md">
              <div
                className={`absolute top-1 left-1 h-10 bg-secondary rounded-full transition-all duration-300 ease-in-out drop-shadow-md ${
                  userType === 'psychiatrist' ? 'w-1/2 transform translate-x-[calc(100%-0.5rem)]' : 'w-1/2'
                }`}
              />
              <div className="relative flex">
                <button
                  type="button"
                  className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-full transition-colors duration-300 z-10 focus:outline-none ${
                    userType === 'counsellor' ? 'text-black' : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setUserType('counsellor')}
                >
                  Counsellor
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-full transition-colors duration-300 z-10 focus:outline-none ${
                    userType === 'psychiatrist' ? 'text-black' : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setUserType('psychiatrist')}
                >
                  Psychiatrist
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSignIn} className="space-y-5">
            <div>
              <Input
                type="email"
                placeholder="you@example.com"
                label="E-Mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />{errors.email}
                </p>
              )}
            </div>
            <div>
              <Input
                type="password"
                placeholder="••••••••"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />{errors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <Checkbox
                label="Remember me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <button
                type="button"
                className="text-pink-600 hover:underline"
                onClick={() => alert('Forgot password logic here')}
              >
                Forgot Password?
              </button>
            </div>

            {errors.general && (
              <p className="text-red-700 text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />{errors.general}
              </p>
            )}

            <Button 
              type="submit" 
              variant="special" 
              className="w-full py-3 font-semibold"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            New to Sona?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-pink-600 font-medium hover:underline"
            >
              Join with us
            </button>
          </p>
        </div>

        {/* Right Pane - Welcome */}
        <div className="hidden md:flex w-1/2 animate-gradient text-white items-center justify-center flex-col px-10 py-12 rounded-r-2xl overflow-hidden relative">
          {/* Subtle overlay for better text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-10 rounded-r-2xl"></div>
          <div className="text-left pl--2 relative z-10">
            <img 
              src="/assets/images/Sona-logo.png" 
              alt="Sona Logo" 
              className="h-8 w-auto mb-6 ml-4 drop-shadow-lg animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
            />
            <h2 className="text-6xl pl-4 font-bold mb-3 drop-shadow-md min-h-[4.5rem] flex items-center">
              {renderTextWithDissolve(texts.wellness, visibleLetters.wellness)}
            </h2>
            <h2 className="text-6xl pl-4 font-bold mb-3 drop-shadow-md min-h-[4.5rem] flex items-center">
              {renderTextWithDissolve(texts.startsWith, visibleLetters.startsWith)}
            </h2>
            <h2 className="text-6xl pl-4 font-bold mb-3 drop-shadow-md min-h-[4.5rem] flex items-center">
              <span className={`inline-block bg-clip-text text-transparent bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 transition-all duration-[2000ms] ease-out transform ${
                showConversation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                {texts.conversation}
              </span>
            </h2>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SignIn;
