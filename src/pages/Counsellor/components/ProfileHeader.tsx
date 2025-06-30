import React from 'react';
import { Camera, Edit3, X, Check } from 'lucide-react';
import { CounsellorProfile } from '../types';

interface ProfileHeaderProps {
  profile: CounsellorProfile;
  editForm: Partial<CounsellorProfile>;
  isEditing: boolean;
  showCoverImageOptions: boolean;
  showProfileImageOptions: boolean;
  setShowCoverImageOptions: (show: boolean) => void;
  setShowProfileImageOptions: (show: boolean) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onCoverImageChange: (image: string) => void;
  onProfileImageChange: (image: string) => void;
  onCoverImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onProfileImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  editForm,
  isEditing,
  showCoverImageOptions,
  showProfileImageOptions,
  setShowCoverImageOptions,
  setShowProfileImageOptions,
  onEdit,
  onSave,
  onCancel,
  onCoverImageChange,
  onProfileImageChange,
  onCoverImageUpload,
  onProfileImageUpload
}) => {
  const availableCoverImages = [
    "/assets/images/bg-trans.jpeg",
    "/assets/images/bg-trans.jpg",
  ];

  const availableProfileImages = [
    "/assets/images/profile-photo.png",
    "/assets/images/student-photo.png",
    "/assets/images/patient-photo.png",
  ];

  return (
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
      
      {/* Cover Image Selection Dropdown */}
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
                onChange={onCoverImageUpload}
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
                onClick={() => onCoverImageChange(image)}
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
                    onChange={onProfileImageUpload}
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
                    onClick={() => onProfileImageChange(image)}
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
          onClick={onEdit}
          className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 px-4 py-2 rounded-full font-medium transition-all shadow-lg flex items-center gap-2"
        >
          <Edit3 className="w-4 h-4" />
          Edit Profile
        </button>
      ) : (
        <div className="absolute top-4 right-4 flex gap-2">
          <button 
            onClick={onCancel}
            className="bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full transition-all shadow-lg"
          >
            <X className="w-5 h-5" />
          </button>
          <button 
            onClick={onSave}
            className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-full transition-all shadow-lg"
          >
            <Check className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;
