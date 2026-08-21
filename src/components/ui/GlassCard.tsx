import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  glow?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  hoverable = true,
  glow = false,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'rounded-xl border border-slate-800 bg-slate-900/70 backdrop-blur-md p-5 text-slate-100 shadow-xl transition-all duration-200',
          hoverable && 'hover:border-slate-700 hover:bg-slate-900/90 hover:shadow-2xl',
          glow && 'glow-card',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
