import React from 'react';
import { Star, Clock, AlertCircle } from 'lucide-react';
import { Achievement } from '../types';

interface AchievementsTabProps {
  editingAchievements: Achievement[];
  setEditingAchievements: React.Dispatch<React.SetStateAction<Achievement[]>>;
  editingAchievement: number | null;
  setEditingAchievement: React.Dispatch<React.SetStateAction<number | null>>;
  editingAchievementData: {[key: number]: any};
  setEditingAchievementData: React.Dispatch<React.SetStateAction<{[key: number]: any}>>;
  showAddAchievement: boolean;
  setShowAddAchievement: React.Dispatch<React.SetStateAction<boolean>>;
  newAchievementData: {title: string, description: string, date: string};
  setNewAchievementData: React.Dispatch<React.SetStateAction<{title: string, description: string, date: string}>>;
  onAddAchievement: () => void;
  onEditAchievement: (id: number, field: string, value: string) => void;
  onSaveAchievement: (id: number) => void;
  onCancelAchievementEdit: (id: number) => void;
  onStartAchievementEdit: (achievement: any) => void;
  onDeleteAchievement: (id: number) => void;
  isValidYear: (year: string) => boolean;
  hasAchievementChanged: (achievementId: number, originalAchievement: any) => boolean;
}

