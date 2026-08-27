import React from 'react';
import { DEMO_PROFILES } from '../../services/mockData';
import { GlassCard } from '../../components/ui/GlassCard';
import { Users, Phone, Mail, ShieldCheck, Award, GraduationCap } from 'lucide-react';

export const StaffManager: React.FC = () => {
  const nriSchools = [
    'School of Computer Studies',
    'School of Engineering',
    'School of Pharmaceutical Sciences',
    'School of Science, Humanities & Mgmt',
    'School of Paramedical & Allied Health',
  ];

  const facultyAndStaff = [
    {
      ...DEMO_PROFILES.super_admin,
      school: 'University Administration',
    },
    {
      ...DEMO_PROFILES.admin,
      school: 'School of Computer Studies',
    },
    {
      ...DEMO_PROFILES.staff,
      school: 'School of Engineering',
    },
    {
      id: 'usr-staff-2',
      email: 'narayana.gl@nriit.edu.in',
      full_name: 'Dr. G.L. Narayana (Professor & HOD, Civil)',
      role: 'admin' as const,
      department_name: 'Plumbing & Civil Infrastructure',
      school: 'School of Engineering',
      phone: '+91 94405 67890',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      created_at: '2026-01-10T09:00:00.000Z',
    },
    {
      id: 'usr-staff-3',
      email: 'vijaykrishna.r@nriit.edu.in',
      full_name: 'Dr. R. Vijay Krishna (Professor & HOD, EEE)',
      role: 'admin' as const,
      department_name: 'Electrical & Power Maintenance',
      school: 'School of Engineering',
      phone: '+91 94401 88776',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      created_at: '2026-01-10T09:00:00.000Z',
    },
    {
      id: 'usr-staff-4',
      email: 'surendrababu.nv@nriit.edu.in',
      full_name: 'Prof. N.V. Surendra Babu (HOD, ECE)',
      role: 'admin' as const,
      department_name: 'Sanitation & Hygiene Services',
      school: 'School of Engineering',
      phone: '+91 94402 44556',
      avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
      created_at: '2026-01-10T09:00:00.000Z',
    },
    {
      id: 'usr-staff-5',
      email: 'sreenivasarao.k@nriit.edu.in',
      full_name: 'Sri K. Sreenivasa Rao (Senior IT Network Lead)',
      role: 'staff' as const,
      department_name: 'IT Infrastructure & Campus Wi-Fi',
      school: 'School of Computer Studies',
      phone: '+91 94402 11223',
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
      created_at: '2026-01-10T09:00:00.000Z',
    },
    {
      id: 'usr-staff-6',
      email: 'venkateswararao.m@nriit.edu.in',
      full_name: 'Sri M. Venkateswara Rao (Sanitation Supervisor)',
      role: 'staff' as const,
      department_name: 'Sanitation & Hygiene Services',
      school: 'University Facilities & Services',
      phone: '+91 94403 33445',
      avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
      created_at: '2026-01-10T09:00:00.000Z',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white flex items-center space-x-2">
            <Users className="w-7 h-7 text-emerald-400" />
            <span>NRI University Faculty & Staff Directory</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400">
            Verified academic leaders, department HODs, and maintenance supervisors across NRI University schools.
          </p>
        </div>
        <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-blue-400">
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          <span>{facultyAndStaff.length} Verified Faculty Profiles</span>
        </div>
      </div>

      {/* NRI Academic Schools Ribbon */}
      <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center space-x-2 overflow-x-auto">
        <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider flex-shrink-0 px-2">
          NRI Schools:
        </span>
        {nriSchools.map((sch, i) => (
          <span
            key={i}
            className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-300 flex items-center space-x-1"
          >
            <GraduationCap className="w-3 h-3 text-blue-400" />
            <span>{sch}</span>
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {facultyAndStaff.map((st) => (
          <GlassCard key={st.id} className="space-y-4 text-center relative overflow-hidden group">
            <div className="relative inline-block mx-auto mt-2">
              <img
                src={st.avatar_url}
                alt={st.full_name}
                className="w-24 h-24 rounded-full border-4 border-slate-800 group-hover:border-blue-500 transition-colors mx-auto object-cover shadow-lg"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950" title="Active" />
            </div>

            <div>
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-1">
                {st.school}
              </span>
              <h3 className="font-bold text-white text-base leading-snug">{st.full_name}</h3>
              <p className="text-xs text-emerald-400 font-semibold mt-1 flex items-center justify-center space-x-1">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>{st.department_name}</span>
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 space-y-1.5 bg-slate-950/40 -mx-6 -mb-6 p-4 rounded-b-2xl">
              <p className="flex items-center justify-center space-x-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span className="truncate">{st.email}</span>
              </p>
              <p className="flex items-center justify-center space-x-2 text-slate-400">
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
