import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  GraduationCap,
  Mail,
  Phone,
  BookOpen,
  Award,
  Sparkles,
  ArrowRight,
  LogIn,
  Search,
} from 'lucide-react';

export const TeachersPage: React.FC = () => {
  const { teachers, navigate } = useApp();
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [search, setSearch] = useState('');

  const departments = ['All', 'Leadership', 'Early Years', 'Primary', 'Junior Secondary (JSS)', 'STEM & ICT'];

  const filteredTeachers = teachers.filter((t) => {
    const matchesDept =
      selectedDept === 'All'
        ? true
        : selectedDept === 'Leadership'
        ? t.role === 'DIRECTOR' || t.role === 'HEADTEACHER' || t.role === 'ICT_ADMIN'
        : t.department.toLowerCase().includes(selectedDept.toLowerCase());

    const matchesSearch =
      t.fullName.toLowerCase().includes(search.toLowerCase()) ||
      t.specialization.toLowerCase().includes(search.toLowerCase()) ||
      t.subjects.some((s) => s.toLowerCase().includes(search.toLowerCase()));

    return matchesDept && matchesSearch;
  });

  return (
    <div className="space-y-14 pb-16">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#0F1E36] via-[#162A4A] to-[#0A1628] text-white py-14 border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-400/40 rounded-full text-amber-400 text-xs font-extrabold uppercase tracking-widest">
            <Users className="w-3.5 h-3.5" />
            <span>Dedicated Faculty Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-['Cinzel',serif] tracking-tight">
            Our Teachers & Academic Staff
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
            Certified, experienced, and deeply caring educators guiding the learners of Amani Junior Academy & JSS.
          </p>
        </div>
      </section>

      {/* Staff Filter Bar & Portal Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          {/* Department Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedDept === dept
                    ? 'bg-[#0F1E36] text-amber-400 shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search teacher or subject..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 text-slate-800"
            />
          </div>
        </div>

        {/* Teacher Portal Quick Action Banner */}
        <div className="mt-4 p-3.5 bg-amber-50 rounded-xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-amber-900 font-semibold">
            <LogIn className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Are you a faculty member? Access lesson planning, homework uploading, and student attendance:</span>
          </div>
          <button
            onClick={() => navigate('teacher-portal')}
            className="px-4 py-1.5 bg-[#0F1E36] hover:bg-amber-600 text-white rounded-lg font-bold text-xs shrink-0 flex items-center gap-1.5 transition"
          >
            <span>Log in to Teacher Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* Teachers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-sm hover:border-amber-500 transition group flex flex-col justify-between"
            >
              <div>
                {/* Header card visual */}
                <div className="h-44 bg-gradient-to-tr from-[#0F1E36] to-[#1E3A8A] relative flex items-center justify-center p-4">
                  <div className="w-24 h-24 rounded-full border-4 border-amber-400 overflow-hidden bg-white shadow-lg">
                    <img
                      src={teacher.photoUrl || '/amani_logo.jpg'}
                      alt={teacher.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="absolute top-3 right-3 px-2 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-extrabold rounded uppercase tracking-wider">
                    {teacher.position}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div>
                    <h3 className="text-base font-extrabold text-[#0F1E36] font-['Cinzel',serif]">
                      {teacher.fullName}
                    </h3>
                    <div className="text-xs font-semibold text-amber-700">{teacher.department}</div>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                      {teacher.qualifications}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {teacher.biography}
                  </p>

                  <div className="pt-2">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Assigned Subjects:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {teacher.subjects.map((sub, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
                <span className="font-semibold text-slate-700">Specialization:</span>
                <span className="text-amber-800 font-medium truncate max-w-[170px]">
                  {teacher.specialization}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredTeachers.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
            No teachers found matching your search. Try changing your filters.
          </div>
        )}
      </section>
    </div>
  );
};
