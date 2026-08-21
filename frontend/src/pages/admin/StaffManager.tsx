import React from 'react';
import { DEMO_PROFILES } from '../../services/mockData';
import { GlassCard } from '../../components/ui/GlassCard';
import { Users, Wrench, Phone, Mail } from 'lucide-react';

export const StaffManager: React.FC = () => {
  const staffMembers = [
    DEMO_PROFILES.staff,
    {
      id: 'usr-staff-2',
      email: 'narayana.gl@nriit.edu.in',
      full_name: 'Dr. G.L. Narayana (Civil & Infrastructure Lead)',
      role: 'staff' as const,
      department_name: 'Plumbing & Civil Infrastructure',
      phone: '+91 94405 67890',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      created_at: '2026-01-10T09:00:00.000Z',
    },
    {
      id: 'usr-staff-3',
      email: 'sreenivasarao.k@nriit.edu.in',
      full_name: 'Sri K. Sreenivasa Rao (Campus IT Systems Engineer)',
      role: 'staff' as const,
      department_name: 'IT Infrastructure & Campus Wi-Fi',
      phone: '+91 94402 11223',
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      created_at: '2026-01-10T09:00:00.000Z',
    },
    {
      id: 'usr-staff-4',
      email: 'venkateswararao.m@nriit.edu.in',
      full_name: 'Sri M. Venkateswara Rao (Sanitation Supervisor)',
      role: 'staff' as const,
      department_name: 'Sanitation & Hygiene Services',
      phone: '+91 94403 33445',
      avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
      created_at: '2026-01-10T09:00:00.000Z',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center space-x-2">
          <Users className="w-7 h-7 text-emerald-400" />
          <span>Staff Directory & Workload Allocation</span>
        </h1>
        <p className="text-xs md:text-sm text-slate-400">
          Technicians and staff members assigned to handle work order resolution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {staffMembers.map((st) => (
          <GlassCard key={st.id} className="space-y-4 text-center">
            <img src={st.avatar_url} alt={st.full_name} className="w-20 h-20 rounded-full border-2 border-emerald-500/40 mx-auto object-cover" />
            <div>
              <h3 className="font-bold text-white text-base">{st.full_name}</h3>
              <p className="text-xs text-emerald-400 font-semibold mt-0.5">{st.department_name}</p>
            </div>
            <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 space-y-1">
              <p className="flex items-center justify-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>{st.email}</span>
              </p>
              <p className="flex items-center justify-center space-x-1">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{st.phone}</span>
              </p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
