import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dataService } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import {
  Bell,
  ShieldCheck,
  GraduationCap,
  Wrench,
  BarChart3,
  LogOut,
  CheckCircle,
  AlertTriangle,
  Menu,
  X,
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const currentUser = user || dataService.getActiveUser();
  const activeRole = currentUser.role || 'student';
  const notifications = dataService.getNotifications(currentUser.id);
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleBadges: Record<string, { label: string; bg: string; icon: React.ReactNode }> = {
    student: { label: 'Student', bg: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    staff: { label: 'Staff / Faculty', bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: <Wrench className="w-3.5 h-3.5" /> },
    admin: { label: 'Dept Admin', bg: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    super_admin: { label: 'Super Admin', bg: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  };

  const currentBadge = roleBadges[activeRole] || roleBadges.student;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left Side: Brand Logo & Sidebar Toggle */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-900/30 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-base md:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                CAMPUS COMPLAINT & SERVICE MANAGEMENT
              </span>
            </div>
          </Link>
        </div>

        {/* Right Side: User Profile & Controls */}
        <div className="flex items-center space-x-3">
          {/* Active Role Badge */}
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${currentBadge.bg}`}>
            {currentBadge.icon}
            <span className="hidden sm:inline">{currentBadge.label}</span>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 md:w-96 rounded-xl border border-slate-800 bg-slate-900 shadow-2xl p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Notifications</h4>
                  <span className="text-xs text-slate-400">{unreadCount} unread</span>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-500 py-4 text-center">No notifications yet.</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          dataService.markNotificationRead(n.id);
                          setShowNotifMenu(false);
                          if (n.link) navigate(n.link);
                        }}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                          !n.is_read
                            ? 'bg-blue-500/10 border-blue-500/30 text-slate-100'
                            : 'bg-slate-800/40 border-slate-800 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center space-x-2 font-semibold text-blue-400 mb-1">
                          {n.type === 'sla' ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                          ) : (
                            <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
                          )}
                          <span>{n.title}</span>
                        </div>
                        <p className="text-slate-300 leading-snug">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Info & Logout */}
          <div className="flex items-center space-x-3 pl-2 border-l border-slate-800">
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-white leading-tight">{currentUser.full_name}</p>
              <p className="text-[10px] text-slate-400 leading-tight">{currentUser.email}</p>
            </div>
            
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center space-x-1"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden md:inline text-xs font-semibold">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
