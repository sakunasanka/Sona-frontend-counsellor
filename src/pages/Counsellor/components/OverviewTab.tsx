import React from 'react';
import { BookOpen, Globe, Mail, Phone } from 'lucide-react';
import { CounsellorProfile } from '../types';

interface OverviewTabProps {
  profile: CounsellorProfile;
  isEditing: boolean;
  editingLanguages: string[];
  newLanguage: string;
  setNewLanguage: (value: string) => void;
  editingSpecializations: string[];
  newSpecialization: string;
  setNewSpecialization: (value: string) => void;
  onAddLanguage: () => void;
  onRemoveLanguage: (language: string) => void;
  onLanguageInputKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onAddSpecialization: () => void;
  onRemoveSpecialization: (specialization: string) => void;
  onSpecializationInputKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  profile,
  isEditing,
  editingLanguages,
  newLanguage,
  setNewLanguage,
  editingSpecializations,
  newSpecialization,
  setNewSpecialization,
  onAddLanguage,
  onRemoveLanguage,
  onLanguageInputKeyPress,
  onAddSpecialization,
  onRemoveSpecialization,
  onSpecializationInputKeyPress
}) => {
  return (
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
                    onClick={() => onRemoveSpecialization(spec)}
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
                onKeyPress={onSpecializationInputKeyPress}
              />
              <button
                type="button"
                onClick={onAddSpecialization}
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
                    onClick={() => onRemoveLanguage(lang)}
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
                onKeyPress={onLanguageInputKeyPress}
              />
              <button
                type="button"
                onClick={onAddLanguage}
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
  );
};

export default OverviewTab;
