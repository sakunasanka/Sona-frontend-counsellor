import React, { useState, useCallback, useEffect } from 'react';
import { 
  Camera, 
  Edit3, 
  MapPin, 
  Calendar, 
  Mail, 
  Phone, 
  Globe, 
  Instagram, 
  Linkedin, 
  Award,
  BookOpen,
  Star,
  X,
  Check,
  Clock,
  AlertCircle
} from 'lucide-react';
import { NavBar, Sidebar } from "../../components/layout";

// Custom X logo component
const XLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

interface CounsellorProfile {
  id: number;
  firstName: string;
  lastName: string;
  profileImage: string;
  coverImage: string;
  bio: string;
  location: string;
  website: string;
  email: string;
  phone: string;
  joinDate: string;
  specializations: string[];
  languages: string[];
  experience: number;
  rating: number;
  totalReviews: number;
  totalSessions: number;
  totalClients: number;
  socialLinks: {
    instagram?: string;
    linkedin?: string;
    x?: string;
  };
  credentials: {
    id: number;
    title: string;
    institution: string;
    year: number;
    status: 'approved' | 'pending' | 'rejected';
    submittedAt?: string;
  }[];
  achievements: {
    id: number;
    title: string;
    description: string;
    date: string;
    status: 'approved' | 'pending' | 'rejected';
    submittedAt?: string;
  }[];
}

