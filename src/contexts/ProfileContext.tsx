import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCounsellorProfile, type CounsellorProfileData } from '../api/counsellorAPI';

interface ProfileContextType {
  profile: CounsellorProfileData | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const [profile, setProfile] = useState<CounsellorProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const profileData = await getCounsellorProfile();
      // Apply fallback logic for profile image
      const processedProfileData = {
        ...profileData,
        profileImage: (profileData.profileImage && profileData.profileImage.trim() !== '') 
          ? profileData.profileImage 
          : 'https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png'
      };
      setProfile(processedProfileData);
    } catch (err: any) {
      console.error('Failed to fetch profile:', err);
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const value: ProfileContextType = {
    profile,
    loading,
    error,
    refreshProfile
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};