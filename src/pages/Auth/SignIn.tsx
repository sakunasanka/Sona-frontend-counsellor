import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Container from '../../components/ui/Container';
import Checkbox from '../../components/ui/Checkbox';
import Modal from '../../components/ui/Modal';

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
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

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
      
      // Mock validation - in real app, this would be an API call
      if (email === 'test@example.com' && password === 'password') {
        // Successful login
        if (userType === 'counsellor') {
          navigate('/counsellor-dashboard');
        } else {
          navigate('/psychiatrist-dashboard');
        }
      } else {
        setErrors({ general: 'Invalid email or password. Please try again.' });
      }
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again later.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forgotEmail) {
      setErrors({ email: 'Email is required' });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(forgotEmail)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResetSent(true);
    } catch (error) {
      setErrors({ general: 'Failed to send reset email. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForgotPassword = () => {
    setShowForgotPassword(false);
    setForgotEmail('');
    setResetSent(false);
    setErrors({});
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
        <Container>
          <div className="flex justify-center">
            <Card className="w-full max-w-lg">
              <div className="text-center mb-8">
                <div className="mx-auto w-20 h-20 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
                  <Lock className="w-10 h-10 text-pink-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Forgot Password?</h2>
                <p className="text-gray-600">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              {resetSent ? (
                <div className="text-center">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-3">Email Sent!</h3>
                  <p className="text-gray-600 mb-8">
                    We've sent a password reset link to <strong>{forgotEmail}</strong>
                  </p>
                  <Button
                    onClick={resetForgotPassword}
                    variant="primary"
                    className="w-full py-4 text-lg"
                  >
                    Back to Sign In
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-6">
                  <div>
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      label="Email Address"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {errors.general && (
                    <Card className="bg-red-50 border border-red-200">
                      <p className="text-red-600 text-sm flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {errors.general}
                      </p>
                    </Card>
                  )}

                  <div className="space-y-4">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      variant="primary"
                      className="w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </Button>

                    <button
                      type="button"
                      onClick={resetForgotPassword}
                      className="w-full text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors py-2"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </form>
              )}
            </Card>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <Container className="py-8 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen lg:min-h-0">
          {/* Left Side - Branding */}
          <div className="hidden lg:block space-y-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-800">Sona</h1>
                  <p className="text-gray-600">Professional Portal</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-gray-800">Professional Access Portal</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Access your professional dashboard to manage patient sessions, track progress, and provide quality mental health care through our secure platform.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 pt-8">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-gray-700">Secure Patient Management System</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Lock className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-gray-700">HIPAA Compliant & Encrypted</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-gray-700">Professional Tools & Analytics</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Sign In Form */}
          <div className="w-full max-w-md mx-auto lg:max-w-lg">
            <Card className="p-8 lg:p-10">
              {/* Mobile Header */}
              <div className="text-center mb-8 lg:hidden">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Professional Access</h1>
                <p className="text-gray-600">Sign in to your dashboard</p>
              </div>

              {/* Desktop Header */}
              <div className="hidden lg:block text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Professional Access</h1>
                <p className="text-gray-600">Sign in to manage your practice</p>
              </div>

              {/* User Type Toggle - Enhanced */}
              <div className="mb-8">
                <p className="text-sm font-medium text-gray-700 mb-4">Select your professional role:</p>
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-2 rounded-2xl border border-gray-200">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setUserType('counsellor')}
                      className={`relative py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                        userType === 'counsellor'
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg transform scale-105'
                          : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>Counsellor</span>
                      </div>
                      {userType === 'counsellor' && (
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl opacity-20 animate-pulse"></div>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserType('psychiatrist')}
                      className={`relative py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                        userType === 'psychiatrist'
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg transform scale-105'
                          : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>Psychiatrist</span>
                      </div>
                      {userType === 'psychiatrist' && (
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl opacity-20 animate-pulse"></div>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Sign In Form */}
              <form onSubmit={handleSignIn} className="space-y-6">
                {/* Email Input */}
                <div>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    label="Email Address"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      label="Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-11 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    label="Remember me"
                  />
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-pink-600 hover:text-pink-700 font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* General Error Message */}
                {errors.general && (
                  <Card className="bg-red-50 border border-red-200">
                    <p className="text-red-600 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.general}
                    </p>
                  </Card>
                )}

                {/* Sign In Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  variant="primary"
                  className="w-full py-4 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              {/* Demo Credentials */}
              <Card className="mt-8 bg-blue-50 border border-blue-200">
                <div className="text-center">
                  <p className="text-sm text-blue-800 font-medium mb-2">Demo Professional Login:</p>
                  <div className="space-y-1">
                    <p className="text-xs text-blue-700">Email: test@example.com</p>
                    <p className="text-xs text-blue-700">Password: password</p>
                  </div>
                </div>
              </Card>

              {/* Sign Up Link */}
              <div className="text-center mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Need professional access?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/signup')}
                    className="text-pink-600 hover:text-pink-700 font-medium transition-colors"
                  >
                    Request access here
                  </button>
                </p>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SignIn;