import React from 'react';
import { dataService } from '../../services/dataService';
import { GlassCard } from '../../components/ui/GlassCard';
import { MessageSquareHeart, Star, CheckCircle2 } from 'lucide-react';

import { Feedback } from '../../types';

export const FeedbackPage: React.FC = () => {
  const [feedbackList, setFeedbackList] = React.useState<Feedback[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    dataService.fetchFeedback()
      .then((data) => {
        if (isMounted) {
          setFeedbackList(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center space-x-2">
          <MessageSquareHeart className="w-7 h-7 text-rose-400" />
          <span>Resolution Feedback & Ratings</span>
        </h1>
        <p className="text-xs md:text-sm text-slate-400">
          Student feedback history evaluating campus department response times and quality.
        </p>
      </div>

      <div className="space-y-3">
        {feedbackList.map((fb) => (
          <GlassCard key={fb.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                {Array.from({ length: fb.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-[10px] text-slate-500">{new Date(fb.created_at).toLocaleDateString()}</span>
            </div>

            <p className="text-xs text-slate-200 italic">"{fb.comments || 'No comment provided.'}"</p>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Status: <strong className={fb.is_satisfied ? 'text-emerald-400' : 'text-rose-400'}>{fb.is_satisfied ? 'Satisfied' : 'Unsatisfied'}</strong></span>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
