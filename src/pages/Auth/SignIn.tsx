import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Checkbox from '../../components/ui/Checkbox';

const SignIn = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'counsellor' | 'psychiatrist'>('counsellor');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

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
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-rose-50 to-white px-4">
      <Card className="flex w-full max-w-5xl shadow-lg rounded-2xl overflow-hidden">
        {/* Left Pane - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 bg-white flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
          <p className="text-gray-600 mb-6">Access your portal</p>

          {/* Role Toggle */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant={userType === 'counsellor' ? 'primary' : 'secondary'}
              className={`flex-1 py-2 ${userType === 'counsellor' ? '' : 'bg-gray-100'}`}
              onClick={() => setUserType('counsellor')}
            >
              Counsellor
            </Button>
            <Button
              variant={userType === 'psychiatrist' ? 'primary' : 'secondary'}
              className={`flex-1 py-2 ${userType === 'psychiatrist' ? '' : 'bg-gray-100'}`}
              onClick={() => setUserType('psychiatrist')}
            >
              Psychiatrist
            </Button>
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
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute top-10 right-4 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
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
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-primary via-primaryLight to-secondary text-white items-center justify-center flex-col px-10 py-12 rounded-r-2xl">
          <div className="text-left pl--2">
            <img 
              src="/assets/images/Sona-logo.png" 
              alt="Sona Logo" 
              className="h-8 w-auto mb-6 drop-shadow-lg"
            />
            <h2 className="text-6xl pl-4 font-bold mb-3 drop-shadow-md">Wellness</h2>
            <h2 className="text-6xl pl-4 font-bold mb-3 drop-shadow-md">starts with a</h2>
            <h2 className="text-6xl pl-4 font-bold mb-3 drop-shadow-md">
              <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800">
                Conversation
              </span>
            </h2>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SignIn;
