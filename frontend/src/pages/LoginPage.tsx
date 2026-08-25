import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '../context/AuthContext';
import { dataService } from '../services/dataService';
import { apiService } from '../services/api';
import { RippleButton } from '../components/ui/RippleButton';
import { ShieldCheck, GraduationCap, UserCheck, Building2, Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const initialRole = (location.state as { role?: UserRole })?.role || 'student';
  const [activeTab, setActiveTab] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState(
    initialRole === 'staff'
      ? 'ramesh.elec@nriit.edu.in'
      : initialRole === 'admin' || initialRole === 'super_admin'
      ? 'admin@nriit.edu.in'
      : 'asif.khan@student.nriit.edu.in'
  );
  const [password, setPassword] = useState(
    initialRole === 'staff' ? 'faculty123456' : initialRole === 'admin' || initialRole === 'super_admin' ? 'admin123456' : 'student123456'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
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

  const redirectAfterLogin = (userRole: UserRole) => {
    const fromPath = (location.state as { from?: { pathname: string } })?.from?.pathname;
    if (fromPath && !fromPath.includes('/login')) {
      navigate(fromPath);
    } else {
      if (userRole === 'student') navigate('/student');
      else if (userRole === 'staff') navigate('/staff');
      else navigate('/admin');
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
      const data = await apiService.login(email, password, activeTab);
      login(data.user, data.token);
      dataService.setActiveRole(data.user.role);
      await dataService.syncWithBackend();
      redirectAfterLogin(data.user.role);
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please check backend service.');
    } finally {
      setIsLoading(false);
    }
  };

  // Google OAuth Handler
  const handleGoogleSignIn = async (overrideEmail?: string, overrideName?: string) => {
    setErrorMessage('');
    setIsGoogleLoading(true);

    try {
      const targetEmail = overrideEmail || prompt('Enter your Google Account email:', 'asif.khan@gmail.com');
      if (!targetEmail) {
        setIsGoogleLoading(false);
        return;
      }

      const targetName = overrideName || targetEmail.split('@')[0].replace('.', ' ');

      const data = await apiService.googleLogin({
        email: targetEmail,
        name: targetName,
        picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(targetName)}&background=2563eb&color=fff`,
        role: activeTab,
      });

      login(data.user, data.token);
      dataService.setActiveRole(data.user.role);
      await dataService.syncWithBackend();
      redirectAfterLogin(data.user.role);
    } catch (err: any) {
      setErrorMessage(err.message || 'Google Authentication failed. Please try again.');
    } finally {
      setIsGoogleLoading(false);
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

        {/* Google Authentication Section */}
        <div className="space-y-3">
          <button
            type="button"
            disabled={isGoogleLoading}
            onClick={() => handleGoogleSignIn()}
            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm transition-all flex items-center justify-center space-x-3 shadow-md border border-slate-200"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
              />
            </svg>
            <span>{isGoogleLoading ? 'Connecting to Google...' : `Sign in with Google (${activeTab.toUpperCase()})`}</span>
          </button>

          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-slate-800 w-full"></div>
            <span className="bg-slate-900 px-3 text-[11px] font-medium text-slate-500 uppercase tracking-wider">or email login</span>
          </div>
        </div>

        {/* Standard Email & Password Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
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
