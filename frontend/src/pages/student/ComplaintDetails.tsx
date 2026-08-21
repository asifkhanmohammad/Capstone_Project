import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dataService } from '../../services/dataService';
import { GlassCard } from '../../components/ui/GlassCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SlaTimerBadge } from '../../components/ui/SlaTimerBadge';
import { RippleButton } from '../../components/ui/RippleButton';
import { Modal } from '../../components/ui/Modal';
import { ComplaintStatus } from '../../types';
import {
  ArrowLeft,
  Clock,
  UserCheck,
  Building2,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Star,
  MessageSquare,
  Eye,
  ShieldAlert,
} from 'lucide-react';

export const ComplaintDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const complaint = dataService.getComplaintById(id || '');

  const [evidenceModalUrl, setEvidenceModalUrl] = useState<string | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [isSatisfied, setIsSatisfied] = useState(true);
  const [commentText, setCommentText] = useState('');

  if (!complaint) {
    return (
      <GlassCard className="text-center py-12 space-y-4">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-xl font-bold text-white">Complaint Order Not Found</h3>
        <p className="text-xs text-slate-400">The requested complaint ID does not exist or was removed.</p>
        <RippleButton variant="primary" onClick={() => navigate('/student')}>
          Return to Dashboard
        </RippleButton>
      </GlassCard>
    );
  }

  const timelineEvents = dataService.getTimelineEvents(complaint.id);
  const existingFeedback = dataService.getFeedbackForComplaint(complaint.id);

  // Workflow Timeline Steps
  const WORKFLOW_STEPS: { status: ComplaintStatus; label: string }[] = [
    { status: 'submitted', label: 'Submitted' },
    { status: 'verified', label: 'Verified' },
    { status: 'assigned', label: 'Assigned' },
    { status: 'in_progress', label: 'In Progress' },
    { status: 'resolved', label: 'Resolved' },
    { status: 'closed', label: 'Closed' },
  ];

  const getStepState = (stepStatus: ComplaintStatus) => {
    const order: ComplaintStatus[] = ['submitted', 'verified', 'assigned', 'in_progress', 'resolved', 'closed'];

    if (complaint.status === 'rejected') {
      return stepStatus === 'submitted' ? 'completed' : 'disabled';
    }

    if (complaint.status === 'reopened') {
      if (['submitted', 'verified', 'assigned', 'in_progress'].includes(stepStatus)) return 'completed';
      if (stepStatus === 'resolved') return 'reopened';
      return 'pending';
    }

    const currentIndex = order.indexOf(complaint.status);
    const stepIndex = order.indexOf(stepStatus);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    dataService.updateComplaintStatus(
      complaint.id,
      complaint.status,
      `Student note: ${commentText}`,
      false
    );
    setCommentText('');
    window.location.reload();
  };

  const handleSubmitFeedbackForm = (e: React.FormEvent) => {
    e.preventDefault();
    dataService.submitFeedback(complaint.id, rating, feedbackComment, isSatisfied);
    setShowFeedbackModal(false);
    window.location.reload();
  };

  const handleReopen = () => {
    dataService.updateComplaintStatus(
      complaint.id,
      'reopened',
      'Student reopened complaint: Issue resolved unsatisfactorily.',
      false
    );
    window.location.reload();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back Navigation Bar */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Work Orders</span>
      </button>

      {/* Main Ticket Banner */}
      <GlassCard className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="font-mono text-sm font-extrabold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-500/20">
                {complaint.complaint_number}
              </span>
              <StatusBadge priority={complaint.priority} />
              <StatusBadge status={complaint.status} />
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-white">{complaint.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <strong className="text-slate-200">{complaint.location}</strong>
              </span>
              <span className="flex items-center space-x-1">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>{complaint.department_name || 'Unassigned Dept'}</span>
              </span>
              <span className="flex items-center space-x-1">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Assigned: {complaint.assigned_staff_name || 'Pending Staff'}</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end space-y-2 shrink-0">
            <SlaTimerBadge createdAt={complaint.created_at} dueAt={complaint.due_at} status={complaint.status} showProgress />
            <p className="text-[10px] text-slate-500">
              Submitted: {new Date(complaint.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Workflow Visual Timeline Bar */}
        <div className="py-2 space-y-3">
          <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
            Operational Workflow Step Timeline:
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
            {WORKFLOW_STEPS.map((step) => {
              const state = getStepState(step.status);
              return (
                <div
                  key={step.status}
                  className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${
                    state === 'completed'
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                      : state === 'current'
                      ? 'bg-blue-500/20 border-blue-500 text-blue-300 ring-2 ring-blue-500/30'
                      : state === 'reopened'
                      ? 'bg-purple-500/20 border-purple-500 text-purple-300 animate-pulse'
                      : 'bg-slate-950/60 border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-center mb-1">
                    {state === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : state === 'current' ? (
                      <Clock className="w-4 h-4 text-blue-400 animate-spin" />
                    ) : state === 'reopened' ? (
                      <RotateCcw className="w-4 h-4 text-purple-400" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-slate-700" />
                    )}
                  </div>
                  <span>{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Complaint Description & Evidence */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h4>
              <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                {complaint.description}
              </p>
            </div>

            {/* Evidence Attachments */}
            {complaint.evidence_urls.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Attached Evidence Proof</h4>
                <div className="flex items-center space-x-3">
                  {complaint.evidence_urls.map((url, idx) => (
                    <div
                      key={idx}
                      onClick={() => setEvidenceModalUrl(url)}
                      className="relative group w-24 h-24 rounded-xl border border-slate-700 overflow-hidden cursor-pointer shadow-lg"
                    >
                      <img src={url} alt="Evidence" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Box: Resolution & Feedback */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Complaint Actions</h4>

              {complaint.status === 'resolved' && !existingFeedback && (
                <RippleButton
                  variant="success"
                  className="w-full text-xs"
                  onClick={() => setShowFeedbackModal(true)}
                  icon={<Star className="w-4 h-4" />}
                >
                  Rate & Submit Resolution Feedback
                </RippleButton>
              )}

              {complaint.status === 'resolved' && (
                <RippleButton
                  variant="outline"
                  className="w-full text-xs text-rose-400 border-rose-500/30 hover:bg-rose-500/10"
                  onClick={handleReopen}
                  icon={<RotateCcw className="w-4 h-4" />}
                >
                  Issue Not Resolved? Reopen Complaint
                </RippleButton>
              )}

              {existingFeedback && (
                <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 space-y-1 text-xs text-emerald-300">
                  <div className="flex items-center justify-between font-bold">
                    <span>Feedback Recorded:</span>
                    <span className="flex items-center space-x-0.5">
                      {Array.from({ length: existingFeedback.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </span>
                  </div>
                  {existingFeedback.comments && <p className="italic text-slate-300">"{existingFeedback.comments}"</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Activity Timeline Log */}
      <GlassCard className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <MessageSquare className="w-4 h-4 text-blue-400" />
          <span>Activity Timeline Log ({timelineEvents.length})</span>
        </h3>

        <div className="space-y-3">
          {timelineEvents.map((evt) => (
            <div key={evt.id} className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 text-xs space-y-1">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-blue-400">{evt.user_name} ({evt.user_role.toUpperCase()})</span>
                <span className="text-[10px] text-slate-500">{new Date(evt.created_at).toLocaleString()}</span>
              </div>
              <p className="text-slate-300">{evt.comment}</p>
            </div>
          ))}
        </div>

        {/* Add Student Note Form */}
        <form onSubmit={handleAddComment} className="pt-2 flex items-center space-x-2">
          <input
            type="text"
            placeholder="Add a comment or inquiry note..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
          />
          <RippleButton type="submit" variant="secondary" size="sm">
            Post Note
          </RippleButton>
        </form>
      </GlassCard>

      {/* Image Preview Modal */}
      {evidenceModalUrl && (
        <Modal isOpen={Boolean(evidenceModalUrl)} onClose={() => setEvidenceModalUrl(null)} title="Evidence Image Preview">
          <img src={evidenceModalUrl} alt="Evidence Large" className="w-full rounded-xl object-contain max-h-[70vh]" />
        </Modal>
      )}

      {/* Post-Resolution Feedback Modal */}
      {showFeedbackModal && (
        <Modal isOpen={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} title="Resolution Feedback">
          <form onSubmit={handleSubmitFeedbackForm} className="space-y-4">
            <p className="text-xs text-slate-300">
              Was your complaint resolved to your satisfaction by the assigned department?
            </p>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsSatisfied(true)}
                className={`flex-1 py-2 rounded-lg border text-xs font-bold ${
                  isSatisfied ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Yes, Satisfied
              </button>
              <button
                type="button"
                onClick={() => setIsSatisfied(false)}
                className={`flex-1 py-2 rounded-lg border text-xs font-bold ${
                  !isSatisfied ? 'bg-rose-500/20 border-rose-500 text-rose-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                No, Unsatisfied
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Star Rating (1 - 5)</label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Feedback Comments</label>
              <textarea
                rows={3}
                placeholder="Share details regarding the technician's response..."
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <RippleButton type="submit" variant="success" className="w-full">
              Submit Official Rating
            </RippleButton>
          </form>
        </Modal>
      )}
    </div>
  );
};
