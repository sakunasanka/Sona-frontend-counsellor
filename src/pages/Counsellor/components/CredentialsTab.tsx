import React from 'react';
import { Award, Clock, AlertCircle } from 'lucide-react';
import { Credential } from '../types';

interface CredentialsTabProps {
  editingCredentials: Credential[];
  setEditingCredentials: React.Dispatch<React.SetStateAction<Credential[]>>;
  editingCredential: number | null;
  setEditingCredential: React.Dispatch<React.SetStateAction<number | null>>;
  editingCredentialData: {[key: number]: any};
  setEditingCredentialData: React.Dispatch<React.SetStateAction<{[key: number]: any}>>;
  showAddCredential: boolean;
  setShowAddCredential: React.Dispatch<React.SetStateAction<boolean>>;
  newCredentialData: {title: string, institution: string, year: string};
  setNewCredentialData: React.Dispatch<React.SetStateAction<{title: string, institution: string, year: string}>>;
  onAddCredential: () => void;
  onEditCredential: (id: number, field: string, value: string | number) => void;
  onSaveCredential: (id: number) => void;
  onCancelCredentialEdit: (id: number) => void;
  onStartCredentialEdit: (credential: any) => void;
  onDeleteCredential: (id: number) => void;
  isValidYear: (year: string) => boolean;
  hasCredentialChanged: (credentialId: number, originalCredential: any) => boolean;
}

const CredentialsTab: React.FC<CredentialsTabProps> = ({
  editingCredentials,
  editingCredential,
  editingCredentialData,
  showAddCredential,
  setShowAddCredential,
  newCredentialData,
  setNewCredentialData,
  onAddCredential,
  onEditCredential,
  onSaveCredential,
  onCancelCredentialEdit,
  onStartCredentialEdit,
  onDeleteCredential,
  isValidYear,
  hasCredentialChanged
}) => {
  return (
    <div className="space-y-6">
      {/* Approved Credentials */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-buttonBlue-500" />
            Educational Qualifications
          </h3>
          <button
            onClick={() => setShowAddCredential(!showAddCredential)}
            className="bg-buttonBlue-500 hover:bg-buttonBlue-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center gap-1"
          >
            + Add Qualification
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-transparent text-sm"
              />
              <input
                type="text"
                placeholder="Institution"
                value={newCredentialData.institution}
                onChange={(e) => setNewCredentialData(prev => ({ ...prev, institution: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-transparent text-sm"
              />
              <input
                type="number"
                placeholder="Year"
                min="1900"
                max={new Date().getFullYear() + 1}
                value={newCredentialData.year}
                onChange={(e) => setNewCredentialData(prev => ({ ...prev, year: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-pink-500 focus:border-transparent text-sm ${
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
                  onClick={onAddCredential}
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
            <div key={credential.id} className="border-l-4 border-buttonBlue-500 pl-4 py-2 relative group">
              {editingCredential === credential.id ? (
                <div className="space-y-2">
                  <input
                    key={`title-${credential.id}`}
                    type="text"
                    value={editingCredentialData[credential.id]?.title ?? credential.title}
                    onChange={(e) => onEditCredential(credential.id, 'title', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm font-semibold"
                  />
                  <input
                    key={`institution-${credential.id}`}
                    type="text"
                    value={editingCredentialData[credential.id]?.institution ?? credential.institution}
                    onChange={(e) => onEditCredential(credential.id, 'institution', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-gray-600"
                  />
                  <input
                    key={`year-${credential.id}`}
                    type="number"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    value={editingCredentialData[credential.id]?.year ?? credential.year}
                    onChange={(e) => onEditCredential(credential.id, 'year', parseInt(e.target.value))}
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
                      onClick={() => onSaveCredential(credential.id)}
                      disabled={!isValidYear(String(editingCredentialData[credential.id]?.year ?? credential.year)) || !hasCredentialChanged(credential.id, credential)}
                      className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-2 py-1 rounded text-xs"
                    >
                      Resubmit for Review
                    </button>
                    <button
                      onClick={() => onCancelCredentialEdit(credential.id)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => onDeleteCredential(credential.id)}
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
                    onClick={() => onStartCredentialEdit(credential)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-80 hover:opacity-100 bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs"
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
                    <input
                      key={`title-${credential.id}`}
                      type="text"
                      value={editingCredentialData[credential.id]?.title ?? credential.title}
                      onChange={(e) => onEditCredential(credential.id, 'title', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm font-semibold"
                    />
                    <input
                      key={`institution-${credential.id}`}
                      type="text"
                      value={editingCredentialData[credential.id]?.institution ?? credential.institution}
                      onChange={(e) => onEditCredential(credential.id, 'institution', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-gray-600"
                    />
                    <input
                      key={`year-${credential.id}`}
                      type="number"
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      value={editingCredentialData[credential.id]?.year ?? credential.year}
                      onChange={(e) => onEditCredential(credential.id, 'year', parseInt(e.target.value))}
                      className={`w-full px-2 py-1 border rounded text-sm text-gray-500 ${
                        !isValidYear(String(editingCredentialData[credential.id]?.year ?? credential.year)) 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-300'
                      }`}
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => onSaveCredential(credential.id)}
                        disabled={!isValidYear(String(editingCredentialData[credential.id]?.year ?? credential.year)) || !hasCredentialChanged(credential.id, credential)}
                        className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-2 py-1 rounded text-xs"
                      >
                        Resubmit for Review
                      </button>
                      <button
                        onClick={() => onCancelCredentialEdit(credential.id)}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => onDeleteCredential(credential.id)}
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
                        onClick={() => onStartCredentialEdit(credential)}
                        className="opacity-0 group-hover:opacity-80 hover:opacity-100 bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs"
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
  );
};

export default CredentialsTab;
