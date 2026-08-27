import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Phone, Mail, ExternalLink, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 text-xs py-10 px-4 md:px-8 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* University & System Identity */}
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-sm text-white tracking-tight">
              NRI UNIVERSITY STUDENT SERVICES
            </span>
          </div>
          <p className="text-slate-400 leading-relaxed text-xs max-w-md">
            Centralized Student Complaint & Service Management System for NRI University. Empowering students, faculty, and administrative teams with transparent resolution workflows.
          </p>
          <div className="flex items-center space-x-2 text-[11px] text-blue-400 pt-1">
            <Globe className="w-3.5 h-3.5" />
            <a
              href="https://rvrnriuniversity.edu.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline font-semibold flex items-center space-x-1"
            >
              <span>rvrnriuniversity.edu.in</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </div>
        </div>

        {/* Quick Navigation Links */}
        <div className="space-y-2">
          <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-2">Student Services</h4>
          <ul className="space-y-1.5 text-xs">
            <li>
              <Link to="/login" className="hover:text-blue-400 transition-colors">
                Student Portal Login
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-blue-400 transition-colors">
                Submit a Complaint
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-blue-400 transition-colors">
                Request Campus Services
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-blue-400 transition-colors">
                Track SLA & Status
              </Link>
            </li>
          </ul>
        </div>

        {/* Campus Location & Contact */}
        <div className="space-y-2">
          <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-2">Campus Information</h4>
          <div className="space-y-2 text-[11px]">
            <p className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <span>Pothavarappadu, Agiripalli Mandal, Vijayawada, Andhra Pradesh - 521212</span>
            </p>
            <p className="flex items-center space-x-2">
              <Phone className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>+91 94401 23456 / 0866-2469666</span>
            </p>
            <p className="flex items-center space-x-2">
              <Mail className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
              <span>support@nriit.edu.in</span>
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
        <p>© {new Date().getFullYear()} NRI University. All rights reserved.</p>
        <p className="mt-2 sm:mt-0">NRIU Student Complaint & Service Management Platform</p>
      </div>
    </footer>
  );
};
