import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Checkbox from '../../components/ui/Checkbox';
import { signinCounselor } from '../../api/userAPI';

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the selected role from navigation state if available
  const passedRole = location.state?.selectedRole;
  const userType = (passedRole === 'counsellor' || passedRole === 'psychiatrist') 
    ? passedRole as 'counsellor' | 'psychiatrist'
    : 'counsellor';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      await signinCounselor({ email, password });
      // Redirect based on user type
      if (userType === 'counsellor') {
        navigate('/dashboard');
      } else {
        navigate('/psychiatrist/dashboard');
      }
    } catch {
      setErrors({ general: 'An error occurred. Please try again later.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <Card className="p-8">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <img 
              src="/assets/images/Sona-logo.png" 
              alt="Sona Logo" 
              className="h-10 w-auto mx-auto mb-6"
            />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
            <p className="text-gray-600">Sign in to access your account</p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-6">
            <div>
              <Input
                type="email"
                placeholder="you@example.com"
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {errors.email}
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
                name="password"
              />
              {errors.password && (
                <p className="text-red-600 text-sm mt-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Checkbox
                label="Remember me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <button
                type="button"
                className="text-pink-500 hover:text-pink-600 text-sm font-medium hover:underline"
                onClick={() => alert('Forgot password logic here')}
              >
                Forgot Password?
              </button>
            </div>

            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {errors.general}
              </p>
              </div>
            )}

            <Button 
              type="submit" 
              variant="primary" 
              className="w-full py-3 font-semibold"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="text-center mt-8">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-pink-500 font-medium hover:text-pink-600 hover:underline"
            >
                Sign up here
            </button>
          </p>
          </div>
        </Card>
        </div>
    </div>
  );
};

export default SignIn;
