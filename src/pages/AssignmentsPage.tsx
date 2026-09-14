import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Assignment } from '../types';
import { api } from '../services/api';
import {
  BookOpen,
  Calendar,
  Clock,
  Download,
  FileText,
  Filter,
  GraduationCap,
  Upload,
  User,
  CheckCircle2,
  AlertCircle,
  LogIn,
  Search,
} from 'lucide-react';

export const AssignmentsPage: React.FC = () => {
  const { classes, subjects, currentUser, navigate } = useApp();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Due Soon' | 'Past Due'>('All');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchAssignments = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAssignments(
        selectedClass !== 'All' ? selectedClass : undefined,
        selectedSubject !== 'All' ? selectedSubject : undefined
      );
      setAssignments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [selectedClass, selectedSubject]);

  const filteredAssignments = assignments.filter((a) => {
    const now = new Date();
    const due = new Date(a.dueDate);
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 3600 * 24));

    let status = 'Active';
    if (diffDays < 0) status = 'Past Due';
    else if (diffDays <= 2) status = 'Due Soon';

    const matchesStatus = statusFilter === 'All' || statusFilter === status;
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.instructions.toLowerCase().includes(search.toLowerCase()) ||
      a.teacherName.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#0F1E36] via-[#162A4A] to-[#0A1628] text-white py-14 border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-400/40 rounded-full text-amber-400 text-xs font-extrabold uppercase tracking-widest">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Digital Learning & Homework</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-['Cinzel',serif] tracking-tight">
            Assignments & Continuous Assessment
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
            Access curriculum homework, STEM project rubrics, and holiday assignments across all grades.
          </p>
        </div>
      </section>

      {/* Filter & Action Controls */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto flex-1">
            {/* Class Selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Class / Grade
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 text-slate-800 bg-white"
              >
                <option value="All">All Classes & Grades</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject Selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 text-slate-800 bg-white"
              >
                <option value="All">All Subjects</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Keyword Search
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="e.g. Science, Coding..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Quick Portal Switch */}
          <div className="flex items-center gap-2 w-full lg:w-auto justify-end pt-2 lg:pt-0">
            {currentUser?.role === 'TEACHER' ? (
              <button
                onClick={() => navigate('teacher-portal')}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-2 transition"
              >
                <Upload className="w-4 h-4" />
                <span>Upload New Assignment</span>
              </button>
            ) : (
              <button
                onClick={() => navigate('portal-login')}
                className="px-4 py-2 bg-[#0F1E36] hover:bg-slate-800 text-white font-bold text-xs rounded-lg flex items-center gap-2 transition"
              >
                <LogIn className="w-4 h-4 text-amber-400" />
                <span>Teacher Portal Upload</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Assignments List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        {isLoading ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            Loading assignments from school database...
          </div>
        ) : filteredAssignments.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-2">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Assignments Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              There are currently no assignments matching the selected filters. Please check back soon or switch classes.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAssignments.map((item) => {
              const now = new Date();
              const due = new Date(item.dueDate);
              const isPast = due.getTime() < now.getTime();
              const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 3600 * 24));

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-amber-400 transition space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-[#0F1E36] text-amber-300 font-mono text-xs font-bold rounded">
                        {item.className}
                      </span>
                      <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 font-bold text-xs rounded">
                        {item.subjectName}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">Term {item.term}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isPast ? (
                        <span className="px-2.5 py-0.5 bg-red-100 text-red-800 rounded-full text-[11px] font-bold">
                          Past Due
                        </span>
                      ) : diffDays <= 2 ? (
                        <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 rounded-full text-[11px] font-bold animate-pulse">
                          Due Soon ({diffDays} day{diffDays === 1 ? '' : 's'})
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-bold">
                          Active
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                    <div className="mt-1 text-xs text-slate-500 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-amber-600" />
                      <span>Set by: <strong>{item.teacherName}</strong></span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs text-slate-700">
                    <div className="font-bold text-slate-900 text-[11px] uppercase tracking-wider">
                      Instructions & Learning Objectives:
                    </div>
                    <p className="leading-relaxed whitespace-pre-wrap">{item.instructions}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs">
                    <div className="flex flex-wrap items-center gap-4 text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Assigned: {item.assignedDate}</span>
                      </span>
                      <span className="flex items-center gap-1 font-bold text-amber-800">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Deadline: {item.dueDate}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.attachmentUrl && (
                        <a
                          href={item.attachmentUrl}
                          download
                          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition"
                        >
                          <Download className="w-3.5 h-3.5 text-slate-600" />
                          <span>Download Worksheet</span>
                        </a>
                      )}
                      <button
                        onClick={() => navigate('learner-portal')}
                        className="px-4 py-1.5 bg-[#0F1E36] hover:bg-amber-600 text-white rounded-lg font-bold text-xs transition"
                      >
                        Submit Answer
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
