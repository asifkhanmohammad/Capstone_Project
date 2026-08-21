import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { dataService } from '../../services/dataService';
import { GlassCard } from '../../components/ui/GlassCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SlaTimerBadge } from '../../components/ui/SlaTimerBadge';
import { RippleButton } from '../../components/ui/RippleButton';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  TrendingUp,
  Building2,
  ListOrdered,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const complaints = dataService.getComplaints();
  const departments = dataService.getDepartments();

  // Metrics Calculations
  const totalCount = complaints.length;
  const pendingCount = complaints.filter((c) => ['submitted', 'verified'].includes(c.status)).length;
  const inProgressCount = complaints.filter((c) => ['assigned', 'in_progress', 'reopened'].includes(c.status)).length;
  const resolvedCount = complaints.filter((c) => ['resolved', 'closed'].includes(c.status)).length;

  const breachedCount = complaints.filter((c) => {
    const isFinished = ['resolved', 'closed', 'rejected'].includes(c.status);
    if (isFinished) return false;
    return new Date(c.due_at).getTime() < new Date().getTime();
  }).length;

  const resolutionRate = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0;
  const avgResolutionTime = '3.4 Hours';

  // Chart Data: Department Workload
  const deptData = departments.map((d) => {
    const deptComplaints = complaints.filter((c) => c.department_id === d.id || c.department_name === d.name);
    return {
      name: d.code,
      fullName: d.name,
      total: deptComplaints.length,
      pending: deptComplaints.filter((c) => c.status !== 'closed' && c.status !== 'resolved').length,
    };
  });

  // Chart Data: Category Distribution
  const categoryCounts: Record<string, number> = {};
  complaints.forEach((c) => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  });

  const categoryData = Object.keys(categoryCounts).map((cat) => ({
    name: cat.replace('_', ' ').toUpperCase(),
    value: categoryCounts[cat],
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

  // Chart Data: Status Distribution
  const statusCounts: Record<string, number> = {};
  complaints.forEach((c) => {
    statusCounts[c.status] = (statusCounts[c.status] || 0) + 1;
  });

  const statusData = Object.keys(statusCounts).map((st) => ({
    name: st.replace('_', ' ').toUpperCase(),
    value: statusCounts[st],
  }));

  // Trend Data (Demo months)
  const trendData = [
    { month: 'Apr', complaints: 42, resolved: 38 },
    { month: 'May', complaints: 58, resolved: 52 },
    { month: 'Jun', complaints: 65, resolved: 60 },
    { month: 'Jul', complaints: 80, resolved: 74 },
    { month: 'Aug', complaints: complaints.length, resolved: resolvedCount },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/20 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Executive Operations Control Center</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            Campus Executive Admin Dashboard 📊
          </h1>
          <p className="text-xs md:text-sm text-slate-300">
            Real-time complaint tracking, department workload metrics, SLA compliance, and analytical forecasts.
          </p>
        </div>

        <RippleButton
          variant="primary"
          icon={<ListOrdered className="w-4 h-4" />}
          onClick={() => navigate('/admin/complaints')}
        >
          Manage All Complaints ({totalCount})
        </RippleButton>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard glow>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Complaints</p>
          <h3 className="text-3xl font-extrabold text-white mt-1">{totalCount}</h3>
          <p className="text-[11px] text-blue-400 mt-1 font-semibold">100% Platform Volume</p>
        </GlassCard>

        <GlassCard glow>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Verification</p>
          <h3 className="text-3xl font-extrabold text-amber-400 mt-1">{pendingCount}</h3>
          <p className="text-[11px] text-amber-400 mt-1 font-semibold">Awaiting Dispatch</p>
        </GlassCard>

        <GlassCard glow>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Resolution Rate</p>
          <h3 className="text-3xl font-extrabold text-emerald-400 mt-1">{resolutionRate}%</h3>
          <p className="text-[11px] text-emerald-400 mt-1 font-semibold">Avg Time: {avgResolutionTime}</p>
        </GlassCard>

        <GlassCard glow>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">SLA Breached</p>
          <h3 className="text-3xl font-extrabold text-rose-400 mt-1">{breachedCount}</h3>
          <p className="text-[11px] text-rose-400 mt-1 font-semibold">Overdue Work Orders</p>
        </GlassCard>
      </div>

      {/* Recharts Graphical Visualizers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Workload Bar Chart */}
        <GlassCard className="space-y-4">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            <span>Complaints & Workload by Department</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Bar dataKey="total" fill="#3b82f6" name="Total Tickets" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" fill="#f59e0b" name="Pending Action" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Category Distribution Pie Chart */}
        <GlassCard className="space-y-4">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            <span>Complaints by Category Distribution</span>
          </h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Monthly Trend Area Chart */}
        <GlassCard className="lg:col-span-2 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <span>Monthly Complaint Inflow vs Resolution Trend</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="complaints" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} name="Submitted Complaints" />
                <Area type="monotone" dataKey="resolved" stroke="#10b981" fill="#10b981" fillOpacity={0.2} name="Resolved Work Orders" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Recent Complaints Table */}
      <GlassCard className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Recent Campus Work Orders</h3>
          <Link to="/admin/complaints" className="text-xs font-semibold text-blue-400 hover:underline flex items-center space-x-1">
            <span>View Master List</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase font-semibold">
                <th className="p-3">ID</th>
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Location</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Status</th>
                <th className="p-3">SLA Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {complaints.slice(0, 5).map((c) => (
                <tr key={c.id} onClick={() => navigate(`/complaints/${c.id}`)} className="hover:bg-slate-800/40 cursor-pointer">
                  <td className="p-3 font-mono font-bold text-blue-400">{c.complaint_number}</td>
                  <td className="p-3 font-semibold text-white max-w-xs truncate">{c.title}</td>
                  <td className="p-3 capitalize text-slate-300">{c.category.replace('_', ' ')}</td>
                  <td className="p-3 text-slate-300">{c.location}</td>
                  <td className="p-3"><StatusBadge priority={c.priority} /></td>
                  <td className="p-3"><StatusBadge status={c.status} /></td>
                  <td className="p-3"><SlaTimerBadge createdAt={c.created_at} dueAt={c.due_at} status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
