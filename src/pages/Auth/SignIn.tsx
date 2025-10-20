import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Checkbox from '../../components/ui/Checkbox';
import PasswordResetModal from '../../components/auth/PasswordResetModal';
import { signinCounselor } from '../../api/userAPI';
import { getCounselorById } from '../../api/counsellorAPI';

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
  const [showPasswordReset, setShowPasswordReset] = useState(false);
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
      // First, attempt to sign in
      await signinCounselor({ email, password });
      
      // Get counselor ID from JWT token
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Decode JWT token to get counselor ID
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const payload = JSON.parse(jsonPayload);
      const counselorId = payload?.id;
      
      if (!counselorId) {
        throw new Error('Counselor ID not found in token');
      }
      
      // Check counselor status using the API endpoint
      const counselorResponse = await getCounselorById(counselorId);
      
      if (counselorResponse.success && counselorResponse.data?.counselor) {
        const counselorStatus = counselorResponse.data.counselor.status;
        
        // Check counselor status
        if (counselorStatus === 'pending') {
          setErrors({ general: 'Your account is pending approval. Please wait for admin approval before accessing the system.' });
          // Clear the stored token since they can't access the system
          localStorage.removeItem('auth_token');
          localStorage.removeItem('counsellor_id');
          return;
        }
        
        if (counselorStatus === 'rejected') {
          setErrors({ general: 'Your account has been rejected. Please contact support for more information.' });
          // Clear the stored token since they can't access the system
          localStorage.removeItem('auth_token');
          localStorage.removeItem('counsellor_id');
          return;
        }
        
        // If status is approved, proceed with navigation
        if (userType === 'counsellor') {
          navigate('/dashboard');
        } else {
          navigate('/psychiatrist/dashboard');
        }
      } else {
        throw new Error('Failed to fetch counselor details');
      }
    } catch (error: any) {
      // Handle other sign-in errors
      setErrors({ general: 'Invalid email or password. Please try again.' });
      
      // Clear any stored tokens on error
      localStorage.removeItem('auth_token');
      localStorage.removeItem('counsellor_id');
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
                onClick={() => setShowPasswordReset(true)}
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
        
        <PasswordResetModal 
          isOpen={showPasswordReset} 
          onClose={() => setShowPasswordReset(false)} 
        />
      </div>
    </div>
  );
};

export default SignIn;
