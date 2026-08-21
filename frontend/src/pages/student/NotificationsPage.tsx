import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataService } from '../../services/dataService';
import { GlassCard } from '../../components/ui/GlassCard';
import { Bell, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = dataService.getActiveUser();
  const [notifications, setNotifications] = useState(() => dataService.getNotifications(currentUser.id));

  const handleMarkRead = (id: string, link?: string) => {
    dataService.markNotificationRead(id);
    setNotifications(dataService.getNotifications(currentUser.id));
    if (link) navigate(link);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center space-x-2">
          <Bell className="w-7 h-7 text-blue-400" />
          <span>In-App Notifications</span>
        </h1>
        <p className="text-xs md:text-sm text-slate-400">
          Real-time updates on status changes, staff assignments, and SLA alerts.
        </p>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <GlassCard
            key={n.id}
            onClick={() => handleMarkRead(n.id, n.link)}
            className={`cursor-pointer transition-all ${
              !n.is_read ? 'border-blue-500/40 bg-blue-950/20' : 'opacity-80'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="mt-1">
                {n.type === 'sla' ? (
                  <AlertTriangle className="w-5 h-5 text-rose-400 animate-bounce" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-blue-400" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm">{n.title}</h4>
                  <span className="text-[10px] text-slate-500">{new Date(n.created_at).toLocaleString()}</span>
                </div>
                <p className="text-xs text-slate-300">{n.message}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
