import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataService } from '../../services/dataService';
import { GlassCard } from '../../components/ui/GlassCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SlaTimerBadge } from '../../components/ui/SlaTimerBadge';
import { RippleButton } from '../../components/ui/RippleButton';
import { ComplaintCategory, ComplaintStatus } from '../../types';
import {
  ListOrdered,
  Search,
  Filter,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  LayoutGrid,
  Table as TableIcon,
} from 'lucide-react';

import { Complaint } from '../../types';

export const MyComplaints: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = dataService.getActiveUser();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  React.useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError('');

    dataService.fetchComplaints({ student_id: currentUser.id })
      .then((data) => {
        if (isMounted) {
          setComplaints(data.filter((c) => c.student_id === currentUser.id));
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to fetch complaints from database');
          setLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, [currentUser.id]);

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.complaint_number.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesStatus =
      selectedStatus === 'all'
        ? true
        : selectedStatus === 'active'
        ? ['submitted', 'verified', 'assigned', 'in_progress', 'reopened'].includes(c.status)
        : c.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center space-x-2">
            <ListOrdered className="w-7 h-7 text-blue-400" />
            <span>My Complaint Work Orders</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400">
            Track status, inspect work progress, view SLA countdowns, and submit feedback.
          </p>
        </div>

        <RippleButton
          variant="primary"
          icon={<PlusCircle className="w-4 h-4" />}
          onClick={() => navigate('/student/submit')}
        >
          Submit New Complaint
        </RippleButton>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-red-500/40 bg-red-500/10 text-red-400 text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="p-8 text-center text-slate-400 text-sm">
          Loading complaints from database...
        </div>
      )}

      {/* Filter Toolbar */}
      <GlassCard className="space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search ID, title, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Category Dropdown & View Mode Switcher */}
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full md:w-48 px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-xs text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="all">All Categories</option>
                <option value="electrical">Electrical & Power</option>
                <option value="plumbing">Plumbing & Water</option>
                <option value="internet_wifi">Internet / Wi-Fi</option>
                <option value="hostel">Hostel</option>
                <option value="cleaning">Sanitation & Cleaning</option>
                <option value="security">Security</option>
                <option value="canteen">Canteen</option>
              </select>
            </div>

            <div className="flex items-center space-x-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Table View"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pt-2 border-t border-slate-800 text-xs">
          {['all', 'active', 'resolved', 'closed', 'reopened'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold capitalize whitespace-nowrap transition-colors ${
                selectedStatus === st
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {st === 'active' ? 'Active Work Orders' : st}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Complaints Display */}
      {filteredComplaints.length === 0 ? (
        <GlassCard className="text-center py-12 space-y-3">
          <AlertCircle className="w-10 h-10 text-slate-600 mx-auto" />
          <h4 className="text-base font-semibold text-slate-300">No Complaints Match Your Filter</h4>
          <p className="text-xs text-slate-500">Try adjusting your search keywords or filter options.</p>
        </GlassCard>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredComplaints.map((c) => (
            <GlassCard
              key={c.id}
              className="cursor-pointer hover:border-blue-500/40 transition-all space-y-3"
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
                <SlaTimerBadge createdAt={c.created_at} dueAt={c.due_at} status={c.status} />
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <GlassCard className="overflow-x-auto p-0">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase font-semibold">
                <th className="p-4">ID</th>
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Status</th>
                <th className="p-4">SLA Clock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredComplaints.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => navigate(`/complaints/${c.id}`)}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="p-4 font-mono font-bold text-blue-400">{c.complaint_number}</td>
                  <td className="p-4 font-semibold text-white max-w-xs truncate">{c.title}</td>
                  <td className="p-4 capitalize text-slate-300">{c.category.replace('_', ' ')}</td>
                  <td className="p-4"><StatusBadge priority={c.priority} /></td>
                  <td className="p-4"><StatusBadge status={c.status} /></td>
                  <td className="p-4"><SlaTimerBadge createdAt={c.created_at} dueAt={c.due_at} status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      )}
    </div>
  );
};
