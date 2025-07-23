import React, { useState } from 'react';
import { X, Calendar, Settings, AlertTriangle, Plus, Trash2 } from 'lucide-react';

interface UnavailabilityRule {
  id: string;
  type: 'weekdays' | 'weekends' | 'specific-days' | 'date-range' | 'daily-time';
  days?: string[];
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  reason?: string;
}

interface UnavailabilitySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rules: UnavailabilityRule[]) => void;
  existingRules?: UnavailabilityRule[];
}

export const UnavailabilitySettingsModal: React.FC<UnavailabilitySettingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingRules = []
}) => {
  const [rules, setRules] = useState<UnavailabilityRule[]>(existingRules);
  const [selectedType, setSelectedType] = useState<UnavailabilityRule['type']>('weekdays');
  const [error, setError] = useState<string>('');

  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const weekends = ['Saturday', 'Sunday'];
  const allDays = [...weekdays, ...weekends];

  const addNewRule = () => {
    const newRule: UnavailabilityRule = {
      id: Date.now().toString(),
      type: selectedType,
      days: [],
      reason: ''
    };
    setRules([...rules, newRule]);
  };

  const updateRule = (id: string, updates: Partial<UnavailabilityRule>) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, ...updates } : rule
    ));
  };

  const deleteRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  const handleSave = () => {
    // Validate rules before saving
    const hasInvalidRules = rules.some(rule => {
      switch (rule.type) {
        case 'weekdays':
        case 'weekends':
        case 'specific-days':
          return !rule.days?.length;
        case 'date-range':
          return !rule.startDate || !rule.endDate;
        case 'daily-time':
          return !rule.startTime || !rule.endTime;
        default:
          return false;
      }
    });

    if (hasInvalidRules) {
      setError('Please fill in all required fields for each rule');
      return;
    }

    onSave(rules);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-screen overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Availability Settings
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Set up recurring availability rules
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(100vh-250px)]">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Add new rule section */}
            <div className="flex items-center gap-4">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as UnavailabilityRule['type'])}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="weekdays">All Weekdays</option>
                <option value="weekends">All Weekends</option>
                <option value="specific-days">Specific Days</option>
                <option value="date-range">Date Range</option>
                <option value="daily-time">Daily Time Range</option>
              </select>
              <button
                onClick={addNewRule}
                className="bg-primary from-pink-500 to-purple-500 hover:bg-primaryLight text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm flex items-center gap-2 flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
                Add Rule
              </button>
            </div>

            {/* Existing rules */}
            <div className="space-y-4">
              {rules.map(rule => (
                <div 
                  key={rule.id}
                  className="p-4 border border-gray-200 rounded-lg bg-gray-50/50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-4">
                      {/* Rule type specific inputs */}
                      {(rule.type === 'weekdays' || rule.type === 'weekends' || rule.type === 'specific-days') && (
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Select Days
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {(rule.type === 'weekdays' ? weekdays :
                              rule.type === 'weekends' ? weekends : allDays
                            ).map(day => (
                              <button
                                key={day}
                                onClick={() => {
                                  const days = rule.days || [];
                                  const newDays = days.includes(day)
                                    ? days.filter(d => d !== day)
                                    : [...days, day];
                                  updateRule(rule.id, { days: newDays });
                                }}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                  rule.days?.includes(day)
                                    ? 'bg-primary/10 text-primary border border-primary/20'
                                    : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                                }`}
                              >
                                {day}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {rule.type === 'date-range' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Start Date
                            </label>
                            <input
                              type="date"
                              value={rule.startDate || ''}
                              onChange={(e) => updateRule(rule.id, { startDate: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              End Date
                            </label>
                            <input
                              type="date"
                              value={rule.endDate || ''}
                              onChange={(e) => updateRule(rule.id, { endDate: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            />
                          </div>
                        </div>
                      )}

                      {rule.type === 'daily-time' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Start Time
                            </label>
                            <input
                              type="time"
                              value={rule.startTime || ''}
                              onChange={(e) => updateRule(rule.id, { startTime: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              End Time
                            </label>
                            <input
                              type="time"
                              value={rule.endTime || ''}
                              onChange={(e) => updateRule(rule.id, { endTime: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            />
                          </div>
                        </div>
                      )}

                      {/* Reason input */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Reason (optional)
                        </label>
                        <input
                          type="text"
                          value={rule.reason || ''}
                          onChange={(e) => updateRule(rule.id, { reason: e.target.value })}
                          placeholder="Enter reason for availability"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => deleteRule(rule.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete rule"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="bg-primary from-pink-500 to-purple-500 hover:bg-primaryLight text-white px-6 py-2 rounded-lg font-medium transition-all shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnavailabilitySettingsModal; 