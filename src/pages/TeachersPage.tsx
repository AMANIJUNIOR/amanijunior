import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TeacherProfile } from '../types';
import {
  Users,
  Mail,
  Phone,
  BookOpen,
  Award,
  Sparkles,
  ArrowRight,
  LogIn,
  Search,
  CheckCircle2,
  Heart,
  Star,
  ShieldCheck,
  X,
  School,
  BadgeCheck,
} from 'lucide-react';

export const TeachersPage: React.FC = () => {
  const { teachers, navigate } = useApp();
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [activeModalTeacher, setActiveModalTeacher] = useState<TeacherProfile | null>(null);
  const [expandedView, setExpandedView] = useState(false);

  const departments = [
    'All',
    'Leadership & Administration',
    'Early Childhood (ECDE)',
    'Lower Primary',
    'Upper Primary',
    'Junior Secondary (JSS)',
  ];

  const filteredTeachers = teachers.filter((t) => {
    const deptLower = (t.department || '').toLowerCase();
    const posLower = (t.position || '').toLowerCase();

    let matchesDept = true;
    if (selectedDept === 'Leadership & Administration') {
      matchesDept =
        posLower.includes('director') ||
        posLower.includes('headteacher') ||
        posLower.includes('deputy') ||
        deptLower.includes('leadership') ||
        deptLower.includes('governance');
    } else if (selectedDept === 'Early Childhood (ECDE)') {
      matchesDept =
        deptLower.includes('early') ||
        deptLower.includes('ecde') ||
        deptLower.includes('pre-primary') ||
        posLower.includes('playgroup') ||
        posLower.includes('daycare') ||
        posLower.includes('pp1') ||
        posLower.includes('pp2');
    } else if (selectedDept === 'Lower Primary') {
      matchesDept =
        deptLower.includes('lower') ||
        posLower.includes('grade 1') ||
        posLower.includes('grade 2') ||
        posLower.includes('grade 3');
    } else if (selectedDept === 'Upper Primary') {
      matchesDept =
        deptLower.includes('upper') ||
        posLower.includes('grade 4') ||
        posLower.includes('grade 5') ||
        posLower.includes('grade 6');
    } else if (selectedDept === 'Junior Secondary (JSS)') {
      matchesDept =
        deptLower.includes('junior') ||
        deptLower.includes('jss') ||
        posLower.includes('grade 7') ||
        posLower.includes('grade 8') ||
        posLower.includes('grade 9');
    }

    const s = search.toLowerCase().trim();
    const subjectsList = t.assignedSubjects || [];
    const classesList = t.assignedClasses || [];
    const matchesSearch =
      !s ||
      (t.fullName || '').toLowerCase().includes(s) ||
      (t.specialization || '').toLowerCase().includes(s) ||
      (t.position || '').toLowerCase().includes(s) ||
      (t.department || '').toLowerCase().includes(s) ||
      subjectsList.some((sub) => sub.toLowerCase().includes(s)) ||
      classesList.some((c) => c.toLowerCase().includes(s));

    return matchesDept && matchesSearch;
  });

  const getPraiseBadge = (teacher: TeacherProfile) => {
    const pos = (teacher.position || '').toLowerCase();
    const full = (teacher.fullName || '').toLowerCase();

    if (full.includes('constance') || pos.includes('director')) {
      return { label: 'Institutional Visionary & Founder', color: 'bg-amber-100 text-amber-900 border-amber-300' };
    }
    if (full.includes('nadhiri') || (pos.includes('headteacher') && !pos.includes('deputy'))) {
      return { label: 'Quality Assurance & Instructional Lead', color: 'bg-blue-100 text-blue-900 border-blue-300' };
    }
    if (full.includes('vitalice') || pos.includes('deputy')) {
      return { label: 'Dean of Academics & STEM Innovator', color: 'bg-purple-100 text-purple-900 border-purple-300' };
    }
    if (pos.includes('daycare') || pos.includes('playgroup')) {
      return { label: 'Maternal Warmth & Early Play Specialist', color: 'bg-rose-100 text-rose-900 border-rose-300' };
    }
    if (pos.includes('pp1') || pos.includes('pp2')) {
      return { label: 'Foundational Phonics & Reading Architect', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
    }
    if (pos.includes('grade 1') || pos.includes('grade 2') || pos.includes('grade 3')) {
      return { label: 'Exemplary CBC Formative Facilitator', color: 'bg-indigo-100 text-indigo-900 border-indigo-300' };
    }
    if (pos.includes('grade 7') || pos.includes('jss')) {
      return { label: 'Junior Secondary Distinction & Debate Coach', color: 'bg-teal-100 text-teal-900 border-teal-300' };
    }
    return { label: 'Dedicated Competency-Based Educator', color: 'bg-amber-100 text-amber-900 border-amber-300' };
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#0F1E36] via-[#162A4A] to-[#0A1628] text-white py-14 border-b-4 border-amber-500 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-500/20 border border-amber-400/40 rounded-full text-amber-400 text-xs font-extrabold uppercase tracking-widest shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dedicated Educational Faculty</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Cinzel',serif] tracking-tight">
            Our Distinguished Teachers & Academic Leaders
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Every teacher at Amani Junior Academy and JSS is a passionate mentor, certified CBC professional, and caring role model dedicated to bringing out the genius in every child.
          </p>
        </div>
      </section>

      {/* Staff Management Portal Access Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500/10 via-white to-amber-500/10 rounded-2xl border-2 border-amber-400/60 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-sm font-bold">
              <LogIn className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Authorized Faculty & Staff Access
              </div>
              <div className="text-sm font-black text-slate-900">
                Staff Management & Academic Assessment Portal
              </div>
              <p className="text-[11px] text-slate-600">
                Input termly marks, manage student attendance, upload assignments, and update student CBC competencies.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => navigate('portal-login')}
              className="w-full md:w-auto px-5 py-2.5 bg-[#0F1E36] hover:bg-amber-600 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Sign In to Staff Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Department Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedDept === dept
                      ? 'bg-[#0F1E36] text-amber-400 shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>

            {/* View Mode & Search Box */}
            <div className="flex items-center gap-2.5 w-full md:w-auto">
              <button
                onClick={() => setExpandedView(!expandedView)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  expandedView
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                title="Toggle between compact summary and complete expanded profile cards"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{expandedView ? 'Show Standard Cards' : 'Expand All Complete Profiles'}</span>
              </button>

              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search faculty, subjects, grades..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500 text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500 font-medium pt-1 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <span>
              Showing <strong className="text-slate-800">{filteredTeachers.length}</strong> distinguished educator{filteredTeachers.length === 1 ? '' : 's'}
            </span>
            <span className="text-[11px] text-amber-700 font-medium">
              ✨ Click <strong>"View Complete Profile"</strong> on any educator to review their praise, pedagogical philosophy, and assigned subjects.
            </span>
          </div>
        </div>
      </section>

      {/* Teachers Directory Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredTeachers.map((teacher) => {
            const badge = getPraiseBadge(teacher);
            const subjects = teacher.assignedSubjects || [];
            const classes = teacher.assignedClasses || [];
            const directPhone = teacher.phone || (teacher.id === 'tch-ict' ? '0746529712' : teacher.id === 'tch-dir' ? '0718540922' : teacher.id === 'tch-ht' ? '0114623408' : null);

            return (
              <div
                key={teacher.id}
                className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-sm hover:border-amber-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Visual Header */}
                  <div className="bg-gradient-to-tr from-[#0F1E36] via-[#162A4A] to-[#1E3A8A] p-6 text-white relative">
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-20 h-20 rounded-2xl border-2 border-amber-400 overflow-hidden bg-slate-800 shadow-md flex items-center justify-center font-bold text-amber-300 text-2xl font-['Cinzel',serif]">
                        {teacher.fullName
                          .split(' ')
                          .map((n) => n[0])
                          .filter(Boolean)
                          .slice(0, 2)
                          .join('')}
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-2.5 py-1 bg-amber-500 text-slate-950 text-[10px] font-black rounded-lg uppercase tracking-wider shadow-sm">
                          {teacher.staffId || 'FACULTY'}
                        </span>
                        <div className="text-[10px] text-slate-300 font-semibold mt-1">
                          {teacher.department}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h3 className="text-lg font-extrabold font-['Cinzel',serif] text-white group-hover:text-amber-300 transition">
                        {teacher.fullName}
                      </h3>
                      <div className="text-xs font-bold text-amber-400">
                        {teacher.position}
                      </div>
                    </div>
                  </div>

                  {/* Praise Badge & Leadership Direct Contact */}
                  <div className="px-6 pt-4 flex flex-wrap items-center justify-between gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${badge.color}`}>
                      <Heart className="w-3 h-3 fill-current" />
                      <span>{badge.label}</span>
                    </span>

                    {directPhone && (
                      <a
                        href={`tel:${directPhone}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[11px] font-mono font-bold transition shadow-xs"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{directPhone}</span>
                      </a>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    {/* Institutional Praise & Commendation Callout */}
                    {(teacher.commendation || teacher.biography) && (
                      <div className="p-3.5 bg-gradient-to-r from-amber-50/90 via-amber-100/50 to-amber-50/90 rounded-2xl border border-amber-300/80 shadow-xs space-y-1.5">
                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                          <span>Praise & Institutional Commendation</span>
                        </div>
                        <p className="text-xs text-amber-950 font-medium italic leading-relaxed">
                          "{teacher.commendation || teacher.biography}"
                        </p>
                      </div>
                    )}


                    {/* Pedagogical Philosophy */}
                    {teacher.philosophy && (
                      <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-200/60 text-xs">
                        <div className="text-[10px] font-extrabold text-blue-900 uppercase tracking-wider flex items-center gap-1 mb-0.5">
                          <Sparkles className="w-3 h-3 text-blue-600" />
                          <span>Teaching Philosophy</span>
                        </div>
                        <p className="text-[11px] text-blue-950 italic">
                          "{teacher.philosophy}"
                        </p>
                      </div>
                    )}

                    {/* Full Biography in Expanded View */}
                    {expandedView && (
                      <div className="space-y-1 pt-1">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          Full Professional Biography
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {teacher.biography}
                        </p>
                      </div>
                    )}

                    {/* Assigned Cohorts & Subjects */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      {classes.length > 0 && (
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Assigned Classes:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {classes.map((cls, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-blue-50 text-blue-800 text-[10px] font-bold rounded-md border border-blue-100"
                              >
                                {cls}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {subjects.length > 0 && (
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Specialized Subjects:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {subjects.map((sub, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-md border border-emerald-100"
                              >
                                {sub}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer with Modal Trigger */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-500 truncate max-w-[170px]">
                    <span className="font-semibold text-slate-700">Specialization:</span> {teacher.specialization}
                  </div>
                  <button
                    onClick={() => setActiveModalTeacher(teacher)}
                    className="px-3.5 py-1.5 bg-[#0F1E36] hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
                  >
                    <span>View Complete Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTeachers.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <div className="text-sm font-bold text-slate-700">No teachers found matching your search</div>
            <p className="text-xs text-slate-500">
              Try selecting "All" or clearing the search query to view our complete faculty list.
            </p>
            <button
              onClick={() => {
                setSelectedDept('All');
                setSearch('');
              }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* FULL TEACHER PROFILE MODAL */}
      {activeModalTeacher && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-3xl border-2 border-amber-500 shadow-2xl overflow-hidden relative my-8">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#0F1E36] via-[#162A4A] to-[#1E3A8A] text-white p-6 sm:p-8 relative">
              <button
                onClick={() => setActiveModalTeacher(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                <div className="w-24 h-24 rounded-2xl border-4 border-amber-400 bg-slate-800 flex items-center justify-center text-3xl font-bold font-['Cinzel',serif] text-amber-300 shadow-xl">
                  {activeModalTeacher.fullName
                    .split(' ')
                    .map((n) => n[0])
                    .filter(Boolean)
                    .slice(0, 2)
                    .join('')}
                </div>
                <div className="space-y-1">
                  <span className="inline-block px-3 py-0.5 bg-amber-500 text-slate-950 font-black text-[10px] rounded-md uppercase tracking-wider">
                    {activeModalTeacher.staffId} • {activeModalTeacher.department}
                  </span>
                  <h2 className="text-2xl font-extrabold font-['Cinzel',serif]">
                    {activeModalTeacher.fullName}
                  </h2>
                  <div className="text-sm font-bold text-amber-400">
                    {activeModalTeacher.position}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[68vh] overflow-y-auto">
              {/* Praise & Commendation Spotlight */}
              <div className="p-5 bg-gradient-to-r from-amber-50 via-amber-100/60 to-amber-50 border-2 border-amber-300 rounded-2xl space-y-2 shadow-xs">
                <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs uppercase tracking-wider">
                  <Award className="w-4 h-4 text-amber-600 fill-amber-500" />
                  <span>Institutional Commendation & Official Praise</span>
                </div>
                <p className="text-amber-950 leading-relaxed italic font-serif text-sm font-medium">
                  "{activeModalTeacher.commendation || activeModalTeacher.biography}"
                </p>
              </div>

              {/* Teaching Philosophy & Conviction */}
              {activeModalTeacher.philosophy && (
                <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-1.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Pedagogical Conviction & Teaching Philosophy</span>
                  </div>
                  <p className="text-xs text-blue-950 font-medium italic leading-relaxed">
                    "{activeModalTeacher.philosophy}"
                  </p>
                </div>
              )}

              {/* Full Biography */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-slate-600" />
                  <span>Educator Biography & Academic Journey</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  {activeModalTeacher.biography}
                </p>
              </div>


              {/* Specializations & Clubs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                    <span>Core Specialization</span>
                  </div>
                  <div className="text-xs text-slate-800 font-medium">
                    {activeModalTeacher.specialization}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Institutional Roles & Clubs</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(activeModalTeacher.additionalSpecializations && activeModalTeacher.additionalSpecializations.length > 0
                      ? activeModalTeacher.additionalSpecializations
                      : ['CBC Subject Facilitator', 'Learner Pastoral Care']
                    ).map((role, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-white border border-slate-200 text-slate-700 text-[10px] font-bold rounded">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Classes & Subjects */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Assigned Classes & Cohorts
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(activeModalTeacher.assignedClasses || []).map((c, i) => (
                      <span key={i} className="px-2.5 py-1 bg-blue-100 text-blue-900 font-bold text-xs rounded-lg">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Subjects Taught
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(activeModalTeacher.assignedSubjects || []).map((s, i) => (
                      <span key={i} className="px-2.5 py-1 bg-emerald-100 text-emerald-900 font-bold text-xs rounded-lg">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Direct Leadership Phone / Contact if applicable */}
              {(activeModalTeacher.phone || activeModalTeacher.id === 'tch-ict' || activeModalTeacher.id === 'tch-dir' || activeModalTeacher.id === 'tch-ht') && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-900">
                      Direct Academic & Administrative Line
                    </div>
                    <div className="text-[11px] text-emerald-700">
                      Available for parental consultation, academic inquiries, and admissions.
                    </div>
                  </div>
                  <a
                    href={`tel:${activeModalTeacher.phone || (activeModalTeacher.id === 'tch-ict' ? '0746529712' : activeModalTeacher.id === 'tch-dir' ? '0718540922' : '0114623408')}`}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-2 shadow-sm transition"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call {activeModalTeacher.phone || (activeModalTeacher.id === 'tch-ict' ? '0746529712' : activeModalTeacher.id === 'tch-dir' ? '0718540922' : '0114623408')}</span>
                  </a>
                </div>
              )}

              {/* Institutional Values Commitment */}
              <div className="p-3.5 bg-slate-100 rounded-xl text-center text-xs text-slate-600 font-medium">
                "Committed to the Amani Junior Academy motto: <strong>STRIVE TO ACHIEVE</strong> &bull; Nurturing every learner with excellence, discipline, and integrity."
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setActiveModalTeacher(null)}
                className="px-5 py-2 bg-[#0F1E36] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
