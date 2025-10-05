import React from 'react';
import { Camera, Edit3, X, Check } from 'lucide-react';
import { CounsellorProfile } from '../types';

interface ProfileHeaderProps {
  profile: CounsellorProfile;
  editForm: Partial<CounsellorProfile>;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onCoverImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onProfileImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isSaving?: boolean;
  uploading?: boolean;
  uploadError?: string | null;
  setUploadError?: (error: string | null) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  editForm,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onCoverImageUpload,
  onProfileImageUpload,
  isSaving = false,
  uploading = false,
  uploadError = null,
  setUploadError
}) => {

  return (
    <div className="relative mb-6">
      {/* Cover Image */}
      <div className="relative h-28 md:h-40 rounded-2xl overflow-hidden bg-slate-100">
        <img 
          src={isEditing ? editForm.coverImage || profile.coverImage : profile.coverImage} 
          alt="Cover" 
          className="w-full h-full object-cover"
        />
        {isEditing && (
          <label 
            htmlFor="cover-image-upload"
            className={`absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {uploading ? (
              <div className="w-5 h-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Camera className="w-5 h-5" />
            )}
          </label>
        )}
      </div>
      
      {/* Cover Image Upload */}
      {isEditing && (
        <input
          type="file"
          accept="image/*"
          onChange={onCoverImageUpload}
          className="hidden"
          disabled={uploading}
          id="cover-image-upload"
        />
      )}

      {/* Upload error message for cover image */}
      {isEditing && uploadError && (
        <div className="absolute top-16 right-4 bg-red-50 border border-red-200 rounded p-2 text-xs text-red-600 shadow-lg z-50">
          {uploadError}
          <button
            onClick={() => setUploadError?.(null)}
            className="ml-2 text-red-400 hover:text-red-600"
          >
            ×
          </button>
        </div>
      )}

      {/* Profile Image */}
      <div className="absolute -bottom-16 left-6">
        <div className="relative">
          <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
            <img 
              src={isEditing ? editForm.profileImage || profile.profileImage : profile.profileImage} 
              alt={`Dr. ${profile.firstName}`}
              className="w-full h-full object-cover"
            />
          </div>
          {isEditing && (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={onProfileImageUpload}
                className="hidden"
                disabled={uploading}
                id="profile-image-upload"
              />
              <label 
                htmlFor="profile-image-upload"
                className={`absolute bottom-2 right-2 bg-slate-400 hover:bg-primary text-white p-2 rounded-full transition-colors shadow-lg cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {uploading ? (
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </label>
            </>
          )}
          
          {/* Profile Image Upload Error */}
          {isEditing && uploadError && (
            <div className="absolute top-full left-0 mt-2 bg-red-50 border border-red-200 rounded p-2 text-xs text-red-600 shadow-lg z-50 w-64">
              {uploadError}
              <button
                onClick={() => setUploadError?.(null)}
                className="ml-2 text-red-400 hover:text-red-600"
              >
                ×
              </button>
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
            disabled={isSaving}
            className={`p-2 rounded-full transition-all shadow-lg text-white ${
              isSaving 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-slate-400 hover:bg-primary'
            }`}
          >
            {isSaving ? (
              <div className="w-5 h-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Check className="w-5 h-5" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;
