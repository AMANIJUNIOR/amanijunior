import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SchoolLogoBadge } from '../components/SchoolLogoBadge';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  GraduationCap,
  Users,
  LogIn,
  LogOut,
  Shield,
  Layers,
} from 'lucide-react';

import { TeacherMarksEntryTab } from '../components/teacher/TeacherMarksEntryTab';
import { TeacherAttendanceTab } from '../components/teacher/TeacherAttendanceTab';
import { TeacherAssignmentsTab } from '../components/teacher/TeacherAssignmentsTab';
import { TeacherStudentRegistrationTab } from '../components/teacher/TeacherStudentRegistrationTab';
import { InfiniteCalendarModal } from '../components/common/InfiniteCalendarModal';

export const TeacherPortalPage: React.FC = () => {
  const { currentUser, navigate, settings, classes, subjects, logout } = useApp();
  const [activeTab, setActiveTab] = useState<'learners' | 'marks' | 'attendance' | 'assignments'>('learners');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4 shadow-md">
        <BookOpen className="w-12 h-12 text-amber-600 mx-auto" />
        <h2 className="text-xl font-bold font-['Cinzel',serif] text-[#0F1E36]">
          Teacher Portal Access
        </h2>
        <p className="text-xs text-slate-600">
          Authorized faculty credentials are required to enter assessment marks, record attendance, and publish coursework handouts.
        </p>
        <button
          onClick={() => navigate('portal-login')}
          className="w-full py-2.5 bg-[#0F1E36] hover:bg-amber-600 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-2"
        >
          <LogIn className="w-4 h-4" />
          <span>Sign In to Teacher Portal</span>
        </button>
      </div>
    );
  }

  // Derive teacher's assigned classes and subjects
  const assignedClasses =
    currentUser.assignedClasses && currentUser.assignedClasses.length > 0
      ? currentUser.assignedClasses
      : classes.map((c) => c.name);

  const assignedSubjects =
    currentUser.assignedSubjects && currentUser.assignedSubjects.length > 0
      ? currentUser.assignedSubjects
      : subjects.map((s) => s.name);

  return (
    <div className="min-h-[85vh] bg-slate-50 py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0F1E36] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-bold border border-amber-400/30">
            <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
            <span>Faculty Academic Station • {settings.schoolName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Cinzel',serif] tracking-wide">
            Instructor Academic Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Welcome, <strong className="text-white">{currentUser.name}</strong> • Staff ID: {currentUser.staffId || currentUser.username} • Motto: "{settings.motto}"
          </p>
          <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-slate-300">
            <span>Assigned Classes:</span>
            {assignedClasses.map((c) => (
              <span key={c} className="bg-white/10 px-2 py-0.5 rounded text-amber-300 font-medium">
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 relative z-10 shrink-0">
          <button
            type="button"
            onClick={() => setIsCalendarOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-amber-300 rounded-xl text-xs font-bold shadow-sm transition border border-white/20 cursor-pointer"
            title="Open Infinite Academic Calendar"
          >
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Academic Calendar</span>
          </button>
          <button
            id="btn-teacher-portal-logout"
            onClick={() => logout('portal-login')}
            className="flex items-center gap-2 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm transition border border-rose-400/30 active:scale-95 cursor-pointer"
            title="Sign out of Teacher Portal"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
          <SchoolLogoBadge size="md" className="bg-white/10 p-1 rounded-2xl" />
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm scrollbar-none">
        <button
          onClick={() => setActiveTab('learners')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            activeTab === 'learners'
              ? 'bg-[#0F1E36] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4 text-amber-400" />
          <span>Learner Registration & Roster</span>
        </button>

        <button
          onClick={() => setActiveTab('marks')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            activeTab === 'marks'
              ? 'bg-[#0F1E36] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>Continuous Assessment & Grading</span>
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            activeTab === 'attendance'
              ? 'bg-[#0F1E36] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4 text-amber-400" />
          <span>Class Attendance Register</span>
        </button>

        <button
          onClick={() => setActiveTab('assignments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            activeTab === 'assignments'
              ? 'bg-[#0F1E36] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4 text-amber-400" />
          <span>Coursework & Handouts</span>
        </button>
      </div>

      {/* Main Tab Render */}
      <div>
        {activeTab === 'learners' && (
          <TeacherStudentRegistrationTab
            teacherId={currentUser.id}
            teacherName={currentUser.name}
            assignedClasses={assignedClasses}
          />
        )}

        {activeTab === 'marks' && (
          <TeacherMarksEntryTab
            teacherId={currentUser.id}
            teacherName={currentUser.name}
            assignedClasses={assignedClasses}
            assignedSubjects={assignedSubjects}
            settings={settings}
          />
        )}

        {activeTab === 'attendance' && (
          <TeacherAttendanceTab
            teacherId={currentUser.id}
            teacherName={currentUser.name}
            assignedClasses={assignedClasses}
          />
        )}

        {activeTab === 'assignments' && (
          <TeacherAssignmentsTab
            teacherId={currentUser.id}
            teacherName={currentUser.name}
            assignedClasses={assignedClasses}
            assignedSubjects={assignedSubjects}
          />
        )}
      </div>

      {/* Infinite Academic Calendar Modal */}
      <InfiniteCalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        selectedDate={new Date().toISOString().split('T')[0]}
        onSelectDate={() => {}}
        title="Faculty Academic Calendar"
        subtitle="School term dates, examination weeks, and reporting deadlines across all academic years."
      />
    </div>
  );
};
