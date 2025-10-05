import { useState, useCallback, useEffect } from 'react';
import { CounsellorProfile, Credential, Achievement } from './types';
import { Language } from './constants';

export const useProfileState = (initialProfile: CounsellorProfile) => {
  const [profile, setProfile] = useState<CounsellorProfile>(initialProfile);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<Partial<CounsellorProfile>>(initialProfile);

  // Update profile when initialProfile changes (API data loads)
  useEffect(() => {
    setProfile(initialProfile);
    if (!isEditing) {
      setEditForm(initialProfile);
    }
  }, [initialProfile, isEditing]);
  

  
  // Language and specialization editing
  const [editingLanguages, setEditingLanguages] = useState<Language[]>([]);
  const [newSpecialization, setNewSpecialization] = useState<string>('');
  const [editingSpecializations, setEditingSpecializations] = useState<string[]>([]);
  
  // Credentials and achievements editing
  const [editingCredentials, setEditingCredentials] = useState(initialProfile.credentials);
  const [editingAchievements, setEditingAchievements] = useState(initialProfile.achievements);
  const [editingCredential, setEditingCredential] = useState<number | null>(null);
  const [editingAchievement, setEditingAchievement] = useState<number | null>(null);
  const [editingCredentialData, setEditingCredentialData] = useState<{[key: number]: any}>({});
  const [editingAchievementData, setEditingAchievementData] = useState<{[key: number]: any}>({});

  // Update editing states when profile data changes
  useEffect(() => {
    if (!isEditing) {
      setEditingCredentials(initialProfile.credentials);
      setEditingAchievements(initialProfile.achievements);
      setEditingLanguages(initialProfile.languages);
      setEditingSpecializations(initialProfile.specializations);
    }
  }, [initialProfile.credentials, initialProfile.achievements, initialProfile.languages, initialProfile.specializations, isEditing]);
  
  // Add new items states
  const [showAddCredential, setShowAddCredential] = useState<boolean>(false);
  const [showAddAchievement, setShowAddAchievement] = useState<boolean>(false);
  const [newCredentialData, setNewCredentialData] = useState<{title: string, institution: string, year: string}>({
    title: '', institution: '', year: ''
  });
  const [newAchievementData, setNewAchievementData] = useState<{title: string, description: string, date: string}>({
    title: '', description: '', date: ''
  });

  const handleEdit = useCallback(() => {
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
  }, [profile]);

  const handleSave = useCallback(async () => {
    try {
      const updatedProfileData = { 
        ...profile, 
        ...editForm, 
        languages: editingLanguages,
        specializations: editingSpecializations,
        credentials: editingCredentials,
        achievements: editingAchievements
      };
      
      setProfile(updatedProfileData);
      setIsEditing(false);
      
      return { success: true, data: updatedProfileData };
    } catch (error) {
      console.error('Failed to save profile:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to save profile' };
    }
  }, [profile, editForm, editingLanguages, editingSpecializations, editingCredentials, editingAchievements]);

  const handleCancel = useCallback(() => {
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
  }, [profile]);

  const handleInputChange = useCallback((field: string, value: any) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  return {
    profile,
    setProfile,
    isEditing,
    setIsEditing,
    editForm,
    setEditForm,

    editingLanguages,
    setEditingLanguages,
    newSpecialization,
    setNewSpecialization,
    editingSpecializations,
    setEditingSpecializations,
    editingCredentials,
    setEditingCredentials,
    editingAchievements,
    setEditingAchievements,
    editingCredential,
    setEditingCredential,
    editingAchievement,
    setEditingAchievement,
    editingCredentialData,
    setEditingCredentialData,
    editingAchievementData,
    setEditingAchievementData,
    showAddCredential,
    setShowAddCredential,
    showAddAchievement,
    setShowAddAchievement,
    newCredentialData,
    setNewCredentialData,
    newAchievementData,
    setNewAchievementData,
    handleEdit,
    handleSave,
    handleCancel,
    handleInputChange
  };
};

export const useImageHandlers = (
  setEditForm: React.Dispatch<React.SetStateAction<Partial<CounsellorProfile>>>
) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);



  const handleCoverImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Import Cloudinary upload function
    const { uploadCoverImage, validateImageFile } = await import('../../utils/cloudinaryUpload');
    
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid file');
      return;
    }

    setUploading(true);
    setUploadError(null);
    
    try {
      // Upload to Cloudinary
      const imageUrl = await uploadCoverImage(file);
      
      // Update form with Cloudinary URL
      setEditForm(prev => ({ ...prev, coverImage: imageUrl }));
    } catch (error) {
      console.error('Cover image upload failed:', error);
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [setEditForm]);

  const handleProfileImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Import Cloudinary upload function
    const { uploadProfileImage, validateImageFile } = await import('../../utils/cloudinaryUpload');
    
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid file');
      return;
    }

    setUploading(true);
    setUploadError(null);
    
    try {
      // Upload to Cloudinary
      const imageUrl = await uploadProfileImage(file);
      
      // Update form with Cloudinary URL
      setEditForm(prev => ({ ...prev, profileImage: imageUrl }));
    } catch (error) {
      console.error('Profile image upload failed:', error);
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [setEditForm]);

  return {
    handleCoverImageUpload,
    handleProfileImageUpload,
    uploading,
    uploadError,
    setUploadError
  };
};

