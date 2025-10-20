import React from 'react';
import { BookOpen, Globe, Mail, Phone } from 'lucide-react';
import { CounsellorProfile } from '../types';
import { AVAILABLE_LANGUAGES, Language } from '../constants';
import PhoneInput from '../../../components/ui/PhoneInput';

interface OverviewTabProps {
  profile: CounsellorProfile;
  isEditing: boolean;
  editingLanguages: Language[];
  editingSpecializations: string[];
  newSpecialization: string;
  setNewSpecialization: (value: string) => void;
  onAddLanguage: (language: Language) => void;
  onRemoveLanguage: (language: Language) => void;
  onAddSpecialization: () => void;
  onRemoveSpecialization: (specialization: string) => void;
  onSpecializationInputKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  editForm?: Partial<CounsellorProfile>;
  onInputChange?: (field: string, value: any) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  profile,
  isEditing,
  editingLanguages,
  editingSpecializations,
  newSpecialization,
  setNewSpecialization,
  onAddLanguage,
  onRemoveLanguage,
  onAddSpecialization,
  onRemoveSpecialization,
  onSpecializationInputKeyPress,
  editForm,
  onInputChange
}) => {
  return (
    <div className="space-y-6">
      {/* Specializations */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Specializations
        </h3>
        {!isEditing ? (
          <div className="flex flex-wrap gap-2">
            {profile.specializations.map((spec, index) => (
              <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
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
          <Globe className="w-5 h-5 text-primary" />
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
            {AVAILABLE_LANGUAGES.map((language) => {
              const isSelected = editingLanguages.includes(language);
              return (
                <div 
                  key={language}
                  onClick={() => isSelected ? onRemoveLanguage(language) : onAddLanguage(language)} 
                  className={`flex items-center p-2 rounded-lg border cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className={`w-4 h-4 rounded border flex-shrink-0 mr-2 flex items-center justify-center ${
                    isSelected ? 'bg-purple-500 border-purple-500' : 'border-gray-300'
                  }`}>
                    {isSelected && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">{language}</div>
                  </div>
                </div>
              );
            })}
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
            {!isEditing ? (
              <span className="text-gray-600">{profile.phone}</span>
            ) : (
              <div className="flex-1">
                <PhoneInput
                  value={editForm?.phone || ''}
                  onChange={(value) => onInputChange?.('phone', value)}
                  country="LK"
                  placeholder="Phone number"
                  showValidation={true}
                  autoFormat={true}
                  className="text-sm"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
