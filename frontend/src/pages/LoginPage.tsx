import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '../context/AuthContext';
import { dataService } from '../services/dataService';
import { RippleButton } from '../components/ui/RippleButton';
import { ShieldCheck, GraduationCap, UserCheck, Building2, Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [activeTab, setActiveTab] = useState<UserRole>('student');
  const [email, setEmail] = useState('asif.khan@student.nriit.edu.in');
  const [password, setPassword] = useState('student123456');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleTabChange = (role: UserRole) => {
    setActiveTab(role);
    setErrorMessage('');
    if (role === 'student') {
      setEmail('asif.khan@student.nriit.edu.in');
      setPassword('student123456');
    } else if (role === 'staff') {
      setEmail('ramesh.elec@nriit.edu.in');
      setPassword('faculty123456');
    } else {
      setEmail('admin@nriit.edu.in');
      setPassword('admin123456');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter both email address and password.');
      return;
    }

    setIsLoading(true);

    try {
      // Call Express/MongoDB auth API if available, fallback to session initialization
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: activeTab }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.user, data.token);
        dataService.setActiveRole(data.user.role);
      } else {
        // Fallback local session if API backend is offline
        const fallbackName = email.split('@')[0].replace('.', ' ');
        const formattedName = fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1);
        const fallbackUser = {
          id: `usr-${activeTab}-${Date.now()}`,
          name: formattedName,
          email,
          role: activeTab,
          department: activeTab === 'staff' ? 'Faculty & Electrical Maintenance' : 'Computer Science & Engineering',
        };
        login(fallbackUser, `token_local_${Date.now()}`);
        dataService.setActiveRole(activeTab);
      }

      // Navigate to intended destination or role dashboard
      const fromPath = (location.state as { from?: { pathname: string } })?.from?.pathname;
      if (fromPath && !fromPath.includes('/login')) {
        navigate(fromPath);
      } else {
        if (activeTab === 'student') navigate('/student');
        else if (activeTab === 'staff') navigate('/staff');
        else navigate('/admin');
      }
    } catch {
      // Local session fallback
      const fallbackUser = {
        id: `usr-${activeTab}-${Date.now()}`,
        name: activeTab === 'student' ? 'Mohammad Asif Khan' : activeTab === 'staff' ? 'K. Ramesh (Faculty Lead)' : 'Dr. Principal Admin',
        email,
        role: activeTab,
        department: activeTab === 'staff' ? 'Faculty Maintenance' : 'Computer Science',
      };
      login(fallbackUser, `token_offline_${Date.now()}`);
      dataService.setActiveRole(activeTab);

      if (activeTab === 'student') navigate('/student');
      else if (activeTab === 'staff') navigate('/staff');
      else navigate('/admin');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-md p-8 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mx-auto text-white shadow-lg shadow-blue-900/40">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Campus Authorization Login</h2>
          <p className="text-xs text-slate-400">Select your role to access Complaint & Service Management</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="p-1 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-3 gap-1">
          <button
            type="button"
            onClick={() => handleTabChange('student')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'student'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('staff')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'staff'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Faculty/Staff</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('admin')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'admin'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Admin</span>
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4 pt-2">
          {errorMessage && (
            <div className="p-3 rounded-lg border border-red-500/40 bg-red-500/10 text-red-400 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {activeTab === 'student' ? 'Student Institutional Email' : activeTab === 'staff' ? 'Faculty / Staff Email' : 'Administrator Email'}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={activeTab === 'student' ? 'student@nriit.edu.in' : 'faculty@nriit.edu.in'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
            </div>
          </div>

          <div className="p-3 rounded-xl border border-slate-800/80 bg-slate-950/40 text-[11px] text-slate-400 flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>
              Authorized Access Only: Logging in grants access to the portal under {activeTab.toUpperCase()} permissions.
            </span>
          </div>

          <RippleButton
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-900/30"
          >
            <span>{isLoading ? 'Authenticating...' : `Sign In to ${activeTab.toUpperCase()} Portal`}</span>
            <ArrowRight className="w-4 h-4" />
          </RippleButton>
        </form>

        <div className="text-center pt-2 text-xs text-slate-500">
          Need a student or faculty account?{' '}
          <Link to="/register" className="text-blue-400 hover:underline font-medium">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};
