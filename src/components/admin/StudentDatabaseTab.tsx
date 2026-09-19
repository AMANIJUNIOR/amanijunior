import React, { useState, useEffect } from 'react';
import { Student, SchoolClass } from '../../types';
import { api } from '../../services/api';
import {
  Users,
  Search,
  Plus,
  UserPlus,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Phone,
  Mail,
  GraduationCap,
  BookOpen,
  Eye,
  X,
  Clock,
  Shield,
  Filter,
  Trash2,
  Edit2,
} from 'lucide-react';

interface Props {
  classes: SchoolClass[];
}

export const StudentDatabaseTab: React.FC<Props> = ({ classes }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('');

  // Modal State: Add/Edit Student
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [selectedClass, setSelectedClass] = useState('Grade 7A (JSS)');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [dateOfBirth, setDateOfBirth] = useState('2012-05-15');
  const [academicYear, setAcademicYear] = useState('2026');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Duplicate warning state
  const [duplicateWarning, setDuplicateWarning] = useState<any | null>(null);

  // Modal State: View Student Details
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const data = await api.getStudents({
        class: selectedClassFilter || undefined,
        search: searchQuery || undefined,
      });
      setStudents(data);
    } catch (err) {
      console.error('Error fetching students:', err);
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

  const handleOpenAddModal = () => {
    setEditingStudentId(null);
    setFullName('');
    setAdmissionNumber('');
    setSelectedClass(classes[0]?.name || 'Grade 7A (JSS)');
    setGender('M');
    setDateOfBirth('2012-05-15');
    setAcademicYear('2026');
    setGuardianName('');
    setGuardianPhone('');
    setGuardianEmail('');
    setFormError(null);
    setDuplicateWarning(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (student: Student) => {
    setEditingStudentId(student.id || student.studentId || student.admissionNumber);
    setFullName(student.fullName);
    setAdmissionNumber(student.admissionNumber);
    setSelectedClass(student.class);
    setGender(student.gender || 'M');
    setDateOfBirth(student.dateOfBirth || '2012-05-15');
    setAcademicYear(student.academicYear || '2026');
    setGuardianName(student.guardianName || '');
    setGuardianPhone(student.guardianPhone || '');
    setGuardianEmail(student.guardianEmail || '');
    setFormError(null);
    setDuplicateWarning(null);
    setIsAddModalOpen(true);
  };

  const handleSaveStudent = async (confirmDuplicate = false) => {
    if (!fullName.trim() || !admissionNumber.trim() || !selectedClass) {
      setFormError('Please fill in Student Full Name, Admission Number, and Class.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const payload = {
        fullName: fullName.trim(),
        admissionNumber: admissionNumber.trim(),
        class: selectedClass,
        grade: selectedClass.includes('Grade 7')
          ? 'Grade 7'
          : selectedClass.includes('Grade 8')
          ? 'Grade 8'
          : selectedClass.includes('Grade 9')
          ? 'Grade 9'
          : selectedClass.split(' ')[0] || 'Grade 7',
        gender,
        dateOfBirth,
        guardianName: guardianName.trim(),
        guardianPhone: guardianPhone.trim(),
        guardianEmail: guardianEmail.trim(),
        academicYear,
        confirmDuplicate,
      };

      if (editingStudentId) {
        await api.updateStudent(editingStudentId, payload);
        if (selectedStudent && (selectedStudent.student.id === editingStudentId || selectedStudent.student.studentId === editingStudentId)) {
          handleViewStudentProfile(editingStudentId);
        }
      } else {
        await api.createStudent(payload);
      }

      setIsAddModalOpen(false);
      setDuplicateWarning(null);
      await fetchStudents();
    } catch (err: any) {
      if (err.data && err.data.possibleDuplicate) {
        setDuplicateWarning(err.data);
      } else {
        setFormError(err.message || 'Failed to save student record.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewStudentProfile = async (studentId: string) => {
    setIsLoadingProfile(true);
    try {
      const profile = await api.getStudent(studentId);
      setSelectedStudent(profile);
    } catch (err: any) {
      alert('Could not load student profile.');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleDeleteStudent = async (student: Student) => {
    if (!window.confirm(`Are you sure you want to permanently delete learner "${student.fullName}" (${student.studentId || student.admissionNumber}) from school records?`)) {
      return;
    }
    const idToDelete = student.id || student.studentId || student.admissionNumber;
    try {
      setStudents((prev) =>
        prev.filter(
          (s) =>
            s.id !== student.id &&
            s.studentId !== student.studentId &&
            s.admissionNumber !== student.admissionNumber
        )
      );
      if (selectedStudent && (selectedStudent.student.id === student.id || selectedStudent.student.studentId === student.studentId)) {
        setSelectedStudent(null);
      }
      await api.deleteStudent(idToDelete);
      await fetchStudents();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to delete student.');
      fetchStudents();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold font-['Cinzel',serif] text-[#0F1E36] flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-600" />
            <span>Central Student Database</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Single institutional registry. Each learner maintains a unique Student ID (e.g. STU-00025) across all subjects, grades, and academic years.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-[#0F1E36] hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-sm self-start sm:self-auto shrink-0"
        >
          <UserPlus className="w-4 h-4 text-amber-400" />
          <span>Register New Student</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID (e.g. STU-00025), Name, Adm No..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 text-slate-800"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:border-amber-500 w-full md:w-auto"
          >
            <option value="">All Cohorts & Classes</option>
            {classes.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            onClick={fetchStudents}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 rounded-lg transition"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Unique Student ID</th>
                <th className="py-3 px-4">Admission No.</th>
                <th className="py-3 px-4">Full Student Name</th>
                <th className="py-3 px-4">Class / Cohort</th>
                <th className="py-3 px-4">Gender</th>
                <th className="py-3 px-4">Guardian Contacts</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Loading central student records...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No student records match your query.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-amber-50/40 transition">
                    <td className="py-3 px-4 font-mono font-bold text-[#0F1E36]">
                      <span className="px-2 py-1 bg-slate-100 rounded text-[11px] text-[#0F1E36] border border-slate-200">
                        {student.studentId}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600 font-semibold">
                      {student.admissionNumber}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {student.fullName}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                        {student.class}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {student.gender === 'M' ? 'Male' : student.gender === 'F' ? 'Female' : '—'}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div className="font-medium text-slate-800">{student.guardianName || 'Guardian'}</div>
                      <div className="text-[11px] text-slate-500">{student.guardianPhone || '—'}</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleViewStudentProfile(student.studentId)}
                          className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                          title="View Full Student Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(student)}
                          className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                          title="Edit Learner Profile"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(student)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete Student Record"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* MODAL: Register New Student (with Duplicate Check) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                {editingStudentId ? (
                  <Edit2 className="w-5 h-5 text-amber-600" />
                ) : (
                  <UserPlus className="w-5 h-5 text-amber-600" />
                )}
                <h3 className="text-base font-bold text-[#0F1E36] font-['Cinzel',serif]">
                  {editingStudentId ? 'Edit Student Profile' : 'Register Student in Central Database'}
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

            {duplicateWarning && (
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{duplicateWarning.message}</span>
                </div>
                <p className="text-[11px] text-amber-800">
                  Existing Student: <strong>{duplicateWarning.existingStudent.fullName}</strong> ({duplicateWarning.existingStudent.studentId}) in {duplicateWarning.existingStudent.class}.
                </p>
                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleSaveStudent(true)}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs"
                  >
                    Confirm & Register Anyway
                  </button>
                  <button
                    type="button"
                    onClick={() => setDuplicateWarning(null)}
                    className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs"
                  >
                    Cancel / Edit
                  </button>
                </div>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveStudent(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Full Student Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. John Otieno"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Admission Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={admissionNumber}
                    onChange={(e) => setAdmissionNumber(e.target.value)}
                    placeholder="e.g. ADM-2024-090"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 text-slate-800 uppercase"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Enrolled Class *
                  </label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 text-slate-800 bg-white"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'M' | 'F')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 text-slate-800 bg-white"
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Admission Year</label>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    placeholder="e.g. 2026"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 text-slate-800 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <div className="font-bold text-slate-500 text-[11px] uppercase tracking-wider mb-2">
                  Guardian Information
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-0.5">Guardian Full Name</label>
                    <input
                      type="text"
                      value={guardianName}
                      onChange={(e) => setGuardianName(e.target.value)}
                      placeholder="e.g. David Otieno"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-0.5">Phone Number</label>
                      <input
                        type="text"
                        value={guardianPhone}
                        onChange={(e) => setGuardianPhone(e.target.value)}
                        placeholder="0722123456"
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-0.5">Email (Optional)</label>
                      <input
                        type="email"
                        value={guardianEmail}
                        onChange={(e) => setGuardianEmail(e.target.value)}
                        placeholder="parent@gmail.com"
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
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
                  <span>{isSubmitting ? 'Saving...' : editingStudentId ? 'Update Student Record' : 'Register Student'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Full Student Academic Profile */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#0F1E36] text-amber-400 font-mono font-bold text-xs rounded">
                    {selectedStudent.student.studentId}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 font-['Cinzel',serif]">
                    {selectedStudent.student.fullName}
                  </h3>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Admission No: <strong className="text-slate-700">{selectedStudent.student.admissionNumber}</strong> | Class: {selectedStudent.student.class}
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Attendance Summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <div className="text-xs text-slate-500 font-medium">Attendance Rate</div>
                <div className="text-xl font-bold text-emerald-700 mt-0.5">
                  {selectedStudent.attendanceStats?.attendanceRate || 100}%
                </div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <div className="text-xs text-slate-500 font-medium">Days Present</div>
                <div className="text-xl font-bold text-slate-800 mt-0.5">
                  {selectedStudent.attendanceStats?.presentDays || 0}
                </div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <div className="text-xs text-slate-500 font-medium">Total Sessions Marked</div>
                <div className="text-xl font-bold text-slate-800 mt-0.5">
                  {selectedStudent.attendanceStats?.totalDays || 0}
                </div>
              </div>
            </div>

            {/* Linked Subject Teachers */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                <span>Enrolled Subjects & Teachers</span>
              </h4>
              <div className="grid sm:grid-cols-2 gap-2 text-xs">
                {selectedStudent.links.length === 0 ? (
                  <div className="text-slate-400 text-xs italic">No specific subject teacher links yet.</div>
                ) : (
                  selectedStudent.links.map((link: any) => (
                    <div key={link.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-center">
                      <div>
                        <div className="font-bold text-slate-800">{link.subjectName}</div>
                        <div className="text-[11px] text-slate-500">{link.teacherName}</div>
                      </div>
                      <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                        {link.className}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Academic Marks Record */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                <span>Continuous Assessment Marks</span>
              </h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <tr>
                      <th className="p-2.5">Subject</th>
                      <th className="p-2.5">Assessment</th>
                      <th className="p-2.5 text-center">Score</th>
                      <th className="p-2.5 text-center">Grade</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedStudent.marks.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-slate-400 italic">
                          No marks recorded yet for this student.
                        </td>
                      </tr>
                    ) : (
                      selectedStudent.marks.map((m: any) => (
                        <tr key={m.id}>
                          <td className="p-2.5 font-bold text-slate-800">{m.subjectName}</td>
                          <td className="p-2.5 text-slate-600">{m.assessmentType}</td>
                          <td className="p-2.5 text-center font-mono font-bold text-[#0F1E36]">
                            {m.marksObtained} / {m.maxMarks} ({m.percentage}%)
                          </td>
                          <td className="p-2.5 text-center font-bold text-amber-700">{m.calculatedGrade}</td>
                          <td className="p-2.5">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                m.status === 'LOCKED'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : m.status === 'SUBMITTED'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {m.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  const stu = selectedStudent.student;
                  setSelectedStudent(null);
                  handleOpenEditModal(stu);
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Learner Details</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs"
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
