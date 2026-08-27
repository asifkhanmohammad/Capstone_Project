import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dataService } from '../../services/dataService';
import { GlassCard } from '../../components/ui/GlassCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SlaTimerBadge } from '../../components/ui/SlaTimerBadge';
import { RippleButton } from '../../components/ui/RippleButton';
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Wrench,
  ArrowRight,
  ListOrdered,
  Sparkles,
} from 'lucide-react';

import { Complaint } from '../../types';

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = dataService.getActiveUser();
  const [studentComplaints, setStudentComplaints] = React.useState<Complaint[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    dataService.fetchComplaints({ student_id: currentUser.id })
      .then((all) => {
        if (isMounted) {
          setStudentComplaints(all.filter((c) => c.student_id === currentUser.id));
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, [currentUser.id]);

  const activeCount = studentComplaints.filter((c) =>
    ['submitted', 'verified', 'assigned', 'in_progress', 'reopened'].includes(c.status)
  ).length;

  const resolvedCount = studentComplaints.filter((c) =>
    ['resolved', 'closed'].includes(c.status)
  ).length;

  const recentComplaints = studentComplaints.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* NRI University Student Portal Banner */}
      <div className="relative rounded-2xl border border-slate-800 overflow-hidden bg-slate-900 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/60 pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NRI University Student Portal</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white">
            Welcome back, {currentUser.full_name.split(' ')[0]} 👋
          </h1>
          <p className="text-xs md:text-sm text-slate-300">
            Manage your complaints and campus service requests from one place.
          </p>
        </div>

        <RippleButton
          variant="primary"
          size="lg"
          icon={<PlusCircle className="w-5 h-5" />}
          onClick={() => navigate('/student/submit')}
        >
          Submit New Complaint
        </RippleButton>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard glow>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Complaints</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">{studentComplaints.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <ListOrdered className="w-6 h-6" />
            </div>
          </div>
        </GlassCard>

        <GlassCard glow>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Work Orders</p>
              <h3 className="text-3xl font-extrabold text-amber-400 mt-1">{activeCount}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
          </div>
        </GlassCard>

        <GlassCard glow>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Resolved Issues</p>
              <h3 className="text-3xl font-extrabold text-emerald-400 mt-1">{resolvedCount}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Active & Recent Complaints Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <ListOrdered className="w-5 h-5 text-blue-400" />
            <span>Recent Complaint Activity</span>
          </h3>
          <Link
            to="/student/complaints"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center space-x-1"
          >
            <span>View All ({studentComplaints.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentComplaints.length === 0 ? (
          <GlassCard className="text-center py-12 space-y-3">
            <AlertCircle className="w-12 h-12 text-slate-600 mx-auto" />
            <h4 className="text-base font-semibold text-slate-300">No Complaints Submitted Yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              If you are facing any campus issue (Wi-Fi, Electrical, Plumbing, Cleaning), click below to log a work order.
            </p>
            <RippleButton variant="primary" size="sm" onClick={() => navigate('/student/submit')}>
              Submit Your First Complaint
            </RippleButton>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentComplaints.map((c) => (
              <GlassCard
                key={c.id}
                className="cursor-pointer hover:border-blue-500/40 transition-all space-y-3"
                onClick={() => navigate(`/complaints/${c.id}`)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-400">{c.complaint_number}</span>
                  <StatusBadge status={c.status} />
                </div>

                <div>
                  <h4 className="font-bold text-white text-base line-clamp-1">{c.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">{c.description}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                  <span className="text-slate-400">Location: <strong className="text-slate-200">{c.location}</strong></span>
                  <SlaTimerBadge createdAt={c.created_at} dueAt={c.due_at} status={c.status} />
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      {/* Campus Service Requests Card */}
      <GlassCard className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-indigo-950/60 border-indigo-500/20">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-white text-base">Need Campus Service Setup?</h4>
            <p className="text-xs text-slate-400">
              Request seminar hall audio-visual setup, extra lab equipment, or room sanitization.
            </p>
          </div>
        </div>
        <RippleButton
          variant="secondary"
          size="sm"
          onClick={() => navigate('/student/services')}
          icon={<ArrowRight className="w-4 h-4" />}
        >
          View Campus Services
        </RippleButton>
      </GlassCard>
    </div>
  );
};
