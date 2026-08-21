import React, { useState } from 'react';
import { dataService } from '../../services/dataService';
import { GlassCard } from '../../components/ui/GlassCard';
import { Building2, Mail, User, ShieldCheck } from 'lucide-react';

export const DepartmentManager: React.FC = () => {
  const departments = dataService.getDepartments();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center space-x-2">
          <Building2 className="w-7 h-7 text-amber-400" />
          <span>Campus Departments Directory</span>
        </h1>
        <p className="text-xs md:text-sm text-slate-400">
          Manage campus departments, head of department assignments, and resolution routing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {departments.map((dept) => (
          <GlassCard key={dept.id} className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {dept.code}
                </span>
                <h3 className="font-bold text-white text-base">{dept.name}</h3>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300">
              <p className="flex items-center space-x-2">
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span>Dept Head: <strong className="text-white">{dept.head_name}</strong></span>
              </p>
              <p className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>Contact: <strong className="text-slate-400">{dept.head_email}</strong></span>
              </p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
