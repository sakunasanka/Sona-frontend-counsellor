import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'border' | 'success' | 'rounded';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => {
  const base = 'px-4 py-2 font-medium transition-colors duration-200';

  const variants = {
    primary: 'bg-primary text-white hover:bg-primaryLight rounded-xl cursor-pointer',
    secondary: 'bg-secondary text-[#6365E1] hover:bg-[#C0C1D8] rounded-xl cursor-pointer',
    danger: 'bg-red-500 text-white hover:bg-red-700 rounded-xl cursor-pointer',
    border: 'border-2 border-primary text-primary bg-bg hover:bg-primary hover:text-white focus:ring-2 focus:ring-primary-ring rounded-xl cursor-pointer',
    success: 'bg-green-500 text-white hover:bg-green-600 focus:ring-2 focus:ring-success-ring rounded-xl cursor-pointer',
    rounded: 'bg-primary text-white px-6 py-3 rounded-full text-sm hover:bg-primaryLight cursor-pointer', 
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