export const useCredentialsHandlers = (
  editingCredentials: Credential[],
  setEditingCredentials: React.Dispatch<React.SetStateAction<Credential[]>>,
  editingCredentialData: {[key: number]: any},
  setEditingCredentialData: React.Dispatch<React.SetStateAction<{[key: number]: any}>>,
  setEditingCredential: React.Dispatch<React.SetStateAction<number | null>>,
  newCredentialData: {title: string, institution: string, year: string},
  setNewCredentialData: React.Dispatch<React.SetStateAction<{title: string, institution: string, year: string}>>,
  setShowAddCredential: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const isValidYear = useCallback((year: string) => {
    const yearPattern = /^\d{4}$/;
    const currentYear = new Date().getFullYear();
    const yearNum = parseInt(year);
    return yearPattern.test(year) && yearNum >= 1900 && yearNum <= currentYear + 1;
  }, []);

  const handleAddCredential = useCallback(() => {
    if (!newCredentialData.title || !newCredentialData.institution || !newCredentialData.year) {
      return;
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
  }, [editingCredentials, newCredentialData, setEditingCredentials, setNewCredentialData, setShowAddCredential]);

  const handleEditCredential = useCallback((id: number, field: string, value: string | number) => {
    setEditingCredentialData(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  }, [setEditingCredentialData]);

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
  }, [editingCredentialData, setEditingCredentials, setEditingCredentialData, setEditingCredential]);

  const handleCancelCredentialEdit = useCallback((id: number) => {
    setEditingCredentialData(prev => {
      const { [id]: removed, ...rest } = prev;
      return rest;
    });
    setEditingCredential(null);
  }, [setEditingCredentialData, setEditingCredential]);

  const handleStartCredentialEdit = useCallback((credential: any) => {
    setEditingCredential(credential.id);
    setEditingCredentialData(prev => ({
      ...prev,
      [credential.id]: { ...credential }
    }));
  }, [setEditingCredential, setEditingCredentialData]);

  const handleDeleteCredential = useCallback((id: number) => {
    setEditingCredentials(prev => prev.filter(cred => cred.id !== id));
    setEditingCredential(null);
  }, [setEditingCredentials, setEditingCredential]);

  const hasCredentialChanged = useCallback((credentialId: number, originalCredential: any) => {
    const editedData = editingCredentialData[credentialId];
    if (!editedData) return false;
    
    return (
      editedData.title !== originalCredential.title ||
      editedData.institution !== originalCredential.institution ||
      editedData.year !== originalCredential.year
    );
  }, [editingCredentialData]);

  return {
    isValidYear,
    handleAddCredential,
    handleEditCredential,
    handleSaveCredential,
    handleCancelCredentialEdit,
    handleStartCredentialEdit,
    handleDeleteCredential,
    hasCredentialChanged
  };
};

export const useLanguageHandlers = (
  editingLanguages: Language[],
  setEditingLanguages: React.Dispatch<React.SetStateAction<Language[]>>
) => {
  const handleAddLanguage = useCallback((language: Language) => {
    if (language.trim() && !editingLanguages.includes(language.trim() as Language)) {
      setEditingLanguages(prev => [...prev, language.trim() as Language]);
    }
  }, [editingLanguages, setEditingLanguages]);

  const handleRemoveLanguage = useCallback((languageToRemove: Language) => {
    setEditingLanguages(prev => prev.filter(lang => lang !== languageToRemove));
  }, [setEditingLanguages]);

  return {
    handleAddLanguage,
    handleRemoveLanguage
  };
};

