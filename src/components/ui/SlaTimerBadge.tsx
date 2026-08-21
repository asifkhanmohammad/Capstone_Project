import React, { useEffect, useState } from 'react';
import { ComplaintStatus } from '../../types';
import { getSlaMetrics } from '../../utils/slaCalculator';
import { Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface SlaTimerBadgeProps {
  createdAt: string;
  dueAt: string;
  status: ComplaintStatus;
  showProgress?: boolean;
}

export const SlaTimerBadge: React.FC<SlaTimerBadgeProps> = ({
  createdAt,
  dueAt,
  status,
  showProgress = false,
}) => {
  const [metrics, setMetrics] = useState(() => getSlaMetrics(createdAt, dueAt, status));

  useEffect(() => {
    const timer = setInterval(() => {
      setMetrics(getSlaMetrics(createdAt, dueAt, status));
    }, 30000); // refresh every 30 seconds

    return () => clearInterval(timer);
  }, [createdAt, dueAt, status]);

  if (['resolved', 'closed', 'rejected'].includes(status)) {
    return (
      <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>Completed</span>
      </div>
    );
  }

  const badgeStyles = {
    green: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    yellow: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    red: 'bg-orange-500/10 border-orange-500/30 text-orange-400 animate-pulse',
    darkred: 'bg-rose-500/20 border-rose-500/50 text-rose-300 font-bold animate-pulse',
  };

  return (
    <div className="flex flex-col space-y-1">
      <div
        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${
          badgeStyles[metrics.badgeColor]
        }`}
      >
        {metrics.isBreached ? (
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-bounce shrink-0" />
        ) : (
          <Clock className="w-3.5 h-3.5 shrink-0" />
        )}
        <span>{metrics.formattedTime}</span>
      </div>

      {showProgress && !metrics.isBreached && (
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              metrics.percentageUsed > 80
                ? 'bg-rose-500'
                : metrics.percentageUsed > 50
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${metrics.percentageUsed}%` }}
          />
        </div>
      )}
    </div>
  );
};
