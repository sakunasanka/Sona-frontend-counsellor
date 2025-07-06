import { useState, useRef } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Checkbox from '../../components/ui/Checkbox';
import MultiSelectDropdown from '../../components/ui/MultiSelectDropdown';

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
      // Find the parent section with h3 title
      const sectionTitle = firstErrorElement.closest('.space-y-5, .space-y-6')?.querySelector('h3') || 
                          firstErrorElement.closest('.space-y-6, .space-y-8')?.querySelector('h3');
      
      if (sectionTitle) {
        // Scroll to section title with smooth animation and some offset
        sectionTitle.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start'
        });
        // Add a small delay then scroll a bit up to show the full section header
        setTimeout(() => {
          window.scrollBy({ 
            top: -80, 
            behavior: 'smooth' 
          });
        }, 300);
      } else {
        // Fallback to original behavior
        firstErrorElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
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
      <div className="bg-red-50 border-l-4 border-red-400 p-3 mt-2 ml-2 rounded-r-md">
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
      // Show overlay immediately where user is - no need to scroll
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
    <div className="min-h-screen animate-gradient flex items-center justify-center px-2 sm:px-4 py-6 sm:py-10">
      {/* Glassmorphism Container on top of gradient */}
      <div 
        className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-2xl lg:max-w-4xl p-6 sm:p-8 md:p-10 lg:p-16 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto relative minimal-scrollbar"
      >
        <div>
          <div className="text-center mb-8 sm:mb-12">
            <img 
              src="/assets/images/Sona-logo.png" 
              alt="Sona Logo" 
              className="h-8 sm:h-10 w-auto mb-4 sm:mb-6 mx-auto"
            />
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2 sm:mb-4">Join the Professional Community</h2>
            <p className="text-sm sm:text-base text-gray-600">Create your professional account and start making a difference</p>
          </div>

          {/* Role Toggle */}
          <div className="flex items-center justify-center mb-8 sm:mb-10">
            <div className="relative bg-gray-100 rounded-full p-1 w-full max-w-xs sm:max-w-sm drop-shadow-md">
              <div
                className={`absolute top-1 left-1 h-8 sm:h-10 bg-secondary rounded-full transition-all duration-300 ease-in-out drop-shadow-md ${
                  userType === 'psychiatrist' ? 'w-1/2 transform translate-x-[calc(100%-0.5rem)]' : 'w-1/2'
                }`}
              />
              <div className="relative flex">
                <button
                  type="button"
                  className={`flex-1 py-2 sm:py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-medium rounded-full transition-colors duration-300 z-10 focus:outline-none ${
                    userType === 'counsellor' ? 'text-black' : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setUserType('counsellor')}
                >
                  Counsellor
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 sm:py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-medium rounded-full transition-colors duration-300 z-10 focus:outline-none ${
                    userType === 'psychiatrist' ? 'text-black' : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setUserType('psychiatrist')}
                >
                  Psychiatrist
                </button>
              </div>
            </div>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-8 sm:space-y-10">
            {/* Section 1: Basic Information */}
            <div className="space-y-5 sm:space-y-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 sm:pb-3">Basic Information</h3>
            
            <div className={errors.fullName ? 'error-field' : ''}>
              <Input 
                name="fullName" 
                label="Full Name" 
                required 
                value={formData.fullName} 
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {getRequiredFieldMessage('fullName')}
              {errors.fullName && (
                <p className="text-red-600 text-xs sm:text-sm mt-1 ml-2 flex items-center">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />{errors.fullName}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className={errors.email ? 'error-field' : ''}>
                <Input 
                  name="email" 
                  label="Email Address" 
                  required 
                  type="email" 
                  value={formData.email} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {getRequiredFieldMessage('email')}
                {errors.email && (
                  <p className="text-red-600 text-xs sm:text-sm mt-1 sm:mt-2 ml-2 flex items-center">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />{errors.email}
                  </p>
                )}
              </div>
              <div className={errors.mobile ? 'error-field' : ''}>
                <Input 
                  name="mobile" 
                  label="Mobile Number" 
                  required 
                  value={formData.mobile} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {getRequiredFieldMessage('mobile')}
                {errors.mobile && (
                  <p className="text-red-600 text-xs sm:text-sm mt-1 sm:mt-2 ml-2 flex items-center">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />{errors.mobile}
                  </p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className={errors.password ? 'error-field' : ''}>
                <Input 
                  name="password" 
                  label="Password" 
                  required 
                  type="password" 
                  value={formData.password} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {getRequiredFieldMessage('password')}
                {errors.password && (
                  <p className="text-red-600 text-xs sm:text-sm mt-1 sm:mt-2 ml-2 flex items-center">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />{errors.password}
                  </p>
                )}
              </div>
              <div className={errors.confirmPassword ? 'error-field' : ''}>
                <Input 
                  name="confirmPassword" 
                  label="Confirm Password" 
                  required 
                  type="password" 
                  value={formData.confirmPassword} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {getRequiredFieldMessage('confirmPassword')}
                {errors.confirmPassword && (
                  <p className="text-red-600 text-xs sm:text-sm mt-1 sm:mt-2 ml-2 flex items-center">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />{errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          </div>

            {/* Section 2: Professional Credentials */}
            <div className="space-y-5 sm:space-y-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 sm:pb-3">Professional Credentials</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className={errors.qualification ? 'error-field' : ''}>
                <Input 
                  name="qualification" 
                  label="Highest Qualification" 
                  required 
                  value={formData.qualification} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <p className="text-xs text-gray-500 mt-1 sm:mt-2 ml-2 flex items-center">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> Not Verified
                </p>
                {getRequiredFieldMessage('qualification')}
                {errors.qualification && (
                  <p className="text-red-600 text-xs sm:text-sm mt-1 sm:mt-2 ml-2 flex items-center">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />{errors.qualification}
                  </p>
                )}
              </div>

              <div className={errors.license ? 'error-field' : ''}>
                <Input 
                  name="license" 
                  label="License / Registration Number" 
                  required 
                  value={formData.license} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <p className="text-xs text-gray-500 mt-1 sm:mt-2 ml-2 flex items-center">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> Not Verified
                </p>
                {getRequiredFieldMessage('license')}
                {errors.license && (
                  <p className="text-red-600 text-xs sm:text-sm mt-1 sm:mt-2 ml-2 flex items-center">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />{errors.license}
                  </p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className={errors.experience ? 'error-field' : ''}>
                <Input 
                  name="experience" 
                  label="Years of Experience" 
                  required 
                  value={formData.experience} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {getRequiredFieldMessage('experience')}
                {errors.experience && (
                  <p className="text-red-600 text-xs sm:text-sm mt-1 sm:mt-2 ml-2 flex items-center">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />{errors.experience}
                  </p>
                )}
              </div>
              <div className={errors.specialization ? 'error-field' : ''}>
                <Input 
                  name="specialization" 
                  label="Area of Specialization" 
                  required 
                  value={formData.specialization} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {getRequiredFieldMessage('specialization')}
                {errors.specialization && (
                  <p className="text-red-600 text-xs sm:text-sm mt-1 sm:mt-2 ml-2 flex items-center">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />{errors.specialization}
                  </p>
                )}
              </div>
            </div>
          </div>

            {/* Section 3: Practice Details */}
            <div className="space-y-5 sm:space-y-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 sm:pb-3">Practice Details</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <Input 
                  name="institution" 
                  label="Affiliated Institution (Optional)" 
                  value={formData.institution} 
                  onChange={handleChange}
                />
              </div>
              <div className={errors.languages ? 'error-field' : ''}>
                <MultiSelectDropdown
                  label="Languages Spoken"
                  options={languageOptions}
                  selected={formData.languages}
                  onChange={handleLanguageChange}
                  required
                />
                {errors.languages && (
                  <p className="text-red-600 text-xs sm:text-sm mt-1 sm:mt-2 ml-2 flex items-center">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />{errors.languages}
                  </p>
                )}
              </div>
            </div>
            
            <div className={errors.hoursAvailable ? 'error-field' : ''}>
              <Input 
                name="hoursAvailable" 
                label="Preferred Working Hours" 
                required 
                value={formData.hoursAvailable} 
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {getRequiredFieldMessage('hoursAvailable')}
              {errors.hoursAvailable && (
                <p className="text-red-600 text-xs sm:text-sm mt-1 sm:mt-2 ml-2 flex items-center">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />{errors.hoursAvailable}
                </p>
              )}
            </div>
          </div>

            {/* Section 4: Additional Information */}
            <div className="space-y-5 sm:space-y-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 sm:pb-3">Additional Information</h3>
            
            <div>
              <label className="text-sm sm:text-base font-medium text-gray-700 mb-2 sm:mb-3 block">Short Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
                placeholder="Tell us about yourself and your professional background..."
              />
            </div>

            <div className={errors.documents ? 'error-field' : ''}>
              <label className="text-sm sm:text-base font-medium text-gray-700 mb-2 sm:mb-3 block">
                Upload Credentials / License Documents <span className="text-red-500">*</span>
              </label>
              <div className="hover-contained">
                <input
                  type="file"
                  required
                  accept="application/pdf,image/*"
                  onChange={handleFileChange}
                  className="block w-full mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600 file:bg-white file:border-none file:px-3 file:py-2 file:rounded-md file:text-gray-800 file:cursor-pointer file:transition-colors file:duration-200 hover:file:text-white hover:file:bg-gray-700"
                />
              </div>
              {errors.documents && (
                <p className="text-red-600 text-xs sm:text-sm mt-1 sm:mt-2 ml-2 flex items-center">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />{errors.documents}
                </p>
              )}
            </div>
          </div>

            {/* Agreement and Submit */}
            <div className="space-y-6 sm:space-y-8 pt-4 sm:pt-6">
              <div className={`ml-0 ${errors.agreed ? 'error-field' : ''}`}>
                <Checkbox
                  checked={formData.agreed}
                  onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                  label="I agree to the Terms and Privacy Policy"
                  required
                />
              </div>
              {errors.agreed && (
                <p className="text-red-600 text-xs sm:text-sm mt-2 sm:mt-3 ml-2 flex items-center">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />{errors.agreed}
                </p>
              )}

              {errors.general && (
                <p className="text-red-700 text-xs sm:text-sm mt-2 sm:mt-3 ml-2 flex items-center">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />{errors.general}
                </p>
              )}

              <div className="pt-4 sm:pt-6">
                <Button 
                  type="submit" 
                  variant="special" 
                  className="w-full py-2 sm:py-2 text-sm sm:text-base font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </div>
          </form>

          <p className="text-center text-xs sm:text-sm text-gray-600 mt-8 sm:mt-10 mb-4">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/signin')}
              className="text-pink-600 font-medium hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>

        
      </div>
      {/* Success Overlay */}
      {showSuccessOverlay && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform scale-100 transition-all duration-600">
            <div className="text-center p-8">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Application Submitted Successfully!
              </h3>
              <h4 className="text-lg font-semibold text-gray-700 mb-4">
                Your account is created successfully!
              </h4>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Your professional account verification is in progress, we will notify you via <span className="font-medium text-gray-800">{formData.email}</span> after your documents are reviewed.
              </p>
              <Button
                onClick={handleOverlayClose}
                variant="special"
                className="w-full py-3 text-base font-semibold"
              >
                Continue to Sign In
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
