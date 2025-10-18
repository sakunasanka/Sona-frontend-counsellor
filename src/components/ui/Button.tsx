import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'border' | 'success' | 'rounded' | 'special' | 'calendar' | 'logout';
  children: React.ReactNode;
  icon?: React.ReactNode;
  isMinimized?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  icon,
  isMinimized = false,
  ...props
}) => {
  const base = variant === 'logout' 
    ? 'px-4 py-2 font-medium transition-all duration-200' 
    : 'px-4 py-2 font-medium transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5';

  const variants = {
    primary: 'bg-primary text-black hover:bg-primary-hover focus:outline-none rounded-xl cursor-pointer',
    secondary: 'bg-border text-text hover:bg-gray-200 focus:outline-none rounded-xl cursor-pointer',
    danger: 'bg-red-500 text-white hover:bg-red-700 focus:outline-none rounded-xl cursor-pointer',
    border: 'text-primary bg-bg hover:bg-primary hover:text-bg focus:outline-none rounded-xl cursor-pointer',
    success: 'bg-success text-white hover:bg-success-hover focus:outline-none rounded-xl cursor-pointer',
    rounded: 'bg-[#2D60FF] text-white px-6 py-3 rounded-full text-sm hover:bg-[#254FCF] focus:outline-none cursor-pointer', 
    special: 'bg-[#1f2937] text-white px-2 py-2 rounded-full text-sm hover:bg-white hover:text-[#1f2937] focus:outline-none cursor-pointer',
    calendar: 'inline-flex items-center justify-center gap-2 px-4 py-3 bg-slateButton-100 text-white rounded-xl hover:bg-slateButton-500 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md',
    logout: 'flex items-center text-white hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-300 ease-in-out group w-full',
  };

  return (
    <button 
      className={`
        ${base} 
        ${variants[variant]} 
        ${variant === 'logout' ? (isMinimized ? 'px-3 py-3 justify-center' : 'px-4 py-3 space-x-4') : ''} 
        ${className}
      `} 
      {...props}
    >
      {icon && icon}
      {variant === 'logout' && isMinimized ? null : children}
    </button>
  );
};

export default Button;
