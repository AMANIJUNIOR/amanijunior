import React from 'react';
import { useApp } from '../context/AppContext';
import { SchoolLogoBadge } from './SchoolLogoBadge';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
  Shield,
  Heart,
  ChevronRight,
  BookOpen,
  GraduationCap,
  Users,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate, settings } = useApp();

  return (
    <footer className="bg-[#0A1628] text-slate-300 border-t-4 border-amber-500 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1: School Brand & Identity */}
          <div className="space-y-4">
            <SchoolLogoBadge size="md" textColor="light" />
            <p className="text-xs text-slate-300 leading-relaxed">
              A premier private junior academy and junior secondary institution in Mazeras, Kwale County. Committed
              to the Kenyan Competency-Based Curriculum (CBC), STEM technological innovation, moral leadership, and
              holistic child development.
            </p>
            <div className="pt-2">
              <div className="inline-block px-3 py-1 bg-amber-500/15 border border-amber-500/30 rounded-md text-xs font-extrabold text-amber-400 tracking-wider uppercase">
                MOTTO: "STRIVE TO ACHIEVE"
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-700 pb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Explore School</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigate('about')}
                  className="hover:text-amber-400 transition flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                  <span>About Our School & Leadership</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('academics')}
                  className="hover:text-amber-400 transition flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                  <span>Curriculum & JSS Learning</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('teachers')}
                  className="hover:text-amber-400 transition flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                  <span>Teaching Staff Directory</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('gallery')}
                  className="hover:text-amber-400 transition flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                  <span>Campus Facilities & Gallery</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('assignments')}
                  className="hover:text-amber-400 transition flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                  <span>Assignments & Homework Portal</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('news-events')}
                  className="hover:text-amber-400 transition flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                  <span>News Notices & Calendar</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('admissions')}
                  className="hover:text-amber-400 transition flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                  <span>Admissions & Entry Requirements</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Digital Portals */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-700 pb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Digital School Portals</span>
            </h4>
            <div className="space-y-2.5">
              <button
                onClick={() => navigate('parent-portal')}
                className="w-full text-left p-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/50 transition group flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition" />
                  <span className="text-xs font-bold text-slate-200">Parent Portal</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
              </button>

              <button
                onClick={() => navigate('teacher-portal')}
                className="w-full text-left p-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-500/50 transition group flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-400 group-hover:scale-110 transition" />
                  <span className="text-xs font-bold text-slate-200">Teacher Portal</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
              </button>

              <button
                onClick={() => navigate('learner-portal')}
                className="w-full text-left p-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-blue-500/50 transition group flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-blue-400 group-hover:scale-110 transition" />
                  <span className="text-xs font-bold text-slate-200">Learner Portal</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400" />
              </button>

              <button
                onClick={() => navigate('admin-portal')}
                className="w-full text-left p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-amber-500/30 hover:border-amber-500 transition group flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400 group-hover:scale-110 transition" />
                  <span className="text-xs font-bold text-amber-300">Director / Admin Portal</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-300" />
              </button>
            </div>
          </div>

          {/* Column 4: Official Contacts */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-700 pb-2 flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-400" />
              <span>Official Contacts</span>
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Postal Address:</div>
                  <div className="text-slate-300">{settings.postalAddress}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Mazeras, Kwale County, Kenya</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">School Director:</div>
                  <div className="text-slate-200 font-semibold">{settings.directorName}</div>
                  <a href={`tel:${settings.directorPhone}`} className="text-amber-400 font-mono hover:underline">
                    {settings.directorPhone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Headteacher:</div>
                  <div className="text-slate-200 font-semibold">{settings.headteacherName}</div>
                  <a href={`tel:${settings.headteacherPhone}`} className="text-amber-400 font-mono hover:underline">
                    {settings.headteacherPhone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Office Hours:</div>
                  <div className="text-slate-300 text-[11px]">{settings.officeHours}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} <strong className="text-white">AMANI JUNIOR ACADEMY AND JSS</strong>. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="text-amber-400 font-medium">"STRIVE TO ACHIEVE"</span>
            <div className="h-3 w-px bg-slate-700" />
            <button onClick={() => navigate('contact')} className="hover:text-white transition">
              School Help Desk
            </button>
            <button onClick={() => navigate('portal-login')} className="hover:text-white transition">
              Staff Access
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
