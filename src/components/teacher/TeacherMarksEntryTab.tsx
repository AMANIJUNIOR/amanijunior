import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Student, AcademicResult, SchoolSettings, GradingScaleItem } from '../../types';
import {
  BookOpen,
  CheckCircle2,
  Lock,
  RotateCcw,
  AlertCircle,
  Save,
  Send,
  HelpCircle,
  Clock,
  ArrowRight,
  ShieldAlert,
  Calendar,
} from 'lucide-react';
import { AcademicYearTermSelector } from '../common/AcademicYearTermSelector';
import { InfiniteCalendarModal } from '../common/InfiniteCalendarModal';

interface Props {
  teacherId: string;
  teacherName: string;
  assignedClasses: string[];
  assignedSubjects: string[];
  settings: SchoolSettings;
}

export const TeacherMarksEntryTab: React.FC<Props> = ({
  teacherId,
  teacherName,
  assignedClasses,
  assignedSubjects,
  settings,
}) => {
  const [selectedClass, setSelectedClass] = useState(assignedClasses[0] || 'Grade 7A (JSS)');
  const [selectedSubject, setSelectedSubject] = useState(assignedSubjects[0] || 'Mathematics');
  const [assessmentType, setAssessmentType] = useState('CAT 1');
  const [term, setTerm] = useState(settings?.currentTerm || `Term 1, ${settings?.academicYear || '2026'}`);
  const [academicYear, setAcademicYear] = useState(settings?.academicYear || '2026');
  const [assessmentDate, setAssessmentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [maxMarks, setMaxMarks] = useState(50);

  // Student roster and existing marks
  const [students, setStudents] = useState<Student[]>([]);
  const [marks, setMarks] = useState<AcademicResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Current working inputs mapped by studentId
  const [entries, setEntries] = useState<
    Record<
      string,
      {
        marksObtained: number | '';
        strengths: string;
        areasForImprovement: string;
        teacherComment: string;
        recommendedAction: string;
        status?: string;
        resultId?: string;
      }
    >
  >({});

  // Status message
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Correction Request Modal
  const [correctionModalTarget, setCorrectionModalTarget] = useState<AcademicResult | null>(null);
  const [proposedMark, setProposedMark] = useState<number>(0);
  const [correctionReason, setCorrectionReason] = useState('Typographical entry error');
  const [correctionExplanation, setCorrectionExplanation] = useState('');
  const [isSubmittingCorrection, setIsSubmittingCorrection] = useState(false);

  const calculateGrade = (score: number, max: number): string => {
    if (max <= 0) return 'E';
    const pct = Math.round((score / max) * 100);
    const scale = settings.gradingScale || [
      { minPercentage: 80, maxPercentage: 100, grade: 'A' },
      { minPercentage: 65, maxPercentage: 79, grade: 'B' },
      { minPercentage: 50, maxPercentage: 64, grade: 'C' },
      { minPercentage: 35, maxPercentage: 49, grade: 'D' },
      { minPercentage: 0, maxPercentage: 34, grade: 'E' },
    ];
    for (const item of scale) {
      if (pct >= item.minPercentage && pct <= item.maxPercentage) {
        return item.grade;
      }
    }
    return 'E';
  };

  const loadRosterAndMarks = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const [studentsData, marksData] = await Promise.all([
        api.getStudents({ class: selectedClass }),
        api.getMarks({
          classId: selectedClass,
          subjectId: selectedSubject,
          assessmentType,
          term,
          academicYear,
        }),
      ]);

      setStudents(studentsData);
      setMarks(marksData);

      // Build working map
      const initialMap: Record<string, any> = {};
      studentsData.forEach((s) => {
        const existing = marksData.find((m) => m.studentId === s.studentId);
        if (existing) {
          initialMap[s.studentId] = {
            marksObtained: existing.marksObtained,
            strengths: existing.feedback?.strengths || '',
            areasForImprovement: existing.feedback?.areasForImprovement || '',
            teacherComment: existing.feedback?.teacherComment || '',
            recommendedAction: existing.feedback?.recommendedAction || '',
            status: existing.status,
            resultId: existing.id,
          };
        } else {
          initialMap[s.studentId] = {
            marksObtained: '',
            strengths: '',
            areasForImprovement: '',
            teacherComment: '',
            recommendedAction: '',
            status: 'NEW',
          };
        }
      });
      setEntries(initialMap);
    } catch (err) {
      console.error('Error loading roster/marks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRosterAndMarks();
  }, [selectedClass, selectedSubject, assessmentType, term, academicYear]);

  const handleScoreChange = (studentId: string, val: string) => {
    const num = val === '' ? '' : Math.min(maxMarks, Math.max(0, Number(val)));
    setEntries((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        marksObtained: num,
      },
    }));
  };

  const handleFeedbackChange = (studentId: string, field: string, val: string) => {
    setEntries((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: val,
      },
    }));
  };

  const handleSaveMarks = async (targetStatus: 'DRAFT' | 'SUBMITTED') => {
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const payloadEntries = students
        .filter((s) => {
          const entry = entries[s.studentId];
          return entry && entry.marksObtained !== '' && entry.status !== 'LOCKED';
        })
        .map((s) => {
          const entry = entries[s.studentId];
          return {
            studentId: s.studentId,
            maxMarks: Number(maxMarks),
            marksObtained: Number(entry.marksObtained),
            strengths: entry.strengths,
            areasForImprovement: entry.areasForImprovement,
            teacherComment: entry.teacherComment,
            recommendedAction: entry.recommendedAction,
          };
        });

      if (payloadEntries.length === 0) {
        setStatusMessage({
          type: 'error',
          text: 'No new or editable marks entered. Locked marks cannot be modified directly.',
        });
        setIsSaving(false);
        return;
      }

      await api.saveBatchMarks({
        classId: selectedClass,
        className: selectedClass,
        subjectId: selectedSubject,
        subjectName: selectedSubject,
        teacherId,
        teacherName,
        academicYear,
        term,
        assessmentType,
        status: targetStatus,
        entries: payloadEntries,
      });

      setStatusMessage({
        type: 'success',
        text:
          targetStatus === 'SUBMITTED'
            ? 'Continuous assessment marks submitted to Chief Administrator for review & locking!'
            : 'Marks saved as draft successfully.',
      });

      await loadRosterAndMarks();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to save marks.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenCorrection = (studentId: string) => {
    const existing = marks.find((m) => m.studentId === studentId);
    if (!existing) return;
    setCorrectionModalTarget(existing);
    setProposedMark(existing.marksObtained);
    setCorrectionReason('Typographical entry error');
    setCorrectionExplanation('');
  };

  const handleSubmitCorrection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionModalTarget) return;
    setIsSubmittingCorrection(true);

    try {
      await api.requestResultCorrection({
        resultId: correctionModalTarget.id,
        originalMark: correctionModalTarget.marksObtained,
        proposedMark: Number(proposedMark),
        reason: correctionReason,
        explanation: correctionExplanation,
        teacherId,
        teacherName,
      });

      alert('Correction request submitted to Chief Administrator for review.');
      setCorrectionModalTarget(null);
    } catch (err: any) {
      alert(err.message || 'Failed to submit correction request.');
    } finally {
      setIsSubmittingCorrection(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold font-['Cinzel',serif] text-[#0F1E36] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-600" />
            <span>Continuous Assessment & Grading Console</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Roster dynamically synchronized with Central Student Database. Enter marks, generate automated CBC grades, and submit for institutional approval.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSaveMarks('DRAFT')}
            disabled={isSaving}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
          >
            <Save className="w-4 h-4 text-slate-600" />
            <span>Save Draft</span>
          </button>
          <button
            onClick={() => handleSaveMarks('SUBMITTED')}
            disabled={isSaving}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
          >
            <Send className="w-4 h-4 text-emerald-300" />
            <span>Submit for Admin Approval</span>
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

      {/* Cohort, Subject & Assessment Selectors */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
        <div>
          <label className="block font-bold text-slate-700 mb-1">Class / Cohort</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-800 font-semibold"
          >
            {assignedClasses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Assigned Subject</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-800 font-semibold"
          >
            {assignedSubjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Assessment Type</label>
          <select
            value={assessmentType}
            onChange={(e) => setAssessmentType(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-800 font-semibold"
          >
            <option value="CAT 1">CAT 1</option>
            <option value="CAT 2">CAT 2</option>
            <option value="Mid-Term Assessment">Mid-Term Assessment</option>
            <option value="End of Term Examination">End of Term Examination</option>
            <option value="Practical Project / CBC Portfolio">Practical Project / Portfolio</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block font-bold text-slate-700 mb-1">Academic Year & Term</label>
          <AcademicYearTermSelector
            selectedYear={academicYear}
            onYearChange={setAcademicYear}
            selectedTerm={term}
            onTermChange={setTerm}
            className="w-full"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Assessment Date</label>
          <button
            type="button"
            onClick={() => setIsCalendarOpen(true)}
            className="w-full border border-slate-300 hover:border-amber-500 rounded-lg px-2.5 py-1.5 bg-white text-slate-800 font-mono text-xs flex items-center justify-between transition cursor-pointer"
          >
            <span>{assessmentDate}</span>
            <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          </button>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Maximum Marks</label>
          <input
            type="number"
            min="10"
            max="100"
            value={maxMarks}
            onChange={(e) => setMaxMarks(Number(e.target.value))}
            className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono font-bold text-slate-800"
          />
        </div>
      </div>

      {/* Marks & Feedback Entry Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3 w-12">#</th>
                <th className="py-3 px-4">Student ID & Name</th>
                <th className="py-3 px-3 text-center w-28">Score (/ {maxMarks})</th>
                <th className="py-3 px-3 text-center w-24">Percent</th>
                <th className="py-3 px-3 text-center w-20">Grade</th>
                <th className="py-3 px-4">Qualitative Feedback & CBC Strengths</th>
                <th className="py-3 px-3 text-center w-28">Status</th>
                <th className="py-3 px-3 text-center w-28">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Loading student cohort roster...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No learners registered in {selectedClass}.
                  </td>
                </tr>
              ) : (
                students.map((student, idx) => {
                  const entry = entries[student.studentId] || { marksObtained: '' };
                  const score = typeof entry.marksObtained === 'number' ? entry.marksObtained : null;
                  const pct = score !== null ? Math.round((score / maxMarks) * 100) : null;
                  const grade = score !== null ? calculateGrade(score, maxMarks) : '—';
                  const isLocked = entry.status === 'LOCKED';

                  return (
                    <tr
                      key={student.id}
                      className={`hover:bg-amber-50/30 transition ${isLocked ? 'bg-slate-50/50' : ''}`}
                    >
                      <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{student.fullName}</div>
                        <div className="text-[11px] font-mono text-slate-500">
                          {student.studentId} • Adm {student.admissionNumber}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          disabled={isLocked}
                          min="0"
                          max={maxMarks}
                          value={entry.marksObtained}
                          onChange={(e) => handleScoreChange(student.studentId, e.target.value)}
                          placeholder="—"
                          className={`w-20 text-center px-2 py-1.5 border rounded-lg font-mono font-bold text-sm ${
                            isLocked
                              ? 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed'
                              : 'border-slate-300 text-[#0F1E36] focus:border-amber-500'
                          }`}
                        />
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-slate-700">
                        {pct !== null ? `${pct}%` : '—'}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-base text-amber-700">
                        {grade}
                      </td>
                      <td className="py-3 px-4 space-y-1.5 min-w-[280px]">
                        <input
                          type="text"
                          disabled={isLocked}
                          value={entry.strengths || ''}
                          onChange={(e) =>
                            handleFeedbackChange(student.studentId, 'strengths', e.target.value)
                          }
                          placeholder="Strengths: e.g. Strong problem solving"
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded disabled:bg-slate-50 disabled:text-slate-400"
                        />
                        <input
                          type="text"
                          disabled={isLocked}
                          value={entry.teacherComment || ''}
                          onChange={(e) =>
                            handleFeedbackChange(student.studentId, 'teacherComment', e.target.value)
                          }
                          placeholder="Teacher comment: e.g. Excellent work, keep it up"
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded disabled:bg-slate-50 disabled:text-slate-400"
                        />
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isLocked
                              ? 'bg-emerald-100 text-emerald-800'
                              : entry.status === 'SUBMITTED'
                              ? 'bg-blue-100 text-blue-800'
                              : entry.status === 'RETURNED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {isLocked && <Lock className="w-3 h-3 text-emerald-600" />}
                          {entry.status === 'SUBMITTED' && <Clock className="w-3 h-3 text-blue-600" />}
                          <span>{entry.status || 'NEW'}</span>
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {isLocked ? (
                          <button
                            onClick={() => handleOpenCorrection(student.studentId)}
                            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded text-[10px] font-bold transition flex items-center gap-1 mx-auto"
                            title="Request Formal Admin Correction for Locked Result"
                          >
                            <ShieldAlert className="w-3 h-3 text-amber-700" />
                            <span>Correct Mark</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400">Editable</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Request Result Correction for Locked Mark */}
      {correctionModalTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-bold text-slate-900 font-['Cinzel',serif]">
                Request Locked Result Correction
              </h3>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
              <div className="font-bold">Institutional Security Policy</div>
              <p>
                Approved assessment marks are locked to prevent tampering. Changes require Chief Administrator authorization.
              </p>
            </div>

            <form onSubmit={handleSubmitCorrection} className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div>
                  Student: <strong>{correctionModalTarget.studentName}</strong> ({correctionModalTarget.studentId})
                </div>
                <div>
                  Subject: <strong>{correctionModalTarget.subjectName}</strong> | Class: {correctionModalTarget.className}
                </div>
                <div>Current Locked Mark: <strong>{correctionModalTarget.marksObtained}</strong> / {correctionModalTarget.maxMarks}</div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Proposed New Mark (Max {correctionModalTarget.maxMarks}) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max={correctionModalTarget.maxMarks}
                  value={proposedMark}
                  onChange={(e) => setProposedMark(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold text-base text-emerald-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason Category</label>
                <select
                  value={correctionReason}
                  onChange={(e) => setCorrectionReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Typographical entry error">Typographical entry error</option>
                  <option value="Recount of exam script marks">Recount of exam script marks</option>
                  <option value="Practical rubric rescore">Practical rubric rescore</option>
                  <option value="Make-up assessment session">Make-up assessment session</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Detailed Explanation for Chief Admin *
                </label>
                <textarea
                  required
                  rows={2}
                  value={correctionExplanation}
                  onChange={(e) => setCorrectionExplanation(e.target.value)}
                  placeholder="Explain why the mark needs adjustment..."
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCorrectionModalTarget(null)}
                  className="px-3.5 py-1.5 border border-slate-300 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCorrection}
                  className="px-4 py-1.5 bg-[#0F1E36] hover:bg-amber-600 disabled:opacity-50 text-white font-bold rounded-lg transition"
                >
                  {isSubmittingCorrection ? 'Submitting...' : 'Submit Request to Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Infinite Calendar Modal */}
      <InfiniteCalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        selectedDate={assessmentDate}
        onSelectDate={(newDate) => setAssessmentDate(newDate)}
        title="Assessment Date Selector"
        subtitle="Pick any continuous assessment date across past, present, or future terms."
      />
    </div>
  );
};
