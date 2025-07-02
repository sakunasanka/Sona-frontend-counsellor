import React from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, className = "", ...props }) => (
  <label className="checkbox-container">
    <input
      type="checkbox"
      className={`form-checkbox h-4 w-4 text-gray-800  rounded  checked:bg-gray-800  ${className}`}
      {...props}
    />
    {label && (
      <span className="checkbox-label text-sm text-text">
        {label === "I agree to the Terms and Privacy Policy" ? (
          <>
            I agree to the{' '}
            <a 
              href="/terms" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary font-medium hover:text-pink-700 hover:underline transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 rounded px-1"
              onClick={(e) => e.stopPropagation()}
            >
              Terms and Conditions
            </a>
            {' '}and{' '}
            <a 
              href="/privacy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary font-medium hover:text-pink-700 hover:underline transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 rounded px-1"
              onClick={(e) => e.stopPropagation()}
            >
              Privacy Policy
            </a>
          </>
        ) : (
          label
        )}
      </span>
    )}
  </label>
);

export default Checkbox;
