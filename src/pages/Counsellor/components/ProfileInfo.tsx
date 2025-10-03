import React from 'react';
import { MapPin, Calendar, Globe, Instagram, Linkedin } from 'lucide-react';
import { CounsellorProfile } from '../types';
import StatusIndicator from './StatusIndicator';

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

interface ProfileInfoProps {
  profile: CounsellorProfile;
  editForm: Partial<CounsellorProfile>;
  isEditing: boolean;
  onInputChange: (field: string, value: any) => void;
  onStatusChange: (status: 'available' | 'busy' | 'offline') => void;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  profile,
  editForm,
  isEditing,
  onInputChange,
  onStatusChange
}) => {
  return (
    <div className="mt-20 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          {!isEditing ? (
            <>
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Dr. {profile.firstName}
                </h1>
                <StatusIndicator 
                  status={profile.status}
                  lastActiveAt={profile.lastActiveAt}
                  onStatusChange={onStatusChange}
                />
              </div>
              <p className="text-gray-600 mb-4 leading-relaxed">{profile.bio}</p>
            </>
          ) : (
            <>
              <div className="mb-3">
                <input
                  key="firstName"
                  type="text"
                  value={editForm.firstName || ''}
                  onChange={(e) => onInputChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary"
                  placeholder="Full Name (Dr. will be added automatically)"
                />
              </div>
              <textarea
                key="bio"
                value={editForm.bio || ''}
                onChange={(e) => onInputChange('bio', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 resize-none"
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
                  onChange={(e) => onInputChange('location', e.target.value)}
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
                <a href={`https://${profile.website}`} className="hover:text-primary transition-colors">
                  {profile.website}
                </a>
              ) : (
                <input
                  key="website"
                  type="text"
                  value={editForm.website || ''}
                  onChange={(e) => onInputChange('website', e.target.value)}
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
                    onChange={(e) => onInputChange('socialLinks', { 
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
                    onChange={(e) => onInputChange('socialLinks', { 
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
                    onChange={(e) => onInputChange('socialLinks', { 
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
  );
};

export default ProfileInfo;