export const useSpecializationHandlers = (
  editingSpecializations: string[],
  setEditingSpecializations: React.Dispatch<React.SetStateAction<string[]>>,
  newSpecialization: string,
  setNewSpecialization: React.Dispatch<React.SetStateAction<string>>
) => {
  const handleAddSpecialization = useCallback(() => {
    if (newSpecialization.trim() && !editingSpecializations.includes(newSpecialization.trim())) {
      setEditingSpecializations(prev => [...prev, newSpecialization.trim()]);
      setNewSpecialization('');
    }
  }, [newSpecialization, editingSpecializations, setEditingSpecializations, setNewSpecialization]);

  const handleRemoveSpecialization = useCallback((specializationToRemove: string) => {
    setEditingSpecializations(prev => prev.filter(spec => spec !== specializationToRemove));
  }, [setEditingSpecializations]);

  const handleSpecializationInputKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSpecialization();
    }
  }, [handleAddSpecialization]);

  return {
    handleAddSpecialization,
    handleRemoveSpecialization,
    handleSpecializationInputKeyPress
  };
};

export const useAchievementHandlers = (
  editingAchievements: Achievement[],
  setEditingAchievements: React.Dispatch<React.SetStateAction<Achievement[]>>,
  editingAchievementData: {[key: number]: any},
  setEditingAchievementData: React.Dispatch<React.SetStateAction<{[key: number]: any}>>,
  setEditingAchievement: React.Dispatch<React.SetStateAction<number | null>>,
  newAchievementData: {title: string, description: string, date: string},
  setNewAchievementData: React.Dispatch<React.SetStateAction<{title: string, description: string, date: string}>>,
  setShowAddAchievement: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const isValidYear = useCallback((year: string) => {
    const yearPattern = /^\d{4}$/;
    const currentYear = new Date().getFullYear();
    const yearNum = parseInt(year);
    return yearPattern.test(year) && yearNum >= 1900 && yearNum <= currentYear + 1;
  }, []);

  const handleAddAchievement = useCallback(() => {
    if (!newAchievementData.title || !newAchievementData.description || !newAchievementData.date) {
      return;
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
  }, [editingAchievements, newAchievementData, setEditingAchievements, setNewAchievementData, setShowAddAchievement]);

  const handleEditAchievement = useCallback((id: number, field: string, value: string) => {
    setEditingAchievementData(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  }, [setEditingAchievementData]);

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
  }, [editingAchievementData, setEditingAchievements, setEditingAchievementData, setEditingAchievement]);

  const handleCancelAchievementEdit = useCallback((id: number) => {
    setEditingAchievementData(prev => {
      const { [id]: removed, ...rest } = prev;
      return rest;
    });
    setEditingAchievement(null);
  }, [setEditingAchievementData, setEditingAchievement]);

  const handleStartAchievementEdit = useCallback((achievement: any) => {
    setEditingAchievement(achievement.id);
    setEditingAchievementData(prev => ({
      ...prev,
      [achievement.id]: { ...achievement }
    }));
  }, [setEditingAchievement, setEditingAchievementData]);

  const handleDeleteAchievement = useCallback((id: number) => {
    setEditingAchievements(prev => prev.filter(ach => ach.id !== id));
    setEditingAchievement(null);
  }, [setEditingAchievements, setEditingAchievement]);

  const hasAchievementChanged = useCallback((achievementId: number, originalAchievement: any) => {
    const editedData = editingAchievementData[achievementId];
    if (!editedData) return false;
    
    return (
      editedData.title !== originalAchievement.title ||
      editedData.description !== originalAchievement.description ||
      editedData.date !== originalAchievement.date
    );
  }, [editingAchievementData]);

  return {
    isValidYear,
    handleAddAchievement,
    handleEditAchievement,
    handleSaveAchievement,
    handleCancelAchievementEdit,
    handleStartAchievementEdit,
    handleDeleteAchievement,
    hasAchievementChanged
  };
};
