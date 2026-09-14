import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { SchoolClass, Subject } from '../../types';
import {
  GraduationCap,
  Plus,
  Key,
  Shield,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  Copy,
  Lock,
  RefreshCw,
  UserCheck,
  UserX,
  Phone,
  Mail,
  BookOpen,
} from 'lucide-react';

interface Props {
  classes: SchoolClass[];
  subjects: Subject[];
}

export const TeacherManagementTab: React.FC<Props> = ({ classes, subjects }) => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Modal: Create Teacher
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [staffId, setStaffId] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Junior Secondary School (JSS)');
  const [subjectSpecialization, setSubjectSpecialization] = useState('Mathematics');
  const [additionalSpecializations, setAdditionalSpecializations] = useState('');
  const [selectedClasses, setSelectedClasses] = useState<string[]>(['Grade 7A (JSS)']);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['Mathematics']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modal: Display Generated Temporary Password
  const [credentialsModal, setCredentialsModal] = useState<{
    teacherName: string;
    username: string;
    temporaryPassword: string;
    action: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchTeachers = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAdminTeachers();
      setTeachers(data);
    } catch (err) {
      console.error('Error fetching admin teachers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleOpenCreateModal = () => {
    setFullName('');
    setStaffId(`STAFF-${String(teachers.length + 1).padStart(3, '0')}`);
    setPhone('');
    setEmail('');
    setDepartment('Junior Secondary School (JSS)');
    setSubjectSpecialization(subjects[0]?.name || 'Mathematics');
    setAdditionalSpecializations('');
    setSelectedClasses([classes[0]?.name || 'Grade 7A (JSS)']);
    setSelectedSubjects([subjects[0]?.name || 'Mathematics']);
    setErrorMessage(null);
    setIsCreateModalOpen(true);
  };

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !staffId || !phone) {
      setErrorMessage('Full Name, Staff ID, and Phone Number are required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        fullName,
        staffId,
        phone,
        email: email || undefined,
        department,
        subjectSpecialization,
        additionalSpecializations: additionalSpecializations
          ? additionalSpecializations.split(',').map((s) => s.trim())
          : [],
        assignedClasses: selectedClasses,
        assignedSubjects: selectedSubjects,
        accountStatus: 'ACTIVE' as const,
      };

      const res = await api.createAdminTeacher(payload);
      setIsCreateModalOpen(false);
      await fetchTeachers();

      // Show temporary password modal
      setCredentialsModal({
        teacherName: res.teacher.fullName,
        username: res.username,
        temporaryPassword: res.temporaryPassword,
        action: 'Account Created Successfully',
      });
      setCopied(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create teacher account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (teacher: any) => {
    const newStatus = teacher.accountStatus === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    const confirmAction = window.confirm(
      `Are you sure you want to set ${teacher.fullName}'s account to ${newStatus}? Historical marks and audit trails will remain intact.`
    );
    if (!confirmAction) return;

    try {
      await api.updateTeacherStatus(teacher.id, newStatus);
      await fetchTeachers();
    } catch (err: any) {
      alert(err.message || 'Failed to update account status.');
    }
  };

  const handleResetPassword = async (teacher: any) => {
    const confirmReset = window.confirm(
      `Reset password for ${teacher.fullName}? A secure temporary password will be generated, and the teacher will be prompted to set a new password upon login.`
    );
    if (!confirmReset) return;

    try {
      const res = await api.resetTeacherPassword(teacher.id);
      await fetchTeachers();

      setCredentialsModal({
        teacherName: teacher.fullName,
        username: res.username,
        temporaryPassword: res.temporaryPassword,
        action: 'Password Reset Completed',
      });
      setCopied(false);
    } catch (err: any) {
      alert(err.message || 'Failed to reset password.');
    }
  };

  const handleCopyCredentials = () => {
    if (!credentialsModal) return;
    const text = `Amani Junior Academy Staff Portal Credentials\nTeacher: ${credentialsModal.teacherName}\nUsername: ${credentialsModal.username}\nTemporary Password: ${credentialsModal.temporaryPassword}\nLogin Portal: ${window.location.origin}\nNote: You will be prompted to choose a new password upon first login.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const toggleClassSelection = (className: string) => {
    setSelectedClasses((prev) =>
      prev.includes(className) ? prev.filter((c) => c !== className) : [...prev, className]
    );
  };

  const toggleSubjectSelection = (subjectName: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectName) ? prev.filter((s) => s !== subjectName) : [...prev, subjectName]
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold font-['Cinzel',serif] text-[#0F1E36] flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-amber-600" />
            <span>Faculty & Staff Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Administer teacher accounts, assigned classes, subject specializations, and credentials.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 bg-[#0F1E36] hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-sm self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Add Teacher Account</span>
        </button>
      </div>

      {/* Teachers Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Staff ID</th>
                <th className="py-3 px-4">Teacher Name</th>
                <th className="py-3 px-4">Portal Username</th>
                <th className="py-3 px-4">Department & Specialization</th>
                <th className="py-3 px-4">Assigned Cohorts & Subjects</th>
                <th className="py-3 px-4 text-center">Account Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Loading faculty accounts...
                  </td>
                </tr>
              ) : teachers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No teacher accounts found.
                  </td>
                </tr>
              ) : (
                teachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-amber-50/40 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">
                      {teacher.staffId}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{teacher.fullName}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-emerald-600" />
                          {teacher.phone}
                        </span>
                        {teacher.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            {teacher.email}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-[#0F1E36]">
                      {teacher.username}
                      {teacher.mustChangePassword && (
                        <span className="block text-[10px] text-amber-700 font-sans font-medium">
                          • Requires 1st login reset
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{teacher.subjectSpecialization}</div>
                      <div className="text-[11px] text-slate-500">{teacher.department}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {teacher.assignedClasses?.map((c: string) => (
                          <span
                            key={c}
                            className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium border border-slate-200"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 truncate max-w-xs">
                        {teacher.assignedSubjects?.join(', ')}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          teacher.accountStatus === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                        }`}
                      >
                        {teacher.accountStatus === 'ACTIVE' ? (
                          <>
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                            <span>Disabled</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleResetPassword(teacher)}
                          title="Generate New Temporary Password"
                          className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition"
                        >
                          <Key className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(teacher)}
                          title={teacher.accountStatus === 'ACTIVE' ? 'Disable Account' : 'Activate Account'}
                          className={`p-1.5 rounded-lg transition ${
                            teacher.accountStatus === 'ACTIVE'
                              ? 'text-slate-500 hover:text-red-600 hover:bg-red-50'
                              : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50'
                          }`}
                        >
                          {teacher.accountStatus === 'ACTIVE' ? (
                            <UserX className="w-4 h-4" />
                          ) : (
                            <UserCheck className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Create Teacher Account */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-[#0F1E36] font-['Cinzel',serif]">
                  Create Staff Teacher Account
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleCreateTeacher} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Staff ID *</label>
                  <input
                    type="text"
                    required
                    value={staffId}
                    onChange={(e) => setStaffId(e.target.value)}
                    placeholder="STAFF-005"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Samuel Mureithi"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0712345678"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="teacher@amanijunioracademy.ac.ke"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 bg-white"
                  >
                    <option value="Junior Secondary School (JSS)">Junior Secondary School (JSS)</option>
                    <option value="Primary School">Primary School</option>
                    <option value="Pre-Primary (PP1 & PP2)">Pre-Primary (PP1 & PP2)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Primary Specialization</label>
                  <input
                    type="text"
                    value={subjectSpecialization}
                    onChange={(e) => setSubjectSpecialization(e.target.value)}
                    placeholder="e.g. Social Studies & CRE"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Additional Specializations (Comma separated)
                </label>
                <input
                  type="text"
                  value={additionalSpecializations}
                  onChange={(e) => setAdditionalSpecializations(e.target.value)}
                  placeholder="e.g. Guidance & Counselling, Scouts Club Patron"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Assign Classes */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Assign Classes / Cohorts (Multi-select)
                </label>
                <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-lg max-h-24 overflow-y-auto">
                  {classes.map((c) => {
                    const isChecked = selectedClasses.includes(c.name);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => toggleClassSelection(c.name)}
                        className={`px-2 py-1 rounded text-[11px] font-medium transition ${
                          isChecked
                            ? 'bg-[#0F1E36] text-white'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {c.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Assign Subjects */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Assign Subjects (Multi-select)
                </label>
                <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-lg max-h-24 overflow-y-auto">
                  {subjects.map((s) => {
                    const isChecked = selectedSubjects.includes(s.name);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => toggleSubjectSelection(s.name)}
                        className={`px-2 py-1 rounded text-[11px] font-medium transition ${
                          isChecked
                            ? 'bg-amber-600 text-white'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {s.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#0F1E36] hover:bg-amber-600 disabled:opacity-50 text-white font-bold rounded-xl transition flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>{isSubmitting ? 'Creating Account...' : 'Create & Generate Credentials'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Display Generated Temporary Password (One-Time View) */}
      {credentialsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <Key className="w-6 h-6 text-amber-600" />
              <div>
                <h3 className="text-base font-bold text-[#0F1E36] font-['Cinzel',serif]">
                  {credentialsModal.action}
                </h3>
                <p className="text-xs text-slate-500">
                  {credentialsModal.teacherName}
                </p>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-700" />
                <span>Temporary Credentials Notice</span>
              </div>
              <p>
                Provide these login credentials to the teacher. Upon their initial sign-in, the portal will immediately require them to create a confidential personal password.
              </p>
            </div>

            <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-sans font-semibold">Staff Username:</span>
                <span className="font-bold text-[#0F1E36]">{credentialsModal.username}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-sans font-semibold">Temporary Password:</span>
                <span className="font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                  {credentialsModal.temporaryPassword}
                </span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={handleCopyCredentials}
                className="flex-1 py-2.5 bg-[#0F1E36] hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition"
              >
                <Copy className="w-4 h-4 text-amber-400" />
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Credentials'}</span>
              </button>
              <button
                onClick={() => setCredentialsModal(null)}
                className="px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
