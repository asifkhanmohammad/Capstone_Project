import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { RippleButton } from '../components/ui/RippleButton';
import { ShieldCheck, GraduationCap, Wrench, Building2, Lock, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('asifkhan.m@nriit.edu.in');
  const [password, setPassword] = useState('demo123456');
  const [selectedRole, setSelectedRole] = useState<'student' | 'staff' | 'admin' | 'super_admin'>('student');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dataService.setActiveRole(selectedRole);
    if (selectedRole === 'student') navigate('/student');
    else if (selectedRole === 'staff') navigate('/staff');
    else navigate('/admin');
  };

  const selectPreset = (role: 'student' | 'staff' | 'admin' | 'super_admin', demoEmail: string) => {
    setSelectedRole(role);
    setEmail(demoEmail);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-8 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mx-auto text-white shadow-lg shadow-blue-900/40">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-white">Campus Portal Login</h2>
          <p className="text-xs text-slate-400">Sign in to manage complaints and campus service requests</p>
        </div>

        {/* Demo Preset Buttons */}
        <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
            SELECT CAMPUS PORTAL ROLE TO LOGIN:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => selectPreset('student', 'asifkhan.m@nriit.edu.in')}
              className={`p-2 rounded-lg border flex items-center space-x-1.5 font-medium transition-all ${
                selectedRole === 'student'
                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student</span>
            </button>

            <button
              type="button"
              onClick={() => selectPreset('staff', 'satyanarayana.ch@nriit.edu.in')}
              className={`p-2 rounded-lg border flex items-center space-x-1.5 font-medium transition-all ${
                selectedRole === 'staff'
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Staff</span>
            </button>

            <button
              type="button"
              onClick={() => selectPreset('admin', 'sambasivarao.kv@nriit.edu.in')}
              className={`p-2 rounded-lg border flex items-center space-x-1.5 font-medium transition-all ${
                selectedRole === 'admin'
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>

            <button
              type="button"
              onClick={() => selectPreset('super_admin', 'principal@nriit.edu.in')}
              className={`p-2 rounded-lg border flex items-center space-x-1.5 font-medium transition-all ${
                selectedRole === 'super_admin'
                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Super Admin</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Campus Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <RippleButton
            type="submit"
            className="w-full py-3"
            variant="primary"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In to Dashboard
          </RippleButton>
        </form>

        <p className="text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-blue-400 hover:underline">
            Register Student Profile
          </Link>
        </p>
      </div>
    </div>
  );
};
