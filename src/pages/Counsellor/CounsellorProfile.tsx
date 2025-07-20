import React, { useState, useEffect } from 'react';
import { NavBar, Sidebar } from "../../components/layout";
import type { CounsellorProfile as CounsellorProfileType } from './types';
import { AVAILABLE_LANGUAGES } from './constants';
import { useProfileState, useImageHandlers, useLanguageHandlers, useSpecializationHandlers, useCredentialsHandlers, useAchievementHandlers } from './hooks';
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

  // Initial profile data
  const initialProfile: CounsellorProfileType = {
    id: 1,
    firstName: "Sarah",
    lastName: "Mitchell",
    profileImage: "/assets/images/profile-photo1.webp",
    coverImage: "/assets/images/bg-trans.jpeg",
    bio: "Passionate mental health counselor with 8+ years of experience helping individuals overcome anxiety, depression, and life transitions. I believe in creating a safe, non-judgmental space where healing can begin. 🌱",
    location: "Colombo, Sri Lanka",
    website: "www.sarahmitchelltherapy.com",
    email: "sarah.mitchell@therapy.com",
    phone: "+1 (555) 123-4567",
    joinDate: "January 2018",
    specializations: ["Anxiety Disorders", "Depression", "Trauma Therapy", "Relationship Counseling", "Mindfulness-Based Therapy"],
    languages: [...AVAILABLE_LANGUAGES],
    experience: 8,
    rating: 4.9,
    totalReviews: 127,
    totalSessions: 1450,
    totalClients: 324,
    status: 'available',
    lastActiveAt: new Date().toISOString(),
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
  };

  // Use custom hooks for state management
  const profileState = useProfileState(initialProfile);
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
                onSave={profileState.handleSave}
                onCancel={profileState.handleCancel}
                onCoverImageChange={imageHandlers.handleCoverImageChange}
                onProfileImageChange={imageHandlers.handleProfileImageChange}
                onCoverImageUpload={imageHandlers.handleCoverImageUpload}
                onProfileImageUpload={imageHandlers.handleProfileImageUpload}
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