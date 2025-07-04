import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
  size?: 'sm' | 'default' | 'lg';
}

export function Button({ variant = 'default', size = 'default', className = '', ...props }: ButtonProps) {
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    default: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  const baseClasses = `rounded-md font-medium transition-colors ${sizeClasses[size || 'default']}`;
  const variantClasses = variant === 'outline'
    ? 'border border-gray-300 hover:bg-gray-100'
    : 'bg-blue-600 text-white hover:bg-blue-700';

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    />
  );
}
