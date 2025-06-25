import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  minDateToday?: boolean; // Enables auto min-date for date fields
}

const Input: React.FC<InputProps> = ({ label, minDateToday, type, className, ...props }) => {
  const todayDate = new Date().toISOString().split("T")[0];
  
  return (
    <div className={`mb-2 p-2 ${className || ''}`}>
      {label && (
        <label         className="block mb-1 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        className="w-full px-3 py-2 border border-gray-400 rounded-3xl shadow-sm bg-white text-gray-700
          hover:border-[#EF5DA8] focus:border-[#EF5DA8] focus:ring-2 focus:ring-[#EF5DA8]/20
          focus:outline-none transition-all duration-150 ease-in-out
          placeholder:text-gray-400 placeholder:font-normal"
        type={type}
        min={type === "date" && minDateToday ? todayDate : props.min}
        {...props}
      />
    </div>
  );
};

export default Input;