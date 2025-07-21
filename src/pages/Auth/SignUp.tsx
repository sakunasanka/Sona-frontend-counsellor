import { useState, useRef } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Checkbox from '../../components/ui/Checkbox';
import MultiSelectDropdown from '../../components/ui/MultiSelectDropdown';
import Card from '../../components/ui/Card';

const languageOptions = [
  { value: 'sinhala', label: 'Sinhala' },
  { value: 'english', label: 'English' },
  { value: 'tamil', label: 'Tamil' },
  { value: 'chinese', label: 'Chinese' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'telugu', label: 'Telugu' },
  { value: 'hindi', label: 'Hindi' },
];

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the selected role from navigation state if available
  const passedRole = location.state?.selectedRole;
  const initialUserType = (passedRole === 'counsellor' || passedRole === 'psychiatrist') 
    ? passedRole as 'counsellor' | 'psychiatrist'
    : 'counsellor';
  
  const [userType, setUserType] = useState<'counsellor' | 'psychiatrist'>(initialUserType);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    qualification: '',
    license: '',
    experience: '',
    specialization: '',
    institution: '',
    languages: [] as string[],
    bio: '',
    daysAvailable: [],
    hoursAvailable: '',
    documents: null as File | null,
    agreed: false,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [requiredFieldErrors, setRequiredFieldErrors] = useState<{ [key: string]: boolean }>({});
  const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({});
  
  const formRef = useRef<HTMLFormElement>(null);

  const scrollToFirstError = () => {
    const firstErrorElement = document.querySelector('.error-field');
    if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear required field error when user starts typing
    if (requiredFieldErrors[name]) {
      setRequiredFieldErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const requiredFields = ['fullName', 'email', 'mobile', 'password', 'confirmPassword', 'qualification', 'license', 'experience', 'specialization', 'hoursAvailable'];
    
    // Mark field as touched
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    
    // Show required field error if field is required and empty
    if (requiredFields.includes(name) && !value.trim()) {
      setRequiredFieldErrors(prev => ({ ...prev, [name]: true }));
    }
  };

  const getRequiredFieldMessage = (fieldName: string) => {
    if (!touchedFields[fieldName] && !requiredFieldErrors[fieldName]) return null;
    if (!requiredFieldErrors[fieldName]) return null;
    
    const fieldLabels: { [key: string]: string } = {
      fullName: 'Full Name',
      email: 'Email Address',
      mobile: 'Mobile Number',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      qualification: 'Highest Qualification',
      license: 'License / Registration Number',
      experience: 'Years of Experience',
      specialization: 'Area of Specialization',
      hoursAvailable: 'Preferred Working Hours'
    };

    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-3 mt-2 rounded-r-md">
        <div className="flex items-center">
          <AlertCircle className="w-4 h-4 text-red-400 mr-2" />
          <p className="text-sm text-red-700">
            <span className="font-medium">{fieldLabels[fieldName]}</span> is required to proceed
          </p>
        </div>
      </div>
    );
  };

  const handleLanguageChange = (selectedLanguages: string[]) => {
    setFormData((prev) => ({ ...prev, languages: selectedLanguages }));
    if (errors.languages) {
      setErrors(prev => ({ ...prev, languages: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, documents: file }));
      if (errors.documents) {
        setErrors(prev => ({ ...prev, documents: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.qualification.trim()) newErrors.qualification = 'Qualification is required';
    if (!formData.license.trim()) newErrors.license = 'License number is required';
    if (!formData.experience.trim()) newErrors.experience = 'Experience is required';
    if (!formData.specialization.trim()) newErrors.specialization = 'Specialization is required';
    if (formData.languages.length === 0) newErrors.languages = 'At least one language is required';
    if (!formData.hoursAvailable.trim()) newErrors.hoursAvailable = 'Working hours are required';
    if (!formData.documents) newErrors.documents = 'Document upload is required';
    if (!formData.agreed) newErrors.agreed = 'You must agree to terms and conditions';
    
    setErrors(newErrors);
    
    // Scroll to first error if any
    if (Object.keys(newErrors).length > 0) {
      setTimeout(scrollToFirstError, 100);
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowSuccessOverlay(true);
    } catch {
      setErrors({ general: 'An error occurred. Please try again later.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClose = () => {
    setShowSuccessOverlay(false);
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <img 
              src="/assets/images/Sona-logo.png" 
              alt="Sona Logo" 
              className="h-10 w-auto mx-auto mb-6"
            />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Join the Professional Community</h1>
            <p className="text-gray-600">Create your professional account and start making a difference</p>
          </div>

          {/* Role Toggle */}
          <div className="flex items-center justify-center mb-8">
            <div className="relative bg-gray-100 rounded-full p-1 w-full max-w-sm">
              <div
                className={`absolute top-1 left-1 h-10 bg-pink-500 rounded-full transition-all duration-300 ease-in-out ${
                  userType === 'psychiatrist' ? 'w-1/2 transform translate-x-[calc(100%-0.5rem)]' : 'w-1/2'
                }`}
              />
              <div className="relative flex">
                <button
                  type="button"
                  className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-full transition-colors duration-300 z-10 focus:outline-none ${
                    userType === 'counsellor' ? 'text-white' : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setUserType('counsellor')}
                >
                  Counsellor
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-full transition-colors duration-300 z-10 focus:outline-none ${
                    userType === 'psychiatrist' ? 'text-white' : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setUserType('psychiatrist')}
                >
                  Psychiatrist
                </button>
              </div>
            </div>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Personal Information</h3>
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
              <Input 
                    type="text"
                    placeholder="Enter your full name"
                    label="Full Name"
                name="fullName" 
                value={formData.fullName} 
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {getRequiredFieldMessage('fullName')}
              {errors.fullName && (
                    <p className="text-red-600 text-sm mt-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.fullName}
                </p>
              )}
            </div>
            
                <div>
                <Input 
                    type="email"
                    placeholder="you@example.com"
                    label="Email Address"
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {getRequiredFieldMessage('email')}
                {errors.email && (
                    <p className="text-red-600 text-sm mt-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.email}
                  </p>
                )}
              </div>

                <div>
                <Input 
                    type="tel"
                    placeholder="+94 71 234 5678"
                    label="Mobile Number"
                  name="mobile" 
                  value={formData.mobile} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {getRequiredFieldMessage('mobile')}
                {errors.mobile && (
                    <p className="text-red-600 text-sm mt-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.mobile}
                  </p>
                )}
            </div>
            
                <div>
                <Input 
                    type="password"
                    placeholder="••••••••"
                    label="Password"
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.password && (
                    <p className="text-red-600 text-sm mt-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.password}
                  </p>
                )}
              </div>

                <div>
                <Input 
                    type="password"
                    placeholder="••••••••"
                    label="Confirm Password"
                  name="confirmPassword" 
                  value={formData.confirmPassword} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.confirmPassword && (
                    <p className="text-red-600 text-sm mt-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          </div>

            {/* Professional Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Professional Information</h3>
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                <Input 
                    type="text"
                    placeholder="e.g., PhD in Psychology"
                    label="Highest Qualification"
                  name="qualification" 
                  value={formData.qualification} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {getRequiredFieldMessage('qualification')}
                {errors.qualification && (
                    <p className="text-red-600 text-sm mt-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.qualification}
                  </p>
                )}
              </div>

                <div>
                <Input 
                    type="text"
                    placeholder="e.g., SLPSY001234"
                    label="License / Registration Number"
                  name="license" 
                  value={formData.license} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {getRequiredFieldMessage('license')}
                {errors.license && (
                    <p className="text-red-600 text-sm mt-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.license}
                  </p>
                )}
            </div>
            
                <div>
                <Input 
                    type="text"
                    placeholder="e.g., 5 years"
                    label="Years of Experience"
                  name="experience" 
                  value={formData.experience} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {getRequiredFieldMessage('experience')}
                {errors.experience && (
                    <p className="text-red-600 text-sm mt-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.experience}
                  </p>
                )}
              </div>

                <div>
                <Input 
                    type="text"
                    placeholder="e.g., Cognitive Behavioral Therapy"
                    label="Area of Specialization"
                  name="specialization" 
                  value={formData.specialization} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {getRequiredFieldMessage('specialization')}
                {errors.specialization && (
                    <p className="text-red-600 text-sm mt-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.specialization}
                  </p>
                )}
              </div>

              <div>
                <Input 
                    type="text"
                    placeholder="e.g., University of Colombo"
                    label="Institution"
                  name="institution" 
                  value={formData.institution} 
                  onChange={handleChange}
                />
                </div>

                <div>
                  <Input
                    type="text"
                    placeholder="e.g., 9:00 AM - 5:00 PM"
                    label="Preferred Working Hours"
                    name="hoursAvailable"
                    value={formData.hoursAvailable}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {getRequiredFieldMessage('hoursAvailable')}
                  {errors.hoursAvailable && (
                    <p className="text-red-600 text-sm mt-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.hoursAvailable}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <MultiSelectDropdown
                  options={languageOptions}
                  selected={formData.languages}
                  onChange={handleLanguageChange}
                  label="Languages Spoken"
                  required
                />
                {errors.languages && (
                  <p className="text-red-600 text-sm mt-2 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {errors.languages}
                  </p>
                )}
              </div>
            
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Bio
                </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                  className="w-full px-3 py-2 border border-gray-400 rounded-3xl shadow-sm bg-white text-gray-700
                    hover:border-pink-500 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20
                    focus:outline-none transition-all duration-150 ease-in-out
                    placeholder:text-gray-400 placeholder:font-normal"
                  placeholder="Tell us about your experience and approach..."
              />
            </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Upload Documents
              </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="w-full px-3 py-2 border border-gray-400 rounded-3xl shadow-sm bg-white text-gray-700
                    hover:border-pink-500 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20
                    focus:outline-none transition-all duration-150 ease-in-out
                    file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                    file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700
                    hover:file:bg-pink-100"
                />
              {errors.documents && (
                  <p className="text-red-600 text-sm mt-2 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {errors.documents}
                </p>
              )}
            </div>
          </div>

            {/* Terms and Conditions */}
            <div className="space-y-4">
                <Checkbox
                label="I agree to the terms and conditions"
                  checked={formData.agreed}
                onChange={(e) => setFormData(prev => ({ ...prev, agreed: e.target.checked }))}
                />
              {errors.agreed && (
                <p className="text-red-600 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {errors.agreed}
                </p>
              )}
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
              {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
          </form>

          <div className="text-center mt-8">
            <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/signin')}
                className="text-pink-500 font-medium hover:text-pink-600 hover:underline"
            >
                Sign in here
            </button>
          </p>
        </div>
        </Card>
      </div>

      {/* Success Overlay */}
      {showSuccessOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Account Created Successfully!</h3>
            <p className="text-gray-600 mb-6">Your account has been created and is pending approval. You'll receive an email once your account is approved.</p>
            <Button onClick={handleOverlayClose} variant="primary" className="w-full">
                Continue to Sign In
              </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
