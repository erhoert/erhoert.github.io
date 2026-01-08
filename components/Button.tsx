import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  let baseStyles = "font-medium transition-all duration-200 active:scale-95 rounded-full flex items-center justify-center gap-2 outline-none focus:ring-4 focus:ring-opacity-50";
  
  const variants = {
    primary: "bg-black text-white hover:bg-gray-800 focus:ring-gray-400",
    secondary: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 focus:ring-gray-200",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-400",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-200"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "w-64 h-64 text-2xl uppercase tracking-widest shadow-2xl" // Special large circle button
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
