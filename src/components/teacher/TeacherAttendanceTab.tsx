import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Student } from '../../types';
import { Calendar, CheckCircle2, Clock, Users, Save, AlertCircle } from 'lucide-react';

interface Props {
  teacherId: string;
  teacherName: string;
  assignedClasses: string[];
}

export const TeacherAttendanceTab: React.FC<Props> = ({ teacherId, teacherName, assignedClasses }) => {
  const [selectedClass, setSelectedClass] = useState(assignedClasses[0] || 'Grade 7A (JSS)');
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [attendanceMap, setAttendanceMap] = useState<
    Record<string, { status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'; notes?: string }>
  >({});
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchClassRoster = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const roster = await api.getStudents({ class: selectedClass });
      setStudents(roster);

      // Check if attendance already recorded for this class & date
      const existingSessions = await api.getAttendance({
        classId: selectedClass,
        date: sessionDate,
      });

      const initialMap: Record<string, any> = {};
      if (existingSessions.length > 0 && existingSessions[0].records) {
        existingSessions[0].records.forEach((r: any) => {
          initialMap[r.studentId] = { status: r.status, notes: r.notes || r.remark || '' };
        });
      }

      // Fill remaining with PRESENT default
      roster.forEach((s) => {
        if (!initialMap[s.studentId]) {
          initialMap[s.studentId] = { status: 'PRESENT', notes: '' };
        }
      });

      setAttendanceMap(initialMap);
    } catch (err) {
      console.error('Error loading attendance roster:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClassRoster();
  }, [selectedClass, sessionDate]);

  const setStudentStatus = (studentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED') => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const markAllPresent = () => {
    const updated: Record<string, any> = {};
    students.forEach((s) => {
      updated[s.studentId] = { status: 'PRESENT', notes: '' };
    });
    setAttendanceMap(updated);
  };

  const handleSaveAttendance = async () => {
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const records = students.map((s) => {
        const item = attendanceMap[s.studentId] || { status: 'PRESENT' };
        return {
          studentId: s.studentId,
          studentName: s.fullName,
          status: item.status,
          notes: item.notes,
        };
      });

      await api.recordAttendance({
        classId: selectedClass,
        className: selectedClass,
        date: sessionDate,
        term: 'Term 1, 2026',
        academicYear: '2026',
        teacherId,
        teacherName,
        records,
      });

      setStatusMessage({
        type: 'success',
        text: `Attendance for ${selectedClass} on ${sessionDate} saved successfully!`,
      });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to save attendance.' });
    } finally {
      setIsSaving(false);
    }
  };

  const presentCount = Object.values(attendanceMap).filter((v: any) => v?.status === 'PRESENT').length;
  const absentCount = Object.values(attendanceMap).filter((v: any) => v?.status === 'ABSENT').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold font-['Cinzel',serif] text-[#0F1E36] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-600" />
            <span>Daily Attendance Register</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Synchronized with Central Student Database. Present: {presentCount} • Absent: {absentCount}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={markAllPresent}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
          >
            Mark All Present
          </button>
          <button
            type="button"
            onClick={handleSaveAttendance}
            disabled={isSaving}
            className="px-4 py-2 bg-[#0F1E36] hover:bg-amber-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
          >
            <Save className="w-4 h-4 text-amber-400" />
            <span>{isSaving ? 'Saving...' : 'Save Attendance Session'}</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Selector controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center">
        <div className="text-xs space-y-1">
          <label className="block font-bold text-slate-700">Class Cohort</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-1.5 bg-white text-slate-800 font-semibold"
          >
            {assignedClasses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs space-y-1">
          <label className="block font-bold text-slate-700">Session Date</label>
          <input
            type="date"
            value={sessionDate}
            onChange={(e) => setSessionDate(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-mono"
          />
        </div>
      </div>

      {/* Student Roster Attendance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3 w-12">#</th>
                <th className="py-3 px-4">Student ID & Name</th>
                <th className="py-3 px-4 text-center">Attendance Status</th>
                <th className="py-3 px-4">Session Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    Loading student attendance roster...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500">
                    No students registered in this class.
                  </td>
                </tr>
              ) : (
                students.map((student, idx) => {
                  const item = attendanceMap[student.studentId] || { status: 'PRESENT' };
                  return (
                    <tr key={student.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{student.fullName}</div>
                        <div className="text-[11px] font-mono text-slate-500">
                          {student.studentId} • Adm {student.admissionNumber}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-100">
                          {(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'] as const).map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => setStudentStatus(student.studentId, st)}
                              className={`px-3 py-1 text-[11px] font-bold rounded-md transition ${
                                item.status === st
                                  ? st === 'PRESENT'
                                    ? 'bg-emerald-600 text-white'
                                    : st === 'ABSENT'
                                    ? 'bg-red-600 text-white'
                                    : st === 'LATE'
                                    ? 'bg-amber-500 text-slate-950'
                                    : 'bg-blue-600 text-white'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={item.notes || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setAttendanceMap((prev) => ({
                              ...prev,
                              [student.studentId]: {
                                ...prev[student.studentId],
                                notes: val,
                              },
                            }));
                          }}
                          placeholder="Optional remarks (e.g. sick bay)"
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded"
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
