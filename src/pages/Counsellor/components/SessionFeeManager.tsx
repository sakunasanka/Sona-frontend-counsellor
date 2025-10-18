import React, { useState, useEffect } from 'react';
import { Users, GraduationCap } from 'lucide-react';
import { updateCounsellorVolunteerStatus, getCounsellorVolunteerStatus, type VolunteerStatusData } from '../../../api/counsellorAPI';
import Modal from '../../../components/ui/Modal';

interface SessionFeeManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const SessionFeeManager: React.FC<SessionFeeManagerProps> = ({ isOpen, onClose, onSuccess, onError }) => {
  const [isVolunteer, setIsVolunteer] = useState<boolean>(false);
  const [sessionFee, setSessionFee] = useState<number>(2500);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [currentConfig, setCurrentConfig] = useState<string>('');
  const [feeError, setFeeError] = useState<string>('');

  // Load current volunteer status when modal opens
  useEffect(() => {
    if (isOpen) {
      loadCurrentStatus();
    }
  }, [isOpen]);

  const loadCurrentStatus = async () => {
    setLoadingData(true);
    try {
      const status = await getCounsellorVolunteerStatus();
      console.log('Loaded volunteer status:', status);
      console.log('isVolunteer value:', status.isVolunteer);
      setIsVolunteer(status.isVolunteer);
      setSessionFee(status.sessionFee);
      updateCurrentConfig(status.isVolunteer, status.sessionFee);
      
      // Check for validation error
      if (status.sessionFee === 0 && !status.isVolunteer) {
        setFeeError('Session fee cannot be 0 unless volunteer status is enabled');
      } else {
        setFeeError('');
      }
    } catch (error) {
      console.error('Failed to load volunteer status:', error);
      // Set default values if API fails
      setIsVolunteer(false);
      setSessionFee(2500);
      updateCurrentConfig(false, 2500);
      setFeeError('');
    } finally {
      setLoadingData(false);
    }
  };

  const updateCurrentConfig = (volunteer: boolean, fee: number) => {
    if (volunteer && fee > 0) {
      setCurrentConfig('Free for students, fee for normal clients');
    } else if (!volunteer && fee > 0) {
      setCurrentConfig('Normal fee for both students and clients');
    } else if (volunteer && fee === 0) {
      setCurrentConfig('Free sessions for both students and clients');
    } else {
      setCurrentConfig('Custom configuration');
    }
  };

  const handleVolunteerChange = (volunteer: boolean) => {
    setIsVolunteer(volunteer);
    updateCurrentConfig(volunteer, sessionFee);
    // Clear fee error when volunteer status changes
    if (volunteer) {
      setFeeError('');
    } else if (sessionFee === 0) {
      setFeeError('Session fee cannot be 0 unless volunteer status is enabled');
    }
  };

  const handleFeeChange = (fee: number) => {
    // Prevent setting fee to 0 unless volunteer status is enabled
    if (fee === 0 && !isVolunteer) {
      setFeeError('Session fee cannot be 0 unless volunteer status is enabled');
      return;
    }
    
    setSessionFee(fee);
    updateCurrentConfig(isVolunteer, fee);
    // Clear error if fee is valid
    if (fee > 0 || isVolunteer) {
      setFeeError('');
    }
  };

  const handleSave = async () => {
    // Prevent saving if there's a validation error
    if (feeError) {
      return;
    }
    
    setLoading(true);
    try {
      const payload: VolunteerStatusData = {
        isVolunteer,
        sessionFee
      };

      await updateCounsellorVolunteerStatus(payload);

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error: any) {
      console.error('Failed to update volunteer status:', error);
      const errorMessage = error.message || 'Failed to update session fee settings';
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const getConfigurationDescription = () => {
    if (isVolunteer && sessionFee > 0) {
      return "Students get free sessions, normal clients pay the session fee";
    } else if (!isVolunteer && sessionFee > 0) {
      return "Both students and normal clients pay the session fee";
    } else if (isVolunteer && sessionFee === 0) {
      return "All sessions are free for both students and clients";
    }
    return "Custom fee configuration";
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Session Fee Management">
      {loadingData ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading current settings...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Current Configuration Display */}
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-sm font-medium text-blue-900 mb-1">Current Configuration</div>
            <div className="text-sm text-blue-700">{currentConfig}</div>
          </div>

          {/* Volunteer Status Toggle */}
          <div>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isVolunteer}
                onChange={(e) => handleVolunteerChange(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex items-center">
                <Users className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">Volunteer Status</span>
              </div>
            </label>
            <p className="text-xs text-gray-500 mt-1 ml-7">
              When enabled, students can get free sessions
            </p>
          </div>

          {/* Session Fee Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Fee (LKR)
            </label>
            <div className="relative">
              <input
                type="number"
                value={sessionFee}
                onChange={(e) => handleFeeChange(Number(e.target.value))}
                min="0"
                step="100"
                className="w-full border border-gray-300 rounded-md px-3 py-2 pr-12 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter session fee"
              />
              <span className="absolute right-3 top-2.5 text-sm text-gray-400 font-medium">LKR</span>
            </div>
            {feeError && (
              <p className="text-xs text-red-600 mt-1">{feeError}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Set to 0 for free sessions
            </p>
          </div>

          {/* Configuration Preview */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-900 mb-2">Configuration Preview</div>
            <div className="text-sm text-gray-700">{getConfigurationDescription()}</div>
            <div className="flex items-center mt-2 space-x-4 text-xs text-gray-600">
              <div className="flex items-center">
                <GraduationCap className="w-3 h-3 mr-1" />
                <span>Students: {isVolunteer ? 'Free' : `LKR ${sessionFee}`}</span>
              </div>
              <div className="flex items-center">
                <Users className="w-3 h-3 mr-1" />
                <span>Clients: {sessionFee === 0 ? 'Free' : `LKR ${sessionFee}`}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading || !!feeError}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm font-medium"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                'Update Settings'
              )}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default SessionFeeManager;