const CounsellorProfile: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'credentials' | 'achievements'>('overview');

  const [profile, setProfile] = useState<CounsellorProfile>({
    id: 1,
    firstName: "Sarah",
    lastName: "Mitchell",
    profileImage: "/assets/images/profile-photo1.webp",
    coverImage: "/assets/images/bg-trans.jpeg",
    bio: "Passionate mental health counselor with 8+ years of experience helping individuals overcome anxiety, depression, and life transitions. I believe in creating a safe, non-judgmental space where healing can begin. 🌱",
    location: "Los Angeles, CA",
    website: "www.sarahmitchelltherapy.com",
    email: "sarah.mitchell@therapy.com",
    phone: "+1 (555) 123-4567",
    joinDate: "January 2018",
    specializations: ["Anxiety Disorders", "Depression", "Trauma Therapy", "Relationship Counseling", "Mindfulness-Based Therapy"],
    languages: ["English", "Spanish", "French"],
    experience: 8,
    rating: 4.9,
    totalReviews: 127,
    totalSessions: 1450,
    totalClients: 324,
    socialLinks: {
      instagram: "sarahmitchelltherapy",
      linkedin: "sarah-mitchell-therapy",
      x: "sarahtherapy"
    },
    credentials: [
      {
        id: 1,
        title: "Licensed Professional Counselor (LPC)",
        institution: "California Board of Behavioral Sciences",
        year: 2017,
        status: 'approved' as const
      },
      {
        id: 2,
        title: "Master of Arts in Clinical Psychology",
        institution: "UCLA",
        year: 2016,
        status: 'approved' as const
      },
      {
        id: 3,
        title: "Bachelor of Science in Psychology",
        institution: "UC Berkeley",
        year: 2014,
        status: 'approved' as const
      }
    ],
    achievements: [
      {
        id: 1,
        title: "Excellence in Mental Health Award",
        description: "Recognized for outstanding contribution to mental health awareness",
        date: "2024",
        status: 'approved' as const
      },
      {
        id: 2,
        title: "Top Rated Counselor",
        description: "Achieved 4.9+ rating with 100+ reviews",
        date: "2023",
        status: 'approved' as const
      }
    ]
  });

  const [editForm, setEditForm] = useState<Partial<CounsellorProfile>>(profile);
  const [showCoverImageOptions, setShowCoverImageOptions] = useState<boolean>(false);
  const [showProfileImageOptions, setShowProfileImageOptions] = useState<boolean>(false);
  const [editingCredential, setEditingCredential] = useState<number | null>(null);
  const [editingAchievement, setEditingAchievement] = useState<number | null>(null);
  const [showAddCredential, setShowAddCredential] = useState<boolean>(false);
  const [showAddAchievement, setShowAddAchievement] = useState<boolean>(false);
  const [newLanguage, setNewLanguage] = useState<string>('');
  const [editingLanguages, setEditingLanguages] = useState<string[]>([]);
  const [newSpecialization, setNewSpecialization] = useState<string>('');
  const [editingSpecializations, setEditingSpecializations] = useState<string[]>([]);
  const [editingCredentials, setEditingCredentials] = useState(profile.credentials);
  const [editingAchievements, setEditingAchievements] = useState(profile.achievements);
  const [editingCredentialData, setEditingCredentialData] = useState<{[key: number]: any}>({});
  const [editingAchievementData, setEditingAchievementData] = useState<{[key: number]: any}>({});
  const [newCredentialData, setNewCredentialData] = useState<{title: string, institution: string, year: string}>({
    title: '', institution: '', year: ''
  });
  const [newAchievementData, setNewAchievementData] = useState<{title: string, description: string, date: string}>({
    title: '', description: '', date: ''
  });

  const availableCoverImages = [
    "/assets/images/bg-trans.jpeg",
    "/assets/images/bg-trans.jpg",
  ];

  // Close image selection dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showCoverImageOptions && !target.closest('.cover-image-dropdown') && !target.closest('.cover-image-button')) {
        setShowCoverImageOptions(false);
      }
      if (showProfileImageOptions && !target.closest('.profile-image-dropdown') && !target.closest('.profile-image-button')) {
        setShowProfileImageOptions(false);
      }
    };

    if (showCoverImageOptions || showProfileImageOptions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showCoverImageOptions, showProfileImageOptions]);

  const availableProfileImages = [
    "/assets/images/profile-photo.png",
    "/assets/images/student-photo.png",
    "/assets/images/patient-photo.png",
  ];

  const toggleSidebar = (): void => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = (): void => {
    setSidebarOpen(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm(profile);
    setEditingLanguages(profile.languages);
    setEditingSpecializations(profile.specializations);
    setEditingCredentials(profile.credentials);
    setEditingAchievements(profile.achievements);
    setEditingCredentialData({});
    setEditingAchievementData({});
    setNewCredentialData({ title: '', institution: '', year: '' });
    setNewAchievementData({ title: '', description: '', date: '' });
  };

  const handleSave = () => {
    setProfile({ 
      ...profile, 
      ...editForm, 
      languages: editingLanguages,
      specializations: editingSpecializations,
      credentials: editingCredentials,
      achievements: editingAchievements
    });
    setIsEditing(false);
    setShowCoverImageOptions(false);
    setShowProfileImageOptions(false);
  };

  const handleCancel = () => {
    setEditForm(profile);
    setEditingLanguages(profile.languages);
    setEditingSpecializations(profile.specializations);
    setEditingCredentials(profile.credentials);
    setEditingAchievements(profile.achievements);
    setEditingCredentialData({});
    setEditingAchievementData({});
    setNewCredentialData({ title: '', institution: '', year: '' });
    setNewAchievementData({ title: '', description: '', date: '' });
    setIsEditing(false);
    setShowCoverImageOptions(false);
    setShowProfileImageOptions(false);
  };

  const handleInputChange = useCallback((field: string, value: any) => {
    setEditForm(prev => {
      // Only update if the value actually changed
      if (prev[field as keyof CounsellorProfile] === value) {
        return prev;
      }
      return { ...prev, [field]: value };
    });
  }, []);

  const handleCoverImageChange = (newCoverImage: string) => {
    setEditForm(prev => ({ ...prev, coverImage: newCoverImage }));
    setShowCoverImageOptions(false);
  };

  const handleProfileImageChange = (newProfileImage: string) => {
    setEditForm(prev => ({ ...prev, profileImage: newProfileImage }));
    setShowProfileImageOptions(false);
  };

  const handleCoverImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setEditForm(prev => ({ ...prev, coverImage: result }));
      };
      reader.readAsDataURL(file);
    }
    setShowCoverImageOptions(false);
  };

  const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setEditForm(prev => ({ ...prev, profileImage: result }));
      };
      reader.readAsDataURL(file);
    }
    setShowProfileImageOptions(false);
  };

  const handleAddCredential = useCallback(() => {
    if (!newCredentialData.title || !newCredentialData.institution || !newCredentialData.year) {
      return; // Don't add if required fields are missing
    }
    
    const newCredential = {
      id: Math.max(...editingCredentials.map(c => c.id)) + 1,
      title: newCredentialData.title,
      institution: newCredentialData.institution,
      year: parseInt(newCredentialData.year),
      status: 'pending' as const,
      submittedAt: new Date().toISOString()
    };
    setEditingCredentials(prev => [...prev, newCredential]);
    setNewCredentialData({ title: '', institution: '', year: '' });
    setShowAddCredential(false);
  }, [editingCredentials, newCredentialData]);

  const handleEditCredential = useCallback((id: number, field: string, value: string | number) => {
    setEditingCredentialData(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  }, []);

  const handleSaveCredential = useCallback((id: number) => {
    const updatedData = editingCredentialData[id];
    if (updatedData) {
      setEditingCredentials(prev => 
        prev.map(cred => cred.id === id ? { 
          ...cred, 
          ...updatedData,
          status: 'pending' as const,
          submittedAt: new Date().toISOString()
        } : cred)
      );
      setEditingCredentialData(prev => {
        const { [id]: removed, ...rest } = prev;
        return rest;
      });
    }
    setEditingCredential(null);
  }, [editingCredentialData]);

  const handleCancelCredentialEdit = useCallback((id: number) => {
    setEditingCredentialData(prev => {
      const { [id]: removed, ...rest } = prev;
      return rest;
    });
    setEditingCredential(null);
  }, []);

  const handleStartCredentialEdit = useCallback((credential: any) => {
    setEditingCredential(credential.id);
    setEditingCredentialData(prev => ({
      ...prev,
      [credential.id]: { ...credential }
    }));
  }, []);

  const handleDeleteCredential = useCallback((id: number) => {
    setEditingCredentials(prev => prev.filter(cred => cred.id !== id));
    setEditingCredential(null);
  }, []);

  // Helper function to validate year
  const isValidYear = useCallback((year: string) => {
    const yearPattern = /^\d{4}$/;
    const currentYear = new Date().getFullYear();
    const yearNum = parseInt(year);
    return yearPattern.test(year) && yearNum >= 1900 && yearNum <= currentYear + 1;
  }, []);

  // Helper function to check if credential data has changed
  const hasCredentialChanged = useCallback((credentialId: number, originalCredential: any) => {
    const editedData = editingCredentialData[credentialId];
    if (!editedData) return false;
    
    return (
      editedData.title !== originalCredential.title ||
      editedData.institution !== originalCredential.institution ||
      editedData.year !== originalCredential.year
    );
  }, [editingCredentialData]);

  // Helper function to check if achievement data has changed
  const hasAchievementChanged = useCallback((achievementId: number, originalAchievement: any) => {
    const editedData = editingAchievementData[achievementId];
    if (!editedData) return false;
    
    return (
      editedData.title !== originalAchievement.title ||
      editedData.description !== originalAchievement.description ||
      editedData.date !== originalAchievement.date
    );
  }, [editingAchievementData]);

  const handleAddAchievement = useCallback(() => {
    if (!newAchievementData.title || !newAchievementData.description || !newAchievementData.date) {
      return; // Don't add if required fields are missing
    }
    
    const newAchievement = {
      id: Math.max(...editingAchievements.map(a => a.id)) + 1,
      title: newAchievementData.title,
      description: newAchievementData.description,
      date: newAchievementData.date,
      status: 'pending' as const,
      submittedAt: new Date().toISOString()
    };
    setEditingAchievements(prev => [...prev, newAchievement]);
    setNewAchievementData({ title: '', description: '', date: '' });
    setShowAddAchievement(false);
  }, [editingAchievements, newAchievementData]);

  const handleEditAchievement = useCallback((id: number, field: string, value: string) => {
    setEditingAchievementData(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  }, []);

  const handleSaveAchievement = useCallback((id: number) => {
    const updatedData = editingAchievementData[id];
    if (updatedData) {
      setEditingAchievements(prev =>
        prev.map(ach => ach.id === id ? { 
          ...ach, 
          ...updatedData,
          status: 'pending' as const,
          submittedAt: new Date().toISOString()
        } : ach)
      );
      setEditingAchievementData(prev => {
        const { [id]: removed, ...rest } = prev;
        return rest;
      });
    }
    setEditingAchievement(null);
  }, [editingAchievementData]);

  const handleCancelAchievementEdit = useCallback((id: number) => {
    setEditingAchievementData(prev => {
      const { [id]: removed, ...rest } = prev;
      return rest;
    });
    setEditingAchievement(null);
  }, []);

  const handleStartAchievementEdit = useCallback((achievement: any) => {
    setEditingAchievement(achievement.id);
    setEditingAchievementData(prev => ({
      ...prev,
      [achievement.id]: { ...achievement }
    }));
  }, []);

  const handleDeleteAchievement = useCallback((id: number) => {
    setEditingAchievements(prev => prev.filter(ach => ach.id !== id));
    setEditingAchievement(null);
  }, []);

  const handleAddLanguage = useCallback(() => {
    if (newLanguage.trim() && !editingLanguages.includes(newLanguage.trim())) {
      setEditingLanguages(prev => [...prev, newLanguage.trim()]);
      setNewLanguage('');
    }
  }, [newLanguage, editingLanguages]);

  const handleRemoveLanguage = useCallback((languageToRemove: string) => {
    setEditingLanguages(prev => prev.filter(lang => lang !== languageToRemove));
  }, []);

  const handleAddSpecialization = useCallback(() => {
    if (newSpecialization.trim() && !editingSpecializations.includes(newSpecialization.trim())) {
      setEditingSpecializations(prev => [...prev, newSpecialization.trim()]);
      setNewSpecialization('');
    }
  }, [newSpecialization, editingSpecializations]);

  const handleRemoveSpecialization = useCallback((specializationToRemove: string) => {
    setEditingSpecializations(prev => prev.filter(spec => spec !== specializationToRemove));
  }, []);

  const handleLanguageInputKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddLanguage();
    }
  }, [handleAddLanguage]);

  const handleSpecializationInputKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSpecialization();
    }
  }, [handleAddSpecialization]);

  const ProfileStats = useCallback(() => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
        <div className="text-2xl font-bold text-gray-900">{profile.totalSessions}</div>
        <div className="text-sm text-gray-600">Sessions</div>
      </div>
      <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
        <div className="text-2xl font-bold text-gray-900">{profile.totalClients}</div>
        <div className="text-sm text-gray-600">Clients</div>
      </div>
      <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
        <div className="flex items-center justify-center gap-1">
          <div className="text-2xl font-bold text-gray-900">{profile.rating}</div>
          <Star className="w-5 h-5 text-yellow-400 fill-current" />
        </div>
        <div className="text-sm text-gray-600">Rating</div>
      </div>
      <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
        <div className="text-2xl font-bold text-gray-900">{profile.experience}+</div>
        <div className="text-sm text-gray-600">Years</div>
      </div>
    </div>
  ), [profile.totalSessions, profile.totalClients, profile.rating, profile.experience]);

  const ProfileHeader = useCallback(() => (
    <div className="relative mb-6">
      {/* Cover Image */}
      <div className="relative h-28 md:h-40 rounded-2xl overflow-hidden bg-pink-500">
        <img 
          src={isEditing ? editForm.coverImage || profile.coverImage : profile.coverImage} 
          alt="Cover" 
          className="w-full h-full object-cover"
        />
        {isEditing && (
          <button 
            onClick={() => setShowCoverImageOptions(!showCoverImageOptions)}
            className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors cover-image-button"
          >
            <Camera className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {/* Cover Image Selection Dropdown - Fixed positioning to avoid clipping */}
      {isEditing && showCoverImageOptions && (
        <div className="fixed top-32 md:top-44 right-6 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-50 w-64 cover-image-dropdown">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700">Choose Cover Image</h4>
            <button 
              onClick={() => setShowCoverImageOptions(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Upload from device option */}
          <div className="mb-3">
            <label className="block">
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverImageUpload}
                className="hidden"
              />
              <div className="border-2 border-dashed border-pink-300 rounded-lg p-3 text-center cursor-pointer hover:border-pink-500 transition-colors">
                <Camera className="w-6 h-6 mx-auto mb-1 text-pink-500" />
                <p className="text-xs text-gray-600">Upload from device</p>
              </div>
            </label>
          </div>

          {/* Predefined options */}
          <p className="text-xs text-gray-500 mb-2">Or choose from options:</p>
          <div className="grid grid-cols-2 gap-2">
            {availableCoverImages.map((image, index) => (
              <button
                key={index}
                onClick={() => handleCoverImageChange(image)}
                className="relative h-16 w-20 rounded overflow-hidden border-2 border-transparent hover:border-pink-500 transition-colors"
              >
                <img 
                  src={image} 
                  alt={`Cover option ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Profile Image */}
      <div className="absolute -bottom-16 left-6">
        <div className="relative">
          <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
            <img 
              src={isEditing ? editForm.profileImage || profile.profileImage : profile.profileImage} 
              alt={`${profile.firstName} ${profile.lastName}`}
              className="w-full h-full object-cover"
            />
          </div>
          {isEditing && (
            <button 
              onClick={() => setShowProfileImageOptions(!showProfileImageOptions)}
              className="absolute bottom-2 right-2 bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-full transition-colors shadow-lg profile-image-button"
            >
              <Camera className="w-4 h-4" />
            </button>
          )}
          
          {/* Profile Image Selection Dropdown */}
          {isEditing && showProfileImageOptions && (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50 w-72 profile-image-dropdown">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-700">Choose Profile Image</h4>
                <button 
                  onClick={() => setShowProfileImageOptions(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {/* Upload from device option */}
              <div className="mb-4">
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageUpload}
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-pink-300 rounded-lg p-4 text-center cursor-pointer hover:border-pink-500 transition-colors">
                    <Camera className="w-8 h-8 mx-auto mb-2 text-pink-500" />
                    <p className="text-sm text-gray-600 font-medium">Upload from device</p>
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 10MB</p>
                  </div>
                </label>
              </div>

              {/* Predefined options */}
              <p className="text-sm text-gray-600 font-medium mb-3">Or choose from options:</p>
              <div className="grid grid-cols-3 gap-3">
                {availableProfileImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleProfileImageChange(image)}
                    className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-transparent hover:border-pink-500 transition-colors"
                  >
                    <img 
                      src={image} 
                      alt={`Profile option ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Button */}
      {!isEditing ? (
        <button 
          onClick={handleEdit}
          className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 px-4 py-2 rounded-full font-medium transition-all shadow-lg flex items-center gap-2"
        >
          <Edit3 className="w-4 h-4" />
          Edit Profile
        </button>
      ) : (
        <div className="absolute top-4 right-4 flex gap-2">
          <button 
            onClick={handleCancel}
            className="bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full transition-all shadow-lg"
          >
            <X className="w-5 h-5" />
          </button>
          <button 
            onClick={handleSave}
            className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-full transition-all shadow-lg"
          >
            <Check className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  ), [isEditing, editForm, profile, showCoverImageOptions, showProfileImageOptions, availableCoverImages, availableProfileImages, handleEdit, handleCancel, handleSave, handleCoverImageUpload, handleProfileImageUpload, handleCoverImageChange, handleProfileImageChange]);

  const ProfileInfo = useCallback(() => (
    <div className="mt-20 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          {!isEditing ? (
            <>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-gray-600 mb-4 leading-relaxed">{profile.bio}</p>
            </>
          ) : (
            <>
              <div className="flex gap-3 mb-3">
                <input
                  key="firstName"
                  type="text"
                  value={editForm.firstName || ''}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="First Name"
                />
                <input
                  key="lastName"
                  type="text"
                  value={editForm.lastName || ''}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Last Name"
                />
              </div>
              <textarea
                key="bio"
                value={editForm.bio || ''}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                rows={3}
                placeholder="Bio"
              />
            </>
          )}

          {/* Contact Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {!isEditing ? (
                <span>{profile.location}</span>
              ) : (
                <input
                  key="location"
                  type="text"
                  value={editForm.location || ''}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder="Location"
                />
              )}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Joined {profile.joinDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Globe className="w-4 h-4" />
              {!isEditing ? (
                <a href={`https://${profile.website}`} className="hover:text-pink-600 transition-colors">
                  {profile.website}
                </a>
              ) : (
                <input
                  key="website"
                  type="text"
                  value={editForm.website || ''}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder="Website"
                />
              )}
            </div>
          </div>

          {/* Social Links */}
          {!isEditing ? (
            <div className="flex items-center gap-3">
              {profile.socialLinks?.instagram && (
                <a
                  href={`https://instagram.com/${profile.socialLinks.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors"
                >
                  <Instagram className="w-5 h-5 text-pink-500 cursor-pointer hover:text-pink-600 transition-colors" />
                </a>
              )}
              {profile.socialLinks?.linkedin && (
                <a
                  href={`https://linkedin.com/in/${profile.socialLinks.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors"
                >
                  <Linkedin className="w-5 h-5 text-blue-600 cursor-pointer hover:text-blue-700 transition-colors" />
                </a>
              )}
              {profile.socialLinks?.x && (
                <a
                  href={`https://x.com/${profile.socialLinks.x}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors"
                >
                  <XLogo className="w-5 h-5 text-black cursor-pointer hover:text-gray-800 transition-colors" />
                </a>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Social Media Links</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-pink-500" />
                  <input
                    type="text"
                    value={editForm.socialLinks?.instagram || ''}
                    onChange={(e) => handleInputChange('socialLinks', { 
                      ...editForm.socialLinks, 
                      instagram: e.target.value 
                    })}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="Instagram username (without @)"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4 text-blue-600" />
                  <input
                    type="text"
                    value={editForm.socialLinks?.linkedin || ''}
                    onChange={(e) => handleInputChange('socialLinks', { 
                      ...editForm.socialLinks, 
                      linkedin: e.target.value 
                    })}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="LinkedIn profile ID"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <XLogo className="w-4 h-4 text-black" />
                  <input
                    type="text"
                    value={editForm.socialLinks?.x || ''}
                    onChange={(e) => handleInputChange('socialLinks', { 
                      ...editForm.socialLinks, 
                      x: e.target.value 
                    })}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="X handle (without @)"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  ), [isEditing, profile.firstName, profile.lastName, profile.bio, profile.location, profile.joinDate, profile.website, editForm, handleInputChange]);

  const handleTabChange = useCallback((tab: 'overview' | 'credentials' | 'achievements') => {
    setActiveTab(tab);
  }, []);

  const TabNavigation = useCallback(() => (
    <div className="flex items-center gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
      <div 
        onClick={() => handleTabChange('overview')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
          activeTab === 'overview' 
            ? 'bg-white text-gray-900 shadow-sm' 
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Overview
      </div>
      <div 
        onClick={() => handleTabChange('credentials')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
          activeTab === 'credentials' 
            ? 'bg-white text-gray-900 shadow-sm' 
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Credentials
      </div>
      <div 
        onClick={() => handleTabChange('achievements')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
          activeTab === 'achievements' 
            ? 'bg-white text-gray-900 shadow-sm' 
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Achievements
      </div>
    </div>
  ), [activeTab, handleTabChange]);

  const OverviewTab = useCallback(() => (
    <div className="space-y-6">
      {/* Specializations */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-pink-600" />
          Specializations
        </h3>
        {!isEditing ? (
          <div className="flex flex-wrap gap-2">
            {profile.specializations.map((spec, index) => (
              <span key={index} className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium">
                {spec}
              </span>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {editingSpecializations.map((spec, index) => (
                <div key={index} className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                  {spec}
                  <button
                    onClick={() => handleRemoveSpecialization(spec)}
                    className="text-red-500 hover:text-red-700 text-xs ml-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSpecialization}
                onChange={(e) => setNewSpecialization(e.target.value)}
                placeholder="Add new specialization"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                onKeyPress={handleSpecializationInputKeyPress}
              />
              <button
                type="button"
                onClick={handleAddSpecialization}
                className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Languages */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-purple-600" />
          Languages
        </h3>
        {!isEditing ? (
          <div className="flex flex-wrap gap-2">
            {profile.languages.map((lang, index) => (
              <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                {lang}
              </span>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {editingLanguages.map((lang, index) => (
                <div key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                  {lang}
                  <button
                    onClick={() => handleRemoveLanguage(lang)}
                    className="text-red-500 hover:text-red-700 text-xs ml-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                placeholder="Add new language"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                onKeyPress={handleLanguageInputKeyPress}
              />
              <button
                type="button"
                onClick={handleAddLanguage}
                className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600">{profile.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600">{profile.phone}</span>
          </div>
        </div>
      </div>
    </div>
  ), [isEditing, profile.specializations, profile.languages, profile.email, profile.phone, editingLanguages, newLanguage, editingSpecializations, newSpecialization, handleRemoveLanguage, handleAddLanguage, handleLanguageInputKeyPress, handleRemoveSpecialization, handleAddSpecialization, handleSpecializationInputKeyPress]);

  const CredentialsTab = useCallback(() => (
    <div className="space-y-6">
      {/* Approved Credentials */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-pink-600" />
            Professional Credentials
          </h3>
          <button
            onClick={() => setShowAddCredential(!showAddCredential)}
            className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center gap-1"
          >
            + Add Credential
          </button>
        </div>
        
        {/* Add new credential form */}
        {showAddCredential && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Add New Credential</h4>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Credential Title"
                value={newCredentialData.title}
                onChange={(e) => setNewCredentialData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
              />
              <input
                type="text"
                placeholder="Institution"
                value={newCredentialData.institution}
                onChange={(e) => setNewCredentialData(prev => ({ ...prev, institution: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
              />
              <input
                type="number"
                placeholder="Year"
                min="1900"
                max={new Date().getFullYear() + 1}
                value={newCredentialData.year}
                onChange={(e) => setNewCredentialData(prev => ({ ...prev, year: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm ${
                  newCredentialData.year && !isValidYear(newCredentialData.year) 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300'
                }`}
              />
              {newCredentialData.year && !isValidYear(newCredentialData.year) && (
                <p className="text-red-600 text-xs mt-1">Please enter a valid 4-digit year between 1900 and {new Date().getFullYear() + 1}</p>
              )}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800 text-xs">
                  <strong>Note:</strong> This credential will be submitted for admin review and won't be visible on your public profile until approved.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddCredential}
                  disabled={!newCredentialData.title || !newCredentialData.institution || !newCredentialData.year || !isValidYear(newCredentialData.year)}
                  className="bg-pink-500 hover:bg-pink-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-3 py-1 rounded-md text-sm transition-colors"
                >
                  Submit for Review
                </button>
                <button
                  onClick={() => {
                    setShowAddCredential(false);
                    setNewCredentialData({ title: '', institution: '', year: '' });
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {editingCredentials.filter(credential => credential.status === 'approved').map((credential) => (
            <div key={credential.id} className="border-l-4 border-pink-500 pl-4 py-2 relative group">
              {editingCredential === credential.id ? (
                <div className="space-y-2">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-2">
                    <p className="text-blue-800 text-xs">
                      <strong>Note:</strong> Any changes will require admin re-approval before appearing on your public profile.
                    </p>
                  </div>
                  <input
                    key={`title-${credential.id}`}
                    type="text"
                    value={editingCredentialData[credential.id]?.title ?? credential.title}
                    onChange={(e) => handleEditCredential(credential.id, 'title', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm font-semibold"
                  />
                  <input
                    key={`institution-${credential.id}`}
                    type="text"
                    value={editingCredentialData[credential.id]?.institution ?? credential.institution}
                    onChange={(e) => handleEditCredential(credential.id, 'institution', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-gray-600"
                  />
                  <input
                    key={`year-${credential.id}`}
                    type="number"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    value={editingCredentialData[credential.id]?.year ?? credential.year}
                    onChange={(e) => handleEditCredential(credential.id, 'year', parseInt(e.target.value))}
                    className={`w-full px-2 py-1 border rounded text-sm text-gray-500 ${
                      !isValidYear(String(editingCredentialData[credential.id]?.year ?? credential.year)) 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300'
                    }`}
                  />
                  {!isValidYear(String(editingCredentialData[credential.id]?.year ?? credential.year)) && (
                    <p className="text-red-600 text-xs mt-1">Please enter a valid 4-digit year between 1900 and {new Date().getFullYear() + 1}</p>
                  )}                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleSaveCredential(credential.id)}
                        disabled={!isValidYear(String(editingCredentialData[credential.id]?.year ?? credential.year)) || !hasCredentialChanged(credential.id, credential)}
                        className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-2 py-1 rounded text-xs"
                      >
                        Submit for Review
                      </button>
                    <button
                      onClick={() => handleCancelCredentialEdit(credential.id)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDeleteCredential(credential.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h4 className="font-semibold text-gray-900">{credential.title}</h4>
                  <p className="text-gray-600">{credential.institution}</p>
                  <p className="text-sm text-gray-500">{credential.year}</p>
                  <button
                    onClick={() => handleStartCredentialEdit(credential)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-secondary hover:bg-secondary/80 text-white px-2 py-1 rounded text-xs transition-opacity"
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pending Credentials */}
      {editingCredentials.filter(credential => credential.status === 'pending').length > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 shadow-sm border border-orange-200">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-orange-800">Pending Review</h3>
          </div>
          <div className="mb-4 p-3 bg-orange-100 rounded-lg border border-orange-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-orange-800 font-medium">Credentials awaiting admin approval</p>
                <p className="text-orange-700 mt-1">
                  Your submitted credentials are being reviewed by our admin team. 
                  This usually takes 2-3 business days. Once approved, they will appear in your public profile.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {editingCredentials.filter(credential => credential.status === 'pending').map((credential) => (
              <div key={credential.id} className="bg-white/70 rounded-lg p-4 border-l-4 border-orange-400 relative group">
                {editingCredential === credential.id ? (
                  <div className="space-y-2">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-2">
                      <p className="text-blue-800 text-xs">
                        <strong>Note:</strong> Any changes will require admin re-approval before appearing on your public profile.
                      </p>
                    </div>
                    <input
                      key={`title-${credential.id}`}
                      type="text"
                      value={editingCredentialData[credential.id]?.title ?? credential.title}
                      onChange={(e) => handleEditCredential(credential.id, 'title', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm font-semibold"
                    />
                    <input
                      key={`institution-${credential.id}`}
                      type="text"
                      value={editingCredentialData[credential.id]?.institution ?? credential.institution}
                      onChange={(e) => handleEditCredential(credential.id, 'institution', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-gray-600"
                    />
                    <input
                      key={`year-${credential.id}`}
                      type="number"
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      value={editingCredentialData[credential.id]?.year ?? credential.year}
                      onChange={(e) => handleEditCredential(credential.id, 'year', parseInt(e.target.value))}
                      className={`w-full px-2 py-1 border rounded text-sm text-gray-500 ${
                        !isValidYear(String(editingCredentialData[credential.id]?.year ?? credential.year)) 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-300'
                      }`}
                    />
                    {!isValidYear(String(editingCredentialData[credential.id]?.year ?? credential.year)) && (
                      <p className="text-red-600 text-xs mt-1">Please enter a valid 4-digit year between 1900 and {new Date().getFullYear() + 1}</p>
                    )}
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleSaveCredential(credential.id)}
                        disabled={!isValidYear(String(editingCredentialData[credential.id]?.year ?? credential.year)) || !hasCredentialChanged(credential.id, credential)}
                        className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-2 py-1 rounded text-xs"
                      >
                        Resubmit for Review
                      </button>
                      <button
                        onClick={() => handleCancelCredentialEdit(credential.id)}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDeleteCredential(credential.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                      >
                        Withdraw
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          {credential.title}
                          <span className="bg-orange-200 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">
                            Under Review
                          </span>
                        </h4>
                        <p className="text-gray-600">{credential.institution}</p>
                        <p className="text-sm text-gray-500">{credential.year}</p>
                        {credential.submittedAt && (
                          <p className="text-xs text-orange-600 mt-1">
                            Submitted {new Date(credential.submittedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleStartCredentialEdit(credential)}
                        className="opacity-0 group-hover:opacity-100 bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded text-xs transition-opacity"
                      >
                        Edit
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  ), [editingCredentials, showAddCredential, editingCredential, editingCredentialData, newCredentialData, isValidYear, hasCredentialChanged, handleAddCredential, handleEditCredential, handleSaveCredential, handleCancelCredentialEdit, handleStartCredentialEdit, handleDeleteCredential]);

  const AchievementsTab = useCallback(() => (
    <div className="space-y-6">
      {/* Approved Achievements */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Star className="w-5 h-5 text-purple-600" />
            Achievements & Awards
          </h3>
          <button
            onClick={() => setShowAddAchievement(!showAddAchievement)}
            className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center gap-1"
          >
            + Add Achievement
          </button>
        </div>
        
        {/* Add new achievement form */}
        {showAddAchievement && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Add New Achievement</h4>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Achievement Title"
                value={newAchievementData.title}
                onChange={(e) => setNewAchievementData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              />
              <textarea
                placeholder="Description"
                rows={3}
                value={newAchievementData.description}
                onChange={(e) => setNewAchievementData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none"
              />
              <input
                type="number"
                placeholder="Year (e.g., 2024)"
                min="1900"
                max={new Date().getFullYear() + 1}
                value={newAchievementData.date}
                onChange={(e) => setNewAchievementData(prev => ({ ...prev, date: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm ${
                  newAchievementData.date && !isValidYear(newAchievementData.date) 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300'
                }`}
              />
              {newAchievementData.date && !isValidYear(newAchievementData.date) && (
                <p className="text-red-600 text-xs mt-1">Please enter a valid 4-digit year between 1900 and {new Date().getFullYear() + 1}</p>
              )}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800 text-xs">
                  <strong>Note:</strong> This achievement will be submitted for admin review and won't be visible on your public profile until approved.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddAchievement}
                  disabled={!newAchievementData.title || !newAchievementData.description || !newAchievementData.date || !isValidYear(newAchievementData.date)}
                  className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-3 py-1 rounded-md text-sm transition-colors"
                >
                  Submit for Review
                </button>
                <button
                  onClick={() => {
                    setShowAddAchievement(false);
                    setNewAchievementData({ title: '', description: '', date: '' });
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {editingAchievements.filter(achievement => achievement.status === 'approved').map((achievement) => (
            <div key={achievement.id} className="border-l-4 border-yellow-400 pl-4 py-2 relative group">
              {editingAchievement === achievement.id ? (
                <div className="space-y-2">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-2">
                    <p className="text-blue-800 text-xs">
                      <strong>Note:</strong> Any changes will require admin re-approval before appearing on your public profile.
                    </p>
                  </div>
                  <input
                    key={`title-${achievement.id}`}
                    type="text"
                    value={editingAchievementData[achievement.id]?.title ?? achievement.title}
                    onChange={(e) => handleEditAchievement(achievement.id, 'title', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm font-semibold"
                  />
                  <textarea
                    key={`description-${achievement.id}`}
                    value={editingAchievementData[achievement.id]?.description ?? achievement.description}
                    onChange={(e) => handleEditAchievement(achievement.id, 'description', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-gray-600 resize-none"
                    rows={2}
                  />
                  <input
                    key={`date-${achievement.id}`}
                    type="number"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    value={editingAchievementData[achievement.id]?.date ?? achievement.date}
                    onChange={(e) => handleEditAchievement(achievement.id, 'date', e.target.value)}
                    className={`w-full px-2 py-1 border rounded text-sm text-gray-500 ${
                      !isValidYear(editingAchievementData[achievement.id]?.date ?? achievement.date) 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300'
                    }`}
                  />
                  {!isValidYear(editingAchievementData[achievement.id]?.date ?? achievement.date) && (
                    <p className="text-red-600 text-xs mt-1">Please enter a valid 4-digit year between 1900 and {new Date().getFullYear() + 1}</p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleSaveAchievement(achievement.id)}
                      disabled={!isValidYear(editingAchievementData[achievement.id]?.date ?? achievement.date) || !hasAchievementChanged(achievement.id, achievement)}
                      className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-2 py-1 rounded text-xs"
                    >
                      Submit for Review
                    </button>
                    <button
                      onClick={() => handleCancelAchievementEdit(achievement.id)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDeleteAchievement(achievement.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                  <p className="text-gray-600">{achievement.description}</p>
                  <p className="text-sm text-gray-500">{achievement.date}</p>
                  <button
                    onClick={() => handleStartAchievementEdit(achievement)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-secondary hover:bg-secondary/80 text-white px-2 py-1 rounded text-xs transition-opacity"
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pending Achievements */}
      {editingAchievements.filter(achievement => achievement.status === 'pending').length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 shadow-sm border border-purple-200">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-purple-800">Pending Review</h3>
          </div>
          <div className="mb-4 p-3 bg-purple-100 rounded-lg border border-purple-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-purple-800 font-medium">Achievements awaiting admin approval</p>
                <p className="text-purple-700 mt-1">
                  Your submitted achievements are being reviewed by our admin team. 
                  This usually takes 2-3 business days. Once approved, they will appear in your public profile.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {editingAchievements.filter(achievement => achievement.status === 'pending').map((achievement) => (
              <div key={achievement.id} className="bg-white/70 rounded-lg p-4 border-l-4 border-purple-400 relative group">
                {editingAchievement === achievement.id ? (
                  <div className="space-y-2">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-2">
                      <p className="text-blue-800 text-xs">
                        <strong>Note:</strong> Any changes will require admin re-approval before appearing on your public profile.
                      </p>
                    </div>
                    <input
                      key={`title-${achievement.id}`}
                      type="text"
                      value={editingAchievementData[achievement.id]?.title ?? achievement.title}
                      onChange={(e) => handleEditAchievement(achievement.id, 'title', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm font-semibold"
                    />
                    <textarea
                      key={`description-${achievement.id}`}
                      value={editingAchievementData[achievement.id]?.description ?? achievement.description}
                      onChange={(e) => handleEditAchievement(achievement.id, 'description', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-gray-600 resize-none"
                      rows={2}
                    />
                    <input
                      key={`date-${achievement.id}`}
                      type="number"
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      value={editingAchievementData[achievement.id]?.date ?? achievement.date}
                      onChange={(e) => handleEditAchievement(achievement.id, 'date', e.target.value)}
                      className={`w-full px-2 py-1 border rounded text-sm text-gray-500 ${
                        !isValidYear(editingAchievementData[achievement.id]?.date ?? achievement.date) 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-300'
                      }`}
                    />
                    {!isValidYear(editingAchievementData[achievement.id]?.date ?? achievement.date) && (
                      <p className="text-red-600 text-xs mt-1">Please enter a valid 4-digit year between 1900 and {new Date().getFullYear() + 1}</p>
                    )}
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleSaveAchievement(achievement.id)}
                        disabled={!isValidYear(editingAchievementData[achievement.id]?.date ?? achievement.date) || !hasAchievementChanged(achievement.id, achievement)}
                        className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-2 py-1 rounded text-xs"
                      >
                        Resubmit for Review
                      </button>
                      <button
                        onClick={() => handleCancelAchievementEdit(achievement.id)}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDeleteAchievement(achievement.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                      >
                        Withdraw
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          {achievement.title}
                          <span className="bg-purple-200 text-purple-800 text-xs px-2 py-1 rounded-full font-medium">
                            Under Review
                          </span>
                        </h4>
                        <p className="text-gray-600">{achievement.description}</p>
                        <p className="text-sm text-gray-500">{achievement.date}</p>
                        {achievement.submittedAt && (
                          <p className="text-xs text-purple-600 mt-1">
                            Submitted {new Date(achievement.submittedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleStartAchievementEdit(achievement)}
                        className="opacity-0 group-hover:opacity-100 bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded text-xs transition-opacity"
                      >
                        Edit
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  ), [editingAchievements, showAddAchievement, editingAchievement, editingAchievementData, newAchievementData, isValidYear, hasAchievementChanged, handleAddAchievement, handleEditAchievement, handleSaveAchievement, handleCancelAchievementEdit, handleStartAchievementEdit, handleDeleteAchievement]);

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navbar */}
      <NavBar onMenuClick={toggleSidebar} />

      {/* Bottom section: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar */}
        <div className="w-80 bg-white border-r hidden lg:block">
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar}/>
        </div>

        {/* Mobile Sidebar */}
        <div className="lg:hidden">
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar}/>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto lg:ml-0">
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              <ProfileHeader />
              <ProfileInfo />
              <ProfileStats />
              <TabNavigation />
              
              {activeTab === 'overview' && <OverviewTab />}
              {activeTab === 'credentials' && <CredentialsTab />}
              {activeTab === 'achievements' && <AchievementsTab />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounsellorProfile;