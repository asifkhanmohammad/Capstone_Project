import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RippleButton } from '../components/ui/RippleButton';
import { GlassCard } from '../components/ui/GlassCard';
import { Footer } from '../components/layout/Footer';
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
  BookOpen,
  Wifi,
  Bus,
  Trophy,
  Globe,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleLaunchRole = (role: 'student' | 'staff' | 'admin' | 'super_admin') => {
    if (isAuthenticated && user) {
      if (user.role === 'student') navigate('/student');
      else if (user.role === 'staff') navigate('/staff');
      else navigate('/admin');
    } else {
      navigate('/login', { state: { role } });
    }
  };

  const serviceCategories = [
    { title: 'Academic Services', desc: 'Classroom setup, examination support, course timetable queries, and academic resources.', icon: <BookOpen className="w-6 h-6 text-blue-400" /> },
    { title: 'Infrastructure & Power', desc: 'Electrical fixtures, classroom maintenance, lab equipment, and civil infrastructure repairs.', icon: <Zap className="w-6 h-6 text-amber-400" /> },
    { title: 'Hostel Facilities', desc: 'Hostel room repairs, plumbing, hot water supply, mess sanitation, and residential support.', icon: <Building2 className="w-6 h-6 text-emerald-400" /> },
    { title: 'IT & Digital Campus', desc: 'Campus Wi-Fi AP connectivity, computer lab workstations, student portal accounts, and network access.', icon: <Wifi className="w-6 h-6 text-purple-400" /> },
    { title: 'Fleet & Transport', desc: 'Campus shuttle bus schedules, route management, transport timing, and fleet maintenance.', icon: <Bus className="w-6 h-6 text-cyan-400" /> },
    { title: 'Library & Digital Catalog', desc: 'Digital library access, physical book requests, quiet study room reservations, and reference support.', icon: <BookOpen className="w-6 h-6 text-indigo-400" /> },
    { title: 'Campus Life & Sports', desc: 'Sports grounds, auditorium reservations, cultural club equipment, and event logistics.', icon: <Trophy className="w-6 h-6 text-rose-400" /> },
    { title: 'Vigilance & Security', desc: 'Campus gate entry RFID barriers, night security patrols, safety monitoring, and lost & found.', icon: <ShieldCheck className="w-6 h-6 text-emerald-400" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500 selection:text-white flex flex-col justify-between">
      <div>
        {/* Top University Announcement Bar */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-b border-slate-800 py-2 px-4 text-center text-xs text-slate-300">
          <div className="max-w-7xl mx-auto flex items-center justify-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span className="font-semibold text-white">NRI UNIVERSITY CENTRALIZED PORTAL:</span>
            <span>Official Student Complaint & Service Management Platform</span>
            <a
              href="https://rvrnriuniversity.edu.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline font-bold hidden sm:inline ml-2"
            >
              rvrnriuniversity.edu.in →
            </a>
          </div>
        </div>

        {/* Hero Section with Campus Background Banner */}
        <div className="relative overflow-hidden border-b border-slate-800">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1600&q=80')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950 to-slate-950 pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center space-y-8 z-10">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-extrabold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>NRI UNIVERSITY STUDENT SERVICES</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-tight">
              Your Voice. Your Campus. Your University.
            </h1>

            <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
              Raise complaints, request campus services, and stay informed about the progress of your requests through one centralized platform at NRI University.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <RippleButton
                size="lg"
                variant="primary"
                icon={<ArrowRight className="w-5 h-5" />}
                onClick={() => handleLaunchRole('student')}
              >
                {isAuthenticated ? 'Go to My Dashboard' : 'Login to Student Services'}
              </RippleButton>

              <RippleButton
                size="lg"
                variant="outline"
                icon={<BarChart3 className="w-5 h-5" />}
                onClick={() => handleLaunchRole('admin')}
              >
                {isAuthenticated ? 'Go to Admin Center' : 'Explore Services'}
              </RippleButton>
            </div>

            {/* Portal Launcher Ribbon */}
            <div className="pt-8 max-w-4xl mx-auto">
              <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-2xl">
                <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-3">
                  SELECT YOUR ROLE TO ENTER NRI UNIVERSITY PORTAL:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => handleLaunchRole('student')}
                    className="flex items-center justify-center space-x-2 p-3 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 font-bold text-xs transition-all hover:scale-[1.02]"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Student Login</span>
                  </button>

                  <button
                    onClick={() => handleLaunchRole('staff')}
                    className="flex items-center justify-center space-x-2 p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-bold text-xs transition-all hover:scale-[1.02]"
                  >
                    <Wrench className="w-4 h-4" />
                    <span>Faculty / Staff Login</span>
                  </button>

                  <button
                    onClick={() => handleLaunchRole('admin')}
                    className="flex items-center justify-center space-x-2 p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs transition-all hover:scale-[1.02]"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Admin Login</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NRI University Campus Support Categories Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Centralized Campus Support Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
              Automated routing directly to NRI University department leads with guaranteed SLA resolution tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {serviceCategories.map((cat, idx) => (
              <GlassCard key={idx} className="space-y-3 hover:border-blue-500/50 transition-colors group">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 w-fit group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <h3 className="font-bold text-white text-base leading-snug">{cat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{cat.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>

      {/* Reusable University Footer */}
      <Footer />
    </div>
  );
};
