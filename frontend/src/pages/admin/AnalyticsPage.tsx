import React from 'react';
import { dataService } from '../../services/dataService';
import { GlassCard } from '../../components/ui/GlassCard';
import { BarChart3, TrendingUp, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const complaints = dataService.getComplaints();

  const locationCounts: Record<string, number> = {};
  complaints.forEach((c) => {
    locationCounts[c.location] = (locationCounts[c.location] || 0) + 1;
  });

  const locationData = Object.keys(locationCounts).map((loc) => ({
    location: loc.length > 20 ? loc.substring(0, 18) + '...' : loc,
    count: locationCounts[loc],
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center space-x-2">
          <BarChart3 className="w-7 h-7 text-indigo-400" />
          <span>Advanced Campus Analytics & SLA Performance</span>
        </h1>
        <p className="text-xs md:text-sm text-slate-400">
          In-depth reports on location hotspots, resolution velocity, and SLA adherence.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="space-y-4">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <span>Complaint Hotspots by Campus Location</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationData} layout="vertical">
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="location" type="category" stroke="#64748b" fontSize={10} width={130} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Complaint Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="space-y-4">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Clock className="w-5 h-5 text-emerald-400" />
            <span>Average Resolution Velocity (Hours)</span>
          </h3>
          <div className="space-y-4 py-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Emergency SLA (Target: 2h)</span>
                <span className="text-emerald-400">Avg: 1.2 Hours</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[60%]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">High Priority SLA (Target: 6h)</span>
                <span className="text-blue-400">Avg: 3.8 Hours</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-[63%]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Medium Priority SLA (Target: 24h)</span>
                <span className="text-amber-400">Avg: 14.5 Hours</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full w-[60%]" />
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
