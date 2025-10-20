// Phone validation utilities

export interface PhoneValidationResult {
  isValid: boolean;
  error?: string;
  formattedPhone?: string;
}

// Sri Lankan phone number validation patterns
const SRI_LANKAN_PATTERNS = {
  mobile: /^(?:\+94|94|0)?[7][0-9]{8}$/,
  landline: /^(?:\+94|94|0)?[1-9][1-9][0-9]{7}$/,
  general: /^(?:\+94|94|0)?[1-9][0-9]{8}$/
};

// International phone number pattern (basic)
const INTERNATIONAL_PATTERN = /^\+?[1-9]\d{1,14}$/;

// US/Canada phone number pattern
const US_CANADA_PATTERN = /^(?:\+1|1)?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;

/**
 * Validates Sri Lankan phone numbers
 */
export const validateSriLankanPhone = (phone: string): PhoneValidationResult => {
  if (!phone || !phone.trim()) {
    return { isValid: false, error: 'Phone number is required' };
  }

  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  // Check for Sri Lankan mobile numbers
  if (SRI_LANKAN_PATTERNS.mobile.test(cleanPhone)) {
    let formatted = cleanPhone;
    if (formatted.startsWith('0')) {
      formatted = '+94' + formatted.substring(1);
    } else if (formatted.startsWith('94') && !formatted.startsWith('+')) {
      formatted = '+' + formatted;
    } else if (!formatted.startsWith('+94')) {
      formatted = '+94' + formatted;
    }
    return { isValid: true, formattedPhone: formatted };
  }
  
  // Check for Sri Lankan landline numbers
  if (SRI_LANKAN_PATTERNS.landline.test(cleanPhone)) {
    let formatted = cleanPhone;
    if (formatted.startsWith('0')) {
      formatted = '+94' + formatted.substring(1);
    } else if (formatted.startsWith('94') && !formatted.startsWith('+')) {
      formatted = '+' + formatted;
    } else if (!formatted.startsWith('+94')) {
      formatted = '+94' + formatted;
    }
    return { isValid: true, formattedPhone: formatted };
  }

  return { 
    isValid: false, 
    error: 'Please enter a valid Sri Lankan phone number (e.g., +94 71 234 5678 or 071 234 5678)' 
  };
};

/**
 * Validates US/Canada phone numbers
 */
export const validateUSPhone = (phone: string): PhoneValidationResult => {
  if (!phone || !phone.trim()) {
    return { isValid: false, error: 'Phone number is required' };
  }

  const match = phone.match(US_CANADA_PATTERN);
  if (match) {
    const formatted = `+1 (${match[1]}) ${match[2]}-${match[3]}`;
    return { isValid: true, formattedPhone: formatted };
  }

  return { 
    isValid: false, 
    error: 'Please enter a valid US/Canada phone number (e.g., +1 (555) 123-4567)' 
  };
};

/**
 * Basic international phone number validation
 */
export const validateInternationalPhone = (phone: string): PhoneValidationResult => {
  if (!phone || !phone.trim()) {
    return { isValid: false, error: 'Phone number is required' };
  }

  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  if (INTERNATIONAL_PATTERN.test(cleanPhone)) {
    const formatted = cleanPhone.startsWith('+') ? cleanPhone : '+' + cleanPhone;
    return { isValid: true, formattedPhone: formatted };
  }

  return { 
    isValid: false, 
    error: 'Please enter a valid international phone number (e.g., +1 555 123 4567)' 
  };
};

/**
 * Comprehensive phone validation with multiple formats
 */
export const validatePhoneNumber = (
  phone: string, 
  country: 'LK' | 'US' | 'INTERNATIONAL' = 'LK'
): PhoneValidationResult => {
  switch (country) {
    case 'LK':
      return validateSriLankanPhone(phone);
    case 'US':
      return validateUSPhone(phone);
    case 'INTERNATIONAL':
      return validateInternationalPhone(phone);
    default:
      return validateSriLankanPhone(phone);
  }
};

/**
 * Format phone number as user types
 */
export const formatPhoneAsType = (phone: string, country: 'LK' | 'US' = 'LK'): string => {
  const numbers = phone.replace(/\D/g, '');
  
  if (country === 'US') {
    if (numbers.length === 0) return '';
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  }
  
  // Sri Lankan formatting
  if (numbers.length === 0) return '';
  if (numbers.startsWith('94')) {
    // International format
    if (numbers.length <= 2) return '+' + numbers;
    if (numbers.length <= 4) return `+${numbers.slice(0, 2)} ${numbers.slice(2)}`;
    if (numbers.length <= 7) return `+${numbers.slice(0, 2)} ${numbers.slice(2, 4)} ${numbers.slice(4)}`;
    return `+${numbers.slice(0, 2)} ${numbers.slice(2, 4)} ${numbers.slice(4, 7)} ${numbers.slice(7, 11)}`;
  } else if (numbers.startsWith('0')) {
    // Local format
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)} ${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6)}`;
  }
  
  return phone;
};