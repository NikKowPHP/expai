import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Card({ className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}
      {...props}
    />
  );
}

export function CardHeader({ className = '', ...props }: CardProps) {
  return (
    <div
      className={`border-b border-gray-200 p-4 ${className}`}
      {...props}
    />
  );
}

export function CardTitle({ className = '', ...props }: CardProps) {
  return (
    <h3
      className={`text-lg font-semibold ${className}`}
      {...props}
    />
  );
}

export function CardDescription({ className = '', ...props }: CardProps) {
  return (
    <p
      className={`text-sm text-gray-500 ${className}`}
      {...props}
    />
  );
}

export function CardContent({ className = '', ...props }: CardProps) {
  return (
    <div
      className={`p-4 ${className}`}
      {...props}
    />
  );
}

export function CardFooter({ className = '', ...props }: CardProps) {
  return (
    <div
      className={`border-t border-gray-200 p-4 ${className}`}
      {...props}
    />
  );
}
