import React from 'react';
import { useNavigate } from 'react-router-dom';
import { dataService } from '../../services/dataService';
import { GlassCard } from '../../components/ui/GlassCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SlaTimerBadge } from '../../components/ui/SlaTimerBadge';
import { RippleButton } from '../../components/ui/RippleButton';
import { Wrench, Clock, AlertTriangle, CheckCircle2, ListOrdered, ArrowRight } from 'lucide-react';

import { Complaint } from '../../types';

export const StaffDashboard: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = dataService.getActiveUser();
  const [allComplaints, setAllComplaints] = React.useState<Complaint[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    dataService.fetchComplaints()
      .then((data) => {
        if (isMounted) {
          setAllComplaints(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  const assignedComplaints = allComplaints.filter(
    (c) => c.assigned_staff_id === currentUser.id || c.department_id === currentUser.department_id || !c.assigned_staff_id
  );

  const pendingCount = assignedComplaints.filter((c) =>
    ['submitted', 'verified', 'assigned', 'in_progress', 'reopened'].includes(c.status)
  ).length;

  const emergencyCount = assignedComplaints.filter((c) => c.priority === 'emergency' && c.status !== 'closed').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-900/40 via-teal-900/30 to-slate-900 border border-emerald-500/20 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Wrench className="w-3.5 h-3.5" />
            <span>Staff Technician Work-Center</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            Welcome, {currentUser.full_name.split(' ')[0]} 🛠️
          </h1>
          <p className="text-xs md:text-sm text-slate-300">
            Senior Technician — {currentUser.department_name || 'Electrical & Maintenance'} Department.
          </p>
        </div>

        <RippleButton
          variant="success"
          size="lg"
          icon={<ListOrdered className="w-5 h-5" />}
          onClick={() => navigate('/staff/assigned')}
        >
          View Work Order Queue ({pendingCount})
        </RippleButton>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard glow>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Assigned Tickets</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">{assignedComplaints.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Wrench className="w-6 h-6" />
            </div>
          </div>
        </GlassCard>

        <GlassCard glow>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Work Orders</p>
              <h3 className="text-3xl font-extrabold text-amber-400 mt-1">{pendingCount}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
          </div>
        </GlassCard>

        <GlassCard glow>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Emergencies / Breached</p>
              <h3 className="text-3xl font-extrabold text-rose-400 mt-1">{emergencyCount}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-6 h-6 animate-bounce" />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Priority Work Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <span>High-Priority Dispatches & SLA Timers</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignedComplaints.slice(0, 4).map((c) => (
            <GlassCard
              key={c.id}
              className="cursor-pointer hover:border-emerald-500/40 transition-all space-y-3"
              onClick={() => navigate(`/complaints/${c.id}`)}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-blue-400">{c.complaint_number}</span>
                <div className="flex items-center space-x-2">
                  <StatusBadge priority={c.priority} />
                  <StatusBadge status={c.status} />
                </div>
              </div>

              <div>
                <h4 className="font-bold text-white text-base line-clamp-1">{c.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">{c.description}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                <span className="text-slate-400">Location: <strong className="text-slate-200">{c.location}</strong></span>
                <SlaTimerBadge createdAt={c.created_at} dueAt={c.due_at} status={c.status} showProgress />
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};
