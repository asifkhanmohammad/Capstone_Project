import { PriorityLevel, ComplaintStatus, SlaMetrics } from '../types';

export const SLA_HOURS: Record<PriorityLevel, number> = {
  emergency: 2,
  high: 6,
  medium: 24,
  low: 72,
};

export function calculateDueAt(createdAtIso: string, priority: PriorityLevel): string {
  const createdDate = new Date(createdAtIso);
  const slaHours = SLA_HOURS[priority] || 24;
  const dueDate = new Date(createdDate.getTime() + slaHours * 60 * 60 * 1000);
  return dueDate.toISOString();
}

export function getSlaMetrics(
  createdAtIso: string,
  dueAtIso: string,
  status: ComplaintStatus
): SlaMetrics {
  const isFinished = ['resolved', 'closed', 'rejected'].includes(status);
  const now = new Date().getTime();
  const created = new Date(createdAtIso).getTime();
  const due = new Date(dueAtIso).getTime();

  const totalSlaMs = due - created;
  const remainingMs = due - now;
  const remainingMinutes = Math.floor(remainingMs / (1000 * 60));

  if (isFinished) {
    return {
      remainingMinutes: 0,
      formattedTime: 'Completed',
      isBreached: false,
      percentageUsed: 100,
      badgeColor: 'green',
      statusText: 'SLA Satisfied',
    };
  }

  if (remainingMs <= 0) {
    const overdueMinutes = Math.abs(remainingMinutes);
    const hoursOverdue = Math.floor(overdueMinutes / 60);
    const minsOverdue = overdueMinutes % 60;
    const timeStr = hoursOverdue > 0 ? `${hoursOverdue}h ${minsOverdue}m overdue` : `${minsOverdue}m overdue`;

    return {
      remainingMinutes,
      formattedTime: timeStr,
      isBreached: true,
      percentageUsed: 100,
      badgeColor: 'darkred',
      statusText: 'SLA Breached',
    };
  }

  const elapsedMs = now - created;
  const percentageUsed = Math.min(100, Math.max(0, Math.round((elapsedMs / totalSlaMs) * 100)));

  const hoursLeft = Math.floor(remainingMinutes / 60);
  const minsLeft = remainingMinutes % 60;
  const formattedTime = hoursLeft > 0 ? `${hoursLeft}h ${minsLeft}m left` : `${minsLeft}m left`;

  let badgeColor: 'green' | 'yellow' | 'red' | 'darkred' = 'green';
  let statusText = 'On Track';

  if (percentageUsed > 80) {
    badgeColor = 'red';
    statusText = 'SLA Critical';
  } else if (percentageUsed > 50) {
    badgeColor = 'yellow';
    statusText = 'SLA Approaching';
  }

  return {
    remainingMinutes,
    formattedTime,
    isBreached: false,
    percentageUsed,
    badgeColor,
    statusText,
  };
}
