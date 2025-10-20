import { useState, useRef } from 'react';
import { AlertCircle, CheckCircle, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import MultiSelectDropdown from '../../components/ui/MultiSelectDropdown';
import Card from '../../components/ui/Card';
import { signupCounselor } from '../../api/userAPI';
import { uploadQualification } from '../../utils/cloudinaryUpload';
import { validatePhoneNumber } from '../../utils/phoneValidation';
import PhoneInput from '../../components/ui/PhoneInput';

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the selected role from navigation state if available
  const passedRole = location.state?.selectedRole;
  const initialUserType = (passedRole === 'Counselor' || passedRole === 'Psychiatrist') 
    ? passedRole as 'Counselor' | 'Psychiatrist'
    : 'Counselor';
  
  const [userType, setUserType] = useState<'Counselor' | 'Psychiatrist'>(initialUserType);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    title: '',
    specialities: [] as string[],
    address: '',
    contact_no: '',
    license_no: '',
    idCard: '',
    isVolunteer: false,
    isAvailable: true,
    description: '',
    sessionFee: '',
    eduQualifications: [{
      institution: '',
      degree: '',
      field: '',
      grade: '',
      year: '',
      proof: null as File | null,
      proofUrl: '',
    }],
    experiences: [{
      position: '',
      company: '',
      description: '',
      startDate: '',
      endDate: '',
      document: null as File | null,
      documentUrl: '',
    }],
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleQualificationChange = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      eduQualifications: prev.eduQualifications.map((qual, i) =>
        i === index ? { ...qual, [field]: value } : qual
      ),
    }));
    
    // Clear error
    const errorKey = `eduQualifications[${index}].${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const handleExperienceChange = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      ),
    }));
    
    // Clear error
    const errorKey = `experiences[${index}].${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const handleQualificationFileChange = (index: number, file: File | null) => {
    setFormData((prev) => ({
      ...prev,
      eduQualifications: prev.eduQualifications.map((qual, i) =>
        i === index ? { ...qual, proof: file, proofUrl: '' } : qual
      ),
    }));
    
    // Clear error
    const errorKey = `eduQualifications[${index}].proof`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const handleExperienceFileChange = (index: number, file: File | null) => {
    setFormData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) =>
        i === index ? { ...exp, document: file, documentUrl: '' } : exp
      ),
    }));
    
    // Clear error
    const errorKey = `experiences[${index}].document`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const addQualification = () => {
    setFormData((prev) => ({
      ...prev,
      eduQualifications: [
        ...prev.eduQualifications,
        {
          institution: '',
          degree: '',
          field: '',
          grade: '',
          year: '',
          proof: null,
          proofUrl: '',
        },
      ],
    }));
  };

  const removeQualification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      eduQualifications: prev.eduQualifications.filter((_, i) => i !== index),
    }));
  };

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          position: '',
          company: '',
          description: '',
          startDate: '',
          endDate: '',
          document: null,
          documentUrl: '',
        },
      ],
    }));
  };

  const removeExperience = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.displayName.trim()) newErrors.displayName = 'Display name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (formData.specialities.length === 0) newErrors.specialities = 'At least one speciality is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    // Validate phone number
    if (!formData.contact_no.trim()) {
      newErrors.contact_no = 'Contact number is required';
    } else {
      const phoneValidation = validatePhoneNumber(formData.contact_no, 'LK');
      if (!phoneValidation.isValid) {
        newErrors.contact_no = phoneValidation.error || 'Invalid phone number';
      }
    }
    if (!formData.license_no.trim()) newErrors.license_no = 'License number is required';
    if (!formData.idCard.trim()) newErrors.idCard = 'ID Card is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.sessionFee.trim()) newErrors.sessionFee = 'Session fee is required';
    if (formData.sessionFee && !formData.isVolunteer && parseFloat(formData.sessionFee) < 1000) newErrors.sessionFee = 'Session fee must be at least 1000 LKR for non-volunteers';
    if (formData.sessionFee && formData.isVolunteer && parseFloat(formData.sessionFee) < 0) newErrors.sessionFee = 'Session fee cannot be negative';
    
    // Validate educational qualifications
    formData.eduQualifications.forEach((qual, index) => {
      if (!qual.institution.trim()) newErrors[`eduQualifications[${index}].institution`] = 'Institution is required';
      if (!qual.degree.trim()) newErrors[`eduQualifications[${index}].degree`] = 'Degree is required';
      if (!qual.field.trim()) newErrors[`eduQualifications[${index}].field`] = 'Field is required';
      if (!qual.grade.trim()) newErrors[`eduQualifications[${index}].grade`] = 'Grade is required';
      if (!qual.year.trim()) newErrors[`eduQualifications[${index}].year`] = 'Year is required';
      if (!qual.proof && !qual.proofUrl) newErrors[`eduQualifications[${index}].proof`] = 'Proof document is required';
    });
    
    // Validate experiences
    formData.experiences.forEach((exp, index) => {
      if (!exp.position.trim()) newErrors[`experiences[${index}].position`] = 'Position is required';
      if (!exp.company.trim()) newErrors[`experiences[${index}].company`] = 'Company is required';
      if (!exp.description.trim()) newErrors[`experiences[${index}].description`] = 'Description is required';
      if (!exp.startDate.trim()) newErrors[`experiences[${index}].startDate`] = 'Start date is required';
      if (!exp.endDate.trim()) newErrors[`experiences[${index}].endDate`] = 'End date is required';
      if (!exp.document && !exp.documentUrl) newErrors[`experiences[${index}].document`] = 'Document is required';
      
      // Validate date logic
      if (exp.startDate && exp.endDate) {
        const startDate = new Date(exp.startDate);
        const endDate = new Date(exp.endDate);
        
        if (endDate <= startDate) {
          newErrors[`experiences[${index}].endDate`] = 'End date must be after start date';
        }
      }
    });
    
    setErrors(newErrors);
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Upload qualification documents
      const eduQualifications = await Promise.all(
        formData.eduQualifications.map(async (qual) => {
          let proofUrl = qual.proofUrl;
          if (qual.proof) {
            proofUrl = await uploadQualification(qual.proof);
          }
          return {
            institution: qual.institution,
            degree: qual.degree,
            field: qual.field,
            grade: qual.grade,
            year: parseInt(qual.year),
            proof: proofUrl,
          };
        })
      );
      
      // Upload experience documents
      const experiences = await Promise.all(
        formData.experiences.map(async (exp) => {
          let documentUrl = exp.documentUrl;
          if (exp.document) {
            documentUrl = await uploadQualification(exp.document);
          }
          return {
            position: exp.position,
            company: exp.company,
            description: exp.description,
            startDate: exp.startDate,
            endDate: exp.endDate,
            document: documentUrl,
          };
        })
      );
      
      const signupData = {
        email: formData.email,
        password: formData.password,
        displayName: formData.displayName,
        userType: userType,
        additionalData: {
          title: formData.title,
          specialities: formData.specialities,
          address: formData.address,
          contact_no: formData.contact_no,
          license_no: formData.license_no,
          idCard: formData.idCard,
          isVolunteer: formData.isVolunteer,
          isAvailable: formData.isAvailable,
          description: formData.description,
          rating: 0,
          sessionFee: parseFloat(formData.sessionFee),
          eduQualifications,
          experiences,
        },
      };
      
      await signupCounselor(signupData);
      setShowSuccessOverlay(true);
    } catch (error) {
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
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => navigate('/signup')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back</span>
              </button>
              <img 
                src="/assets/images/Sona-logo.png" 
                alt="Sona Logo" 
                className="h-10 w-auto"
              />
              <div className="w-16"></div> {/* Spacer for centering */}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Join the Professional Community</h1>
            <p className="text-gray-600">Create your professional account and start making a difference</p>
          </div>

          {/* Role Toggle */}
          <div className="flex items-center justify-center mb-8">
            <div className="relative bg-gray-100 rounded-full p-1 w-full max-w-sm">
              <div
                className={`absolute top-1 left-1 h-10 bg-slate-500 rounded-full transition-all duration-300 ease-in-out ${
                  userType === 'Psychiatrist' ? 'w-1/2 transform translate-x-[calc(100%-0.5rem)]' : 'w-1/2'
                }`}
              />
              <div className="relative flex">
                <button
                  type="button"
                  className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-full transition-colors duration-300 z-10 focus:outline-none ${
                    userType === 'Counselor' ? 'text-white' : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setUserType('Counselor')}
                >
                  Counselor
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-full transition-colors duration-300 z-10 focus:outline-none ${
                    userType === 'Psychiatrist' ? 'text-white' : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setUserType('Psychiatrist')}
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
                name="displayName" 
                value={formData.displayName} 
                onChange={handleChange}
              />
              {errors.displayName && (
                    <p className="text-red-600 text-sm mt-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.displayName}
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
                />
                {errors.email && (
                    <p className="text-red-600 text-sm mt-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.email}
                  </p>
                )}
              </div>

                <div>
                <PhoneInput
                    label="Contact Number"
                    placeholder="+94 71 234 5678"
                    value={formData.contact_no}
                    onChange={(value, isValid) => {
                      setFormData(prev => ({ ...prev, contact_no: value }));
                      // Clear validation error if phone becomes valid
                      if (isValid && errors.contact_no) {
                        setErrors(prev => ({ ...prev, contact_no: '' }));
                      }
                    }}
                    country="LK"
                    required
                    showValidation={true}
                    autoFormat={true}
                />
                {errors.contact_no && (
                    <p className="text-red-600 text-sm mt-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.contact_no}
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
                    placeholder="e.g., Licensed Counselor"
                    label="Title"
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange}
                />
                {errors.title && (
                    <p className="text-red-600 text-sm mt-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.title}
                  </p>
                )}
              </div>

                <div>
                <Input 
                    type="text"
                    placeholder="e.g., SLPSY001234"
                    label="License Number"
                  name="license_no" 
                  value={formData.license_no} 
                  onChange={handleChange}
                />
                {errors.license_no && (
                    <p className="text-red-600 text-sm mt-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.license_no}
                  </p>
                )}
            </div>
            
                <div>
                <Input 
                    type="text"
                    placeholder="e.g., ID123456"
                    label="ID Card"
                  name="idCard" 
                  value={formData.idCard} 
                  onChange={handleChange}
                />
                {errors.idCard && (
                    <p className="text-red-600 text-sm mt-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.idCard}
                  </p>
                )}
              </div>

                <div>
                <Input 
                    type="number"
                    placeholder={formData.isVolunteer ? "e.g., 0" : "e.g., 1000"}
                    label="Session Fee (LKR)"
                  name="sessionFee" 
                  value={formData.sessionFee} 
                  onChange={handleChange}
                  min={formData.isVolunteer ? "0" : "1000"}
                  step="100"
                />
                {errors.sessionFee && (
                    <p className="text-red-600 text-sm mt-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.sessionFee}
                  </p>
                )}
              </div>

              <div>
                <Input 
                    type="text"
                    placeholder="Enter your address"
                    label="Address"
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange}
                />
                {errors.address && (
                    <p className="text-red-600 text-sm mt-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.address}
                  </p>
                )}
              </div>
              </div>

              <div>
                <MultiSelectDropdown
                  options={[
                    { value: 'Anxiety', label: 'Anxiety' },
                    { value: 'Depression', label: 'Depression' },
                    { value: 'Stress', label: 'Stress' },
                    { value: 'PTSD', label: 'PTSD' },
                    { value: 'Relationship Issues', label: 'Relationship Issues' },
                    { value: 'Addiction', label: 'Addiction' },
                  ]}
                  selected={formData.specialities}
                  onChange={(selected) => setFormData(prev => ({ ...prev, specialities: selected }))}
                  label="Specialities"
                  required
                />
                {errors.specialities && (
                  <p className="text-red-600 text-sm mt-2 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {errors.specialities}
                  </p>
                )}
              </div>
            
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Description
                </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                  className="w-full px-3 py-2 border border-gray-400 rounded-3xl shadow-sm bg-white text-gray-700
                    hover:border-slate-500 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20
                    focus:outline-none transition-all duration-150 ease-in-out
                    placeholder:text-gray-400 placeholder:font-normal"
                  placeholder="Describe your experience and approach..."
              />
              {errors.description && (
                  <p className="text-red-600 text-sm mt-2 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {errors.description}
                  </p>
                )}
            </div>

              {/* <div className="flex items-center space-x-4">
                <Checkbox
                  label="Available for sessions"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData(prev => ({ ...prev, isAvailable: e.target.checked }))}
                />
                <Checkbox
                  label="Volunteer"
                  checked={formData.isVolunteer}
                  onChange={(e) => setFormData(prev => ({ ...prev, isVolunteer: e.target.checked }))}
                />
              </div> */}
          </div>

            {/* Education */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Education</h3>
                <button
                  type="button"
                  onClick={addQualification}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-slate-500 text-white rounded-full hover:bg-slate-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Qualification
                </button>
              </div>
              
              {formData.eduQualifications.map((qual, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-md font-medium text-gray-900">Qualification {index + 1}</h4>
                    {formData.eduQualifications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQualification(index)}
                        className="flex items-center gap-1 px-2 py-1 text-sm text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Input 
                        type="text"
                        placeholder="e.g., University of Colombo"
                        label="Institution"
                        value={qual.institution} 
                        onChange={(e) => handleQualificationChange(index, 'institution', e.target.value)}
                      />
                      {errors[`eduQualifications[${index}].institution`] && (
                        <p className="text-red-600 text-sm mt-2 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          {errors[`eduQualifications[${index}].institution`]}
                        </p>
                      )}
                    </div>

                    <div>
                      <Input 
                        type="text"
                        placeholder="e.g., Master of Counseling"
                        label="Degree"
                        value={qual.degree} 
                        onChange={(e) => handleQualificationChange(index, 'degree', e.target.value)}
                      />
                      {errors[`eduQualifications[${index}].degree`] && (
                        <p className="text-red-600 text-sm mt-2 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          {errors[`eduQualifications[${index}].degree`]}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Input 
                        type="text"
                        placeholder="e.g., Clinical Psychology"
                        label="Field"
                        value={qual.field} 
                        onChange={(e) => handleQualificationChange(index, 'field', e.target.value)}
                      />
                      {errors[`eduQualifications[${index}].field`] && (
                        <p className="text-red-600 text-sm mt-2 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          {errors[`eduQualifications[${index}].field`]}
                        </p>
                      )}
                    </div>

                    <div>
                      <Input 
                        type="text"
                        placeholder="e.g., A-"
                        label="Grade"
                        value={qual.grade} 
                        onChange={(e) => handleQualificationChange(index, 'grade', e.target.value)}
                      />
                      {errors[`eduQualifications[${index}].grade`] && (
                        <p className="text-red-600 text-sm mt-2 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          {errors[`eduQualifications[${index}].grade`]}
                        </p>
                      )}
                    </div>

                    <div>
                      <Input 
                        type="number"
                        placeholder="e.g., 2020"
                        label="Year"
                        value={qual.year} 
                        onChange={(e) => handleQualificationChange(index, 'year', e.target.value)}
                      />
                      {errors[`eduQualifications[${index}].year`] && (
                        <p className="text-red-600 text-sm mt-2 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          {errors[`eduQualifications[${index}].year`]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Proof Document
                      </label>
                      <input
                        type="file"
                        onChange={(e) => handleQualificationFileChange(index, e.target.files?.[0] || null)}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        className="w-full px-3 py-2 border border-gray-400 rounded-3xl shadow-sm bg-white text-gray-700
                          hover:border-slate-500 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20
                          focus:outline-none transition-all duration-150 ease-in-out
                          file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                          file:text-sm file:font-semibold file:bg-slate-50 file:text-slate-700
                          hover:file:bg-slate-100"
                      />
                      {errors[`eduQualifications[${index}].proof`] && (
                        <p className="text-red-600 text-sm mt-2 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          {errors[`eduQualifications[${index}].proof`]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>

            {/* Experience */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Experience</h3>
                <button
                  type="button"
                  onClick={addExperience}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-slate-500 text-white rounded-full hover:bg-slate-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Experience
                </button>
              </div>
              
              {formData.experiences.map((exp, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-md font-medium text-gray-900">Experience {index + 1}</h4>
                    {formData.experiences.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExperience(index)}
                        className="flex items-center gap-1 px-2 py-1 text-sm text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Input 
                        type="text"
                        placeholder="e.g., Counselor"
                        label="Position"
                        value={exp.position} 
                        onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                      />
                      {errors[`experiences[${index}].position`] && (
                        <p className="text-red-600 text-sm mt-2 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          {errors[`experiences[${index}].position`]}
                        </p>
                      )}
                    </div>

                    <div>
                      <Input 
                        type="text"
                        placeholder="e.g., Mental Health Center"
                        label="Company"
                        value={exp.company} 
                        onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                      />
                      {errors[`experiences[${index}].company`] && (
                        <p className="text-red-600 text-sm mt-2 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          {errors[`experiences[${index}].company`]}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Input 
                        type="date"
                        label="Start Date"
                        value={exp.startDate} 
                        onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                      />
                      {errors[`experiences[${index}].startDate`] && (
                        <p className="text-red-600 text-sm mt-2 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          {errors[`experiences[${index}].startDate`]}
                        </p>
                      )}
                    </div>

                    <div>
                      <Input 
                        type="date"
                        label="End Date"
                        value={exp.endDate} 
                        onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                        min={exp.startDate}
                      />
                      {errors[`experiences[${index}].endDate`] && (
                        <p className="text-red-600 text-sm mt-2 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          {errors[`experiences[${index}].endDate`]}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Experience Description
                      </label>
                      <textarea
                        value={exp.description}
                        onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-400 rounded-3xl shadow-sm bg-white text-gray-700
                          hover:border-slate-500 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20
                          focus:outline-none transition-all duration-150 ease-in-out
                          placeholder:text-gray-400 placeholder:font-normal"
                        placeholder="Describe your role and responsibilities..."
                      />
                      {errors[`experiences[${index}].description`] && (
                        <p className="text-red-600 text-sm mt-2 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          {errors[`experiences[${index}].description`]}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Supporting Document
                      </label>
                      <input
                        type="file"
                        onChange={(e) => handleExperienceFileChange(index, e.target.files?.[0] || null)}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        className="w-full px-3 py-2 border border-gray-400 rounded-3xl shadow-sm bg-white text-gray-700
                          hover:border-slate-500 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20
                          focus:outline-none transition-all duration-150 ease-in-out
                          file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                          file:text-sm file:font-semibold file:bg-slate-50 file:text-slate-700
                          hover:file:bg-slate-100"
                      />
                      {errors[`experiences[${index}].document`] && (
                        <p className="text-red-600 text-sm mt-2 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          {errors[`experiences[${index}].document`]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
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
                className="text-slate-500 font-medium hover:text-slate-600 hover:underline"
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
            <h3 className="text-xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
            <p className="text-gray-600 mb-6">Your application has been sent for verification. You will be notified once it is approved.</p>
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
