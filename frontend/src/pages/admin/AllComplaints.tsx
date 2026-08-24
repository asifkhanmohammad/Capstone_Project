import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataService } from '../../services/dataService';
import { GlassCard } from '../../components/ui/GlassCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SlaTimerBadge } from '../../components/ui/SlaTimerBadge';
import { RippleButton } from '../../components/ui/RippleButton';
import { Modal } from '../../components/ui/Modal';
import { Complaint, ComplaintStatus, PriorityLevel, Department } from '../../types';
import {
  ListOrdered,
  Search,
  Filter,
  UserCheck,
  Building2,
  Eye,
  ShieldCheck,
  Edit,
} from 'lucide-react';

export const AllComplaints: React.FC = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Reassignment Modal State
  const [selectedTicket, setSelectedTicket] = useState<Complaint | null>(null);
  const [targetDeptId, setTargetDeptId] = useState('');
  const [targetStaffId, setTargetStaffId] = useState('usr-staff-1');
  const [targetStatus, setTargetStatus] = useState<ComplaintStatus>('assigned');
  const [targetPriority, setTargetPriority] = useState<PriorityLevel>('medium');
  const [internalComment, setInternalComment] = useState('');

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [c, d] = await Promise.all([
        dataService.fetchComplaints(),
        dataService.fetchDepartments(),
      ]);
      setComplaints(c);
      setDepartments(d);
    } catch (err) {
      console.error('Failed to load admin complaints:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = complaints.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.complaint_number.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase()) ||
      c.student_name.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || c.priority === priorityFilter;

    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

  const handleOpenManageModal = (ticket: Complaint) => {
    setSelectedTicket(ticket);
    setTargetDeptId(ticket.department_id || departments[0]?.id || '');
    setTargetStatus(ticket.status);
    setTargetPriority(ticket.priority);
    setInternalComment('Admin reassigned ticket to department staff.');
  };

  const handleSaveManageModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    try {
      const staffName = 'K. Ramesh (Electrical Lead)';
      await dataService.assignComplaint(selectedTicket.id, targetStaffId, staffName);
      if (targetStatus !== selectedTicket.status) {
        await dataService.updateComplaintStatus(selectedTicket.id, targetStatus, internalComment, true);
      }
      await loadData();
      setSelectedTicket(null);
    } catch (err: any) {
      alert(err.message || 'Failed to update complaint');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center space-x-2">
          <ListOrdered className="w-7 h-7 text-indigo-400" />
          <span>Master Campus Complaints Registry</span>
        </h1>
        <p className="text-xs md:text-sm text-slate-400">
          Filter work orders, assign departments & staff, override priorities, and monitor SLA compliance.
        </p>
      </div>

      {/* Filter Control Bar */}
      <GlassCard className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search ID, title, student..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-xs text-white focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="electrical">Electrical</option>
            <option value="plumbing">Plumbing</option>
            <option value="internet_wifi">Internet / Wi-Fi</option>
            <option value="cleaning">Cleaning</option>
            <option value="security">Security</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-xs text-white focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="submitted">SUBMITTED</option>
            <option value="verified">VERIFIED</option>
            <option value="assigned">ASSIGNED</option>
            <option value="in_progress">IN PROGRESS</option>
            <option value="resolved">RESOLVED</option>
            <option value="reopened">REOPENED</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-xs text-white focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="emergency">EMERGENCY</option>
            <option value="high">HIGH</option>
            <option value="medium">MEDIUM</option>
            <option value="low">LOW</option>
          </select>
        </div>
      </GlassCard>

      {/* Master Data Table */}
      <GlassCard className="overflow-x-auto p-0">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase font-semibold">
              <th className="p-4">ID</th>
              <th className="p-4">Title & Student</th>
              <th className="p-4">Category</th>
              <th className="p-4">Location</th>
              <th className="p-4">Assigned Dept</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Status</th>
              <th className="p-4">SLA Clock</th>
              <th className="p-4 text-right">Admin Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="p-4 font-mono font-bold text-blue-400">{c.complaint_number}</td>
                <td className="p-4">
                  <p className="font-semibold text-white max-w-xs truncate">{c.title}</p>
                  <p className="text-[10px] text-slate-400">{c.student_name} ({c.student_email})</p>
                </td>
                <td className="p-4 capitalize text-slate-300">{c.category.replace('_', ' ')}</td>
                <td className="p-4 text-slate-300">{c.location}</td>
                <td className="p-4 text-indigo-400 font-semibold">{c.department_name || 'Unassigned'}</td>
                <td className="p-4"><StatusBadge priority={c.priority} /></td>
                <td className="p-4"><StatusBadge status={c.status} /></td>
                <td className="p-4"><SlaTimerBadge createdAt={c.created_at} dueAt={c.due_at} status={c.status} /></td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => navigate(`/complaints/${c.id}`)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                    title="View Details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleOpenManageModal(c)}
                    className="p-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/30"
                    title="Manage & Reassign"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>

      {/* Admin Management Modal */}
      {selectedTicket && (
        <Modal
          isOpen={Boolean(selectedTicket)}
          onClose={() => setSelectedTicket(null)}
          title={`Admin Reassignment & Control: ${selectedTicket.complaint_number}`}
        >
          <form onSubmit={handleSaveManageModal} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Assign Department</label>
              <select
                value={targetDeptId}
                onChange={(e) => setTargetDeptId(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Update Status</label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value as ComplaintStatus)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="submitted">SUBMITTED</option>
                  <option value="verified">VERIFIED</option>
                  <option value="assigned">ASSIGNED</option>
                  <option value="in_progress">IN PROGRESS</option>
                  <option value="resolved">RESOLVED</option>
                  <option value="closed">CLOSED</option>
                  <option value="rejected">REJECTED</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Override Priority</label>
                <select
                  value={targetPriority}
                  onChange={(e) => setTargetPriority(e.target.value as PriorityLevel)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="low">LOW (72h SLA)</option>
                  <option value="medium">MEDIUM (24h SLA)</option>
                  <option value="high">HIGH (6h SLA)</option>
                  <option value="emergency">EMERGENCY (2h SLA)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Internal Log Note</label>
              <textarea
                rows={2}
                value={internalComment}
                onChange={(e) => setInternalComment(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <RippleButton type="submit" variant="primary" className="w-full">
              Apply Dispatch & Management Updates
            </RippleButton>
          </form>
        </Modal>
      )}
    </div>
  );
};
