import React from 'react';

export const Badge = ({ children, className, variant = 'default' }) => {
  const baseStyles = 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium';
  const variants = {
    default: 'bg-gray-200 text-gray-800',
    outline: 'border border-gray-300 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
  };

  const variantStyles = variants[variant] || variants.default;

  return (
    <span className={`${baseStyles} ${variantStyles} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;