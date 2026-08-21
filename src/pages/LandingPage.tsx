import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RippleButton } from '../components/ui/RippleButton';
import { GlassCard } from '../components/ui/GlassCard';
import {
  ShieldCheck,
  Zap,
  Clock,
  BarChart3,
  Bot,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Wrench,
  Building2,
  Lock,
} from 'lucide-react';
import { dataService } from '../services/dataService';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLaunchRole = (role: 'student' | 'staff' | 'admin' | 'super_admin') => {
    dataService.setActiveRole(role);
    if (role === 'student') navigate('/student');
    else if (role === 'staff') navigate('/staff');
    else navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500 selection:text-white">
      {/* Background Glow Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-blue-600/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-indigo-600/10 blur-[100px] pointer-events-none rounded-full" />

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center space-y-8">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent max-w-5xl mx-auto leading-tight">
          Campus Complaint & Service Management System
        </h1>

        <p className="text-base sm:text-xl text-slate-400 max-w-3xl mx-auto font-normal leading-relaxed">
          An enterprise campus platform connecting students, staff, and administrators with intelligent automated routing, real-time SLA tracking, recurring issue detection, and analytical performance dashboards.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <RippleButton
            size="lg"
            variant="primary"
            icon={<ArrowRight className="w-5 h-5" />}
            onClick={() => handleLaunchRole('student')}
          >
            Launch Student Portal
          </RippleButton>

          <RippleButton
            size="lg"
            variant="outline"
            icon={<BarChart3 className="w-5 h-5" />}
            onClick={() => handleLaunchRole('admin')}
          >
            Launch Admin Dashboard
          </RippleButton>
        </div>

        {/* Portal Launcher Ribbon */}
        <div className="pt-10 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">
              SELECT CAMPUS PORTAL ROLE TO ACCESS SYSTEM:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => handleLaunchRole('student')}
                className="flex items-center justify-center space-x-2 p-3 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 font-semibold text-xs transition-all hover:scale-105"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Student Portal</span>
              </button>

              <button
                onClick={() => handleLaunchRole('staff')}
                className="flex items-center justify-center space-x-2 p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-semibold text-xs transition-all hover:scale-105"
              >
                <Wrench className="w-4 h-4" />
                <span>Staff Technician</span>
              </button>

              <button
                onClick={() => handleLaunchRole('admin')}
                className="flex items-center justify-center space-x-2 p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-semibold text-xs transition-all hover:scale-105"
              >
                <Building2 className="w-4 h-4" />
                <span>Dept Admin</span>
              </button>

              <button
                onClick={() => handleLaunchRole('super_admin')}
                className="flex items-center justify-center space-x-2 p-3 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 font-semibold text-xs transition-all hover:scale-105"
              >
                <Lock className="w-4 h-4" />
                <span>Super Admin</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-900 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-4xl font-bold text-white">Enterprise Campus Capabilities</h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Built to demonstrate complete operational complaint lifecycles rather than basic CRUD functions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard glow>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 text-blue-400">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Smart AI Categorization</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Intelligent NLP keyword parser automatically suggests categories ("Wi-Fi not working" → Internet / Wi-Fi, "water leak" → Plumbing) with modular architecture for LLM integration.
            </p>
          </GlassCard>

          <GlassCard glow>
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4 text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Recurring Issue Detection</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Automatically clusters duplicate grievances by location & category within time windows (e.g. "17 Wi-Fi complaints reported from Hostel Block A in 24h").
            </p>
          </GlassCard>

          <GlassCard glow>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Dynamic SLA Engine</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Configurable SLA target hours (Emergency: 2h, High: 6h, Medium: 24h, Low: 72h) with live countdown timers, breach alerts, and escalation triggers.
            </p>
          </GlassCard>

          <GlassCard glow>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 text-amber-400">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Complete Operational Workflow</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              SUBMITTED → VERIFIED → ASSIGNED → IN PROGRESS → RESOLVED → CLOSED, with supporting REJECTED and student REOPENED workflows.
            </p>
          </GlassCard>

          <GlassCard glow>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Recharts Executive Analytics</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Visual analytics for department resolution velocity, SLA breach metrics, location hotspots, category distribution, and staff workload gauges.
            </p>
          </GlassCard>

          <GlassCard glow>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4 text-purple-400">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Supabase DB & Strict RLS</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              PostgreSQL schema migration script, triggers, foreign keys, and Row Level Security policies guaranteeing multi-tenant role privacy.
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
