import React, { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export const RippleButton: React.FC<RippleButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  isLoading = false,
  className,
  onClick,
  disabled,
  ...props
}) => {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);

    if (onClick) onClick(e);
  };

  const baseStyles =
    'btn-ripple-container btn-react-bits inline-flex items-center justify-center font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none select-none transition-all duration-150';

  const variants = {
    primary:
      'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white focus:ring-blue-500 border border-blue-500/30 shadow-blue-900/20',
    secondary:
      'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 focus:ring-slate-500',
    danger:
      'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white focus:ring-red-500 border border-red-500/30 shadow-red-900/20',
    success:
      'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white focus:ring-emerald-500 border border-emerald-500/30 shadow-emerald-900/20',
    outline:
      'bg-transparent hover:bg-slate-800/60 text-slate-200 border border-slate-700 hover:border-slate-500 focus:ring-slate-500',
    ghost:
      'bg-transparent hover:bg-slate-800/80 text-slate-300 hover:text-white focus:ring-slate-500 border border-transparent',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs space-x-1.5',
    md: 'px-4 py-2 text-sm space-x-2',
    lg: 'px-5 py-2.5 text-base space-x-2.5',
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      onClick={handleClick}
      disabled={disabled || isLoading}
      {...props}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="btn-ripple"
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
            width: '100px',
            height: '100px',
            marginLeft: '-50px',
            marginTop: '-50px',
          }}
        />
      ))}

      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        icon && <span className="inline-flex shrink-0">{icon}</span>
      )}

      <span>{children}</span>
    </button>
  );
};
