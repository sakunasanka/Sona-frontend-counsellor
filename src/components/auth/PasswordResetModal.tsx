import React, { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { resetPassword } from '../../api/userAPI';

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PasswordResetModal: React.FC<PasswordResetModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; general?: string }>({});
  const [successMessage, setSuccessMessage] = useState('');

  const validateEmail = () => {
    const newErrors: typeof errors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail()) return;

    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      const response = await resetPassword(email);
      if (response.success) {
        setSuccessMessage(response.message || 'Password reset link has been sent to your email.');
        setEmail('');
      } else {
        setErrors({ general: response.message || 'Failed to send password reset email.' });
      }
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again later.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setErrors({});
    setSuccessMessage('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Reset Password">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-gray-600 mb-4">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <div>
          <Input
            type="email"
            placeholder="you@example.com"
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-2 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {errors.email}
            </p>
          )}
        </div>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-700 text-sm flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {errors.general}
            </p>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-green-700 text-sm flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              {successMessage}
            </p>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            className="flex-1"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PasswordResetModal;