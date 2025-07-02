import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'border' | 'success' | 'rounded' | 'special';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => {
  const base = 'px-4 py-2 font-medium transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5';

  const variants = {

    primary: 'bg-primary text-black hover:bg-primary-hover focus:outline-none rounded-xl cursor-pointer',
    secondary: 'bg-border text-text hover:bg-gray-200 focus:outline-none rounded-xl cursor-pointer',
    danger: 'bg-red-500 text-white hover:bg-red-700 focus:outline-none rounded-xl cursor-pointer',
    border: 'text-primary bg-bg hover:bg-primary hover:text-bg focus:outline-none rounded-xl cursor-pointer',
    success: 'bg-success text-white hover:bg-success-hover focus:outline-none rounded-xl cursor-pointer',
    rounded: 'bg-[#2D60FF] text-white px-6 py-3 rounded-full text-sm hover:bg-[#254FCF] focus:outline-none cursor-pointer', 
    special: 'bg-[#1f2937] text-white px-2 py-2 rounded-full text-sm hover:bg-white hover:text-[#1f2937] focus:outline-none cursor-pointer', 
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
