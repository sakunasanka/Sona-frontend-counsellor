import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  minDateToday?: boolean; // Enables auto min-date for date fields
}

const Input: React.FC<InputProps> = ({ label, minDateToday, type, className, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const todayDate = new Date().toISOString().split("T")[0];
  
  const isPasswordField = type === 'password';
  const inputType = isPasswordField ? (showPassword ? 'text' : 'password') : type;
  
  return (
    <div className={`mb-2 p-2 ${className || ''}`}>
      {label && (
        <label className="block mb-1 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={`w-full px-3 py-2 border border-gray-400 rounded-3xl shadow-sm bg-white text-gray-700
            hover:border-[#EF5DA8] focus:border-[#EF5DA8] focus:ring-2 focus:ring-[#EF5DA8]/20
            focus:outline-none transition-all duration-150 ease-in-out
            placeholder:text-gray-400 placeholder:font-normal ${isPasswordField ? 'pr-10' : ''}`}
          type={inputType}
          min={type === "date" && minDateToday ? todayDate : props.min}
          autoComplete={isPasswordField ? 'current-password' : props.autoComplete}
          {...props}
        />
        {isPasswordField && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-150"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;