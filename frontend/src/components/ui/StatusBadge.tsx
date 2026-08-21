import React from 'react';
import { ComplaintStatus, PriorityLevel } from '../../types';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface StatusBadgeProps {
  status?: ComplaintStatus;
  priority?: PriorityLevel;
  className?: string;
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  priority,
  className,
  showDot = true,
}) => {
  if (status) {
    const statusMap: Record<ComplaintStatus, { label: string; bg: string; text: string; dot: string }> = {
      submitted: { label: 'SUBMITTED', bg: 'bg-blue-500/10 border-blue-500/30', text: 'text-blue-400', dot: 'bg-blue-400' },
      verified: { label: 'VERIFIED', bg: 'bg-indigo-500/10 border-indigo-500/30', text: 'text-indigo-400', dot: 'bg-indigo-400' },
      assigned: { label: 'ASSIGNED', bg: 'bg-cyan-500/10 border-cyan-500/30', text: 'text-cyan-400', dot: 'bg-cyan-400' },
      in_progress: { label: 'IN PROGRESS', bg: 'bg-amber-500/10 border-amber-500/30', text: 'text-amber-400', dot: 'bg-amber-400 animate-pulse' },
      resolved: { label: 'RESOLVED', bg: 'bg-emerald-500/10 border-emerald-500/30', text: 'text-emerald-400', dot: 'bg-emerald-400' },
      closed: { label: 'CLOSED', bg: 'bg-slate-500/10 border-slate-500/30', text: 'text-slate-400', dot: 'bg-slate-400' },
      rejected: { label: 'REJECTED', bg: 'bg-rose-500/10 border-rose-500/30', text: 'text-rose-400', dot: 'bg-rose-400' },
      reopened: { label: 'REOPENED', bg: 'bg-purple-500/10 border-purple-500/30', text: 'text-purple-400', dot: 'bg-purple-400 animate-pulse' },
    };

    const config = statusMap[status] || { label: status, bg: 'bg-slate-800', text: 'text-slate-300', dot: 'bg-slate-400' };

    return (
      <span
        className={twMerge(
          clsx(
            'inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border tracking-wider uppercase',
            config.bg,
            config.text,
            className
          )
        )}
      >
        {showDot && <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />}
        <span>{config.label}</span>
      </span>
    );
  }

  if (priority) {
    const priorityMap: Record<PriorityLevel, { label: string; bg: string; text: string; dot: string }> = {
      low: { label: 'LOW', bg: 'bg-slate-800 border-slate-700', text: 'text-slate-300', dot: 'bg-slate-400' },
      medium: { label: 'MEDIUM', bg: 'bg-blue-500/10 border-blue-500/30', text: 'text-blue-400', dot: 'bg-blue-400' },
      high: { label: 'HIGH', bg: 'bg-orange-500/10 border-orange-500/30', text: 'text-orange-400', dot: 'bg-orange-400' },
      emergency: { label: 'EMERGENCY', bg: 'bg-red-500/20 border-red-500/50', text: 'text-red-400', dot: 'bg-red-500 animate-ping' },
    };

    const config = priorityMap[priority];

    return (
      <span
        className={twMerge(
          clsx(
            'inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border tracking-wider uppercase',
            config.bg,
            config.text,
            className
          )
        )}
      >
        {showDot && <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />}
        <span>{config.label}</span>
      </span>
    );
  }

  return null;
};
