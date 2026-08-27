import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth, UserRole } from '../context/AuthContext';
import { dataService } from '../services/dataService';
import { apiService } from '../services/api';
import { RippleButton } from '../components/ui/RippleButton';
import { ShieldCheck, GraduationCap, UserCheck, Building2, ArrowRight, AlertCircle, CheckCircle2, Mail, Sparkles, Globe, MapPin } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const initialRole = (location.state as { role?: UserRole })?.role || 'student';
  const [activeTab, setActiveTab] = useState<UserRole>(initialRole);
  const [googleEmail, setGoogleEmail] = useState(
    initialRole === 'staff'
      ? 'ramesh.elec@nriit.edu.in'
      : initialRole === 'admin' || initialRole === 'super_admin'
      ? 'admin@nriit.edu.in'
      : 'asif.khan@student.nriit.edu.in'
  );
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleTabChange = (role: UserRole) => {
    setActiveTab(role);
    setErrorMessage('');
    if (role === 'student') {
      setGoogleEmail('asif.khan@student.nriit.edu.in');
    } else if (role === 'staff') {
      setGoogleEmail('ramesh.elec@nriit.edu.in');
    } else {
      setGoogleEmail('admin@nriit.edu.in');
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

  const handleGoogleSignIn = async (targetEmailInput?: string) => {
    setErrorMessage('');
    setIsGoogleLoading(true);

    try {
      const emailToUse = (targetEmailInput || googleEmail || 'user@gmail.com').trim();
      if (!emailToUse || !emailToUse.includes('@')) {
        setErrorMessage('Please enter a valid Google account email address (e.g., user@gmail.com).');
        setIsGoogleLoading(false);
        return;
      }

      const targetName = emailToUse.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      const defaultPicture =
        activeTab === 'student'
          ? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80'
          : activeTab === 'staff'
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
          : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80';

      const data = await apiService.googleLogin({
        email: emailToUse,
        name: targetName,
        picture: defaultPicture,
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
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-8 md:py-12">
      <div className="w-full max-w-5xl rounded-3xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Side: Campus Photograph & University Branding Showcase */}
        <div className="lg:col-span-6 relative bg-slate-900 p-8 lg:p-12 flex flex-col justify-between overflow-hidden min-h-[320px] lg:min-h-[600px]">
          {/* Authentic Campus Image Background */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />

          {/* Top Logo & Title */}
          <div className="relative z-10 space-y-4">
            <Link to="/" className="inline-flex items-center space-x-3 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-xl shadow-blue-900/50 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-black text-lg text-white tracking-tight block">
                  NRI UNIVERSITY
                </span>
                <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-widest block">
                  Student Services Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Center Showcase Statement */}
          <div className="relative z-10 my-auto py-8 space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
              Centralized Campus Support
            </span>
            <h1 className="text-2xl lg:text-4xl font-extrabold text-white leading-tight">
              NRI University Student Complaint & Service Management
            </h1>
            <p className="text-xs lg:text-sm text-slate-300 leading-relaxed max-w-md">
              Connect directly with department leads. Raise campus concerns, track SLAs, request academic and hostel services, and experience seamless campus support.
            </p>
          </div>

          {/* Bottom Campus Footer Notice */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>Vijayawada, AP</span>
            </span>
            <a
              href="https://rvrnriuniversity.edu.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline font-semibold flex items-center space-x-1"
            >
              <span>rvrnriuniversity.edu.in</span>
              <Globe className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Right Side: Exclusive Google Authentication Card */}
        <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-center space-y-6 bg-slate-900/60">
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-white tracking-tight">Portal Authorization Login</h2>
            <p className="text-xs text-slate-400">Select your role and sign in with Google SSO</p>
          </div>

          {/* Role Selector Tabs */}
          <div className="p-1 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-3 gap-1">
            <button
              type="button"
              onClick={() => handleTabChange('student')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
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
              className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
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
              className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                activeTab === 'admin'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Admin</span>
            </button>
          </div>

          {/* NRI University Reference Profile Card */}
          <div className="p-3.5 rounded-2xl border border-slate-800 bg-slate-950/70 flex items-center space-x-3">
            <img
              src={
                activeTab === 'student'
                  ? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80'
                  : activeTab === 'staff'
                  ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
                  : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
              }
              alt="NRI Reference Profile"
              className="w-12 h-12 rounded-xl object-cover border border-blue-500/40 shadow-sm flex-shrink-0"
            />
            <div className="text-left overflow-hidden">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400 block">
                {activeTab === 'student' ? 'NRI Student Reference' : activeTab === 'staff' ? 'NRI Faculty Reference' : 'NRI Admin Reference'}
              </span>
              <p className="text-xs font-bold text-white truncate">
                {activeTab === 'student'
                  ? 'Mohammad Asif Khan (CSE Dept)'
                  : activeTab === 'staff'
                  ? 'Sri Ch. Satyanarayana (Electrical Lead)'
                  : 'Dr. K.V. Sambasiva Rao (HOD, CSE)'}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {activeTab === 'student'
                  ? 'asif.khan@student.nriit.edu.in'
                  : activeTab === 'staff'
                  ? 'ramesh.elec@nriit.edu.in'
                  : 'admin@nriit.edu.in'}
              </p>
            </div>
          </div>

          {/* Exclusive Google Authentication Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleGoogleSignIn();
            }}
            className="space-y-4"
          >
            {errorMessage && (
              <div className="p-3 rounded-xl border border-red-500/40 bg-red-500/10 text-red-400 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>Google Account Email</span>
                <span className="text-[10px] text-slate-500">Any @gmail.com or institutional domain</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  placeholder="your.name@gmail.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-800/80 bg-slate-950/40 text-[11px] text-slate-400 flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>
                Google Single Sign-On: Authenticating grants full portal access under {activeTab.toUpperCase()} role permissions.
              </span>
            </div>

            {/* Primary Google Sign-In Button */}
            <button
              type="submit"
              disabled={isGoogleLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm transition-all flex items-center justify-center space-x-3 shadow-lg border border-slate-200 group"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
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
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Quick 1-Click Google Sign-In with Reference Profile */}
            <RippleButton
              type="button"
              disabled={isGoogleLoading}
              onClick={() =>
                handleGoogleSignIn(
                  activeTab === 'student'
                    ? 'asif.khan@student.nriit.edu.in'
                    : activeTab === 'staff'
                    ? 'ramesh.elec@nriit.edu.in'
                    : 'admin@nriit.edu.in'
                )
              }
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-blue-400 font-semibold rounded-xl text-xs transition-all flex items-center justify-center space-x-2 border border-slate-700/80"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>
                1-Click Google Login as {activeTab === 'student' ? 'Mohammad Asif Khan' : activeTab === 'staff' ? 'Ch. Satyanarayana' : 'Dr. K.V. Sambasiva Rao'}
              </span>
            </RippleButton>
          </form>
        </div>
      </div>
    </div>
  );
};
