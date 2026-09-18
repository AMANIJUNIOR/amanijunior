import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SchoolSettings, Enquiry } from '../types';
import { api } from '../services/api';
import { SchoolLogoBadge } from '../components/SchoolLogoBadge';
import {
  Shield,
  Users,
  GraduationCap,
  Award,
  Settings,
  FileText,
  Clock,
  LogIn,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  Send,
  MessageSquare,
  Lock,
  LogOut,
  Calendar,
} from 'lucide-react';
import { InfiniteCalendarModal } from '../components/common/InfiniteCalendarModal';

// Admin Modular Tabs
import { StudentDatabaseTab } from '../components/admin/StudentDatabaseTab';
import { TeacherManagementTab } from '../components/admin/TeacherManagementTab';
import { GradingApprovalTab } from '../components/admin/GradingApprovalTab';
import { ReportCardsTab } from '../components/admin/ReportCardsTab';
import { SchoolSettingsTab } from '../components/admin/SchoolSettingsTab';
import { AuditLogsTab } from '../components/admin/AuditLogsTab';

export const AdminPortalPage: React.FC = () => {
  const { currentUser, navigate, settings, setSettings, classes, subjects, logout } = useApp();
  const [activeTab, setActiveTab] = useState<
    'students' | 'teachers' | 'results' | 'reports' | 'settings' | 'enquiries' | 'audit'
  >('students');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Enquiries state
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isLoadingEnquiries, setIsLoadingEnquiries] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [responseText, setResponseText] = useState('');

  const fetchEnquiries = async () => {
    setIsLoadingEnquiries(true);
    try {
      const data = await api.getEnquiries();
      setEnquiries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingEnquiries(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'enquiries') {
      fetchEnquiries();
    }
  }, [activeTab]);

  const isAuthorized =
    currentUser &&
    (currentUser.role === 'CHIEF_ADMIN' ||
      currentUser.role === 'DIRECTOR' ||
      currentUser.role === 'HEADTEACHER' ||
      currentUser.role === 'DEPUTY_HEADTEACHER' ||
      currentUser.role === 'ICT_ADMIN');

  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4 shadow-md">
        <Shield className="w-12 h-12 text-indigo-700 mx-auto" />
        <h2 className="text-xl font-bold font-['Cinzel',serif] text-[#0F1E36]">
          Institutional Management Console
        </h2>
        <p className="text-xs text-slate-600">
          This portal is reserved strictly for Director Constance Mwaka Pole, Headteacher Nadhiri Chacha Salim, and Chief Administrators.
        </p>
        <button
          onClick={() => navigate('portal-login')}
          className="w-full py-2.5 bg-[#0F1E36] hover:bg-amber-600 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-2"
        >
          <LogIn className="w-4 h-4" />
          <span>Staff Login</span>
        </button>
      </div>
    );
  }

  const handleUpdateEnquiryStatus = async (id: string, status: 'New' | 'In Progress' | 'Resolved') => {
    try {
      const normalizedStatus = status === 'New' ? 'NEW' : status === 'In Progress' ? 'IN PROGRESS' : 'RESOLVED';
      await api.updateEnquiryStatus(id, normalizedStatus, responseText);
      await fetchEnquiries();
      setSelectedEnquiry(null);
      setResponseText('');
    } catch (err) {
      alert('Failed to update enquiry status.');
    }
  };

  return (
    <div className="min-h-[85vh] bg-slate-50 py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner & Leadership Identity */}
      <div className="bg-[#0F1E36] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-bold border border-amber-400/30">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Chief Administrative Portal • Amani Junior Academy and JSS</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-slate-200 rounded-full text-xs font-bold border border-white/10">
              <span>Intake Campaign:</span>
              <span className="text-amber-300 font-mono">{settings.activeAdmissionYear || settings.academicYear || '2026'}</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Cinzel',serif] tracking-wide">
            School Governance & Academic Registry
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Logged in as: <strong className="text-white">{currentUser?.name}</strong> ({currentUser?.role}) • Academic Year: <strong className="text-amber-300 font-mono">{settings.academicYear || '2026'}</strong> ({settings.currentTerm || 'Term 1'})
          </p>
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
            id="btn-admin-portal-logout"
            onClick={() => logout('portal-login')}
            className="flex items-center gap-2 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm transition border border-rose-400/30 active:scale-95 cursor-pointer"
            title="Sign out of Chief Admin Portal"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
          <SchoolLogoBadge size="md" className="bg-white/10 p-1 rounded-2xl" />
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex overflow-x-auto gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm scrollbar-none">
        <button
          onClick={() => setActiveTab('students')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            activeTab === 'students'
              ? 'bg-[#0F1E36] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4 text-amber-400" />
          <span>Central Student Database</span>
        </button>

        <button
          onClick={() => setActiveTab('teachers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            activeTab === 'teachers'
              ? 'bg-[#0F1E36] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-amber-400" />
          <span>Faculty & Staff Accounts</span>
        </button>

        <button
          onClick={() => setActiveTab('results')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            activeTab === 'results'
              ? 'bg-[#0F1E36] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Lock className="w-4 h-4 text-amber-400" />
          <span>Results Approval & Locking</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            activeTab === 'reports'
              ? 'bg-[#0F1E36] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>Consolidated Report Cards</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            activeTab === 'settings'
              ? 'bg-[#0F1E36] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4 text-amber-400" />
          <span>Grading Scale & Policies</span>
        </button>

        <button
          onClick={() => setActiveTab('enquiries')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            activeTab === 'enquiries'
              ? 'bg-[#0F1E36] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-amber-400" />
          <span>Admissions & Inquiries</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            activeTab === 'audit'
              ? 'bg-[#0F1E36] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4 text-amber-400" />
          <span>Security Audit Trail</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="transition-all duration-200">
        {activeTab === 'students' && <StudentDatabaseTab classes={classes} />}
        {activeTab === 'teachers' && (
          <TeacherManagementTab classes={classes} subjects={subjects} />
        )}
        {activeTab === 'results' && (
          <GradingApprovalTab classes={classes} subjects={subjects} />
        )}
        {activeTab === 'reports' && (
          <ReportCardsTab classes={classes} settings={settings} />
        )}
        {activeTab === 'settings' && (
          <SchoolSettingsTab
            settings={settings}
            onSettingsUpdated={(newSettings) => {
              if (typeof setSettings === 'function') {
                setSettings(newSettings);
              }
            }}
          />
        )}
        {activeTab === 'audit' && <AuditLogsTab />}

        {activeTab === 'enquiries' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-lg font-bold font-['Cinzel',serif] text-[#0F1E36] flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-amber-600" />
                  <span>Incoming Admissions & Public Inquiries</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Submissions captured through the website and AI Assistant ("Talk to Amani").
                </p>
              </div>

              <button
                onClick={fetchEnquiries}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                Refresh List
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Parent Name</th>
                      <th className="py-3 px-4">Phone Number</th>
                      <th className="py-3 px-4">Grade of Interest</th>
                      <th className="py-3 px-4">Inquiry Message</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {isLoadingEnquiries ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400">
                          Loading admissions inquiries...
                        </td>
                      </tr>
                    ) : enquiries.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-500">
                          No inquiries received yet.
                        </td>
                      </tr>
                    ) : (
                      enquiries.map((enq) => (
                        <tr key={enq.id} className="hover:bg-amber-50/40 transition">
                          <td className="py-3 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                            {new Date(enq.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                            {enq.fullName}
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-700 whitespace-nowrap">
                            <a href={`tel:${enq.phone}`} className="hover:text-amber-600 underline">
                              {enq.phone}
                            </a>
                          </td>
                          <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                            {enq.studentGradeInterest || enq.category || 'General'}
                          </td>
                          <td className="py-3 px-4 text-slate-600 max-w-sm">
                            {enq.message}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                enq.status === 'Resolved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : enq.status === 'In Progress'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {enq.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              {enq.status !== 'Resolved' && (
                                <button
                                  onClick={() => handleUpdateEnquiryStatus(enq.id, 'Resolved')}
                                  title="Mark as Resolved"
                                  className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-[10px] font-bold transition"
                                >
                                  Resolve
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Infinite Academic Calendar Modal */}
      <InfiniteCalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        selectedDate={new Date().toISOString().split('T')[0]}
        onSelectDate={() => {}}
        title="Institutional Academic Calendar"
        subtitle="School term schedules, opening dates, and examination timelines across all years."
      />
    </div>
  );
};
