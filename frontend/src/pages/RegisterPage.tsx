import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { RippleButton } from '../components/ui/RippleButton';
import { ShieldCheck, UserPlus, CheckCircle2 } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'student' | 'staff'>('student');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    dataService.setActiveRole(role);
    navigate(role === 'student' ? '/student' : '/staff');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-lg space-y-6 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-8 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mx-auto text-white shadow-lg shadow-blue-900/40">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">Create Campus Account</h2>
          <p className="text-xs text-slate-400">Register as Student or Staff Technician</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                role === 'student'
                  ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              Student Profile
            </button>
            <button
              type="button"
              onClick={() => setRole('staff')}
              className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                role === 'staff'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              Staff Profile
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="e.g. Alex Johnson"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">University Email</label>
            <input
              type="email"
              placeholder="e.g. alex.j@nriuniv.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Student / Staff ID</label>
              <input
                type="text"
                placeholder="STU-2026-XXXX"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="+1 (555) 019-2834"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <RippleButton
            type="submit"
            className="w-full py-3"
            variant="primary"
            icon={<CheckCircle2 className="w-4 h-4" />}
          >
            Create Account & Continue
          </RippleButton>
        </form>

        <p className="text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-blue-400 hover:underline">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
};
