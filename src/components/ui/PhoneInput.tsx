import React, { useState, useEffect } from 'react';
import { Phone, AlertCircle, CheckCircle } from 'lucide-react';
import { validatePhoneNumber, formatPhoneAsType, PhoneValidationResult } from '../../utils/phoneValidation';

interface PhoneInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string, isValid: boolean, formattedValue?: string) => void;
  country?: 'LK' | 'US' | 'INTERNATIONAL';
  required?: boolean;
  disabled?: boolean;
  className?: string;
  showValidation?: boolean;
  autoFormat?: boolean;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  label = "Phone Number",
  placeholder = "+94 71 234 5678",
  value,
  onChange,
  country = 'LK',
  required = false,
  disabled = false,
  className = "",
  showValidation = true,
  autoFormat = true
}) => {
  const [validationResult, setValidationResult] = useState<PhoneValidationResult>({ isValid: true });
  const [isTouched, setIsTouched] = useState(false);

  useEffect(() => {
    if (value && isTouched) {
      const result = validatePhoneNumber(value, country);
      setValidationResult(result);
      onChange(value, result.isValid, result.formattedPhone);
    }
  }, [value, country, isTouched]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    
    if (autoFormat && (country === 'LK' || country === 'US')) {
      inputValue = formatPhoneAsType(inputValue, country);
    }
    
    setIsTouched(true);
    const result = validatePhoneNumber(inputValue, country);
    setValidationResult(result);
    onChange(inputValue, result.isValid, result.formattedPhone);
  };

  const handleBlur = () => {
    setIsTouched(true);
    if (value) {
      const result = validatePhoneNumber(value, country);
      setValidationResult(result);
      onChange(value, result.isValid, result.formattedPhone);
    }
  };

  const getInputClasses = () => {
    let classes = `w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-all ${className}`;
    
    if (!isTouched || !showValidation) {
      classes += " border-gray-300 focus:ring-blue-500 focus:border-blue-500";
    } else if (validationResult.isValid) {
      classes += " border-green-300 focus:ring-green-500 focus:border-green-500 bg-green-50";
    } else {
      classes += " border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50";
    }
    
    if (disabled) {
      classes += " bg-gray-100 cursor-not-allowed";
    }
    
    return classes;
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {/* Phone icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Phone className="h-5 w-5 text-gray-400" />
        </div>
        
        {/* Input field */}
        <input
          type="tel"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={getInputClasses()}
          autoComplete="tel"
        />
        
        {/* Validation icon */}
        {showValidation && isTouched && value && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {validationResult.isValid ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500" />
            )}
          </div>
        )}
      </div>
      
      {/* Error message */}
      {showValidation && isTouched && !validationResult.isValid && validationResult.error && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
          {validationResult.error}
        </p>
      )}
      
      {/* Success message with formatted number */}
      {showValidation && isTouched && validationResult.isValid && validationResult.formattedPhone && value !== validationResult.formattedPhone && (
        <p className="mt-2 text-sm text-green-600">
          Formatted: {validationResult.formattedPhone}
        </p>
      )}
      
      {/* Help text */}
      {!isTouched && country === 'LK' && (
        <p className="mt-1 text-sm text-gray-500">
          Enter Sri Lankan number (e.g., 071 234 5678 or +94 71 234 5678)
        </p>
      )}
      {!isTouched && country === 'US' && (
        <p className="mt-1 text-sm text-gray-500">
          Enter US/Canada number (e.g., (555) 123-4567)
        </p>
      )}
    </div>
  );
};

export default PhoneInput;