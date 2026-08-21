import React, { useState } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { RippleButton } from '../../components/ui/RippleButton';
import { Settings, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [emergencySla, setEmergencySla] = useState(2);
  const [highSla, setHighSla] = useState(6);
  const [mediumSla, setMediumSla] = useState(24);
  const [lowSla, setLowSla] = useState(72);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center space-x-2">
          <Settings className="w-7 h-7 text-slate-400" />
          <span>System SLA Configuration</span>
        </h1>
        <p className="text-xs md:text-sm text-slate-400">
          Configure response target hours for emergency, high, medium, and low priority work orders.
        </p>
      </div>

      <form onSubmit={handleSave}>
        <GlassCard className="space-y-4">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
            SLA Response Target Hours
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">
                Emergency Priority SLA (Hours)
              </label>
              <input
                type="number"
                value={emergencySla}
                onChange={(e) => setEmergencySla(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">
                High Priority SLA (Hours)
              </label>
              <input
                type="number"
                value={highSla}
                onChange={(e) => setHighSla(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
                Medium Priority SLA (Hours)
              </label>
              <input
                type="number"
                value={mediumSla}
                onChange={(e) => setMediumSla(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Low Priority SLA (Hours)
              </label>
              <input
                type="number"
                value={lowSla}
                onChange={(e) => setLowSla(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            {saved ? (
              <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>SLA Configuration Saved!</span>
              </span>
            ) : <div />}

            <RippleButton type="submit" variant="primary">
              Save Configuration
            </RippleButton>
          </div>
        </GlassCard>
      </form>
    </div>
  );
};
