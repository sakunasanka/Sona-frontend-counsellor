import React, { useState, useEffect } from 'react';
import { NavBar, Sidebar } from "../../components/layout";
import type { CounsellorProfile as CounsellorProfileType } from './types';
import { AVAILABLE_LANGUAGES } from './constants';
import { useProfileState, useImageHandlers, useLanguageHandlers, useSpecializationHandlers, useCredentialsHandlers, useAchievementHandlers } from './hooks';
import { getCounsellorProfile, updateCounsellorProfile, type CounsellorProfileData } from '../../api/counsellorAPI';
import ProfileHeader from './components/ProfileHeader';
import ProfileInfo from './components/ProfileInfo';
import ProfileStats from './components/ProfileStats';
import TabNavigation from './components/TabNavigation';
import OverviewTab from './components/OverviewTab';
import CredentialsTab from './components/CredentialsTab';
import AchievementsTab from './components/AchievementsTab';

const CounsellorProfile: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'credentials' | 'achievements'>('overview');
  const [profileData, setProfileData] = useState<CounsellorProfileType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Convert API data to component format
  const convertApiDataToProfile = (apiData: CounsellorProfileData): CounsellorProfileType => {
    // Combine firstName and lastName into a single name field, remove Dr. prefix if present
    const fullName = `${apiData.firstName || ''} ${apiData.lastName || ''}`.trim();
    const nameWithoutDr = fullName.replace(/^Dr\.\s*/i, ''); // Remove Dr. prefix if present
    
    return {
      id: apiData.id || 0,
      firstName: nameWithoutDr, // Store full name without Dr. prefix
      lastName: '', // Keep empty for backward compatibility
      profileImage: apiData.profileImage || '/assets/images/doctor__circle_2.png',
      coverImage: apiData.coverImage || '/assets/images/counsellor-banner.jpg',
      bio: apiData.bio || '',
      location: apiData.location || '',
      website: apiData.website || '',
      email: apiData.email || '',
      phone: apiData.phone || '',
      joinDate: apiData.joinDate ? new Date(apiData.joinDate).toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      }) : '',
      specializations: apiData.specializations || [],
      languages: (apiData.languages || []).filter((lang): lang is 'English' | 'Sinhala' | 'Tamil' => 
        ['English', 'Sinhala', 'Tamil'].includes(lang)
      ),
      experience: apiData.experience || 0,
      rating: apiData.rating || 0,
      totalReviews: apiData.totalReviews || 0,
      totalSessions: apiData.totalSessions || 0,
      totalClients: apiData.totalClients || 0,
      status: apiData.status === 'away' ? 'offline' : (apiData.status || 'available'),
      lastActiveAt: apiData.lastActiveAt || new Date().toISOString(),
      socialLinks: apiData.socialLinks || { instagram: '', linkedin: '', x: '' },
      credentials: apiData.credentials || [],
      achievements: apiData.achievements || []
    };
  };

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiData = await getCounsellorProfile();
        const convertedData = convertApiDataToProfile(apiData);
        setProfileData(convertedData);
      } catch (err: any) {
        console.error('Failed to fetch profile data:', err);
        setError(err.message || 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Default/fallback profile data
  const defaultProfile: CounsellorProfileType = {
    id: 0,
    firstName: "", // This will store the full name
    lastName: "", // Keep for backward compatibility
    profileImage: "/assets/images/doctor__circle_2.png",
    coverImage: "/assets/images/counsellor-banner.jpg",
    bio: "",
    location: "",
    website: "",
    email: "",
    phone: "",
    joinDate: "",
    specializations: [],
    languages: [],
    experience: 0,
    rating: 0,
    totalReviews: 0,
    totalSessions: 0,
    totalClients: 0,
    status: 'available',
    lastActiveAt: new Date().toISOString(),
    socialLinks: {
      instagram: "",
      linkedin: "",
      x: ""
    },
    credentials: [],
    achievements: []
  };

  const currentProfile = profileData || defaultProfile;

  // Handle profile save with API call
  const handleProfileSave = () => {
    (async () => {
      try {
        setSaving(true);
        setError(null);
        
        // Get only the changed fields from editForm
        const changedFields: any = {};
        
        // Helper function to add URL prefix if needed
        const formatUrl = (url: string): string => {
          if (!url || url.trim() === '') return '';
          const trimmedUrl = url.trim();
          if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
            return trimmedUrl;
          }
          return `https://${trimmedUrl}`;
        };
        
        // Helper function to format social media handles
        const formatSocialHandle = (handle: string, platform: string): string => {
          if (!handle || handle.trim() === '') return '';
          const trimmedHandle = handle.trim();
          
          // Remove existing URLs or @ symbols
          let cleanHandle = trimmedHandle
            .replace(/^@/, '')
            .replace(/^https?:\/\//, '')
            .replace(/^www\./, '');
          
          // Remove platform-specific domains
          if (platform === 'instagram') {
            cleanHandle = cleanHandle.replace(/^instagram\.com\//, '');
          } else if (platform === 'linkedin') {
            cleanHandle = cleanHandle.replace(/^linkedin\.com\/(in\/)?/, '');
          } else if (platform === 'x') {
            cleanHandle = cleanHandle.replace(/^(twitter\.com\/|x\.com\/)/, '');
          }
          
          return cleanHandle.startsWith('@') ? cleanHandle : `@${cleanHandle}`;
        };

        // Handle name field - split full name for API
        if (profileState.editForm.firstName !== undefined && profileState.editForm.firstName !== profileState.profile.firstName) {
          const fullName = String(profileState.editForm.firstName || '').trim();
          const nameParts = fullName.split(' ');
          
          if (nameParts.length === 1) {
            // Single name - put everything in firstName
            changedFields.firstName = nameParts[0];
            changedFields.lastName = '';
          } else {
            // Multiple names - first word as firstName, rest as lastName
            changedFields.firstName = nameParts[0];
            changedFields.lastName = nameParts.slice(1).join(' ');
          }
        }
        
        if (profileState.editForm.bio !== undefined && profileState.editForm.bio !== profileState.profile.bio) {
          changedFields.bio = String(profileState.editForm.bio || '').trim();
        }
        
        if (profileState.editForm.location !== undefined && profileState.editForm.location !== profileState.profile.location) {
          changedFields.location = String(profileState.editForm.location || '').trim();
        }
        
        if (profileState.editForm.website !== undefined && profileState.editForm.website !== profileState.profile.website) {
          const websiteValue = String(profileState.editForm.website || '').trim();
          if (websiteValue) {
            changedFields.website = formatUrl(websiteValue);
          }
        }
        
        if (profileState.editForm.phone !== undefined && profileState.editForm.phone !== profileState.profile.phone) {
          changedFields.phone = String(profileState.editForm.phone || '').trim();
        }
        
        if (profileState.editForm.profileImage !== undefined && profileState.editForm.profileImage !== profileState.profile.profileImage) {
          const profileImageValue = String(profileState.editForm.profileImage || '').trim();
          if (profileImageValue) {
            changedFields.profileImage = profileImageValue.startsWith('http') ? profileImageValue : formatUrl(profileImageValue);
          }
        }
        
        if (profileState.editForm.coverImage !== undefined && profileState.editForm.coverImage !== profileState.profile.coverImage) {
          const coverImageValue = String(profileState.editForm.coverImage || '').trim();
          if (coverImageValue) {
            changedFields.coverImage = coverImageValue.startsWith('http') ? coverImageValue : formatUrl(coverImageValue);
          }
        }

        // Check if languages changed
        if (JSON.stringify(profileState.editingLanguages) !== JSON.stringify(profileState.profile.languages)) {
          changedFields.languages = profileState.editingLanguages.filter(lang => lang && lang.trim());
        }

        // Check if specializations changed
        if (JSON.stringify(profileState.editingSpecializations) !== JSON.stringify(profileState.profile.specializations)) {
          changedFields.specializations = profileState.editingSpecializations.filter(spec => spec && spec.trim());
        }

        // Handle social links changes
        const currentSocialLinks = profileState.profile.socialLinks || {};
        const editSocialLinks = profileState.editForm.socialLinks || {};
        
        if (editSocialLinks.instagram !== undefined && editSocialLinks.instagram !== currentSocialLinks.instagram) {
          if (!changedFields.socialLinks) changedFields.socialLinks = {};
          changedFields.socialLinks.instagram = formatSocialHandle(editSocialLinks.instagram || '', 'instagram');
        }
        
        if (editSocialLinks.linkedin !== undefined && editSocialLinks.linkedin !== currentSocialLinks.linkedin) {
          if (!changedFields.socialLinks) changedFields.socialLinks = {};
          changedFields.socialLinks.linkedin = formatSocialHandle(editSocialLinks.linkedin || '', 'linkedin');
        }
        
        if (editSocialLinks.x !== undefined && editSocialLinks.x !== currentSocialLinks.x) {
          if (!changedFields.socialLinks) changedFields.socialLinks = {};
          changedFields.socialLinks.x = formatSocialHandle(editSocialLinks.x || '', 'x');
        }

        // Check if credentials changed
        if (JSON.stringify(profileState.editingCredentials) !== JSON.stringify(profileState.profile.credentials)) {
          changedFields.credentials = profileState.editingCredentials;
        }

        // Check if achievements changed
        if (JSON.stringify(profileState.editingAchievements) !== JSON.stringify(profileState.profile.achievements)) {
          changedFields.achievements = profileState.editingAchievements;
        }

        console.log('Only changed fields to be sent:', changedFields);
        console.log('JSON payload:', JSON.stringify(changedFields, null, 2));

        if (Object.keys(changedFields).length === 0) {
          console.log('No changes detected, skipping API call');
          await profileState.handleSave();
          return;
        }
        
        // Call the API with only changed fields
        const updatedProfile = await updateCounsellorProfile(changedFields);
        
        // Update local state with the response
        const convertedData = convertApiDataToProfile(updatedProfile);
        setProfileData(convertedData);
        
        // Call the original save handler to update UI state
        const result = await profileState.handleSave();
        
        if (result.success) {
          console.log('Profile updated successfully!');
        }
        
      } catch (err: any) {
        console.error('Failed to update profile:', err);
        // Show the actual server error message
        const errorMessage = err.details?.message || err.message || 'Failed to update profile';
        setError(errorMessage);
      } finally {
        setSaving(false);
      }
    })();
  };

  // Use custom hooks for state management
  const profileState = useProfileState(currentProfile);
  const imageHandlers = useImageHandlers(
    profileState.setEditForm,
    profileState.setShowCoverImageOptions,
    profileState.setShowProfileImageOptions
  );
  const languageHandlers = useLanguageHandlers(
    profileState.editingLanguages,
    profileState.setEditingLanguages
  );
  const specializationHandlers = useSpecializationHandlers(
    profileState.editingSpecializations,
    profileState.setEditingSpecializations,
    profileState.newSpecialization,
    profileState.setNewSpecialization
  );
  const credentialsHandlers = useCredentialsHandlers(
    profileState.editingCredentials,
    profileState.setEditingCredentials,
    profileState.editingCredentialData,
    profileState.setEditingCredentialData,
    profileState.setEditingCredential,
    profileState.newCredentialData,
    profileState.setNewCredentialData,
    profileState.setShowAddCredential
  );
  const achievementHandlers = useAchievementHandlers(
    profileState.editingAchievements,
    profileState.setEditingAchievements,
    profileState.editingAchievementData,
    profileState.setEditingAchievementData,
    profileState.setEditingAchievement,
    profileState.newAchievementData,
    profileState.setNewAchievementData,
    profileState.setShowAddAchievement
  );

  // Close image selection dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (profileState.showCoverImageOptions && !target.closest('.cover-image-dropdown') && !target.closest('.cover-image-button')) {
        profileState.setShowCoverImageOptions(false);
      }
      if (profileState.showProfileImageOptions && !target.closest('.profile-image-dropdown') && !target.closest('.profile-image-button')) {
        profileState.setShowProfileImageOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileState.showCoverImageOptions, profileState.showProfileImageOptions]);

  const toggleSidebar = (): void => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = (): void => {
    setSidebarOpen(false);
  };

  const handleTabChange = (tab: 'overview' | 'credentials' | 'achievements') => {
    setActiveTab(tab);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex flex-1 overflow-hidden">
          <div className="hidden lg:block">
            <Sidebar isOpen={true} onClose={closeSidebar} />
          </div>
          <div className="lg:hidden">
            <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
          </div>
          <div className="flex-1 overflow-auto">
            <NavBar onMenuClick={toggleSidebar} />
            <div className="p-4 lg:p-6 flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Loading profile...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex flex-1 overflow-hidden">
          <div className="hidden lg:block">
            <Sidebar isOpen={true} onClose={closeSidebar} />
          </div>
          <div className="lg:hidden">
            <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
          </div>
          <div className="flex-1 overflow-auto">
            <NavBar onMenuClick={toggleSidebar} />
            <div className="p-4 lg:p-6">
              <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
                <p className="font-medium">Error loading profile</p>
                <p className="text-sm">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-2 text-sm underline hover:no-underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar */}
        <div className="hidden lg:block">
          <Sidebar isOpen={true} onClose={closeSidebar} />
        </div>
        
        {/* Mobile Sidebar */}
        <div className="lg:hidden">
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <NavBar onMenuClick={toggleSidebar} />
          <div className="p-4 lg:p-6 max-w-5xl mx-auto">
            <div >
              <ProfileHeader
                profile={profileState.profile}
                editForm={profileState.editForm}
                isEditing={profileState.isEditing}
                showCoverImageOptions={profileState.showCoverImageOptions}
                showProfileImageOptions={profileState.showProfileImageOptions}
                setShowCoverImageOptions={profileState.setShowCoverImageOptions}
                setShowProfileImageOptions={profileState.setShowProfileImageOptions}
                onEdit={profileState.handleEdit}
                onSave={handleProfileSave}
                onCancel={profileState.handleCancel}
                onCoverImageChange={imageHandlers.handleCoverImageChange}
                onProfileImageChange={imageHandlers.handleProfileImageChange}
                onCoverImageUpload={imageHandlers.handleCoverImageUpload}
                onProfileImageUpload={imageHandlers.handleProfileImageUpload}
                isSaving={saving}
              />
              
              <ProfileInfo
                profile={profileState.profile}
                editForm={profileState.editForm}
                isEditing={profileState.isEditing}
                onInputChange={profileState.handleInputChange}
                onStatusChange={profileState.handleStatusChange}
              />
              
              <ProfileStats
                totalSessions={profileState.profile.totalSessions}
                totalClients={profileState.profile.totalClients}
                rating={profileState.profile.rating}
                experience={profileState.profile.experience}
              />
              
              <TabNavigation 
                activeTab={activeTab}
                onTabChange={handleTabChange}
              />
              
              {activeTab === 'overview' && (
                <OverviewTab
                  profile={profileState.profile}
                  isEditing={profileState.isEditing}
                  editingLanguages={profileState.editingLanguages}
                  editingSpecializations={profileState.editingSpecializations}
                  newSpecialization={profileState.newSpecialization}
                  setNewSpecialization={profileState.setNewSpecialization}
                  onAddLanguage={languageHandlers.handleAddLanguage}
                  onRemoveLanguage={languageHandlers.handleRemoveLanguage}
                  onAddSpecialization={specializationHandlers.handleAddSpecialization}
                  onRemoveSpecialization={specializationHandlers.handleRemoveSpecialization}
                  onSpecializationInputKeyPress={specializationHandlers.handleSpecializationInputKeyPress}
                  editForm={profileState.editForm}
                  onInputChange={profileState.handleInputChange}
                />
              )}

              {activeTab === 'credentials' && (
                <CredentialsTab
                  editingCredentials={profileState.editingCredentials}
                  setEditingCredentials={profileState.setEditingCredentials}
                  editingCredential={profileState.editingCredential}
                  setEditingCredential={profileState.setEditingCredential}
                  editingCredentialData={profileState.editingCredentialData}
                  setEditingCredentialData={profileState.setEditingCredentialData}
                  showAddCredential={profileState.showAddCredential}
                  setShowAddCredential={profileState.setShowAddCredential}
                  newCredentialData={profileState.newCredentialData}
                  setNewCredentialData={profileState.setNewCredentialData}
                  onAddCredential={credentialsHandlers.handleAddCredential}
                  onEditCredential={credentialsHandlers.handleEditCredential}
                  onSaveCredential={credentialsHandlers.handleSaveCredential}
                  onCancelCredentialEdit={credentialsHandlers.handleCancelCredentialEdit}
                  onStartCredentialEdit={credentialsHandlers.handleStartCredentialEdit}
                  onDeleteCredential={credentialsHandlers.handleDeleteCredential}
                  isValidYear={credentialsHandlers.isValidYear}
                  hasCredentialChanged={credentialsHandlers.hasCredentialChanged}
                />
              )}

              {activeTab === 'achievements' && (
                <AchievementsTab
                  editingAchievements={profileState.editingAchievements}
                  setEditingAchievements={profileState.setEditingAchievements}
                  editingAchievement={profileState.editingAchievement}
                  setEditingAchievement={profileState.setEditingAchievement}
                  editingAchievementData={profileState.editingAchievementData}
                  setEditingAchievementData={profileState.setEditingAchievementData}
                  showAddAchievement={profileState.showAddAchievement}
                  setShowAddAchievement={profileState.setShowAddAchievement}
                  newAchievementData={profileState.newAchievementData}
                  setNewAchievementData={profileState.setNewAchievementData}
                  onAddAchievement={achievementHandlers.handleAddAchievement}
                  onEditAchievement={achievementHandlers.handleEditAchievement}
                  onSaveAchievement={achievementHandlers.handleSaveAchievement}
                  onCancelAchievementEdit={achievementHandlers.handleCancelAchievementEdit}
                  onStartAchievementEdit={achievementHandlers.handleStartAchievementEdit}
                  onDeleteAchievement={achievementHandlers.handleDeleteAchievement}
                  isValidYear={achievementHandlers.isValidYear}
                  hasAchievementChanged={achievementHandlers.hasAchievementChanged}
                />
              )}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounsellorProfile;