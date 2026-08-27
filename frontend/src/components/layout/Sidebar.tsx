import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { dataService } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  ListOrdered,
  Wrench,
  BarChart3,
  Users,
  Building2,
  Bell,
  MessageSquareHeart,
  Settings,
  HelpCircle,
  FileCheck2,
  ShieldCheck,
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const activeRole = user?.role || dataService.getActiveRole();
  const location = useLocation();

  const studentNavItems = [
    { label: 'Dashboard', path: '/student', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Submit Complaint', path: '/student/submit', icon: <PlusCircle className="w-4 h-4" /> },
    { label: 'My Complaints', path: '/student/complaints', icon: <ListOrdered className="w-4 h-4" /> },
    { label: 'Service Requests', path: '/student/services', icon: <Wrench className="w-4 h-4" /> },
    { label: 'Notifications', path: '/student/notifications', icon: <Bell className="w-4 h-4" /> },
    { label: 'Feedback & Ratings', path: '/student/feedback', icon: <MessageSquareHeart className="w-4 h-4" /> },
  ];

  const staffNavItems = [
    { label: 'Staff Work-Center', path: '/staff', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Assigned Complaints', path: '/staff/assigned', icon: <ListOrdered className="w-4 h-4" /> },
  ];

  const adminNavItems = [
    { label: 'Admin Dashboard', path: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'All Complaints', path: '/admin/complaints', icon: <ListOrdered className="w-4 h-4" /> },
    { label: 'Departments', path: '/admin/departments', icon: <Building2 className="w-4 h-4" /> },
    { label: 'Staff Management', path: '/admin/staff', icon: <Users className="w-4 h-4" /> },
    { label: 'Analytics & SLA Reports', path: '/admin/analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'Service Requests', path: '/admin/services', icon: <FileCheck2 className="w-4 h-4" /> },
    { label: 'System Settings', path: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const navItems =
    activeRole === 'student'
      ? studentNavItems
      : activeRole === 'staff'
      ? staffNavItems
      : adminNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-950/80 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-30 w-64 transform border-r border-slate-800 bg-slate-950 p-4 transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full justify-between">
          <div className="space-y-6">
            <div className="px-3 py-2 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Navigation Portal
              </span>
              <p className="text-xs font-semibold text-white capitalize">
                {activeRole.replace('_', ' ')} Workspace
              </p>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-900/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* University Portal Status Badge */}
          <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 text-center space-y-1">
            <div className="flex items-center justify-center space-x-1.5 text-[11px] font-extrabold text-blue-400 uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>NRI University System</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              Centralized Campus Support
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
