import React, { useState, useEffect } from 'react';
import { Student } from '../../types';
import { api } from '../../services/api';
import {
  UserPlus,
  Users,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Edit2,
  X,
  Phone,
  Mail,
  Calendar,
  GraduationCap,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

interface Props {
  teacherId: string;
  teacherName: string;
  assignedClasses: string[];
}

export const TeacherStudentRegistrationTab: React.FC<Props> = ({
  teacherId,
  teacherName,
  assignedClasses,
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>(
    assignedClasses[0] || 'Grade 7A (JSS)'
  );

  // Modal State: Register Student
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [studentClass, setStudentClass] = useState(assignedClasses[0] || 'Grade 7A (JSS)');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [dateOfBirth, setDateOfBirth] = useState('2012-05-15');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [specialNeeds, setSpecialNeeds] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Delete Confirmation Modal
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const data = await api.getStudents({
        class: selectedClassFilter === 'ALL' ? undefined : selectedClassFilter,
        search: searchQuery || undefined,
      });
      setStudents(data);
    } catch (err: any) {
      console.error('Error loading students:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [selectedClassFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStudents();
  };

  const handleOpenAddModal = (student?: Student) => {
    if (student) {
      setEditingStudentId(student.id);
      setFullName(student.fullName);
      setAdmissionNumber(student.admissionNumber);
      setStudentClass(student.class);
      setGender(student.gender);
      setDateOfBirth(student.dateOfBirth || '2012-05-15');
      setGuardianName(student.guardianName || '');
      setGuardianPhone(student.guardianPhone || '');
      setGuardianEmail(student.guardianEmail || '');
      setSpecialNeeds(student.specialNeeds || '');
    } else {
      setEditingStudentId(null);
      setFullName('');
      setAdmissionNumber('');
      setStudentClass(selectedClassFilter !== 'ALL' ? selectedClassFilter : assignedClasses[0] || 'Grade 7A (JSS)');
      setGender('M');
      setDateOfBirth('2012-05-15');
      setGuardianName('');
      setGuardianPhone('');
      setGuardianEmail('');
      setSpecialNeeds('');
    }
    setFormError(null);
    setIsAddModalOpen(true);
  };

  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !admissionNumber.trim() || !studentClass) {
      setFormError('Please provide the student\'s Full Name, Official Admission Number, and Assigned Class.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      if (editingStudentId) {
        await api.updateStudent(editingStudentId, {
          fullName: fullName.trim(),
          admissionNumber: admissionNumber.trim(),
          class: studentClass,
          grade: studentClass.includes('Grade 7')
            ? 'Grade 7'
            : studentClass.includes('Grade 8')
            ? 'Grade 8'
            : studentClass.includes('Grade 9')
            ? 'Grade 9'
            : studentClass.split(' ')[0],
          gender,
          dateOfBirth,
          guardianName: guardianName.trim(),
          guardianPhone: guardianPhone.trim(),
          guardianEmail: guardianEmail.trim(),
          specialNeeds: specialNeeds.trim(),
        });
        setSuccessBanner(`Student record for "${fullName}" successfully updated.`);
      } else {
        const res = await api.createStudent({
          fullName: fullName.trim(),
          admissionNumber: admissionNumber.trim(),
          class: studentClass,
          grade: studentClass.includes('Grade 7')
            ? 'Grade 7'
            : studentClass.includes('Grade 8')
            ? 'Grade 8'
            : studentClass.includes('Grade 9')
            ? 'Grade 9'
            : studentClass.split(' ')[0],
          academicYear: '2026',
          status: 'ACTIVE',
          gender,
          dateOfBirth,
          guardianName: guardianName.trim(),
          guardianPhone: guardianPhone.trim(),
          guardianEmail: guardianEmail.trim(),
          specialNeeds: specialNeeds.trim(),
        });

        // Also automatically link this student to teacher's class
        setSuccessBanner(`Learner "${res.student.fullName}" successfully registered with Student ID ${res.student.studentId}.`);
      }

      setIsAddModalOpen(false);
      fetchStudents();
      setTimeout(() => setSuccessBanner(null), 5000);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save student record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStudent = async () => {
    if (!studentToDelete) return;
    setIsDeleting(true);
    try {
      await api.deleteStudent(studentToDelete.id);
      setSuccessBanner(`Student "${studentToDelete.fullName}" was removed from the database.`);
      setStudentToDelete(null);
      fetchStudents();
      setTimeout(() => setSuccessBanner(null), 5000);
    } catch (err: any) {
      alert(err.message || 'Failed to delete student.');
    } finally {
      setIsDeleting(false);
    }
  };

  const totalLearners = students.length;
  const boysCount = students.filter((s) => s.gender === 'M').length;
  const girlsCount = students.filter((s) => s.gender === 'F').length;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-amber-600" />
            <h2 className="text-xl font-bold font-['Cinzel',serif] text-[#0F1E36]">
              Class Learner Registration & Roster
            </h2>
          </div>
          <p className="text-xs text-slate-600">
            Register and manage the enrolled students in your classes. Learner profiles here populate your Attendance Register and Continuous Assessment Gradebooks automatically.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleOpenAddModal()}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow transition shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Learner</span>
        </button>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successBanner}</span>
          </div>
          <button
            onClick={() => setSuccessBanner(null)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Roster Controls: Class Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Class Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          <span className="text-xs font-bold text-slate-700">Class:</span>
          <select
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-xl bg-slate-50 focus:outline-none focus:border-amber-500 text-slate-800"
          >
            {assignedClasses.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
            <option value="ALL">All Assigned Classes</option>
          </select>
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, ADM, or ID..."
              className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-slate-50 focus:outline-none focus:border-amber-500 w-64 text-slate-800"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 bg-[#0F1E36] hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              fetchStudents();
            }}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
            title="Refresh list"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Roster Metrics */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm text-center">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Enrolled</div>
          <div className="text-xl font-extrabold text-[#0F1E36]">{totalLearners}</div>
        </div>
        <div className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm text-center">
          <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Boys</div>
          <div className="text-xl font-extrabold text-blue-700">{boysCount}</div>
        </div>
        <div className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm text-center">
          <div className="text-[11px] font-bold text-pink-600 uppercase tracking-wider">Girls</div>
          <div className="text-xl font-extrabold text-pink-700">{girlsCount}</div>
        </div>
      </div>

      {/* Learners Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Student ID</th>
                <th className="py-3 px-4">Admission No.</th>
                <th className="py-3 px-4">Learner Full Name</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Gender</th>
                <th className="py-3 px-4">Parent / Guardian Contact</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-amber-600" />
                    <span>Loading class learner records...</span>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center text-slate-500 space-y-3">
                    <Users className="w-10 h-10 text-slate-300 mx-auto" />
                    <div className="text-sm font-bold text-slate-700">
                      No Students Registered in {selectedClassFilter} Yet
                    </div>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      All sample records have been cleared. As the instructor, please register your learners manually using the button below to begin recording attendance and grading.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleOpenAddModal()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow transition"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Register First Learner</span>
                    </button>
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-amber-800">
                      {student.studentId}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {student.admissionNumber}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {student.fullName}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                        {student.class}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          student.gender === 'M'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-pink-100 text-pink-800'
                        }`}
                      >
                        {student.gender === 'M' ? 'Boy (M)' : 'Girl (F)'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">
                        {student.guardianName || 'Parent / Guardian'}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{student.guardianPhone || 'No contact provided'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleOpenAddModal(student)}
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                          title="Edit Learner Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setStudentToDelete(student)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Remove Learner Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* REGISTRATION MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-[#0F1E36] font-['Cinzel',serif]">
                  {editingStudentId ? 'Edit Student Details' : 'Register New Learner'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveStudent} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Learner Full Name (Official CBC Record) *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Samuel Mutua Mwangi"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Admission Number (ADM / NEMIS) *
                  </label>
                  <input
                    type="text"
                    required
                    value={admissionNumber}
                    onChange={(e) => setAdmissionNumber(e.target.value)}
                    placeholder="e.g. ADM-2026-001"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500 text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Assigned Class *
                  </label>
                  <select
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500 bg-white text-slate-800"
                  >
                    {assignedClasses.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Gender *
                  </label>
                  <div className="flex gap-3 pt-1">
                    <label className="inline-flex items-center gap-2 text-xs cursor-pointer text-slate-700">
                      <input
                        type="radio"
                        name="gender"
                        checked={gender === 'M'}
                        onChange={() => setGender('M')}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span>Boy (Male)</span>
                    </label>
                    <label className="inline-flex items-center gap-2 text-xs cursor-pointer text-slate-700">
                      <input
                        type="radio"
                        name="gender"
                        checked={gender === 'F'}
                        onChange={() => setGender('F')}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span>Girl (Female)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500 text-slate-800"
                  />
                </div>
              </div>

              {/* Guardian Contact Details */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>Parent / Guardian Contact Information</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Guardian Name
                    </label>
                    <input
                      type="text"
                      value={guardianName}
                      onChange={(e) => setGuardianName(e.target.value)}
                      placeholder="e.g. John Mwangi"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Mobile Phone Number
                    </label>
                    <input
                      type="tel"
                      value={guardianPhone}
                      onChange={(e) => setGuardianPhone(e.target.value)}
                      placeholder="e.g. 0722123456"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={guardianEmail}
                      onChange={(e) => setGuardianEmail(e.target.value)}
                      placeholder="guardian@example.com"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500 text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Special Notes */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Health / Learning Accommodation Notes (Optional)
                </label>
                <input
                  type="text"
                  value={specialNeeds}
                  onChange={(e) => setSpecialNeeds(e.target.value)}
                  placeholder="e.g. Mild asthma, wears glasses, gifted in arts"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500 text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#0F1E36] hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSubmitting ? 'Saving...' : editingStudentId ? 'Update Learner' : 'Register Learner'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2 bg-red-100 rounded-xl">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Remove Learner Record?
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to remove <strong>{studentToDelete.fullName}</strong> ({studentToDelete.studentId}, ADM: {studentToDelete.admissionNumber}) from the school records?
              This action will also clear their linked continuous assessment marks and attendance history.
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setStudentToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteStudent}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isDeleting ? 'Removing...' : 'Confirm Removal'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