const AchievementsTab: React.FC<AchievementsTabProps> = ({
  editingAchievements,
  editingAchievement,
  editingAchievementData,
  showAddAchievement,
  setShowAddAchievement,
  newAchievementData,
  setNewAchievementData,
  onAddAchievement,
  onEditAchievement,
  onSaveAchievement,
  onCancelAchievementEdit,
  onStartAchievementEdit,
  onDeleteAchievement,
  isValidYear,
  hasAchievementChanged
}) => {
  return (
    <div className="space-y-6">
      {/* Approved Achievements */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Star className="w-5 h-5 text-buttonBlue-500" />
            Achievements & Awards
          </h3>
          <button
            onClick={() => setShowAddAchievement(!showAddAchievement)}
            className="bg-buttonBlue-500 hover:bg-buttonBlue-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center gap-1"
          >
            + Add Achievement
          </button>
        </div>
        
        {/* Add new achievement form */}
        {showAddAchievement && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Add New Achievement</h4>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Achievement Title"
                value={newAchievementData.title}
                onChange={(e) => setNewAchievementData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-transparent text-sm"
              />
              <textarea
                placeholder="Achievement Description"
                value={newAchievementData.description}
                onChange={(e) => setNewAchievementData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-transparent text-sm resize-none"
                rows={3}
              />
              <input
                type="number"
                placeholder="Year"
                min="1900"
                max={new Date().getFullYear() + 1}
                value={newAchievementData.date}
                onChange={(e) => setNewAchievementData(prev => ({ ...prev, date: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-pink-500 focus:border-transparent text-sm ${
                  newAchievementData.date && !isValidYear(newAchievementData.date) 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300'
                }`}
              />
              {newAchievementData.date && !isValidYear(newAchievementData.date) && (
                <p className="text-red-600 text-xs mt-1">Please enter a valid 4-digit year between 1900 and {new Date().getFullYear() + 1}</p>
              )}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800 text-xs">
                  <strong>Note:</strong> This achievement will be submitted for admin review and won't be visible on your public profile until approved.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onAddAchievement}
                  disabled={!newAchievementData.title || !newAchievementData.description || !newAchievementData.date || !isValidYear(newAchievementData.date)}
                  className="bg-pink-500 hover:bg-pink-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-3 py-1 rounded-md text-sm transition-colors"
                >
                  Submit for Review
                </button>
                <button
                  onClick={() => {
                    setShowAddAchievement(false);
                    setNewAchievementData({ title: '', description: '', date: '' });
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
          {editingAchievements.filter(achievement => achievement.status === 'approved').map((achievement) => (
            <div key={achievement.id} className="border-l-4 border-buttonBlue-500 pl-4 py-2 relative group">
              {editingAchievement === achievement.id ? (
                <div className="space-y-2">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-2">
                    <p className="text-blue-800 text-xs">
                      Any changes will require admin re-approval before appearing on your public profile.
                    </p>
                  </div>
                  <input
                    key={`title-${achievement.id}`}
                    type="text"
                    value={editingAchievementData[achievement.id]?.title ?? achievement.title}
                    onChange={(e) => onEditAchievement(achievement.id, 'title', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm font-semibold"
                  />
                  <textarea
                    key={`description-${achievement.id}`}
                    value={editingAchievementData[achievement.id]?.description ?? achievement.description}
                    onChange={(e) => onEditAchievement(achievement.id, 'description', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-gray-600 resize-none"
                    rows={2}
                  />
                  <input
                    key={`date-${achievement.id}`}
                    type="number"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    value={editingAchievementData[achievement.id]?.date ?? achievement.date}
                    onChange={(e) => onEditAchievement(achievement.id, 'date', e.target.value)}
                    className={`w-full px-2 py-1 border rounded text-sm text-gray-500 ${
                      !isValidYear(editingAchievementData[achievement.id]?.date ?? achievement.date) 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300'
                    }`}
                  />
                  {!isValidYear(editingAchievementData[achievement.id]?.date ?? achievement.date) && (
                    <p className="text-red-600 text-xs mt-1">Please enter a valid 4-digit year between 1900 and {new Date().getFullYear() + 1}</p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => onSaveAchievement(achievement.id)}
                      disabled={!isValidYear(editingAchievementData[achievement.id]?.date ?? achievement.date) || !hasAchievementChanged(achievement.id, achievement)}
                      className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-2 py-1 rounded text-xs"
                    >
                      Resubmit for Review
                    </button>
                    <button
                      onClick={() => onCancelAchievementEdit(achievement.id)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => onDeleteAchievement(achievement.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                  <p className="text-gray-600">{achievement.description}</p>
                  <p className="text-sm text-gray-500">{achievement.date}</p>
                  <button
                    onClick={() => onStartAchievementEdit(achievement)}
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

      {/* Pending Achievements */}
      {editingAchievements.filter(achievement => achievement.status === 'pending').length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 shadow-sm border border-purple-200">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-purple-800">Pending Review</h3>
          </div>
          <div className="mb-4 p-3 bg-purple-100 rounded-lg border border-purple-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-purple-800 font-medium">Achievements awaiting admin approval</p>
                <p className="text-purple-700 mt-1">
                  Your submitted achievements are being reviewed by our admin team. 
                  This usually takes 2-3 business days. Once approved, they will appear in your public profile.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {editingAchievements.filter(achievement => achievement.status === 'pending').map((achievement) => (
              <div key={achievement.id} className="bg-white/70 rounded-lg p-4 border-l-4 border-purple-400 relative group">
                {editingAchievement === achievement.id ? (
                  <div className="space-y-2">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-2">
                      <p className="text-blue-800 text-xs">
                        <strong>Note:</strong> Any changes will require admin re-approval before appearing on your public profile.
                      </p>
                    </div>
                    <input
                      key={`title-${achievement.id}`}
                      type="text"
                      value={editingAchievementData[achievement.id]?.title ?? achievement.title}
                      onChange={(e) => onEditAchievement(achievement.id, 'title', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm font-semibold"
                    />
                    <textarea
                      key={`description-${achievement.id}`}
                      value={editingAchievementData[achievement.id]?.description ?? achievement.description}
                      onChange={(e) => onEditAchievement(achievement.id, 'description', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-gray-600 resize-none"
                      rows={2}
                    />
                    <input
                      key={`date-${achievement.id}`}
                      type="number"
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      value={editingAchievementData[achievement.id]?.date ?? achievement.date}
                      onChange={(e) => onEditAchievement(achievement.id, 'date', e.target.value)}
                      className={`w-full px-2 py-1 border rounded text-sm text-gray-500 ${
                        !isValidYear(editingAchievementData[achievement.id]?.date ?? achievement.date) 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-300'
                      }`}
                    />
                    {!isValidYear(editingAchievementData[achievement.id]?.date ?? achievement.date) && (
                      <p className="text-red-600 text-xs mt-1">Please enter a valid 4-digit year between 1900 and {new Date().getFullYear() + 1}</p>
                    )}
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => onSaveAchievement(achievement.id)}
                        disabled={!isValidYear(editingAchievementData[achievement.id]?.date ?? achievement.date) || !hasAchievementChanged(achievement.id, achievement)}
                        className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-2 py-1 rounded text-xs"
                      >
                        Resubmit for Review
                      </button>
                      <button
                        onClick={() => onCancelAchievementEdit(achievement.id)}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => onDeleteAchievement(achievement.id)}
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
                          {achievement.title}
                          <span className="bg-purple-200 text-purple-800 text-xs px-2 py-1 rounded-full font-medium">
                            Under Review
                          </span>
                        </h4>
                        <p className="text-gray-600">{achievement.description}</p>
                        <p className="text-sm text-gray-500">{achievement.date}</p>
                        {achievement.submittedAt && (
                          <p className="text-xs text-purple-600 mt-1">
                            Submitted {new Date(achievement.submittedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => onStartAchievementEdit(achievement)}
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

export default AchievementsTab;
