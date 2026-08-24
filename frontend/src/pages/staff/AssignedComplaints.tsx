import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataService } from '../../services/dataService';
import { GlassCard } from '../../components/ui/GlassCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SlaTimerBadge } from '../../components/ui/SlaTimerBadge';
import { RippleButton } from '../../components/ui/RippleButton';
import { Modal } from '../../components/ui/Modal';
import { Complaint, ComplaintStatus } from '../../types';
import { Wrench, CheckCircle2, Clock, Play, MapPin, Eye } from 'lucide-react';

export const AssignedComplaints: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = dataService.getActiveUser();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedTicket, setSelectedTicket] = useState<Complaint | null>(null);
  const [targetStatus, setTargetStatus] = useState<ComplaintStatus>('in_progress');
  const [resolutionComment, setResolutionComment] = useState('');

  const loadComplaints = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await dataService.fetchComplaints();
      setComplaints(data);
    } catch (err) {
      console.error('Failed to load staff complaints:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadComplaints();
  }, [loadComplaints]);

  const staffTickets = complaints.filter(
    (c) => c.assigned_staff_id === currentUser.id || c.department_id === currentUser.department_id || !c.assigned_staff_id
  );

  const handleOpenUpdateModal = (ticket: Complaint, status: ComplaintStatus) => {
    setSelectedTicket(ticket);
    setTargetStatus(status);
    setResolutionComment(
      status === 'resolved' ? 'Technician replaced faulty capacitor and restored power load.' : 'Work in progress.'
    );
  };

  const handleConfirmStatusChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    try {
      await dataService.updateComplaintStatus(selectedTicket.id, targetStatus, resolutionComment, false);
      await loadComplaints();
      setSelectedTicket(null);
    } catch (err: any) {
      alert(err.message || 'Failed to update complaint status');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center space-x-2">
          <Wrench className="w-7 h-7 text-emerald-400" />
          <span>Technician Assigned Queue</span>
        </h1>
        <p className="text-xs md:text-sm text-slate-400">
          Update work order progress, log field notes, and mark completed jobs.
        </p>
      </div>

      <div className="space-y-4">
        {staffTickets.map((c) => (
          <GlassCard key={c.id} className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded border border-blue-500/20">
                  {c.complaint_number}
                </span>
                <StatusBadge priority={c.priority} />
                <StatusBadge status={c.status} />
              </div>
              <SlaTimerBadge createdAt={c.created_at} dueAt={c.due_at} status={c.status} showProgress />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{c.title}</h3>
              <p className="text-xs text-slate-300 mt-1">{c.description}</p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800 text-xs">
              <span className="text-slate-400">
                Location: <strong className="text-slate-200">{c.location}</strong> | Student: <strong className="text-slate-200">{c.student_name}</strong>
              </span>

              <div className="flex items-center space-x-2">
                <RippleButton
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/complaints/${c.id}`)}
                  icon={<Eye className="w-3.5 h-3.5" />}
                >
                  Inspect Ticket
                </RippleButton>

                {c.status !== 'in_progress' && c.status !== 'resolved' && c.status !== 'closed' && (
                  <RippleButton
                    variant="secondary"
                    size="sm"
                    onClick={() => handleOpenUpdateModal(c, 'in_progress')}
                    icon={<Play className="w-3.5 h-3.5" />}
                  >
                    Start In Progress
                  </RippleButton>
                )}

                {c.status !== 'resolved' && c.status !== 'closed' && (
                  <RippleButton
                    variant="success"
                    size="sm"
                    onClick={() => handleOpenUpdateModal(c, 'resolved')}
                    icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  >
                    Mark as Resolved
                  </RippleButton>
                )}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Status Update Modal */}
      {selectedTicket && (
        <Modal
          isOpen={Boolean(selectedTicket)}
          onClose={() => setSelectedTicket(null)}
          title={`Update Work Order: ${selectedTicket.complaint_number}`}
        >
          <form onSubmit={handleConfirmStatusChange} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Target Status</label>
              <select
                value={targetStatus}
                onChange={(e) => setTargetStatus(e.target.value as ComplaintStatus)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="in_progress">IN PROGRESS</option>
                <option value="resolved">RESOLVED</option>
                <option value="rejected">REJECTED</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Resolution / Field Comment</label>
              <textarea
                rows={3}
                value={resolutionComment}
                onChange={(e) => setResolutionComment(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <RippleButton type="submit" variant="primary" className="w-full">
              Confirm Work Order Update
            </RippleButton>
          </form>
        </Modal>
      )}
    </div>
  );
};
