import React from 'react';
import { useTheme } from "../../context/ThemeContext";

const Button = ({ children, onClick, variant = 'primary', size = 'md', disabled = false, className = '', type = 'button' }) => {
  const { theme } = useTheme();

  const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: theme === 'dark'
      ? 'bg-[#5A827E] hover:bg-[#84AE92] text-white focus:ring-[#5A827E]'
      : 'bg-[#5A827E] hover:bg-[#84AE92] text-white focus:ring-[#5A827E]',
    secondary: theme === 'dark'
      ? 'bg-[#2C2C2C] border border-[#5A827E] text-[#B9D4AA] hover:bg-[#5A827E] hover:text-white'
      : 'bg-white border border-[#5A827E] text-[#5A827E] hover:bg-[#B9D4AA]',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
