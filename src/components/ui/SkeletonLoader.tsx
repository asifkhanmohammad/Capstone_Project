import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-4 w-28 bg-slate-800 rounded"></div>
        <div className="h-5 w-16 bg-slate-800 rounded-full"></div>
      </div>
      <div className="h-6 w-3/4 bg-slate-800 rounded"></div>
      <div className="h-4 w-full bg-slate-800/70 rounded"></div>
      <div className="h-4 w-2/3 bg-slate-800/70 rounded"></div>
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
        <div className="h-4 w-24 bg-slate-800 rounded"></div>
        <div className="h-4 w-20 bg-slate-800 rounded"></div>
      </div>
    </div>
  );
};

export const SkeletonTableRow: React.FC = () => {
  return (
    <tr className="animate-pulse border-b border-slate-800/50">
      <td className="p-4"><div className="h-4 w-24 bg-slate-800 rounded"></div></td>
      <td className="p-4"><div className="h-4 w-48 bg-slate-800 rounded"></div></td>
      <td className="p-4"><div className="h-5 w-20 bg-slate-800 rounded-full"></div></td>
      <td className="p-4"><div className="h-5 w-16 bg-slate-800 rounded-full"></div></td>
      <td className="p-4"><div className="h-4 w-28 bg-slate-800 rounded"></div></td>
      <td className="p-4"><div className="h-4 w-20 bg-slate-800 rounded"></div></td>
    </tr>
  );
};
