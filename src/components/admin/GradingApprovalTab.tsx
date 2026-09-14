import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { AcademicResult, ResultCorrectionRequest, SchoolClass, Subject } from '../../types';
import {
  CheckCircle2,
  Lock,
  RotateCcw,
  AlertCircle,
  Clock,
  Eye,
  CheckSquare,
  Square,
  Search,
  Filter,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

interface Props {
  classes: SchoolClass[];
  subjects: Subject[];
}

export const GradingApprovalTab: React.FC<Props> = ({ classes, subjects }) => {
  const [marks, setMarks] = useState<AcademicResult[]>([]);
  const [correctionRequests, setCorrectionRequests] = useState<ResultCorrectionRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filters
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Selection for Batch Approval
  const [selectedMarkIds, setSelectedMarkIds] = useState<string[]>([]);

  // Modal: Return for Revision
  const [returnModalTarget, setReturnModalTarget] = useState<AcademicResult | null>(null);
  const [returnReason, setReturnReason] = useState('');
  const [isReturning, setIsReturning] = useState(false);

  // Modal: Review Correction Request
  const [selectedCorrection, setSelectedCorrection] = useState<ResultCorrectionRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [isReviewingCorrection, setIsReviewingCorrection] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [marksData, correctionsData] = await Promise.all([
        api.getMarks({
          classId: selectedClass || undefined,
          subjectId: selectedSubject || undefined,
          status: statusFilter || undefined,
        }),
        api.getCorrectionRequests(),
      ]);
      setMarks(marksData);
      setCorrectionRequests(correctionsData);
      setSelectedMarkIds([]);
    } catch (err) {
      console.error('Error fetching marks data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedClass, selectedSubject, statusFilter]);

  const toggleSelectMark = (id: string) => {
    setSelectedMarkIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAllSubmitted = () => {
    const submittedIds = marks.filter((m) => m.status === 'SUBMITTED').map((m) => m.id);
    if (selectedMarkIds.length === submittedIds.length) {
      setSelectedMarkIds([]);
    } else {
      setSelectedMarkIds(submittedIds);
    }
  };

  const handleSingleApprove = async (id: string) => {
    try {
      await api.approveMark(id, 'Chief Administrator');
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to approve mark.');
    }
  };

  const handleBatchApprove = async () => {
    if (selectedMarkIds.length === 0) return;
    try {
      await api.batchApproveMarks(selectedMarkIds, 'Chief Administrator');
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to batch approve marks.');
    }
  };

  const handleReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnModalTarget || !returnReason) return;
    setIsReturning(true);
    try {
      await api.returnMark(returnModalTarget.id, returnReason, 'Chief Administrator');
      setReturnModalTarget(null);
      setReturnReason('');
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to return mark.');
    } finally {
      setIsReturning(false);
    }
  };

  const handleReviewCorrection = async (action: 'APPROVED' | 'REJECTED') => {
    if (!selectedCorrection) return;
    setIsReviewingCorrection(true);
    try {
      await api.reviewCorrectionRequest(selectedCorrection.id, {
        action,
        adminNotes,
        reviewedBy: 'Chief Administrator',
      });
      setSelectedCorrection(null);
      setAdminNotes('');
      await fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to review correction request.');
    } finally {
      setIsReviewingCorrection(false);
    }
  };

  const pendingSubmissions = marks.filter((m) => m.status === 'SUBMITTED');
  const pendingCorrections = correctionRequests.filter((c) => c.status === 'PENDING');

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold font-['Cinzel',serif] text-[#0F1E36] flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-600" />
            <span>Academic Results Review & Locking</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Institutional verification of teacher submissions. Approving marks locks them against tampering and authorizes inclusion in official consolidated report cards.
          </p>
        </div>

        {selectedMarkIds.length > 0 && (
          <button
            onClick={handleBatchApprove}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>Approve & Lock Selected ({selectedMarkIds.length})</span>
          </button>
        )}
      </div>

      {/* Pending Result Correction Requests Alert Banner */}
      {pendingCorrections.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Pending Locked Result Correction Requests ({pendingCorrections.length})
              </h3>
            </div>
          </div>
          <p className="text-xs text-amber-800">
            Subject teachers cannot silently edit locked marks. Formal revision requests require Chief Administrator approval before modifying student records.
          </p>

          <div className="grid md:grid-cols-2 gap-3">
            {pendingCorrections.map((req) => (
              <div
                key={req.id}
                className="p-3 bg-white border border-amber-200 rounded-xl shadow-sm text-xs space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-slate-900">
                      {req.studentName} ({req.studentId})
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Subject: <strong>{req.subjectName}</strong> | Class: {req.className}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">
                    Pending Review
                  </span>
                </div>

                <div className="p-2 bg-slate-50 rounded-lg flex items-center justify-between font-mono text-xs">
                  <div>
                    <span className="text-slate-500 font-sans">Original Mark:</span>{' '}
                    <span className="font-bold text-slate-800">{req.originalMark}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
                  <div>
                    <span className="text-slate-500 font-sans">Proposed Mark:</span>{' '}
                    <span className="font-bold text-emerald-700">{req.proposedMark}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 bg-amber-50/50 p-2 rounded border border-amber-100">
                  <span className="font-bold text-slate-700">Reason:</span> {req.reason} —{' '}
                  <span className="italic text-slate-600">"{req.explanation}"</span>
                  <div className="text-[10px] text-slate-400 mt-1">Submitted by: {req.teacherName}</div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => {
                      setSelectedCorrection(req);
                      setAdminNotes('');
                    }}
                    className="w-full py-1.5 bg-[#0F1E36] hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition"
                  >
                    Review & Decide
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Selection Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:border-amber-500"
          >
            <option value="">All Cohorts</option>
            {classes.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:border-amber-500"
          >
            <option value="">All Subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:border-amber-500"
          >
            <option value="">All Statuses</option>
            <option value="SUBMITTED">Submitted for Review</option>
            <option value="LOCKED">Approved & Locked</option>
            <option value="DRAFT">Draft</option>
            <option value="RETURNED">Returned for Revision</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          {pendingSubmissions.length > 0 && (
            <button
              onClick={toggleSelectAllSubmitted}
              className="text-xs font-semibold text-slate-700 hover:text-[#0F1E36] flex items-center gap-1.5"
            >
              {selectedMarkIds.length === pendingSubmissions.length ? (
                <CheckSquare className="w-4 h-4 text-amber-600" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
              <span>Select All Pending ({pendingSubmissions.length})</span>
            </button>
          )}

          <button
            onClick={fetchData}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 rounded-lg transition"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Marks Review Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3 text-center w-10">Select</th>
                <th className="py-3 px-4">Student ID & Name</th>
                <th className="py-3 px-4">Class & Subject</th>
                <th className="py-3 px-4">Assessment Type</th>
                <th className="py-3 px-4 text-center">Score / Max</th>
                <th className="py-3 px-4 text-center">Grade</th>
                <th className="py-3 px-4">Teacher Feedback</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    Loading submitted marks...
                  </td>
                </tr>
              ) : marks.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    No marks match the active filter criteria.
                  </td>
                </tr>
              ) : (
                marks.map((m) => {
                  const isSelected = selectedMarkIds.includes(m.id);
                  const isSubmitted = m.status === 'SUBMITTED';

                  return (
                    <tr
                      key={m.id}
                      className={`hover:bg-amber-50/30 transition ${
                        isSelected ? 'bg-amber-50/50' : ''
                      }`}
                    >
                      <td className="py-3 px-3 text-center">
                        {isSubmitted && (
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectMark(m.id)}
                            className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                          />
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{m.studentName}</div>
                        <div className="text-[11px] font-mono text-slate-500">{m.studentId}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{m.subjectName}</div>
                        <div className="text-[11px] text-slate-500">{m.className}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {m.assessmentType}
                        <div className="text-[10px] text-slate-400">{m.term}</div>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-[#0F1E36]">
                        {m.marksObtained} / {m.maxMarks}
                        <span className="block text-[10px] text-slate-500 font-sans">
                          ({m.percentage}%)
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-amber-700">
                        {m.calculatedGrade}
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                        {m.feedback?.teacherComment || m.feedback?.strengths || '—'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            m.status === 'LOCKED'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : m.status === 'SUBMITTED'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : m.status === 'RETURNED'
                              ? 'bg-red-50 text-red-800 border border-red-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {m.status === 'LOCKED' && <Lock className="w-3 h-3 text-emerald-600" />}
                          {m.status === 'SUBMITTED' && <Clock className="w-3 h-3 text-blue-600" />}
                          {m.status === 'RETURNED' && <RotateCcw className="w-3 h-3 text-red-600" />}
                          <span>{m.status}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {isSubmitted && (
                            <>
                              <button
                                onClick={() => handleSingleApprove(m.id)}
                                title="Approve & Lock Mark"
                                className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setReturnModalTarget(m);
                                  setReturnReason('');
                                }}
                                title="Return for Teacher Revision"
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                              >
                                <RotateCcw className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {m.status === 'LOCKED' && (
                            <span className="text-[10px] text-slate-400 italic">Locked</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Return Mark with Reason */}
      {returnModalTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <RotateCcw className="w-5 h-5 text-red-600" />
              <h3 className="text-base font-bold text-slate-900 font-['Cinzel',serif]">
                Return Mark for Revision
              </h3>
            </div>

            <p className="text-xs text-slate-600">
              Specify the revision reason for <strong>{returnModalTarget.studentName}</strong>'s mark in{' '}
              <strong>{returnModalTarget.subjectName}</strong>. The subject teacher will be notified to revise and resubmit.
            </p>

            <form onSubmit={handleReturnSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Revision Feedback / Reason *
                </label>
                <textarea
                  required
                  rows={3}
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  placeholder="e.g. Please verify practical assessment rubric score against lab test sheet."
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-red-500 text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReturnModalTarget(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isReturning}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition"
                >
                  {isReturning ? 'Returning...' : 'Return for Revision'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Review Locked Mark Correction Request */}
      {selectedCorrection && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-bold text-slate-900 font-['Cinzel',serif]">
                Review Correction Request
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div>
                  Student: <strong>{selectedCorrection.studentName}</strong> ({selectedCorrection.studentId})
                </div>
                <div>
                  Subject: <strong>{selectedCorrection.subjectName}</strong> | Class: {selectedCorrection.className}
                </div>
                <div>Teacher: {selectedCorrection.teacherName}</div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-around font-mono text-xs">
                <div>
                  <span className="text-slate-500 font-sans">Current Locked Mark:</span>{' '}
                  <span className="font-bold text-slate-800">{selectedCorrection.originalMark}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-600" />
                <div>
                  <span className="text-slate-500 font-sans">Proposed New Mark:</span>{' '}
                  <span className="font-bold text-emerald-700">{selectedCorrection.proposedMark}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700">Teacher's Explanation:</span>
                <p className="p-2.5 bg-slate-50 rounded border border-slate-200 italic text-slate-600 mt-1">
                  "{selectedCorrection.explanation}"
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Chief Administrator Decision Notes
                </label>
                <input
                  type="text"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Cross-checked with physical examination scripts."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedCorrection(null)}
                className="px-3 py-2 border border-slate-300 text-slate-700 text-xs rounded-xl font-semibold"
              >
                Close
              </button>
              <button
                type="button"
                disabled={isReviewingCorrection}
                onClick={() => handleReviewCorrection('REJECTED')}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition"
              >
                Reject Request
              </button>
              <button
                type="button"
                disabled={isReviewingCorrection}
                onClick={() => handleReviewCorrection('APPROVED')}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Approve & Update Mark</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
