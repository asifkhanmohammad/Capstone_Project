import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataService } from '../../services/dataService';
import { predictCategory } from '../../utils/smartCategory';
import { detectRecurringIssues } from '../../utils/recurringDetector';
import { ComplaintCategory, PriorityLevel, RecurringAlert } from '../../types';
import { GlassCard } from '../../components/ui/GlassCard';
import { RippleButton } from '../../components/ui/RippleButton';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  PlusCircle,
  Sparkles,
  AlertTriangle,
  Upload,
  X,
  CheckCircle2,
  MapPin,
  Tag,
  Clock,
  FileText,
} from 'lucide-react';

export const SubmitComplaint: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>('electrical');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [location, setLocation] = useState('Hostel Block A');
  const [evidenceUrls, setEvidenceUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Smart AI Category Suggestion State
  const [aiSuggestion, setAiSuggestion] = useState<{
    suggestedCategory: ComplaintCategory;
    confidence: number;
    matchedKeywords: string[];
  } | null>(null);

  // Recurring Issue Alert State
  const [recurringAlerts, setRecurringAlerts] = useState<RecurringAlert[]>([]);

  // Update AI Category Suggestion as user types
  useEffect(() => {
    if (title.length > 3 || description.length > 5) {
      const result = predictCategory(title, description);
      if (result.confidence > 0) {
        setAiSuggestion(result);
      } else {
        setAiSuggestion(null);
      }
    } else {
      setAiSuggestion(null);
    }
  }, [title, description]);

  // Update Recurring Issues Check as user changes category & location
  useEffect(() => {
    const complaints = dataService.getComplaints();
    const alerts = detectRecurringIssues(complaints, category, location, 24);
    setRecurringAlerts(alerts);
  }, [category, location]);

  const handleApplyAiCategory = () => {
    if (aiSuggestion) {
      setCategory(aiSuggestion.suggestedCategory);
    }
  };

  const handleSimulateUpload = () => {
    // Demo image attachment
    const sampleImages = [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80',
    ];
    const img = sampleImages[evidenceUrls.length % sampleImages.length];
    setEvidenceUrls((prev) => [...prev, img]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !location) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newComplaint = dataService.createComplaint({
        title,
        description,
        category,
        priority,
        location,
        evidence_urls: evidenceUrls,
      });

      setIsSubmitting(false);
      navigate(`/complaints/${newComplaint.id}`);
    }, 600);
  };

  const categories: { value: ComplaintCategory; label: string }[] = [
    { value: 'electrical', label: 'Electrical & Power' },
    { value: 'plumbing', label: 'Plumbing & Water' },
    { value: 'internet_wifi', label: 'Internet / Wi-Fi' },
    { value: 'hostel', label: 'Hostel Facilities' },
    { value: 'classroom', label: 'Classroom & Furniture' },
    { value: 'laboratory', label: 'Laboratory Equipment' },
    { value: 'cleaning', label: 'Cleaning & Sanitation' },
    { value: 'transport', label: 'Campus Transport' },
    { value: 'security', label: 'Campus Security' },
    { value: 'canteen', label: 'Canteen & Food' },
    { value: 'library', label: 'Library Services' },
    { value: 'other', label: 'Other Issues' },
  ];

  const locations = [
    'Hostel Block A',
    'Hostel Block B',
    'Hostel Block C',
    'Computer Science Department Block',
    'Electronics Department Block',
    'Mechanical Department Block',
    'Central Library',
    'Student Center Canteen',
    'Campus Main Gate 1',
    'Sports Complex & Gymnasium',
    'Auditorium',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center space-x-2">
          <PlusCircle className="w-7 h-7 text-blue-400" />
          <span>Register New Campus Complaint</span>
        </h1>
        <p className="text-xs md:text-sm text-slate-400">
          Provide accurate details and location for fast automated department dispatch.
        </p>
      </div>

      {/* Recurring Issue Alert Warning Banner */}
      {recurringAlerts.length > 0 && (
        <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-300 space-y-2 animate-fadeIn">
          <div className="flex items-center space-x-2 font-bold text-sm text-amber-400">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" />
            <span>Recurring Issue Detected in Your Location</span>
          </div>
          {recurringAlerts.map((alert, idx) => (
            <p key={idx} className="text-xs leading-relaxed">
              {alert.alertMessage} Admin & staff have already been alerted to this cluster.
            </p>
          ))}
        </div>
      )}

      {/* Main Submission Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <GlassCard className="space-y-5">
          {/* Title Input */}
          <div>
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">
              Complaint Title / Headline *
            </label>
            <input
              type="text"
              placeholder="e.g. Wi-Fi dropping packets continuously in Hostel Block A Room 304"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* AI Smart Category Suggestion Badge */}
          {aiSuggestion && aiSuggestion.suggestedCategory !== category && (
            <div className="p-3 rounded-xl border border-blue-500/30 bg-blue-500/10 flex items-center justify-between gap-3 animate-fadeIn">
              <div className="flex items-center space-x-2 text-xs text-blue-300">
                <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
                <span>
                  AI Smart Classifier suggests: <strong className="uppercase font-bold text-white">{aiSuggestion.suggestedCategory.replace('_', ' ')}</strong> ({aiSuggestion.confidence}% match)
                </span>
              </div>
              <button
                type="button"
                onClick={handleApplyAiCategory}
                className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shrink-0 transition-colors"
              >
                Apply Suggestion
              </button>
            </div>
          )}

          {/* Description Input */}
          <div>
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">
              Detailed Description *
            </label>
            <textarea
              rows={4}
              placeholder="Describe the issue, specific room number, symptoms, and urgency..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Category & Location Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">
                Campus Location *
              </label>
              <input
                type="text"
                list="location-list"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Select or type campus location"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none"
                required
              />
              <datalist id="location-list">
                {locations.map((loc, idx) => (
                  <option key={idx} value={loc} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Priority Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
              Priority Level & SLA Target
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => setPriority('low')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center space-y-1 transition-all ${
                  priority === 'low'
                    ? 'bg-slate-800 border-slate-600 text-white shadow-lg'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span>LOW PRIORITY</span>
                <span className="text-[10px] font-normal text-slate-400">72h SLA Window</span>
              </button>

              <button
                type="button"
                onClick={() => setPriority('medium')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center space-y-1 transition-all ${
                  priority === 'medium'
                    ? 'bg-blue-500/20 border-blue-500 text-blue-300 shadow-lg'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span>MEDIUM PRIORITY</span>
                <span className="text-[10px] font-normal text-blue-400">24h SLA Window</span>
              </button>

              <button
                type="button"
                onClick={() => setPriority('high')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center space-y-1 transition-all ${
                  priority === 'high'
                    ? 'bg-orange-500/20 border-orange-500 text-orange-300 shadow-lg'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span>HIGH PRIORITY</span>
                <span className="text-[10px] font-normal text-orange-400">6h SLA Window</span>
              </button>

              <button
                type="button"
                onClick={() => setPriority('emergency')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center space-y-1 transition-all ${
                  priority === 'emergency'
                    ? 'bg-red-500/30 border-red-500 text-red-300 shadow-lg animate-pulse'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span>EMERGENCY</span>
                <span className="text-[10px] font-normal text-red-400">2h Immediate SLA</span>
              </button>
            </div>
          </div>

          {/* Evidence Image Upload Simulator */}
          <div>
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
              Attach Evidence / Photo Proof
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleSimulateUpload}
                className="px-4 py-3 rounded-xl border border-dashed border-slate-700 hover:border-blue-500 bg-slate-950 text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-2 transition-colors"
              >
                <Upload className="w-4 h-4 text-blue-400" />
                <span>Upload Evidence Image</span>
              </button>

              {evidenceUrls.map((url, idx) => (
                <div key={idx} className="relative group w-16 h-16 rounded-xl border border-slate-700 overflow-hidden">
                  <img src={url} alt="Evidence" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setEvidenceUrls((prev) => prev.filter((_, i) => i !== idx))}
                    className="absolute inset-0 bg-slate-950/70 flex items-center justify-center text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
            <RippleButton
              type="button"
              variant="outline"
              onClick={() => navigate('/student')}
            >
              Cancel
            </RippleButton>

            <RippleButton
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              icon={<CheckCircle2 className="w-4 h-4" />}
            >
              Submit Complaint Order
            </RippleButton>
          </div>
        </GlassCard>
      </form>
    </div>
  );
};
